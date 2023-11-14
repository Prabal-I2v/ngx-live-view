import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  SimpleChanges,
  ViewChildren,
  QueryList,
  OnChanges,
} from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { I2vVideoGridComponent } from '../i2v-video-grid/i2v-video-grid.component';
import { CustomOption } from '../models/IOption';
import { NgxLiveViewService } from '../ngx-live-view.service';
import { ViewListModel } from '../models/ViewListModel';
import { VideoGridService } from '../video-grid/video-grid.service';

declare var toastr: any;
declare var $: any;
declare var document: any;

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
export interface GridElement {
  id: number;
  cameraId: number;
  cameraName: string;
  playbackMode: string;
  time_out: number;
  eventObject: any;
  info: any;
  byAction: any;
  color: string;
  ComponentName: string;
}
@Component({
  selector: 'lib-app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
})
export class GridComponent implements OnInit, OnDestroy, OnChanges {
  rowStyle!: string;
  colStyle!: string;
  @Input() items: ViewListModel[];
  gridItems: any;
  selectedView: any;
  theme : string;

  gridTemplate!: string;
  ngOnInit() {
    this.selectedView = this.videoGridService.SelectedView;
    this.generateGrid();
    this.GridArray = [];
    var count = this.selectedView.NumberofTiles ? this.selectedView.NumberofTiles : this.selectedView.Rows * this.selectedView.Cols;
    for (var i = 0; i < count; i++) {
      this.GridArray.push('');
    }
    this.theme = this._NgxLiveViewService.theme;

  }

  gridItemDict: any = {};
  generateGrid() {
    this.gridItemDict = {};
    for (let view of this.items) {
      const cols = view.Cols;
      const rows = view.Rows;

      const colString = `repeat(${cols}, 1fr)`;
      const rowString = `repeat(${rows}, 1fr)`;
      const gridTemplate = `${rowString} / ${colString}`;

      var numGridItems = rows * cols;
      if (view.hasSpecial) {
        numGridItems = view.NumberofTiles!;
      }
      const gridItems = [];

      for (let i = 0; i < numGridItems; i++) {
        if (view.hasSpecial && i === view.SpecialElement) {
          const specialItem = {
            rowStart: '1',
            colStart: '1',
            rowEnd: `span ${view.SEHeight}`,
            colEnd: `span ${view.SEWidth}`
          };
          gridItems.push(specialItem);
        }
        else if (view.hasSpecial && i != view.SpecialElement) {
          const item = {
            rowStart: "",
            colStart: "",
            rowEnd: "",
            colEnd: "",
          };
          gridItems.push(item);
        }
        else {
          const item = {
            rowStart: Math.floor(i / cols) + 1,
            colStart: (i % cols) + 1,
            rowEnd: Math.floor(i / cols) + 2,
            colEnd: (i % cols) + 2
          };
          gridItems.push(item);
        }
      }
      this.gridItemDict[view.id] = {
        gridTemplate,
        gridItems
      };
    }
  }

  @Input() playDuplicate: boolean = true;
  @Input() gridMode: string = 'general';
  @Input() cameras: any[] = [];
  @Input() idx: string = 'Grid';
  @Input() Rows: number;
  @Input() Cols: number;
  @Input() header: boolean;
  @Input() hideTime: boolean = true;
  @Input() GridConfig: any;
  @Input() RowRatio: number = 1.3;
  @Input() parentHeight: number = 0;
  @Input() parentWidth: number = 0;
  @Input() options: CustomOption[] = [];
  @Input() playerServerIp: string = '';
  @Input() streamerIp: string = '';
  @Input() streams = [];

  @Output() CloseElement: EventEmitter<any> = new EventEmitter<any>();
  @Output() clearGrid: EventEmitter<any> = new EventEmitter<any>();
  @Output() NodeDrop: EventEmitter<any> = new EventEmitter<any>();
  @Output() GridArrayChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() playbackModeChangeEmitter: EventEmitter<any> =
    new EventEmitter<any>();
  @Output() PlayerNameChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() videoStartEmitterFromGrid: EventEmitter<any> = new EventEmitter<any>();
  @Output() dimensionChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() CloseCard: EventEmitter<any> = new EventEmitter<any>();
  @Output() VerifyEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() Minimize: EventEmitter<any> = new EventEmitter<any>();
  @Output() Maximize: EventEmitter<any> = new EventEmitter<any>();
  @Output() FunctionClick: EventEmitter<any> = new EventEmitter<any>();
  @ViewChildren(I2vVideoGridComponent)
  alerts: QueryList<I2vVideoGridComponent> =
    {} as QueryList<I2vVideoGridComponent>;

  // Internal Properties

  //newEntrySubscription: Subscription = {} as Subscription;
  public GridArray: any[] = [];
  id: number = 0;
  row: string = '100%';
  col: string = '33%';
  h: string = '100%';
  edit: boolean = false;
  renderType: string = 'row';
  height: string = '100%';
  rowHeight: string = '1:1';
  rowsArray: any[] = ['100%', '100%', '100%'];
  colsArray: any[] = ['33%', '33%', '33%'];
  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedGridElements: any = [];
  gridFullScreen: boolean = false;
  GridParentDivHeight = 'calc(100vh - 160px)';
  queueLimit: number = 4;

  constructor(public _NgxLiveViewService: NgxLiveViewService, public videoGridService: VideoGridService) {
    this.GridArray = ['', '', ''];
    this.Rows = 1;
    this.Cols = 3;
    this.header = true;
    this.row = '100%';
    this.col = '33%';
    this.items = this.videoGridService._ViewList;
    this.videoGridService.selectedViewSubject.subscribe((data) => {
      console.log(data);
      this.selectedView = data;
      console.log(this.videoGridService.selectedViewSubject);
      this.layoutChange(this.selectedView);
    });
    this.videoGridService.playVideoSubject.subscribe((data) => {
      console.log(data);
      if (data) {
        this.addResourceToGrid(data);
      }
    });
    this.videoGridService.playVideoByDropSubject.subscribe((data) => {
      console.log(data);
      if (data) {
        this.addResourceToGrid(data.resource, data.id);
      }
    })


    this.videoGridService.removeAllVideoSubject.subscribe((data) => {
      console.log(data);
      if (data) {
        this.closeGridCard();
      }
    });
    this.videoGridService.fullScreenGridSubject.subscribe((data) => {
      console.log(data);
      if (data) {
        this.fullScreen();
      }
    });

    this.videoGridService.changeVideoFitSubject.subscribe((data) => {
      console.log(data);
      if (data) {
        this.changeAllVideoFit(data);
      }
    });

    this.videoGridService.stichVideoSubject.subscribe((data) => {
      console.log(data);
      this.stichVideos();
    });

    this.videoGridService.removeVideoSubject.subscribe((data) => {
      console.log(data);
      if (data) {
        this.closeElement(data);
      }
    });

    /* Adding an event listener to the fullscreenchange event for Video Grid and Open Sea Dragon */
    addEventListener('fullscreenchange', event => {
      try {
        const elem = <HTMLElement>(
          document.querySelector('.openseadragon-container')
        );
        const backButton = <HTMLElement>(
          document.getElementById('openseadragonbackButton')
        );
        if (document.fullscreenElement) {
          this.resizeGrid();
          if (elem) {
            elem.style.zIndex = '10000';
            backButton.style.display = 'none';
          }
        } else {
          this.resizeGrid();
          if (elem) {
            elem.style.zIndex = '0';
            backButton.style.display = 'block';
          }
        }
      } catch (e) {
        console.log(e);
      }
    });

    /* Add an Resizer event whenever screen is resized . Get the width and height of the parent element and then setting the rowHeight property
   of the child component to set the Grid Ratio. */
    addEventListener('resize', event => {
      this.resizeGrid();
    });

    //  add click event listener to mat-grid-tile elements with ctrl key pressed
    document.addEventListener('click', (event: any) => {
      if (
        event.ctrlKey &&
        (event.target.tagName === 'VIDEO' || event.target.tagName === 'IMG')
      ) {
        //this.onCloseCard.emit(event.target.id);
        var id = parseInt(event.target.id.split('_')[1]);
        // get child of element with id grid-tile_+id
        var mat_grid_tile_content_elem = document.getElementById(
          'appWebPlayer_' + id
        );

        // change border color of mat-grid-tile-content element
        // toggle class select
        mat_grid_tile_content_elem.classList.toggle('selected-grid-tile');
        // set border color to red
        if (
          mat_grid_tile_content_elem.classList.contains('selected-grid-tile')
        ) {
          mat_grid_tile_content_elem.style.border = '1px solid red';
          this.selectedGridElements.push(id);
        } else {
          mat_grid_tile_content_elem.style.border = 'none';
          this.selectedGridElements.splice(
            this.selectedGridElements.indexOf(id),
            1
          );
        }
      }
    });
  }

  layoutChange(newLayout: ViewListModel) {
    // get count of new layout; get all non-empty items from gridArray;
    // create a new array with "" items and length equal to new layout count
    // add non-empty items to new array
    // handle case when new layout count is less than non-empty items count
    // handle case when new layout count is greater than non-empty items count

    const nonEmptyItems = this.GridArray.filter(item => item !== '');
    const newLayoutCount = newLayout.NumberofTiles ? newLayout.NumberofTiles : newLayout.Rows * newLayout.Cols;
    const newGridArray = new Array(newLayoutCount).fill("");
    if (nonEmptyItems.length > newLayoutCount) {
      for (let i = 0; i < newLayoutCount; i++) {
        newGridArray[i] = nonEmptyItems[i];
      }
    }
    else {
      for (let i = 0; i < nonEmptyItems.length; i++) {
        newGridArray[i] = nonEmptyItems[i];
      }
    }
    this.GridArray = newGridArray;
  }

  addResourceToGrid(resource: any, id?: number) {
    console.log(resource);
    const duplicateResource = this.GridArray.find(r => r && r.id === resource.id);
    if (duplicateResource && !this.playDuplicate) {
      console.debug('Duplicate resource');
      return;
    }
    if (id !== undefined) {
      console.log(id);
      console.debug("replace resource")
      this.GridArray[id] = "";
      setTimeout(() => {
        this.GridArray[id] = resource;
      }, 50);
      return;
    }
    const index = this.GridArray.findIndex(item => !item);
    if (index >= 0) {
      console.debug("add resource");
      this.GridArray[index] = resource;
    }
    else {
      console.log('Grid is full');
    }
  }
  currentVideoFit = 'contain';

  changeAllVideoFit(videoFit: string) {
    this.currentVideoFit = videoFit;

    // // find all the elements video with id like id="videoContainer_+'id'+_video"
    let videoElements = document.querySelectorAll(
      'video[id^="videoContainer_"][id$="_video"]'
    );
    // // if there is any selected elements in the grid
    if (this.selectedGridElements.length > 0) {
      for (
        var element = 0;
        element < this.selectedGridElements.length;
        element++
      ) {
        videoElements.forEach((x: any) => {
          if (
            x.id ==
            'videoContainer_' +
            this.selectedGridElements[element] +
            '_video'
          ) {
            let video = x as HTMLVideoElement;
            video.style.objectFit = videoFit;
          }
        });
      }
    } else {
      // // find all the elements video with id like id="videoContainer_+'id'+_video"
      if (videoElements.length > 0) {
        videoElements.forEach((element: any) => {
          let video = element as HTMLVideoElement;
          video.style.objectFit = this.currentVideoFit;
        });
      }
    }

  }

  stichVideos() {

    // inside div with id parentGridLiveView find all divs with id header_+'id' and footer_+'id'
    let headerElements = document.querySelectorAll(
      'div[id^="outer"] div[id^="header_"]'
    );
    let footerElements = document.querySelectorAll(
      'div[id^="outer"] div[id^="footer_"]'
    );

    // change the height of the video containers with id appWebPlayer_+'id'
    let videoContainerElements = document.querySelectorAll(
      'div[id^="appWebPlayer_"]'
    );

    if (this.selectedGridElements.length > 0) {
      for (
        var element = 0;
        element < this.selectedGridElements.length;
        element++
      ) {
        this.stich(headerElements, 'header_', element);
        this.stich(footerElements, 'footer_', element);
        this.stich(videoContainerElements, 'appWebPlayer_', element);
      }
    } else {
      this.stich(headerElements, 'all', -1);
      this.stich(footerElements, 'all', -1);
      this.stich(videoContainerElements, 'all', 0);
    }

  }
  stich(List: NodeListOf<any>, str: string, element: number) {
    if (str != 'all') {
      List.forEach(x => {
        if (x.id == str + this.selectedGridElements[element]) {
          let parameter = x as HTMLElement;
          if (str == 'appWebPlayer_') {
            parameter.style.height = this.videoGridService.IsDetailsHiddenFromGrid
              ? '100%'
              : 'calc(100% - 40px)';
          } else {
            parameter.style.display = this.videoGridService.IsDetailsHiddenFromGrid
              ? 'none'
              : 'flex';
          }
        }
      });
    } else {
      List.forEach(x => {
        let parameter = x as HTMLElement;
        if (element == 0) {
          parameter.style.height = this.videoGridService.IsDetailsHiddenFromGrid
            ? '100%'
            : 'calc(100% - 40px)';
        } else {
          parameter.style.display = this.videoGridService.IsDetailsHiddenFromGrid
            ? 'none'
            : 'flex';
        }
      });
    }
  }

  ngOnDestroy(): void {
    //if (this.newEntrySubscription) this.newEntrySubscription.unsubscribe();
  }

  /**
   * The function closeCard() is a function that emits an event called onCloseCard, The event is emitted with the parameter this.idx, which is the index of the card that is being
   * closed from the child component to the parent component.
   */
  closeCard() {
    this.CloseCard.emit(this.idx);
  }

  /**
   * This function sets the grid dimensions and then calls the ChangeLayout() function.
   * @param {number} rows - number, cols: number
   * @param {number} cols - number of columns
   */
  setGridDimensions(rows: number, cols: number) {
    this.Rows = rows;
    this.Cols = cols;
    // this.rowHeight = this.Rows*2+':'+this.Cols;
    this.resizeGrid();
  }

  /**
   * If the item is a video, and the item is live, and the item is not already present, and the grid is not
   * full, then add the item to the grid.
   * @param {GridElement} item - GridElement - this is the object that is being dragged.
   * @param {string} [parentNode] - The id of the element that the user dropped the item on.
   */
  setElementInGrid(item: GridElement, parentNode?: number) {
    //console.log("parentNode in Set Element :", parentNode, item);
    if (parentNode == undefined || parentNode == null) {
      if (item && item.ComponentName == 'Video') {
        if (item.playbackMode == 'LIVE') {
          var numberofentries = this.GridArray.filter(entry => {
            return (
              entry.cameraId == item.cameraId && entry.playbackMode == 'LIVE'
            );
          });
          if (numberofentries.length > 0 && !this.playDuplicate) {
            this._NgxLiveViewService.notificationemittor.next({
              source: 'Video-Grid',
              message: 'Live View is Already Running!!',
              event: item,
            });
            console.log('Live View is Already Running!!');
          } else if (item.time_out) {
            var index = this.GridArray.findIndex(entry => {
              return (
                entry.cameraId == item.cameraId && entry.playbackMode == 'LIVE'
              );
            });

            if (this.GridArray[index].time_out) {
              this.GridArray[index].time_out =
                this.GridArray[index].time_out + 1;
              this.GridArray[index].eventObject = item.eventObject;
            }
          } else {
            var i = this.GridArray.findIndex(block => {
              return block == '';
            });
            if (i > -1) {
              this.GridArray[i] = item;
              this.GridArrayChanged.emit({
                operation: 'add',
                id: this.idx,
                position: i,
              });
            } else {
              this._NgxLiveViewService.notificationemittor.next({
                source: 'Video-Grid',
                message: 'Please Increase Grid Size',
                event: item,
              });
              //console.log('Please Increase Grid Size');
            }
          }
        } else {
          var i = this.GridArray.findIndex(block => {
            return block == '';
          });
          if (i > -1) {
            this.GridArray[i] = item;
            this.GridArrayChanged.emit({
              operation: 'add',
              id: this.idx,
              position: i,
            });
          } else {
            this._NgxLiveViewService.notificationemittor.next({
              source: 'Video-Grid',
              message: 'Please Increase Grid Size',
              event: item,
            });
            console.log('Please Increase Grid Size');
          }
        }
      } else if (item.ComponentName == 'ExternalApp') {
        var index = this.GridArray.findIndex(entry => {
          return entry.cameraId == item.cameraId;
        });
        if (index < 0) {
          var i = this.GridArray.findIndex(block => {
            return block == '';
          });
          if (i > -1) {
            this.GridArray[i] = item;
            this.GridArrayChanged.emit({
              operation: 'add',
              id: this.idx,
              position: i,
            });
          } else {
            this._NgxLiveViewService.notificationemittor.next({
              source: 'Video-Grid',
              message: 'Please Increase Grid Size',
              event: item,
            });
            console.log('Please Increase Grid Size');
          }
        }
      }
    } else {
      if (!this.playDuplicate) {
        var numberofentries = this.GridArray.filter(entry => {
          return (
            entry.cameraId == item.cameraId && entry.playbackMode == 'LIVE'
          );
        });
        if (numberofentries.length > 0) {
          this._NgxLiveViewService.notificationemittor.next({
            source: 'Video-Grid',
            message: 'Live View is Already Running!!',
            event: item,
          });
          console.log('Live View is Already Running!!');
        } else {
          this.GridArray[parentNode] = item;
        }
      } else {
        this.GridArray[parentNode] = item;
      }
    }
  }

  /**
   * The ngOnChanges() function is called whenever a property of the component is changed. 
   * 
   * The function checks if the property that was changed is the gridMode property. If it is, then the
   * GridArray is emptied and the ChangeLayout() function is called to reinitialize the grid array. 

   * @param {SimpleChanges} changes - SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if (propName == 'gridMode') {
        this.GridArray = [];
        this.ChangeLayout();
      }
    }
  }

  /**
   * Change grid size i.e. change in rows and cols
   * It takes in a number of rows and columns and then creates a grid of that size
   * @param {number} [specialElementNumber] - the index of the element that is special (i.e. the one
   * that is not a square)
   * @param {number} [SErows] - number of rows of the special element
   * @param {number} [SEcols] - number of columns of the special element
   * @param {string} [renderType] - "row" or "column"
   */
  ChangeLayout(
    specialElementNumber?: number,
    SErows?: number,
    SEcols?: number,
    renderType?: string
  ): void {
    // if (document.getElementById('parentGrid')?.offsetWidth != undefined && document.getElementById('parentGrid')?.offsetHeight != undefined) {
    this.resizeGrid();
    //console.log("new ratio is: " + this.rowHeight);
    if (
      specialElementNumber != null &&
      specialElementNumber != undefined &&
      SErows != null &&
      SErows != undefined &&
      SEcols != null &&
      SEcols != undefined
    ) {
      var n = this.Rows * this.Cols - SErows * SEcols + 1;
    } else {
      var n = this.Rows * this.Cols;
    }
    if (renderType) {
      this.renderType = renderType;
    } else {
      this.renderType = 'row';
    }
    var i = 0;
    //used when we increase number of Grids, we first sort vids in ascending order and fill the grid
    if (n > this.GridArray.length) {
      var count = 0;
      this.GridArray.forEach(element => {
        if (element == '' || element == null || element == undefined) {
          this.GridArray.splice(this.GridArray.indexOf(element), 1);
          count++;
        }
      });
      for (i = 0; i < count; i++) {
        this.GridArray.push('');
      }
      for (i = this.GridArray.length; i < n; i++) {
        this.GridArray.push('');
      }
    } else {
      //used when we decrease number of Grids, we first sort vids in ascending order and then maintain number of vids in grid
      var count = 0;
      this.GridArray.forEach(element => {
        if (element == '' || element == null || element == undefined) {
          this.GridArray.splice(this.GridArray.indexOf(element), 1);
          count++;
        }
      });
      for (i = 0; i < count; i++) {
        this.GridArray.push('');
      }
      for (i = this.GridArray.length - 1; i >= n; i--) {
        if (this.GridArray[this.GridArray.length - 1] != '') {
          this.CloseElement.emit(
            this.GridArray[this.GridArray.length - 1].cameraId
          );
        }
        this.GridArray.pop();
      }
    }
    var r: number = 100 / this.Rows;
    this.row = '' + r + '%';
    var c: number = 100 / this.Cols;
    this.col = '' + c + '%';
    this.edit = false;
    this.rowsArray = [];
    this.colsArray = [];
    this.GridArray.forEach((item, index) => {
      if (
        specialElementNumber != null &&
        specialElementNumber != undefined &&
        specialElementNumber == index &&
        SErows != null &&
        SErows != undefined &&
        SEcols != null &&
        SEcols != undefined
      ) {
        this.rowsArray.push(
          '' + Math.floor((100 / this.Rows) * SErows * 10) / 10 + '%'
        );
        this.colsArray.push('' + (100 / this.Cols) * SEcols + '%');
      } else {
        this.rowsArray.push(this.row);
        this.colsArray.push(this.col);
      }
    });
    this.queueLimit = this.Rows * this.Cols;
    this.dimensionChange.emit({ id: this.idx, data: [this.Rows, this.Cols] });
    this._NgxLiveViewService.notificationemittor.next({
      source: 'Video-grid',
      message: 'Grid view changed',
      event: this.GridConfig
    });
  }

  /**
   * It removes an element from an array and emits the event to parent component for Close Element and Grid Array Changed
   * @param {any} id - the id of the element to be removed
   */
  closeElement(id: any) {
     // split the id using _, as id  and iterant through the GridArray to find the index of the element with the id
     var temp = id.split('_');
     id = parseInt(temp[0]);
     var iter = parseInt(temp[1]);
     console.log('close id : ' + id, iter);
 
 
     //confirm that iter th element in GridArray has the id
     if (this.GridArray[iter].id == id) {
       var i = iter;
     }
 
    console.log('index is : ' + i);
    if (i > -1) {
      var elem = this.GridArray[i];
      //var cameraId = this.GridArray[i].cameraId;
      this.GridArray[i] = '';
      this.CloseElement.emit(elem.cameraId);
      this.GridArrayChanged.emit({
        operation: 'remove',
        id: this.idx,
        position: i,
      });
      $(document).ready(() => {
        $('#' + this.idx + '_' + i).droppable({
          accept: '.HomeTree',
          drop: (event: { target: any }, ui: { draggable: any }) => {
            if (ui) {
              var droppable = event.target;
              if (droppable) {
                var gridId = droppable.id;
                var sub = gridId.split('_');
                var gridIndex = parseInt(sub[sub.length - 1]);
                var draggable = ui.draggable;
                if (draggable && draggable.length > 0) {
                  var nodeId = draggable[0].id;
                  var sub = nodeId.split('_');
                  var camid = parseInt(sub[sub.length - 1]);
                  this.onDropByIndex(gridIndex, camid);
                }
              }
            }
          },
        });
      });
    }
  }

  /**
   * If the selectedGridElements array contains the id of the current element in the GridArray, then
   * remove the id from the selectedGridElements array and remove the element from the GridArray.
   * If the selectedGridElements array is empty, then clear the GridArray.
   */
  closeGridCard() {
    let length = this.GridArray.length;
    if (this.selectedGridElements.length == 0) {
      this.clearCard();
    } else {
      for (var i = 0; i < length; i++) {
        //if this.GridArray[i].id exists in selectedGridElements
        if (this.selectedGridElements.indexOf(this.GridArray[i].id) > -1) {
          this.selectedGridElements.splice(
            this.selectedGridElements.indexOf(this.GridArray[i].id),
            1
          );
          this.GridArray[i] = '';
        }
      }
      this.clearGrid.emit();
    }
  }

  /**
   * It clear the Grid Array
   */
  clearCard() {
    for (var i = 0; i < this.GridArray.length; i++) {
      this.GridArray[i] = '';
    }
    this.clearGrid.emit();
  }

  /**
   * If the gridId and camId are both greater than -1, then if the GridArray[gridId] is not empty, emit
   * the GridArray[gridId].cameraId, then find the index of the GridArray that matches the camId, if
   * the index is -1, then find the camera that matches the camId, then set the GridArray[gridId] to
   * the camera, id, camId, cameraName, time_out, playbackMode, ComponentName, selected, playerName,
   * and timeRange, then emit the operation, id, and position, then emit the gridId
   * @param {number} gridId - The index of the grid that the camera is being dropped into.
   * @param {number} camId - number - the id of the camera that was dropped
   */
  onDropByIndex(gridId: number, camId: number) {
    if (gridId > -1 && camId > -1) {
      if (this.GridArray[gridId] != '') {
        this.CloseElement.emit(this.GridArray[gridId].cameraId);
      }
      let index = this.GridArray.findIndex(video => {
        return video.cameraId == camId;
      });
      if (index == -1) {
        var camera = this.cameras.find(x => {
          return x.id == camId;
        });
        this.GridArray[gridId] = {
          camera: camera,
          id: Math.round(Math.random() * 1000),
          cameraId: camId,
          cameraName: camera.resourceName,
          time_out: null,
          playbackMode: 'LIVE',
          ComponentName: 'Video',
          selected: false,
          playerName: '',
          timeRange: undefined,
        };
        this.GridArrayChanged.emit({
          operation: 'add',
          id: this.idx,
          position: gridId,
        });
        this.NodeDrop.emit(gridId);
      } else {
        toastr.error('Live View is Already Running');
      }
    }
  }

  /**
   * It plays all the child resources of the node which are droppabe
   * @param {string | any[]} nodes - string | any[]
   */
  playALLChildResources(nodes: string | any[]) {
    var currentIdIndex = 0;
    var len = this.Rows * this.Cols;
    var i = 0;
    while (i != len && currentIdIndex != nodes.length) {
      if (this.GridArray[i] != '') {
        i++;
      } else {
        if (nodes[currentIdIndex].data.isDroppable == false) {
          while (
            nodes[currentIdIndex].data.isDroppable == false &&
            currentIdIndex != nodes.length
          ) {
            currentIdIndex++;
          }
        }
        if (currentIdIndex < nodes.length) {
          var camera = this.cameras.find(x => {
            return x.id == nodes[currentIdIndex].id;
          });
          this.GridArray[i] = {
            camera: camera,
            id: Math.round(Math.random() * 1000),
            cameraId: nodes[currentIdIndex].id,
            cameraName: nodes[currentIdIndex].name,
            time_out: null,
            playbackMode: 'LIVE',
            ComponentName: 'Video',
            selected: false,
            playerName: '',
            timeRange: undefined,
          };
          this.GridArrayChanged.emit({
            operation: 'add',
            id: this.idx,
            position: i,
          });
          this.NodeDrop.emit(nodes[currentIdIndex]);
          currentIdIndex++;
          i++;
        } else {
          break;
        }
      }
    }
  }

  /**
   * Find the index of the object in the array that has a cameraId property that matches the id
   * parameter, and if it exists, remove it from the array.
   * @param {number} id - number - the id of the camera to close
   */
  closeById(id: number) {
    var i = this.GridArray.findIndex(s => s.cameraId == id);
    if (i > -1) {
      this.GridArray[i] = '';
    }
  }

  /**
   * It returns the number of occupied grids in the GridArray.
   * @returns The number of occupied grids.
   */
  getNoOfOccupiedGrids() {
    let noOfOccupiedGrid: number = 0;
    if (this.GridArray.length > 0) {
      this.GridArray.forEach(grid => {
        if (grid != '') {
          noOfOccupiedGrid = noOfOccupiedGrid + 1;
        }
      });
    }
    return noOfOccupiedGrid;
  }

  /**
   * When the playerNameChange event is emitted, find the element in the GridArray that matches the id,
   * and set the playerName to the new value and emit an event to parent Component.
   * @param  - { id: any; playerName: any; }
   */
  playerNameChange($event: { id: any; playerName: any }) {
    let id = $event.id;
    let playerName = $event.playerName;
    let elem = this.GridArray.find(s => s.cameraId == id);
    elem.playerName = playerName;
    this.PlayerNameChange.emit({ id: id, playerName: playerName });
  }

  /**
   * "When the video starts, emit an event to the parent component with the id and wmode of the video."
   * @param event - { id: any; wmode: any; }
   */
  onVideoStarted(event: { id: any; wmode: any }) {
    console.log('videoStartEmitterFromGrid');
    let id = event.id;
    let wmode = event.wmode;
    this.videoStartEmitterFromGrid.emit({ id: id, wmode: wmode });
  }

  /**
   * It takes a div element, toggle it for full screen and set rowHeight for the Video Grid.
   */
  async fullScreen() {
    var elmnt: any;
    this.gridFullScreen = !this.gridFullScreen;
    elmnt = document.getElementById('parentGridLiveView');
    console.log("div is created : " + elmnt);
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (elmnt.requestFullscreen) {
        await elmnt.requestFullscreen();
      } else if (elmnt.webkitRequestFullscreen) {
        await elmnt.webkitRequestFullscreen();
      }
      //console all attributes of elmnt
      for (var i = 0; i < elmnt.attributes.length; i++) {
        console.log(
          elmnt.attributes[i].name + ' = ' + elmnt.attributes[i].value
        );
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      }
    }
    this.resizeGrid();
  }

  /**
   * "The function resizes the grid based on the width and height of the parent container."
   */
  resizeGrid() {
    setTimeout(() => {
      try {
        var width = parseInt(document.getElementById('parentGridLiveView').offsetWidth);
        var height =
          parseInt(document.getElementById('parentGridLiveView').offsetHeight) - 28;
        this.rowHeight = width / this.Cols + ':' + height / this.Rows;
        console.log("width : " + width + " height : " + height + " rowHeight : " + this.rowHeight);
      } catch (e) {
        console.log(e);
      }

    }, 0);
  }
}