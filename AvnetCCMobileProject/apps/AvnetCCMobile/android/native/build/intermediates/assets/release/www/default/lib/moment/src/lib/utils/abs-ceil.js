
/* JavaScript content from lib/moment/src/lib/utils/abs-ceil.js in folder common */
export default function absCeil (number) {
    if (number < 0) {
        return Math.floor(number);
    } else {
        return Math.ceil(number);
    }
}
