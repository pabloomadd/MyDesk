import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobnavComponent } from './mobnav.component';

describe('MobnavComponent', () => {
  let component: MobnavComponent;
  let fixture: ComponentFixture<MobnavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobnavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
