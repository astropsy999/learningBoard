import SchoolIcon from '@mui/icons-material/School';
import { Box, Button } from '@mui/material';
import React, { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { getCurrentUserData } from '../services/api.service';
import { useLearners } from '../data/store/learners.store';
import { CurrentUserData } from '../data/types.store';
import { RenderAssignAllButton } from './AssignAllBtn';
import SplitButton from './SplitButton';

interface TopbarProps {
  setIsSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar: FC<TopbarProps> = () => {
  // const theme = useTheme();
  // const colorMode = useContext(ColorModeContext);

  const { SELECTED_ROWS_DATA, setCurrentUserData, setCurrenUserName } =
    useLearners();

  const isAssignAllButton = SELECTED_ROWS_DATA.length > 0;

  const {
    data,
    isLoading,
    error: isError,
  } = useSWR<CurrentUserData | undefined>(
    'currentUserData',
    getCurrentUserData,
  );

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setCurrentUserData(data);
      setCurrenUserName(data.Name);
    }
  }, [data, isLoading, isError, setCurrentUserData, setCurrenUserName]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      position={'fixed'}
      bgcolor={'whitesmoke'}
      width={'100%'}
      boxShadow={
        '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)'
      }
    >
      <Box ml={4} sx={{ display: 'flex', gap: '16px', marginLeft: '20px' }}>
        {isAssignAllButton && <RenderAssignAllButton />}

        <Link to={'/'}>
          <SplitButton />
        </Link>
        {!isAssignAllButton ? (
          <Link to={'/stat'}>
            <Button variant="outlined" startIcon={<SchoolIcon />}>
              Статистика
            </Button>
          </Link>
        ) : (
          <Button variant="outlined" startIcon={<SchoolIcon />} disabled>
            Статистика
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Topbar;
