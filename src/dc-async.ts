import { DcBaseComponent } from './dc-base-component';

/**
 * This function returns wrapper componentClass
 *
 * @param {function} importFunction
 * @return {typeof DcBaseComponent} wrapper for component class
 */
export const dcAsync = (importFunction: CallableFunction): any => {
    /**
     * A wrapper class for async loading
     * @class
     * @implements {DcBaseComponent}
     */
    class AsyncWrapper {
        public element: HTMLElement;
        public instance: DcBaseComponent | undefined;

        constructor(element: HTMLElement) {
            this.element = element;
        }

        public init() {
            importFunction()
                .then(( module: any ) => {
                    Object.keys(module).forEach((key) => {
                        const _Class = module[key] as typeof DcBaseComponent;
                        this.instance = new _Class(this.element, _Class.namespace, _Class.requiredRefs);
                        this.instance.init();
                    })
                })
                .catch((error: any) => {
                    console.error(
                        `An error occurred while loading the component ${importFunction}`
                    );
                    console.error(error);
                });
        }

        public destroy() {
            if (this.instance) this.instance.destroy();
        }
    }

    return AsyncWrapper;
}
