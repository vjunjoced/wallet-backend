export class ResponseApp<T> {
  data?: T;
  total?: number;

  constructor(data: T = null) {
    this.data = data;
  }
}
