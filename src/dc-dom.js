import utils from './utils';

const DC_NAMESPACE = 'data-dc';
const DC_NAMESPACED_ATTRIBUTE_REFERENCE = 'ref';
const DC_NAMESPACED_ATTRIBUTE_ID = 'id';
const DC_NAMESPACED_ATTRIBUTE_LAZY = 'lazy';

function getNamespacedAnchorAttribute(namespace) {
    return `${DC_NAMESPACE}-${namespace}`;
}

/**
 * @param {HTMLElement} root
 * @param {string} namespace
 * @param {?string|Function} selector
 * @return {Array}
 * @throws Error
 */
function findElementsForInit(root, namespace, selector = null) {
    // by default we use namespace
    if (selector === null) {
        selector = `[${getNamespacedAnchorAttribute(namespace)}]`;
    }

    let elements = [];
    if (typeof selector === 'string') {
        elements = [...root.querySelectorAll(selector)];
    } else if (typeof selector === 'function') {
        elements = selector(root);
    } else {
        throw new Error("Unknown selector's type");
    }

    return elements;
}

/**
 * @param {HTMLElement} element
 * @return {boolean}
 */
function isElementWithinLazyParent(element) {
    let checkElement = element;
    const attribute = `${DC_NAMESPACE}-${DC_NAMESPACED_ATTRIBUTE_LAZY}`;
    while (checkElement) {
        if (checkElement.hasAttribute(attribute)) {
            return true;
        }
        checkElement = checkElement.parentElement;
    }

    return false;
}

/**
 *
 * @param {HTMLElement} element
 * @param {string} namespace
 * @return {?string}
 */
function getElementId(element, namespace) {
    return getNamespacedAttributeValue(element, DC_NAMESPACED_ATTRIBUTE_ID, namespace);
}

/**
 *
 * @param {HTMLElement} element
 * @param {string} selector
 * @param {string }namespace
 * @param {string} id
 * @return {HTMLElement[]}
 */
function scopedQuerySelectorAll(element, selector, namespace, id) {
    if (id) {
        selector += `[${getNamespacedAttributeName(DC_NAMESPACED_ATTRIBUTE_ID, namespace)}="${id}"]`;
    }
    return [...element.querySelectorAll(selector)];
}

/**
 * @param {HTMLElement} element
 * @param {string} namespace
 * @return {Object}
 */
function getElementOptions(element, namespace) {
    return getElementAttributeAsObject(element, getNamespacedAnchorAttribute(namespace));
}

/**
 * @param {HTMLElement} element
 * @param {string} attribute
 * @return {?Object}
 */
function getElementAttributeAsObject(element, attribute) {
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
}

/**
 * @param {HTMLElement} element
 * @param {string} namespace
 * @param {string} id
 * @return {ReferencesCollection}
 */
function getElementRefs(element, namespace, id) {
    const refAttribute = getNamespacedAttributeName(DC_NAMESPACED_ATTRIBUTE_REFERENCE, namespace);
    const selector = `[${refAttribute}]`;

    const refs = {};
    const elements = scopedQuerySelectorAll(element, selector, namespace, id);
    if (elements.length > 0) {
        elements.forEach(element => {
            const refValue = element.getAttribute(refAttribute);
            if (refValue !== null) {
                utils.addToAssociativeCollection(refs, utils.getCamelCaseString(refValue), element);
            }
        });
    }

    return refs;
}

function findChildrenWithAttribute(element, attribute, namespace, id) {
    return scopedQuerySelectorAll(element, `[${getNamespacedAttributeName(attribute, namespace)}]`, namespace, id);
}

function getParentId(childElement, namespace) {
    return getNamespacedAttributeValue(childElement, DC_NAMESPACED_ATTRIBUTE_ID, namespace);
}

function getNamespacedAttributeValue(element, attribute, namespace) {
    return element.getAttribute(getNamespacedAttributeName(attribute, namespace));
}

function getNamespacedAttributeName(name, namespace) {
    return `${DC_NAMESPACE}-${namespace}-${name}`;
}

export default {
    findElementsForInit,
    getElementId,
    getElementOptions,
    getElementRefs,
    getParentId,
    getNamespacedAttributeValue,
    findChildrenWithAttribute,
    isElementWithinLazyParent
};
