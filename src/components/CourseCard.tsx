import { Checkbox, Chip, useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { CourseData, useCourses } from '../data/store/courses.store';
import { tokens } from '../theme';

interface CourseCardProps {
  courseItem: CourseData;
  assigned: number[]
}

export const CourseCard: React.FC<CourseCardProps> = ({ courseItem, assigned }) => {
  const [checked, setChecked] = React.useState(false);
  const { selectedCoursesToSave, setSelectedCoursesToSave } = useCourses();

  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  React.useEffect(() => {
    // Проверяем, содержится ли ID курса в массиве assigned
    if (assigned.includes(courseItem.id)) {
      setChecked(true); // Если содержится, устанавливаем checked в true
    }
  }, [assigned, courseItem.id]);

  const handleCardClick = () => {
    const newChecked = !checked; // Получаем новое значение checked
    setChecked(newChecked); // Устанавливаем новое значение checked
  
    // Ваша логика обновления состояния selectedCoursesToSave
    if (!checked) {
      setSelectedCoursesToSave([...selectedCoursesToSave, courseItem]);
    } else {
      setSelectedCoursesToSave(
        selectedCoursesToSave.filter((item) => item !== courseItem),
      );
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        minHeight: 170,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        backgroundColor: checked ? colors.blueAccent[900] : 'inherit',
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {courseItem.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {courseItem.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Checkbox color="info" checked={checked} />
        <Chip
          label={courseItem.type}
          color={courseItem.type === 'Тест' ? 'info' : 'success'}
          variant={'outlined'}
        />
      </CardActions>
    </Card>
  );
};
