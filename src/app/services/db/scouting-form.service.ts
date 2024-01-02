import { Injectable } from '@angular/core';
import { KeyValueStorage } from '@ionic-enterprise/secure-storage/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScoutingForm, ScoutingFormType } from 'src/app/shared/models/scouting-form.model';

const STORAGE_KEY = 'scouting-forms';

@Injectable({
  providedIn: 'root',
})
export class ScoutingFormService {
  private _forms: BehaviorSubject<ScoutingForm[]> = new BehaviorSubject<ScoutingForm[]>([]);
  public readonly forms: Observable<ScoutingForm[]> = this._forms.asObservable();

  constructor(private storage: KeyValueStorage) {
    this.getForms().then((forms) => this._forms.next(forms));
  }

  async addOrUpdateForm(form: ScoutingForm) {
    const forms = await this.getForms();
    const index = forms.findIndex((f) => f.id === form.id);

    if (index !== -1) {
      return this.updateForm(form);
    } else {
      return this.addForm(form);
    }
  }

  async addForm(form: ScoutingForm) {
    if (form.isDefault) await this.clearDefault(form.type);
    const id = form.id.length > 0 ? form.id : Date.now().toString();
    const forms = await this.getForms();
    forms.push({ ...form, id: id });
    this._forms.next(forms);
    return this.storage.set(STORAGE_KEY, forms);
  }

  async updateForm(form: ScoutingForm) {
    if (form.isDefault) await this.clearDefault(form.type);
    const forms = await this.getForms();
    const index = forms.findIndex((f) => f.id === form.id);
    forms[index] = form;
    this._forms.next(forms);
    return this.storage.set(STORAGE_KEY, forms);
  }

  async getForms(): Promise<ScoutingForm[]> {
    const forms = await this.storage.get(STORAGE_KEY);
    if (forms) return forms;
    else return [];
  }

  async clearDefault(matchType: ScoutingFormType): Promise<any> {
    const forms = await this.getForms();
    return Promise.all(
      forms
        .filter((f) => f.type === matchType)
        .map((f) => ({ ...f, isDefault: false }))
        .map((f) => this.updateForm(f))
    );
  }
}
