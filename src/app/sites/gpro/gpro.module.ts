import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GproComponent } from './gpro.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { GproRoutingModule } from './gpro.routing';


@NgModule({
  declarations: [
    GproComponent
  ],
  exports: [
    GproComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    CommonModule,

    GproRoutingModule
  ]
})
export class GproModule { }
