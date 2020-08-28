export class AppError {
  public code: string;
  public msg: string;
  public httpStatus: number;

  constructor(code: string, httpStatus: number, msg: string = '') {
    this.code = code;
    this.msg = msg;
    this.httpStatus = httpStatus;
  }
}
