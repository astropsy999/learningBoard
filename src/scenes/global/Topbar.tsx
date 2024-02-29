import { Box, Button, IconButton, useTheme } from '@mui/material';
import { FC, useContext } from 'react';
import { ColorModeContext, tokens } from '../../theme';
import InputBase from '@mui/material/InputBase';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import GroupsIcon from '@mui/icons-material/Groups';
import { Link } from 'react-router-dom';

interface TopbarProps {
  setIsSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar: FC<TopbarProps> = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
 

        <Box ml={4} sx={{ display: 'flex', gap: '16px', marginLeft: '20px' }}>
      
        <Link to={'/'} >
          <Button variant="outlined" startIcon={<SchoolIcon />}>
            Панель обучения
          </Button>
        </Link>
        <Link to={'/team'}>
          <Button variant="outlined" startIcon={<GroupsIcon />}>
            Мои ученики
          </Button>
        </Link>
        <Link to={'/courses'}>
          <Button variant="outlined" startIcon={<CastForEducationIcon />}>
            Обучающие материалы
          </Button>
          </Link>
        </Box>
      

    </Box>
  );
};

export default Topbar;

