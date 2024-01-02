import { Component, OnInit } from '@angular/core';
import { MessagingService } from './services/messaging/messaging.service';
import { KeyValueStorage } from '@ionic-enterprise/secure-storage/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(public messagingService: MessagingService, private storage: KeyValueStorage) {}

  async ngOnInit() {
    await this.storage.create('totally_secure_encryption_key');
  }
}
