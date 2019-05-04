import {User} from 'jovisco-domain';

export interface UserProfilePopupData {
  title?: string;
  task?: string;
  user: User;
}
