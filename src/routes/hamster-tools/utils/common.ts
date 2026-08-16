export function exportFile(data: string, filename: string, mimetype: string = "application/yaml") {
    var anchor = document.createElement("a");
    var blob = new Blob([data], {
        type: `${mimetype}; charset=utf-8`,
    });
    var url = window.URL.createObjectURL(blob);
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
}
