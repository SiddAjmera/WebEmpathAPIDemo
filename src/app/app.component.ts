import { Component, ChangeDetectorRef, OnInit } from '@angular/core';

import { environment } from 'environments/environment.prod';
import { RecorderService } from './services/recorder/recorder.service';
import { WebEmpathService } from './services/web-empath/web-empath.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  recognition; audioContext; analyser; recorder; emotionData;

  constructor(
    private _recorderService: RecorderService,
    private _webEmpathService: WebEmpathService,
    private _cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.recognition = new (<any>window).webkitSpeechRecognition();
    this.audioContext = new AudioContext;
    this.analyser = this.audioContext.createAnalyser();
    this._recorderService.init.call(this);
  }

  startRecognition() {
    this.recognition.start();
    this.analyzeVoice();
    this.recognition.onresult = event => {
      this.recorder.stop();
      this.recorder.exportWAV((blob) => {
        let formData: FormData = new FormData();
        formData.append('apikey', environment.apiKeys.webEmpath);
        formData.append('wav', blob);
        this._webEmpathService.getUserEmotion(formData).subscribe(response => {
          this.emotionData = response;
          this._cdRef.detectChanges();
        });
      }, 'audio/wav');
    }
  }

  analyzeVoice() {
    navigator.getUserMedia(
      {video: false, audio: true},
      stream => {
        let input = this.audioContext.createMediaStreamSource(stream);
        this.recorder = new (<any>window).Recorder(input);
        input.connect(this.analyser);
        this.recorder.record();
      },
      e => {
        alert("Voice input is not available.");
      }
    );
  }

}