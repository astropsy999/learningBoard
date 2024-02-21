import { toast } from 'react-toastify';

export namespace Base {

	type ResponseBase<Type extends string, Data> = {
		type: Type,
		data: Data
	}



	type ResponseNoticeData	= { type: 'ok' | 'info' | 'warning' | 'error', message: string, title?: string | undefined };
	type ResponseDataData		= any;

	type ResponseNotice			= ResponseBase<'notice', ResponseNoticeData>
	type ResponseData			= ResponseBase<'data', ResponseDataData>

	type ResponseInstance		= ResponseNotice | ResponseData;

	export class Response {

		public static Parsing(response: ResponseInstance[], handler?: Function) {
			for (const i in response) Response.Execute(response[i].type, response[i].data, handler);
		}

		private static Execute(type: string, data: any, handler?: Function): void {
			switch (type) {
				case 'data': Response.ExecuteHandler(handler, data); break;
				case 'notice': Response.ExecuteNotice(data); break;
			}
		}

		private static ExecuteHandler(handler: Function | null, data: ResponseDataData): void {
			if (handler) handler(data);
		}

		private static ExecuteNotice({type, message, title}: ResponseNoticeData): void {

			
			switch (type) {
				case 'ok': toast.success(message); break;
				case 'info': toast.info(message); break;
				case 'warning': toast.warning(message); break;
				case 'error': toast.error(message); break;
			}
		}

	}

}