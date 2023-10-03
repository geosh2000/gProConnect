import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cloud9Component } from './cloud9.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Cloud9RoutingModule } from './cloud9.routing';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { C9HomeComponent } from './c9-home/c9-home.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    Cloud9Component,
    CatalogoComponent,
    C9HomeComponent,
  ],
  exports: [
    Cloud9Component,
    CatalogoComponent,
    C9HomeComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    CommonModule,

    SharedModule,

    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,

    Cloud9RoutingModule,
  ]
})
export class Cloud9Module { }
