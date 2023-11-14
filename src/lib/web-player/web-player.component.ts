import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';

declare var $: any;
declare var I2vSdk: any;

@Component({
  selector: 'lib-app-web-player',
  templateUrl: './web-player.component.html',
  styleUrls: ['./web-player.component.scss'],
})
export class WebPlayerComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @Input() idx: any = 0; //Unique Id
  @Input() playbackMode: string = 'LIVE';
  @Input() resource: any;
  @Input() fill: boolean = false;
  isDahua: boolean = false;
  @Input() startTime: any;
  @Input() streamType: number = 0;
  @Input() analyticType: string  = '';
  @Output() VideoStarted: EventEmitter<any> = new EventEmitter<any>();

  videoPlayerInstance: any;
  playerIp: string = 'localhost';
  //playerServerIp: string = "localhost";
  playerServerPort: number = 8890;
  isLoading: boolean = true;
  sdk: any;
  isVlc: boolean = false;
  url: string = '';

  @Input() playerServerIp: string = '';
  @Input() streamerIp: string = '';

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.isLoading = true;
    if (
      this.resource.dvrId &&
      this.resource.dvr.discriminator == 'DhauaDVR' &&
      navigator.userAgent.includes('UBrowser')
    ) {
      this.isDahua = true;
      this.isLoading = false;
      this.changeDetectorRef.markForCheck();
      return;
    }

    if (navigator.userAgent.includes('UBrowser')) {
      // If the browser is UCBrowser then use VLC Player
      if (this.playbackMode == 'LIVE') {
      }
      this.isVlc = true;
      this.isLoading = false;
      this.changeDetectorRef.markForCheck();
      return;
    }
    if (!this.idx) {
      this.idx = this.resource.id;
    }
    var ip: string = '';
    if (!this.playerServerIp || this.playerServerIp == '') {
      var currentUrl = window.location.href;
      var startIndex = currentUrl.indexOf('//');
      var endIndex = currentUrl.lastIndexOf(':');
      if (!this.streamerIp || this.streamerIp == '') {
        this.streamerIp = currentUrl.substring(startIndex + 2, endIndex);
      }
      this.playerServerIp = currentUrl.substring(startIndex + 2, endIndex);
    }
    var UseSecureConnection = false;
    this.sdk = new I2vSdk(
      this.streamerIp,
      this.playerServerIp,
      UseSecureConnection
    );
    this.changeDetectorRef.markForCheck();
  }

  ngAfterViewInit(): void {
    this.changeAspectRatio();
    this.playVideo();
  }

  ngOnDestroy() {
    if (this.videoPlayerInstance) {
      this.videoPlayerInstance.stop();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if (propName == 'startTime' || propName == 'streamType') {
        if (this.videoPlayerInstance) {
          this.videoPlayerInstance.stop();
          if (this.playbackMode == 'REC') {
            this.idx = this.idx + this.startTime.valueOf();
          } else {
            //this.idx = this.resource.id;

          }
          $(document).ready(() => {
            this.playVideo();
          });
        }
      } else if (propName == 'fill') {
        this.changeAspectRatio();
      }
    }
  }

  /**
   * If the image tag exists, then if the fill property is true, set the height and width to 100%,
   * otherwise set the height and width to auto.
   */
  changeAspectRatio() {
    var imageTag = $('#' + this.idx + '_img');
    if (imageTag) {
      if (this.fill) {
        imageTag.css('height', '100%');
        imageTag.css('width', '100%');
      } else {
        imageTag.css('height', 'auto');
        imageTag.css('width', 'auto');
      }
    }
  }

  /**
  Used to play Video
   */
  playVideo() {
    var transcode = '0';
    var ctrlInputRate = '0';

    if ('' + this.resource.useTranscoding == 'true') {
      transcode = '1';
    }

    if (this.playbackMode == 'REC') {
      transcode = '1';
      if (this.resource.externalServerId) {
        ctrlInputRate = '1';
      }
    }

    if (
      this.resource.dvrId &&
      (this.resource.dvr.discriminator == 'DhauaDVR' ||
        this.resource.dvr.discriminator == 'SparshDVR')
    ) {
      ctrlInputRate = '1';
    }
    if (!this.startTime) {
      this.startTime = '0';
    } else {
      this.startTime = '' + this.startTime.valueOf() / 1000;
    }
    if (this.playbackMode == 'REC') {
    } else {
      this.videoPlayerInstance = this.sdk.GetLivePlayer(
        'videoContainer_' + this.idx,
        this.resource.id,
        this.streamType,
        this.analyticType
      );
    }

    //this.videoPlayerInstance = this.sdk.GetPlayer('videoContainer_' + this.idx, this.resource.id, this.playbackMode == "REC" ? "PlayBack" : "Live", this.streamType, transcode, ctrlInputRate, this.startTime);
    //set Error callback for play method
    this.videoPlayerInstance.setErrorCallback((err: string) => {
      if (err == 'Video_Started') {
        this.VideoStarted.emit();
        console.log(err);
      }
    });

    //set retrying callback
    this.videoPlayerInstance.setRetryingCallback(function () {
      //console.log("disconnected, retrying to connect!!");
    });

    //call play method
    this.videoPlayerInstance.play();
    this.isLoading = false;
  }

  /**
   * "If the user doesn't have the player installed, show a link to download it."
   * @param {string} message - string - the message to display
   */
  showErrorMessage(message: string) {
    var ip: string = '';
    if (!this.playerServerIp || this.playerServerIp == '') {
      var currentUrl = window.location.href;
      var startIndex = currentUrl.indexOf('//');
      var endIndex = currentUrl.lastIndexOf(':');
      ip = currentUrl.substring(startIndex + 2, endIndex);
    } else {
      ip = this.playerServerIp;
    }
    var file_path =
      'http://' + ip + ':' + this.playerServerPort + '/setup/i2v_player.msi';
    var spanElement = document.getElementById('errorMessage' + this.idx);
    if (!spanElement) {
      var span = document.createElement('a');
      span.innerHTML = message;
      span.style.color = 'White';
      span.style.position = 'absolute';
      span.style.fontSize = '16px';
      span.id = 'errorMessage' + this.idx;
      span.href = file_path;
      span.download = file_path.substr(file_path.lastIndexOf('/') + 1);
      var element = document.getElementById('videoContainer_' + this.idx);
      element!.style.background = 'black';
      element!.style.position = 'relative';
      element!.appendChild(span);
    } else {
      spanElement.innerHTML = message;
    }
    this.changeDetectorRef.markForCheck();
  }

  /**
   * This function returns a base64 encoded string of the current frame of the video.
   * @returns A base64 encoded string of the current frame of the video.
   */
  getSnapshotInBase64Format() {
    return this.videoPlayerInstance.getBase64SnapshotUrl();
  }
}
