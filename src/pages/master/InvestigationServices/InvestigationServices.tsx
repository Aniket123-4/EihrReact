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
   FormGroup,
   Accordion,
   AccordionSummary,
   AccordionDetails,
   Divider,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../../../utils/Url';
import { toast, ToastContainer } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const InvestigationServices = () => {
   const { t } = useTranslation();
   const theme = useTheme();

   const [data, setData] = useState<any>([]);
   const [columns, setColumns] = useState<any>([]);
   const [isEdit, setIsEdit] = useState(false);
   const [openPreview, setOpenPreview] = useState(false);
   const [searchText, setSearchText] = useState('');
   const [groups, setGroups] = useState<any>([]);
   const [expanded, setExpanded] = useState<string[]>([]);
   const [parameters, setParameters] = useState<{ [key: string]: any[] }>({});
   const [selectedNames, setSelectedNames] = useState<string>("");
   const [selectedIds, setSelectedIds] = useState<string[]>([]);
   const [totalAmount, setTotalAmount] = useState<number>(0);

   const filteredData = useMemo(() => {
      if (!searchText) return data;
      return data.filter((row) =>
         Object.values(row).some(
            (value) =>
               value &&
               value.toString().toLowerCase().includes(searchText.toLowerCase())
         ));
   }, [searchText, data]);

   useEffect(() => {
      fetchGroups();
      fetchInvServicesData();
   }, []);

   const fetchGroups = async () => {
      const payload = {
         invGroupID: -1,
         discountParameterID: -1,
         isActive: -1,
         formID: -1,
         type: 1,
      };

      try {
         const { data } = await api.post(
            "MasterForm/api/GetInvGroup",
            payload
         );
         if (data?.isSuccess) {
            setGroups(data.result || []);
         }
      } catch (error) {
         console.error("Error fetching groups:", error);
      }
   };

   const fetchParameters = async (groupID: string) => {
      const payload = {
         invParameterID: -1,
         invGroupID: parseInt(groupID),
         isActive: -1,
         formID: -1,
         type: 1,
      };

      try {
         const { data } = await api.post(
            "MasterForm/api/GetInvParameterMasterList",
            payload
         );
         if (data?.isSuccess) {
            setParameters((prev) => ({
               ...prev,
               [groupID]: data.result || [],
            }));
         }
      } catch (error) {
         console.error("Error fetching parameters:", error);
      }
   };

   const handleToggle = (param: any) => {
      const id = param.invParameterID.toString();
      const name = `${param.invName} @${param.invRate} ₹/-`;
      const rate = parseFloat(param.invRate);

      setSelectedIds((prev) =>
         prev.includes(id)
            ? prev.filter((i) => i !== id)
            : [...prev, id]
      );

      setSelectedNames((prev) => {
         const names = prev ? prev.split(", ") : [];
         return names.includes(name)
            ? names.filter((n) => n !== name).join(", ")
            : [...names, name].join(", ");
      });

      setTotalAmount((prevAmount) =>
         selectedIds.includes(id)
            ? prevAmount - rate
            : prevAmount + rate
      );
   };

   const handleAccordionChange = (groupID: string) => (
      _: React.SyntheticEvent,
      isExpanded: boolean
   ) => {
      setExpanded(prev =>
         isExpanded
            ? [...prev, groupID]
            : prev.filter(id => id !== groupID)
      );
      if (isExpanded && !parameters[groupID]) {
         fetchParameters(groupID);
      }
   };

   const fetchInvServicesData = async () => {
      try {
         const response = await api.get("MasterForm/GetService?ServiceID=-1&IsActive=-1&Type=1");
         if (response.data.isSuccess) {
            const data = response.data.result.map((item, index) => {
               return {
                  ...item,
                  id: index + 1,
                  srno: index + 1
               }
            })
            setData(data);

            const columns: GridColDef[] = [
               {
                  field: 'serviceName',
                  headerName: t('text.name'),
                  flex: 1.5,
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
                  field: 'cgstPercent',
                  headerName: t('text.CGST'),
                  flex: 1,
               },
               {
                  field: 'sgstPercent',
                  headerName: t('text.SGST'),
                  flex: 1,
               },
               {
                  field: 'serviceCost',
                  headerName: t('text.Cost'),
                  flex: 1.5,
               },
               {
                  field: 'action',
                  headerName: t('text.Action'),
                  flex: 1,
                  renderCell: (params) => (
                     <Button size="small" variant="outlined" color="primary"
                        onClick={() => { handleEditData(params.row.serviceID) }}>
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
         const response = await api.get(`MasterForm/GetService?ServiceID=${id}&IsActive=-1&Type=3`);
         if (response.data.isSuccess) {
            const serviceData = response.data.result[0];
            const parameterIds = response.data.result.map(item => item.invParameterID.toString());

            // Set form values
            formik.setValues({
               ...formik.values,
               serviceName: serviceData.serviceName,
               serviceFrom: serviceData.serviceFrom,
               serviceTo: serviceData.serviceTo,
               serviceCost: serviceData.serviceCost,
               cgstPercent: serviceData.cgstPercent,
               sgstPercent: serviceData.sgstPercent,
               isActive: serviceData.isActive,
               serviceID: serviceData.serviceID,
            });

            // Set the selected parameters
            setSelectedIds(parameterIds);
            setTotalAmount(parseFloat(serviceData.serviceCost));

            // Set selected names and expand relevant accordions
            const names: string[] = [];
            const groupsToExpand = new Set<string>();

            // First fetch all parameters for groups that have selected parameters
            for (const group of groups) {
               await fetchParameters(group.invGroupID);
               if (parameters[group.invGroupID]) {
                  for (const param of parameters[group.invGroupID]) {
                     if (parameterIds.includes(param.invParameterID.toString())) {
                        names.push(`${param.invName} @${param.invRate} ₹/-`);
                        groupsToExpand.add(group.invGroupID);
                     }
                  }
               }
            }

            // Expand all accordions that have selected parameters
            if (groupsToExpand.size > 0) {
               setExpanded(Array.from(groupsToExpand));
            }

            setSelectedNames(names.join(", "));

            setIsEdit(true);
         } else {
            toast.error(response.data.msg);
         }
      } catch (error) {
         console.log(error);
         toast.error("Failed to fetch service data");
      }
   }

   const formik = useFormik({
      initialValues: {
         "serviceName": "",
         "serviceFrom": "",
         "serviceTo": "",
         "serviceCost": "",
         "cgstPercent": "",
         "sgstPercent": "",
         "invParameter": "",
         "isActive": true,
         "serviceID": "-1",
         "userID": 0,
         "formID": -1,
         "type": 1
      },

      validationSchema: Yup.object({
         serviceName: Yup.string().required("*Required service name"),
      }),

      onSubmit: async (values) => {
         try {
            const payload = { ...values, serviceCost: totalAmount, invParameter: selectedIds.join(', ') }
            console.log(payload);
            const response = await api.post('MasterForm/AddService', payload);
            if (response.data.isSuccess) {
               toast.success(response.data.msg);
               setIsEdit(false);
               formik.resetForm();
               setSelectedIds([]);
               setSelectedNames("");
               setTotalAmount(0);
               setExpanded([]);
               fetchInvServicesData();
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
            {t('text.createInvestigationServices')}
         </Typography>
         <ToastContainer />
         <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
               {/* Service Name */}
               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     fullWidth
                     size="small"
                     label={t("text.batteryTestName")}
                     name="serviceName"
                     value={formik.values.serviceName}
                     onChange={formik.handleChange}
                     error={formik.touched.serviceName && Boolean(formik.errors.serviceName)}
                     helperText={formik.touched.serviceName && formik.errors.serviceName}
                  />
               </Grid>

               {/* Service From */}
               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     fullWidth
                     size="small"
                     type="date"
                     label={t("text.serviceFrom")}
                     name="serviceFrom"
                     InputLabelProps={{ shrink: true }}
                     value={formik.values.serviceFrom.split('T')[0]}
                     onChange={formik.handleChange}
                     error={formik.touched.serviceFrom && Boolean(formik.errors.serviceFrom)}
                     helperText={formik.touched.serviceFrom && formik.errors.serviceFrom}
                  />
               </Grid>

               {/* Service To */}
               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     fullWidth
                     size="small"
                     type="date"
                     label={t("text.serviceTo")}
                     name="serviceTo"
                     InputLabelProps={{ shrink: true }}
                     value={formik.values.serviceTo.split('T')[0]}
                     onChange={formik.handleChange}
                     error={formik.touched.serviceTo && Boolean(formik.errors.serviceTo)}
                     helperText={formik.touched.serviceTo && formik.errors.serviceTo}
                  />
               </Grid>

               {/* Service Cost */}
               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     fullWidth
                     size="small"
                     type="number"
                     label={t("text.cost")}
                     name="serviceCost"
                     value={totalAmount || formik.values.serviceCost}
                     onChange={formik.handleChange}
                     error={formik.touched.serviceCost && Boolean(formik.errors.serviceCost)}
                     helperText={formik.touched.serviceCost && formik.errors.serviceCost}
                     InputProps={{
                        readOnly: true,
                     }}
                  />
               </Grid>

               {/* CGST Percent */}
               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     fullWidth
                     size="small"
                     type="number"
                     label={t("text.cgst")}
                     name="cgstPercent"
                     value={formik.values.cgstPercent}
                     onChange={formik.handleChange}
                     error={formik.touched.cgstPercent && Boolean(formik.errors.cgstPercent)}
                     helperText={formik.touched.cgstPercent && formik.errors.cgstPercent}
                  />
               </Grid>

               {/* SGST Percent */}
               <Grid item xs={12} sm={6} md={3}>
                  <TextField
                     fullWidth
                     size="small"
                     type="number"
                     label={t("text.sgst")}
                     name="sgstPercent"
                     value={formik.values.sgstPercent}
                     onChange={formik.handleChange}
                     error={formik.touched.sgstPercent && Boolean(formik.errors.sgstPercent)}
                     helperText={formik.touched.sgstPercent && formik.errors.sgstPercent}
                  />
               </Grid>

               <Grid item xs={12}>
                  <Paper
                     elevation={3}
                     sx={{
                        position: 'relative',
                        p: 0,
                        maxHeight: 500,
                        overflowY: 'auto',
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                     }}
                  >
                     <Box
                        sx={{
                           position: 'sticky',
                           top: 0,
                           zIndex: 10,
                           backgroundColor: '#1976d2',
                           color: '#fff',
                           px: 2,
                           py: 1,
                           borderBottom: '1px solid #ccc',
                        }}
                     >
                        <Typography variant="h6" fontWeight="bold">
                           {t("text.InvestigationParameter")}
                        </Typography>
                     </Box>

                     <Box sx={{ p: 2 }}>
                        {groups.map((group: any) => (
                           <Accordion
                              key={group.invGroupID}
                              expanded={expanded.includes(group.invGroupID)}
                              onChange={handleAccordionChange(group.invGroupID)}
                              disableGutters
                              sx={{
                                 backgroundColor: '#f9f9f9',
                                 boxShadow: 'none',
                                 borderBottom: '1px solid #e0e0e0',
                                 '&:before': { display: 'none' },
                              }}
                           >
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                 <FormControlLabel
                                    control={<Checkbox disabled />}
                                    label={
                                       <Typography sx={{ fontWeight: 500 }}>
                                          {group.invGroupName}
                                       </Typography>
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    onFocus={(e) => e.stopPropagation()}
                                 />
                              </AccordionSummary>

                              <AccordionDetails>
                                 {parameters[group.invGroupID]?.map((param: any) => (
                                    <FormControlLabel
                                       key={param.invParameterID}
                                       control={
                                          <Checkbox
                                             checked={selectedIds.includes(param.invParameterID.toString())}
                                             onChange={() => handleToggle(param)}
                                          />
                                       }
                                       label={
                                          <Typography variant="body2">
                                             {`${param.invName} @${param.invRate} ₹/-`}
                                          </Typography>
                                       }
                                       sx={{ ml: 2 }}
                                    />
                                 ))}
                              </AccordionDetails>
                           </Accordion>
                        ))}

                        <Divider sx={{ my: 2 }} />

                        <Box>
                           <Typography variant="body2" gutterBottom>
                              <strong>Selected Names:</strong> {selectedNames}
                           </Typography>
                           <Typography variant="body2" gutterBottom>
                              <strong>Selected IDs:</strong> {selectedIds.join(', ')}
                           </Typography>
                           <Typography variant="h6" color="primary">
                              <strong>Total Amount:</strong> ₹ {totalAmount.toFixed(2)}
                           </Typography>
                        </Box>
                     </Box>
                  </Paper>
               </Grid>

               {/* isActive */}
               <Grid item xs={12}>
                  <FormControlLabel
                     control={
                        <Checkbox
                           name="isActive"
                           checked={formik.values.isActive}
                           onChange={formik.handleChange}
                        />
                     }
                     label={t("text.isActive")}
                  />
               </Grid>

               {/* Submit & Cancel */}
               <Grid item xs={12}>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                     <Button type="submit" variant="contained" color="primary" size="small">
                        {isEdit ? t("text.update") : t("text.submit")}
                     </Button>
                     <Button
                        type="reset"
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => {
                           formik.resetForm();
                           setIsEdit(false);
                           setSelectedIds([]);
                           setSelectedNames("");
                           setTotalAmount(0);
                           setExpanded([]);
                        }}
                     >
                        {t("text.cancel")}
                     </Button>
                  </Box>
               </Grid>
            </Grid>
         </form>

         <Typography variant="h6" mt={5} mb={2} color="primary.dark">
            {t('text.InvestigationServiceList')}
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

export default InvestigationServices;
