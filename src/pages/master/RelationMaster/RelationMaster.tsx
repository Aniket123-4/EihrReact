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

const RelationMaster = () => {
   const { t } = useTranslation();
   const theme = useTheme();

   const [data, setData] = useState<any>([]);
   const [columns, setColumns] = useState<any>([]);
   const [isEdit, setIsEdit] = useState(false);
   const [searchText, setSearchText] = useState('');

   // Search Filter Logic
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
      fetchRelationData();
   }, []);

   const fetchRelationData = async () => {
      try {
         // Screenshot ke anusar payload: { relationID: -1, type: -1 }
         const payload = { "relationID": -1, "type": -1 };
         const response = await api.post("MasterForm/api/GetRelation", payload);
         
         if (response.data.isSuccess) {
            const resultData = response.data.result.map((item, index) => ({
               ...item,
               id: item.rowID || index, 
               srno: index + 1
            }));
            setData(resultData);

            const columns: GridColDef[] = [
               { field: 'srno', headerName: t('text.SrNo'), flex: 0.5 },
               { field: 'relationName', headerName: t('text.RelationName'), flex: 2 },
               { field: 'relationCode', headerName: t('text.RelationCode'), flex: 1 },
               { field: 'relationType', headerName: t('text.RelationType'), flex: 1 },
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
         relationID: row.relationID,
         relationName: row.relationName,
         relationCode: row.relationCode,
         relationType: row.relationType || 0,
         userID: row.userID || 0,
         formID: row.formID || 0,
         type: 1 
      });
      setIsEdit(true);
   }

   const handleDelete = async (row) => {
      if (window.confirm("Are you sure you want to delete this relation?")) {
         try {
            // Delete ke liye type: 2
            const payload = {
               ...row,
               type: 2 
            };
            const response = await api.post('MasterForm/AddUpdateRelation', payload);
            if (response.data.isSuccess) {
               toast.success(response.data.msg || "Deleted successfully");
               fetchRelationData();
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
         "relationID": 0,
         "relationName": "",
         "relationCode": "",
         "relationType": 0,
         "userID": 0,
         "formID": 0,
         "type": 0
      },
      validationSchema: Yup.object({
         relationName: Yup.string().required("*Required Relation Name"),
         relationCode: Yup.string().required("*Required Relation Code"),
      }),
      onSubmit: async (values) => {
         try {
            const response = await api.post('MasterForm/AddUpdateRelation', values);
            if (response.data.isSuccess) {
               toast.success(response.data.msg);
               formik.resetForm();
               setIsEdit(false);
               fetchRelationData();
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
            {t('text.RelationMaster')}
         </Typography>
         <ToastContainer />
         
         <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
               <Grid item xs={12} sm={6} md={4}>
                  <TextField
                     size="small" fullWidth
                     label={t('text.RelationName')}
                     name="relationName"
                     value={formik.values.relationName}
                     onChange={formik.handleChange}
                     error={formik.touched.relationName && Boolean(formik.errors.relationName)}
                     helperText={formik.touched.relationName && formik.errors.relationName}
                  />
               </Grid>
               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     size="small" fullWidth
                     label={t('text.RelationCode')}
                     name="relationCode"
                     value={formik.values.relationCode}
                     onChange={formik.handleChange}
                     error={formik.touched.relationCode && Boolean(formik.errors.relationCode)}
                     helperText={formik.touched.relationCode && formik.errors.relationCode}
                  />
               </Grid>
               <Grid item xs={12} sm={6} md={2}>
                  <TextField
                     size="small" fullWidth
                     type="number"
                     label={t('text.RelationType')}
                     name="relationType"
                     value={formik.values.relationType}
                     onChange={formik.handleChange}
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

export default RelationMaster;
