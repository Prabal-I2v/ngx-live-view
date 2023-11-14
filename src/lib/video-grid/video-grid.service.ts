import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { ViewListModel } from '../models/ViewListModel';

@Injectable({
  providedIn: 'root',
})
export class VideoGridService {
  // Observable string sources
  private videoGridResizer = new Subject<any>();
  selectedViewSubject = new Subject<ViewListModel>();
  playVideoSubject = new Subject<any>();
  playVideoByDropSubject = new Subject<any>();
  removeAllVideoSubject = new Subject<any>();
  fullScreenGridSubject = new Subject<boolean>();
  changeVideoFitSubject = new Subject<string>();
  stichVideoSubject = new Subject<any>();
  gridRightClickMenuSubject = new Subject<any>();
  removeVideoSubject = new Subject<any>();
  changeStreamSubject = new Subject<any>();
  // Observable string streams

  IsDetailsHiddenFromGrid = false;
  
  videoGridResizer$ = this.videoGridResizer.asObservable();
  constructor() {}
  currentVideoFit: string = 'original';
  videoFit = [
    { name: 'Fill', value: 'fill' },
    { name: 'Fit', value: 'scale-down' },
    { name: 'Stretch', value: 'cover' },
    { name: 'Original', value: 'contain' },
  ];
  _ViewList: ViewListModel[] = [
    {
      id: 1,
      Text: '1x1',
      heading: '1 camera',
      Rows: 1,
      Cols: 1,
    },
    {
      id: 2,
      Text: '2x1',
      heading: '2 cameras',
      Rows: 2,
      Cols: 1,
    },
    {
      id: 3,
      Text: '1+2',
      heading: '3 cameras',
      Rows: 2,
      Cols: 2,
      hasSpecial: true,
      SpecialElement: 0,
      SEWidth: 2,
      SEHeight: 1,
      NumberofTiles: 3,
    },
    {
      id: 4,
      Text: '2x2',
      heading: '4 cameras',
      Rows: 2,
      Cols: 2,
    },
    {
      id: 5,
      Text: '1+5',
      heading: '6 cameras',
      Rows: 3,
      Cols: 3,
      hasSpecial: true,
      SpecialElement: 0,
      SEWidth: 2,
      SEHeight: 2,
      NumberofTiles: 6,
    },
    {
      id: 6,
      Text: '3x3',
      heading: '9 cameras',
      Rows: 3,
      Cols: 3,
    },
    {
      id: 7,
      Text: '1+7',
      heading: '8 cameras',
      Rows: 4,
      Cols: 4,
      hasSpecial: true,
      SpecialElement: 0,
      SEWidth: 3,
      SEHeight: 3,
      NumberofTiles: 8,
    },
    {
      id: 8,
      Text: '4x4',
      heading: '16 cameras',
      Rows: 4,
      Cols: 4,
    },
    {
      id: 9,
      Text: '1+2(2)',
      heading: '3 cameras',
      Rows: 2,
      Cols: 2,
      hasSpecial: true,
      SpecialElement: 0,
      SEWidth: 1,
      SEHeight: 2,
      NumberofTiles: 3,
    }
  ];
  showViewList: boolean = false;

  SelectedView: any = this._ViewList[3];

  resizer() {
    this.videoGridResizer.next(1);
  }

  playVideo(inputPlayVideo: any, id?: number) {
    if (id !== undefined) {
      this.playVideoByDropSubject.next({resource: inputPlayVideo,id: id });
    }
    else {
      this.playVideoSubject.next(inputPlayVideo);
    }
  }

  removeAllVideo() {
    this.removeAllVideoSubject.next(true);
  }

  fullScreenGrid(isFullScreen: boolean) {
    this.fullScreenGridSubject.next(isFullScreen);
  }

  changeVideoFit(fit: string) {
    this.changeVideoFitSubject.next(fit);
  }

  toggleStichVideo() {
    this.IsDetailsHiddenFromGrid = !this.IsDetailsHiddenFromGrid;
    this.stichVideoSubject.next(this.IsDetailsHiddenFromGrid);
  }

  removeVideoFromGrid(id: number) {
    this.removeVideoSubject.next(id);
  }

  changeVideoFitById(fit: any, id: string) {
    // find the element video with id id="videoContainer_+'id'+_video"
    try {
      var video = document.getElementById('videoContainer_' + id + '_video');
      if (video) {
        video.style.objectFit = fit;
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  changeStream(id: number, stream: any) {
    this.changeStreamSubject.next({ id: id, stream: stream });
  }

}
