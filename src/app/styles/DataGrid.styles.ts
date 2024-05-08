import { useTheme } from '@emotion/react';
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
      fontSize: '1.1rem',
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
  learnersGridStyles: {
    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
      py: '3px',
    },
    '& .MuiDataGrid-colCell, & .MuiDataGrid-cell': {
      borderRight: `1px solid lightgrey`,
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiDataGrid-main': {
      marginTop: '0.3em',
    },
    '& .truncate-cell': {
      lineHeight: '1 !important',
    },
  },
  statisticsGridStyles: {
    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
      py: '3px',
    },
    '& .MuiDataGrid-colCell, & .MuiDataGrid-cell': {
      borderRight: `1px solid lightgrey`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '& .MuiDataGrid-main': {
      marginTop: '0.2em',
    },
    '& .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeaderRow, & .MuiDataGrid-columnHeaderTitleContainerContent, & .MuiDataGrid-columnHeaderDraggableContainer, & .MuiDataGrid-columnHeaders':
      {
        maxHeight: '30px !important',
      },
    '@media (min-width: 1140px)': {
      '& .MuiDataGrid-columnHeaderTitleContainer': {
        marginLeft: '22px !important',
      },
    },
  },
  coursesGridStyles: {
    '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
      py: '8px',
    },
    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
      py: '15px',
    },
    '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
      py: '22px',
    },
  },
};
