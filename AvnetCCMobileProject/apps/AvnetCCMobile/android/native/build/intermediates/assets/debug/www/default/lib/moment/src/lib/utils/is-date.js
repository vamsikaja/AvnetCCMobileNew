
/* JavaScript content from lib/moment/src/lib/utils/is-date.js in folder common */
export default function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}
