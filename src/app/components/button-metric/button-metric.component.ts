import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ButtonMetricParams } from './button-metric.model';
import { IonModal } from '@ionic/angular';
import { MetricType, MetricValueMap } from '../../shared/models/metric.model';

@Component({
  selector: 'app-button-metric',
  templateUrl: './button-metric.component.html',
  styleUrls: ['./button-metric.component.scss'],
})
export class ButtonMetricComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  @Input() params: ButtonMetricParams = { buttonText: 'Button', id: 'button', name: 'Button' };
  @Input() valueMap: MetricValueMap = {};
  @Input() inBuilder: boolean = false;
  @Output() builderUpdated: EventEmitter<ButtonMetricParams> = new EventEmitter<ButtonMetricParams>();
  @Output() metricUpdated: EventEmitter<MetricValueMap> = new EventEmitter<MetricValueMap>();

  public counter = 0;

  public paramsInitial: ButtonMetricParams;

  constructor() {
    this.paramsInitial = { ...this.params };
  }

  ngOnInit() {
    this.paramsInitial = { ...this.params };
    this.counter = this.valueMap[this.params.id] || 0;
  }

  increment() {
    this.metricUpdated.emit({ [this.params.id]: ++this.counter });
  }

  decrement() {
    this.metricUpdated.emit({ [this.params.id]: --this.counter });
  }

  buttonClick() {
    if (this.inBuilder) return;
    this.metricUpdated.emit({ [this.params.id]: ++this.counter });
  }

  containerClick() {
    if (!this.inBuilder) return;

    this.modal.present();
  }

  confirm() {
    console.log(JSON.stringify(this.params));
    this.modal.dismiss();
  }

  cancel() {
    this.params = { ...this.paramsInitial };
    this.modal.dismiss();
  }

  onWillDismiss(event: any) {
    console.log('onWillDismiss', event);
  }
}
