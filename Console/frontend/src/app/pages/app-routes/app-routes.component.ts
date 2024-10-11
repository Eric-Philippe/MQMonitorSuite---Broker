import { Component, Input, OnInit } from '@angular/core';

import { ImportsModule } from 'src/app/imports';
import { PageTemplateComponent } from '../page/page.component';
import { BrokerAppService } from '@service/BrokerApp.service';

@Component({
  standalone: true,
  imports: [ImportsModule, PageTemplateComponent],
  templateUrl: `app-routes.component.html`,
  providers: [BrokerAppService],
})
export class RoutesComponent implements OnInit {
  @Input() isBrokerUp: boolean = true;
  public brokerRoutes: { [key: string]: string }[] = [];
  public origin = 'API';

  constructor(private brokerAppService: BrokerAppService) {}

  async ngOnInit() {
    let brokerRoutesWithOrigin = await this.brokerAppService.getBrokerRoutesWithOrigin();

    this.brokerRoutes = brokerRoutesWithOrigin.map((route) => {
      if (route.key === 'source') {
        this.origin = route.value;
      } else {
        return route;
      }
    });
  }

  getIconFromOrigin(origin: string) {
    switch (origin) {
      case 'API':
        return 'pi pi-cloud';
      case 'Memory':
        return 'pi pi-hdd';
      case 'Memory deprecated':
        return 'pi pi-hdd';
    }
  }
}
