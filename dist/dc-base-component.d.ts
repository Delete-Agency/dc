import { ReferencesCollection } from './dc-dom';
/**
 * Base component.
 * @class
 * @implements {DcBaseComponent}
 */
declare class DcBaseComponent {
    readonly element: HTMLElement;
    private _listenersList;
    protected readonly options: object;
    protected readonly refs: ReferencesCollection;
    static namespace: string;
    static requiredRefs: string[];
    constructor(element: HTMLElement, namespace: string, requiredRefs: string[]);
    private _checkRequiredRefs;
    init(): void;
    protected readonly addListener: (elem: HTMLElement, eventName: string, eventCallback: CallableFunction) => void;
    private _removeAllListeners;
    readonly destroy: () => void;
    protected onDestroy(): void;
}
export { DcBaseComponent };
//# sourceMappingURL=dc-base-component.d.ts.map