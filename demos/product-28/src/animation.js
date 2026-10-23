export const clamp = value => Math.max(0, Math.min(1, value));
export const smoothstep = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
export function partPosition(part, progress) {
  const t = smoothstep((progress - part.interval[0]) / (part.interval[1] - part.interval[0]));
  return part.exploded.map((value, axis) => value + (part.assembled[axis] - value) * t);
}
export function stageAt(progress, stageCount = 4) {
  return progress <= 0 ? 0 : Math.min(stageCount, Math.ceil(progress * stageCount));
}
export class AssemblyState {
  progress = 0;
  target = 0;
  playing = false;
  reducedMotion = false;
  constructor(stageCount = 4) {
    if (!Number.isInteger(stageCount) || stageCount < 1) throw new RangeError('A product needs at least one stage.');
    this.stageCount = stageCount;
  }
  seek(value) { this.progress = this.target = clamp(value); this.playing = false; }
  go(value) {
    this.target = clamp(value);
    this.playing = false;
    if (this.reducedMotion) this.seek(this.target);
  }
  step(direction) {
    const position = this.progress * this.stageCount;
    this.go((direction > 0 ? Math.floor(position + 1e-7) + 1 : Math.ceil(position - 1e-7) - 1) / this.stageCount);
  }
  togglePlay() {
    if (this.reducedMotion) return;
    if (this.playing) { this.seek(this.progress); return; }
    if (this.progress >= 1) this.seek(0);
    this.target = 1;
    this.playing = true;
  }
  tick(delta) {
    const distance = this.target - this.progress;
    const travel = Math.min(Math.abs(distance), Math.max(0, Math.min(delta, .05)) / 6);
    this.progress = clamp(this.progress + Math.sign(distance) * travel);
    if (Math.abs(this.target - this.progress) < 1e-8) {
      this.progress = this.target;
      this.playing = false;
    }
  }
}
