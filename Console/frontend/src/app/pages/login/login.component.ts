import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ImportsModule } from 'src/app/imports';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  protected loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  // Redirect on dashboard if the user isLoggedIn
  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe((data: any) => {
        if (this.authService.isLoggedIn()) {
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }
}
