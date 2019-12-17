import DcBaseComponent from '../src/dc-base-component';

class Component extends DcBaseComponent {
    static getNamespace() {
        return 'some-namespace'
    }
}

it('component instance has this.element property', () => {
    const element = document.createElement('div');
    const instance = new Component(element);
    expect(instance.element).toEqual(element);
});

it('component instance has refs', () => {
    const element = document.createElement('div');
    const btn = document.createElement('button');
    btn.setAttribute('data-dc-some-namespace-ref', 'btn');
    element.appendChild(btn);
    const instance = new Component(element);
    expect(instance.refs.btn).toEqual(btn);
});

it('component instance has refs in array', () => {
    const element = document.createElement('div');
    const btn1 = document.createElement('button');
    const btn2 = document.createElement('button');
    btn1.setAttribute('data-dc-some-namespace-ref', 'btn[]');
    btn2.setAttribute('data-dc-some-namespace-ref', 'btn[]');
    element.appendChild(btn1);
    element.appendChild(btn2);
    const instance = new Component(element);
    expect(instance.refs.btn[1]).toEqual(btn2);
});

it('component instance has refs in object', () => {
    const element = document.createElement('div');
    const btn = document.createElement('button');
    btn.setAttribute('data-dc-some-namespace-ref', 'btn[foo]');
    element.appendChild(btn);
    const instance = new Component(element);
    expect(instance.refs.btn.foo).toEqual(btn);
});

it('component instance has options', () => {
    const element = document.createElement('div');
    element.setAttribute('data-dc-some-namespace', '{"foo": "bar"}');
    const instance = new Component(element);
    expect(instance.options.foo).toEqual('bar');
});
