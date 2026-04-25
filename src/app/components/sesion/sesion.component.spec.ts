import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SesionesComponent } from './sesion.component';

describe('SesionComponent', () => {
  let component: SesionesComponent;
  let fixture: ComponentFixture<SesionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SesionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SesionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
