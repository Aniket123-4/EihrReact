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
   Stack,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../../../utils/Url';
import { toast, ToastContainer } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';


const InvestigationParameter = () => {
   const { t } = useTranslation();
   const theme = useTheme();

   const [data, setData] = useState<any>([]);
   const [columns, setColumns] = useState<any>([]);

   const [invGroup, setInvGroup] = useState<any>([]);
   const [invUnit, setInvUnit] = useState<any>([]);
   const [patientType, setPatientType] = useState<any>([]);

   const [isEdit, setIsEdit] = useState(false);
   const [isRange, setIsRange] = useState(false);
   const [isGSTApplicable, setIsGSTApplicable] = useState(false);

   const [lstType_Patient, setlstType_Patient] = useState<any>([]);
   useEffect(() => {
      const initialized = patientType.map((type) => {
         const columns = {};
         for (let i = 1; i <= 15; i++) {
            columns[`col${i}`] = "";
         }
         return {
            ...columns,
            col4: type.patientTypeID, // Patient Type ID
            patientTypeName: type.patientTypeName, // Name for display
         };
      });
      setlstType_Patient(initialized);
   }, [patientType]);


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
      fetchInvGroup();
      fetchInvUnit();
      fetchPatientType();
      fetchInvestigationData();
   }, []);

   const fetchInvGroup = async () => {
      try {
         const payload = { "invGroupID": -1, "discountParameterID": -1, "isActive": -1, "formID": -1, "type": 1 };
         const response = await api.post("MasterForm/api/GetInvGroup", payload);
         if (response.data.isSuccess) {
            const arr = response.data.result.map((item) => {
               return {
                  ...item,
                  value: item.invGroupID,
                  label: item.invGroupName
               }
            })
            setInvGroup(arr);
         }
      } catch (error) {
         console.log(error);
      }
   }

   const fetchInvUnit = async () => {
      try {
         const payload = { "invUnitID": "-1", "invUnitType": "", "isActive": "1", "type": 1 };
         const response = await api.post("MasterForm/api/GetInvestigationUnit", payload);
         if (response.data.isSuccess) {
            const arr = response.data.result.map((item) => {
               return {
                  ...item,
                  value: item.invUnitID,
                  label: item.invUnitName
               }
            })
            setInvUnit(arr);
         }
      } catch (error) {
         console.log(error);
      }
   }


   const fetchPatientType = async () => {
      try {
         const response = await api.get("MasterForm/vPatientType");
         if (response.data.isSuccess) {
            const arr = response.data.result.map((item) => {
               return {
                  ...item,
                  value: item.patientTypeID,
                  label: item.patientTypeName
               }
            })
            setPatientType(arr);
         }
      } catch (error) {
         console.log(error);
      }
   }


   const fetchInvestigationData = async () => {
      try {
         const payload = { "invParameterID": -1, "invGroupID": -1, "isActive": -1, "formID": -1, "type": 1 };
         const response = await api.post("MasterForm/api/GetInvParameterMasterList", payload);
         if (response.data.isSuccess) {
            const data = response.data.result.map((item, index) => {
               return {
                  ...item,
                  id: item.invParameterID,
                  srno: index + 1
               }
            })
            setData(data);

            const columns: GridColDef[] = [
               {
                  field: 'invName',
                  headerName: t('text.TestName'),
                  flex: 2,
               },

               {
                  field: 'invCode',
                  headerName: t('text.Code'),
                  flex: 1
               },
               {
                  field: 'isRangeRequired',
                  headerName: t('text.Rangerequired'),
                  flex: 1,
                  renderCell: (params) => (
                     params.row.isRangeRequired ? "Yes" : "No"
                  )
               },
               {
                  field: 'invGroupName',
                  headerName: t('text.GroupName'),
                  flex: 1
               },
               {
                  field: 'isService',
                  headerName: t('text.IsService'),
                  flex: 1,
                  renderCell: (params) => (
                     params.row.isRangeRequired ? "Yes" : "No"
                  )
               },
               {
                  field: 'invRate',
                  headerName: t('text.Rate'),
                  flex: 1
               },
               {
                  field: 'action',
                  headerName: t('text.Action'),
                  flex: 1,
                  renderCell: (params) => (
                     <Button size="small" variant="outlined" color="primary"
                        onClick={() => { handleEditData(params.row.invParameterID) }}>
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


   const handleEditData = async (id) => {
      try {
         const payload = {
            invParameterID: id.toString(),
            invGroupID: 1,
            isActive: 1,
            formID: -1,
            type: 1
         };

         const response = await api.post("MasterForm/api/GetInvParameter", payload);

         if (response.data.isSuccess) {
            const result = response.data.result;
            const result1 = response.data.result1 || [];

            // Set main form values
            formik.setValues({
               ...formik.values,
               invName: result.invName,
               invGroupID: result.m39_InvGroupID,
               invCode: result.invCode,
               unitID: result.invUnitID,
               isService: result.isService ?? true, // Fallback if not present
               isRangeRequired: result.isRangeRequired ? "true" : "false",
               isVATApplicable: result.isVATApplicable,
               invRate: result.invRate,
               vatPercent: result.vatPercent,
               cgstPercent: result.cgstPercent,
               sgstPercent: result.sgstPercent,
               invParameterID: result.invParameterID,
               isActive: result.isActive,
               invNameML: result.invNameML
            });

            // Set GST applicable status
            setIsGSTApplicable(result.isVATApplicable);

            // Update patient type ranges if range is required
            // inside handleEditData
            if (result1.length > 0) {
               const updatedPatientTypes = lstType_Patient.map(type => {
                  const rangeData = result1.find(
                     r => r.patientTypeID.toString() === type.col4.toString()
                  );
                  return {
                     ...type,
                     col5: rangeData ? rangeData.rangeFrom : "",
                     col6: rangeData ? rangeData.rangeTo : "",
                     patientTypeName: rangeData ? rangeData.patientTypeName : type.patientTypeName
                  };
               });

               setlstType_Patient(updatedPatientTypes);
            }


            // Enable edit mode
            setIsEdit(true);
         } else {
            toast.error(response.data.msg || "Something went wrong while fetching data");
         }
      } catch (error) {
         console.error("Error fetching investigation parameter:", error);
         toast.error("Failed to fetch investigation data");
      }
   };


   const handleInputChange = (index, field, value) => {
      setlstType_Patient(prevState =>
         prevState.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
         )
      );
   };


   const formik = useFormik({
      initialValues: {
         "invName": "",
         "invGroupID": "",
         "invCode": "",
         "unitID": "",
         "isService": true,
         "isRangeRequired": "false",
         "isVATApplicable": true,
         "invRate": 0,
         "vatPercent": 0,
         "cgstPercent": 0,
         "sgstPercent": 0,
         "lstType_Patient": [],
         "invParameterID": "-1",
         "isActive": true,
         "formID": 0,
         "type": 0,
         "isEditorReq": "true",
         "invNameML": "",
         "InvRange": ""
      },

      onSubmit: async (values) => {
         try {
            const payload = { ...values, isRangeRequired: isRange.toString(), isVATApplicable: isGSTApplicable, lstType_Patient: lstType_Patient };

            console.log("payload", payload);
            const response = await api.post('MasterForm/api/AddUpdateInvParameter', values);
            if (response.data.isSuccess) {
               toast.success(response.data.msg);
               setIsEdit(false);
               formik.resetForm();
               //    setlstType_Patient([]); 
               fetchInvestigationData();
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
            {t('text.createInvestigationTest')}
         </Typography>
         <ToastContainer />
         <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
               <Grid item xs={12} sm={6} md={4}>
                  <TextField
                     size="small"
                     fullWidth
                     label={t('text.Name')}
                     name="invName"
                     placeholder={t('text.enterName')}
                     value={formik.values.invName}
                     onChange={formik.handleChange}
                     error={formik.touched.invName && Boolean(formik.errors.invName)}
                     helperText={formik.touched.invName && formik.errors.invName}
                  />
               </Grid>

               <Grid item xs={12} sm={6} md={4}>
                  <Autocomplete
                     size="small"
                     options={invGroup}
                     value={invGroup.find(e => e.value === formik.values.invGroupID) || null}
                     onChange={(_, newValue: any) => {
                        formik.setFieldValue('invGroupID', newValue?.value || "");
                     }}
                     renderInput={(params) => (
                        <TextField
                           {...params}
                           label={t('text.Group')}
                           placeholder={t('text.selectGroup')}
                           error={formik.touched.invGroupID && Boolean(formik.errors.invGroupID)}
                           helperText={formik.touched.invGroupID && formik.errors.invGroupID}
                        />
                     )}
                  />
               </Grid>

               <Grid item xs={12} sm={6} md={4}>
                  <TextField
                     size="small"
                     fullWidth
                     label={t('text.Code')}
                     name="invCode"
                     placeholder={t('text.enterCode')}
                     value={formik.values.invCode}
                     onChange={formik.handleChange}
                     error={formik.touched.invCode && Boolean(formik.errors.invCode)}
                     helperText={formik.touched.invCode && formik.errors.invCode}
                  />
               </Grid>

               <Grid item xs={12} sm={6} md={4}>
                  <Autocomplete
                     size="small"
                     options={invUnit}
                     value={invUnit.find(e => e.value === formik.values.unitID) || null}
                     onChange={(_, newValue) => {
                        formik.setFieldValue('unitID', newValue?.value || "");
                     }}
                     renderInput={(params) => (
                        <TextField
                           {...params}
                           label={t('text.Unit')}
                           placeholder={t('text.selectUnit')}
                           error={formik.touched.unitID && Boolean(formik.errors.unitID)}
                           helperText={formik.touched.unitID && formik.errors.unitID}
                        />
                     )}
                  />
               </Grid>


               <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                     control={
                        <Checkbox
                           name="isService"
                           checked={formik.values.isService}
                           onChange={formik.handleChange}
                        />
                     }
                     label={t('text.IsService')}
                  />
                  <FormControlLabel
                     control={
                        <Checkbox
                           name="isRangeRequired"
                           checked={formik.values.isRangeRequired === "true"}
                           onChange={(e) =>
                              formik.setFieldValue("isRangeRequired", e.target.checked ? "true" : "false")
                           }
                        />
                     }
                     label={t('text.IsRange')}
                  />

               </Grid>

               {String(formik.values.isRangeRequired) === "true" && (

                  <Grid item spacing={2} xs={12} sm={12} md={12}>
                     <Paper
                        elevation={3}
                        sx={{
                           p: 4,
                           borderRadius: 4,
                           backgroundColor: theme.palette.grey[100],
                        }}
                     >
                        <Typography
                           variant="h6"
                           fontWeight={700}
                           gutterBottom
                           sx={{ mb: 4, color: theme.palette.primary.main }}
                        >
                           Patient Type Ranges
                        </Typography>

                        <Grid container spacing={3}>
                           {lstType_Patient.map((type, index) => (
                              <React.Fragment key={type.col4}>
                                 <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                       Patient Type
                                    </Typography>
                                    <TextField
                                       value={type.patientTypeName}
                                       size="small"
                                       disabled
                                       fullWidth
                                       variant="outlined"
                                    />
                                 </Grid>
                                 <Grid item xs={12} md={4.5}>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                       Range From
                                    </Typography>
                                    <TextField
                                       fullWidth
                                       size="small"
                                       placeholder="Range From"
                                       value={type.col5}
                                       onChange={(e) =>
                                          handleInputChange(index, "col5", e.target.value)
                                       }
                                    />
                                 </Grid>
                                 <Grid item xs={12} md={4.5}>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                       Range To
                                    </Typography>
                                    <TextField
                                       fullWidth
                                       size="small"
                                       placeholder="Range To"
                                       value={type.col6}
                                       onChange={(e) =>
                                          handleInputChange(index, "col6", e.target.value)
                                       }
                                    />
                                 </Grid>

                              </React.Fragment>
                           ))}
                        </Grid>
                     </Paper>
                  </Grid>
               )}


               <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                     control={
                        <Checkbox
                           name="isRange"
                           checked={isGSTApplicable}
                           onChange={() => {
                              setIsGSTApplicable(!isGSTApplicable);
                           }}
                        />
                     }
                     label={t('text.IsGSTApplicable')}
                  />
               </Grid>

               {isGSTApplicable && (
                  <>
                     <Grid item xs={12} sm={6} md={3}>
                        <TextField
                           size="small"
                           fullWidth
                           // type="number"
                           label={t('text.GSTPercent')}
                           name="vatPercent"
                           placeholder={t('text.enterGSTPercent')}
                           value={formik.values.vatPercent}
                           onChange={(e) => {
                              let value = e.target.value;

                              // ✅ Remove leading zeros (e.g., "08" becomes "8")
                              if (value.length > 1) {
                                 value = value.replace(/^0+/, '');
                              }

                              formik.setFieldValue("vatPercent", value);
                           }}
                           error={formik.touched.vatPercent && Boolean(formik.errors.vatPercent)}
                           helperText={formik.touched.vatPercent && formik.errors.vatPercent}
                        />
                     </Grid>

                     <Grid item xs={12} sm={6} md={3}>
                        <TextField
                           size="small"
                           // type='number'
                           fullWidth
                           label={t('text.CGSTPercent')}
                           name="cgstPercent"
                           placeholder={t('text.enterCGSTPercent')}
                           value={formik.values.cgstPercent}
                           onChange={(e) => {
                              let value = e.target.value;

                              // ✅ Remove leading zeros (e.g., "08" becomes "8")
                              if (value.length > 1) {
                                 value = value.replace(/^0+/, '');
                              }

                              formik.setFieldValue("cgstPercent", value);
                           }}

                           error={formik.touched.cgstPercent && Boolean(formik.errors.cgstPercent)}
                           helperText={formik.touched.cgstPercent && formik.errors.cgstPercent}
                        />
                     </Grid>
                     <Grid item xs={12} sm={6} md={3}>
                        <TextField
                           size="small"
                           // type='number'
                           fullWidth
                           label={t('text.SGSTPercent')}
                           name="sgstPercent"
                           placeholder={t('text.enterSGSTPercent')}
                           value={formik.values.sgstPercent}
                           onChange={(e) => {
                              let value = e.target.value;

                              // ✅ Remove leading zeros (e.g., "08" becomes "8")
                              if (value.length > 1) {
                                 value = value.replace(/^0+/, '');
                              }

                              formik.setFieldValue("sgstPercent", value);
                           }}
                           error={formik.touched.sgstPercent && Boolean(formik.errors.sgstPercent)}
                           helperText={formik.touched.sgstPercent && formik.errors.sgstPercent}
                        />
                     </Grid>
                  </>
               )}

               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     size="small"
                     fullWidth
                     // type='number'
                     label={t('text.Rate')}
                     name="invRate"
                     placeholder={t('text.enterRate')}
                     value={formik.values.invRate}
                     onChange={(e) => {
                        let value = e.target.value;

                        // ✅ Remove leading zeros (e.g., "08" becomes "8")
                        if (value.length > 1) {
                           value = value.replace(/^0+/, '');
                        }

                        formik.setFieldValue("invRate", value);
                     }}
                     error={formik.touched.invRate && Boolean(formik.errors.invRate)}
                     helperText={formik.touched.invRate && formik.errors.invRate}
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
            {t('text.InvestigationList')}
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

export default InvestigationParameter;
