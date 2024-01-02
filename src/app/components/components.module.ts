import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ButtonMetricComponent } from './button-metric/button-metric.component';
import { DropdownMetricComponent } from './dropdown-metric/dropdown-metric.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [ButtonMetricComponent, DropdownMetricComponent],
})
export class ComponentsModule {}
