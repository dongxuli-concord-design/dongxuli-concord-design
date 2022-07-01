class XcGmInterval {
  low;
  high;

  constructor({low, high}) {
    this.low = low;
    this.high = high;
  }

  static fromJSON({json}) {
    const interval = new XcGmInterval({low: json.low, high: json.high});
    return interval;
  }

  toJSON() {
    return {
      low: this.low,
      high: this.high,
    }
  }
}
