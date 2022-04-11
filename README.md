# DC

[Live Demo](https://delete-agency.github.io/dc/)

## Motivation

TODO

## Installation

Use the package manager [npm](https://docs.npmjs.com/about-npm/) for installation.

```
$ npm install @deleteagency/dc
```

## Usage

### Initialize DC-Component Factory

```js
import { dcFactory } from '@deleteagency/dc';

// later after registering all your components, when your page is ready
dcFactory.init(document.body);
```

### Component

To enable your component's logic for certain DOM element you need to create a DC-component. Add a `data-dc-NAMESPACE` attribute to the HTML element

```html
<div data-dc-card-list>
	<button type="button">Load cards</button>
</div>
```

And create a class with `namespace` static field and extended from `DcBaseComponent` .

The `init` method will be called when the component is initialized. Use it to add event listeners, fetch data, and so on.

```jsx
import { DcBaseComponent, dcFactory } from '@deleteagency/dc';

class CardList extends DcBaseComponent {
	static namespace = 'card-list';

	init = () => {
		console.log('CardList was instantiated on the element', this.element);
	}
}

dcFactory.register(CardList);
```

### Event listener

To add an event listener to a DOM-element, use `addListener`  method with arguments such as DOM-element, event type, and listener.

```jsx
class Component extends DcBaseComponent {
	static namespace = 'component';

	init = () => {
		this.addListener(document.body, 'click', this.onClick);
	}

	onClick = () => {
		console.log('Click!');
	}
}
```

### Ref

To get an DOM-element within component, add the `data-dc-NAMESPACE-ref=”REF_NAME”` attribute to the certain element.

```html
<div data-dc-card-list>
	<button type="button" data-dc-card-list-ref="loadButton">Load cards</button>
</div>
```

Now the DOM-element will be put into the `refs` object. Use `refs.REF_NAME` in order to get it.

If component shouldn’t be initialized when there is no certain ref, specify `requiredRefs` static field with an array of required ref names.

```jsx
import { DcBaseComponent, dcFactory } from '@deleteagency/dc';

class CardList extends DcBaseComponent {
	static namespace = 'card-list';
  static requiredRefs = ['loadButton'];

	init = () => {
		console.log('Refs', this.refs);

		this.addListener(this.refs.loadButton, 'click', this.onClick);
	}

	onClick = () => {
		console.log('Loading data...');
	}
}

dcFactory.register(CardList);
```

### Options

To provide configuration/options for a component, add a JSON string as the value of the `data-dc-NAMESPACE` attribute.

```html
<div data-dc-card-list='{ "pageSize": 20 }'>
	<button type="button" data-dc-card-list-ref="loadButton">Load cards</button>
</div>
```

Use `options` object to get it.

```jsx
import { DcBaseComponent, dcFactory } from '@deleteagency/dc';

class CardList extends DcBaseComponent {
	static namespace = 'card-list';
  static requiredRefs = ['loadButton'];

	init = () => {
		console.log('Options', this.options);

		this.addListener(this.refs.loadButton, 'click', this.onClick);
	}

	onClick = () => {
		console.log(`Loading ${this.options.pageSize} items...`);
	}
}

dcFactory.register(CardList);
```

### Array of refs

To combine refs of the same type into an array, add the `data-dc-NAMESPACE-ref=”REF_NAME[]”`  attribute for each element you want to add to the `REF_NAME` array.

```csharp
<div data-dc-card-list='{ "pageSize": 20 }'>
	<ul>
	    @foreach (var item in filter.Items)
	    {
	        <li>
	            <label>
	                <input 
										type="checkbox" 
										id="@item.Id"
										name="@item.Value"
										data-dc-card-list-ref="filterItems[]"
									>
	                @item.Value
	            </label>
	        </li>
	    }
	</ul>
	<button type="button" data-dc-card-list-ref="loadButton">Load cards</button>
</div>
```

```jsx
import { DcBaseComponent, dcFactory } from '@deleteagency/dc';

class CardList extends DcBaseComponent {
	static namespace = 'card-list';
  static requiredRefs = ['loadButton', 'filterItems'];

	init = () => {
		this.selectedFilters = new Set();

		this.refs.filterItems.forEach((element) => {
			if (!element.checked) {
				return;
			}

			this.selectedFilters.add(element.name);
		});

		this.addListener(this.refs.loadButton, 'click', this.onClick);
	}

	onClick = () => {
		console.log(`Loading ${this.options.pageSize} items...`);
	}
}

dcFactory.register(CardList);
```

### Sub-refs

To combine refs related to the same subentity of the original component, add the `data-dc-NAMESPACE-ref=”REF_NAME[SUB_REF_NAME]”`  attribute for each element you want to add to the `REF_NAME` object.

```html
<div data-dc-card-list>
  <!-- Pagination -->
	<div data-dc-card-list-ref="pagination[root]">
	  <button data-dc-card-list-ref="pagination[first]" type="button" aria-label="First page"></button>
	  <button data-dc-card-list-ref="pagination[prev]" type="button" aria-label="Previous page"></button>
	  <ul data-dc-card-list-ref="pagination[numbers]"></ul>
	  <button data-dc-card-list-ref="pagination[next]" type="button" aria-label="Next page"></button>
	  <button data-dc-card-list-ref="pagination[last]" type="button" aria-label="Last page"></button>
	</div>
</div>
```

The DOM-elements will be available in the `refs.REF_NAME` object. Use `refs.REF_NAME.SUB_REF_NAME` to get each one.

```jsx
import { DcBaseComponent, dcFactory } from '@deleteagency/dc';

class CardList extends DcBaseComponent {
	static namespace = 'card-list';
  static requiredRefs = ['pagination'];

	init = () => {
		console.log('Refs', this.refs);
		/*
			Refs
			{
				pagination: {
					first: DOMElement,
					last: DOMElement,
					next: DOMElement,
					numbers: DOMElement,
					prev: DOMElement,
					root: DOMElement,
				}
			}
		*/

		this.addListener(this.refs.pagination.root, 'click', this.onPaginationClick);
		this.addListener(this.refs.pagination.prev, 'click', this.onPaginationPrevClick);
		this.addListener(this.refs.pagination.next, 'click', this.onPaginationNextClick);
		this.addListener(this.refs.pagination.first, 'click', this.onPaginationFirstClick);
		this.addListener(this.refs.pagination.last, 'click', this.onPaginationLastClick);
	}

	onPaginationClick = () => {
		console.log('Clicked on pagination!');
	}

	onPaginationPrevClick = () => {
		console.log('Clicked on "go to the previous page" button!');
	}

	onPaginationNextClick = () => {
		console.log('Clicked on "go to the next page" button!');
	}

	onPaginationFirstClick = () => {
		console.log('Clicked on "go to the first page" button!');
	}

	onPaginationLastClick = () => {
		console.log('Clicked on "go to the last page" button!');
	}
}

dcFactory.register(CardList);
```

## API

### dcFactory.register(componentClass[, selector])

#### componentClass

*Required*<br>
Type: `typeof DcBaseComponent`

Class which inherits DcBaseComponent and will be instantiated

#### selector

*Optional*<br>
Type: `string | CallableFunction: HTMLElement[]`

CSS selector which will override searching by getNamespace() and be used for searching elements of given componentClass.

### dcFactory.init(root, withLazy = true)

Starts the factory on a given root: finds and creates all registered components within the root

#### root

*Optional*<br>
Type: `HTMLElement`

#### withLazy

*Optional*<br>
Type: `boolean`

Defines whether or not components which are marked as lazy should be created during this particular initialization.
To mark components as lazy you need to add `data-dc-lazy` attribute on its element or any of its parent elements

### dcFactory.destroy(root)

Destroy all previously registered components within the passed element

#### root

*Required*<br>
Type: `HTMLElement`


## License
[MIT](https://choosealicense.com/licenses/mit/)
