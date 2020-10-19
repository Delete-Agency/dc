/**
 * This method will add the value to the collection based of the passed name
 * If the name has array format e.g. «some-name[]» value will be added as an item of the «some-name» array
 * If the name has object format e.g. «some-name[some-property]» value will be added as an item of the object «some-name» with key «some-property»
 *
 * @param {Object} collection
 * @param {string} name
 * @param value
 */
// todo remove similar method from object helper with the same name

const addToAssociativeCollection = (collection: object, name: string, value: HTMLElement): void => {
    const arrayRegexp = /(.+)\[(.*)\]/;
    const arrayParseResult = name.match(arrayRegexp);
    if (arrayParseResult !== null) {
        name = arrayParseResult[1];
        const key = arrayParseResult[2];
        const isObject = (key !== '') && (!/^\d+$/.test(key));
        if (!(name in collection)) {
            collection[name] = isObject ? {} : [];
        }
        if (isObject) {
            collection[name][key] = value;
        } else {
            collection[name].push(value);
        }
    } else {
        collection[name] = value;
    }
}

/**
 * Return sting in camelCase notation, e.g. some-name becomes someName
 * @param {string} str
 * @return {string}
 */
const getCamelCaseString = (str: string): string  => {
    return str.replace(/-./g, word => word.charAt(1).toUpperCase());
}

const checkForbiddenOverrides = (superClass, instance, properties: string[]) => {
    let prototype = instance;

    while (prototype.constructor !== superClass) {
        properties.forEach(key => {
            if (prototype.hasOwnProperty(key)) {
                throw new Error(`You can't override ${superClass.name} property «${key}» inside ${prototype.constructor.name}`);
            }
        });

        prototype = Object.getPrototypeOf(prototype);
    }
}

export {
    getCamelCaseString,
    addToAssociativeCollection,
    checkForbiddenOverrides
}
