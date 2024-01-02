import { Metric } from './metric.model';

export enum ScoutingFormType {
  Match,
  Pit,
}

export interface ScoutingForm {
  type: ScoutingFormType;
  name: string;
  id: string;
  isDefault: boolean;
  metrics: Metric[];
}
