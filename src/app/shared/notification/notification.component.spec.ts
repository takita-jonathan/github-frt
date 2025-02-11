import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NotificationComponent} from './notification.component';
import {CommonModule} from '@angular/common';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {By} from '@angular/platform-browser';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let snackBarRefSpy: jasmine.SpyObj<MatSnackBarRef<NotificationComponent>>;

  beforeEach(async () => {
    snackBarRefSpy = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatIconModule],
      providers: [
        NotificationComponent,
        { provide: MAT_SNACK_BAR_DATA, useValue: { message: 'Teste de mensagem', type: 'success' } },
        { provide: MatSnackBarRef, useValue: snackBarRefSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display the message correctly', () => {
    const messageElement = fixture.debugElement.query(By.css('.notification__message')).nativeElement;
    expect(messageElement.textContent).toContain('Teste de mensagem');
  });

  it('should have the correct class based on the notification type', () => {
    const containerElement = fixture.debugElement.query(By.css('.notification')).nativeElement;
    expect(containerElement.classList).toContain('notification--success');
  });

  it('should close the snackbar when clicking the close button', () => {
    const closeButton = fixture.debugElement.query(By.css('.notification__close'));
    closeButton.triggerEventHandler('click', null);
    expect(snackBarRefSpy.dismiss).toHaveBeenCalled();
  });

});
