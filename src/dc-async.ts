import { DcBaseComponent } from "./dc-base-component";

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
        public instance: DcBaseComponent;

        constructor(element: HTMLElement) {
            this.element = element;
        }

        init() {
            importFunction()
                .then(( _Class: typeof DcBaseComponent ) => {
                    this.instance = new _Class(this.element, _Class.namespace, _Class.requiredRefs);
                    this.instance.init();
                })
                .catch(error => {
                    console.error(
                        `An error occurred while loading the component ${importFunction}`
                    );
                    console.error(error);
                });
        }

        destroy() {
            this.instance.destroy();
        }
    }

    return AsyncWrapper;
}
