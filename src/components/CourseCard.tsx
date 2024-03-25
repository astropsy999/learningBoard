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
  
}

export const CourseCard: React.FC<CourseCardProps> = ({
  courseItem,
  assigned,
}) => {
  const [checked, setChecked] = React.useState(false);
  const { selectedCoursesToSave, setSelectedCoursesToSave } = useCourses();
  const [deadlineCourseDate, setDeadlineCourseDate] = React.useState<number>()
  

  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  React.useEffect(() => {
    const assignedIds = assigned.map((item) => item.id);
    // const assinnedDeadlines = assigned.map((item) => item.deadline);
   

    if (assignedIds.includes(courseItem.id)) {
      setChecked(true);
    }
  }, [assigned, courseItem.id]);

  const getDeadlineDate = (courseId: number) => {
    const deadline = assigned.find((course) => course.id === courseId)?.deadline;
    switch (deadline) {
      case null:
        return 'Без срока'
      case undefined:
        return '' ;
      default: 
      const date = new Date(deadline! * 1000);
      return date.toLocaleDateString('ru-RU') ;
    }
    
  };

  const deadlineDate = getDeadlineDate(courseItem.id)

  const handleCardClick = () => {
    const newChecked = !checked; // Получаем новое значение checked
    setChecked(newChecked); // Устанавливаем новое значение checked

    if (!checked) {
      setSelectedCoursesToSave([...selectedCoursesToSave, courseItem]);
    } else {
      setSelectedCoursesToSave(
        selectedCoursesToSave.filter((item) => item !== courseItem),
      );
    }
  };

  const handleDateChange = (newDate: Object | null) => {
    // @ts-ignore
    const dateString = newDate!.$d;
    const unixTime = new Date(dateString).getTime() / 1000;
    setDeadlineCourseDate(unixTime);
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
        backgroundColor: checked ? colors.blueAccent[900] : 'inherit',
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
      
        {deadlineDate.length !== 0 
          ? <Chip label={deadlineDate} /> 
          : <AssignDatePicker 
              onDateChange={handleDateChange} 
              disabled={!checked} />}
      </CardActions>
    </Card>
  );
};
