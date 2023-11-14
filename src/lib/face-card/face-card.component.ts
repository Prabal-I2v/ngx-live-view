import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-face-card',
  templateUrl: './face-card.component.html',
  styleUrls: ['./face-card.component.css'],
})
export class FaceCardComponent implements OnInit {
  @Input() eventObj: any;
  constructor() {}

  ngOnInit(): void {
    console.log('FRS Grid Active');
  }
}
