import { ReactElement } from 'react';

export interface SidebarMenuItemProps {
  title: string;
  to: string;
  icon: ReactElement;
  //   selected: string;
  //   setSelected: (title: string) => void;
}

export interface SidebarProps {
  isSidebar: boolean;
}

export interface CurrentUserData {
  Email?: string;
  GDC: number;
  ID: number;
  LastActivity?: number;
  LinkedObjID?: string;
  Locked?: boolean;
  Login: string;
  MobileNumber?: string;
  Name: string;
  NameLinkedObjID: string;
  PhotoName?: string;
  Position: string;
  father_name?: string;
  first_name?: string;
  last_name?: string;
  learn_show: number;
}
