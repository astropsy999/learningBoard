import { Box } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  useGridApiRef,
} from '@mui/x-data-grid';
import React from 'react';
import { dataGridStyles } from '../../app/styles/DataGrid.styles';
import { useLearners } from '../../app/data/store/learners';
import ProgressLine from '../../shared/ui/ProgressLine';
import { CoursesToLearner } from '../../widgets/AssignCoursesDialog';
import { useCourses } from '../../app/data/store/courses';

interface LearnersGridProps {
  isLoading: boolean;
  columns: GridColDef[];
  handleSelectionModelChange: (newSelection: Object[]) => void;
  selectedField: string;
  selectedValues: string[];
  onChangeFilterModel: (newModel: GridFilterModel) => void;
  handleCoursesDialogClose: () => void;
  lockedArr: number[];
  //   ref: any;
}

export const LearnersGrid: React.FC<LearnersGridProps> = (props) => {
  const {
    isLoading,
    columns,
    handleSelectionModelChange,
    selectedField,
    selectedValues,
    onChangeFilterModel,
    handleCoursesDialogClose,
    lockedArr,
  } = props;

  const { allLearners, coursesToLearnersDialog } = useLearners();
  const { assignedCourses } = useCourses();

  const apiRef = useGridApiRef();

  return (
    <Box m="20px" pt={1}>
      <Box m="10px 0 0 0" sx={dataGridStyles.root}>
        {!isLoading ? (
          <DataGrid
            autoHeight={true}
            apiRef={apiRef}
            checkboxSelection
            disableRowSelectionOnClick
            rows={isLoading ? [] : allLearners!}
            columns={isLoading ? [] : columns}
            loading={isLoading}
            onRowSelectionModelChange={handleSelectionModelChange}
            initialState={{
              sorting: {
                sortModel: [{ field: 'name', sort: 'asc' }],
              },
            }}
            filterModel={{
              items: [
                {
                  field: selectedField,
                  operator: 'isAnyOf',
                  value: selectedValues,
                },
              ],
            }}
            onFilterModelChange={(newModel) => onChangeFilterModel(newModel)}
            sx={{
              '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                py: '3px',
              },
              '& .MuiDataGrid-colCell, & .MuiDataGrid-cell': {
                borderRight: `1px solid lightgrey`,
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiDataGrid-main' : {
                marginTop: '0.3em'
              },
              '& .truncate-cell':{
                lineHeight: '1 !important',
                
              }
            }}
          />
        ) : (
          <ProgressLine />
        )}
      </Box>
      <CoursesToLearner
        onOpen={coursesToLearnersDialog}
        onClose={handleCoursesDialogClose}
        assignedCourses={assignedCourses}
        lockedCourses={lockedArr}
      />
    </Box>
  );
};
