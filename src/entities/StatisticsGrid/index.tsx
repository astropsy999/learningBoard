import { Box, useTheme } from '@mui/material';
import { dataGridStyles } from '../../app/styles/DataGrid.styles';
import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridColumnGroupingModel,
  GridFilterModel,
} from '@mui/x-data-grid';
import { useStatisticsData } from './hooks/useStatisticsData';
import ProgressLine from '../../shared/ui/ProgressLine';
import { DetailedStatDialog } from '../../widgets/DetailedStatDialog';
import { StatInfoType } from '../../app/types/stat.types';

interface StatisticsGridProps {
  columns: GridColDef[];
  columnGroupingModel: GridColumnGroupingModel;
  filterValue: string[];
  onChangeFilterModel: (model: GridFilterModel) => void;
  statInfo: StatInfoType;
  setShowDetailedStat: (value: boolean) => void;
  showDetailedStat: boolean;
}

export const StatisticsGrid: React.FC<StatisticsGridProps> = (props) => {
  const {
    columns,
    columnGroupingModel,
    filterValue,
    onChangeFilterModel,
    statInfo,
    setShowDetailedStat,
    showDetailedStat,
  } = props;
  const { statLoading, rawStatistics, isLoading } = useStatisticsData();

  const theme = useTheme();

  return (
    <Box m="20px" pt={2}>
      <Box m="10px 0 0 0" sx={dataGridStyles.root}>
        {!isLoading || !statLoading ? (
          <DataGrid
            rows={!isLoading ? rawStatistics || [] : []}
            columns={columns}
            disableRowSelectionOnClick
            columnGroupingModel={columnGroupingModel}
            autoHeight={true}
            getRowHeight={() => 'auto'}
            initialState={{
              sorting: {
                sortModel: [{ field: 'name', sort: 'asc' }],
              },
            }}
            filterModel={{
              items: [
                {
                  field: 'name',
                  operator: 'isAnyOf',
                  value: filterValue,
                },
              ],
            }}
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
