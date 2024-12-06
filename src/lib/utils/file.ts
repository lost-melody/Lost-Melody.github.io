export async function dataUrlFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = (ev) => {
            let result = ev.target?.result as string;
            if (typeof result == "string") {
                resolve(result);
            } else {
                reject("impossible");
            }
        };
        reader.onerror = () => {
            reject("aborted");
        };
        reader.onerror = (ev) => {
            reject(ev.target?.error || "unknown error");
        };
        reader.readAsDataURL(file);
    });
}
