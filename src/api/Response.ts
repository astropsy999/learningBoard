import { Base as BaseNotice } from './Notice';
export namespace Base {
  type ResponseBase<Type extends string, Data> = {
    type: Type;
    data: Data;
  };

  type ResponseNoticeData = {
    type: 'ok' | 'info' | 'warning' | 'error';
    message: string;
    title: string;
  };
  type ResponseDataData = any;

  type ResponseNotice = ResponseBase<'notice', ResponseNoticeData>;
  type ResponseData = ResponseBase<'data', ResponseDataData>;

  type ResponseInstance = ResponseNotice | ResponseData;

  export class Response {
    public static parsing(response: ResponseInstance[], handler?: Function) {
      for (const i in response)
        Response.execute(response[i].type, response[i].data, handler);
    }

    private static execute(type: string, data: any, handler?: Function): void {
      if (type) {
        switch (type) {
          case 'data':
            Response.executeHandler(handler, data);
            break;
          case 'notice':
            Response.executeNotice(data);
            break;
        }
      }
    }

    private static executeHandler(
      handler: Function | null,
      data: ResponseDataData,
    ): void {
      if (handler) handler(data);
    }

    private static executeNotice({
      type,
      message,
      title,
    }: ResponseNoticeData): void {
      switch (type) {
        case 'ok':
          BaseNotice.Notice.ok(message, title);
          break;
        case 'info':
          BaseNotice.Notice.info(message, title);
          break;
        case 'warning':
          BaseNotice.Notice.warning(message, title);
          break;
        case 'error':
          BaseNotice.Notice.error(message, title);
          break;
      }
    }
  }
}
