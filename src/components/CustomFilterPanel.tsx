import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Box, Checkbox, TextField } from '@mui/material';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useCourses } from '../data/store/courses.store';
import { useLearners } from '../data/store/learners.store';
import { getAllPositions } from '../helpers/getAllPositions';

export interface CustomFilterInputProps {
  selectedOptions: string[];
  onChange: (selectedOptions: string[]) => void;
  // values: string[];
}

function CustomFilterInput(
  props: GridFilterInputValueProps & CustomFilterInputProps,
) {
  const { onChange, selectedOptions } = props;
  const [options, setOptions] = useState<string[]>([]);

  const { allLearners } = useLearners();
  useEffect(() => {
    if (allLearners!.length > 0) {
      const allOptions = getAllPositions(allLearners!).filter(
        (option) => option !== undefined,
      ) as string[];
      setOptions(allOptions);
    }
  }, [allLearners]);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const handleFilterChange = (
    event: React.ChangeEvent<{}>,
    selectedOptions: string[],
  ) => {
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
              checked={selected}
            />
            {option}
          </li>
        )}
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Выбрать"
            placeholder="Выбрать для фильтрации"
          />
        )}
        options={options!}
      />
    </Box>
  );
}

export default CustomFilterInput;
function useUsers() {
  throw new Error('Function not implemented.');
}
