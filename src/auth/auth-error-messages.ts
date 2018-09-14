import {MessageMap} from '../shared/models/message.model';

export const AUTH_MSGS: MessageMap = {
  'auth/wrong-password': { text: 'Anmeldung ist fehlgeschlagen. Bitte überprüfen Sie ihre Eingaben.', usage: 'error' },
  'auth/user-not-found': { text: 'Anmeldung ist fehlgeschlagen.Bitte überprüfen Sie ihre Eingaben.', usage: 'error' },
  'user-logged-out': { text: 'Sie haben sich abgemeldet.', usage: 'info' },
  'user-update-fail': { text: 'Der Benutzer $% konnte nicht geändert werden', usage: 'error' },
  'user-update-success': { text: 'Der Benutzer $% wurde geändert.', usage: 'success' },
  'user-create-fail': { text: 'Der Benutzer konnte nicht angelegt werden. [$%]', usage: 'error' },
  'user-create-success': { text: 'Der Benutzer $% wurde angelegt.', usage: 'success' },
  'userprofile-update-fail': { text: 'Die Benutzerdaten zu $% konnten nicht geändert werden', usage: 'error' },
  'userprofile-update-success': { text: 'Die Benutzerdaten zu $% wurden geändert.', usage: 'success' },
  'password-update-fail': { text: 'Das Passwort konnte nicht geändert werden. [$%]', usage: 'error' },
  'password-update-success': { text: 'Das Passwort wurde geändert.', usage: 'success' },
};

