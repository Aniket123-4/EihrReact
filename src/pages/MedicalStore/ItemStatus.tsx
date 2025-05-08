

// import React from "react";
// import { useEffect, useState } from "react";
// import { GridColDef } from "@mui/x-data-grid";
// import {
//   Box, Card, CircularProgress, Divider,
//   Grid, Paper, Typography
// } from "@mui/material";
// import { useTranslation } from "react-i18next";
// import { ConfirmDialog } from "primereact/confirmdialog";

// import api from "../../utils/Url";
// import DataGrids from "../../utils/Datagrids";
// import ToastApp from "../../ToastApp";

// export default function ItemStatus() {
//   const { t } = useTranslation();

//   const [statusData, setStatusData] = useState<any[]>([]);
//   const [columns, setColumns] = useState<GridColDef[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch item balance data on component mount
//   useEffect(() => {
//     fetchItemStatus();
//   }, []);

//   const fetchItemStatus = async () => {
//     try {
// const params = {
//   itemID: -1,
//   itemCatID: -1,
//   sectionID: -1,
//   fundID: -1,
//   productID: -1,
//   unitID: -1,
//   curDate: "19000101",
//   userID: -1,
//   formID: -1,
//   type: 1
// };

//       const { data } = await api.post(`InventoryForm/GetItemBalance`, params);
//       const rows = data.result || [];

//       // Add serial number and ID for DataGrid
//       const formattedRows = rows.map((row: any, index: number) => ({
//         ...row,
//         serialNo: index + 1,
//         id: row.itemID
//       }));

//       setStatusData(formattedRows);
//       setIsLoading(false);

//       // Only set columns once if not already set
//       if (!columns.length && rows.length > 0) {
//         setColumns([
//           { field: "itemName", headerName: t("text.itemName"), flex: 2 },
//           { field: "voucherNo", headerName: t("text.voucherNo"), flex: 1 },
//           { field: "unitName", headerName: t("text.unit"), flex: 1 },
//           { field: "balanceQuantity", headerName: t("text.balanceQuantity"), flex: 1 },
//           { field: "balQuantitySum", headerName: t("text.balQuantitySum"), flex: 1 },
//           {
//             field: "eslDate",
//             headerName: t("text.expirydate"),
//             flex: 1,
//             valueGetter: ({ row }) => formatDate(row.eslDate)
//           }
//         ]);
//       }
//     } catch (error) {
//       console.error("Error fetching item status:", error);
//     }
//   };

//   // Format a date string to DD/MM/YYYY
//   const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr);
//     if (isNaN(date.getTime())) return "-";
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   return (
//     <>
//       <Card
//         sx={{
//           width: "100%",
//           backgroundColor: "lightgreen",
//           border: ".5px solid #2B4593",
//           mt: "3vh"
//         }}
//       >
//         <Paper sx={{ width: "100%", p: 2, overflow: "hidden" }}>
//           <ConfirmDialog />

//           <Grid container spacing={1}>
//             <Grid item xs={12}>
//               <Typography variant="h5" sx={{ p: 2 }}>
//                 {t("text.ItemStatus")}
//               </Typography>
//             </Grid>
//           </Grid>

//           <Divider />
//           <Box height={10} />

//           {isLoading ? (
//             <Box display="flex" justifyContent="center" alignItems="center" py={4}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             <DataGrids
//               isLoading={isLoading}
//               rows={statusData}
//               columns={columns}
//               pageSizeOptions={[5, 10, 25, 50, 100]}
//               initialPageSize={5}
//             />
//           )}
//         </Paper>
//       </Card>

//       <ToastApp />
//     </>
//   );
// }



import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  useTheme,
  alpha,
  styled
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Inventory2Rounded } from "@mui/icons-material";
import api from "../../utils/Url";
import DataGrids from "../../utils/Datagrids";
import ToastApp from "../../ToastApp";
import { GridColDef } from "@mui/x-data-grid";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "20px",
  background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
  boxShadow: theme.shadows[4],
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[8]
  }
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3),
  background: alpha(theme.palette.primary.main, 0.1),
  borderRadius: "16px 16px 0 0"
}));

const StyledDataGrid = styled(DataGrids)<{ components?: any }>(({ theme }) => ({
  border: "none !important",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderRadius: "8px"
  },
  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
  },
  "& .MuiDataGrid-row": {
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.03) + "!important"
    },
    "&.Mui-selected": {
      backgroundColor: alpha(theme.palette.primary.main, 0.05) + "!important"
    }
  }
}));

export default function ItemStatus() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [statusData, setStatusData] = useState<any[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItemStatus();
  }, []);

  const fetchItemStatus = async () => {
    try {
      const params = {
        itemID: -1,
        itemCatID: -1,
        sectionID: -1,
        fundID: -1,
        productID: -1,
        unitID: -1,
        curDate: "19000101",
        userID: -1,
        formID: -1,
        type: 1
      };
      const { data } = await api.post(`InventoryForm/GetItemBalance`, params);
      const rows = data.result || [];

      const formattedRows = rows.map((row: any, index: number) => ({
        ...row,
        serialNo: index + 1,
        id: row.itemInID,
        balanceQuantity: {
          value: row.balanceQuantity,
          color: row.balanceQuantity <= 5 ? theme.palette.error.main : theme.palette.success.main
        }
      }));

      setStatusData(formattedRows);
      setIsLoading(false);

      if (!columns.length && rows.length > 0) {
        setColumns([
          {
            field: "itemName",
            headerName: t("text.itemName"),
            flex: 2,
         //   minWidth: 200,
            renderCell: (params) => (
              <Typography fontWeight="500" color="text.primary">
                {params.value}
              </Typography>
            )
          },
          {
            field: "voucherNo",
            headerName: t("text.voucherNo"),
            flex: 1,
          //  minWidth: 120,
            renderCell: (params) => (
              <Box
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }}
              >
                {params.value}
              </Box>
            )
          },
          {
            field: "unitName",
            headerName: t("text.unit"),
            flex: 0.7,
          //  minWidth: 70
          },
          {
            field: "balanceQuantity",
            headerName: t("text.balanceQuantity"),
            flex: 1,
         //   minWidth: 100,
            renderCell: (params) => (
              <Typography color={params.value.color} fontWeight="600">
                {params.value.value}
              </Typography>
            )
          },
          {
            field: "balQuantitySum",
            headerName: t("text.balQuantitySum"),
            flex: 1,
           // minWidth: 100
          },
          {
            field: "eslDate",
            headerName: t("text.expirydate"),
            flex: 1,
         //   minWidth: 100,
            valueGetter: ({ row }) => formatDate(row.eslDate),
            renderCell: (params) => (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  backgroundColor: alpha(
                    new Date(params.value) < new Date()
                      ? theme.palette.error.main
                      : theme.palette.success.main,
                    0.1
                  )
                }}
              >
                {params.value}
              </Box>
            )
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching item status:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-GB");
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
    <StyledCard sx={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <HeaderContainer sx={{ p: 2 }}>
        <Inventory2Rounded
          fontSize="large"
          sx={{
            color: theme.palette.primary.main,
            mr: 1.5,
            fontSize: "2rem"
          }}
        />
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            {t("text.ItemStatus")}
          </Typography>
        </Box>
      </HeaderContainer>
  
      <Divider sx={{ my: 1 }} />
  
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress
              size={64}
              thickness={4}
              sx={{ color: theme.palette.primary.main }}
            />
          </Box>
        ) : (
          <StyledDataGrid
            isLoading={isLoading}
            rows={statusData}
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialPageSize={5}
            sx={{
              "& .MuiDataGrid-virtualScroller": {
                overflow: "auto !important"
              },
              "& .MuiDataGrid-columnHeaders": {
                position: "sticky",
                top: 0,
                zIndex: 100,
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)"
              }
            }}
            components={{
              Toolbar: () => (
                <Box sx={{ p: 2, pb: 1 }}>
                  <Typography variant="h6" color="text.secondary">
                    {t("text.itemList")}
                  </Typography>
                </Box>
              )
            }}
          />
        )}
      </Box>
      <ToastApp />
    </StyledCard>
  </Box>
  
  );
}

