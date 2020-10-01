/**
 * Object mapping of known possible inboxes for the user
 */
export const NavigationItems = [
  {
    id: 'welcome',
    icon: '/img/icon/apps.svg',
    label: 'navBar.welcome',
    to: '/welcome'
  },
  {
    id: 'profile',
    icon: '/img/people.svg',
    label: 'navBar.profile',
    to: '/profile'
  },
  
  {
    id: 'text-editor',
    icon: '/img/icon/files.svg',
    label: 'navBar.text-editor',
    to: '/prescription'
  },
  {
    id: 'help',
    icon: '/img/icon/help.svg',
    label: 'Help',
    to: '/help'
  }
];

export const ProfileOptions = [
  {
    label: 'navBar.profile',
    onClick: 'profileRedirect',
    icon: 'cog'
  },
  
  {
    label: 'navBar.logOut',
    onClick: 'logOut',
    icon: 'lock'
  }
];
