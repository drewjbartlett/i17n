# i17n

[![Core CI](https://github.com/drewjbartlett/i17n/actions/workflows/core.yml/badge.svg)](https://github.com/drewjbartlett/i17n/actions/workflows/core.yml)

A 1.4kB internationalization library that acts is intended for projects needing basic translations. 

mini17n features :

- ✅ basic `{ "key": "value" }` translations `t('key')`
- ✅ interpolated values `t('Hello, {name}!', { name: 'Drew' })`
- ✅ count based translations `t('tree', { count: 1 }) // "tree"`, `t('tree', { count: 10 }) // "trees"`
- ✅ smart caching - after a key is resolved once it is read from a cache
- ✅ extending core translations
- ✅ lightweight - 1.4kB
- ✅ TypeScript Support


### Why i17n?

i17n is intended to inform that this is not a full-fledged i18n library. There is only support for a single set of translations or language at a time. If your project is smaller or a startup with no need for multiple languages yet, but may need them in the future, the i18n familiar API of i17n is exactly what you need.

Using internationalization is not just for languages. It helps create a consistent UX for your application and separates the concerns of text and UIs. Imagine your application sometimes says "Add Item" and other times says "Create Item" and even worse, says "New Item" in other places. This can be confusing to some users and leads to an inconsistent user experience. i17n allows you to have a single definition `{ "addItem": "Add {item}" }` that you can reference all over your application, `t('addItem', { item: 'model.name' }).`

### Installation

```bash
npm i @drewjbartlett/i17n --save
```

### Usage


```json
{
  "helloWorld": "Hello World!",
  "welcomeUser": "Welcome, {user}!",
  "global": {
    "edit": "Edit",
    "save": "Save",
    "addNew": "Add New {item}",
  },
  "item": {
    "name__one": "Item",
    "name__many": "Items",
  },
}
```

```ts
// or translations.ts
export const lang = {
  helloWorld: 'Hello World!,
  welcomeUser: 'Welcome, {user}!',
  user: {
    name: 'User',
  },
  global: {
    edit: 'Edit',
    save: 'Save',
    addNew: 'Add New {item}',
  },
  item: {
    name__one: 'Item',
    name__many: 'Items',
  },
};
```

```ts
// i17n.ts
import { createI7n } from '@drewjbartlett/i17n'
import Translations from 'path/to/translations';

export const i17n = createI17n({
  translations: Translations,
});

// another-file.ts
import { i17n } from 'path/to/i17n'

i17n.t('helloWorld'); // "Hello World"
```

```ts
// Optionally, export your own helpers to match your conventions.
const $t = i18n.t;

export { $t }

// another-file.ts
import { $t } from 'path/to/i17n'

$t('helloWorld')
```

### Config

- translations
- cache
- loggingEnabled

### API

- t
- extend


### Usage with Vue

#### Vue 3

```ts
// i17n.ts
import { createI7n } from '@drewjbartlett/i17n'
import Translations from 'path/to/translations';

const i17n = createI17n({
  translations: Translations,
});

const I18nPlugin = {
  install(app) {
    app.config.globalProperties.$t = i18n.t;
  },
};

const app = createApp(MainApp);

app.use(I18nPlugin);
```

```vue
<template>
  <h1>{{ $t('welcomeUser', { user: myUser }) }}</h1>
</template>
```


#### Vue 2

```ts
import Vue from 'vue';

const I18nPlugin = {
  install: (Vue) => {
    Vue.prototype.$t = i18n.t;
  },
};

Vue.use(I18nPlugin)
```

```vue
<template>
  <h1>{{ $t('welcomeUser', { user: myUser }) }}</h1>
</template>
```

---