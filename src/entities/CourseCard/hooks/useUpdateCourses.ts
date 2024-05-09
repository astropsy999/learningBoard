import { Bounce, toast } from 'react-toastify';
import { mutate } from 'swr';
import { ToUpdateUser, updateAllData } from '../../../app/api/api';
import { CoursesWithDeadline, ILearner } from '../../../app/types/store';

export const useUpdateCourses = (setDeadlineDate: (date: string) => void) => {
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
    selectedRowsData: ILearner[],
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
      .filter(Boolean) as ToUpdateUser[];
  };

  return { updateCourses, prepareDataToUpdate };
};
