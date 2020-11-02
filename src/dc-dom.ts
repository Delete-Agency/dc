import { getCamelCaseString } from './utils';

const DC_NAMESPACE = 'data-dc';
const DC_NAMESPACED_ATTRIBUTE_REFERENCE = 'ref';
const DC_NAMESPACED_ATTRIBUTE_LAZY = 'lazy';

interface ieHTMLElement extends HTMLElement { msMatchesSelector(selectors: string): boolean; }

const matches = (root: HTMLElement, selector: string): boolean => {
    // add support of the matches in IE
    return root.matches ? root.matches(selector) : (root as ieHTMLElement).msMatchesSelector(selector) ;
};

/**
 *
 * @param {HTMLElement} element
 * @param {string} selector
 * @return {HTMLElement[]}
 */

const scopedQuerySelectorAll = (element: HTMLElement, selector: string): HTMLElement[] => {
    return Array.prototype.slice.call(element.querySelectorAll(selector));
};

/**
 * @param {HTMLElement} root!
 * @param {string} namespace
 * @param {?string|Function} selector
 * @return {Array}
 * @throws Error
 */
const findElementsForInit = (
    root: HTMLElement,
    namespace: string,
    selector?: string | Function
): HTMLElement[] => {
    // by default we use namespace
    if (!selector) {
        selector = `[${getNamespacedAnchorAttribute(namespace)}]`;
    }

    let elements = [];
    if (typeof selector === 'string') {
        elements = scopedQuerySelectorAll(root, selector);
        if (matches(root, selector)) {
            elements.push(root);
        }
    } else if (typeof selector === 'function') {
        elements = selector(root);
    } else {
        throw new Error("Unknown selector's type");
    }

    return elements;
};

/**
 * @param {HTMLElement} element
 * @return {boolean}
 */
const isElementWithinLazyParent = (element: HTMLElement): boolean => {
    let checkElement: HTMLElement | null = element;
    const attribute = `[${DC_NAMESPACE}-${DC_NAMESPACED_ATTRIBUTE_LAZY}]`;
    while (checkElement) {
        if (checkElement.hasAttribute(attribute)) {
            return true;
        }
        checkElement = checkElement.parentElement;
    }

    return false;
};

/**
 * @param {HTMLElement} element
 * @param {string} namespace
 * @return {ReferencesCollection}
 */

interface ReferencesCollection {
    [key: string]: HTMLElement | HTMLElement[] | {
        [_key: string]: HTMLElement
    };
}

const getElementRefs = (element: HTMLElement, namespace: string): ReferencesCollection => {
    const refAttribute = `${DC_NAMESPACE}-${namespace}-${DC_NAMESPACED_ATTRIBUTE_REFERENCE}`;
    const refSelector = `[${refAttribute}]`;
    const componentSelector = `[${getNamespacedAnchorAttribute(namespace)}]`;
    const nestedComponents = scopedQuerySelectorAll(element, componentSelector);

    const refs: ReferencesCollection = {};
    scopedQuerySelectorAll(element, refSelector)
        ?.filter((ref) => !nestedComponents.some((nested) => nested.contains(ref)))
        ?.forEach((ref) => {
            let refValue = ref.getAttribute(refAttribute);
            if (refValue !== null) {
                let _refValue = getCamelCaseString(refValue);
                const arrayRegexp = /(.+)\[(.*)\]/;
                const arrayParseResult = _refValue.match(arrayRegexp);
                if (arrayParseResult !== null) {
                    _refValue = arrayParseResult[1];
                    const key = arrayParseResult[2];
                    const isObject = (key !== '') && (!/^\d+$/.test(key));
                    if (!(_refValue in refs)) {
                        refs[_refValue] = isObject ? {} : [];
                    }
                    if (isObject) {
                        refs[_refValue] = Object.assign(refs[_refValue], { [key]: ref })
                    } else {
                        (refs[_refValue] as HTMLElement[]).push(ref);
                    }
                } else {
                    refs[_refValue] = ref;
                }
            }
        });

    return refs;
};

/**
 * @param {HTMLElement} element
 * @param {string} namespace
 * @return {?Object}
 */

const getElementOptions = (element: HTMLElement, namespace: string) => {
    const attribute = getNamespacedAnchorAttribute(namespace);
    let result = {};
    const attributeValue = element.getAttribute(attribute);
    if (attributeValue) {
        try {
            result = JSON.parse(attributeValue);
        } catch (error) {
            console.error(`Unable to parse «${attribute}» attribute on element:`, element);
            throw error;
        }
    }

    return result;
};

const getNamespacedAnchorAttribute = (namespace: string): string => {
    return `${DC_NAMESPACE}-${namespace}`;
};

export {
    ReferencesCollection,
    scopedQuerySelectorAll,
    getElementRefs,
    findElementsForInit,
    isElementWithinLazyParent,
    matches,
    getElementOptions,
};
