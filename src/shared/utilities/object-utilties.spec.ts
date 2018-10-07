import {DateUtilities} from './date-utilities';
import {difference} from './object-utilities';

describe('Object Utilities', () => {
  it('should return the difference between two objects', () => {

    const base = {
      name: 'Hansi',
      age: 44,
      jobs: ['this', 'that'],
      stuff: {
        something: true,
        somethingElse: 'else'
      }
    };
    const changes = { name: 'Horsti' };
    const toBeCompared = {...base, ...changes };
    expect(difference(toBeCompared, base)).toEqual(changes);
  });

});
