export interface UserCredentials {
  email?: string;
  password?: string;
}

export interface UserProfileData {
  email: string;
  roles?: string[];
  organization?: string;
  displayName?: string;
  phoneNumber?: string;
  imageUrl?: string;
  isLocked?: boolean;
  uid?: string;
}

export interface UserData {
  email: string | null;
  roles?: string[];
  organization?: string;
  displayName?: string;
  phoneNumber?: string;
  imageUrl?: string;
  isLocked?: boolean;
  uid?: string;
}

export const ANONYMOUS_USER: UserData = {
  email: null,
  roles: null,
  organization: null,
  isLocked: false
};

export class User {

  public static createFromData(data: UserData): User | undefined {
    if (data) {
      return new User(data);
    } else {
      return undefined;
    }
  }

  constructor(private _data: UserData) {}

  get uid(): string {
    return this._data.uid;
  }
  get email(): string {
    return this._data.email;
  }
  set email(value: string) {
    this._data.email = value;
  }
  get roles(): string[] {
    return this._data.roles;
  }
  set roles(value: string[]) {
    this._data.roles = value;
  }
  get organization(): string {
    return this._data.organization;
  }
  set organization(value: string) {
    this._data.organization = value;
  }
  get displayName(): string {
    return this._data.displayName;
  }
  set displayName(value: string) {
    this._data.displayName = value;
  }
  get phoneNumber(): string {
    return this._data.phoneNumber;
  }
  set phoneNumber(value: string) {
    this._data.phoneNumber = value;
  }
  get imageUrl(): string {
    return this._data.imageUrl;
  }
  set imageUrl(value: string) {
    this._data.imageUrl = value;
  }
  get isLocked(): boolean {
    return this._data.isLocked;
  }
  set isLocked(value: boolean) {
    this._data.isLocked = value;
  }
  get data(): UserData {
    return this._data;
  }
  set data(value: UserData) {
    this._data = value;
  }

}

