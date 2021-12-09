import { DcBaseComponent } from './dc-base-component';
declare class DcFactory {
    private _registeredComponents;
    /**
     *
     * @param {typeof DcBaseComponent} ComponentClass
     * @param {Function|string} selector that indicates how we should search that component elements
     */
    register(ComponentClass: typeof DcBaseComponent, selector?: string | Function | undefined): void;
    /**
     * Starts the factory on a given root: finds and creates all registered components within the root
     * @param {HTMLElement} root
     * @param {boolean} withLazy - Whether or not initialize component which is marked as lazy
     */
    init: (root?: HTMLElement, withLazy?: boolean) => void;
    /**
     * Destroy all previously registered components within the passed element
     * @param {HTMLElement} root
     */
    destroy: (root: HTMLElement) => void;
    private _getComponent;
    private _getState;
    private _setState;
    private _initComponent;
    private _initComponentOnElement;
    private _createComponent;
}
export declare const dcFactory: DcFactory;
export {};
//# sourceMappingURL=dc-factory.d.ts.map