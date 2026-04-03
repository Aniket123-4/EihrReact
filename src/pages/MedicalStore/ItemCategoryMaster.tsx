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
   Divider
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import api from '../../utils/Url';
import { toast, ToastContainer } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';

const ItemCategoryMaster = () => {
   const { t } = useTranslation();
   const theme = useTheme();

   const [data, setData] = useState<any[]>([]);
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
      fetchItemCategories();
   }, []);

   // 1. Fetch Item Categories
   const fetchItemCategories = async () => {
      try {
         setLoading(true);
         // Screenshot payload for GET API
         const payload = {
            "itemCatID": -1,
            "sectionID": -1,
            "fundID": 1,
            "userID": -1,
            "formID": -1,
            "mainType": 2,
            "type": 1
         };
         
         const response = await api.post("InventoryForm/GetItemCat", payload);
         
         if (response.data.isSuccess) {
            const resultData = response.data.result.map((item: any, index: number) => ({
               ...item,
               id: item.itemCatID || index, // DataGrid needs a unique 'id'
               srno: index + 1
            }));
            setData(resultData);
         } else {
            toast.error(response.data.msg || "Failed to fetch categories");
         }
      } catch (error) {
         console.error(error);
         toast.error("Network Error: Could not fetch categories");
      } finally {
         setLoading(false);
      }
   };

   // 2. Setup Formik for Add/Update (Mapping exact Swagger Payload)
   const formik = useFormik({
      initialValues: {
         "itemCatID": 0,
         "itemCatName": "",
         "itemCatCode": "",
         "h12_ItemCatID": 0,
         "isActive": true,
         "h11_ItemCatTypeID": 0,
         "isInsuranceApp": true,
         "isAMCApp": true,
         "depthLevel": 0,
         "itemCatIDTree": "",
         "itemCatTree": "",
         "itemCatCodeID": 0,
         "itemCatNameML": "",
         "userID": -2, // Replace with actual logged-in user ID
         "formID": -1,
         "type": 1 // 1 for Add/Update
      },
      validationSchema: Yup.object({
         itemCatName: Yup.string().required("*Item Category Name is required"),
         itemCatCode: Yup.string().required("*Item Category Code is required"),
      }),
      onSubmit: async (values) => {
         try {
            setLoading(true);
            const response = await api.post('MasterForm/AddUpdateItemCat', values);
            
            if (response.data.isSuccess) {
               toast.success(response.data.msg || "Item Category saved successfully");
               formik.resetForm();
               setIsEdit(false);
               fetchItemCategories(); // Refresh list
            } else {
               toast.error(response.data.msg || "Failed to save category");
            }
         } catch (error) {
            console.error(error);
            toast.error("Error connecting to server");
         } finally {
            setLoading(false);
         }
      },
   });

   // 3. Edit Action
   const handleEditData = (row: any) => {
      formik.setValues({
         ...formik.initialValues, // Preserve defaults for missing fields
         itemCatID: row.itemCatID,
         itemCatName: row.itemCatName || "",
         itemCatCode: row.itemCatCode || "",
         isActive: row.isActive === "true" || row.isActive === true,
         h12_ItemCatID: row.parentItemCatID || 0,
         type: 1 
      });
      setIsEdit(true);
   };

   // 4. Delete Action
   const handleDelete = async (row: any) => {
      if (window.confirm(`Are you sure you want to delete category: ${row.itemCatName}?`)) {
         try {
            const payload = {
               ...formik.initialValues,
               itemCatID: row.itemCatID,
               type: 2 // Type 2 for Delete
            };
            const response = await api.post('MasterForm/AddUpdateItemCat', payload);
            
            if (response.data.isSuccess) {
               toast.success(response.data.msg || "Category deleted successfully");
               fetchItemCategories();
            } else {
               toast.error(response.data.msg || "Deletion failed");
            }
         } catch (error) {
            console.error(error);
            toast.error("Error deleting category");
         }
      }
   };

   // Table Columns configuration
   const columns: GridColDef[] = [
      { field: 'srno', headerName: 'Sr No', width: 70 },
      { field: 'itemCatName', headerName: 'Category Name', flex: 2 },
      { field: 'itemCatCode', headerName: 'Category Code', flex: 1 },
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
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, maxWidth: 1200, mx: 'auto', mt: 4, animation: 'fadeIn 0.5s ease-in' }}>
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <CategoryIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight="bold" color="primary.main">
               Item Category Master
            </Typography>
         </Box>
         <ToastContainer />
         
         {/* Form Section */}
         <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} alignItems="center">
               
               <Grid item xs={12} sm={6} md={4}>
                  <TextField
                     size="small"
                     fullWidth
                     label="Category Name"
                     name="itemCatName"
                     placeholder="e.g. AVALEHA-PAK"
                     value={formik.values.itemCatName}
                     onChange={formik.handleChange}
                     error={formik.touched.itemCatName && Boolean(formik.errors.itemCatName)}
                     helperText={formik.touched.itemCatName && formik.errors.itemCatName}
                  />
               </Grid>

               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     size="small"
                     fullWidth
                     label="Category Code"
                     name="itemCatCode"
                     placeholder="e.g. CAT001"
                     value={formik.values.itemCatCode}
                     onChange={formik.handleChange}
                     error={formik.touched.itemCatCode && Boolean(formik.errors.itemCatCode)}
                     helperText={formik.touched.itemCatCode && formik.errors.itemCatCode}
                  />
               </Grid>

               <Grid item xs={12} sm={6} md={2}>
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

               <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Box display="flex" gap={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                     <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        disabled={loading}
                        sx={{ borderRadius: 2, px: 3 }}
                     >
                        {isEdit ? "Update" : "Save"}
                     </Button>
                     <Button 
                        type="reset" 
                        variant="outlined" 
                        color="secondary"
                        sx={{ borderRadius: 2 }}
                        onClick={() => {
                           formik.resetForm();
                           setIsEdit(false);
                        }}
                     >
                        Clear
                     </Button>
                  </Box>
               </Grid>
            </Grid>
         </form>

         <Divider sx={{ my: 4 }} />
         
         {/* List Section */}
         <Typography variant="h6" mb={2} color="textSecondary" fontWeight="bold">
            Item Category List
         </Typography>

         <Paper elevation={1} sx={{ borderRadius: 3, width: '100%', p: 2, border: '1px solid #e0e0e0' }}>
            <TextField
               label="Search Category"
               variant="outlined"
               fullWidth
               size='small'
               value={searchText}
               onChange={(e) => setSearchText(e.target.value)}
               sx={{ mb: 2 }}
               placeholder="Search by Name or Code..."
            />
            
            <DataGrid
               autoHeight
               rows={filteredData}
               columns={columns}
               loading={loading}
               pageSizeOptions={[5, 10, 25, 50]}
               initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
               disableRowSelectionOnClick
               sx={{
                  border: 0,
                  '& .MuiDataGrid-columnHeaders': {
                     backgroundColor: theme.palette.primary.light,
                     color: 'white',
                     fontWeight: 'bold',
                     fontSize: '0.95rem'
                  },
                  '& .MuiDataGrid-row:hover': {
                     backgroundColor: '#f5f8ff',
                  },
               }}
            />
         </Paper>
      </Paper>
   );
};

export default ItemCategoryMaster;
