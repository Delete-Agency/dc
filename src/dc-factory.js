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
         * @type {{componentClass: typeof DcBaseComponent, selector: string}[]}
         * @private
         */
        this._registredComponents = [];

        /**
         *
         * @type {WeakMap<HTMLElement, Map<typeof DcBaseComponent, ComponentState>>}
         * @private
         */
        this._elementsComponents = new WeakMap();

        /**
         *
         * @type {DcBaseComponent[]}
         * @private
         */
        this._instances = [];
    }

    /**
     *
     * @param {typeof DcBaseComponent} componentClass
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
     * @param {typeof DcBaseComponent} componentClass
     * @return boolean
     * @private
     */
    _isComponentCreatedOnElement(element, componentClass) {
        const existedComponents = this._elementsComponents.get(element);
        if (existedComponents) {
            const state = existedComponents.get(componentClass);
            return [COMPONENT_STATE_CREATED, COMPONENT_STATE_INITIALIZING].includes(state);
        }
        return false;
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {typeof DcBaseComponent} componentClass
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
     * @param {typeof DcBaseComponent} componentClass
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
     *
     * @param {HTMLElement} root
     */
    init(root = document.body) {
        this._registredComponents.forEach(({ componentClass, selector }) => {
            this._initComponent(root, componentClass, selector);
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
     * @param {typeof DcBaseComponent} componentClass
     * @param {Function|string} selector
     * @private
     */
    _initComponent(root, componentClass, selector) {
        try {
            const elements = dcDom.findElementsForInit(root, componentClass.getNamespace(), selector);
            if (elements.length > 0) {
                elements.forEach((element) => {
                    this._initComponentOnElement(element, componentClass);
                });
            }
        } catch (e) {
            // ignore current config error and move to the next one
            console.error(e);
        }
    }

    /**
     * Init component class on elements
     * @param {HTMLElement} element
     * @param {typeof DcBaseComponent} componentClass
     * @private
     */
    _initComponentOnElement(element, componentClass) {
        if (!this._isComponentCreatedOnElement(element, componentClass)) {
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
    }

    /**
     * @param {DcBaseComponent} instance
     * @param {typeof DcBaseComponent} componentClass
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
     * @param {typeof DcBaseComponent} componentClass
     * @private
     */
    _onComponentCreationError(error, element, componentClass) {
        this._setComponentStateOnElement(element, componentClass, COMPONENT_STATE_ERROR);
        console.error(`Component ${componentClass.name} hasn't been created due to error: ${error.message}`, element);
        console.error(error);
    }

    /**
     *
     * @param {typeof DcBaseComponent} componentClass
     * @param {HTMLElement} element
     * @return {DcBaseComponent}
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
     * @param {DcBaseComponent} component
     * @private
     */
    _destroyComponent(component) {
        this._setComponentStateOnElement(component.getElement(), component.constructor, COMPONENT_STATE_DESTROYED);
        component.destroy();
    }

    /**
     * Returns all components of componentClass which are contained within passed element
     * @param {HTMLElement} element
     * @param {typeof DcBaseComponent} componentClass
     * @private
     */
    getChildComponents(element, componentClass) {
        return this._instances.filter((instance) => element.contains(instance.getElement()) && instance instanceof componentClass);
    }

    /**
     * Returns first found component of componentClass which is contained within passed element
     * @param {HTMLElement} element
     * @param {typeof DcBaseComponent} componentClass
     * @private
     */
    getChildComponent(element, componentClass) {
        return this.getChildComponents(element, componentClass)[0];
    }

    /**
     * Returns all existing components on the passed element. Just for debugging purpose!
     * @param {HTMLElement} element
     * @private
     */
    debug(element) {
        return this._instances.filter((instance) => instance.getElement() === element);
    }
}


const dcFactory = new DcFactory();
export default dcFactory;
