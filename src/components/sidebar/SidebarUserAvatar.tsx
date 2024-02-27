import React from 'react';

export const SidebarUserAvatar = ({ avatarSrc }) => {
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
