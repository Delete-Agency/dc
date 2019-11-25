import dcDom from './dc-dom';

/**
 * @typedef {string} ComponentState
 * */

/**
 * @type {ComponentState}
 */
const COMPONENT_STATE_NOT_INITED = 'not-inited';
/**
 * @type {ComponentState}
 */
const COMPONENT_STATE_INITIALIZING = 'initializing';
/**
 * @type {ComponentState}
 */
const COMPONENT_STATE_LAZY_WAITING = 'lazy-waiting';
/**
 * @type {ComponentState}
 */
const COMPONENT_STATE_CREATED = 'created';
/**
 * @type {ComponentState}
 */
const COMPONENT_STATE_ERROR = 'error';
/**
 * @type {ComponentState}
 */
const COMPONENT_STATE_DESTROYED = 'destroyed';

class DcFactory {
    constructor() {
        /**
         *
         * @type {{componentClass: typeof Initializable, selector: string}[]}
         * @private
         */
        this._registredComponents = [];

        /**
         *
         * @type {WeakMap<HTMLElement, Map<typeof Initializable, ComponentState>>}
         * @private
         */
        this._elementsComponents = new WeakMap();

        /**
         *
         * @type {Initializable[]}
         * @private
         */
        this._instances = [];
    }

    /**
     *
     * @param {typeof Initializable} componentClass
     * @param {Function|string} selector that indicates how we should search that component elements
     */
    register(componentClass, selector = null) {
        this._registredComponents.push({
            componentClass,
            selector
        });
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {typeof Initializable} componentClass
     * @return ComponentState
     * @private
     */
    _getComponentStateOnElement(element, componentClass) {
        const existedComponents = this._elementsComponents.get(element);
        return (existedComponents && existedComponents.get(componentClass)) || COMPONENT_STATE_NOT_INITED;
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {typeof Initializable} componentClass
     * @param {ComponentState} state
     * @private
     */
    _setComponentStateOnElement(element, componentClass, state) {
        let componentsMap = this._elementsComponents.get(element);

        if (!componentsMap) {
            componentsMap = new Map();
            this._elementsComponents.set(element, componentsMap);
        }
        componentsMap.set(componentClass, state);
    }

    /**
     * Starts the factory on a given root: finds and creates all registered components within the root
     * @param {HTMLElement} root
     * @param {boolean} withLazy - Whether or not initialize component which marked as lazy
     */
    init(root = document.body, withLazy = true) {
        this._registredComponents.forEach(({ componentClass, selector }) => {
            this._initComponent(root, componentClass, selector, withLazy);
        });

        if (process.env.NODE_ENV === 'development') {
            // todo
            // find components which are declared in html as data-dc-component-*
            // but have no associated and registered components, throw warning
        }
    }

    /**
     *
     * @param {HTMLElement} root
     * @param {typeof Initializable} componentClass
     * @param {Function|string} selector
     * @param {boolean} withLazy
     * @private
     */
    _initComponent(root, componentClass, selector, withLazy) {
        try {
            const elements = dcDom.findElementsForInit(root, componentClass.getNamespace(), selector);
            if (elements.length > 0) {
                elements.forEach((element) => {
                    this._initComponentOnElement(element, componentClass, withLazy);
                });
            }
        } catch (e) {
            // ignore current config error and move to the next one
            console.error(e);
        }
    }

    _isComponentLazy(element) {
        return dcDom.isElementWithinLazyParent(element);
    }

    /**
     * Init component class on elements
     * @param {HTMLElement} element
     * @param {typeof Initializable} componentClass
     * @param {boolean} withLazy
     * @private
     */
    _initComponentOnElement(element, componentClass, withLazy) {
        const state = this._getComponentStateOnElement(element, componentClass);
        switch (state) {
            // ignore components which are already created or in the middle of that process
            case COMPONENT_STATE_CREATED:
            case COMPONENT_STATE_ERROR:
            case COMPONENT_STATE_INITIALIZING:
                return;
            case COMPONENT_STATE_LAZY_WAITING:
                if (!withLazy) {
                    return;
                }
        }

        // if component is lazy but we should not instantiate it according withLazy = false
        // we need to mark this component and wait until withLazy = true
        if (!withLazy && this._isComponentLazy(element)) {
            this._setComponentStateOnElement(element, componentClass, COMPONENT_STATE_LAZY_WAITING);
            return;
        }

        // finally init component on element
        this._setComponentStateOnElement(element, componentClass, COMPONENT_STATE_INITIALIZING);
        // TODO consider more sophisticated optimization technique
        setTimeout(() => {
            try {
                const instance = this._createComponentOnElement(componentClass, element);
                this._onComponentCreated(instance, componentClass);
            } catch (error) {
                this._onComponentCreationError(error, element, componentClass);
            }
        }, 0);
    }

    /**
     * @param {Initializable} instance
     * @param {typeof Initializable} componentClass
     * @private
     */
    _onComponentCreated(instance, componentClass) {
        this._setComponentStateOnElement(instance.getElement(), componentClass, COMPONENT_STATE_CREATED);
        this._instances = [...this._instances, instance];
        instance.init();
    }


    /**
     * @param {Error} error
     * @param {HTMLElement} element
     * @param {typeof Initializable} componentClass
     * @private
     */
    _onComponentCreationError(error, element, componentClass) {
        this._setComponentStateOnElement(element, componentClass, COMPONENT_STATE_ERROR);
        console.error(`Component ${componentClass.name} hasn't been created due to error: ${error.message}`, element);
        console.error(error);
    }

    /**
     *
     * @param {typeof Initializable} componentClass
     * @param {HTMLElement} element
     * @return {Initializable}
     * @private
     */
    _createComponentOnElement(componentClass, element) {
        const componentStateOnElement = this._getComponentStateOnElement(element, componentClass);

        switch (componentStateOnElement) {
            case COMPONENT_STATE_CREATED:
                throw new Error('Component of this class has already been created on this element');
            default:
                return new componentClass(element);
        }
    }

    /**
     * Destroy all previously registered components within the passed element
     * @param {HTMLElement} root
     */
    destroy(root) {
        this._instances = this._instances.filter((instance) => {
            if (instance.element === root || root.contains(instance.element)) {
                this._destroyComponent(instance);
                return false;
            }

            return true;
        });
    }

    /**
     *
     * @param {Initializable} component
     * @private
     */
    _destroyComponent(component) {
        this._setComponentStateOnElement(component.getElement(), component.constructor, COMPONENT_STATE_DESTROYED);
        component.destroy();
    }

    /**
     * Returns all components of componentClass which are contained within the passed element
     * @param {HTMLElement} element
     * @param {typeof Initializable} componentClass
     * @return Initializable[]
     */
    getChildComponents(element, componentClass) {
        return this._instances.filter((instance) => element.contains(instance.getElement()) && instance instanceof componentClass);
    }

    /**
     * Returns first found component of componentClass which is contained within the passed element
     * @param {HTMLElement} element
     * @param {typeof Initializable} componentClass
     * @return Initializable
     */
    getChildComponent(element, componentClass) {
        return this.getChildComponents(element, componentClass)[0];
    }

    /**
     * Returns all existing components on the passed element. Just for debugging purpose!
     * @param {HTMLElement} element
     * @return Initializable[]
     */
    debug(element) {
        return this._instances.filter((instance) => instance.getElement() === element);
    }
}


const dcFactory = new DcFactory();
export default dcFactory;
