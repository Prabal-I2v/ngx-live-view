import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { of, Subject, Subscriber } from 'rxjs';
import { NgxLiveViewService } from '../ngx-live-view.service';

import { GridComponent } from './grid.component';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  let testBedNgxLiveViewService: NgxLiveViewService;
  // let gridComponentServiceMock = {
  //   DataSubject : of({} as Event),
  // };
  const testSubject = new Subject<any>();


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GridComponent],
      providers: [ NgxLiveViewService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    
    testBedNgxLiveViewService = TestBed.inject(NgxLiveViewService);
    component.DataSubject = testSubject;
    component.GridConfig =  {
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
    }
    fixture.detectChanges();
  });
  
  it('should create', () => {
    //testSubject.next({data : {}, parendNode : {}})
    expect(component).toBeTruthy();
  });
   
  describe('getNoOfOccupiedGrids', () => {
  
    // Test case when GridArray is empty
    it('should return 0 for empty GridArray', () => {
      const obj = { GridArray: [] };
      expect(component.getNoOfOccupiedGrids.call(obj)).toBe(0);
    });
  
    // Test case when all grid are unoccupied (empty)
    it('should return 0 for all unoccupied grids', () => {
      const obj = { GridArray: ['', '', '', ''] };
      expect(component.getNoOfOccupiedGrids.call(obj)).toBe(0);
    });
  
    // Test case when GridArray contains some occupied grids
    it('should count number of occupied grids', () => {
      const obj = { GridArray: ['', 'X', '', 'O', ''] };
      expect(component.getNoOfOccupiedGrids.call(obj)).toBe(2);
    });
  
  });


  describe('onVideoStarted', () => {
    it('should emit video start event with correct arguments', () => {
      const id = 123;
      const wmode = 'opaque';
      const spy = spyOn(component.videoStartEmitterFromGrid, 'emit');
  
      component.onVideoStarted({ id, wmode });
  
      expect(spy).toHaveBeenCalledWith({ id, wmode });
    });
  });
  
  
});

