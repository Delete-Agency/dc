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
 * @return {IDCRefsCollection}
 */
interface IDCRefsCollection {
    [key: string]: HTMLElement | HTMLElement[] | {
        [_key: string]: HTMLElement;
    };
}
declare const getElementRefs: <T extends void | IDCRefsCollection>(element: HTMLElement, namespace: string) => T;
/**
 * @param {HTMLElement} element
 * @param {string} namespace
 * @return {?Object}
 */
declare const getElementOptions: <T>(element: HTMLElement, namespace: string) => T;
export { scopedQuerySelectorAll, getElementRefs, findElementsForInit, isElementWithinLazyParent, matches, getElementOptions, IDCRefsCollection, };
//# sourceMappingURL=dc-dom.d.ts.map