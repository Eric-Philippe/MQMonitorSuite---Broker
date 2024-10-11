import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';

import { Sidebar } from 'primeng/sidebar';
import { ImportsModule } from 'src/app/imports';
import { BrokerLogsService } from '@service/BrokerLogs.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ImportsModule],
  providers: [BrokerLogsService],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  public authService = inject(AuthService);
  public router = inject(Router);
  public brokerLogsService = inject(BrokerLogsService);

  public username = localStorage.getItem('name');
  public alertCount = 0;

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  ngOnInit(): void {
    this.brokerLogsService.getRecentErrorBrokerLogs().then((logs) => {
      this.alertCount = logs.length;
    });
  }

  isActive(url: string): boolean {
    return this.router.url === url;
  }

  closeCallback(e: Event): void {
    this.sidebarRef.close(e);
  }

  disconnect(): void {
    console.log('disconnect');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.altKey && event.key === 'Enter') {
      this.toggleSidebar();
    }

    if (event.altKey && event.key === 'a') {
      this.router.navigate(['/alerts']);
    }

    if (event.altKey && event.key === 'd') {
      this.router.navigate(['/dashboard']);
    }

    if (event.altKey && event.key === 'r') {
      this.router.navigate(['/settings/routes']);
    }

    if (event.altKey && event.key === 'p') {
      this.router.navigate(['/settings/preferences']);
    }
  }

  sidebarVisible: boolean = false;
}
