import { Box, useTheme } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridColumnGroup,
  GridFilterModel,
  GridSortItem,
  useGridApiRef,
} from '@mui/x-data-grid';
import React, { useEffect } from 'react';
import { dataGridStyles } from '../../app/styles/DataGrid.styles';
import { StatInfoType } from '../../app/types/stat';
import ProgressLine from '../../shared/ui/ProgressLine';
import { DetailedStatDialog } from '../../widgets/DetailedStatDialog';
import { useStatisticsData } from './hooks/useStatisticsData';

interface StatisticsGridProps {
  columns: GridColDef[];
  columnGroupingModel: GridColumnGroup[];
  selectedValues: string[];
  selectedField: string;
  onChangeFilterModel: (newModel: GridFilterModel) => void;
  statInfo: StatInfoType;
  setShowDetailedStat: (value: boolean) => void;
  showDetailedStat: boolean;
}

export const StatisticsGrid: React.FC<StatisticsGridProps> = (props) => {
  const {
    columns,
    columnGroupingModel,
    onChangeFilterModel,
    statInfo,
    setShowDetailedStat,
    showDetailedStat,
    selectedField,
    selectedValues,
  } = props;
  const {
    statLoading,
    rawStatistics,
    rawStatisticsBestTry,
    isLoading,
    isLoadingBestTry,
  } = useStatisticsData();

  const apiRef = useGridApiRef();

  const sortModel = [{ field: 'name', sort: 'asc' }] as GridSortItem[];

  const initialState = {
    sorting: { sortModel },
    filter: {
      filterModel: {
        items: [
          {
            field: selectedField,
            operator: 'isAnyOf',
            value: selectedValues,
          },
        ],
      },
    },
  };

  useEffect(() => {
    if (apiRef.current && !isLoadingBestTry) {
      return apiRef?.current?.setFilterModel({
        items: [
          {
            field: selectedField,
            operator: 'isAnyOf',
            value: selectedValues,
          },
        ],
      });
    }
  }, [selectedValues, selectedField]);

  return (
    <Box m="20px" pt={2}>
      <Box m="10px 0 0 0" sx={dataGridStyles.root}>
        {!isLoadingBestTry ? (
          <DataGrid
            apiRef={apiRef}
            loading={statLoading}
            rows={isLoadingBestTry ? [] : rawStatisticsBestTry}
            columns={isLoadingBestTry ? [] : columns}
            disableRowSelectionOnClick
            columnGroupingModel={columnGroupingModel}
            autoHeight={true}
            getRowHeight={() => 'auto'}
            initialState={initialState}
            // filterModel={filterModel}
            // onFilterModelChange={(newModel) =>
            //   onChangeFilterModel((newModel = filterModel))
            // }
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
