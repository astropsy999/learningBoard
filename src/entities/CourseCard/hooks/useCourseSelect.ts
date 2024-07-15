
/**
 * Returns a function that handles selecting a course card based on the provided parameters.
 *
 * @param {boolean} isMassEditMode - Flag indicating if mass edit mode is enabled
 * @param {boolean} checked - Flag indicating if the course is checked
 * @param {any} courseItem - The course item to be selected
 * @param {any[]} massAssignedCourses - List of mass assigned courses
 * @param {any[]} selectedCoursesToSave - List of selected courses to save
 * @param {(checked: boolean) => void} setChecked - Function to set the checked status
 * @param {(courses: any[]) => void} setMassAssignedCourses - Function to set mass assigned courses
 * @param {(courses: any[]) => void} setSelectedCoursesToSave - Function to set selected courses to save
 * @param {(withAddedCourses: any[]) => Promise<void>} addCoursesMass - Function to add courses in mass
 * @param {(withOutRemovedCourses: any[]) => Promise<void>} removeCoursesMass - Function to remove courses in mass
 * @return {{ handleCardSelect: () => void }} Object with a function to handle selecting a course card
 */
export const useCourseSelect = (
  isMassEditMode: boolean,
  checked: boolean,
  courseItem: any,
  massAssignedCourses: any[],
  selectedCoursesToSave: any[],
  setChecked: (checked: boolean) => void,
  setMassAssignedCourses: (courses: any[]) => void,
  setSelectedCoursesToSave: (courses: any[]) => void,
  addCoursesMass: (withAddedCourses: any[]) => Promise<void>,
  removeCoursesMass: (withOutRemovedCourses: any[]) => Promise<void>,
) => {
  /**
   * A function that handles selecting a course card based on the provided parameters.
   *
   */
  const handleCardSelect = () => {
    const newChecked = !checked;
    setChecked(newChecked);

    if (isMassEditMode) {
      if (!checked) {
        const withAddedCourses = [
          ...massAssignedCourses,
          { id: courseItem.id, deadline: null },
        ];
        setMassAssignedCourses(withAddedCourses);
        addCoursesMass(withAddedCourses);
      } else {
        const withOutRemovedCourses = massAssignedCourses.filter(
          (item) => item.id !== courseItem.id,
        );
        setMassAssignedCourses(withOutRemovedCourses);
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

  return { handleCardSelect };
};
