import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoadingService} from './loading.service';
import {CommonModule} from '@angular/common';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {Subject} from 'rxjs';

@Component({
  selector: 'ghf-loading',
  imports: [
    CommonModule,
    MatProgressSpinner
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent implements OnInit, OnDestroy {

  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingService.loading$.subscribe(status => this.isLoading = status);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
