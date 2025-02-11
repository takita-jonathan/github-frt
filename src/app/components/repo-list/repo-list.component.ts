import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable, switchMap} from 'rxjs';
import {IGithubRepo} from '../../interfaces/github-repo.interface';
import {ActivatedRoute} from '@angular/router';
import {GithubService} from '../../services/http/github.service';
import {CommonModule} from '@angular/common';
import {RepoListItemComponent} from './repo-list-item/repo-list-item.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormsModule} from '@angular/forms';
import {MatPaginator, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'ghf-repo-list',
  imports: [
    CommonModule,
    RepoListItemComponent,
    MatButtonToggleModule,
    MatChipsModule,
    FormsModule,
    MatPaginator,
  ],
  templateUrl: './repo-list.component.html',
  styleUrl: './repo-list.component.scss'
})
export class RepoListComponent implements OnInit {
  repositories$: Observable<IGithubRepo[]> = new Observable<IGithubRepo[]>();
  totalRepos: number = 0;

  sort: 'stars' | 'name' = 'stars';
  order: 'asc' | 'desc' = 'desc';

  private pageSubject = new BehaviorSubject<{page: number, pageSize: number}>({ page: 1, pageSize: 10 });

  constructor(
    private route: ActivatedRoute,
    private githubService: GithubService
  ) { }

  ngOnInit() {
    this.repositories$ = combineLatest([ this.route.paramMap, this.pageSubject ])
      .pipe(
        map(([params, page]) => {
          const username = params.get('username') || '';
          return { username, page: page.page, pageSize: page.pageSize, sort: this.sort, order: this.order };
        }),
        switchMap(({ username, page, pageSize, sort, order }) => {
          return this.githubService.getUserRepositories(username, page, pageSize, sort, order).pipe(
            map(response => {
              this.totalRepos = response.total_count;
              return response.items;
            })
          );
        })
      );
  }

  onPageChange(event: PageEvent) {
    this.pageSubject.next({ page: event.pageIndex + 1, pageSize: event.pageSize });
  }

  onSortingChange() {
    this.pageSubject.next({ page: 1, pageSize: this.pageSubject.value.pageSize });
  }

}
