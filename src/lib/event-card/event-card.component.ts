import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
import { EventDetailsComponent } from '../event-details/event-details.component';

import { AppliedFilterModel } from '../models/AppliedFilterModel';

import { IEventCard } from '../models/IEventCard';
import { CustomOption } from '../models/IOption';
import { NgxLiveViewService } from '../ngx-live-view.service';
import { FilterModel } from '../models/FilterModel';
@Component({
  selector: 'lib-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventCardComponent implements OnInit {
  @Input() queueLimit: number = 5;
  @Input() appliedFilterCount: number = 0;
  @Input() toolbarOptions: CustomOption[] = [];
  @Input() filters: FilterModel[] = [];
  @Input() properties: any[] = [];
  @Input() cardOptions: CustomOption[] = [];
  @Input() EventCards: any = [];
  @Output() dblclickEventCard: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterclick: EventEmitter<any> = new EventEmitter<any>();
  @Output() ClickFunction: EventEmitter<any> = new EventEmitter<any>();
  @Output() rightClickEventCard: EventEmitter<any> = new EventEmitter<any>();
  @Output() hideEventsCardViewClicked: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren(MatMenuTrigger) matMenuTrigger: QueryList<MatMenuTrigger> =
    {} as QueryList<MatMenuTrigger>;

  //Internal properties

  showFilter: boolean = false;
  isfilterApplied: boolean = false;
  appliedFilters: AppliedFilterModel[] = [];
  menuTopLeftPosition = { x: '0', y: '0' };

  constructor(
    private _NgxLiveViewService: NgxLiveViewService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    const container = document.querySelector('.eventCard-outer-container');
    const floatingButton = document.getElementById('floatingButton');

    container.addEventListener('scroll', () => {
      if (container.scrollTop > 200) {
        floatingButton.classList.add('active');
      } else {
        floatingButton.classList.remove('active');
      }
    });

    floatingButton.addEventListener('click', () => {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  checkFilterOnData(data: IEventCard) {
    var filterMatched: any = {
      value: 0,
    };
    for (let i = 0; i < this.appliedFilters.length; i++) {
      if (this.appliedFilters[i].name == 'Event Name') {
        this.applyConditionAsPerType(
          this.appliedFilters[i].condition,
          data.EventName,
          this.appliedFilters[i].value,
          filterMatched
        );
      } else if (this.appliedFilters[i].name == 'Device Name') {
        this.applyConditionAsPerType(
          this.appliedFilters[i].condition,
          data.DeviceName,
          this.appliedFilters[i].value,
          filterMatched
        );
      } else {
        var x = data.Properties.filter((property: any) => {
          return (
            property.key.toLowerCase() ==
            this.appliedFilters[i].name.toLowerCase()
          );
        });
        if (x.length > 0) {
          this.applyConditionAsPerType(
            this.appliedFilters[i].condition,
            x[0].value,
            this.appliedFilters[i].value,
            filterMatched
          );
        }
      }
    }
    if (filterMatched.value == this.appliedFilters.length) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * It checks if the data passed to it matches the filters applied by the user.
   * @param {IEventCard} data - IEventCard - This is the data that is being filtered.
   */


  /* This is a function that is called when the user clicks the apply button on the filter component.
  It sets the appliedFilters array to the data that is passed in and sets the isfilterApplied
  boolean to true. */
  filterAppliedCallback(data: AppliedFilterModel[]) {

    this.appliedFilters = data;

    this.isfilterApplied = true;
  }

  /**
   * The function is called when the user clicks on the "Remove Filter" button. It sets the
   * isfilterApplied variable to false.
   */
  removeFilterCallback() {
    this.isfilterApplied = false;
  }

  /**
   * It loops through all the child components and calls the onClear() function on each one.
   */
  // removeFilters() {
  //   try {
  //     this.filterChild.forEach((child: any) => {
  //       child.onClearFilterForm();
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
  /**
   * It opens a dialog box and passes the event object to it.
   * @param {IEventCard} event - IEventCard - this is the event object that is being passed to the
   * dialog
   */
  showEventDetails(event: any) {
    var showDetailsDialog = this.dialog.open(EventDetailsComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        event: event,
        templateComponent: event.component
      },
      autoFocus: false
    });


    /* This is a function that is called when the user clicks the next button on the dialog box. It
    checks to see if the user is on the first or last event card and if they are it sets the
    event card to the first or last event card. */
    showDetailsDialog.componentInstance.prevEvent.subscribe(data => {
      console.log(data);
      if (this.EventCards.indexOf(data) == this.EventCards.length - 1) {
        showDetailsDialog.componentInstance.event = this.EventCards[0];
        showDetailsDialog.componentInstance.data.event = showDetailsDialog.componentInstance.event;
        showDetailsDialog.componentInstance.data.event.templateComponent = showDetailsDialog.componentInstance.event.component;
        showDetailsDialog.componentInstance.setTemplateData();
      }
      else {
        showDetailsDialog.componentInstance.event =
          this.EventCards[this.EventCards.indexOf(data) + 1];
        showDetailsDialog.componentInstance.data.event = showDetailsDialog.componentInstance.event;
        showDetailsDialog.componentInstance.data.event.templateComponent = showDetailsDialog.componentInstance.event.component;
        showDetailsDialog.componentInstance.setTemplateData();
      }
    });
    /* This is a function that is called when the user clicks the next button on the dialog box. It
    checks to see if the user is on the first or last event card and if they are it sets the event
    card to the first or last event card. */
    showDetailsDialog.componentInstance.nextEvent.subscribe(data => {
      if (
        this.EventCards.indexOf(data) == -1 || this.EventCards.indexOf(data) == 0) {
        showDetailsDialog.componentInstance.event =
          this.EventCards[this.EventCards.length - 1];
        showDetailsDialog.componentInstance.data.event = showDetailsDialog.componentInstance.event;
        showDetailsDialog.componentInstance.data.event.templateComponent = showDetailsDialog.componentInstance.event.component;
        showDetailsDialog.componentInstance.setTemplateData();
      }
      else {
        showDetailsDialog.componentInstance.event =
          this.EventCards[this.EventCards.indexOf(data) - 1];
        showDetailsDialog.componentInstance.data.event = showDetailsDialog.componentInstance.event;
        showDetailsDialog.componentInstance.data.event.templateComponent = showDetailsDialog.componentInstance.event.component;
        showDetailsDialog.componentInstance.setTemplateData();
      }
    });

    console.log(event.component)
  }

  /**
   * It clears the list of event cards.
   */
  clearList() {
    this.EventCards.length = 0;
  }

  /**
   * Method called when the user click with the right button
   * @param event MouseEvent, it contains the coordinates
   * @param item Our data contained in the row of the table
   */
  onRightClick(event: MouseEvent, item: any) {
    // preventDefault avoids to show the visualization of the right-click menu of the browser
    event.preventDefault();
    this.rightClickEventCard.emit({ mouseEvent: event, event: item });
  }

  onFilterClick(event: any) {
    this.filterclick.emit(event);
  }
  /**
   * This function takes a string as an argument and passes it to the eventCardCallback function in
   * the NgxLiveViewService service.
   * @param {string} callback - string - The name of the callback function to be called.
   */
  eventCardCallback(callback: any) {
    this.dblclickEventCard.emit('dblclick' + callback);
  }

  /**
   * This function is called when the user clicks user passed function on the event card toolbar functions. It sends a message to the
   * service to tell it to call the callback function that was passed in.
   * @param {any} callback - This is the function that you want to call.
   */
  eventCardToolbarFunctionCallback(callback: any) {
    this.ClickFunction.emit({
      source: 'Event-card Toolbar',
      callback: callback,
    });
  }

  /**
   * This function is called when the user clicks on the event card functions. It emits an event to the parent
   * component, which then calls the callback function that was passed in as a parameter.
   * @param {any} callback - This is the function that you want to call.
   * @param {any} event - the event object
   */
  eventCardFunctionCallback(callback: any, event: any) {
    this.ClickFunction.emit({
      source: 'Event-card Card',
      callback: callback,
      event: event,
    });
  }

  /**
   * It checks if the eventdata with the filterData, if it does, it returns true, if not, it
   * returns false.
   * @param {string} condition - the condition that you want to check
   * @param {any} eventdata - the data of the event that is being checked
   * @param {any} filterData - The data that is entered in the filter input field.
   * @returns a boolean value.
   */
  checkConditionOnFilter(condition: string, eventdata: any, filterData: any) {
    console.log(
      'condition : ',
      condition,
      ' eventdata : ',
      eventdata,
      ' filterdata : ',
      filterData
    );
    switch (condition) {
      case 'contains':
        return eventdata.includes(filterData);
      case 'not contains':
        return !eventdata.includes(filterData);
      case 'equal':
        return eventdata == filterData;
      case 'not equal':
        return eventdata != filterData;
      case 'greater than':
        return eventdata > filterData;
      case 'smaller than':
        return eventdata < filterData;
    }
  }

  /**
   * It checks if the eventdata matches the filterData based on the condition.
   * @param {string} condition - string - the condition to be applied (e.g. 'contains', 'equals', etc.)
   * @param {any} eventdata - The data that is being filtered
   * @param {any} filterData - This is the data that is being filtered.
   * @param {any} filterMatched - This is a class that has a property called value. This is used to keep
   * track of how many filters have been matched.
   */
  applyConditionAsPerType(
    condition: string,
    eventdata: any,
    filterData: any,
    filterMatched: any
  ) {
    if (typeof filterData == 'string') {
      if (
        this.checkConditionOnFilter(
          condition,
          eventdata.toLowerCase(),
          filterData.toLowerCase()
        )
      ) {
        filterMatched.value++;
      }
    } else {
      let filterConditionMatched: Boolean = false;
      for (let j = 0; j < filterData.length; j++) {
        if (
          this.checkConditionOnFilter(
            condition,
            eventdata.toLowerCase(),
            filterData[j].toLowerCase()
          )
        ) {
          filterConditionMatched = true;
          break;
        }
      }
      if (filterConditionMatched) {
        filterMatched.value++;
      }
    }
  }

  /**
   * It takes a key and an event, and returns the value of the property with the given key.
   * @param {string} key - the key of the property you want to get the value of
   * @param {IEventCard} event - IEventCard
   * @returns The value of the property with the key that matches the key passed in.
   */
  getPropertyValue(key: string, event: IEventCard) {
    console.log("Event is " + JSON.stringify(event))
    return event.Properties.filter(property => property.key == key)[0].value;
  }

  hideEventsCardView() {
    this.hideEventsCardViewClicked.emit();
  }


}

class cardDetails {
  eventName: string = "";
  videoSourceId: number;
  time: string = "";
  snapshotPath: string = "";
  videoSourceName: string = "";
  update: boolean = false;
  starred: boolean = false;
  ip: string = "";
  serverName: string = "";
  label: string = "";
  cardProperties: cardProperties[] = [];
  eventProperties: eventDetails[] = [];
  images: string[] = [];
}
class cardProperties {
  key: string = "";
  value: any;
}

class eventDetails {
  key: string = "";
  value: any;
}