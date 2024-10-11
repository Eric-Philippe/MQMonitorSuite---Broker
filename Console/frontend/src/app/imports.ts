import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MeterGroupModule } from 'primeng/metergroup';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/calendar';
import { NgModule } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { RouterModule, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { AuthService } from './auth/auth.service';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ChartModule } from 'primeng/chart';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

const primeNgModules = [
  AvatarModule,
  TableModule,
  CommonModule,
  InputTextModule,
  TagModule,
  DropdownModule,
  MultiSelectModule,
  ButtonModule,
  FormsModule,
  CalendarModule,
  StyleClassModule,
  RouterModule,
  RippleModule,
  SidebarModule,
  ReactiveFormsModule,
  MeterGroupModule,
  CardModule,
  TooltipModule,
  InputSwitchModule,
  DialogModule,
  FloatLabelModule,
  InputGroupModule,
  InputGroupAddonModule,
  ChartModule,
  ToastModule,
];

@NgModule({
  imports: primeNgModules,
  exports: primeNgModules,
  providers: [AuthService, Router, MessageService],
})
export class ImportsModule {}
