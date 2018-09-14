import * as _ from 'lodash';

export function difference(object: Object, base: Object): Object {
  function changes(object, base): Object {
    return _.transform(object, function (result, value, key) {
      if (!_.isEqual(value, base[key])) {
        result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
}
