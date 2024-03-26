import { Checkbox, Chip, useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { CourseData, useCourses } from '../data/store/courses.store';
import { tokens } from '../theme';
import { truncateDescription } from '../helpers/truncateDescriptions';
import { CourseWithDeadline } from '../services/api.service';
import AssignDatePicker from './DatePicker';

interface CourseCardProps {
  courseItem: CourseData;
  assigned: CourseWithDeadline[];
  isLocked: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  courseItem,
  assigned,
  isLocked,
}) => {
  const [checked, setChecked] = React.useState(false);
  const { selectedCoursesToSave, setSelectedCoursesToSave } = useCourses();
  const [deadlineCourseDate, setDeadlineCourseDate] = React.useState<
    string | null
  >(null);
  const [deadlineDate, setDeadlineDate] = React.useState<string | number>();

  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  React.useEffect(() => {
    const assignedIds = assigned.map((item) => item.id);

    if (assignedIds.includes(courseItem.id)) {
      setChecked(true);
    }

    setDeadlineDate(getDeadlineDate(courseItem.id) as string);
  }, [assigned, courseItem.id]);

  const getDeadlineDate = (courseId: number, isUnixTime = false) => {
    const deadline = assigned.find(
      (course) => course.id === courseId,
    )?.deadline;
    switch (deadline) {
      case null:
        return 'Без срока';
      case undefined:
        return '';
      default:
        const date = new Date(deadline! * 1000);
        return !isUnixTime ? date.toLocaleDateString('ru-RU') : deadline;
    }
  };

  const handleCardClick = () => {
    const newChecked = !checked;
    setChecked(newChecked);

    if (!checked) {
      setSelectedCoursesToSave([
        ...selectedCoursesToSave,
        { ...courseItem, deadline: null },
      ]);
    } else {
      setSelectedCoursesToSave(
        selectedCoursesToSave.filter((item) => item.id !== courseItem.id),
      );
    }
  };

  const handleDateChange = (newDate: Object | null, itemId: number) => {
    // @ts-ignore
    const dateString = newDate!.$d;
    const unixTime = new Date(dateString).getTime() / 1000;

    const findedItem = selectedCoursesToSave.find((item) => item.id === itemId);
    findedItem!['deadline'] = unixTime;

    setSelectedCoursesToSave([...selectedCoursesToSave]);
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        minWidth: 345,
        minHeight: 170,
        maxHeight: 170,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        backgroundColor: checked
          ? isLocked
            ? colors.redAccent[900]
            : colors.blueAccent[900]
          : 'inherit',
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ maxHeight: 100 }}>
        <Typography gutterBottom variant="h5" component="div">
          {courseItem.title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {truncateDescription(courseItem.description!)}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Checkbox color="info" checked={checked} />

        <AssignDatePicker
          onDateChange={(newDate) => handleDateChange(newDate, courseItem.id)}
          disabled={!checked}
          defaultValue={deadlineDate as string}
        />
      </CardActions>
    </Card>
  );
};
