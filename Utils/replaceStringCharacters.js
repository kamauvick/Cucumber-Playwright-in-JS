// Remove and replace chars in a string
let replacedString;
async function replaceChar(value, toRemove, toAdd) {
    replacedString = value.replace(toRemove, toAdd);
    // console.log(replacedString)
    return(replacedString);
}

module.exports = {replaceChar, replacedString}