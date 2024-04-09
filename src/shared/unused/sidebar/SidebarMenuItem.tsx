import { Typography, useTheme } from '@mui/material';
import { SidebarMenuItemProps } from './types';
import { tokens } from '../../../app/theme';
import { MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import React from 'react';

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  title,
  to,
  icon,
  //   selected,
  //   setSelected,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      component={<Link to={to} />}
      //   active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      //   onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};
