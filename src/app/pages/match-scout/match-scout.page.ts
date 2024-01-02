import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ButtonMetricComponent } from '../../components/button-metric/button-metric.component';
import { DropdownMetricComponent } from '../../components/dropdown-metric/dropdown-metric.component';
import { MetricType, MetricValueMap } from '../../shared/models/metric.model';
import { Subject, takeUntil } from 'rxjs';
import { ScoutingForm, ScoutingFormType } from '../../shared/models/scouting-form.model';
import { ScoutingFormService } from '../../services/db/scouting-form.service';
import { MessagingService } from 'src/app/services/messaging/messaging.service';
import { DriverStationService } from 'src/app/services/driver-station/driver-station.service';
import { MatchDataPayload } from 'src/app/shared/models/message-payloads/match_data.payload';

@Component({
  selector: 'app-match-scout',
  templateUrl: './match-scout.page.html',
  styleUrls: ['./match-scout.page.scss'],
})
export class MatchScoutPage {
  private closeSubRef: Subject<any> = new Subject();

  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;

  private valueMap: MatchDataPayload = { team: '' };
  public isConnected: boolean = false;

  constructor(private ds: DriverStationService, private msg: MessagingService, private formService: ScoutingFormService) {
    this.formService.forms.pipe(takeUntil(this.closeSubRef)).subscribe((forms) => {
      const form = forms.find((f) => (ScoutingFormType[f.type] as any) === ScoutingFormType.Match && f.isDefault) || forms[0];
      if (form) this.transformScoutingForm(form);
    });

    this.formService.getForms().then((forms) => {
      const form = forms.find((f) => (ScoutingFormType[f.type] as any) === ScoutingFormType.Match && f.isDefault) || forms[0];
      if (form) this.transformScoutingForm(form);
    });

    this.msg.sendRequestFormsMessage();

    this.ds.assignment.pipe(takeUntil(this.closeSubRef)).subscribe((assignment) => {
      console.log('assignment', JSON.stringify(assignment));
      this.valueMap = { ...this.valueMap, ...assignment };
      console.log('valueMap', JSON.stringify(this.valueMap));
    });

    this.msg.isBluetoothConnected.pipe(takeUntil(this.closeSubRef)).subscribe((isConnected) => {
      this.isConnected = isConnected;
    });
  }

  componentFromMetricType(type: MetricType): any {
    switch (type) {
      case MetricType.Button:
        return ButtonMetricComponent;
      case MetricType.Dropdown:
        return DropdownMetricComponent;
    }
  }

  transformScoutingForm(form: ScoutingForm) {
    this.container.clear();
    return form.metrics.map((metric) => {
      const component = this.componentFromMetricType(metric.type);

      const viewContainerRef = this.container.createComponent(component) as any;
      viewContainerRef.instance.params = metric.params;
      viewContainerRef.instance.valueMap = this.valueMap;
      viewContainerRef.instance.metricUpdated.pipe(takeUntil(this.closeSubRef)).subscribe((event: MetricValueMap) => {
        this.valueMap = { ...this.valueMap, ...event };
        this.msg.sendDataMessage(this.valueMap);
      });
    });
  }

  connect() {
    this.msg.communicate();
  }

  disconnect() {
    this.msg.disconnect();
  }
}
