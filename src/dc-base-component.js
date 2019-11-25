import dcDom from './dc-dom';
import utils from './utils';

/**
 * @typedef {Object.<string, {(HTMLElement|HTMLElement[]|Object.<string, HTMLElement>)}>} ReferencesCollection
 */

/**
 * Interface for classes that can be initialized by factory.
 * @interface Initializable
*/
/**
 * Init Initializable
 * @method
 * @name Initializable#init
 *
 */
/**
 * Destroy Initializable
 * @method
 * @name Initializable#destroy
 *
 */
/**
 * @method
 * @name Initializable#getElement
 * @return {HTMLElement} element
 */
/**
 * @method
 * @name Initializable#getNamespace
 * @static
 */

/**
 * Base component.
 * @class
 * @implements {Initializable}
 */
export default class DcBaseComponent {
    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
        utils.checkForbiddenOverrides(DcBaseComponent, this, [
            'getElement',
            'getNamespace',
            'init',
            'addListener'
        ]);

        /**
         * Root element of the component
         * @type {HTMLElement}
         */
        this.element = element;

        /**
         * Shows whether of not the component is destroyed
         * @type {boolean}
         * @private
         */
        this._isDestroyed = false;

        /**
         * Stores DOM events listeners which is created via {@link DcBaseComponent#addListener}
         * @type {Array}
         * @private
         */
        this._listenersList = [];

        /**
         * A string to identify current component instance and distinguish its refs and DOM elements
         * Must be present in case of nested tabs/accordions
         * @type {?string}
         * @private
         */
        this._id = dcDom.getElementId(element, this.getNamespace());

        /**
         * Store an object with any data/settings which is provided by backend side
         * @type {Object}
         */
        this.options = dcDom.getElementOptions(element, this.getNamespace());

        /**
         * @type {ReferencesCollection}
         */
        this.refs = dcDom.getElementRefs(
            element,
            this.getNamespace(),
            this._id
        );

        this._checkRequiredRefs(this.refs);
    }

    /**
     * TODO
     * @return {string}
     */
    static getNamespace() {
        throw new Error('Component must define its namespace');
    }

    /**
     * Defines an array of DOM references
     * without which an instance of the component will not be created
     * @return {string[]}
     */
    static getRequiredRefs() {
        return [];
    }

    /**
     * @see DcBaseComponent#element
     * @return {HTMLElement}
     */
    getElement() {
        return this.element;
    }

    /**
     * Get component namespace in the dynamic context
     * @see DcBaseComponent.getNamespace
     * @return {string}
     */
    getNamespace() {
        return this.constructor.getNamespace();
    }

    /**
     * Check that all the required references exist in the DOM
     * @param {ReferencesCollection} refs
     * @private
     */
    _checkRequiredRefs(refs) {
        this.constructor.getRequiredRefs().forEach(name => {
            if (!refs[name]) {
                throw new Error(
                    `the value of required ref ${name} is ${refs[name]}`
                );
            }
        });
    }

    init() {
        this.onInit();
    }

    onInit() {
        // todo to define is onInit required on optional
        throw new Error('Please define onInit method');
    }

    addListener(elem, eventName, eventCallback) {
        if (!elem || typeof elem.addEventListener !== 'function') return;

        elem.addEventListener(eventName, eventCallback);
        this._listenersList.push({
            elem,
            eventName,
            eventCallback
        });
    }

    _removeAllListeners() {
        this._listenersList.forEach(listener => {
            const { elem, eventName, eventCallback } = listener;
            elem.removeEventListener(eventName, eventCallback);
        });

        this._listenersList = [];
    }

    destroy() {
        if (this._isDestroyed === true) {
            throw new Error('this instance has already been destroyed');
        }
        this._removeAllListeners();
        this._isDestroyed = true;
        this.onDestroy();
    }

    onDestroy() {}

    getChildAttribute(childNode, attributeName) {
        const childId = dcDom.getParentId(childNode, this.getNamespace());
        if (this._id !== childId) {
            throw new Error("id attributes of child and parent don't match");
        }

        return dcDom.getNamespacedAttributeValue(
            childNode,
            attributeName,
            this.getNamespace()
        );
    }

    findChildrenWithAttribute(attributeName) {
        return dcDom.findChildrenWithAttribute(
            this.element,
            attributeName,
            this.getNamespace(),
            this._id
        );
    }
}
