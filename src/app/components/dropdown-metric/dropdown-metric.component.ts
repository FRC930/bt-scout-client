import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { MetricValueMap } from '../../shared/models/metric.model';
import { DropdownMetricParams } from './dropdown-metric.model';

@Component({
  selector: 'app-dropdown-metric',
  templateUrl: './dropdown-metric.component.html',
  styleUrls: ['./dropdown-metric.component.scss'],
})
export class DropdownMetricComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild('editOptionModal') editOptionModal!: IonModal;

  @Input() params: DropdownMetricParams = { buttonText: 'Select', id: 'dropdown', name: 'Dropdown', options: [] };
  @Input() valueMap: MetricValueMap = {};
  @Input() inBuilder: boolean = false;
  @Output() builderUpdated: EventEmitter<DropdownMetricParams> = new EventEmitter<DropdownMetricParams>();
  @Output() metricUpdated: EventEmitter<MetricValueMap> = new EventEmitter<MetricValueMap>();

  public selectedOption: string = '';

  public paramsInitial: DropdownMetricParams;
  public editingOptionIndex: number = 0;
  public editOptionValue: string = '';

  constructor() {
    this.paramsInitial = { ...this.params };
  }

  ngOnInit() {
    this.paramsInitial = { ...this.params };
    this.selectedOption = this.valueMap[this.params.id] || '';
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.metricUpdated.emit({ [this.params.id]: option });
  }

  containerClick() {
    if (!this.inBuilder) return;

    this.modal.present();
  }

  confirm() {
    this.modal.dismiss();
  }

  cancel() {
    this.params = { ...this.paramsInitial };
    this.modal.dismiss();
  }

  editOption(index: number) {
    this.editingOptionIndex = index;

    this.editOptionValue = this.params.options[index];
    this.editOptionModal.present();
  }

  addOption() {
    this.params.options.push('New Option');

    this.editingOptionIndex = this.params.options.length - 1;
    this.editOptionValue = 'New Option';
    this.editOptionModal.present();
  }

  confirmEditOption() {
    this.params.options[this.editingOptionIndex] = this.editOptionValue;
    this.editOptionModal.dismiss();
  }

  cancelEditOption() {
    if (this.editOptionValue === 'New Option') {
      this.params.options.splice(this.editingOptionIndex, 1);
    }

    this.editOptionModal.dismiss();
  }

  deleteOption(index: number | undefined = undefined) {
    const i = index || this.editingOptionIndex;
    this.params.options.splice(i, 1);
    this.editOptionModal.dismiss();
  }
}
