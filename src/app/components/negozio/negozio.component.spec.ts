import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegozioComponent } from './negozio.component';

describe('NegozioComponent', () => {
  let component: NegozioComponent;
  let fixture: ComponentFixture<NegozioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NegozioComponent]
    });
    fixture = TestBed.createComponent(NegozioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
