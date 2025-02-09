import {TestBed} from '@angular/core/testing';

import {NotificationService} from './notification.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {NotificationComponent} from './notification.component';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    });
    service = TestBed.inject(NotificationService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call MatSnackBar.openFromComponent with the correct parameters', () => {
    service.showNotification('Teste de mensagem', 'success', 5000);

    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(NotificationComponent, {
      duration: 5000,
      data: { message: 'Teste de mensagem', type: 'success' },
      panelClass: ['snackbar--success'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  });

  it('should use "error" as default type if none is provided', () => {
    service.showNotification('Erro padrão');

    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(NotificationComponent, {
      duration: 3000,
      data: { message: 'Erro padrão', type: 'error' },
      panelClass: ['snackbar--error'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  });

  it('should use 3000ms as default duration if none is provided', () => {
    service.showNotification('Mensagem padrão', 'warning');

    expect(snackBarSpy.openFromComponent).toHaveBeenCalledWith(NotificationComponent, {
      duration: 3000,
      data: { message: 'Mensagem padrão', type: 'warning' },
      panelClass: ['snackbar--warning'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  });

});
