'use strict';

const fs = require('graceful-fs')
    , mkdirp = require('mkdirp')
    , writeFileAtomic = require('write-file-atomic')

const { dirname, resolve } = require('path')

const PERMISSION_ERR = `You don't have access to this file.`
    , DIR_MODE = parseInt('0700', 8)
    , FILE_MODE = parseInt('0600', 8)

function JSONStore(path, opts) {
  if (!(this instanceof JSONStore)) return new JSONStore(path, opts)

  const defaults = opts && opts.defaults
  this.path = resolve(path)

  if (defaults && Object.keys(defaults).length) {
    // Don't set unless we have to (because this creates a file)
    this.all = { ...defaults, ...this.all }
  }
}

JSONStore.prototype = Object.create(Object.prototype, {
  all: {
    get: function () {
      try {
        return JSON.parse(fs.readFileSync(this.path, 'utf8'))
      } catch (err) {
        // Return empty object if file doesn't exist
        if (err.code === 'ENOENT') return {}

        // Improve the message of permission errors
        if (err.code === 'EACCES') {
          err.message = `${err.message}\n${PERMISSION_ERR}\n`
        }

        throw err
      }
    },
    set: function (val) {
      try {
        // Make sure the folder exists as it could
        // have been deleted in the meantime
        mkdirp.sync(dirname(this.path), DIR_MODE)

        writeFileAtomic.sync(this.path, JSON.stringify(val, null, 2), {
          mode: FILE_MODE
        })
      } catch (err) {
        // Improve the message of permission errors
        if (err.code === 'EACCES') {
          err.message = `${err.message}\n${PERMISSION_ERR}\n`
        }

        throw err
      }
    }
  },
  size: {
    get: function () {
      return Object.keys(this.all || {}).length
    }
  }
})

JSONStore.prototype.get = function (key) {
  return this.all[key]
}

JSONStore.prototype.set = function (key, value) {
  const config = this.all
  config[key] = value
  this.all = config
}

JSONStore.prototype.remove =
JSONStore.prototype.delete = function (key) {
  const all = this.all
  delete all[key]
  this.all = all
}

JSONStore.prototype.clear = function () {
  this.all = {}
}

JSONStore.prototype.keys = function () {
  return Object.keys(this.all)
}

JSONStore.prototype.toJSON = function () {
  return { ...this.all }
}

module.exports = JSONStore
