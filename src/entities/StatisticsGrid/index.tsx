import { Box, useTheme } from '@mui/material';
import { dataGridStyles } from '../../app/styles/DataGrid.styles';
import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridColumnGroup,
  GridColumnGroupingModel,
  GridFilterModel,
  GridSortItem,
} from '@mui/x-data-grid';
import { useStatisticsData } from './hooks/useStatisticsData';
import ProgressLine from '../../shared/ui/ProgressLine';
import { DetailedStatDialog } from '../../widgets/DetailedStatDialog';
import { StatInfoType } from '../../app/types/stat';
import { useLearners } from '../../app/store/learners';
import { getDivisionUsersArrayByName } from '../../shared/helpers/getDivisionUsersByName';
import { useCourses } from '../../app/store/courses';

interface StatisticsGridProps {
  columns: GridColDef[];
  columnGroupingModel: GridColumnGroup[];
  // filterValue: string[] | boolean;
  onChangeFilterModel: (model: GridFilterModel) => void;
  statInfo: StatInfoType;
  setShowDetailedStat: (value: boolean) => void;
  showDetailedStat: boolean;
}

export const StatisticsGrid: React.FC<StatisticsGridProps> = (props) => {
  const {
    columns,
    columnGroupingModel,
    // filterValue,
    onChangeFilterModel,
    statInfo,
    setShowDetailedStat,
    showDetailedStat,
  } = props;
  const { statLoading, rawStatistics, isLoading } = useStatisticsData();

  const theme = useTheme();



  const {setCurrentDivisionUsersList, currentDivisionUsersList,  allLearners,
    currentUserDivisionName} = useLearners()

    const {allCourses} = useCourses()
    
  const [filterValue, setFilterValue] = useState(currentDivisionUsersList);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [
          {
            field: 'name',
            operator: 'isAnyOf',
            value: filterValue,
          },
        ],
  })

  // useEffect(() => {
  //   if (allLearners && allCourses && currentUserDivisionName) {
  //     // setIsLoading(false);
  //     const currentDivisionUsersList = getDivisionUsersArrayByName(
  //       allLearners,
  //       currentUserDivisionName,
  //     );
  //     setCurrentDivisionUsersList(currentDivisionUsersList as string[]);
  //     setFilterValue(currentDivisionUsersList as string[]);
  //     setFilterModel({
  //       items: [
  //         {
  //           field: 'name',
  //           operator: 'isAnyOf',
  //           value: filterValue,
  //         },
  //       ],
  //     })
  //   }
  // }, [allCourses, allLearners, currentUserDivisionName]);

  useEffect(() => {
    if (allLearners && allCourses && currentUserDivisionName) {
        const currentDivisionUsersList = getDivisionUsersArrayByName(allLearners, currentUserDivisionName);
        setCurrentDivisionUsersList(currentDivisionUsersList as string[]);

        // Обновляем filterValue
        setFilterValue(currentDivisionUsersList as string[]);

        // Обновляем filterModel
        setFilterModel({
            items: [
                {
                    field: 'name',
                    operator: 'isAnyOf',
                    value: currentDivisionUsersList,
                },
            ],
        });
    }
}, [allCourses, allLearners, currentUserDivisionName, setCurrentDivisionUsersList]);


  const sortModel = [{ field: 'name', sort: 'asc' }] as GridSortItem[];

  // const filterModel = {
  //   items: [
  //     {
  //       field: 'name',
  //       operator: 'isAnyOf',
  //       value: filterValue,
  //     },
  //   ],
  // }

  return (
    <Box m="20px" pt={2}>
      <Box m="10px 0 0 0" sx={dataGridStyles.root}>
        {!isLoading || !statLoading ? (
          <DataGrid
            rows={!isLoading ? rawStatistics || [] : []}
            columns={!isLoading ? columns : []}
            disableRowSelectionOnClick
            columnGroupingModel={columnGroupingModel}
            autoHeight={true}
            getRowHeight={() => 'auto'}
            initialState={{
              sorting: {
                sortModel,
              },
            }}
            filterModel={filterModel}
            onFilterModelChange={(newModel) => onChangeFilterModel(newModel)}
            sx={dataGridStyles.statisticsGridStyles}
          />
        ) : (
          <ProgressLine />
        )}
        <DetailedStatDialog
          open={showDetailedStat}
          setOpen={setShowDetailedStat}
          selectedStatInfo={statInfo}
        />
      </Box>
    </Box>
  );
};
