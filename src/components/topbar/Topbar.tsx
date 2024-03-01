import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import { Box, Button } from '@mui/material';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { RenderAssignAllButton } from '../AssignAllBtn';
import { useUsers } from '../../data/store';

interface TopbarProps {
  setIsSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar: FC<TopbarProps> = () => {
  // const theme = useTheme();
  // const colorMode = useContext(ColorModeContext);

  const { SELECTED_ROWS_DATA } = useUsers();

  const isAssignAllButton = SELECTED_ROWS_DATA.length > 0;

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      position={'fixed'}
      bgcolor={'whitesmoke'}
      width={'100%'}
    >
      <Box ml={4} sx={{ display: 'flex', gap: '16px', marginLeft: '20px' }}>
        {!isAssignAllButton ? (
          <Link to={'/'}>
            <Button variant="outlined" startIcon={<SchoolIcon />}>
              Панель обучения
            </Button>
          </Link>
        ) : (
          <Button variant="outlined" startIcon={<SchoolIcon />} disabled>
            Панель обучения
          </Button>
        )}

        <Link to={'/team'}>
          <Button variant="outlined" startIcon={<GroupsIcon />}>
            Мои ученики
          </Button>
        </Link>
        {isAssignAllButton && <RenderAssignAllButton />}
      </Box>
    </Box>
  );
};

export default Topbar;
