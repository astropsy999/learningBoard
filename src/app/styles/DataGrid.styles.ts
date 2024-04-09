import { tokens } from '../theme';
import { themeSettings } from '../theme';

// eslint-disable-next-line react-hooks/rules-of-hooks
// const theme = () =>  useTheme();
const { palette } = themeSettings('light');
const colors = tokens(palette.mode);

export const dataGridStyles = {
  root: {
    '& .flex-column': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '& .cell-margins': {
      margin: '10px 5px',
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

    '& .MuiDataGrid-columnHeaderDraggableContainer': {},
    '& .MuiDataGrid-columnHeader': {
      backgroundColor: '#293541',
      borderRight: `1px solid #81b8c4`,
      color: 'white',
    },
    '& .MuiDataGrid-virtualScroller': {
      backgroundColor: colors.primary[100],
    },
    '& .MuiDataGrid-footerContainer': {
      borderTop: 'none',
      backgroundColor: '#293541',
    },

    '& .MuiDataGrid-columnHeaderCheckbox': {
      backgroundColor: '#293541',
    },
    '& .base-Popper-root .MuiTooltip-popper .MuiTooltip-popperInteractive': {
      fontSize: '1em ',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      overflow: 'visible',
      lineHeight: '0.8rem',
      whiteSpace: 'normal',
      fontSize: '1rem',
    },
    // '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
    //   py: '3px',
    // },
    '& .MuiDataGrid-colCell, & .MuiDataGrid-cell': {
      borderRight: `1px solid lightgrey`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    '& .MuiDataGrid-row-selected::before': {
      background: 'blue',
    },
  },
};