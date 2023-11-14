import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { GridComponent } from '../grid/grid.component';
import { NgxLiveViewService } from '../ngx-live-view.service';
import { CustomOption } from '../models/IOption';

declare var $: any;
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'lib-video-grid',
  templateUrl: './video-grid.component.html',
  styleUrls: ['./video-grid.component.css'],
})
export class VideoGridComponent implements OnInit, AfterViewInit {
  @Input() theme: string = 'light';
  @Input() inputPlayVideo: any;
  @Input() options: CustomOption[] = [];
  @Input() ViewList: any[] = [];
  @Input() gridMode: string = 'general';
  @Input() playerServerIp: string = '';
  @Input() streamerIp: string = '';
  @Input() playDuplicate: boolean = false;
  @Input() streams: any = [];
  @Output() VideoStarted: EventEmitter<any> = new EventEmitter<any>();
  @Output() ClearGridEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() VideoClosed: EventEmitter<any> = new EventEmitter<any>();
  @Output() FunctionClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() DimensionChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('spring') springTemplate = {} as TemplateRef<any>;
  @ViewChild('appGrid') appGrid: GridComponent = {} as GridComponent;

  //Internal Properties

  showViewList: boolean = false;
  gridSubject: Subject<any> = new Subject<any>();
  eventDataSubject: Subject<any> = new Subject<any>();
  selfheight: number = 0;
  selfwidth: number = 0;
  optionsHeight: number = 0;


  ThemeScheme: any = {
    dark: {
      background: '#303030',
      border: 'rgba(255,255,255,.2)',
      color: '#fff',
    },
    light: {
      background: '#fff',
      border: 'black',
      color: '#000',
    },
  };

  borderColor = 'rgba(255,255,255,.2)';
  //SelectedView: any = this._ViewList[3];
  searchText: string = '';
  search: boolean = false;
  Rows: number = 2;
  Cols: number = 2;
  width: number = 0;
  numbers: number[] = [1, 2, 3, 4];
  cameras: any[] = [];

  constructor(
    private _NgxLiveViewService: NgxLiveViewService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // this._NgxLiveViewService.videoelementSubject.subscribe(data => {
    //   if (this.gridMode == 'general') {
    //     console.log(data);

    //     /* Checking if the data.parentNode is null or undefined. If it is, it will call the play method
    //    with the data object. If it is not null or undefined, it will call the play method with the
    //    data.nodeData object. */

    //     if (data.parentNode == null || data.parentNode == undefined) {
    //       this.play(
    //         data,
    //         'LIVE',
    //         data.eventObject,
    //         data?.color,
    //         data?.timeRange,
    //         data?.byAction
    //       );
    //     } else {
    //       this.play(
    //         data.nodeData,
    //         'LIVE',
    //         data.nodeData.eventObject,
    //         data.nodeData?.color,
    //         data.nodeData?.timeRange,
    //         data.nodeData?.byAction,
    //         data.parentNode
    //       );
    //     }
    //   }
    // });

    // this._ViewList = this._ViewList.concat(this.ViewList);

    // this._NgxLiveViewService.eventsCards.subscribe(data => {
    //   if (this.gridMode == 'FRS') {
    //     if (data == null || data == undefined) {
    //       this.fill(data);
    //     } else {
    //       this.fill(data);
    //     }
    //   }
    // });
    // this._videoGridService.videoGridResizer$.subscribe(() => {
    //   this.resizer();
    // });

  }

  /**
   * If the theme is dark, change it to light, otherwise change it to dark
   */
  ChangeTheme() {
    this.theme = this.theme == 'dark' ? 'light' : 'dark';
    this.borderColor = this.ThemeScheme[this.theme].border;
  }

  /**
   * The function is called when the user clicks the Clear Grid button. The function emits an event to
   * the parent component. The parent component then calls the clearGrid() function in the child
   * component
   */
  onClearGrid() {
    this.ClearGridEvent.emit();
  }


  /**
   * When an element is removed from the grid, the inputPlayVideo variable is set to undefined and the
   * onVideoClosed event is emitted.
   * @param {any} element - any - the element that was removed
   */
  onElementRemovedFromGrid(element: any) {
    console.log(element);
    //console.log('onElementRemovedFromGrid');
    this.inputPlayVideo = undefined;
    this.VideoClosed.emit(element);
  }

  /**
   * When the video starts, emit the event to the parent component (application).
   * @param {any} event - any
   */
  VideoGridVideoStarted(event: any) {
    //console.log('onVideoStarted');
    this.VideoStarted.emit(event);
  }


  /**
   * If the grid is selected, then for each selected grid element, click the snapshot button.
   * If the grid is not selected, then click the snapshot button for each element.
   */
  clickSnapshot() {
    if (this.appGrid) {
      if (this.appGrid.selectedGridElements.length > 0) {
        for (var i = 0; i < this.appGrid.selectedGridElements.length; i++) {
          this.appGrid.alerts.forEach(element => {
            if (element.idx == this.appGrid.selectedGridElements[i]) {
              element.clickSnapShot();
            }
          });
        }
      } else {
        this.appGrid.alerts.forEach(element => {
          element.clickSnapShot();
        });
      }
    }
  }

  /**
   * This function is called by the Video-Grid component and it sends a message to the
   * NgxLiveViewService, which is then received by the LiveView component.
   * @param {any} callback - This is the function that you want to call from the parent component.
   */
  videogridfunctionCallback(callback: any) {
    this._NgxLiveViewService.notificationemittor.next({
      source: 'videogrid',
      message: callback,
    });
  }

  fill(data: any) {
    this.eventDataSubject.next(data);
  }
  /**
   * The function resizer() is called when the window is resized. It checks to see if the grid exists,
   * and if it does, it calls the resizeGrid() function on the grid
   */
  resizer() {
    if (this.appGrid) {
      this.appGrid.resizeGrid();
    }
  }

  onDimensionChange(event: any) {
    console.log(event);
    this.DimensionChange.emit(event);
  }


  //tempchange for View List
  ngOnChanges(SimpleChanges: any) {
    if (SimpleChanges.gridView) {
      this.appGrid.Rows = SimpleChanges.gridView.currentValue.Rows;
      this.appGrid.Cols = SimpleChanges.gridView.currentValue.Cols;
      this.appGrid.GridConfig = SimpleChanges.gridView.currentValue;
      this.appGrid.resizeGrid();
    }
  }
}
