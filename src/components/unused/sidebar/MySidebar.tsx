import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';

import { Base } from '../../../api/Request';
import configApi from '../../../api/config.api';
import { url } from '../../../api/url.api';
import { tokens } from '../../../theme';
import { MenuSeparator } from './MenuSeparator';
import { SidebarMenuItem } from './SidebarMenuItem';
import { SidebarUserAvatar } from './SidebarUserAvatar';
import { CurrentUserData } from './types';

export const MySidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState('Dashboard');
  const [currentUserData, setCurrentUserData] =
    useState<CurrentUserData | null>(null);
  const [loading, setLoading] = useState(false);

  const avatarSrc =
    configApi.srv + configApi.avatarUrl + currentUserData?.PhotoName;

  useEffect(() => {
    setLoading(true);
    Base.Request.send(
      configApi.srv + url.getUserProfileData,
      (data: CurrentUserData) => {
        setCurrentUserData(data);
        setLoading(false);
      },
    );
  }, []);

  return (
    <Box
      sx={{
        '& .pro-sidebar-inner': {
          background: `${colors.primary[400]} !important`,
        },
        '& .pro-icon-wrapper': {
          backgroundColor: 'transparent !important',
        },
        '& .pro-inner-item': {
          padding: '5px 35px 5px 20px !important',
        },
        '& .pro-inner-item:hover': {
          color: '#868dfb !important',
        },
        '& .pro-menu-item.active': {
          color: '#6870fa !important',
        },
      }}
    >
      <Sidebar collapsed={isCollapsed}>
        <Menu>
          {/* MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: '10px 0 20px 0',
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}></Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                {!loading ? (
                  <SidebarUserAvatar avatarSrc={avatarSrc} />
                ) : (
                  <Skeleton width={100} height={100} circle />
                )}
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: '10px 0 0 0' }}
                >
                  {!loading ? currentUserData?.Name : <Skeleton width={180} />}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {!loading ? (
                    currentUserData?.Position
                  ) : (
                    <Skeleton width={110} />
                  )}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : '10%'}>
            {/* <SidebarMenuItem
              title="Панель"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <MenuSeparator />
            <SidebarMenuItem
              title="Мои ученики"
              to="/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <SidebarMenuItem
              title="Мои курсы"
              to="/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {/* <SidebarMenuItem
              title="Запись на курсы"
              to="/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <MenuSeparator />

            <SidebarMenuItem
              title="Добавить ученика"
              to="/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <SidebarMenuItem
              title="Календарь"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <SidebarMenuItem
              title="Вопросы"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default Sidebar;
