import DcBaseComponent from '../src/dc-base-component';
import dcFactory from "../src/dc-factory";


class Component extends DcBaseComponent {
    static getNamespace() {
        return 'some-namespace'
    }
    onInit() {

    }
}

it('factory can init a component', async () => {
    const initCallback = jest.fn();
    class Foo extends DcBaseComponent {
        static getNamespace() {
            return 'foo'
        }
        onInit() {
            initCallback();
        }
    }

    const element = document.createElement('div');
    element.setAttribute('data-dc-foo', '');
    dcFactory.register(Foo);
    dcFactory.init(element);
    await new Promise((resolve)=>setTimeout(() => {
        // dcFactory.init uses setTimeout inside
        // so we need setTimeout to get dcFactory._instances
        resolve();
    }, 200));
    expect(dcFactory.debug(element)[0] instanceof Foo).toEqual(true);
    expect(initCallback).toHaveBeenCalled();

});

it('factory can destroy a component', async () => {
    const destroyCallback = jest.fn();
    class Liquidate extends DcBaseComponent {
        static getNamespace() {
            return 'test-destroy'
        }
        onInit() {}
        onDestroy() {
            destroyCallback()
        }
    }

    const element = document.createElement('div');
    element.setAttribute('data-dc-test-destroy', '');
    dcFactory.register(Liquidate);
    dcFactory.init(element);
    await new Promise((resolve)=>setTimeout(() => {
        resolve();
    }, 200));
    dcFactory.destroy(element);
    console.log(dcFactory.debug(element));
    expect(destroyCallback).toHaveBeenCalled();
});

it('data-dc-lazy attribute causes lazy initialisation ', async () => {
    const initCallback = jest.fn();
    class Lazy extends DcBaseComponent {
        static getNamespace() {
            return 'test-lz'
        }
        onInit() {
            initCallback();
        }
    }

    const element = document.createElement('div');
    element.setAttribute('data-dc-test-lz', '');
    element.setAttribute('data-dc-lazy', '');
    dcFactory.register(Lazy);

    dcFactory.init(element, false);
    await new Promise((resolve)=>setTimeout(() => {
        resolve();
    }, 200));
    expect(dcFactory.debug(element).length).toEqual(0);
    expect(initCallback).not.toHaveBeenCalled();

    dcFactory.init(element, true);
    await new Promise((resolve)=>setTimeout(() => {
        resolve();
    }, 200));
    expect(dcFactory.debug(element).length).toEqual(1);
    expect(initCallback).toHaveBeenCalled();
});



