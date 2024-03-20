import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import TrafficIcon from '@mui/icons-material/Traffic';
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import BarChart from '../components/BarChart';
import Header from '../components/Header';
import LineChart from '../components/LineChart';
import ProgressCircle from '../components/ProgressCircle';
import StatBox from '../components/StatBox';
import { mockTransactions } from '../data/mockData';
import { tokens } from '../theme';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";


const Statistics = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

    const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
    const [rowData, setRowData] = useState();
    const [columnDefs, setColumnDefs] = useState([
      {
        headerName: "Group 1",
        children: [{ field: "athlete", minWidth: 170 }, { field: "age" }],
      },
      {
        headerName: "Group 2",
        children: [
          { field: "country" },
          { field: "year" },
          { field: "date" },
          { field: "sport" },
          { field: "gold" },
          { field: "silver" },
          { field: "bronze" },
          { field: "total" },
        ],
      },
    ]);
    const defaultColDef = useMemo(() => {
      return {
        editable: true,
        filter: true,
      };
    }, []);
  
    const onGridReady = useCallback((params: any) => {
      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => setRowData(data));
    }, []);
  
    return (
      <div style={containerStyle}>
        <div
          style={gridStyle}
          className={
            "ag-theme-quartz"
          }
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    );
  };
  

  

export default Statistics;
