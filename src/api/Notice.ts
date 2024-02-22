import { toast } from "react-toastify";

export namespace Base {

    export class Notice {

        public static ok(message: string, title: string): void {
            toast.success(message, { toastId: title });
        }

        public static info(message: string, title: string): void {
            toast.info(message, { toastId: title });
        }

        public static warning(message: string, title: string): void {
            toast.warning(message, { toastId: title });
        }

        public static error(message: string, title: string): void {
            toast.error(message, { toastId: title });
        }

    }

}