import { Autocomplete, Checkbox, TextField } from "@mui/material";
import React from "react";

export const DivisionFilterInput: React.FC = () => {
    return (
      // Добавляем условный рендеринг для Autocomplete и Skeleton
      <React.Fragment>

          <Autocomplete
            isOptionEqualToValue={() => true}
            multiple
            id="checkboxes-tags-demo"
            options={[{id: 1, title: 'Отдел информационных технологий'}]}
            onChange={()=>{}}
            disableCloseOnSelect
            getOptionLabel={(option) => option.title  || ''}
          
            // defaultValue={defaultSelectedUsers}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Блокировать"
                placeholder="Выбрать для блокировки"
              />
            )}
          />

      </React.Fragment>
    );
  };