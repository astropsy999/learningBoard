import { CardContent, Typography } from '@mui/material';
import React from 'react';
import { truncateDescription } from '../../shared/helpers/truncateDescriptions';
import { CourseData } from '../../app/store/courses';

interface CourseCardContentProps {
  courseItem: CourseData;
  isHighlighted: string;
}
/**
 * Renders the content of a course card.
 *
 * @param {CourseCardContentProps} props - The properties for the course card content.
 * @return {JSX.Element} The JSX element representing the course card content.
 */
export const CourseCardContent: React.FC<CourseCardContentProps> = (props) => {
  const { courseItem, isHighlighted } = props;
  return (
    <CardContent sx={{ maxHeight: 100 }}>
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        fontWeight={isHighlighted}
      >
        {courseItem.title}
      </Typography>
      <Typography variant="body2">
        {truncateDescription(courseItem.description!)}
      </Typography>
    </CardContent>
  );
};
