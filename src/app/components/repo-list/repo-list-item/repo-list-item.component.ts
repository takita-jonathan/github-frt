import {Component, Input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {IGithubRepo} from '../../../interfaces/github-repo.interface';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'ghf-repo-list-item',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './repo-list-item.component.html',
  styleUrl: './repo-list-item.component.scss'
})
export class RepoListItemComponent {

  @Input({required:true}) repo!: IGithubRepo;

  openRepo(url: string) {
    window.open(url, '_blank');
  }

}
