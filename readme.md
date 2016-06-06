# atomic-json-store

**A configuration store adapted from [configstore](https://www.npmjs.com/package/configstore), with the following key differences:**

- Decoupled from file location (a small part's been extracted to `config-root`)
- Does not create the JSON file until necessary (`configstore` creates it upon instantiation)
- Similarly, on `get`, `atomic-json-store` does not create the parent directory
- Throws on invalid JSON in the store, instead of rudely deleting the entire configuration

[![npm status](http://img.shields.io/npm/v/atomic-json-store.svg?style=flat-square)](https://www.npmjs.org/package/atomic-json-store) [![node](https://img.shields.io/node/v/atomic-json-store.svg?style=flat-square)](https://www.npmjs.org/package/atomic-json-store)

## usage

Create a config at `~/.config/my-config.json`:

```js
const JSONStore = require('atomic-json-store')
const root = require('config-root')
const config = JSONStore(root + '/my-config.json')

config.set('name', 'milly')
config.get('name')
config.toJSON()
config.delete('name')
config.clear()
```

## `store = Store(path, [options])`

- **path**: where to save the JSON file

Options:

- **defaults**: an object with default keys and values to save upon instantiation

## tip

Instead of setting defaults, which are saved to the JSON file, use `family-store`:

```js
const JSONStore = require('atomic-json-store')
const FamilyStore = require('family-store')

const defs = FamilyStore('defaults', JSONStore('defaults.json'))
const beep = FamilyStore('beep', JSONStore('beep.json'))

beep.inherit(defs)

defs.set('port', 3000)
beep.get('port') // 3000
```

## install

With [npm](https://npmjs.org) do:

```
npm install atomic-json-store
```

## license

[BSD-2-Clause](https://spdx.org/licenses/BSD-2-Clause.html) © [ironSource](http://www.ironsrc.com/). [Original work](https://www.npmjs.com/package/configstore) © Google.
