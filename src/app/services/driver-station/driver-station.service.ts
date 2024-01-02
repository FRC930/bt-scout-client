import { Injectable } from '@angular/core';
import { KeyValueStorage } from '@ionic-enterprise/secure-storage/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Station } from 'src/app/shared/models/message-payloads/ds_assign.payload';
import { RequestResponsePayload } from 'src/app/shared/models/message-payloads/request_response.payload';

@Injectable({
  providedIn: 'root',
})
export class DriverStationService {
  defaultStation: Station = { team: '000', station: 'Loading...' };

  private _assignment: BehaviorSubject<Station> = new BehaviorSubject<Station>(this.defaultStation);
  public readonly assignment: Observable<Station> = this._assignment.asObservable();

  private _approved: BehaviorSubject<RequestResponsePayload | null> = new BehaviorSubject<RequestResponsePayload | null>(null);
  public readonly approved: Observable<RequestResponsePayload | null> = this._approved.asObservable();

  constructor(private storage: KeyValueStorage) {
    this.getAssignment().then((assignment) => this._assignment.next(assignment));
  }

  async getAssignment(): Promise<Station> {
    const assignment = await this.storage.get('assignment');
    if (assignment) return assignment;
    else return this.defaultStation;
  }

  updateAssignment(assignment: Station) {
    this._assignment.next(assignment);
    this.storage.set('assignment', assignment);
  }

  updateApproval(approval: RequestResponsePayload) {
    this._approved.next(approval);
  }

  clearApproval() {
    this._approved.next(null);
  }
}
