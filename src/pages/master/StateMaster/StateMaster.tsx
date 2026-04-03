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
   Autocomplete,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import api from '../../../utils/Url';
import { toast, ToastContainer } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const StateMaster = () => {
   const { t } = useTranslation();
   const theme = useTheme();

   const [data, setData] = useState<any>([]);
   const [countryOptions, setCountryOptions] = useState<any>([]);
   const [columns, setColumns] = useState<any>([]);
   const [isEdit, setIsEdit] = useState(false);
   const [searchText, setSearchText] = useState('');

   useEffect(() => {
      fetchStateData();
      fetchCountryOptions();
   }, []);

   // 1. Fetch States for Grid
   const fetchStateData = async () => {
      try {
         // Screenshot ke anusar: api/Common/GetState?CountryID=-1&StateID=-1&Type=-1
         const response = await api.post("Common/GetState?CountryID=-1&StateID=-1&Type=-1");
         if (response.data) {
            const resultData = response.data.map((item, index) => ({
               ...item,
               id: item.stateID || index,
               srno: index + 1
            }));
            setData(resultData);

            const columns: GridColDef[] = [
               { field: 'srno', headerName: t('text.SrNo'), flex: 0.5 },
               { field: 'stateName', headerName: t('text.StateName'), flex: 1.5 },
               { field: 'stateCode', headerName: t('text.StateCode'), flex: 1 },
               { field: 'countryName', headerName: t('text.Country'), flex: 1 }, // Assuming API returns countryName
               {
                  field: 'action',
                  headerName: t('text.Action'),
                  flex: 1,
                  renderCell: (params) => (
                     <Box display="flex" gap={1}>
                        <IconButton color="primary" onClick={() => handleEditData(params.row)}>
                           <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(params.row)}>
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
   };

   // 2. Fetch Countries for Dropdown
   const fetchCountryOptions = async () => {
      try {
         const response = await api.post("Common/GetCountry?CountryID=-1&Type=-1");
         if (response.data) {
            setCountryOptions(response.data);
         }
      } catch (error) {
         console.error(error);
      }
   };

   const handleEditData = (row) => {
      formik.setValues({
         stateID: row.stateID,
         stateName: row.stateName,
         stateCode: row.stateCode,
         m08_CountryID: row.m08_CountryID,
         userID: row.userID || 0,
         formID: row.formID || 0,
         type: 1
      });
      setIsEdit(true);
   };

   const handleDelete = async (row) => {
      if (window.confirm("Are you sure you want to delete this state?")) {
         try {
            const payload = { ...row, type: 2 };
            const response = await api.post('MasterForm/AddUpdateState', payload);
            if (response.data.isSuccess) {
               toast.success(response.data.msg || "Deleted successfully");
               fetchStateData();
            } else {
               toast.error(response.data.msg);
            }
         } catch (error) {
            console.error(error);
         }
      }
   };

   const formik = useFormik({
      initialValues: {
         "stateID": 0,
         "stateName": "",
         "stateCode": "",
         "m08_CountryID": null, // Dropdown selection
         "userID": 0,
         "formID": 0,
         "type": 0
      },
      validationSchema: Yup.object({
         stateName: Yup.string().required("*Required State Name"),
         stateCode: Yup.string().required("*Required State Code"),
         m08_CountryID: Yup.number().required("*Required Country Selection").nullable(),
      }),
      onSubmit: async (values) => {
         try {
            const response = await api.post('MasterForm/AddUpdateState', values);
            if (response.data.isSuccess) {
               toast.success(response.data.msg);
               formik.resetForm();
               setIsEdit(false);
               fetchStateData();
            } else {
               toast.error(response.data.msg);
            }
         } catch (error) {
            console.error(error);
         }
      },
   });

   const filteredData = useMemo(() => {
      if (!searchText) return data;
      return data.filter((row) =>
         Object.values(row).some(val => val?.toString().toLowerCase().includes(searchText.toLowerCase()))
      );
   }, [searchText, data]);

   return (
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, maxWidth: 1400, mx: 'auto', mt: 4 }}>
         <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
            {t('text.StateMaster')}
         </Typography>
         <ToastContainer />
         
         <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
               {/* Country Dropdown */}
               <Grid item xs={12} sm={6} md={3}>
                  <Autocomplete
                     size="small"
                     options={countryOptions}
                     getOptionLabel={(option) => option.countryName || ""}
                     value={countryOptions.find((opt) => opt.countryID === formik.values.m08_CountryID) || null}
                     onChange={(e, newValue) => {
                        formik.setFieldValue("m08_CountryID", newValue ? newValue.countryID : null);
                     }}
                     renderInput={(params) => (
                        <TextField
                           {...params}
                           label={t('text.SelectCountry')}
                           error={formik.touched.m08_CountryID && Boolean(formik.errors.m08_CountryID)}
                           helperText={formik.touched.m08_CountryID && formik.errors.m08_CountryID}
                        />
                     )}
                  />
               </Grid>

               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     size="small" fullWidth
                     label={t('text.StateName')}
                     name="stateName"
                     value={formik.values.stateName}
                     onChange={formik.handleChange}
                     error={formik.touched.stateName && Boolean(formik.errors.stateName)}
                     helperText={formik.touched.stateName && formik.errors.stateName}
                  />
               </Grid>

               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     size="small" fullWidth
                     label={t('text.StateCode')}
                     name="stateCode"
                     value={formik.values.stateCode}
                     onChange={formik.handleChange}
                     error={formik.touched.stateCode && Boolean(formik.errors.stateCode)}
                     helperText={formik.touched.stateCode && formik.errors.stateCode}
                  />
               </Grid>

               <Grid item xs={12} md={3}>
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

       

         <Paper elevation={3} sx={{ borderRadius: 3, width: '100%', p: 2 }}>
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
         </Paper>
      </Paper>
   );
};

export default StateMaster;
