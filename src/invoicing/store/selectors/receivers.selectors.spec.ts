import {mockState} from '../../../test/factories/mock-state';
import {
  selectActiveReceiversSortedAsObjArray,
  selectAllReceivers,
  selectAllReceiversAsObjArray,
  selectAllReceiversSorted,
  selectAllReceiversSortedAsObjArray,
  selectCurrentReceiver,
  selectCurrentReceiverAsObj,
  selectReceiverEntities,
  selectReceiverIds,
  selectReceiversLoaded,
  selectSelectedReceiver
} from './receivers.selectors';
import {Receiver} from '../../models/receiver.model';
import {mockSingleReceiver} from '../../../test/factories/mock-receivers.factory';

describe('Receivers Selectors', () => {

  let state;

  beforeEach(() => {
    state = mockState();
  });

  describe('selectReceiverIds', () => {
    it('should return the ids of all receivers', () => {
      expect(selectReceiverIds(state)).toEqual(state.invoicing.receivers.ids);
    });
  });

  describe('selectReceiverEntities', () => {
    it('should return the entities object containing all receivers', () => {
      expect(selectReceiverEntities(state)).toEqual(state.invoicing.receivers.entities);
    });
  });

  describe('selectAllReceivers', () => {
    it('should return an array containing all receivers', () => {
      const expected = Object.keys(state.invoicing.receivers.entities)
        .map(k => state.invoicing.receivers.entities[k])
        .sort((a, b) => a.id.localeCompare(b.id));
      expect(selectAllReceivers(state)).toEqual(expected);
    });
  });

  describe('selectAllReceiversAsObjArray', () => {
    it('should return an array of receiver objects', () => {
      const expected = Object.keys(state.invoicing.receivers.entities)
        .map(k => Receiver.createFromData(state.invoicing.receivers.entities[k]))
        .sort((a, b) => a.header.id.localeCompare(b.header.id));
      expect(selectAllReceiversAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectReceiversLoaded', () => {
    it('should return true ', () => {
      const expected = state.invoicing.receivers.loaded;
      expect(selectReceiversLoaded(state)).toEqual(expected);
    });
  });

  describe('selectCurrentReceiver', () => {
    it('should return the currently selected receiver', () => {
      const expected = mockSingleReceiver();
      expect(selectCurrentReceiver(state)).toEqual(expected);
    });
  });

  describe('selectCurrentReceiverAsObj', () => {
    it('should return the currently selected receiver as object', () => {
      const expected = Receiver.createFromData(mockSingleReceiver());
      expect(selectCurrentReceiverAsObj(state)).toEqual(expected);
    });
  });

  describe('selectSelectedReceiver', () => {
    it('should return the currently selected receiver', () => {
      state.routerReducer.state = { url: '/receivers', params: { id: '1901' } } as any;
      const expected = mockSingleReceiver();
      expect(selectSelectedReceiver(state)).toEqual(expected);
    });
  });

  describe('selectAllReceiversSorted', () => {
    it('should return an array containing all receivers, sorted by id', () => {
      const expected = Object.keys(state.invoicing.receivers.entities)
        .map(k => state.invoicing.receivers.entities[k])
        .sort((a, b) => a.id.localeCompare(b.id));
      expect(selectAllReceiversSorted(state)).toEqual(expected);
    });
  });

  describe('selectAllReceiversSortedAsObjArray', () => {
    it('should return an array of receiver objects, sorted by id', () => {
      const expected = Object.keys(state.invoicing.receivers.entities)
        .map(k => Receiver.createFromData(state.invoicing.receivers.entities[k]))
        .sort((a, b) => a.header.id.localeCompare(b.header.id));
      expect(selectAllReceiversSortedAsObjArray(state)).toEqual(expected);
    });
  });

  describe('selectActiveReceiversSortedAsObjArray', () => {
    it('should return an array of all active receiver objects, sorted by id', () => {
      const expected = Object.keys(state.invoicing.receivers.entities)
        .map(k => Receiver.createFromData(state.invoicing.receivers.entities[k]))
        .filter(r => r.isActive())
        .sort((a, b) => a.header.id.localeCompare(b.header.id));
      expect(selectActiveReceiversSortedAsObjArray(state)).toEqual(expected);
    });
  });
});
