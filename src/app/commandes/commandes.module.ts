import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandesComponent } from './components/commandes.component';
import { CommandesRoutingModule } from './commandes-routing.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core-module.module';
import { DetailscommandeComponent } from './components/details/detailscommande.component';
import { UniquePipe } from '../shared/pipe/pipe-unique';
import { FilterPipe } from '../shared/pipe/pipe-filter';
import { OrderByPipe } from '../shared/pipe/pipe-orderby';

@NgModule({
  imports: [
    CommonModule,
    CommandesRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    CommandesComponent,
    DetailscommandeComponent,
    UniquePipe,
    FilterPipe,
    OrderByPipe
  ],
  exports: [
    CommandesComponent,
    RouterModule,
    UniquePipe,
    FilterPipe,
    OrderByPipe
  ]
})
export class CommandesModule { }
