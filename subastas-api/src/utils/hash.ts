export const hashCode = function (s: string) {
    var hash = 0, i, chr;
    for (i = 0; i < s.length; i++) {
        chr = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    console.log(hash)
    return hash.toString();
}