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
   FormControlLabel,
   Checkbox,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import api from '../../../utils/Url';
import { toast, ToastContainer } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DistrictMaster = () => {
   const { t } = useTranslation();
   const theme = useTheme();

   const [data, setData] = useState<any>([]);
   const [stateOptions, setStateOptions] = useState<any>([]);
   const [selectedState, setSelectedState] = useState<any>(null);
   const [columns, setColumns] = useState<any>([]);
   const [isEdit, setIsEdit] = useState(false);
   const [searchText, setSearchText] = useState('');

   useEffect(() => {
      fetchInitialData();
   }, []);

   const fetchInitialData = async () => {
      try {
         // 1. Pehle States load karein
         const stateRes = await api.post("Common/GetState?CountryID=-1&StateID=-1&Type=-1");
         if (stateRes.data) {
            const states = stateRes.data;
            setStateOptions(states);

            // 2. Default state select karein (ID: 1) ya fir pehli available state
            const defaultState = states.find((s: any) => s.stateID === 1 || s.stateID === "1") || states[0];
            if (defaultState) {
               setSelectedState(defaultState);
               formik.setFieldValue("m09_StateID", defaultState.stateID);
               fetchDistrictData(defaultState.stateID); // Default list load karein
            }
         }
      } catch (error) {
         console.error("Error fetching states:", error);
      }
   };

   // District fetch karne ka function based on StateID
   const fetchDistrictData = async (stateId: any) => {
      try {
         // Screenshot logic: api/Common/GetDistrict?StateID=1&DistrictID=-1&Type=1
         const response = await api.post(`Common/GetDistrict?StateID=${stateId}&DistrictID=-1&Type=1`);
         if (response.data) {
            const resultData = response.data.map((item: any, index: number) => ({
               ...item,
               id: item.districtID || index,
               srno: index + 1
            }));
            setData(resultData);
            setupColumns();
         } else {
            setData([]);
         }
      } catch (error) {
         console.error(error);
      }
   };

   const setupColumns = () => {
      const cols: GridColDef[] = [
         { field: 'srno', headerName: t('text.SrNo'), flex: 0.5 },
         { field: 'districtName', headerName: t('text.DistrictName'), flex: 2 },
         { field: 'districtCode', headerName: t('text.DistrictCode'), flex: 1 },
         {
            field: 'isActive',
            headerName: t('text.Status'),
            flex: 1,
            renderCell: (params) => (
               <Typography color={params.value ? "success.main" : "error.main"} variant="body2">
                  {params.value ? "Active" : "Inactive"}
               </Typography>
            )
         },
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
      setColumns(cols);
   };

   const handleEditData = (row: any) => {
      formik.setValues({
         districtID: row.districtID,
         districtName: row.districtName,
         districtCode: row.districtCode || "",
         m09_StateID: row.stateID,
         isActive: row.isActive,
         userID: row.userID || 0,
         formID: row.formID || 0,
         type: 1
      });
      setIsEdit(true);
   };

   const handleDelete = async (row: any) => {
      if (window.confirm("Are you sure you want to delete this district?")) {
         try {
            const payload = { ...row, type: 2 };
            const response = await api.post('MasterForm/AddUpdateDistrict', payload);
            if (response.data.isSuccess) {
               toast.success(response.data.msg || "Deleted successfully");
               fetchDistrictData(selectedState.stateID);
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
         "districtID": 0,
         "districtName": "",
         "districtCode": "",
         "m09_StateID": 0,
         "isActive": true,
         "userID": 0,
         "formID": 0,
         "type": 0
      },
      validationSchema: Yup.object({
         districtName: Yup.string().required("*Required District Name"),
         m09_StateID: Yup.number().required("*Required State").min(1),
      }),
      onSubmit: async (values) => {
         try {
            const response = await api.post('MasterForm/AddUpdateDistrict', values);
            if (response.data.isSuccess) {
               toast.success(response.data.msg);
               formik.resetForm({ values: { ...formik.initialValues, m09_StateID: selectedState.stateID } });
               setIsEdit(false);
               fetchDistrictData(selectedState.stateID);
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
      return data.filter((row: any) =>
         Object.values(row).some(val => val?.toString().toLowerCase().includes(searchText.toLowerCase()))
      );
   }, [searchText, data]);

   return (
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, maxWidth: 1400, mx: 'auto', mt: 4 }}>
         <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
            {t('text.DistrictMaster')}
         </Typography>
         <ToastContainer />
         
         <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
               {/* 1. State Dropdown (Filter + Form) */}
               <Grid item xs={12} sm={6} md={3}>
                  <Autocomplete
                     size="small"
                     options={stateOptions}
                     getOptionLabel={(option: any) => option.stateName || ""}
                     value={selectedState}
                     onChange={(e, newValue) => {
                        setSelectedState(newValue);
                        if (newValue) {
                           formik.setFieldValue("m09_StateID", newValue.stateID);
                           fetchDistrictData(newValue.stateID); // Dropdown change pe list refresh
                        }
                     }}
                     renderInput={(params) => (
                        <TextField {...params} label={t('text.SelectState')} variant="outlined" />
                     )}
                  />
               </Grid>

               {/* 2. District Name */}
               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     size="small" fullWidth
                     label={t('text.DistrictName')}
                     name="districtName"
                     value={formik.values.districtName}
                     onChange={formik.handleChange}
                     error={formik.touched.districtName && Boolean(formik.errors.districtName)}
                     helperText={formik.touched.districtName && formik.errors.districtName}
                  />
               </Grid>

               {/* 3. District Code */}
               <Grid item xs={12} sm={6} md={2}>
                  <TextField
                     size="small" fullWidth
                     label={t('text.DistrictCode')}
                     name="districtCode"
                     value={formik.values.districtCode}
                     onChange={formik.handleChange}
                  />
               </Grid>

               {/* 4. Is Active */}
               <Grid item xs={12} sm={6} md={1}>
                  <FormControlLabel
                     control={<Checkbox checked={formik.values.isActive} name="isActive" onChange={formik.handleChange} />}
                     label="Active"
                  />
               </Grid>

               {/* Buttons */}
               <Grid item xs={12} md={3} alignSelf="center">
                  <Box display="flex" gap={2}>
                     <Button type="submit" variant="contained" color="primary" size="small">
                        {isEdit ? t('text.update') : t('text.submit')}
                     </Button>
                     <Button variant="outlined" color="secondary" size="small"
                        onClick={() => { 
                           formik.resetForm({ values: { ...formik.initialValues, m09_StateID: selectedState?.stateID } }); 
                           setIsEdit(false); 
                        }}>
                        {t('text.cancel')}
                     </Button>
                  </Box>
               </Grid>
            </Grid>
         </form>

         {/* List Section */}
         <Typography variant="h6" mt={5} mb={2} color="primary.dark">
            {selectedState ? `${t('text.DistrictListFor')} ${selectedState.stateName}` : t('text.DistrictList')}
         </Typography>

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

export default DistrictMaster;
