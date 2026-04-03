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
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import api from '../../../utils/Url';
import { toast, ToastContainer } from 'react-toastify';

const GenderMaster = () => {
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
      fetchGenderData();
   }, []);

   const fetchGenderData = async () => {
      try {
         // Request parameter genderID: -1 used to fetch all
         const payload = { "genderID": "-1", "isActive": "1", "type": "1" }
         const response = await api.post("MasterForm/api/GetGender", payload);
         
         if (response.data.isSuccess) {
            const resultData = response.data.result.map((item, index) => {
               return {
                  ...item,
                  id: item.rowID || index, // fallback to index if rowID not present
                  srno: index + 1
               }
            })
            setData(resultData);

            const columns: GridColDef[] = [
               {
                  field: 'genderName',
                  headerName: t('text.GenderName'),
                  flex: 2,
               },
               {
                  field: 'genderCode',
                  headerName: t('text.GenderCode'),
                  flex: 1
               },
               {
                  field: 'isActive',
                  headerName: t('text.active'),
                  flex: 1,
                  renderCell: (params) =>
                     params.value === "true" || params.value === true ? (
                        <Chip label="Active" color="success" size="small" />
                     ) : (
                        <Chip label="Inactive" color="warning" size="small" />
                     ),
               },
               {
                  field: 'action',
                  headerName: t('text.Action'),
                  flex: 1,
                  renderCell: (params) => (
                     <Button size="small" variant="outlined" color="primary"
                        onClick={() => { handleEditData(params.row) }}>
                        {t('text.edit')}
                     </Button>
                  ),
               },
            ];
            setColumns(columns);

         } else {
            toast.error(response.data.msg);
         }
      } catch (error) {
         console.log(error);
      }
   }

   const handleEditData = (row) => {
      formik.setFieldValue("genderName", row.genderName)
      formik.setFieldValue("genderCode", row.genderCode)
      formik.setFieldValue("isActive", row.isActive === "true" || row.isActive === true)
      formik.setFieldValue("genderID", row.genderID)
      setIsEdit(true);
   }

   const formik = useFormik({
      initialValues: {
         "genderName": "",
         "genderCode": "",
         "isActive": true,
         "genderID": "-1", // Default for new entry
         "sortOrder": "",
         "formID": -1,
         "type": 1
      },

      validationSchema: Yup.object({
         genderName: Yup.string().required("*Required gender name"),
         genderCode: Yup.string().required("*Required gender code"),
      }),

      onSubmit: async (values) => {
         try {
            const response = await api.post('MasterForm/AddUpdateGender', { 
               ...values, 
               isActive: values.isActive.toString() 
            });
            if (response.data.isSuccess) {
               toast.success(response.data.msg);
               formik.resetForm();
               setIsEdit(false);
               fetchGenderData();
            } else {
               toast.error(response.data.msg);
            }
         } catch (error) {
            console.log(error);
         }
      },
   });

   return (
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, maxWidth: 1400, mx: 'auto', mt: 4 }}>
         <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
            {t('text.GenderMaster')}
         </Typography>
         <ToastContainer />
         
         <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
               <Grid item xs={12} sm={6} md={4}>
                  <TextField
                     size="small"
                     fullWidth
                     label={t('text.GenderName')}
                     name="genderName"
                     placeholder={t('text.enterGenderName')}
                     value={formik.values.genderName}
                     onChange={formik.handleChange}
                     error={formik.touched.genderName && Boolean(formik.errors.genderName)}
                     helperText={formik.touched.genderName && formik.errors.genderName}
                  />
               </Grid>

               <Grid item xs={12} sm={6} md={4}>
                  <TextField
                     size="small"
                     fullWidth
                     label={t('text.GenderCode')}
                     name="genderCode"
                     placeholder={t('text.enterGenderCode')}
                     value={formik.values.genderCode}
                     onChange={formik.handleChange}
                     error={formik.touched.genderCode && Boolean(formik.errors.genderCode)}
                     helperText={formik.touched.genderCode && formik.errors.genderCode}
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
                     label={t('text.isActive')}
                  />
               </Grid>

               <Grid item xs={12}>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                     <Button type="submit" variant="contained" color="primary" size="small">
                        {isEdit ? t('text.update') : t('text.submit')}
                     </Button>
                     <Button type="reset" variant="outlined" color="secondary" size="small"
                        onClick={() => {
                           formik.resetForm();
                           setIsEdit(false);
                        }}>
                        {t('text.cancel')}
                     </Button>
                  </Box>
               </Grid>
            </Grid>
         </form>

        
         <Paper elevation={3} sx={{ borderRadius: 3, mx: 'auto', width: '100%' }}>
            <Box sx={{ width: '100%', overflowX: 'auto', minHeight: 300 }}>
               <TextField
                  label={t('text.search')}
                  variant="outlined"
                  fullWidth
                  size='small'
                  margin="normal"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  sx={{ mx: 2, width: '97%' }}
               />

               <DataGrid
                  autoHeight
                  rows={filteredData}
                  columns={columns}
                  pageSizeOptions={[5, 10, 50, 100]}
                  getRowHeight={() => 'auto'}
                  initialState={{
                     pagination: { paginationModel: { pageSize: 5, page: 0 } },
                  }}
                  sx={{
                     minWidth: 600,
                     border: '1px solid #e0e0e0',
                     borderRadius: 2,
                     '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                     },
                     '& .MuiDataGrid-cell': {
                        py: 1,
                     },
                  }}
               />
            </Box>
         </Paper>
      </Paper>
   );
};

export default GenderMaster;
