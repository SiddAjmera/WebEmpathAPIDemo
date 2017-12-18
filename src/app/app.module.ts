import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AudioUtilService } from 'app/services/audio-util/audio-util.service';
import { RecorderService } from 'app/services/recorder/recorder.service';
import { WebEmpathService } from './services/web-empath/web-empath.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AudioUtilService, RecorderService, WebEmpathService],
  bootstrap: [AppComponent]
})
export class AppModule { }
