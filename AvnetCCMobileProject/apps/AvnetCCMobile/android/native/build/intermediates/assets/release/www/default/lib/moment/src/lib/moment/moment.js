
/* JavaScript content from lib/moment/src/lib/moment/moment.js in folder common */
import { createLocal } from '../create/local';
import { createUTC } from '../create/utc';
import { createInvalid } from '../create/valid';
import { isMoment } from './constructor';
import { min, max } from './min-max';
import momentPrototype from './prototype';

function createUnix (input) {
    return createLocal(input * 1000);
}

function createInZone () {
    return createLocal.apply(null, arguments).parseZone();
}

export {
    min,
    max,
    isMoment,
    createUTC,
    createUnix,
    createLocal,
    createInZone,
    createInvalid,
    momentPrototype
};
