import { Base as ResponseBase } from './Response';
export namespace Base {
  type RequestOptionsMethod = 'get' | 'post';
  type RequestOptionsCache =
    | 'default'
    | 'force-cache'
    | 'no-cache'
    | 'no-store'
    | 'only-if-cached'
    | 'reload';
  type RequestOptionsCredentials =
    | 'include'
    | 'omit'
    | 'same-origin'
    | undefined;

  type RequestOptions = {
    method?: RequestOptionsMethod;
    cache?: RequestOptionsCache;
    credentials?: RequestOptionsCredentials;
  };

  export class Request {
    private static XHR(
      url: string,
      data: BodyInit,
      successHandler?: Function,
      alwaysHandler?: Function,
      errorHandler?: Function,
      options?: RequestOptions,
    ) {
      let method: RequestOptionsMethod = 'post';
      let cache: RequestOptionsCache = 'no-cache';
      let credentials: RequestOptionsCredentials = 'include';

      if (options) {
        if (options.method) method = options.method;
        if (options.cache) cache = options.cache;
        if (options.credentials) credentials = options.credentials;
      }

      fetch(url as string, {
        method: method,
        body: data,
        cache: cache,
        credentials: credentials,
      })
        .then(async (response) => {
          let result = await response.json();
          ResponseBase.Response.parsing(result, successHandler);
          if (alwaysHandler) alwaysHandler();
        })
        .catch((error) => {
          if (errorHandler) errorHandler(data, error);
          if (alwaysHandler) alwaysHandler();
          console.error(`Request failed: ${url}`, data, error);
        });
    }

    public static send(
      url: string,
      successHandler?: Function,
      alwaysHandler?: Function,
      errorHandler?: Function,
      options?: RequestOptions,
    ) {
      Request.XHR(
        url,
        '',
        successHandler,
        alwaysHandler,
        errorHandler,
        options,
      );
    }

    public static sendData(
      url: string,
      data: { [key: string]: string | number },
      successHandler?: Function,
      alwaysHandler?: Function,
      errorHandler?: Function,
      options?: RequestOptions,
    ) {
      let formData = new FormData();
      for (const key in data) formData.append(key, data[key].toString());
      Request.XHR(
        url,
        formData,
        successHandler,
        alwaysHandler,
        errorHandler,
        options,
      );
    }

    public static sendForm(
      form: HTMLFormElement,
      successHandler?: Function,
      alwaysHandler?: Function,
      errorHandler?: Function,
      options?: RequestOptions,
    ) {
      let url = form?.getAttribute('action');
      let formData = new FormData(form);

      Request.XHR(
        url!,
        formData!,
        successHandler,
        alwaysHandler,
        errorHandler,
        options,
      );
    }

    public static submitForm(
      element: HTMLElement,
      successHandler?: Function,
      alwaysHandler?: Function,
      errorHandler?: Function,
    ) {
      Request.sendForm(
        element.closest('form')!,
        successHandler,
        alwaysHandler,
        errorHandler,
      );
    }
  }
}
