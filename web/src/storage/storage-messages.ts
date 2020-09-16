import {MessageMap} from 'jovisco-domain';

export const STORAGE_MSGS: MessageMap = {
  'file-delete-fail': { text: 'Die Datei $% konnte nicht gelöscht werden.', usage: 'error' },
  'file-delete-success': { text: 'Die Datei $% wurde gelöscht.', usage: 'success' },
  'file-download-fail': { text: 'Die Datei $% konnte nicht heruntergeladen werden.', usage: 'error' },
  'file-download-success': { text: 'Die Datei $% wurde heruntergeladen.', usage: 'success' },
  'file-upload-fail': { text: 'Die Datei $% konnte nicht hochgeladen werden.', usage: 'error' },
  'file-upload-success': { text: 'Die Datei $% wurde hochgeladen.', usage: 'success' },
  'permission-denied': { text: 'Die Aktion wurde mangels ausreichender Berechtigung abgebrochen.', usage: 'error' },
  'storage/object-not-found': { text: 'Die Datei existiert nicht. ', usage: 'error' }
};

