
/* JavaScript content from lib/moment/src/lib/create/local.js in folder common */
import { createLocalOrUTC } from './from-anything';

export function createLocal (input, format, locale, strict) {
    return createLocalOrUTC(input, format, locale, strict, false);
}
