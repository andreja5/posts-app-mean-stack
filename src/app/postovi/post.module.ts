import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';

import { KreirajPostComponent } from './kreiraj-post/kreiraj-post.component';
import { ListaPostovaComponent } from './lista-postova/lista-postova.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    KreirajPostComponent,
    ListaPostovaComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class PostModule {}