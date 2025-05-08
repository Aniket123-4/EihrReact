import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';


interface CustomDataGridProps {
    isLoading: boolean;
    rows: any[]; 
    columns: any[]; 
    pageSizeOptions?: number[];
    initialPageSize?: number;
  }


const CustomDataGrid: React.FC<CustomDataGridProps> = ({
  isLoading,
  rows,
  columns,
  pageSizeOptions = [5, 10, 25, 50, 100],
  initialPageSize = 5,
  
  ...otherProps
}) => {
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
        <div style={{ height: "50vh", width: "100%", backgroundColor: "#FFFFFF",overflowY: "auto" }}>
          
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
            }}
            slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
            
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#2B4593',
                  color: '#fff',
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

export default CustomDataGrid;
