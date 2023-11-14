import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { CustomOption } from '../models/IOption';
import { NgxLiveViewService } from '../ngx-live-view.service';
import { WebPlayerComponent } from '../web-player/web-player.component';
import { VideoGridService } from '../video-grid/video-grid.service';

declare var document: any;
@Component({
  selector: 'lib-i2v-video-grid',
  templateUrl: './i2v-video-grid.component.html',
  styleUrls: ['./i2v-video-grid.component.css'],
})
export class I2vVideoGridComponent implements AfterViewInit {
  @Input() playerServerIp: string = '';
  @Input() streamerIp: string = '';
  @Input() idx: any = 0;
  @Input() resourceId: any;
  @Input() resource: any;
  @Input() playbackMode: string = 'LIVE'; // "REC" or "LIVE"
  @Input() savedPlayerName: string = '';
  @Input() time_out: any;
  @Input() showHeader: boolean = true;
  @Input() attachedEvent: any;
  @Input() selected: boolean = false;
  @Input() color: any;
  @Input() info: any;
  @Input() timeRange: any; // format: timerange = {"startTime": startTime, "endTime": endTime} // Case Sensitive**
  @Input() audioOnly: boolean = false;
  @Input() options: CustomOption[] = [];
  @Input() streams: any = [];
  @Output() VideoStartedFromi2vVideoGrid: EventEmitter<any> =
    new EventEmitter<any>();
  @Output() CloseLiveFeed: EventEmitter<any> = new EventEmitter<any>();
  @Output() playBackModeChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() playerNameChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() VerifyEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() FullScreen: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger =
    {} as MatMenuTrigger;
  @ViewChild('webplayer') webPlayer: WebPlayerComponent =
    {} as WebPlayerComponent;

  // Internal Properties

  isLoading: boolean = false;
  resourceNotFoundMessage: string = 'Resource Not Found';
  isPtzControl: boolean = true;
  timerReference: any;
  fill: boolean = false;
  //stream: string = 'direct_main_stream';
  isFullScreen: boolean = false;
  eventVerified: boolean = false;
  isPtzRightAvailable: boolean = true;
  streamType: number = 0;
  analyticType: string = '';
  menuTopLeftPosition = { x: '0', y: '0' };
  private _unsubscribeAll: Subject<any> = new Subject();
  videoFit = [
    { name: 'Fill', value: 'fill' },
    { name: 'Fit', value: 'scale-down' },
    { name: 'Stretch', value: 'cover' },
    { name: 'Original', value: 'contain' },
  ];
  stream_default = [{ name: 'Direct Main Stream', streamType: 0, analyticType: "0" }]
  streams_all = [
    { name: 'Analytic Stream basic', streamType: 1,  analyticType: "basic" }
  ]
  showoptions: boolean = false;
  ip: string = '';
  constructor(private _NgxLiveViewService: NgxLiveViewService, private changeDetectorRef: ChangeDetectorRef, private videoGridService: VideoGridService) { 
    document.addEventListener(
      'fullscreenchange',
      this.fullscreenchanged.bind(this)
    );
    document.addEventListener(
      'webkitfullscreenchange',
      this.fullscreenchanged.bind(this)
    );
    document.addEventListener(
      'mozfullscreenchange',
      this.fullscreenchanged.bind(this)
    );
    document.addEventListener(
      'MSFullscreenChange',
      this.fullscreenchanged.bind(this)
    );
    this.videoGridService.changeStreamSubject.subscribe((data: any) => {
      if (data && data.id == this.idx) {
        this.streamType = data.stream
        //this.analyticType = data.stream
      }
    });
  }

  ngAfterViewInit() {
    console.log('VideoStartedFromi2vVideoGrid');
    // add new input stream to the list
    this.streams_all = this.streams_all.concat(this.streams);
    this.ip = this.resource.ip ? this.resource.ip : this.resource.data.ip
    this.playbackMode = this.playbackMode ? this.playbackMode : 'LIVE';
  }

  /**
   * When the user clicks the close button, emit an event to the parent component, and pass the index of
   * the video panel that was closed.
   */
  public closeVideoPanel(): void {
    console.log('CloseLiveFeed from i2v-video-grid');
    this.CloseLiveFeed.emit(this.idx);
  }

  /**
   * If the element is not in fullscreen mode, then request fullscreen mode. If the element is in
   * fullscreen mode, then exit fullscreen mode.
   */
  async fullscreen() {
    var elmnt: any;
    elmnt = document.getElementById('outer' + this.idx);
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (elmnt.requestFullscreen) {
        await elmnt.requestFullscreen();
      } else if (elmnt.webkitRequestFullscreen) {
        await elmnt.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitFullscreenElement) {
        await document.exitFullscreen();
      }
    }
  }

  /**
   * The function is called from the web player component and it emits an event to the parent
   * component.
   */
  onVideoStartedFromWebPlayer(): void {
    this.VideoStartedFromi2vVideoGrid.emit(this.idx);
  }

  /**
   * When the live button is clicked, the start time is set to undefined, the playback mode is set to
   * LIVE, the attached event is set to undefined, and the playback mode change event is emitted.
   */
  onLiveButtonClicked() {
    this.timeRange.startTime = undefined;
    this.playbackMode = 'LIVE';
    this.attachedEvent = undefined;
    this.playBackModeChange.emit({ id: this.idx, playbackMode: 'LIVE' });
  }

  /**
   * Method called when the user click with the right button
   * @param event MouseEvent, it contains the coordinates
   * @param item Data passed
   */
  onRightClick(event: MouseEvent, item: any) {
    // preventDefault avoids to show the visualization of the right-click menu of the browser
    event.preventDefault();
    this.videoGridService.gridRightClickMenuSubject.next({ event: event, item: item });
    // we record the mouse position in our object
    // this.menuTopLeftPosition.x = event.clientX + 'px';
    // this.menuTopLeftPosition.y = event.clientY + 'px';

    // // we open the menu
    // // we pass to the menu the information about our object
    // this.matMenuTrigger.menuData = { item: item };

    // // we open the menu
    // this.matMenuTrigger.openMenu();
  }

  /**
   * When the user changes the video fit, find the video element and change the style.objectFit
   * property to the new value.
   * @param {any} event - the event that was triggered
   * @param {string} id - the id of the video
   */
  onVideoFitChanged(event: any, id: string) {
    console.table({
      event: event,
      id: id,
    });
    // find the element video with id id="videoContainer_+'id'+_video"
    var video = document.getElementById('videoContainer_' + id + '_video');
    if (video) {
      video.style.objectFit = event;
    }
  }

/**
   * When the user changes the stream, pass it to weplayer component and emit
   * property to the new value.
   * @param {any} event - the event that was triggered
   * @param {string} id - the id of the video
   */
  onStreamChanged(event: any, id: string) {
    // change stream type
    this.streamType = event.streamType;
    this.analyticType = event.analyticType;
    this._NgxLiveViewService.notificationemittor.next({
      source: 'Video-grid',
      message: "StreamChanged",
      event: { id: this.idx, streamType: event.streamType, analyticType: event.analyticType }
    });
  }

  /**
   * It takes a snapshot of the video element and saves it as a png file.
   * @param {number} [id] - the id of the video element
   */
  async clickSnapShot(id?: number) {
    id = id || this.idx;
    const canvasElement = <HTMLCanvasElement>document.createElement('CANVAS');
    const ele = document.getElementById('outer' + id);

    const video = ele.getElementsByTagName('VIDEO')[0];

    const context = canvasElement.getContext('2d');
    let w: number, h: number, ratio: number;
    ratio = video.videoWidth / video.videoHeight;
    w = video.videoWidth - 100;
    h = w / ratio;
    canvasElement.width = w;
    canvasElement.height = h;
    context!.fillRect(0, 0, w, h);
    context!.drawImage(video, 0, 0, w, h);
    const link = document.createElement('a');

    link.setAttribute('download', 'snapshot' + '.' + 'png');
    const dataURL = canvasElement.toDataURL();
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
  }

  /**
   * The function is called when the fullscreenchange event is fired. It toggles the value of the
   * isFullScreen property
   */
  fullscreenchanged() {
    this.isFullScreen = !this.isFullScreen;
  }

  /**
   * This function is called by the I2VVideoGrid component to pass a callback function to the
   * ngx-live-view component.
   * @param {any} callback - The callback function that will be called when the user clicks on a video.
   */
  i2vfunctionCallback(callback: any): void {
    //this.FunctionClick.emit({callback: callback, id: this.idx, resourceId : this.resourceId, resource: this.resource});
    this._NgxLiveViewService.notificationemittor.next({
      source: 'Video-grid',
      message: callback,
      event: {
        id: this.idx,
        resourceId: this.resourceId,
        resource: this.resource,
      },
    });
  }

  /**
   * Used to hide option if no. of option increases, If showoptions is true, then set it to false, and if showoptions is false, then set it to true.
   */
  toggleshowoptions() {
    this.showoptions = !this.showoptions;
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   // for resource change
  //   if (changes.resource) {
  //     console.log("old resource value: ", changes.resource.previousValue, "new resource value: ", changes.resource.currentValue)
  //     this.resource = changes.resource.currentValue;
  //     // change detection for resource
  //     this.changeDetectorRef.detectChanges();
  //   }
  // }
}
