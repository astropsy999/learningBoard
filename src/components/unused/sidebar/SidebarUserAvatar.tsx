import React, { FC } from 'react';

interface SidebarUserAvatarProps {
  avatarSrc: string;
}

export const SidebarUserAvatar: FC<SidebarUserAvatarProps> = ({
  avatarSrc,
}) => {
  return (
    <img
      alt="profile-user"
      width="100px"
      height="100px"
      src={avatarSrc}
      style={{ cursor: 'pointer', borderRadius: '50%' }}
    />
  );
};
