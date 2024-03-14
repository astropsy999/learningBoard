import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useLearners } from '../data/store/learners.store';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface BlockCourseForProps {
  lockedUsers: string[];
}

export const BlockCourseFor: React.FC<BlockCourseForProps> = ({
  lockedUsers,
}) => {
  const { allLearners } = useLearners();
  // Формируем массив имен заблокированных пользователей
  const defaultSelectedNames = lockedUsers;

  // Фильтруем массив всех пользователей, оставляя только тех, кто заблокирован
  const defaultSelectedUsers = allLearners!.filter((user) =>
    defaultSelectedNames.includes(user.name),
  );

  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={allLearners!}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.name}
        </li>
      )}
      defaultValue={defaultSelectedUsers}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Блокировать"
          placeholder="Выбрать для блокировки"
        />
      )}
    />
  );
};
