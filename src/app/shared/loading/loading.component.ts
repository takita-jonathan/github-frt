import {Component} from '@angular/core';
import {LoadingService} from './loading.service';
import {CommonModule} from '@angular/common';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'ghf-loading',
  imports: [
    CommonModule,
    MatProgressSpinner
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {

  isLoading = false;

  constructor(private loadingService: LoadingService) {
    this.loadingService.loading$.subscribe(status => this.isLoading = status);
  }

}
