import { Component } from '@angular/core';

import { ImportsModule } from 'src/app/imports';
import { PageTemplateComponent } from '../page/page.component';
import { REFRESH_TIME } from 'src/conf/env';

@Component({
  standalone: true,
  imports: [ImportsModule, PageTemplateComponent],
  styleUrls: ['./preferences.component.scss'],
  templateUrl: './preferences.component.html',
})
export class PreferencesComponent {
  public REFRESH_TIME_SECONDS = REFRESH_TIME / 1000;

  public destinationInfoOnHover = localStorage.getItem('destinationInfoOnHover') != 'false';

  public messageBoxOnHover = localStorage.getItem('messageBoxOnHover') != 'false';

  public autoRefreshLogs = localStorage.getItem('autoRefreshLogs') != 'false';

  toggleDestinationInfoOnHover() {
    localStorage.setItem('destinationInfoOnHover', this.destinationInfoOnHover.toString());
  }

  toggleMessageBoxOnHover() {
    localStorage.setItem('messageBoxOnHover', this.messageBoxOnHover.toString());
  }

  toggleAutoRefreshLogs() {
    localStorage.setItem('autoRefreshLogs', this.autoRefreshLogs.toString());
  }
}
