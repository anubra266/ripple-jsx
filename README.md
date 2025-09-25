# Ripple JSX

JSX Runtime for Ripple JS

## 🎯 Usage Examples

### Basic Element

```javascript
const element = jsx('div', {
	className: 'greeting',
	children: 'Hello World!',
});
mount(element, { target: container });
```

### With Event Handlers

```javascript
const button = jsx('button', {
	onClick: () => alert('Clicked!'),
	className: 'btn',
	children: 'Click me',
});
```

### Nested Elements

```javascript
const component = jsx('div', {
	children: [
		jsx('h1', { children: 'Title' }),
		jsx('p', { children: 'Content' }),
		jsx('ul', {
			children: [jsx('li', { children: 'Item 1' }), jsx('li', { children: 'Item 2' })],
		}),
	],
});
```

### SVG Elements

```javascript
const svg = jsx('svg', {
	width: '100',
	height: '100',
	children: jsx('circle', {
		cx: '50',
		cy: '50',
		r: '40',
		fill: 'blue',
	}),
});
```

### Fragment

```javascript
const fragment = Fragment({
	children: [jsx('h1', { children: 'Title' }), jsx('p', { children: 'Content' }), 'Raw text'],
});
```

## 🔧 Setup for TypeScript/Babel

### TypeScript (`tsconfig.json`)

```json
{
	"compilerOptions": {
		"jsx": "react-jsx",
		"jsxImportSource": "ripple/jsx-runtime-custom"
	}
}
```

### Babel (`.babelrc`)

```json
{
	"presets": [
		[
			"@babel/preset-react",
			{
				"runtime": "automatic",
				"importSource": "ripple/jsx-runtime-custom"
			}
		]
	]
}
