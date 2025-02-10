import {IGithubUser} from './github-user.interface';

export interface IGithubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: IGithubUser;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
  } | null;
  visibility: string;
  default_branch: string;
}
