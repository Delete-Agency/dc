import { findElementsForInit, isElementWithinLazyParent } from './dc-dom';
import { DcBaseComponent } from './dc-base-component'
import { states } from "./enums";

interface StatedComponent {
    element: HTMLElement;
    instance: DcBaseComponent | undefined
    state: string
}

interface RegisteredComponent {
    _Class: typeof DcBaseComponent;
    selector: string | Function | undefined;
    components: StatedComponent[]
}

class DcFactory {
    private _registeredComponents:  RegisteredComponent[] = [];

    /**
     *
     * @param {typeof DcBaseComponent} ComponentClass
     * @param {Function|string} selector that indicates how we should search that component elements
     */
    public register(ComponentClass: typeof DcBaseComponent, selector?: string | Function | undefined): void {
        this._registeredComponents.push({
            _Class: ComponentClass,
            selector,
            components: []
        });
    }

    /**
     * Starts the factory on a given root: finds and creates all registered components within the root
     * @param {HTMLElement} root
     * @param {boolean} withLazy - Whether or not initialize component which is marked as lazy
     */
    public init: (root?: HTMLElement, withLazy?: boolean) => void = (root = document.documentElement, withLazy = true) => {
        this._registeredComponents.forEach((rComponent) => {
            this._initComponent(root, rComponent, withLazy);
        });
    }

    /**
     * Destroy all previously registered components within the passed element
     * @param {HTMLElement} root
     */
    public destroy = (root: HTMLElement): void => {
        this._registeredComponents.forEach((rComponent) => {
            rComponent.components = rComponent.components.filter(({ element, instance, state }) => {
                if (root.contains(element)) {
                    if (state === states.CREATED && instance) instance.destroy();
                    return false;
                }

                return true;
            })
        })
    }


    private _getComponent = (_element: HTMLElement, rComponent: RegisteredComponent): StatedComponent | undefined =>
        rComponent.components.find(({ element }) => element === _element);

    private _getState = (element: HTMLElement, rComponent: RegisteredComponent): string => {
        const component = this._getComponent(element, rComponent);
        if (component) return component.state;
        return states.NOT_INITED;
    }

    private _setState = (element: HTMLElement, rComponent: RegisteredComponent, state: string, instance?: DcBaseComponent | undefined): void => {
        let component = this._getComponent(element, rComponent);

        if (!component) {
            component = { element, state, instance }
            rComponent.components.push(component);
        }
        Object.assign(component, { state, instance })
    }

    private _initComponent = (root: HTMLElement, rComponent: RegisteredComponent, withLazy?: boolean): void => {
        try {
            const { _Class: { namespace }, selector } = rComponent;
            findElementsForInit(root, namespace, selector).forEach((element) => {
                this._initComponentOnElement(element, rComponent, withLazy);
            });
        } catch (e) {
            // ignore current config error and move to the next one
            console.error(e);
        }
    }

    private _initComponentOnElement = (element: HTMLElement, rComponent: RegisteredComponent, withLazy?: boolean): void => {
        const { _Class } = rComponent;
        const state = this._getState(element, rComponent);
        switch (state) {
            // ignore components which are already created or in the middle of that process
            case states.CREATED:
            case states.ERROR:
            case states.INITIALIZING:
                return;
            case states.LAZY_WAITING:
                if (!withLazy) {
                    return;
                }
        }

        // if component is lazy but we should not instantiate it according to withLazy = false
        // we need to mark this component and wait until withLazy = true
        if (!withLazy && isElementWithinLazyParent(element)) {
            this._setState(element, rComponent, states.LAZY_WAITING);
            return;
        }

        // finally init component on element
        this._setState(element, rComponent, states.INITIALIZING);
        requestAnimationFrame(() => {
            try {
                this._createComponent(element, rComponent);
            } catch (error: any) {
                this._setState(element, rComponent, states.ERROR);
                console.error(`Component ${_Class.name} hasn't been created due to error: ${error.message}`, element);
                console.error(error);
            }
        });
    }


    private _createComponent = (element: HTMLElement, rComponent: RegisteredComponent): void => {
        const { _Class } = rComponent;
        const instance = new _Class(element, _Class.namespace, _Class.requiredRefs);
        instance.init();
        this._setState(element, rComponent, states.CREATED, instance);
    }
}


export const dcFactory = new DcFactory();
