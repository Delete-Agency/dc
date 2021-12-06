import { IDCRefsCollection } from './dc-dom';
/**
 * Base component.
 * @class
 * @implements {DcBaseComponent}
 */
declare type IDCOptions = {
    [key in string | number]: any;
};
declare class DcBaseComponent<Root extends HTMLElement = HTMLElement, Options extends (IDCOptions | void) = void, Refs extends (IDCRefsCollection | void) = void> {
    readonly element: Root;
    private _listenersList;
    protected readonly options: Options;
    protected readonly refs: Refs;
    static namespace: string;
    static requiredRefs: string[];
    constructor(element: Root, namespace: string, requiredRefs: string[]);
    private _checkRequiredRefs;
    init(): void;
    protected readonly addListener: (elem: HTMLElement, eventName: string, eventCallback: CallableFunction) => void;
    private _removeAllListeners;
    readonly destroy: () => void;
    protected onDestroy(): void;
}
export { DcBaseComponent };
//# sourceMappingURL=dc-base-component.d.ts.map