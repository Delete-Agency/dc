export default class TestAsyncComponent extends DcBaseComponent {
    static getNamespace() {
        return 'test-async-component'
    }

    onInit() {
        this.element.innerHTML = 'Test async component was initialized';
    }
}