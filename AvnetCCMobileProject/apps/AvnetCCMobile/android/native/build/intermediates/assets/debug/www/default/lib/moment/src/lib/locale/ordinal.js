
/* JavaScript content from lib/moment/src/lib/locale/ordinal.js in folder common */
export var defaultOrdinal = '%d';
export var defaultOrdinalParse = /\d{1,2}/;

export function ordinal (number) {
    return this._ordinal.replace('%d', number);
}

