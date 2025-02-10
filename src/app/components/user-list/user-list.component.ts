import {Component, OnDestroy, ViewChild} from '@angular/core';
import {GithubService} from '../../services/http/github.service';
import {UserService} from '../../services/user.service';
import {BehaviorSubject, combineLatest, map, Observable, Subject, switchMap, takeUntil} from 'rxjs';
import {IGithubUser} from '../../interfaces/github-user.interface';
import {UserListItemComponent} from './user-list-item/user-list-item.component';
import {CommonModule} from '@angular/common';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'ghf-user-list',
  imports: [
    UserListItemComponent,
    CommonModule,
    MatPaginatorModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnDestroy {

  users$: Observable<IGithubUser[]> = new BehaviorSubject<IGithubUser[]>([]);
  totalUsers: number = 0;

  private pageSubject = new BehaviorSubject<{page: number, pageSize: number}>({ page: 1, pageSize: 10 });
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private githubService: GithubService,
    private userService: UserService,
  ) {
    this.users$ = combineLatest([this.userService.search$, this.pageSubject]).pipe(
      switchMap(([query, { page, pageSize }]) => {
        return this.githubService.searchUsers(query, page, pageSize).pipe(
          map(response => {
            this.totalUsers = response.total_count;
            return response.items;
          })
        );
      })
    );

    this.userService.search$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.paginator?.firstPage();
      });
  }

  onPageChange(event: PageEvent) {
    this.pageSubject.next({ page: event.pageIndex + 1, pageSize: event.pageSize });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
