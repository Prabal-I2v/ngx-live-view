import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CustomOption } from '../models/IOption';
import { VideoGridService } from '../video-grid/video-grid.service';
import { ViewListModel } from '../models/ViewListModel';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'lib-grid-toolbar',
  templateUrl: './grid-toolbar.component.html',
  styleUrls: ['./grid-toolbar.component.scss']
})
export class GridToolbarComponent implements OnInit {

  // theme = 'light';	
  index_!: number;
  indexselected!: number;
  selectedView!: ViewListModel;
  check : boolean = false;
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  constructor(public videoGridService: VideoGridService) { }
  @Input() options: CustomOption[] = [];
  ngOnInit(): void {
    var index= JSON.parse(localStorage.getItem('view') || '3');
    this.selectedView = this.videoGridService._ViewList[index];
    this.viewSelected(index);
  }

  /**
   * The function is called when the user clicks on the "Clear Grid" button. The function calls the
   * closeGridCard() function in the appGrid component.
   */
  clearGrid() {
    this.videoGridService.removeAllVideo();
  }

  stichVideos() {
    console.log("stichVideos")
    this.videoGridService.toggleStichVideo();
  }
  changeAllVideoFit(fit: string) {
    console.log("changeAllVideoFit", fit)
    this.videoGridService.changeVideoFit(fit);
  }
  clickSnapshot() {
    console.log("snapshot")
  }
  goFullScreen() {
    this.videoGridService.fullScreenGrid(true);
  }

  viewSelected(index: number) {
    this.indexselected = index;
    localStorage.setItem('view', index.toString());
    this.selectedView = this.videoGridService._ViewList[index];
    this.videoGridService.selectedViewSubject.next(this.videoGridService._ViewList[index]);
    // this.showViewList = false;
    // let view = this._ViewList[index];
    // this.SelectedView = this._ViewList[index];
    // if (this.appGrid) {
    //   this.appGrid.GridConfig = this.SelectedView;
    //   this.appGrid.Rows = view.Rows;
    //   this.appGrid.Cols = view.Cols;
    //   this.appGrid.ChangeLayout(
    //     view.SpecialElement,
    //     view.SEHeight,
    //     view.SEWidth
    //   );
    // } else {
    //   this.Rows = view.Rows;
    //   this.Cols = view.Cols;
    // }
  }

  /**
*Here we find the index of the selected view from the ViewList array and then assign the Rows
* and Cols of the selected view to the Rows and Cols of the appGrid.
* @param {any} view - any - selected configuration from the view list
*/
  view_selected(view: any) {
    console.log(view);
    // this.showViewList = false;
    // // get index with view.heading from ViewList
    // this.SelectedView = this.ViewList.find(x => x.heading == view.heading);
    // if (this.appGrid) {
    //   this.appGrid.GridConfig = this.SelectedView;
    //   this.appGrid.Rows = this.SelectedView.Rows;
    //   this.appGrid.Cols = this.SelectedView.Cols;
    //   this.appGrid.ChangeLayout(
    //     this.SelectedView.SpecialElement,
    //     this.SelectedView.SEHeight,
    //     this.SelectedView.SEWidth
    //   );
    // } else {
    //   this.Rows = view.Rows;
    //   this.Cols = view.Cols;
    // }
    // this.saveLayout();
  }
  // setTheme(theme? : string) {
  //   //get theme name from local storage

  //   if(this.theme == 'light') {
  //     this.theme = 'dark';
  //   } else {
  //     this.theme = 'light';
  //   }
  //   const themeLink: HTMLLinkElement = document.getElementById(
  //     'style-manager-theme'
  //   ) as HTMLLinkElement;
  //   // store the theme name in local storage
  //   localStorage.setItem('theme', this.theme);
  //   if (this.theme === 'light') {
  //     themeLink.href = `assets/${this.theme}.css`;
  //   } else if (this.theme === 'dark') {
  //     themeLink.href = `assets/${this.theme}.css`;
  //   }
  // }
  setTheme() {

  }

  closeMenu() {
    if (this.menuTrigger && this.menuTrigger.menuOpen) {
      this.menuTrigger.closeMenu();
    }
  }

  radioButtonClicked(event: Event) {
    event.stopPropagation();
  }

  toggleCheck(){
    this.check = true;
  }

  onMenuClosed() {
    this.check = false;
  }
}
