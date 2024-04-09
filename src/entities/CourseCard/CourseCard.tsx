import { useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import * as React from 'react';
import { Bounce, toast } from 'react-toastify';
import { mutate } from 'swr';
import { CourseData, useCourses } from '../../app/data/store/courses';
import { useLearners } from '../../app/data/store/learners';
import { CoursesWithDeadline } from '../../app/types/types.store';
import { getDeadlineDate } from '../../shared/helpers/getDeadlineDate';
import { getLearnerIdByName } from '../../shared/helpers/getLearnerIdByName';
import { getLockedUsersByCourseId } from '../../shared/helpers/getlockedUsersByCourseId';
import { ToUpdateUser, lockCourses, updateAllData } from '../../app/api/api';
import { tokens } from '../../app/theme';
import { CourseCardActions } from './CourseCardActions';
import { CourseCardContent } from './CoursecardContent';

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

  const everySelectedUsersHaveLockedThisCourse = (courseId: number) =>
    isMassEditMode
      ? selectedRowsData?.every((item) => {
          return item?.courses_exclude?.some((course) => course === courseId);
        })
      : false;

  const everySelectedUsersHaveAssignedThisCourse = (courseId: number) =>
    isMassEditMode
      ? selectedRowsData.every((item) =>
          item?.courses?.some((course) => +Object.keys(course)[0] === courseId),
        )
      : false;

  const everyDate = (courseId: number) => {
    return selectedRowsData.map((item) => {
      return item?.courses?.find(
        (course) => +Object.keys(course)[0] === courseId,
      )?.deadline;
    })[0];
  };

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

  const updateCourses = async (
    dataToUpdate: ToUpdateUser[],
    setLocalLoaderType: (prevState: boolean) => void,
    message: string,
    newTime: number | undefined = undefined,
  ) => {
    setLocalLoaderType(true);
    const stringDate = newTime
      ? new Date(newTime * 1000).toLocaleDateString()
      : null;
    const filteredDataToUpdate = dataToUpdate?.filter(
      (user) => user !== null,
    ) as ToUpdateUser[];
    const result = await updateAllData(filteredDataToUpdate);

    mutate('allData').then(() => {
      const toastMessage = message || result[0]?.data?.message;

      toast.success(toastMessage, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });

      stringDate && setDeadlineDate(stringDate!);
      setLocalLoaderType(false);
    });
  };

  const prepareDataToUpdate = (
    courses: CoursesWithDeadline[],
    selectedRowsData: any[],
  ) => {
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

  const removeCoursesMass = async (
    withOutRemovedCourses: CoursesWithDeadline[],
  ) => {
    const dataToUpdate = prepareDataToUpdate(
      withOutRemovedCourses,
      selectedRowsData,
    ) as ToUpdateUser[];
    await updateCourses(
      dataToUpdate,
      setIsCourseCardLoading,
      'Курс успешно снят!',
    );
  };

  const addCoursesMass = async (withAddedCourses: CoursesWithDeadline[]) => {
    const dataToUpdate = prepareDataToUpdate(
      withAddedCourses,
      selectedRowsData,
    ) as ToUpdateUser[];
    await updateCourses(
      dataToUpdate,
      setIsCourseCardLoading,
      'Курс успешно назначен!',
    );
  };

  const handleMassDateChange = async (newTime: number, courseId: number) => {
    const updatedMassAssignedCourses = massAssignedCourses.map((course) => {
      if (course.id === courseId) {
        return {
          ...course,
          deadline: newTime,
        };
      }
      return course;
    });

    setMassAssignedCourses(updatedMassAssignedCourses);

    let dataToUpdate = selectedRowsData
      .map((user) => {
        if (!user) return null;
        return {
          id: user.id,
          courses: updatedMassAssignedCourses,
        };
      })
      .filter(Boolean) as ToUpdateUser[];

    await updateCourses(
      dataToUpdate,
      setIsCoursedateLoading,
      'Дата успешно сохранена',
      newTime,
    );
  };

  const handleCardClick = () => {
    const newChecked = !checked;
    setChecked(newChecked);

    if (isMassEditMode) {
      if (!checked) {
        const withAddedCourses = [
          ...massAssignedCourses,
          { id: courseItem.id, deadline: null },
        ];
        setMassAssignedCourses([
          ...massAssignedCourses,
          { id: courseItem.id, deadline: null },
        ]);
        addCoursesMass(withAddedCourses);
      } else {
        const withOutRemovedCourses = massAssignedCourses.filter(
          (item) => item.id !== courseItem.id,
        );
        setMassAssignedCourses([
          ...massAssignedCourses.filter((item) => item.id !== courseItem.id),
        ]);
        removeCoursesMass(withOutRemovedCourses);
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

    if (isMassEditMode) {
      handleMassDateChange(unixTime, itemId);
    } else {
      const findedItem = selectedCoursesToSave.find(
        (item) => item.id === itemId,
      );
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
        const lockedMessage =
          (courseLocked ? 'Курс разблокирован' : 'Курс заблокирован') ||
          result[0].data.message;

        toast.success(lockedMessage, {
          position: 'top-right',
          autoClose: 1500,
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
  const isHighlighted = checked ? 'bold' : 'normal';

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
