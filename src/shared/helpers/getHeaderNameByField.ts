import { GridColDef } from "@mui/x-data-grid";

export const getHeaderNameByField = (field: string, columns: GridColDef[]) => {
    return columns.find((col) => col.field === field)?.headerName;
}