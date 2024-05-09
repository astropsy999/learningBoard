import { ToUpdateUser } from '../../../app/api/api';
import { CoursesWithDeadline, ILearner } from '../../../app/types/store';

export const useCoursesAddRemove = (
  selectedRowsData: ILearner[],
  setIsCourseCardLoading: (isLoading: boolean) => void,
  updateCourses: (
    dataToUpdate: ToUpdateUser[],
    setLocalLoaderType: (prevState: boolean) => void,
    message: string,
  ) => void,
  prepareDataToUpdate: (
    courses: CoursesWithDeadline[],
    selectedRowsData: ILearner[],
  ) => ToUpdateUser[],
) => {
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
      selectedRowsData!,
    ) as ToUpdateUser[];
    await updateCourses(
      dataToUpdate,
      setIsCourseCardLoading,
      'Курс успешно назначен!',
    );
  };

  return { removeCoursesMass, addCoursesMass };
};
