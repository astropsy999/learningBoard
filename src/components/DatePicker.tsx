import { DateBuilderReturnType, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/ru';
import * as React from 'react';

interface AssignDatePickerProps {
  onDateChange: (date: Object | null) => void;
}

export default function AssignDatePicker({
  onDateChange,
}: AssignDatePickerProps) {
  const [value, setValue] = React.useState<Object | null>(null);
  const handleDateChange = (newValue: Object | null) => {
    setValue(newValue);

    // Вызываем функцию обратного вызова, передавая выбранную дату
    onDateChange(newValue || null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <DatePicker
        label="Пройти до..."
        format="DD.MM.YYYY"
        value={value}
        onChange={handleDateChange}
      />
    </LocalizationProvider>
  );
}
