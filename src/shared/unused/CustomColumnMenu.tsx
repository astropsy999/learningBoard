import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import {
  GridColumnMenu,
  GridColumnMenuItemProps,
  GridColumnMenuProps,
} from '@mui/x-data-grid';
import React from 'react';

export function CustomFilterItem(props: GridColumnMenuItemProps) {
  const { myCustomHandler, myCustomValue } = props;
  return (
    <MenuItem onClick={myCustomHandler}>
      <ListItemIcon>
        <FilterAltIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{myCustomValue}</ListItemText>
    </MenuItem>
  );
}

export function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenu
      {...props}
      slots={{
        columnMenuFilterItem: CustomFilterItem,
        columnMenuSortItem: null,
      }}
      slotProps={{
        columnMenuFilterItem: {
          displayOrder: 15,
          // Additional props
          myCustomValue: 'Кастомный фильтр',
          myCustomHandler: () => alert('Custom handler fired'),
        },
      }}
    />
  );
}
