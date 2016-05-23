# responsiveHeader

This component swtiches between two sections: a desktop and a mobile. For the
desktop section, it also sets a scrolled state when the page is scrolled past a
certain point. The mobile section has a menu that opens when a trigger is
clicked.

## How to use this component

```html
<div data-component="responsive-header">
    <header data-rh="desktop">
        <!-- Header and menu go here -->
    </header>
    <header data-rh="mobile">
        <!-- Header goes here -->
        <span data-rh-mobile="trigger"></span>
        <div data-rh-mobile="menu">
            <!-- Menu contents go here -->
        </div>
    </header>
</div>
```
