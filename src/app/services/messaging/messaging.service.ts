import { Injectable } from '@angular/core';
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { buildConnectionMessage, buildDataMessage, buildPingMessage, buildRequestApprovalMessage, buildRequestFormsMessage } from './messaging.model';
import { UnreliableUnorderedUnchunker } from '../chunker/unchunker';
import { BluetoothService } from '../bluetooth/bluetooth.service';
import { GetResult, Preferences } from '@capacitor/preferences';
import { MessageBrokerService } from './message-broker';
import { MatchDataPayload } from 'src/app/shared/models/message-payloads/match_data.payload';
import { RequestApprovalPayload } from 'src/app/shared/models/message-payloads/request_approval.payload';
import { RequestFormsPayload } from 'src/app/shared/models/message-payloads/request_forms.payload';
import { switchMap, EMPTY, ReplaySubject, BehaviorSubject, delay, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  private SERVICE_UUID = '9ac0d564-0930-44d9-a0c4-827bdb63ae40'.toUpperCase();
  private CHAR_MESSAGE_QUEUE_UUID = '9ac0d564-0930-4d3c-b0c8-9816cf5ce4ac'.toUpperCase();

  private _isBluetoothConnected = new BehaviorSubject<boolean>(false);
  public readonly isBluetoothConnected: Observable<boolean> = this._isBluetoothConnected.asObservable();
  private messagesToSend = new ReplaySubject<string>();

  private device: BleDevice | undefined;
  private unchunker = new UnreliableUnorderedUnchunker();
  private deviceId: string = '';

  constructor(private ble: BluetoothService, private messageBroker: MessageBrokerService) {
    this.init();
    this.unchunker.onMessage = (message: Uint8Array) => {
      const decodedMessage = new TextDecoder().decode(message);
      console.log('received message', decodedMessage);
      messageBroker.handle(JSON.parse(decodedMessage));
    };

    this._isBluetoothConnected
      .pipe(
        switchMap((isConnected) => (isConnected ? this.messagesToSend : EMPTY)),
        delay(10)
      )
      .subscribe(async (message) => {
        if (this.device) {
          await this.ble.write(this.device.deviceId, message);
        }
      });
  }

  async init() {
    let prefResult: GetResult = await Preferences.get({ key: 'deviceId' });
    console.log('initial pref result', JSON.stringify(prefResult));
    if (!prefResult || !prefResult.value || prefResult.value === '') {
      await Preferences.set({ key: 'deviceId', value: Date.now().toString() });
      prefResult = await Preferences.get({ key: 'deviceId' });
      console.log('updated pref result', JSON.stringify(prefResult));
    }
    this.deviceId = prefResult.value || '';
  }

  async communicate() {
    console.log(this.deviceId, JSON.stringify('deviceid'));

    try {
      await BleClient.initialize();
      this.device = await BleClient.requestDevice({
        services: [this.SERVICE_UUID],
      });

      await BleClient.connect(this.device.deviceId, (deviceId) => this.onDisconnect(deviceId));
      console.log('connected to device', this.device);

      await BleClient.startNotifications(this.device.deviceId, this.SERVICE_UUID, this.CHAR_MESSAGE_QUEUE_UUID, (value) => {
        console.log('received notification chunk', JSON.stringify(value));
        this.unchunker.add(new Uint8Array(value.buffer));
      });

      const connectionMessage = JSON.stringify(buildConnectionMessage(this.deviceId));
      await this.ble.write(this.device.deviceId, connectionMessage);
      this._isBluetoothConnected.next(true);
    } catch (error) {
      console.error('error!!!!!!', error);
    }
  }

  public disconnect() {
    if (this.device) {
      BleClient.disconnect(this.device.deviceId);
    }
  }

  private queueMessage(message: string) {
    this.messagesToSend.next(message);
  }

  private onDisconnect(deviceId: string) {
    this._isBluetoothConnected.next(false);
    console.log('device disconnected', deviceId);
  }

  public async sendPingMessage() {
    const pingMessage = JSON.stringify(buildPingMessage(this.deviceId));
    if (!this.device) return this.queueMessage(pingMessage);
    await this.ble.write(this.device.deviceId, pingMessage);
  }

  public async sendDataMessage(data: MatchDataPayload) {
    const dataMessage = JSON.stringify(buildDataMessage(this.deviceId, data));
    if (!this.device) return this.queueMessage(dataMessage);
    await this.ble.write(this.device.deviceId, dataMessage);
  }

  public async sendRequestApprovalMessage(data: RequestApprovalPayload) {
    const requestApprovalMessage = JSON.stringify(buildRequestApprovalMessage(this.deviceId, data));
    if (!this.device) return this.queueMessage(requestApprovalMessage);
    await this.ble.write(this.device.deviceId, requestApprovalMessage);
  }

  public async sendRequestFormsMessage(data: RequestFormsPayload = {}) {
    console.log('Buidling request forms wheres my id', this.deviceId);
    const requestFormsMessage = JSON.stringify(buildRequestFormsMessage(this.deviceId, data));
    if (!this.device) return this.queueMessage(requestFormsMessage);
    await this.ble.write(this.device.deviceId, requestFormsMessage);
  }
}
