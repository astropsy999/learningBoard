import { CardContent, Typography } from "@mui/material";
import React from "react";
import { truncateDescription } from "../../helpers/truncateDescriptions";
import { CourseData } from "../../data/store/courses.store";

interface CourseCardContentProps {
    courseItem: CourseData
    isHighlighted: string
}

export const CourseCardContent: React.FC<CourseCardContentProps> = (props) => {
    const { courseItem, isHighlighted } = props
    return (
        <CardContent sx={{ maxHeight: 100 }}>
        <Typography gutterBottom variant="h5" component="div" fontWeight={isHighlighted}>
          {courseItem.title}
        </Typography>
        <Typography variant="body2"  >
          {truncateDescription(courseItem.description!)}
        </Typography>
      </CardContent>
    );
};