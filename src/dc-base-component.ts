import {
    getElementOptions,
    getElementRefs, IDCRefsCollection,
} from './dc-dom';

/**
 * @typedef {Object.<string, {(HTMLElement|HTMLElement[]|Object.<string, HTMLElement>)}>} IDCRefsCollection
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

type IDCOptions = {
    [key in string | number]: any;
};

class DcBaseComponent<Root extends HTMLElement = HTMLElement, Options extends (IDCOptions | void) = void, Refs extends (IDCRefsCollection | void) = void> {
    public readonly element: Root;
    private _listenersList: DcListener[] = [];
    protected readonly options: Options;
    protected readonly refs: Refs;
    public static namespace: string = '';
    public static requiredRefs: string[] = [];

    public constructor(element: Root, namespace: string, requiredRefs: string[]) {
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
        this.options = getElementOptions<Options>(element, namespace);

        /**
         * @type {IDCRefsCollection}
         */
        this.refs = getElementRefs<Refs>(
            element,
            namespace,
        );

        this._checkRequiredRefs(requiredRefs, namespace);
    }

    private _checkRequiredRefs = (refs: string[], namespace: string): void => {
        refs.forEach(name => {
            if (!(this.refs as IDCRefsCollection)[name]) {
                throw new Error(
                    `required ref "${name}" not found in ${namespace}`
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
