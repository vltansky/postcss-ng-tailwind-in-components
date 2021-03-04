# PostCSS use Tailwind CSS functions in Angular components

<img align="right" width="135" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="https://postcss.org/logo-leftp.svg">

PostCSS plugin that make Tailwind CSS function with parent selectors (like dark:) work in Angular components

```js
plugins: [
  require('postcss-ng-tailwind-in-components')({ parentSelector: '.dark'});
]
```

result:

```css
.dark .test {
  color: red;
}
```
transforms to:
```css
.dark .test, :host-context(.dark) .test {
  color: red;
}
```
