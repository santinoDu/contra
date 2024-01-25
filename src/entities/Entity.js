import { AudioBoard } from '@/loaders/audioBoard.js';

export const entityType = {
  enemy: 2,
  allies: 1,
}

export class Entity{
  constructor() {
    // this.audio = new AudioBoard();
    this.events = []
    this.x = 0
    this.y = 0
    this.traits = {}
    this.hp = 1;
    this.remove = false
  }

  get rect() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
  }

  addTrait(name, trait) {
    this.traits[name] = trait
  }

  getTrait(name) {
    return this.traits[name]
  }

  getAllTraits() {
    return Object.keys(this.traits).map(key => this.getTrait(key))
  }

  update(ctx, keyboard) {
    Object.keys(this.traits).forEach(key => {
      this.traits[key].update(this, ctx, keyboard)
    });
    this.update(ctx, keyboard);
  }
}