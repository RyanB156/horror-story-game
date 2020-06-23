import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomMapComponent } from './room-map.component';

describe('RoomMapComponent', () => {
  let component: RoomMapComponent;
  let fixture: ComponentFixture<RoomMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
