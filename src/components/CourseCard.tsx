import { Checkbox, Chip, colors, useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { CourseData } from '../data/store/courses.store';
import { tokens } from '../theme';

interface CourseCardProps {
  courseItem: CourseData;
}

export const CourseCard: React.FC<CourseCardProps> = ({ courseItem }) => {
  const [checked, setChecked] = React.useState(false);

  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const handleCardClick = () => {
    setChecked(!checked);
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
          variant={courseItem.type === 'Тест' ? 'filled' : 'outlined'}
        />
      </CardActions>
    </Card>
  );
};
