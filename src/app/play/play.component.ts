import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../global.service';

import * as io from 'socket.io-client';

declare var require;

const { Howl, Howler } = require('howler');

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit {
  socket = io.connect('https://intense-fortress-91660.herokuapp.com/pool');
  //io.connect('http://localhost:3000/pool');

  canPlay = false;

  questionList = [];

  userList = [];

  answerLock = false;

  currentClip = null;

  src = null;

  audio = new Audio();


  constructor(private route: ActivatedRoute, public gs: GlobalService) {
    this.socket.on('updateUserList', (list) => {
      this.compileUserList(list);
    });

    this.socket.on('updateEvent', (list) => {
      this.compileQuestionList(list);
    });
  }

  compileUserList(list) {
    if (list == undefined || list.length < 1) {
      return;
    }

    let outerList = [];
    let innerList = [];

    for (var i = 0; i < list.length; i++) {
      if (i % 4 != 0 || i == 0) {
        innerList.push(list[i]);
      } else {
        outerList.push(innerList);
        innerList = [];
        innerList.push(list[i]);
      }
    }

    if (innerList.length > 0) {
      outerList.push(innerList);
    }

    this.userList = outerList;
  }

  resetQuestionLock() {
    if (this.currentClip != null) {
      this.currentClip.stop();
      this.canPlay = true;
    }

    this.answerLock = false;
  }

  setMedia(clip) {
    var sound = new Howl({
      src: [clip],
    });
    sound.on('load', () => {
      console.log('LOADED CLIP ' + clip);
      this.currentClip = sound;
      this.resetQuestionLock();
    });
  }

  compileQuestionList(list) {
    if (list.clip != null && list.clip.length > 10) {
      console.log(list);
      this.canPlay = true;
	  //this.setMedia(list.clip);
	  this.updateAudio("http://studio228.com/hello/clips/"+list.clip);
	  this.answerLock = false;
    }

    let questions = list.questions;
    this.questionList = [];

    if (questions === undefined || questions.length != 4) {
      return;
    }

    for (var item in questions) {
      questions[item]['color'] = 'primary';
      this.questionList.push(questions[item]);
    }

    //this.resetQuestionLock();
  }

  answer(item) {
    if (this.answerLock) {
      return;
    } else {
      //this.canPlay = false;
      this.answerLock = true;
    }

    for (var i = 0; i < this.questionList.length; ++i) {
      if (
        item.name == this.questionList[i].name &&
        !this.questionList[i].isCorrect
      ) {
        this.questionList[i].color = 'warn';
      } else if (
        item.name == this.questionList[i].name &&
        this.questionList[i].isCorrect
      ) {
        this.questionList[i].color = 'success';
      }
    }

    if (item.isCorrect) {
      this.gs.win();
    }

    setTimeout(() => {
      this.socket.emit('answer', { pts: localStorage.score });
    }, 3000);
  }

  play() {
    console.log('DWWDWDWD');

    this.playAudio();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((url) => {
      let id = url['params']['id'];

      if (id !== undefined && id.length > 1) {
        this.initSocket(id);
      }
    });
  }

  initSocket(id) {
    this.gs.initDefaultPlayer();

    let name = localStorage.name;

    if (name > 7) {
      name = name.substr(0, 7) + '..';
    }

    var player = {
      pool: id,
      user: { name: name, pts: localStorage.score },
    };

    this.socket.emit('joinRoom', player);
  }

  playAudio() {
    if (this.audio == null) {
      return;
    }

    try {
      this.audio.load();
      this.audio.play();
    } catch {}
  }
  pauseAudio() {
    if (this.audio == null) {
      return;
	}
	
    try {
	  this.audio.pause();
    } catch {}
  }
  updateAudio(src) {
	console.log(src);
	this.audio.src = src;
  }
}
