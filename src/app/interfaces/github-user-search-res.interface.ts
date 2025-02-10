import {IGithubUser} from './github-user.interface';

export interface IGithubUserSearchRes {

  total_count: number;
  incomplete_results: boolean;
  items: IGithubUser[];

}
