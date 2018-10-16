import {UserData} from '../../auth/models/user';

export const mockSingleUser = (roles: string[] = ['sys-admin', 'sales-user']): UserData => {
  return {
    displayName: 'Test Tester',
    email: 'test.tester@test.de',
    imageUrl: 'https://test/images/users/991OyAr37pNsS8BGHzidmOGAGVX2/thumbs/Passfoto_2014_1.jpg_64_thumb.png',
    isLocked: false,
    organization: 'THQ',
    phoneNumber: '+49 7771 234567',
    roles: roles,
    uid: '991OyAr37pNsS8BGHzidmOGAGVX2'
  };
};

export const mockAllUsers = (): UserData[] => {
  return [
    {
      displayName: 'Test Tester',
      email: 'test.tester@test.de',
      imageUrl: 'https://test/images/users/991OyAr37pNsS8BGHzidmOGAGVX2/thumbs/Passfoto_2014_1.jpg_64_thumb.png',
      isLocked: false,
      organization: 'THQ',
      phoneNumber: '+49 7771 234567',
      roles: ['sys-admin', 'sales-user'],
      uid: '991OyAr37pNsS8BGHzidmOGAGVX2'
    },
    {
      displayName: 'Auditor',
      email: 'auditor@test.de',
      imageUrl: 'https://test/images/users/999OyAr37pNsS8BGHzidmOGAGVX2/thumbs/Passfoto_2014_1.jpg_64_thumb.png',
      isLocked: false,
      organization: 'THQ',
      phoneNumber: '+49 7771 234567',
      roles: ['auditor'],
      uid: '999OyAr37pNsS8BGHzidmOGAGVX2'
    },
    {
      displayName: 'Sales Rep',
      email: 'sales.rep@test.de',
      imageUrl: 'https://test/images/users/9999yAr37pNsS8BGHzidmOGAGVX2/thumbs/Passfoto_2014_1.jpg_64_thumb.png',
      isLocked: false,
      organization: 'THQ',
      phoneNumber: '+49 7771 234567',
      roles: ['sales-user'],
      uid: '9999yAr37pNsS8BGHzidmOGAGVX2'
    },
    {
      displayName: 'Sys Admin',
      email: 'sys.admin@test.de',
      imageUrl: 'https://test/images/users/99999Ar37pNsS8BGHzidmOGAGVX2/thumbs/Passfoto_2014_1.jpg_64_thumb.png',
      isLocked: false,
      organization: 'THQ',
      phoneNumber: '+49 7771 234567',
      roles: ['sys-admin'],
      uid: '99999Ar37pNsS8BGHzidmOGAGVX2'
    },
    {
      displayName: 'Locked',
      email: 'locked@test.de',
      imageUrl: 'https://test/images/users/999999r37pNsS8BGHzidmOGAGVX2/thumbs/Passfoto_2014_1.jpg_64_thumb.png',
      isLocked: true,
      organization: 'THQ',
      phoneNumber: '+49 7771 234567',
      roles: ['sys-admin'],
      uid: '999999r37pNsS8BGHzidmOGAGVX2'
    },
  ];
};

export const mockUserIds = (): string[] => {
  return mockAllUsers().map(u => u.uid);
};

export const mockUsersEntity = (): any => {
  const allUsers = mockAllUsers();
  const entity = {};
  allUsers.map(u => entity[u.uid] = u);
  return entity;
};
