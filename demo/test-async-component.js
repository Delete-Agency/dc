export class TestAsyncComponent extends DcBaseComponent {
    static namespace = 'test-async-component';

    init() {
        this.element.innerHTML = 'Test async component was initialized';
    }
}
