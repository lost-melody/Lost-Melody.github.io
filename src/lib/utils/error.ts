import { toaster } from "$lib/utils/toaster";

export function toastError(message: string) {
    toaster.error({
        title: message,
        duration: 3000,
    });
}
