import {
    getElementOptions,
    getElementRefs, ReferencesCollection,
} from './dc-dom';

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
    eventCallback: CallableFunction;
}

/**
 * Base component.
 * @class
 * @implements {DcBaseComponent}
 */


class DcBaseComponent {
    public readonly element: HTMLElement;
    private _listenersList: DcListener[] = [];
    protected readonly options: object;
    protected readonly refs: ReferencesCollection;
    public static namespace: string = '';
    public static requiredRefs: string[] = [];

    public constructor(element: HTMLElement, namespace: string, requiredRefs: string[]) {
        Object.freeze(this.addListener);
        Object.freeze(this.destroy);
        /**
         * Root element of the component
         * @type {HTMLElement}
         */
        this.element = element;

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

        this._checkRequiredRefs(requiredRefs, namespace);
    }

    private _checkRequiredRefs = (refs: string[], namespace: string): void => {
        refs.forEach(name => {
            if (!this.refs[name]) {
                throw new Error(
                    `required ref "${name}" is not founded in ${namespace}`
                );
            }
        });
    }

    public init() {}

    protected readonly addListener = (elem: HTMLElement, eventName: string, eventCallback: CallableFunction): void => {
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

    public readonly destroy = (): void => {
        this._removeAllListeners();
        this.onDestroy();
    }

    protected onDestroy() {}
}

export { DcBaseComponent };
