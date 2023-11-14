import { Injectable, Output, EventEmitter, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationModel } from './models/NotificationModel';

export class NgxLiveViewService{
  videoelementSubject: Subject<any> = new Subject<any>();
  eventsCards: Subject<any> = new Subject<any>();
  theme : string;
  notificationemittor: EventEmitter<NotificationModel> =
    new EventEmitter<any>();

    
  constructor() {
    if(localStorage.getItem('theme') != "undefined")
    {
      this.theme = localStorage.getItem('theme');
    }
    else
    {
      this.theme = "light";
    }
  }


  /**
   * The above function is used to pass the video element to the videoGrid component.
   * @param {any} inputPlayVideo - This is the video object that is passed to the service from the
   * component.
   */
  playVideo(inputPlayVideo: any) {
    //console.log("In Service : " , inputPlayVideo)
    this.videoelementSubject.next(inputPlayVideo);
  }

  setTheme(theme: string) {
      this.theme = theme;
  }
}
