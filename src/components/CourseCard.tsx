import {
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Switch,
  useTheme,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { CourseData, useCourses } from '../data/store/courses.store';
import { tokens } from '../theme';
import { truncateDescription } from '../helpers/truncateDescriptions';
import { CourseWithDeadline, lockCourses } from '../services/api.service';
import AssignDatePicker from './DatePicker';
import { useLearners } from '../data/store/learners.store';
import { getLearnerIdByName } from '../helpers/getLearnerIdByName';
import { mutate } from 'swr';
import { Bounce, toast } from 'react-toastify';
import { getLockedUsersByCourseId } from '../helpers/getlockedUsersByCourseId';

interface CourseCardProps {
  courseItem: CourseData;
  assigned: CourseWithDeadline[];
  isLocked: boolean;
  allLockedCourses: number[];
}

export const CourseCard: React.FC<CourseCardProps> = ({
  courseItem,
  assigned,
  isLocked,
  allLockedCourses,
}) => {
  const [checked, setChecked] = React.useState(false);
  const { selectedCoursesToSave, setSelectedCoursesToSave } = useCourses();
  const { onlyLearnerName, allLearners, currentUserData, selectedRowsData } =
    useLearners();
  const [deadlineCourseDate, setDeadlineCourseDate] = React.useState<
    string | null
  >(null);
  const [deadlineDate, setDeadlineDate] = React.useState<string | number>();
  const [courseLocked, setCourseLocked] = React.useState<boolean>(isLocked);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

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

  const handleLockUnlock = async (
    e: React.MouseEvent<HTMLLabelElement, MouseEvent>,
    courseId: number,
    courseLocked: boolean,
  ) => {
    e.stopPropagation();
    setIsLoading(true);

    const learnerId = getLearnerIdByName(onlyLearnerName, allLearners!);
    const allLockedLearners = getLockedUsersByCourseId(courseId, allLearners!);
    console.log('🚀 ~ courseLocked:', courseLocked);

    console.log('🚀 ~ allLockedLearners:', allLockedLearners);

    const learnersToLockIDs = onlyLearnerName
      ? courseLocked
        ? allLockedLearners.filter((learner) => learner !== learnerId)
        : [...allLockedLearners, learnerId!]
      : courseLocked
      ? []
      : Array.from(
          new Set([
            ...allLockedLearners,
            ...selectedRowsData.map((row) => +row.id!),
          ]),
        );

    const lockedLearnersToSend = [
      {
        id: courseId,
        users: learnersToLockIDs as number[],
      },
    ];
    console.log('🚀 ~ learnersToLockIDs:', learnersToLockIDs);

    try {
      const result = await lockCourses(lockedLearnersToSend);
      mutate('allData').then(() => {
        toast.success(result[0].data.message, {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Bounce,
        });
        setIsLoading(false);
        setCourseLocked(!courseLocked);
      });
    } catch (error) {
      // Handle error
      setIsLoading(false);
    }
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
        cursor: isLoading ? 'wait' : 'pointer',
        backgroundColor: checked
          ? courseLocked
            ? colors.redAccent[900]
            : colors.blueAccent[900]
          : 'inherit',
        pointerEvents: isLoading ? 'none' : 'auto',
        opacity: isLoading ? 0.5 : 1,
        position: 'relative',
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
        {currentUserData?.manager.level === 1 && (
          <>
            {isLoading ? (
              <CircularProgress size={24} color="info" />
            ) : (
              <FormControlLabel
                control={
                  <Switch
                    checked={courseLocked}
                    color={courseLocked ? 'warning' : 'secondary'}
                  />
                }
                label={courseLocked ? 'Разблокировать' : 'Блокировать'}
                onClick={(e) =>
                  handleLockUnlock(e, courseItem.id, courseLocked)
                }
              />
            )}
          </>
        )}
        <AssignDatePicker
          onDateChange={(newDate) => handleDateChange(newDate, courseItem.id)}
          disabled={!checked}
          defaultValue={deadlineDate as string}
        />
      </CardActions>
    </Card>
  );
};
