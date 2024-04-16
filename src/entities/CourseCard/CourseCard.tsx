import { useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import * as React from 'react';
import { mutate } from 'swr';
import { lockCourses } from '../../app/api/api';
import { CourseData, useCourses } from '../../app/data/store/courses';
import { useLearners } from '../../app/data/store/learners';
import { tokens } from '../../app/theme';
import { CoursesWithDeadline } from '../../app/types/store.types';
import { getDeadlineDate } from '../../shared/helpers/getDeadlineDate';
import { CourseCardActions } from './CourseCardActions';
import { CourseCardContent } from './CoursecardContent';
import { useCourseDeadline } from './hooks/useCourseDeadline';
import { useCourseLocking } from './hooks/useCourseLocking';
import { useCoursesAddRemove } from './hooks/useCoursesAddRemove';
import { useSelectedRowsData } from './hooks/useSelectedRowsData';
import { useUpdateCourses } from './hooks/useUpdateCourses';
import { useCourseSelect } from './hooks/useCourseSelect';

interface CourseCardProps {
  courseItem: CourseData;
  assigned: CoursesWithDeadline[];
  isLocked: boolean;
  allLockedCourses: number[];
}

export const CourseCard: React.FC<CourseCardProps> = (props) => {
  const { courseItem, assigned, isLocked } = props;
  const [checked, setChecked] = React.useState(false);
  const {
    selectedCoursesToSave,
    setSelectedCoursesToSave,
    massAssignedCourses,
    setMassAssignedCourses,
  } = useCourses();
  const { onlyLearnerName, allLearners, selectedRowsData, isMassEditMode } =
    useLearners();
  const [deadlineDate, setDeadlineDate] = React.useState<string | number>();
  const [courseLocked, setCourseLocked] = React.useState<boolean>(isLocked);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isCourseCardLoading, setIsCourseCardLoading] =
    React.useState<boolean>(false);
  const [isCoursedateLoading, setIsCoursedateLoading] =
    React.useState<boolean>(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    everySelectedUsersHaveLockedThisCourse,
    everySelectedUsersHaveAssignedThisCourse,
    everyDate,
  } = useSelectedRowsData(isMassEditMode, selectedRowsData);

  const globalLoading = isLoading || isCourseCardLoading || isCoursedateLoading;
  const isHighlighted = checked ? 'bold' : 'normal';

  // const classes = useStyles({ globalLoading, checked, courseLocked, colors });

  React.useEffect(() => {
    const assignedIds = assigned.map((item) => item.id);

    let isEverySelected = everySelectedUsersHaveAssignedThisCourse(
      courseItem.id,
    );
    let isEveryLocked = everySelectedUsersHaveLockedThisCourse(courseItem.id);
    const date = everyDate(courseItem.id);
    const stringDate = date ? new Date(date * 1000).toLocaleDateString() : null;

    if (assignedIds.includes(courseItem.id)) {
      setChecked(true);
    }

    if (isEverySelected) {
      setChecked(true);
      isEverySelected = false;
      const existElem = massAssignedCourses.find(
        (item) => item.id === courseItem.id,
      );
      if (!existElem) {
        massAssignedCourses.push({ id: courseItem.id, deadline: date });
      }
    }

    if (isEveryLocked) {
      setCourseLocked(true);
      isEveryLocked = false;
    }
    !isMassEditMode
      ? setDeadlineDate(
          getDeadlineDate(courseItem.id, false, assigned) as string,
        )
      : setDeadlineDate(stringDate!);
  }, [assigned, courseItem.id]);

  const { updateCourses, prepareDataToUpdate } =
    useUpdateCourses(setDeadlineDate);

  const { addCoursesMass, removeCoursesMass } = useCoursesAddRemove(
    selectedRowsData,
    setIsCourseCardLoading,
    updateCourses,
    prepareDataToUpdate,
  );

  const { handleCardSelect } = useCourseSelect(
    isMassEditMode,
    checked,
    courseItem,
    massAssignedCourses,
    selectedCoursesToSave,
    setChecked,
    setMassAssignedCourses,
    setSelectedCoursesToSave,
    addCoursesMass,
    removeCoursesMass,
  );

  const { handleDateChange } = useCourseDeadline(
    massAssignedCourses,
    setMassAssignedCourses,
    selectedRowsData,
    updateCourses,
    setIsCoursedateLoading,
    selectedCoursesToSave,
    setSelectedCoursesToSave,
    isMassEditMode,
  );

  const { handleLockUnlock } = useCourseLocking(
    selectedRowsData,
    onlyLearnerName,
    allLearners!,
    lockCourses,
    mutate,
    setCourseLocked,
    setIsLoading,
  );

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
        cursor: globalLoading ? 'wait' : 'pointer',
        backgroundColor: checked
          ? courseLocked
            ? colors.redAccent[900]
            : colors.blueAccent[900]
          : courseLocked
          ? colors.redAccent[900]
          : 'inherit',
        pointerEvents: globalLoading ? 'none' : 'auto',
        opacity: globalLoading ? 0.5 : 1,
        position: 'relative',
      }}
      onClick={handleCardSelect}
    >
      <CourseCardContent
        courseItem={courseItem}
        isHighlighted={isHighlighted}
      />
      <CourseCardActions
        checked={checked}
        courseLocked={courseLocked}
        handleLockUnlock={handleLockUnlock}
        courseItem={courseItem}
        globalLoading={globalLoading}
        isCoursedateLoading={isCoursedateLoading}
        isCourseCardLoading={isCourseCardLoading}
        handleDateChange={handleDateChange}
        deadlineDate={deadlineDate}
        isLoading={isLoading}
      />
    </Card>
  );
};
