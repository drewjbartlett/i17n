# i17n

[![Core CI](https://github.com/drewjbartlett/i17n/actions/workflows/core.yml/badge.svg)](https://github.com/drewjbartlett/i17n/actions/workflows/core.yml) 
[![npm](https://img.shields.io/npm/dt/@drewjbartlett/i17n.svg?style=flat-square)](https://www.npmjs.com/package/@drewjbartlett/i17n)

A lightweight (**1.4kB**) internationalization library tailored for startups and small-to-medium sized projects, offering a simple and efficient solution for managing translations in a single language without the overhead of a bloated library.

### Features

- ✅ basic `{ "key": "value" }` translations `t('key')`
- ✅ nested `{ "key": "child": "value" }` translations `t('key.child')`
- ✅ interpolated values `t('Hello, {name}!', { name: 'Drew' })`
- ✅ count based translations `t('tree', { n: 1 }) // "tree"`, `t('tree', { n: 10 }) // "trees"`
- ✅ smart caching - after a key is resolved once it is read from a cache
- ✅ extending core translations
- ✅ lightweight - 1.4kB
- ✅ 100% TypeScript


### Why i17n?

The name "i17n" is intended to imply that this is not a full-fledged i18n library but rather a starting point. It only provides support for a single set of translations or language at a time. If your project is small or a startup that doesn't yet require multiple languages, but may need them in the future, the familiar API of i17n is exactly what you need.

Using internationalization is not just for languages. It helps create a consistent UX for your application and separates the concerns of text and UIs. Imagine your application sometimes says "Add Item" and other times says "Create Item" and even worse, says "New Item" in other places. This can be confusing to some users and leads to an inconsistent user experience. i17n allows you to have a single definition `{ "addItem": "Add {item}" }` that you can reference all over your application, `t('addItem', { item: 'model.name' }).`


### Installation

```bash
npm i @drewjbartlett/i17n --save
```

### Usage

Create a JSON file: 

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

Or export an object:

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
import { createI17n } from '@drewjbartlett/i17n'
import Translations from 'path/to/translations';

export const i17n = createI17n({
  translations: Translations,
});

// another-file.ts
import { i17n } from 'path/to/i17n'

i17n.t('helloWorld'); // "Hello World"
```

Optionally you can export your i17n's API to fit your convention and needs.

```ts
const $t = i17n.t;

export { $t }

// another-file.ts
import { $t } from 'path/to/i17n'

$t('helloWorld')
```

### Config

| Value | Description |
| ----------- | ----------- |
| `translations` | The core `{ key: value }` translations. |
| `loggingEnabled` | When enabled warning logs will write to the console for missing keys. |
| `cache` | Optionally pass a prebuilt cache of the resolved `{ key: value }` pairs. |
| `countKey` | Optionally customize the count key. Defaults to `n` (`$t('user', { n: 1 })`) |

### API

- t - Attempt to resolve a translation

```json
{
  "topLevel": "Top Level",
  "namespace": {
    "anotherNamespace": {
      "tooDeep": "Deeply Namespaced Value"
    }
  },
  "withAnInterpolation": "Hey, {name}!",
  "withCounts": {
    "mouse__one": "Mouse",
    "mouse__many": "Mice",
  }
}
```

When calling `t()`, the each level of the keys are denoted by a `.`. For example:

```ts
i17n.t('topLevel') // "Top Level"
i17n.t('namespace.anotherNamespace.tooDeep') // "Deeply Namespaced Value"
```

---

##### Interpolations

When interpolating values, you simply pass put a value in your translation wrapped in `{}`.

```ts
i17n.t('withAnInterpolation', { name: 'Drew' }) // "Hey, Drew!"
i17n.t('withAnInterpolation', { name: 'Robin' }) // "Hey, Robin!"
```

##### Count Based

Keeping with the example above, there are times when a translation should resolve based on a given count. To do this simply provide a key of the same name and postfix it with `__one` or `__many`.

```ts
i17n.t('withCounts.mouse', { n: 1 }) // "Mouse"
i17n.t('withCounts.mouse', { n: 10 }) // "Mice"
```


##### Missing Keys

If a key is accessed but is missing it will simply return the key passed. This is useful for putting placeholder text while developing. If you have `config.loggingEnabled = true` you will see console warnings about missing keys.

```ts
i17n.t('a.missing.key') // "a.missing.key"
```


##### Extending

There may be times where a core i17n instance is shipped. Imagine your global translations are included.

```ts
export const i17n = createI17n({
  translations: {
    global: {
      edit: "Edit",
      save: "Save",
      addNew: "Add New {item}",
    },
  },
});
```

However, other parts of your application may want to extend and include their own translations that don't ship as core translations. This is especially useful when lazy loading translations in Single Page Apps.


```ts
// my-app-1.ts
import { i17n } from 'path/to/i17n'

i17n.extend({
  myApp1: {
    someKey: '...',
    anotherKey: '...',
  }
});

// now both the original and extended translations may be used
i17n.t('myApp1.someKey')
i17n.t('global.edit')
```

---


### Usage with Vue

i17n can be used in any application but to show how easy it is to use with a library like Vue, here are some examples.

#### Vue 3

```ts
// i17n.ts
import { createI17n } from '@drewjbartlett/i17n'
import Translations from 'path/to/translations';

const i17n = createI17n({
  translations: Translations,
});

const i17nPlugin = {
  install(app) {
    app.config.globalProperties.$t = i17n.t;
  },
};

const app = createApp(MainApp);

app.use(i17nPlugin);
```

```vue
<template>
  <h1>{{ $t('welcomeUser', { user: myUser }) }}</h1>
</template>
```


#### Vue 2

```ts
import Vue from 'vue';

const i17nPlugin = {
  install: (Vue) => {
    Vue.prototype.$t = i17n.t;
  },
};

Vue.use(i17nPlugin)
```

```vue
<template>
  <h1>{{ $t('welcomeUser', { user: myUser }) }}</h1>
</template>
```

---