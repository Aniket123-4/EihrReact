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
import TranslateTextField from "../../../TranslateTextField";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../../../utils/Url';
import { toast, ToastContainer } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import { Language } from 'react-transliterate';
import Languages from '../../../Languages';


const DiseaseMaster = () => {
   const { t } = useTranslation();
   const theme = useTheme();

   const [data, setData] = useState<any>([]);
   const [columns, setColumns] = useState<any>([]);

   const [diseaseTypeOption, setDiseaseTypeOption] = useState<any>([{
      value: "-1", label: "Select"
   }]);
   const [lang, setLang] = useState<Language>("en");
   const [isEdit, setIsEdit] = useState(false);

   const [openPreview, setOpenPreview] = useState(false);

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
      fetchDiseaseTypes();
      fetchDiseaseData();
   }, []);


   const fetchDiseaseTypes = async () => {
      try {
         const payload = { "diseaseTypeID": -1, "specialTypeID": -1, "isActive": -1, "type": 1 };
         const response = await api.post("MasterForm/api/GetDiseaseType", payload);

         if (response.data.isSuccess) {
            const arr = response.data.result.map((item) => {
               return {
                  ...item,
                  value: item.diseaseTypeID,
                  label: item.diseaseTypeName
               }
            })
            setDiseaseTypeOption(arr);

         }


      } catch (error) {
         console.log(error);
      }
   }


   const fetchDiseaseData = async () => {
      try {
         const payload = { "diseaseID": "-1", "diseaseTypeID": "-1", "specialTypeID": "-1", "isActive": "-1", "type": 1 }
         const response = await api.post("MasterForm/api/GetDisease", payload);
         if (response.data.isSuccess) {
            const data = response.data.result.map((item, index) => {
               return {
                  ...item,
                  id: item.diseaseID,
                  srno: index + 1
               }
            })
            setData(data);

            const columns: GridColDef[] = [
               {
                  field: 'diseaseName',
                  headerName: t('text.name'),
                  flex: 1.5,
               },
               {
                  field: 'isActive',
                  headerName: t('text.active'),
                  width: 110,
                  renderCell: (params) =>
                     params.value ? (
                        <Chip label="Active" color="success" size="small" />
                     ) : (
                        <Chip label="Inactive" color="warning" size="small" />
                     ),
               },
               {
                  field: 'diseaseCodeICD',
                  headerName: t('text.diseaseCodeICD'),
                  width: 140,
               },
               {
                  field: 'diseaseTypeName',
                  headerName: t('text.diseaseType'),
                  flex: 1.5,
               },
               {
                  field: 'specialTypeName',
                  headerName: t('text.specialTypeName'),
                  flex: 1,
               },
               {
                  field: 'action',
                  headerName: t('text.Action'),
                  width: 100,
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
      formik.setFieldValue("diseaseTypeName", row.diseaseName)
      formik.setFieldValue("diseaseTypeCode", row.diseaseCodeICD)
      formik.setFieldValue("diseaseNameHindi", row.diseaseNameHindi)
      formik.setFieldValue("diseasesImage", row.diseasesImage)
      formik.setFieldValue("isActive", row.isActive)
      formik.setFieldValue("specialTypeID", row.diseaseTypeID)
      formik.setFieldValue("diseasesID", row.diseaseID)
      formik.setFieldValue("type", 2)
      setIsEdit(true);
   }



   const formik = useFormik({
      initialValues: {
         "diseaseTypeName": "",
         "diseaseTypeCode": "",
         "diseaseNameHindi": "",
         "diseaseTypeID": "",
         "diseasesImage": "",
         "isActive": true,
         "specialTypeID": "",
         "sortOrder": 1,
         "diseasesID": "-1",
         "formID": -1,
         "type": 2
      },

      validationSchema: Yup.object({
         diseaseTypeName: Yup.string().required("*Required disease name"),
         diseaseTypeCode: Yup.string().required("*Required disease code"),
         diseaseNameHindi: Yup.string().required("*Required disease name in hindi"),
         specialTypeID: Yup.string().required("*Required disease type"),
      }),

      onSubmit: async (values) => {
         try {
            const response = await api.post('MasterForm/api/AddUpdateDisease', { ...values, isActive: values.isActive.toString(), type: isEdit ? 2 :2  });
            if (response.data.isSuccess) {
               toast.success(response.data.msg);
               formik.resetForm();
               setIsEdit(false);
               fetchDiseaseData();
            } else {
               toast.error(response.data.msg);
            }
         } catch (error) {
            console.log(error);
         }
      },
   });

   const handlePreviewOpen = () => setOpenPreview(true);
   const handlePreviewClose = () => setOpenPreview(false);

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0];

      if (!file) {
         formik.setFieldValue('diseasesImage', '');
         return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
         alert('Only JPG, JPEG, and PNG files are allowed.');
         formik.setFieldValue('diseasesImage', '');
         return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
         const base64String = reader.result as string;
         formik.setFieldValue('diseasesImage', base64String);
      };
      reader.readAsDataURL(file);
   };

   return (
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, maxWidth: 1400, mx: 'auto', mt: 4 }}>
   {/* Top Bar: Title and Language Selector */}
   <Grid container alignItems="center" justifyContent="space-between">
      <Grid item>
         <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
            {t('text.createDiseaseMaster')}
         </Typography>
      </Grid>
      <Grid item>
         <Box sx={{ mb: 2 }}>
            <select
               className="language-dropdown"
               value={lang}
               onChange={(e) => setLang(e.target.value as Language)}
            >
               {Languages.map((l) => (
                  <option key={l.value} value={l.value}>
                     {l.label}
                  </option>
               ))}
            </select>
         </Box>
      </Grid>
   </Grid>
         <ToastContainer />
         <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     size="small"
                     fullWidth
                     label={t('text.diseaseName')}
                     name="diseaseTypeName"
                     placeholder={t('text.enterDiseaseName')}
                     value={formik.values.diseaseTypeName}
                     onChange={formik.handleChange}
                     error={formik.touched.diseaseTypeName && Boolean(formik.errors.diseaseTypeName)}
                     helperText={formik.touched.diseaseTypeName && formik.errors.diseaseTypeName}
                  />
               </Grid>

               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     size="small"
                     fullWidth
                     label={t('text.diseaseCode')}
                     name="diseaseTypeCode"
                     placeholder={t('text.enterDiseaseCode')}
                     value={formik.values.diseaseTypeCode}
                     onChange={formik.handleChange}
                     error={formik.touched.diseaseTypeCode && Boolean(formik.errors.diseaseTypeCode)}
                     helperText={formik.touched.diseaseTypeCode && formik.errors.diseaseTypeCode}
                  />
               </Grid>

               
               <Grid item xs={12} sm={6} md={3}>
                  <TranslateTextField
                     label={t("text.diseaseNameHindi")}
                     value={formik.values.diseaseNameHindi}
                     onChangeText={(text: string) => formik.setFieldValue("diseaseNameHindi", text)}
                     required={true}
                     lang={lang}
                  />
                  {formik.touched.diseaseNameHindi && formik.errors.diseaseNameHindi ? (
                     <div style={{ color: "red", margin: "5px" }}>
                        {formik.errors.diseaseNameHindi}
                     </div>
                  ) : null}
               </Grid>


               <Grid item xs={12} sm={6} md={3}>
                  <Autocomplete
                     size="small"
                     options={diseaseTypeOption}
                     value={diseaseTypeOption.find(e => e.value === formik.values.specialTypeID) || null}
                     onChange={(_, newValue) => {
                        formik.setFieldValue('specialTypeID', newValue?.value || "");
                     }}
                     renderInput={(params) => (
                        <TextField
                           {...params}
                           label={t('text.diseaseType')}
                           placeholder={t('text.selectDiseaseType')}
                           error={formik.touched.specialTypeID && Boolean(formik.errors.specialTypeID)}
                           helperText={formik.touched.specialTypeID && formik.errors.specialTypeID}
                        />
                     )}
                  />
               </Grid>

               <Grid item xs={12} sm={6} md={3}>
                  <Button
                     fullWidth
                     component="label"
                     variant="outlined"
                     size="small"
                     startIcon={<CloudUploadIcon />}
                  >
                     {t('text.uploadImage')}
                     <input hidden accept="image/jpeg,image/jpg,image/png" type="file" onChange={handleFileChange} />
                  </Button>
                  {formik.values.diseasesImage && (
                     <>

                        <Button
                           fullWidth
                           variant="contained"
                           size="small"
                           color="info"
                           onClick={handlePreviewOpen}
                        >
                           {t('text.previewImage') || 'Preview Image'}
                        </Button>
                        <Dialog open={openPreview} onClose={handlePreviewClose} maxWidth="sm" fullWidth>
                           <DialogTitle>
                              {t('text.imagePreview') || 'Image Preview'}
                              <IconButton
                                 aria-label="close"
                                 onClick={handlePreviewClose}
                                 sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                 }}
                              >
                                 <CloseIcon />
                              </IconButton>
                           </DialogTitle>
                           <DialogContent dividers>
                              {formik.values.diseasesImage ? (
                                 <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                                    <img
                                       src={formik.values.diseasesImage}
                                       alt="Disease Preview"
                                       style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: 8 }}
                                    />
                                 </Box>
                              ) : (
                                 <Typography variant="body1">No image available.</Typography>
                              )}
                           </DialogContent>
                        </Dialog>
                     </>

                  )}
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
            {t('text.diseaseList')}
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
                  getRowHeight={() => 'auto'} // 🔥 This enables dynamic row height
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
                        display: 'block', // ensures text wraps properly
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

export default DiseaseMaster;
