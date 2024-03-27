import { Autocomplete, Box, Checkbox, Rating, RatingProps, TextField } from "@mui/material";
import { GridColDef, GridFilterInputValueProps, GridFilterPanel, GridLogicOperator } from "@mui/x-data-grid";
import React from "react";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Divisions } from "../data/types.store";

export interface CustomFilterPanelProps {
  selectedOptions: string[];
  onChange: (selectedOptions: string[]) => void;
}

function CustomFilterPanel(props: GridFilterInputValueProps & CustomFilterPanelProps) {

  const { onChange } = props;

  

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;


  const handleFilterChange = (event: React.ChangeEvent<{}>, selectedOptions: string[]) => {
    onChange(selectedOptions); // Передаем выбранные значения в родительский компонент
  };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        pl: '20px',
      }}
    >
   <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        onChange={handleFilterChange}
        disableCloseOnSelect
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8, color: 'black' }}
              checked={selected} />
            {option}
          </li>
        )}
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Выбрать"
            placeholder="Выбрать для фильтрации" />
        )} options={['Инженер', 'Программист']} 
      />
    </Box>
  );
}

export default CustomFilterPanel;
