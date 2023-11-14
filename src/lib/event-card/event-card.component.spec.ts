// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { IEventCard } from '@i2v/ngx-live-view';
// import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
// import { EventDetailsComponent } from '../event-details/event-details.component';
// import { createTranslateLoader } from '../ngx-live-view.module';
// import { NgxLiveViewService } from '../ngx-live-view.service';
// import { EventCardComponent } from './event-card.component';


// describe('EventCardComponent', () => {
//   let component: EventCardComponent;
//   let fixture: ComponentFixture<EventCardComponent>;
//   let testBedNgxLiveViewService: NgxLiveViewService;
//   let testBedMatDialog: MatDialog;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [EventCardComponent, EventDetailsComponent],
//       imports: [MatDialogModule, HttpClientModule, BrowserAnimationsModule, MatMenuModule, TranslateModule.forRoot({
//         loader: {
//           provide: TranslateLoader,
//           useFactory: (createTranslateLoader),
//           deps: [HttpClient],
//         },
//         defaultLanguage: 'English',
//       }),],
//       providers: [NgxLiveViewService, MatDialog, TranslateService],

//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(EventCardComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//     testBedNgxLiveViewService = TestBed.inject(NgxLiveViewService);
//     testBedMatDialog = TestBed.inject(MatDialog);

//   });



//   it('should be created', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should check the service', () => {
//     expect(testBedNgxLiveViewService instanceof NgxLiveViewService).toBeTruthy();
//   });

//   it('should return the value of a property when given a valid key and event', () => {

//     const event: IEventCard = {
//       EventId: 1,
//       DeviceName: 'Device A',
//       EventName: 'Event A',
//       EventTime: '2020-03-14T05:34:00.000Z',
//       Properties: [
//         { key: 'speed', value: '100' },
//         { key: 'color', value: 'red' },
//       ],
//       Images: [],
//     };

//     console.log(component);

//     // Test case 1: Check if the function returns the correct value of the property
//     let actualValue = component.getPropertyValue("speed", event);/* A variable that is used to store
//     the expected value. */
    
//     let expectedValue = event.Properties[0].value;

//     expect(actualValue).toBe(expectedValue);

//     //Test case 2: Check if the function returns the incorrect value of the property

//     actualValue = component.getPropertyValue("color", event);
//     expectedValue = event.Properties[0].value;

//     expect(actualValue).not.toBe(expectedValue);

//   });

//   it('should check the "contains" condition correctly', () => {
//     const containsResult = component.checkConditionOnFilter('contains', 'apple', 'pp');
//     expect(containsResult).toEqual(true);
//   });

//   it('should check the "not contains" condition correctly', () => {
//     const notContainsResult = component.checkConditionOnFilter('not contains', 'apple', 'pp');
//     expect(notContainsResult).toEqual(false);
//   });

//   it('should check the "equal" condition correctly', () => {
//     const equalResult = component.checkConditionOnFilter('equal', 'apple', 'apple');
//     expect(equalResult).toEqual(true);
//   });

//   it('should check the "not equal" condition correctly', () => {
//     const notEqualResult = component.checkConditionOnFilter('not equal', 'apple', 'apples');
//     expect(notEqualResult).toEqual(true);
//   });

//   it('should check the "greater than" condition correctly', () => {
//     const greaterThanResult = component.checkConditionOnFilter('greater than', 4, 2);
//     expect(greaterThanResult).toEqual(true);
//   });

//   it('should check the "smaller than" condition correctly', () => {
//     const smallerThanResult = component.checkConditionOnFilter('smaller than', 4, 2);
//     expect(smallerThanResult).toEqual(false);
//   });

//   describe('applyConditionAsPerType', () => {
//     let condition: string;
//     let eventdata: any;
//     let filterData: any;
//     let filterMatched: any;

//     beforeEach(() => {
//       condition = 'contains';
//       eventdata = 'Example data';
//       filterData = [
//         'Example data',
//         'Test data 2',
//         'Another example',
//         'example data 2'

//       ];
//       filterMatched = {
//         value: 0
//       };
//     });

//     it('should be able to handle data of type string as input', () => {
//       component.applyConditionAsPerType(condition, eventdata, 'example data', filterMatched);
//       expect(filterMatched.value).toBe(1);
//     });

//     it('should be able to handle data of type array as input', () => {
//       component.applyConditionAsPerType(condition, eventdata, filterData, filterMatched);
//       expect(filterMatched.value).toBe(1);
//     });
//   });

//   it('test for EventDetailsComponent Dialog creation', () => {

//     const dialogRef = testBedMatDialog.open(EventDetailsComponent, {
//       data: {
//         event: {
//           EventId: 1,
//           DeviceName: 'Device A',
//           EventName: 'Event A',
//           EventTime: '2020-03-14T05:34:00.000Z',
//           Properties: [
//             { key: 'speed', value: '100' },
//             { key: 'color', value: 'red' },
//           ],
//           Images: []
//         },
//         eventId : 7
//       }});

//     expect(dialogRef.componentInstance).toBeTruthy();
//   });


//   it('should pass the correct data to the dialog', () => {
//     // Setup
//     const testEvent = {
//       EventId: 4,
//       DeviceName: 'Device A',
//       EventName: 'Event A',
//       EventTime: '2020-03-14T05:34:00.000Z',
//       Properties: [
//         { key: 'speed', value: '100' },
//         { key: 'color', value: 'red' },
//       ],
//       Images: []
//     };

//     const eventCards =[
//       {
//       EventId: 3,
//       DeviceName: 'Device B',
//       EventName: 'Event B',
//       EventTime: '2020-03-14T05:34:00.000Z',
//       Properties: [  { key: 'speed', value : '100' }, { key: 'color', value: 'red' }],
//       Images: [] 
//     },
//     {
//       EventId: 2,
//       DeviceName: 'Device c',
//       EventName: 'Event c',
//       EventTime: '2020-03-14T05:34:00.000Z',
//       Properties: [  { key: 'speed', value : '100' }, { key: 'color', value: 'red' }],
//       Images: [] 
//     },
//     {
//       EventId: 4,
//       DeviceName: 'Device A',
//       EventName: 'Event A',
//       EventTime: '2020-03-14T05:34:00.000Z',
//       Properties: [  { key: 'speed', value : '100' }, { key: 'color', value: 'red' }],
//       Images: []     
//     }
//   ]
//     spyOn(testBedMatDialog, 'open').and.callThrough();

//     // Invoke
//     component.showEventDetails(testEvent);

//     // Assertion
//     const expectedData = {
//       event: testEvent,
//       eventId: eventCards.indexOf(testEvent),

//     }
//     expect(testBedMatDialog.open).toHaveBeenCalledWith(EventDetailsComponent, {
//       panelClass: 'mail-compose-dialog',
//       data: expectedData
//     });
//   });

  


// });
