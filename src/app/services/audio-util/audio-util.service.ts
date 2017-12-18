import { Injectable } from '@angular/core';

@Injectable()
export class AudioUtilService {

  private recLength = 0;
  private recBuffers = [];
  private sampleRate;
  private numChannels;

  /** Private Methods **/

  initBuffers() {
    for (let channel = 0; channel < this.numChannels; channel++) {
      this.recBuffers[channel] = [];
    }
  }

  mergeBuffers(recBuffers, recLength) {
    let result = new Float32Array(recLength);
    let offset = 0;
    for (let i = 0; i < recBuffers.length; i++) {
      result.set(recBuffers[i], offset);
      offset += recBuffers[i].length;
    }
    return result;
  }

  interleave(inputL, inputR) {
    let length = inputL.length / 4;
    let result = new Float32Array(length);

    let index = 0, inputIndex = 0;

    while (index < length) {
      result[index++] = 0.25 * (inputL[inputIndex++] + inputL[inputIndex++] +
        inputL[inputIndex++] + inputL[inputIndex++]);
    }

    return result;
  }

  floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++ , offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  }

  writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  encodeWAV(samples) {
    let buffer = new ArrayBuffer(44 + samples.length * 2);
    let view = new DataView(buffer);

    /* RIFF identifier */
    this.writeString(view, 0, 'RIFF');
    /* RIFF chunk length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    this.writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    this.writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, 1, true);
    /* sample rate */
    view.setUint32(24, this.sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, this.sampleRate * 4, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, this.numChannels * 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    this.writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    this.floatTo16BitPCM(view, 44, samples);

    return view;
  }

  /** Public Methods **/

  init(config?) {
    this.sampleRate = 11025;
    this.numChannels = config.numChannels || 2;
    this.initBuffers();
  }

  record(inputBuffer) {
    for (let channel = 0; channel < this.numChannels; channel++) {
      this.recBuffers[channel].push(inputBuffer[channel]);
    }
    this.recLength += inputBuffer[0].length;
  }

  exportWAV(type) {
    let buffers = [];
    let interleaved;
    for (let channel = 0; channel < this.numChannels; channel++) {
      buffers.push(this.mergeBuffers(this.recBuffers[channel], this.recLength));
    }
    if (this.numChannels === 2) {
      interleaved = this.interleave(buffers[0], buffers[1]);
    } else {
      interleaved = buffers[0];
    }
    let dataview = this.encodeWAV(interleaved);
    let audioBlob = new Blob([dataview], { type: type });

    return audioBlob;
  }

}
