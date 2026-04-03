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

const CountryMaster = () => {
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
      fetchCountryData();
   }, []);

   const fetchCountryData = async () => {
      try {
         // Screenshot ke anusar endpoint: api/Common/GetCountry
         // Payload: { CountryID: -1, Type: -1 }
         
         const response = await api.post("Common/GetCountry?CountryID=-1&Type=-1");
         
         if (response.data) {
            const resultData = response.data.map((item, index) => ({
               ...item,
               id: item.countryID || index, // rowID ki jagah countryID mapping
               srno: index + 1
            }));
            setData(resultData);

            const columns: GridColDef[] = [
               { field: 'srno', headerName: t('text.SrNo'), flex: 0.5 },
               { field: 'countryName', headerName: t('text.CountryName'), flex: 1.5 },
               { field: 'countryCode', headerName: t('text.CountryCode'), flex: 1 },
               { field: 'nationality', headerName: t('text.Nationality'), flex: 1 },
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
         countryID: row.countryID,
         countryName: row.countryName,
         countryCode: row.countryCode,
         nationality: row.nationality || "",
         userID: row.userID || 0,
         formID: row.formID || 0,
         type: 1 
      });
      setIsEdit(true);
   }

   const handleDelete = async (row) => {
      if (window.confirm("Are you sure you want to delete this country?")) {
         try {
            // Delete ke liye type: 2
            const payload = {
               ...row,
               type: 2 
            };
            const response = await api.post('MasterForm/AddUpdateCountry', payload);
            if (response.data.isSuccess) {
               toast.success(response.data.msg || "Deleted successfully");
               fetchCountryData();
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
         "countryID": 0,
         "countryName": "",
         "countryCode": "",
         "nationality": "",
         "userID": 0,
         "formID": 0,
         "type": 0
      },
      validationSchema: Yup.object({
         countryName: Yup.string().required("*Required Country Name"),
         countryCode: Yup.string().required("*Required Country Code"),
         nationality: Yup.string().required("*Required Nationality"),
      }),
      onSubmit: async (values) => {
         try {
            const response = await api.post('MasterForm/AddUpdateCountry', values);
            if (response.data.isSuccess) {
               toast.success(response.data.msg);
               formik.resetForm();
               setIsEdit(false);
               fetchCountryData();
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
            {t('text.CountryMaster')}
         </Typography>
         <ToastContainer />
         
         <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     size="small" fullWidth
                     label={t('text.CountryName')}
                     name="countryName"
                     value={formik.values.countryName}
                     onChange={formik.handleChange}
                     error={formik.touched.countryName && Boolean(formik.errors.countryName)}
                     helperText={formik.touched.countryName && formik.errors.countryName}
                  />
               </Grid>
               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     size="small" fullWidth
                     label={t('text.CountryCode')}
                     name="countryCode"
                     value={formik.values.countryCode}
                     onChange={formik.handleChange}
                     error={formik.touched.countryCode && Boolean(formik.errors.countryCode)}
                     helperText={formik.touched.countryCode && formik.errors.countryCode}
                  />
               </Grid>
               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     size="small" fullWidth
                     label={t('text.Nationality')}
                     name="nationality"
                     value={formik.values.nationality}
                     onChange={formik.handleChange}
                     error={formik.touched.nationality && Boolean(formik.errors.nationality)}
                     helperText={formik.touched.nationality && formik.errors.nationality}
                  />
               </Grid>
               <Grid item xs={12} md={3} alignSelf="center">
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

         <Typography variant="h6" mt={5} mb={2} color="primary.dark">
            {t('text.CountryList')}
         </Typography>

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

export default CountryMaster;
