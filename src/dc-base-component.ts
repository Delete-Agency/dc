import {
    getElementOptions,
    getElementRefs,
} from './dc-dom';
import { checkForbiddenOverrides } from './utils';

/**
 * @typedef {Object.<string, {(HTMLElement|HTMLElement[]|Object.<string, HTMLElement>)}>} ReferencesCollection
 */

/**
 * Interface for classes that can be initialized by factory.
 * @interface Component
*/
/**
 * Init Component
 * @method
 * @name Component#init
 *
 */
/**
 * Destroy Component
 * @method
 * @name Component#destroy
 *
 */
/**
 * @method
 * @name Component#getElement
 * @return {HTMLElement} element
 */
/**
 * @method
 * @name Component#getNamespace
 * @static
 */


interface DcListener {
    elem: HTMLElement;
    eventName: string;
    eventCallback: Function | EventListener;
}

/**
 * Base component.
 * @class
 * @implements {DcBaseComponent}
 */


class DcBaseComponent {
    public element: HTMLElement;
    private _listenersList: DcListener[];
    protected options: object;
    protected refs: object;
    public static namespace: string = '';
    public static requiredRefs: string[] = [];

    public constructor(element: HTMLElement, namespace: string, requiredRefs: string[]) {
        checkForbiddenOverrides(DcBaseComponent, this, [
            'init',
            'addListener',
            'destroy'
        ]);

        /**
         * Root element of the component
         * @type {HTMLElement}
         */
        this.element = element;

        /**
         * Stores DOM events listeners which is created via {@link DcBaseComponent#addListener}
         * @type {Array}
         * @private
         */
        this._listenersList = [];

        /**
         * Store an object with any data/settings which is provided by backend side
         * @type {Object}
         */
        this.options = getElementOptions(element, namespace);

        /**
         * @type {ReferencesCollection}
         */
        this.refs = getElementRefs(
            element,
            namespace,
        );

        this._checkRequiredRefs(requiredRefs);
    }

    /**
     * Check that all the required references exist in the DOM
     * @param {ReferencesCollection} refs
     * @private
     */
    _checkRequiredRefs = (refs: string[]): void => {
        refs.forEach(name => {
            if (!refs[name]) {
                throw new Error(
                    `the value of required ref ${name} is ${refs[name]}`
                );
            }
        });
    }

    public init() {
        this.onInit();
    }

    protected onInit() {}

    protected addListener = (elem: HTMLElement, eventName: string, eventCallback: Function | EventListener): void => {
        if (!elem || typeof elem.addEventListener !== 'function') return;
        elem.addEventListener(eventName, eventCallback as EventListener);
        this._listenersList.push({
            elem,
            eventName,
            eventCallback
        });
    }

    private _removeAllListeners = (): void => {
        this._listenersList.forEach(listener => {
            const { elem, eventName, eventCallback } = listener;
            elem.removeEventListener(eventName, eventCallback as EventListener);
        });

        this._listenersList = [];
    }

    public destroy = (): void => {
        this._removeAllListeners();
        this.onDestroy();
    }

    protected onDestroy() {}
}

export { DcBaseComponent };
