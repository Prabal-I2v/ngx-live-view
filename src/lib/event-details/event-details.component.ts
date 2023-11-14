import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Fancybox } from '@fancyapps/ui';

declare var Object: any;
declare var _ : any;


@Component({
  selector: 'lib-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent implements AfterViewInit {
  backButton = false;
  heading: string = "Event Details";
  event: any;
  prevEvent = new EventEmitter<any>();
  nextEvent = new EventEmitter<any>();
  backButtonEvent = new EventEmitter<any>();
  showPreviousButton = true;
  showNextButton = true;
  showBackButton = false;
  showablePropertiesLength = 0;
  viewer: any;
  slideIndex = 0;
  eventproperties: any[] = [];
  @ViewChild('templateContainer', { read: ViewContainerRef }) templateContainer: ViewContainerRef;


  constructor(
    public dialogRef: MatDialogRef<EventDetailsComponent>, private componentFactoryResolver: ComponentFactoryResolver, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data.event);
    //set event
    this.event = data.event;
    if (data.showPreviousButton != undefined) {
      this.showPreviousButton = data.showPreviousButton;
    }
    if (data.showNextButton != undefined) {
      this.showNextButton = data.showNextButton;
    }
    if (data.heading != undefined) {
      this.heading = data.heading;
    }
    if (data.showBackButton != undefined) {
      this.showBackButton = data.showBackButton;
    }

  }
  ngAfterViewInit() {
    console.log(this.data.templateComponent)
    this.setTemplateData()
    Fancybox.bind('[data-fancybox="gallery"]', {
      //
    });
    this.showablePropertiesLength = Object.keys(this.event.showableProperties).length
  }

  showProperties(data: any) {
    console.log(data);
  }

  /**
   * The function showPreviousEvent() emits the event object to the parent component
   */
  showPreviousEvent() {
    this.prevEvent.emit(this.event);
  }

  /**
   * The function showNextEvent() is a function that emits the event object to the parent component.
   */
  showNextEvent() {
    this.nextEvent.emit(this.event);
  }

  backButtonCallback() {
    this.backButtonEvent.emit(this.event);
  }

  openLightBox(data: any) {
    console.log(data);

  }

  changeType(data: any) {
    return data + "";
  }

  setTemplateData() {
    console.log(this.event)
    let templateComponent: any = "";
    // if (this.data.templateComponent != undefined || this.data.templateComponent != null) {
    //   templateComponent = this.data.templateComponent;
    // }
    // else if(this.event.component != undefined || this.event.component != null) {
    //   templateComponent = this.event.component;
    // }
    if(this.data.event.component != undefined && this.data.event.component != null && this.data.event.component != "") {
      templateComponent = this.data.event.component;
    }
    if (templateComponent != undefined && templateComponent != "") {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(templateComponent);
      this.templateContainer.clear();
      const componentRef = this.templateContainer.createComponent(componentFactory);
      // Apply height and width styles
      const containerElement = componentRef.location.nativeElement;
      containerElement.style.height = '100%';
      containerElement.style.width = '100%';
    }
    else {
      this.templateContainer.clear();
    }
  }


}
