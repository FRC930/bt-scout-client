import { Injectable } from '@angular/core';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { UnreliableUnorderedChunker } from '../chunker/chunker';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BluetoothService {
  private SERVICE_UUID = '9ac0d564-0930-44d9-a0c4-827bdb63ae40'.toUpperCase();
  private CHAR_MESSAGE_QUEUE_UUID = '9ac0d564-0930-4d3c-b0c8-9816cf5ce4ac'.toUpperCase();

  private mIds = new Set();

  constructor() {}

  public async write(deviceId: string, message: string) {
    console.log('Writing message', message);
    for (const chunk of this.getNewChunker(message)) {
      console.log('Writing chunk', JSON.stringify(chunk));
      await BleClient.writeWithoutResponse(deviceId, this.SERVICE_UUID, this.CHAR_MESSAGE_QUEUE_UUID, new DataView(chunk.buffer));
    }
  }

  public read() {}

  private getNewMessageId(): number {
    let messageId = Math.floor(Math.random() * 10000);
    while (this.mIds.has(messageId)) {
      messageId = Math.floor(Math.random() * 10000);
    }
    this.mIds.add(messageId);
    return messageId;
  }

  private getNewChunker(data: string): UnreliableUnorderedChunker {
    const messageId = this.getNewMessageId();
    const message = this.stringToBytes(data);
    const chunkLength = 250; // Chunk byte length *including* 9 byte header
    return new UnreliableUnorderedChunker(messageId, message, chunkLength);
  }

  private encodedStringToBytes(data: string) {
    var data = atob(data);
    var bytes = new Uint8Array(data.length);
    for (var i = 0; i < bytes.length; i++) {
      bytes[i] = data.charCodeAt(i);
    }
    return bytes;
  }

  private bytesToEncodedString(bytes: number[]) {
    return btoa(String.fromCharCode.apply(null, bytes));
  }

  private stringToBytes(data: string) {
    var bytes = new ArrayBuffer(data.length * 2);
    var bytesUint16 = new Uint16Array(bytes);
    for (var i = 0; i < data.length; i++) {
      bytesUint16[i] = data.charCodeAt(i);
    }
    return new Uint8Array(bytesUint16);
  }

  bytesToString(bytes: number[]) {
    return String.fromCharCode.apply(null, bytes);
  }
}
