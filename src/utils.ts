/**
 * Return string in camelCase notation, e.g. some-name becomes someName
 * @param {string} str
 * @return {string}
 */

const getCamelCaseString = (str: string): string  => {
    return str.replace(/-./g, word => word.charAt(1).toUpperCase());
}

export {
    getCamelCaseString,
}
