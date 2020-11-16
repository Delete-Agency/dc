declare const matches: (root: HTMLElement, selector: string) => boolean;
/**
 *
 * @param {HTMLElement} element
 * @param {string} selector
 * @return {HTMLElement[]}
 */
declare const scopedQuerySelectorAll: (element: HTMLElement, selector: string) => HTMLElement[];
/**
 * @param {HTMLElement} root!
 * @param {string} namespace
 * @param {?string|Function} selector
 * @return {Array}
 * @throws Error
 */
declare const findElementsForInit: (root: HTMLElement, namespace: string, selector?: string | Function | undefined) => HTMLElement[];
/**
 * @param {HTMLElement} element
 * @return {boolean}
 */
declare const isElementWithinLazyParent: (element: HTMLElement) => boolean;
/**
 * @param {HTMLElement} element
 * @param {string} namespace
 * @return {ReferencesCollection}
 */
interface ReferencesCollection {
    [key: string]: HTMLElement | HTMLElement[] | {
        [_key: string]: HTMLElement;
    };
}
declare const getElementRefs: (element: HTMLElement, namespace: string) => ReferencesCollection;
/**
 * @param {HTMLElement} element
 * @param {string} namespace
 * @return {?Object}
 */
declare const getElementOptions: (element: HTMLElement, namespace: string) => {};
export { ReferencesCollection, scopedQuerySelectorAll, getElementRefs, findElementsForInit, isElementWithinLazyParent, matches, getElementOptions, };
//# sourceMappingURL=dc-dom.d.ts.map