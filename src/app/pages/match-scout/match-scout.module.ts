import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchScoutPageRoutingModule } from './match-scout-routing.module';

import { MatchScoutPage } from './match-scout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchScoutPageRoutingModule
  ],
  declarations: [MatchScoutPage]
})
export class MatchScoutPageModule {}
