import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
//import "./ThemeStyle.css";


const themes = [
  "light-theme",
  "dark-theme",
  "ocean-theme",
  "sunset-theme",
  "forest-theme",
];

   
interface CustomDataGridProps {
    isLoading: boolean;
    rows: any[]; 
    columns: any[]; 
    pageSizeOptions?: number[];
    initialPageSize?: number;
    columnVisibilityModel?:any;
  }


const DataGrids: React.FC<CustomDataGridProps> = ({
  isLoading,
  rows,
  columns,
  pageSizeOptions = [5, 10, 25, 50, 100],
  initialPageSize = 5,
  columnVisibilityModel,
  ...otherProps
}) => {

  // const [selectedTheme, setShowThemeMenu] = useState("");
  // console.log('CheckTheme',selectedTheme)

  // const showTheme:any = localStorage.getItem("theme");

  // useEffect(() => {
  //   setShowThemeMenu(showTheme)
   
  // }, []);

  // // const selectedTheme:any = () => {
  // //   const storedTheme = localStorage.getItem("theme");
  // //   return storedTheme ? storedTheme : themes[0]; 
  // // };


  // useEffect(() => {
   
   
  //   document.body.className = selectedTheme;
   
  // }, [selectedTheme]);

  
  // useEffect(() => {
  //   console.log(selectedTheme)
  //   const theme = localStorage.getItem("theme") || themes[0];
  //   console.log(theme)
  //   document.body.className = theme ;
  //   localStorage.setItem("theme", theme);
  // }, [selectedTheme]);






  return (
    isLoading ? (
      
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    ) : (
      <Box>
        <br />
        <div style={{ height: "50vh", width: "100%", backgroundColor:`var(--grid-background)` ,overflowY: "auto" }}>
          
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            rowHeight={35}
            slots={{
              toolbar: GridToolbar,
            }}
            rowSpacingType="border"
            pagination={true}
            pageSizeOptions={pageSizeOptions.map((size) => ({
              value: size,
              label: `${size}`,
            }))}
            initialState={{
              pagination: { paginationModel: { pageSize: initialPageSize } },
              columns: {
                columnVisibilityModel: columnVisibilityModel,
              },
            }}
            slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
            
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor:`var(--grid-headerBackground)` ,
                  color: `var(--grid-headerColor)` ,
                  fontSize: '15px !important',
                  fontWeight: 900,
                  height: '37px',
                  minHeight: '37px',
                  maxHeight: '37px',
                  lineHeight: '37px',
                },
                '& .MuiDataGrid-columnHeader': {
                  height: '37px !important',
                  minHeight: '37px !important',
                  maxHeight: '37px !important',
                  lineHeight: '37px !important',
                },
                '& .MuiDataGrid-columnHeader--sortable': {
                  height: '37px !important',
                  minHeight: '37px !important',
                  maxHeight: '37px !important',
                  lineHeight: '37px !important',
                },
                '& .MuiDataGrid-withBorderColor': {
                  height: '37px !important',
                  minHeight: '37px !important',
                  maxHeight: '37px !important',
                  lineHeight: '37px !important',
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  overflow: 'visible',
                  // whiteSpace: 'normal',
                },
                '& .MuiDataGrid-colCell' :{
                  fontSize: '15px !important',
                }
              }}
          />
        </div>
      </Box>
      
    )
  );
};

export default DataGrids;
