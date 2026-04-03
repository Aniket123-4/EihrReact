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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ReligionMaster = () => {
   const { t } = useTranslation();
   const theme = useTheme();

   const [data, setData] = useState<any>([]);
   const [columns, setColumns] = useState<any>([]);
   const [isEdit, setIsEdit] = useState(false);
   const [searchText, setSearchText] = useState('');

   // Local Search Logic
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
      fetchReligionData();
   }, []);

   const fetchReligionData = async () => {
      try {
         // Screenshot ke anusar payload: { religionID: 0, type: 0 }
         // Note: Agar 0 se saara data nahi aata toh yahan -1 try karein
         const payload = { "religionID": -1, "type": -1 };
         const response = await api.post("MasterForm/api/GetReligion", payload);
         
         if (response.data.isSuccess) {
            const resultData = response.data.result.map((item, index) => ({
               ...item,
               id: item.rowID || index, 
               srno: index + 1
            }));
            setData(resultData);

            const columns: GridColDef[] = [
               { field: 'srno', headerName: t('text.SrNo'), flex: 0.5 },
               { field: 'religionName', headerName: t('text.ReligionName'), flex: 2 },
               { field: 'religionCode', headerName: t('text.ReligionCode'), flex: 1 },
               {
                  field: 'action',
                  headerName: t('text.Action'),
                  flex: 1,
                  renderCell: (params) => (
                     <Box display="flex" gap={1}>
                        <IconButton 
                           size="small" 
                           color="primary"
                           onClick={() => handleEditData(params.row)}
                        >
                           <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                           size="small" 
                           color="error"
                           onClick={() => handleDelete(params.row)}
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

   const handleEditData = (row) => {
      formik.setValues({
         religionID: row.religionID,
         religionName: row.religionName,
         religionCode: row.religionCode,
         userID: row.userID || 0,
         formID: row.formID || 0,
         type: 1 // Update mode
      });
      setIsEdit(true);
   }

   const handleDelete = async (row) => {
      if (window.confirm("Are you sure you want to delete this religion?")) {
         try {
            // Screenshot ke anusar type: 2 delete ke liye
            const payload = {
               ...row,
               type: 2 
            };
            const response = await api.post('MasterForm/AddUpdateReligion', payload);
            if (response.data.isSuccess) {
               toast.success(response.data.msg || "Deleted successfully");
               fetchReligionData();
            } else {
               toast.error(response.data.msg);
            }
         } catch (error) {
            console.error(error);
         }
      }
   }

   const formik = useFormik({
      initialValues: {
         "religionID": 0,
         "religionName": "",
         "religionCode": "",
         "userID": 0,
         "formID": 0,
         "type": 0
      },
      validationSchema: Yup.object({
         religionName: Yup.string().required("*Required Religion Name"),
         religionCode: Yup.string().required("*Required Religion Code"),
      }),
      onSubmit: async (values) => {
         try {
            const response = await api.post('MasterForm/AddUpdateReligion', values);
            if (response.data.isSuccess) {
               toast.success(response.data.msg);
               formik.resetForm();
               setIsEdit(false);
               fetchReligionData();
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
            {t('text.ReligionMaster')}
         </Typography>
         <ToastContainer />
         
         <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
               <Grid item xs={12} sm={6} md={4}>
                  <TextField
                     size="small" fullWidth
                     label={t('text.ReligionName')}
                     name="religionName"
                     value={formik.values.religionName}
                     onChange={formik.handleChange}
                     error={formik.touched.religionName && Boolean(formik.errors.religionName)}
                     helperText={formik.touched.religionName && formik.errors.religionName}
                  />
               </Grid>
               <Grid item xs={12} sm={6} md={4}>
                  <TextField
                     size="small" fullWidth
                     label={t('text.ReligionCode')}
                     name="religionCode"
                     value={formik.values.religionCode}
                     onChange={formik.handleChange}
                     error={formik.touched.religionCode && Boolean(formik.errors.religionCode)}
                     helperText={formik.touched.religionCode && formik.errors.religionCode}
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


         <Paper elevation={3} sx={{ borderRadius: 3, width: '100%' }}>
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

export default ReligionMaster;
