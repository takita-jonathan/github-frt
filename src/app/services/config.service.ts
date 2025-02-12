import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any = {};

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {
    try {
      this.config = await firstValueFrom(this.http.get('/assets/config.json'));
    } catch (error) {
      console.error('Erro ao carregar config.json:', error);
      this.config = {};
    }
  }

  getConfig(): any {
    return this.config;
  }
}
