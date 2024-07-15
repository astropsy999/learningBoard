import { GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';

import React from 'react';
import { CourseData } from '../../../app/store/courses';
import { CourseAttempt } from '../../../app/types/stat';
import { getCourseTitleById } from '../../../shared/helpers/getCourseTitleById';
import CustomFilterInput from '../../CustomFilter/CustomFilterPanel';
import StatCell from '../StatCell';
import { useStatSortComparator } from './useStatSortComparator';

const statSubcolumns = [
  { field: 'result', headerName: 'Результат' },
  { field: 'status', headerName: 'Статус' },
  { field: 'date', headerName: 'Дата' },
];

const renderHeaderGroup = (courseTitle: string) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      fontWeight: 'bold',
    }}
  >
    {courseTitle}
  </div>
);

const generateColumnsGrouping = (
  coursesList: CourseAttempt[],
  allCourses: CourseData[],
) => {
  return coursesList
    ?.map(({ id }) => {
      const courseTitle = getCourseTitleById(id, allCourses);

      if (!courseTitle) {
        console.error(`Course title not found for ID: ${id}`);
        return null;
      }

      const children = statSubcolumns.map(({ field, headerName }) => ({
        field: `${id}_${field}`,
        headerName,
      }));

      return {
        groupId: courseTitle,
        renderHeaderGroup: () => renderHeaderGroup(courseTitle),
        children,
      };
    })
    .filter(Boolean); // Filter out any null entries
};

const generateColumns = (
  coursesList: CourseAttempt[],
  allCourses: CourseData[],
  sortComparator: any,
  handleCellClick: any,
  selectedValues: string[],
  setSelectedValues: (values: string[]) => void,
) => {
  const newColumns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'ФИО',
      cellClassName: 'name-cell',
      flex: 0.3,
      filterOperators: [
        {
          value: 'isAnyOf',
          getApplyFilterFn: (filterItem: any) => {
            if (
              !filterItem.field ||
              !filterItem.value ||
              !filterItem.operator
            ) {
              return null;
            }

            if (selectedValues.length === 0) {
              return (value: string) => true;
            }

            return (value: string) => {
              return selectedValues.includes(value);
            };
          },
          InputComponent: CustomFilterInput,
          InputComponentProps: {
            onChange: (selectedValue: string[]) => {
              setSelectedValues(selectedValue);
            },
            filterLabel: 'ФИО',
            field: 'name',
            selectedOptions: selectedValues,
          },
        },
      ],
    },
  ];

  coursesList?.forEach((course) => {
    statSubcolumns.forEach(({ field, headerName }) => {
      const subField = `${course.id}_${field}`;
      newColumns.push({
        field: subField,
        headerName,
        renderHeader: () => <>{headerName}</>,
        disableColumnMenu: true,
        headerClassName: 'name-column--cell',
        cellClassName: 'name-cell',
        flex: 0.1,
        valueGetter: (value, row) => row,
        sortComparator,
        renderCell: ({ row }) => (
          <StatCell
            row={row}
            course={course}
            subColumnData={{ field, headerName }}
            handleCellClick={handleCellClick}
          />
        ),
      });
    });
  });

  return newColumns;
};

export const useGenerateColumns = (
  coursesList: CourseAttempt[],
  allCourses: CourseData[],
  handleCellClick: any,
  selectedValues: string[],
  setSelectedValues: (values: string[]) => void,
) => {
  const sortComparator = useStatSortComparator();

  const columns = useMemo(
    () =>
      generateColumns(
        coursesList,
        allCourses,
        sortComparator,
        handleCellClick,
        selectedValues,
        setSelectedValues,
      ),
    [
      coursesList,
      allCourses,
      sortComparator,
      handleCellClick,
      selectedValues,
      setSelectedValues,
    ],
  );

  const columnsGroupingModel = useMemo(
    () => generateColumnsGrouping(coursesList, allCourses),
    [coursesList, allCourses],
  );

  return { columns, columnsGroupingModel };
};
