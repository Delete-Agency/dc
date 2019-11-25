import DcBaseComponent from './dc-base-component';
import dcFactory from './dc-factory';

/**
 * This function returns wrapper componentClass
 *
 * @param {function} importFunction
 * @param {string} nameSpace
 * @return {typeof Component} wrapper for component class
 */
export default function dcDeferredLoading(importFunction, nameSpace) {
    /**
     * A wrapper class for deferred loading
     * @class
     * @implements {Component}
     */
    class DeferredWrapper {
        constructor(element) {
            this.element = element;
        }

        getElement() {
            return this.element;
        }

        init() {
            importFunction()
                .then(({ default: componentClass }) => {
                    this.actualInstance = new componentClass(this.element);
                    this.actualInstance.init();
                })
                .catch(error => {
                    console.error(
                        `An error occurred while loading the component ${nameSpace}`
                    );
                    console.error(error);
                });
        }

        destroy() {
            this.actualInstance.destroy();
        }

        static getNamespace() {
            return nameSpace;
        }
    }

    return DeferredWrapper;
}
