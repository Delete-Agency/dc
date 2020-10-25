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

```js
// collapsed/collapsed.js
import { DcComponent } from  '@deleteagency/dc';

class CollapsedComponent extends DcBaseComponent {
	static namespace = 'collapsed';
	static requiredRefs = ['button', 'content'];

	init = () => {
		console.log('CollapsedComponent was instantiate on the element', this.element);
		console.log('Options', this.options);
		console.log('Refs', this.refs);

		this.addListener(this.refs.button, 'click', this.onClick);
	}

	onClick = () => {
		if (this.refs.content.classList.contains('show')) {
			this.refs.content.classList.remove('show');
		} else {
			this.refs.content.classList.add('show');
		}
	}
}

// collapsed/index.js
import './scss/index.scss';

import { dcFactory } from  '@deleteagency/dc';
import CollapsedComponent from './collapsed.js';
dcFactory.register(CollapsedComponent);


// later after registering all your components, when your page is ready
dcFactory.init(document.body);

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

*Required*<br>
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
