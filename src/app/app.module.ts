import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MessagingService } from './services/messaging/messaging.service';
import { KeyValueStorage } from '@ionic-enterprise/secure-storage/ngx';
import { TabsComponent } from './tabs.component';
import { ComponentsModule } from './components/components.module';
import { MessageBrokerService } from './services/messaging/message-broker';

@NgModule({
  declarations: [AppComponent, TabsComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ComponentsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, MessagingService, KeyValueStorage, MessageBrokerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
