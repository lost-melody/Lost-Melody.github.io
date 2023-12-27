import YAML from "yaml";

import { ColorSchema } from "$lib/Hamster/model/colorSchema";

export function exportSchemas(schemas: ColorSchema[]): string {
    var objList = schemas.map((schema) => schema.toObject());
    return YAML.stringify({
        keyboard: {
            colorSchemas: objList,
        },
    });
}

export function importSchemas(obj: any): ColorSchema[] | null {
    var colorSchemas: ColorSchema[] | null = null;
    try {
        let schemas;
        if (obj && obj.keyboard) {
            schemas = obj.keyboard.colorSchemas;
        } else if (obj && obj.Keyboard) {
            schemas = obj.Keyboard.colorSchemas;
        } else if (obj && obj.colorSchemas) {
            schemas = obj.colorSchemas;
        }
        if (schemas) {
            colorSchemas = (schemas as object[]).map((o) => {
                var schema = new ColorSchema();
                schema.fromObject(o);
                return schema;
            });
        }
    } catch (err) {
        alert(`failed to parse file: ${(err as Error).message}`);
    }
    return colorSchemas;
}

export function loadSchemas(key: string): ColorSchema[] | null {
    var colorSchemas: ColorSchema[] | null = null;
    var recoveryData = localStorage.getItem(key);
    if (recoveryData) {
        try {
            let objList = YAML.parse(recoveryData);
            colorSchemas = (objList as object[]).map((obj) => {
                var schema = new ColorSchema();
                schema.fromObject(obj);
                return schema;
            });
        } catch (err) {
            alert(`failed to load recovery data: ${(err as Error).message}`);
        }
    }
    return colorSchemas;
}

export function saveSchemas(key: string, colorSchemas: ColorSchema[]) {
    const objList = colorSchemas.map((schema) => schema.toObject());
    localStorage.setItem(key, YAML.stringify(objList));
}
