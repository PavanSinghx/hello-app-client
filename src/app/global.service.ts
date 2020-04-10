import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  name = "";
  points = 0;

  initDefaultPlayer() {
  	if(localStorage.name === undefined) {
  		localStorage.name = "Player "+Math.floor(Math.random()*100);
  	}
  	if(localStorage.score === undefined) {
  		localStorage.score = 0;
  	}
  }

  saveName(name) {
    //this.initDefaultPlayer();
  	localStorage.name = name;
  }

  saveScore(score) {
    this.initDefaultPlayer();
  	localStorage.score = parseInt(score);
  }

  win() {
    this.initDefaultPlayer();
    localStorage.score = parseInt(localStorage.score) + 5;
  }
}
