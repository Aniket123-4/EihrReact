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

const CivilStatusMaster = () => {
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
      fetchCivilStatusData();
   }, []);

   const fetchCivilStatusData = async () => {
      try {
         // Screenshot ke anusar payload: { civilStatusID: -1, type: -1 }
         const payload = { "civilStatusID": -1, "type": -1 };
         const response = await api.post("MasterForm/api/GetCivilStatus", payload);
         
         if (response.data.isSuccess) {
            const resultData = response.data.result.map((item, index) => ({
               ...item,
               id: item.rowID || index, 
               srno: index + 1
            }));
            setData(resultData);

            const columns: GridColDef[] = [
               {
                  field: 'civilStatusName',
                  headerName: t('text.CivilStatusName'),
                  flex: 2,
               },
               {
                  field: 'civilStatusCode',
                  headerName: t('text.CivilStatusCode'),
                  flex: 1
               },
               {
                  field: 'isActive',
                  headerName: t('text.active'),
                  flex: 1,
                  renderCell: (params) =>
                     params.value ? (
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
         console.error(error);
      }
   }

   const handleEditData = (row) => {
      formik.setValues({
         civilStatusID: row.civilStatusID,
         civilStatusName: row.civilStatusName,
         civilStatusCode: row.civilStatusCode,
         isActive: row.isActive,
         userID: row.userID || 0,
         formID: row.formID || 0,
         type: row.type || 0
      });
      setIsEdit(true);
   }

   const formik = useFormik({
      initialValues: {
         "civilStatusID": 0, // Screenshot ke anusar default 0
         "civilStatusName": "",
         "civilStatusCode": "",
         "isActive": true,
         "userID": 0,
         "formID": 0,
         "type": 0
      },

      validationSchema: Yup.object({
         civilStatusName: Yup.string().required("*Required Civil Status Name"),
         civilStatusCode: Yup.string().required("*Required Civil Status Code"),
      }),

      onSubmit: async (values) => {
         try {
            // Screenshot path: AddUpdateCivilStatus
            const response = await api.post('MasterForm/AddUpdateCivilStatus', values);
            if (response.data.isSuccess) {
               toast.success(response.data.msg);
               formik.resetForm();
               setIsEdit(false);
               fetchCivilStatusData();
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
            {t('text.CivilStatusMaster')}
         </Typography>
         <ToastContainer />
         
         <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
               <Grid item xs={12} sm={6} md={4}>
                  <TextField
                     size="small"
                     fullWidth
                     label={t('text.CivilStatusName')}
                     name="civilStatusName"
                     value={formik.values.civilStatusName}
                     onChange={formik.handleChange}
                     error={formik.touched.civilStatusName && Boolean(formik.errors.civilStatusName)}
                     helperText={formik.touched.civilStatusName && formik.errors.civilStatusName}
                  />
               </Grid>

               <Grid item xs={12} sm={6} md={4}>
                  <TextField
                     size="small"
                     fullWidth
                     label={t('text.CivilStatusCode')}
                     name="civilStatusCode"
                     value={formik.values.civilStatusCode}
                     onChange={formik.handleChange}
                     error={formik.touched.civilStatusCode && Boolean(formik.errors.civilStatusCode)}
                     helperText={formik.touched.civilStatusCode && formik.errors.civilStatusCode}
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
                  <Box display="flex" gap={2}>
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

       

         <Paper elevation={3} sx={{ borderRadius: 3, width: '100%' }}>
            <Box sx={{ p: 2 }}>
               <TextField
                  label={t('text.search')}
                  variant="outlined"
                  fullWidth
                  size='small'
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
               />
               <Box sx={{ mt: 2 }}>
                  <DataGrid
                     autoHeight
                     rows={filteredData}
                     columns={columns}
                     pageSizeOptions={[5, 10, 25]}
                     initialState={{
                        pagination: { paginationModel: { pageSize: 5, page: 0 } },
                     }}
                     sx={{
                        '& .MuiDataGrid-columnHeaders': {
                           backgroundColor: theme.palette.primary.light,
                        },
                     }}
                  />
               </Box>
            </Box>
         </Paper>
      </Paper>
   );
};

export default CivilStatusMaster;
