# PostCSS Angular tailwind darkmode

<img align="right" width="135" height="95"
     title="Philosopher’s stone, logo of PostCSS"
     src="https://postcss.org/logo-leftp.svg">

[PostCSS] plugin to force work angular emulated encapsulation with tailwind darkmode based on class.

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
