import { Injectable } from '@angular/core';

import { AudioUtilService } from '../audio-util/audio-util.service';

@Injectable()
export class RecorderService {

  constructor() { }

  init() {
    let Recorder = function (source, cfg) {
      let config = cfg || {};
      let bufferLen = config.bufferLen || 4096;
      let numChannels = config.numChannels || 2;
      this.context = source.context;
      this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, bufferLen, numChannels, numChannels);
      this._audioUtil = new AudioUtilService();
      this._audioUtil.init({ sampleRate: this.context.sampleRate, numChannels: numChannels });

      let recording = false, currCallback;

      this.node.onaudioprocess = (e) => {
        if (!recording) return;
        let buffer = [];
        for (let channel = 0; channel < numChannels; channel++) {
          buffer.push(e.inputBuffer.getChannelData(channel));
        }
        this._audioUtil.record(buffer);
      }

      this.record = function () {
        recording = true;
      }

      this.stop = function () {
        recording = false;
      }

      this.exportWAV = (cb, type) => {
        currCallback = cb || config.callback;
        type = type || config.type || 'audio/wav';
        if (!currCallback) throw new Error('Callback not set');
        currCallback(this._audioUtil.exportWAV(type));
      }

      source.connect(this.node);
      this.node.connect(this.context.destination);    //this should not be necessary

    };

    (<any>window).Recorder = Recorder;
  }

}