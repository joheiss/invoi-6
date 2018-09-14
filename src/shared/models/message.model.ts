export type MessageMap = { [id: string]: MessageContent };

export interface MessageContent {
  text?: string;
  usage?: string;
}

export class Messages {
  static readonly placeholder = '$%';

  private messages: MessageMap;

  constructor(messages: MessageMap) {
    this.messages = Object.assign({}, {...messages }, { 'msg-not-found': `Unbekannte Nachricht: $%` });
  }

  getMessage(id: string): MessageContent {
    return this.messages[id] || this.getMessageWithParams('msg-not-found', [id]);
  }

  getMessageWithParams(id: string, params?: any[]): MessageContent {
    // get message from message map
    const tempMessage = Object.assign({}, this.messages[id] || this.messages['msg-not-found']);
    // replace placeholders if needed and provided
    if (tempMessage.text && tempMessage.text.indexOf(Messages.placeholder) >= 0 && params && params.length > 0) {
      params.forEach(param => tempMessage.text = tempMessage.text.replace(Messages.placeholder, param));
    }
    return tempMessage;
  }
}
