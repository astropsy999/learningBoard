import SchoolIcon from '@mui/icons-material/School';
import { Box, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUserData } from '../api/gdc.users.api';
import { useLearners } from '../data/store/learners.store';
import { CurrentUserData } from '../data/types.store';
import { RenderAssignAllButton } from './AssignAllBtn';
import SplitButton from './SplitButton';
import { useGridApiRef } from '@mui/x-data-grid';

interface TopbarProps {
  setIsSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Topbar: FC<TopbarProps> = () => {
  // const theme = useTheme();
  // const colorMode = useContext(ColorModeContext);

  const { SELECTED_ROWS_DATA, setCurrentUserData, setCurrenUserName } =
    useLearners();

  const isAssignAllButton = SELECTED_ROWS_DATA.length > 0;

  const { data, isLoading, isError } = useQuery<CurrentUserData | undefined>({
    queryKey: ['currentUserData'],
    queryFn: getCurrentUserData,
  });

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
    >
      <Box ml={4} sx={{ display: 'flex', gap: '16px', marginLeft: '20px' }}>
        {!isAssignAllButton ? (
          <Link to={'/'}>
            <Button variant="outlined" startIcon={<SchoolIcon />}>
              Статистика
            </Button>
          </Link>
        ) : (
          <Button variant="outlined" startIcon={<SchoolIcon />} disabled>
            Статистика
          </Button>
        )}

        <Link to={'/team'}>
          <SplitButton />
        </Link>
        {isAssignAllButton && <RenderAssignAllButton />}
      </Box>
    </Box>
  );
};

export default Topbar;
