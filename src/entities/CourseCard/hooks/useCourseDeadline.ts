import { useState } from 'react';

export const useCourseDeadline = () => {
  const [deadlineDate, setDeadlineDate] = useState<string | number | undefined>(
    '',
  );

  const handleDateChange = (newDate: string | number) => {
    setDeadlineDate(newDate);
  };

  return { deadlineDate, handleDateChange };
};
