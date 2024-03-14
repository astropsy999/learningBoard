import { tokens } from '../theme';
import { themeSettings } from '../theme';

// eslint-disable-next-line react-hooks/rules-of-hooks
// const theme = () =>  useTheme();
const { palette } = themeSettings('light');
const colors = tokens(palette.mode);

export const dataGridStyles = {
  root: {
    '& .MuiDataGrid-root': {
      border: 'none',
    },
    '& .name-cell': {
      fontWeight: 'bold',
      fontSize: '0.9rem',
    },
    '& .MuiDataGrid-cell': {
      borderBottom: 'none',
    },
    '& .name-column--cell': {
      backgroundColor: colors.blueAccent[900],
      fontWeight: 'bold',
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: colors.blueAccent[900],
      borderBottom: 'none',
    },
    '& .MuiDataGrid-virtualScroller': {
      backgroundColor: colors.primary[400],
    },
    '& .MuiDataGrid-footerContainer': {
      borderTop: 'none',
      backgroundColor: colors.blueAccent[900],
    },
    '& .MuiCheckbox-root': {
      color: `${colors.greenAccent[200]} !important`,
    },
    '& .MuiDataGrid-columnHeaderCheckbox': {
      backgroundColor: colors.blueAccent[900],
    },
    '& .center--cell': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
};
