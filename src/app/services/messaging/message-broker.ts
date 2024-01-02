import { Injectable, inject } from '@angular/core';
import { DriverStationService } from '../driver-station/driver-station.service';
import { DSAssignMessage, FormsDataMessage, Message, MessageTopic, RequestResponseMessage } from './messaging.model';
import { Preferences } from '@capacitor/preferences';
import { ScoutingFormService } from '../db/scouting-form.service';

@Injectable({ providedIn: 'root' })
export class MessageBrokerService {
  private brokerMap: Map<MessageTopic, (message: Message<any, any>) => void> = new Map();
  private uid: string = '';

  constructor(private ds: DriverStationService, private scoutingFormService: ScoutingFormService) {
    this.brokerMap.set(MessageTopic.DS_ASSIGN, this.ds_assign.bind(this));
    this.brokerMap.set(MessageTopic.REQUEST_RESPONSE, this.request_response.bind(this));
    this.brokerMap.set(MessageTopic.FORMS_DATA, this.forms_data.bind(this));
  }

  public async handle(message: Message<any, any>) {
    if (this.uid === '') this.uid = (await Preferences.get({ key: 'deviceId' })).value || '';

    console.log(JSON.stringify(message));

    const handler = this.brokerMap.get(message.topic);
    if (handler) handler(message);
    console.log('handled?');
  }

  private ds_assign(message: DSAssignMessage) {
    console.log('ds_assign', JSON.stringify(message));
    if (message.payload) {
      this.ds.updateAssignment(message.payload[this.uid]);
    }
  }

  private request_response(message: RequestResponseMessage) {
    console.log('request_response', JSON.stringify(message));
    if (message.id === this.uid && message.payload) {
      this.ds.updateApproval(message.payload);
    }
  }

  private async forms_data(message: FormsDataMessage) {
    console.log('forms_data yeehaw', JSON.stringify(message));
    console.log('compare', message['id'], this.uid);
    if (message.id === this.uid && message.payload) {
      console.log('woohoo');
      await Promise.all(
        message.payload.map((form) => {
          console.log('form', JSON.stringify(form));
          this.scoutingFormService.addOrUpdateForm(form);
        })
      );
    }
  }
}
