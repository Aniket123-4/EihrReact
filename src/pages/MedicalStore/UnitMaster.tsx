import React, { useEffect, useMemo, useState } from 'react';
import {
   Paper,
   Button,
   Checkbox,
   FormControlLabel,
   Grid,
   TextField,
   Typography,
   Chip,
   Box,
   useTheme,
   IconButton,
   Divider,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import api from '../../utils/Url';
import { toast, ToastContainer } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const UnitMaster = () => {
   const { t } = useTranslation();
   const theme = useTheme();

   const [data, setData] = useState<any>([]);
   const [isEdit, setIsEdit] = useState(false);
   const [searchText, setSearchText] = useState('');
   const [loading, setLoading] = useState(false);

   // Search Filter Logic
   const filteredData = useMemo(() => {
      if (!searchText) return data;
      return data.filter((row: any) =>
         Object.values(row).some(
            (value) =>
               value &&
               value.toString().toLowerCase().includes(searchText.toLowerCase())
         )
      );
   }, [searchText, data]);

   useEffect(() => {
      fetchUnitData();
   }, []);

   // 1. Fetch Units List
   const fetchUnitData = async () => {
      try {
         setLoading(true);
         // Screenshot payload: { unitID: -1, isActive: -1, type: 1 }
         const payload = { "unitID": -1, "isActive": -1, "type": 1 };
         const response = await api.post("InventoryForm/GetUnit", payload);
         
         if (response.data.isSuccess) {
            const resultData = response.data.result.map((item: any, index: number) => ({
               ...item,
               id: item.unitID || index, // DataGrid requires unique 'id' prop
               srno: index + 1
            }));
            setData(resultData);
         } else {
            toast.error(response.data.msg || "Failed to fetch units");
         }
      } catch (error) {
         console.error(error);
         toast.error("Network Error: Could not fetch units");
      } finally {
         setLoading(false);
      }
   };

   // 2. Setup Formik for Add/Update
   const formik = useFormik({
      initialValues: {
         "unitID": 0, // 0 for new record as per screenshot
         "unitName": "",
         "isActive": true,
         "userID": 0,
         "formID": 0,
         "type": 0 // Assuming type 0 is for Insert/Update
      },
      validationSchema: Yup.object({
         unitName: Yup.string().required("*Required Unit Name"),
      }),
      onSubmit: async (values) => {
         try {
            setLoading(true);
            const response = await api.post('MasterForm/AddUpdateUnit', values);
            if (response.data.isSuccess) {
               toast.success(response.data.msg || "Unit saved successfully");
               formik.resetForm();
               setIsEdit(false);
               fetchUnitData();
            } else {
               toast.error(response.data.msg);
            }
         } catch (error) {
            console.error(error);
            toast.error("Error saving unit");
         } finally {
            setLoading(false);
         }
      },
   });

   // 3. Edit Action
   const handleEditData = (row: any) => {
      formik.setValues({
         unitID: row.unitID,
         unitName: row.unitName,
         isActive: row.isActive === "true" || row.isActive === true,
         userID: row.userID || 0,
         formID: row.formID || 0,
         type: 1 // Assuming type 1 is for update, adjust as per your backend
      });
      setIsEdit(true);
   };

   // 4. Delete Action
   const handleDelete = async (row: any) => {
      if (window.confirm("Are you sure you want to delete this unit?")) {
         try {
            const payload = {
               ...row,
               type: 2 // Assuming type 2 is for delete
            };
            const response = await api.post('MasterForm/AddUpdateUnit', payload);
            if (response.data.isSuccess) {
               toast.success(response.data.msg || "Unit deleted successfully");
               fetchUnitData();
            } else {
               toast.error(response.data.msg);
            }
         } catch (error) {
            console.error(error);
            toast.error("Error deleting unit");
         }
      }
   };

   // Table Columns
   const columns: GridColDef[] = [
      { field: 'srno', headerName: 'Sr No', width: 80 },
      { field: 'unitName', headerName: 'Unit Name', flex: 2 },
      {
         field: 'isActive',
         headerName: 'Status',
         flex: 1,
         renderCell: (params) =>
            params.value === "true" || params.value === true ? (
               <Chip label="Active" color="success" size="small" />
            ) : (
               <Chip label="Inactive" color="warning" size="small" variant="outlined" />
            ),
      },
      {
         field: 'action',
         headerName: 'Action',
         flex: 1,
         renderCell: (params) => (
            <Box display="flex" gap={1}>
               <IconButton size="small" color="primary" onClick={() => handleEditData(params.row)}>
                  <EditIcon fontSize="small" />
               </IconButton>
               <IconButton size="small" color="error" onClick={() => handleDelete(params.row)}>
                  <DeleteIcon fontSize="small" />
               </IconButton>
            </Box>
         ),
      },
   ];

   return (
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, maxWidth: 1000, mx: 'auto', mt: 4 }}>
         <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
            Unit Master
         </Typography>
         <ToastContainer />
         
         <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} alignItems="center">
               
               <Grid item xs={12} sm={6} md={5}>
                  <TextField
                     size="small"
                     fullWidth
                     label="Unit Name"
                     name="unitName"
                     placeholder="e.g. Kg, Ltr, Pcs"
                     value={formik.values.unitName}
                     onChange={formik.handleChange}
                     error={formik.touched.unitName && Boolean(formik.errors.unitName)}
                     helperText={formik.touched.unitName && formik.errors.unitName}
                  />
               </Grid>

               <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                     control={
                        <Checkbox
                           name="isActive"
                           checked={formik.values.isActive}
                           onChange={formik.handleChange}
                        />
                     }
                     label="Is Active"
                  />
               </Grid>

               <Grid item xs={12} md={4}>
                  <Box display="flex" gap={2}>
                     <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        disabled={loading}
                     >
                        {isEdit ? "Update" : "Save"}
                     </Button>
                     <Button 
                        type="reset" 
                        variant="outlined" 
                        color="secondary"
                        onClick={() => {
                           formik.resetForm();
                           setIsEdit(false);
                        }}
                     >
                        Cancel
                     </Button>
                  </Box>
               </Grid>
            </Grid>
         </form>

         <Divider sx={{ my: 4 }} />
         
         <Typography variant="h6" mb={2} color="textSecondary" fontWeight="bold">
            Unit List
         </Typography>

         <Paper elevation={2} sx={{ borderRadius: 3, width: '100%', p: 2 }}>
            <TextField
               label="Search Unit"
               variant="outlined"
               fullWidth
               size='small'
               value={searchText}
               onChange={(e) => setSearchText(e.target.value)}
               sx={{ mb: 2 }}
            />
            
            <DataGrid
               autoHeight
               rows={filteredData}
               columns={columns}
               loading={loading}
               pageSizeOptions={[5, 10, 25]}
               initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
               sx={{
                  '& .MuiDataGrid-columnHeaders': {
                     backgroundColor: theme.palette.primary.light,
                     color: 'white',
                     fontWeight: 'bold'
                  },
               }}
            />
         </Paper>
      </Paper>
   );
};

export default UnitMaster;
