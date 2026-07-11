export function nowDate() {
  return new Date();
}

export function diffMs(start: Date, end = new Date()) {
  return Math.max(0, end.getTime() - start.getTime());
}
