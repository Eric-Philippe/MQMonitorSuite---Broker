import { Component, Input, OnInit } from '@angular/core';

import { ImportsModule } from 'src/app/imports';
import { PageTemplateComponent } from '../page/page.component';
import { BrokerAppService } from '@service/BrokerApp.service';

@Component({
  standalone: true,
  imports: [ImportsModule, PageTemplateComponent],
  templateUrl: './app-properties.component.html',
  providers: [BrokerAppService],
})
export class AppPropsComponent implements OnInit {
  @Input() isBrokerUp: boolean = true;
  public brokerRoutingProperties: { [key: string]: string }[] = [];

  constructor(private brokerAppService: BrokerAppService) {}

  async ngOnInit() {
    this.brokerRoutingProperties = await this.brokerAppService.getBrokerAppProperties();
  }

  getIcon(key: string) {
    switch (true) {
      case key.includes('.CHANNEL'):
        return 'pi pi-server';
      case key.includes('.HOST'):
        return 'pi pi-home';
      case key.includes('.QM'):
        return 'pi pi-list';
      case key.includes('.PORT'):
        return 'pi pi-compass';
      case key.includes('.Q'):
        return 'pi pi-briefcase';
      case key.includes('.PROTOCOL'):
        return 'pi pi-print';
    }
  }
}
