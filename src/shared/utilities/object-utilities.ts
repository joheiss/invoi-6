import {isEqual, isObject, transform } from 'lodash';

export function difference(object: Object, base: Object): Object {
  function changes(object, base): Object {
    return transform(object, function (result, value, key) {
      if (!isEqual(value, base[key])) {
        result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
}
