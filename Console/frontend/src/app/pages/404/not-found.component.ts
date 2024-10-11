import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ImportsModule } from 'src/app/imports';

@Component({
  standalone: true,
  templateUrl: './not-found.component.html',
  imports: [ImportsModule],
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
