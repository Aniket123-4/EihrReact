import React, { useEffect, useMemo, useState } from 'react';
import {
   Paper,
   Button,
   Checkbox,
   FormControlLabel,
   Grid,
   TextField,
   Typography,
   Autocomplete,
   Chip,
   Box,
   useTheme,
   Dialog,
   DialogTitle,
   IconButton,
   DialogContent,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../../../utils/Url';
import { toast, ToastContainer } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';


const ComplaintMaster = () => {
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
      fetchComplaintData();
   }, []);


   const fetchComplaintData = async () => {
      try {
         const payload = { "complaintTypeID": "-1", "isActive": "1", "type": "1" }
         const response = await api.post("MasterForm/api/GetComplaintType", payload);
         if (response.data.isSuccess) {
            const data = response.data.result.map((item, index) => {
               return {
                  ...item,
                  id: item.rowID,
                  srno: index + 1
               }
            })
            setData(data);

            const columns: GridColDef[] = [
               {
                  field: 'complaintTypeName',
                  headerName: t('text.name'),
                  flex: 2,
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
                  field: 'complaintTypeCode',
                  headerName: t('text.ComplaintCode'),
                  flex: 1
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
      console.log("edit row", row)
      formik.setFieldValue("complaintTypeName", row.complaintTypeName)
      formik.setFieldValue("complaintTypeCode", row.complaintTypeCode)
      formik.setFieldValue("isActive", row.isActive)
      formik.setFieldValue("complaintTypeID", row.complaintTypeID)
      setIsEdit(true);
   }



   const formik = useFormik({
      initialValues: {
         "complaintTypeName": "",
         "complaintTypeCode": "",
         "isActive": true,
         "complaintTypeID": "-1",
         "sortOrder": "",
         "formID": -1,
         "type": 1
      },

      validationSchema: Yup.object({
         complaintTypeName: Yup.string().required("*Required complaint name"),
         complaintTypeCode: Yup.string().required("*Required complaint code"),
      }),

      onSubmit: async (values) => {
         try {
            const response = await api.post('MasterForm/api/AddUpdateComplaintType', { ...values, isActive: values.isActive.toString() });
            if (response.data.isSuccess) {
               toast.success(response.data.msg);
               formik.resetForm();
               setIsEdit(false);
               fetchComplaintData();
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
            {t('text.createComplaintMaster')}
         </Typography>
         <ToastContainer />
         <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
               <Grid item xs={12} sm={6} md={4}>
                  <TextField
                     size="small"
                     fullWidth
                     label={t('text.ComplaintName')}
                     name="complaintTypeName"
                     placeholder={t('text.enterComplaintName')}
                     value={formik.values.complaintTypeName}
                     onChange={formik.handleChange}
                     error={formik.touched.complaintTypeName && Boolean(formik.errors.complaintTypeName)}
                     helperText={formik.touched.complaintTypeName && formik.errors.complaintTypeName}
                  />
               </Grid>

               <Grid item xs={12} sm={6} md={4}>
                  <TextField
                     size="small"
                     fullWidth
                     label={t('text.ComplaintCode')}
                     name="complaintTypeCode"
                     placeholder={t('text.enterComplaintCode')}
                     value={formik.values.complaintTypeCode}
                     onChange={formik.handleChange}
                     error={formik.touched.complaintTypeCode && Boolean(formik.errors.complaintTypeCode)}
                     helperText={formik.touched.complaintTypeCode && formik.errors.complaintTypeCode}
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

         <Typography variant="h6" mt={5} mb={2} color="primary.dark">
            {t('text.ComplainList')}
         </Typography>

         <Paper
            elevation={3}
            sx={{
               borderRadius: 3,
               mx: 'auto',
               width: '100%',
               maxWidth: '100%',
            }}
         >
            <Box
               sx={{
                  width: '100%',
                  overflowX: 'auto',
                  minHeight: 300,
               }}
            >
               <TextField
                  label="Search"
                  variant="outlined"
                  fullWidth
                  size='small'
                  margin="normal"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
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
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                     },
                     '& .MuiDataGrid-row:hover': {
                        backgroundColor: theme.palette.action.hover,
                     },
                     '& .MuiDataGrid-cell': {
                        fontSize: '0.875rem',
                        whiteSpace: 'normal !important',
                        wordBreak: 'break-word',
                        lineHeight: 1.5,
                        display: 'block',
                        py: 1,
                     },
                     '& .MuiDataGrid-cellContent': {
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                     },
                     '& .MuiDataGrid-footerContainer': {
                        backgroundColor: theme.palette.grey[100],
                     },
                  }}
               />

            </Box>
         </Paper>
      </Paper>
   );
};

export default ComplaintMaster;
