import React, { useEffect, useMemo, useState } from 'react';
import {
   Paper,
   Button,
   Grid,
   TextField,
   Typography,
   Box,
   useTheme,
   IconButton,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import api from '../../../utils/Url';
import { toast, ToastContainer } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete'; // Delete icon import
import EditIcon from '@mui/icons-material/Edit';

const BloodGroupMaster = () => {
   const { t } = useTranslation();
   const theme = useTheme();

   const [data, setData] = useState<any>([]);
   const [columns, setColumns] = useState<any>([]);
   const [isEdit, setIsEdit] = useState(false);
   const [searchText, setSearchText] = useState('');

   const filteredData = useMemo(() => {
      if (!searchText) return data;
      return data.filter((row) =>
         Object.values(row).some(
            (value) =>
               value &&
               value.toString().toLowerCase().includes(searchText.toLowerCase())
         )
      );
   }, [searchText, data]);

   useEffect(() => {
      fetchBloodGroupData();
   }, []);

   const fetchBloodGroupData = async () => {
      try {
         const payload = { "bGroupID": -1, "type": -1 };
         const response = await api.post("MasterForm/api/GetBloodGroup", payload);
         
         if (response.data.isSuccess) {
            const resultData = response.data.result.map((item, index) => ({
               ...item,
               id: item.rowID || index, 
               srno: index + 1
            }));
            setData(resultData);

            const columns: GridColDef[] = [
               { field: 'srno', headerName: t('text.SrNo'), flex: 0.5 },
               { field: 'bGroupName', headerName: t('text.BloodGroupName'), flex: 2 },
               { field: 'bGroupCode', headerName: t('text.BloodGroupCode'), flex: 1 },
               {
                  field: 'action',
                  headerName: t('text.Action'),
                  flex: 1,
                  renderCell: (params) => (
                     <Box display="flex" gap={1}>
                        <IconButton 
                           size="small" 
                           color="primary"
                           onClick={() => { handleEditData(params.row) }}
                        >
                           <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton 
                           size="small" 
                           color="error"
                           onClick={() => { handleDelete(params.row) }}
                        >
                           <DeleteIcon fontSize="small" />
                        </IconButton>
                     </Box>
                  ),
               },
            ];
            setColumns(columns);
         }
      } catch (error) {
         console.error(error);
      }
   }

   // DELETE Function
   const handleDelete = async (row) => {
      if (window.confirm("Are you sure you want to delete this blood group?")) {
         try {
            // Aapke logic ke anusar type 2 bhejna hai delete ke liye
            const payload = {
               ...row,
               type: 2 
            };
            const response = await api.post('MasterForm/AddUpdateBloodGroup', payload);
            if (response.data.isSuccess) {
               toast.success(response.data.msg || "Deleted successfully");
               fetchBloodGroupData(); // List refresh karein
            } else {
               toast.error(response.data.msg);
            }
         } catch (error) {
            toast.error("Error while deleting");
            console.error(error);
         }
      }
   }

   const handleEditData = (row) => {
      formik.setValues({
         bGroupID: row.bGroupID,
         bGroupName: row.bGroupName,
         bGroupCode: row.bGroupCode,
         userID: row.userID || 0,
         formID: row.formID || 0,
         type: 1 // Update ke liye type 1 ya 0 jo bhi aapka standard ho
      });
      setIsEdit(true);
   }

   const formik = useFormik({
      initialValues: {
         "bGroupID": 0,
         "bGroupName": "",
         "bGroupCode": "",
         "userID": 0,
         "formID": 0,
         "type": 0
      },
      validationSchema: Yup.object({
         bGroupName: Yup.string().required("*Required"),
         bGroupCode: Yup.string().required("*Required"),
      }),
      onSubmit: async (values) => {
         try {
            const response = await api.post('MasterForm/AddUpdateBloodGroup', values);
            if (response.data.isSuccess) {
               toast.success(response.data.msg);
               formik.resetForm();
               setIsEdit(false);
               fetchBloodGroupData();
            } else {
               toast.error(response.data.msg);
            }
         } catch (error) {
            console.error(error);
         }
      },
   });

   return (
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, maxWidth: 1400, mx: 'auto', mt: 4 }}>
         <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
            {t('text.BloodGroupMaster')}
         </Typography>
         <ToastContainer />
         
         <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
               <Grid item xs={12} sm={6} md={4}>
                  <TextField
                     size="small" fullWidth
                     label={t('text.BloodGroupName')}
                     name="bGroupName"
                     value={formik.values.bGroupName}
                     onChange={formik.handleChange}
                     error={formik.touched.bGroupName && Boolean(formik.errors.bGroupName)}
                     helperText={formik.touched.bGroupName && formik.errors.bGroupName}
                  />
               </Grid>
               <Grid item xs={12} sm={6} md={4}>
                  <TextField
                     size="small" fullWidth
                     label={t('text.BloodGroupCode')}
                     name="bGroupCode"
                     value={formik.values.bGroupCode}
                     onChange={formik.handleChange}
                     error={formik.touched.bGroupCode && Boolean(formik.errors.bGroupCode)}
                     helperText={formik.touched.bGroupCode && formik.errors.bGroupCode}
                  />
               </Grid>
               <Grid item xs={12}>
                  <Box display="flex" gap={2}>
                     <Button type="submit" variant="contained" color="primary" size="small">
                        {isEdit ? t('text.update') : t('text.submit')}
                     </Button>
                     <Button variant="outlined" color="secondary" size="small"
                        onClick={() => { formik.resetForm(); setIsEdit(false); }}>
                        {t('text.cancel')}
                     </Button>
                  </Box>
               </Grid>
            </Grid>
         </form>

         
         <Paper elevation={3} sx={{ borderRadius: 3, width: '100%', overflow: 'hidden' }}>
            <Box sx={{ p: 2 }}>
               <TextField
                  label={t('text.search')}
                  variant="outlined" fullWidth size='small'
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  sx={{ mb: 2 }}
               />
               <DataGrid
                  autoHeight
                  rows={filteredData}
                  columns={columns}
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                  sx={{
                     '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                     },
                  }}
               />
            </Box>
         </Paper>
      </Paper>
   );
};

export default BloodGroupMaster;
