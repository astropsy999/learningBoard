import {
  Box,
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
import {  ToUpdateUser, lockCourses, updateAllData } from '../services/api.service';
import AssignDatePicker from './DatePicker';
import { useLearners } from '../data/store/learners.store';
import { getLearnerIdByName } from '../helpers/getLearnerIdByName';
import { mutate } from 'swr';
import { Bounce, toast } from 'react-toastify';
import { getLockedUsersByCourseId } from '../helpers/getlockedUsersByCourseId';
import { CoursesWithDeadline } from '../data/types.store';
import { getDeadlineDate } from '../helpers/getDeadlineDate';
import {Skeleton} from '@mui/material';

interface CourseCardProps {
  courseItem: CourseData;
  assigned: CoursesWithDeadline[];
  isLocked: boolean;
  allLockedCourses: number[];
}

export const CourseCard: React.FC<CourseCardProps> = ({
  courseItem,
  assigned,
  isLocked,
}) => {
  const [checked, setChecked] = React.useState(false);
  const { selectedCoursesToSave, setSelectedCoursesToSave, massAssignedCourses, setMassAssignedCourses } = useCourses();
  const { onlyLearnerName, allLearners, currentUserData, selectedRowsData, isMassEditMode } =
    useLearners();
  const [deadlineCourseDate, setDeadlineCourseDate] = React.useState<
    string | null
  >(null);
  const [deadlineDate, setDeadlineDate] = React.useState<string | number>();
  const [courseLocked, setCourseLocked] = React.useState<boolean>(isLocked);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isCourseCardLoading, setIsCourseCardLoading] = React.useState<boolean>(false);
  const [isCoursedateLoading, setIsCoursedateLoading] = React.useState<boolean>(false);

  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const everySelectedUsersHaveLockedThisCourse = (courseId: number) => 

    isMassEditMode 
    ? selectedRowsData?.every((item) => {
      return item?.courses_exclude?.some((course) => course === courseId);
    })
    : false

  const everySelectedUsersHaveAssignedThisCourse = (courseId: number) =>
    isMassEditMode
      ? selectedRowsData.every((item) =>
          item?.courses?.some((course) => +Object.keys(course)[0] === courseId)
        )
      : false;

  const everyDate = (courseId: number) => {
    return selectedRowsData.map((item) => {
      return item?.courses?.find((course) => +Object.keys(course)[0] === courseId)?.deadline;
    })[0]
  }

  React.useEffect(() => {

    const assignedIds = assigned.map((item) => item.id);

    let isEverySelected = everySelectedUsersHaveAssignedThisCourse(courseItem.id)
    let isEveryLocked = everySelectedUsersHaveLockedThisCourse(courseItem.id)
    const date = everyDate(courseItem.id)
    const stringDate = date ? new Date(date * 1000).toLocaleDateString() : null

    if (assignedIds.includes(courseItem.id)) {
      setChecked(true);
    }

    if(isEverySelected) {
      setChecked(true);
      isEverySelected = false;
      const existElem = massAssignedCourses.find(item => item.id === courseItem.id);
      if (!existElem) {
        massAssignedCourses.push(
          { id: courseItem.id, 
            deadline: date
          }
        );
      }
    }

    if (isEveryLocked) {
      setCourseLocked(true);
      isEveryLocked = false;
    }
    !isMassEditMode 
      ? setDeadlineDate(getDeadlineDate(courseItem.id, false, assigned) as string) 
      : setDeadlineDate(stringDate!)
  }, [assigned, courseItem.id]);

  const updateCourses = async (
    dataToUpdate: ToUpdateUser[], 
    setLocalLoaderType: (prevState: boolean) => void,
    newTime: number | undefined = undefined) => {
    setLocalLoaderType(true);
    const stringDate = newTime ? new Date(newTime * 1000).toLocaleDateString() : null
    const filteredDataToUpdate = dataToUpdate?.filter((user) => user !== null) as ToUpdateUser[];
    const result = await updateAllData(filteredDataToUpdate);

    mutate('allData').then(() => {
      toast.success(result[0]?.data?.message, {
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
      stringDate && 
      setDeadlineDate(stringDate!);
      setLocalLoaderType(false);

    });
  };

  const prepareDataToUpdate = (courses: CoursesWithDeadline[], selectedRowsData: any[]) => {
    return selectedRowsData
      .map((user) => {
        if (!user) return null;
        const courseMap: { [id: number]: CoursesWithDeadline } = {};
        courses.forEach((course) => {
          courseMap[course.id] = course;
        });
        const uniqueCourses = Object.values(courseMap);
        return {
          id: user.id,
          courses: uniqueCourses,
        };
      })
      .filter(Boolean);
  };
  
  


  const removeCoursesMass =  async (withOutRemovedCourses: CoursesWithDeadline[]) => {

    const dataToUpdate = prepareDataToUpdate(withOutRemovedCourses, selectedRowsData) as ToUpdateUser[];
    await updateCourses(dataToUpdate, setIsCourseCardLoading);

  };

  const addCoursesMass =  async (withAddedCourses: CoursesWithDeadline[]) => {

    const dataToUpdate = prepareDataToUpdate(withAddedCourses, selectedRowsData) as ToUpdateUser[]
    await updateCourses(dataToUpdate, setIsCourseCardLoading);
  };

  const handleMassDateChange =  (newTime: number, courseId: number) => {
    // Фильтруем массив massAssignedCourses, чтобы изменить только сроки для курсов с courseId
    const updatedMassAssignedCourses = massAssignedCourses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          deadline: newTime
        };
      }
      return course;
    });
    
    let dataToUpdate = selectedRowsData
      .map((user) => {
        if (!user) return null;
        return {
          id: user.id,
          courses: updatedMassAssignedCourses,
        };
      })
      .filter(Boolean) as ToUpdateUser[];
    
    updateCourses(dataToUpdate, setIsCoursedateLoading, newTime);
  };

  const handleCardClick = () => {

    const newChecked = !checked;
    setChecked(newChecked);

    if(isMassEditMode) {
      if (!checked) {
        const withAddedCourses = [...massAssignedCourses, { id: courseItem.id, deadline: null }];
        setMassAssignedCourses([...massAssignedCourses, { id: courseItem.id, deadline: null }])
        addCoursesMass(withAddedCourses)
      } else {
        const withOutRemovedCourses = massAssignedCourses.filter((item) => item.id !== courseItem.id);
        setMassAssignedCourses([...massAssignedCourses.filter((item) => item.id !== courseItem.id)])
        removeCoursesMass(withOutRemovedCourses)
      }
    }

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

    if(isMassEditMode) {
      handleMassDateChange(unixTime, itemId)
    } else {
      const findedItem = selectedCoursesToSave.find((item) => item.id === itemId);
      findedItem!!['deadline'] = unixTime;
      setSelectedCoursesToSave([...selectedCoursesToSave]);
    }
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
      setIsLoading(false);
    }
  };

  const globalLoading = isLoading || isCourseCardLoading || isCoursedateLoading;
  const isHighlighted = checked ? 'bold' : 'normal'

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
      onClick={handleCardClick}
    >
      <CardContent sx={{ maxHeight: 100 }}>
        <Typography gutterBottom variant="h5" component="div" fontWeight={isHighlighted}>
          {courseItem.title}
        </Typography>
        <Typography variant="body2"  >
          {truncateDescription(courseItem.description!)}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
        <Box>
          {!isCourseCardLoading 
            ? <Checkbox color="info" checked={checked} /> 
            : <CircularProgress size={33} color="info"  />
          }
        </Box>
        {currentUserData?.manager.level === 1 && (
          <Box>
            {isLoading ? (
              <CircularProgress size={30} color="info" />
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
          </Box>
        )}
        <Box 
          sx={{
            backgroundColor: !globalLoading ? (!courseLocked ? 'lightskyblue' : 'lightcoral') : 'inherit', 
            display: !checked ? 'none' : 'block', 
            borderRadius: 1,
            }} >
        {!isCoursedateLoading 
            ? <AssignDatePicker
                onDateChange={(newDate) => handleDateChange(newDate, courseItem.id)}
                disabled={!checked}
                defaultValue={deadlineDate as string}
          />
            : <Skeleton width={130} height={60}/>}
        </Box>
      </CardActions>
    </Card>
  );
};
