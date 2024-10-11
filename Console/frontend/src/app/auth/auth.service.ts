import { HttpClient } from '@angular/common/http';
import { afterNextRender, inject, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(HttpClient);
  baseUrl = 'http://localhost:3000/api';

  login(data: any) {
    return this.httpClient.post(`${this.baseUrl}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('authUser', data.username);
        localStorage.setItem('name', res.name);
      })
    );
  }

  logout() {
    localStorage.removeItem('authUser');
    localStorage.removeItem('name');
  }

  isLoggedIn() {
    return !!localStorage.getItem('authUser');
  }

  constructor() {}
}
