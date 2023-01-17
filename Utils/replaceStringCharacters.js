// Remove and replace chars in a string
let replacedString;
async function replaceChar(value, toRemove, toAdd) {
    replacedString = value.replace(toRemove, toAdd);
    return(replacedString);
}

module.exports = {replaceChar, replacedString}