import {Routes} from '@angular/router';
import {UserListComponent} from './components/user-list/user-list.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {RepoListComponent} from './components/repo-list/repo-list.component';

export const routes: Routes = [
  { path: '', component: UserListComponent },
  {
    path: ':username',
    component: UserProfileComponent,
    children: [
      { path: '', component: RepoListComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
