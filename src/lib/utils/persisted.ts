import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

export interface Persisted<T> extends Writable<T> {}

export function persisted<T>(key: string, value: T): Persisted<T> {
    const defaultData = JSON.stringify(value);
    const data = browser ? localStorage.getItem(key) : null;
    if (data) {
        value = JSON.parse(data);
    }
    const store = writable(value);
    store.subscribe((val) => {
        const data = JSON.stringify(val);
        if (data == defaultData) {
            browser && localStorage.removeItem(key);
        } else {
            browser && localStorage.setItem(key, JSON.stringify(val));
        }
    });
    return store;
}
