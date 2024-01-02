import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchScoutPage } from './match-scout.page';

const routes: Routes = [
  {
    path: '',
    component: MatchScoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchScoutPageRoutingModule {}
