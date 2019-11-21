import DcBaseComponent from './dc-base-component';
import dcFactory from './dc-factory'

/**
 * This function returns wrapper componentClass
 *
 * @param {Function} function returns import
 * @param {string} nameSpace
 * @return {typeof DcBaseComponent} componentClass
 */
export default function dcDeferredLoading(importFunction, nameSpace) {
    return class DeferredWrapper extends DcBaseComponent  {
        onInit() {
            importFunction().then(({ default: componentClass }) => {
                this.actualInstance = new componentClass(this.element);
                this.actualInstance.init();
            }).catch((error) => {
                console.error(`An error occurred while loading the component ${nameSpace}`);
                console.error(error);
            }); 
        }

        onDestroy() {
            this.actualInstance.destroy();
        }

        static getNamespace() {
            return nameSpace;
        }
    }
}