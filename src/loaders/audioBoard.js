import { map, from } from 'rxjs'

export class AudioBoard {
  constructor(context) {
    this.buffers = {};
    this.context = context;
  }

  addAudio(name, buffer) {
    this.buffers[name] = buffer;
  }

  playAudio(name, loop, sleep) {
    const buffer = this.buffers[name];

    if (sleep && buffer.pause) {
       buffer.pause();
    }
    
    const source = this.context.createBufferSource();
    source.connect(this.context.destination);
    source.buffer = buffer;
  
    source.start(0);
    source.loop = !!loop;

    buffer.pause = () => {
      source.stop(0)
    }
    
  }

  pauseAll() {
    Object.values(this.buffers).forEach(buffer => {
      buffer.pause();
    })
  }
}

export const loadAudioBoard = (audioConfig) => {
  const audioContext = new AudioContext();
  const audioBoard = new AudioBoard(audioContext);
  const promises = Object.keys(audioConfig).map(key => {
    return fetch(audioConfig[key])
      .then(res => res.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(buffer => audioBoard.addAudio(key, buffer))
  });
  return from(Promise.all(promises)).pipe(
    map(() => audioBoard)
  )
}