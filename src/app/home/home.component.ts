import { Component, OnInit } from '@angular/core';
import {GlobalService} from '../global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  name = "";
  score = 360;
  link = "";

  constructor(public gs: GlobalService) {
  	this.gs.initDefaultPlayer();
  	this.name = localStorage.name;
  	this.score = localStorage.score;
  	if(localStorage.link!==undefined) {
  		this.link = localStorage.link;
  	}
  }

  ngOnInit(): void {

  }

  save() {
  	console.log(this.name)
  	this.gs.saveName(this.name);
  }

  generateLink() {
  	var route = Math.floor(Math.random()*99999);
  	this.link = location.href+"play/"+route;
  	localStorage.link = this.link;
  }

  refresh() {
  	this.gs.saveScore(0);
  	this.score = 0;
  }
}
