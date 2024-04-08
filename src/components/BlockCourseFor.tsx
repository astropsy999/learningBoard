import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useLearners } from '../data/store/learners.store';
import { ILearner } from '../data/types.store';
import { Skeleton } from '@mui/material';

const icon = <CheckBoxOutlineBlankIcon fontSize="small"  />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface BlockCourseForProps {
  lockedUsers: string[];
  isLoading: boolean;
}

export const BlockCourseFor: React.FC<BlockCourseForProps> = ({
  lockedUsers,
  isLoading,
}) => {
  const { allLearners, setSelectedLearnersToLockCourse } = useLearners();

  const defaultSelectedNames = lockedUsers;

  const defaultSelectedUsers = allLearners!.filter(
    (user) => user.name && defaultSelectedNames.includes(user.name),
  );

  const handleSelectedLearnersChange = (
    event: React.ChangeEvent<{}>,
    value: string[] | ILearner[],
  ) => {
    setSelectedLearnersToLockCourse(value);
  };

  const sortedLearners = allLearners!.sort((a, b) => {
    if (a.name && b.name) {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <React.Fragment>
      {isLoading ? (
        <Skeleton
          animation="wave"
          height="130%"
          width="70%"
          sx={{ opacity: 0.8 }}
        />
      ) : (
        <Autocomplete
          multiple
          id="checkboxes-tags-demo"
          options={sortedLearners!}
          onChange={handleSelectedLearnersChange}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name || ''}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8, color: 'black' }}
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
      )}
    </React.Fragment>
  );
};
