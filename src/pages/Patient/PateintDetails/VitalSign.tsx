import React, { useEffect, useState } from 'react';
import {
   Box, Grid, Typography, Paper, TextField, Button, IconButton, 
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   Divider, CircularProgress, Card, CardContent, InputAdornment, Tooltip, Chip, useTheme
} from '@mui/material';
import { 
   Delete as DeleteIcon, Save as SaveIcon, History as HistoryIcon,
   MonitorHeart as HeartIcon, Event as DateIcon
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import api from '../../../utils/Url';
import { toast } from 'react-toastify';

const VitalSign = ({ patientDetails = {}, patientCaseID, onSaveSuccess, admNo }: any) => {
   const theme = useTheme();
   const [loading, setLoading] = useState(false);
   const [vitalsDef, setVitalsDef] = useState<any[]>([]); 
   const [formValues, setFormValues] = useState<any>({}); 
   const [selectDate, setSelectDate] = useState<Dayjs | null>(dayjs());
   
   const historyData = patientDetails.result3 || [];

   useEffect(() => {
      getVitalParameters();
   }, []);

   const getVitalParameters = async () => {
      try {
         const params = { "vitalParameterID": -1, "parameterType": -1, "isActive": 1, "type": 1 };
         const res = await api.post('/MasterForm/GetVitalParameter', params);
         if (res.data.isSuccess) setVitalsDef(res.data.result);
      } catch (e) { console.error(e); }
   };

   const handleInputChange = (id: any, field: string, value: string) => {
      setFormValues((prev: any) => ({
         ...prev,
         [id]: { ...prev[id], [field]: value }
      }));
   };

   // AAPKE REQUIREMENT KE ANUSAR EXACT PAYLOAD GENERATOR
   const getBasePayload = () => ({
      "col1": "", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", "col8": "", "col9": "", "col10": "",
      "col11": "", "col12": "", "col13": "", "col14": "", "col15": "", "col16": "", "col17": "", "col18": "", "col19": "", "col20": "",
      "col21": "", "col22": "",
      "isForDelete": false,
      "lstType_DocPatient": [{"col1": "", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", "col8": "", "col9": "", "col10": "", "col11": "", "col12": "", "col13": "", "col14": "", "col15": ""}],
      "lstType_Patient": [{"col1": "", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", "col8": "", "col9": "", "col10": "", "col11": "", "col12": "", "col13": "", "col14": "", "col15": ""}],
      "userID": "-2",
      "formID": -1,
      "type": 2 // Type 2 for Vitals
   });

   const onFinish = async () => {
      const enteredVitals = vitalsDef.filter(v => formValues[v.vitalParameterID]?.result);

      if (enteredVitals.length === 0) {
         toast.warning("Please enter at least one vital result");
         return;
      }

      setLoading(true);
      try {
         // API expects separate call for each vital parameter
         for (const v of enteredVitals) {
            const current = formValues[v.vitalParameterID];
            const payload = {
               ...getBasePayload(),
               "patientCaseID": patientCaseID.toString(),
               "admNo": admNo.toString(),
               "col1": v.vitalParameterID.toString(), // Parameter ID
               "col2": current.result || "",          // Result Value
               "col3": current.comment || "",         // Comment
               "col4": current.desc || "",            // Description
               "col6": v.vitalParameterID.toString(), // Parameter ID again as per old logic
               "col21": selectDate?.toISOString(),    // Date ISO
               "col22": selectDate?.format('DD-MMM-YYYY'), // Formatted Date
            };
            await api.post('/AddDelPatientForDoctorOPIP', payload);
         }
         
         toast.success("Vitals saved successfully");
         setFormValues({}); 
         onSaveSuccess({ tab: "VITAL_SIGN" });
      } catch (e) {
         toast.error("Error saving vitals");
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (record: any) => {
      if (!window.confirm("Are you sure?")) return;
      setLoading(true);
      try {
         const payload = {
            ...getBasePayload(),
            "patientCaseID": patientCaseID.toString(),
            "admNo": record.admNo.toString(),
            "col1": record.vitalParameterID.toString(),
            "col5": record.admNo.toString(),
            "isForDelete": true,
            "type": 2
         };
         await api.post('/AddDelPatientForDoctorOPIP', payload);
         onSaveSuccess({ tab: "VITAL_SIGN" });
         toast.success("Record deleted");
      } catch (e) { toast.error("Delete failed"); }
      finally { setLoading(false); }
   };

   return (
      <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
         <Card sx={{ borderRadius: 4, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <HeartIcon color="primary" /> New Vital Sign Entry
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                     <DatePicker
                        label="Observation Date"
                        value={selectDate}
                        onChange={(newValue) => setSelectDate(newValue)}
                        slotProps={{ textField: { size: 'small', sx: { width: 200 } } }}
                     />
                  </LocalizationProvider>
               </Box>

               <Divider sx={{ mb: 3 }} />

               <Grid container spacing={2}>
                  {vitalsDef.map((v) => (
                     <Grid item xs={12} sm={6} md={4} key={v.vitalParameterID}>
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fbfbfb', borderRadius: 3 }}>
                           <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                              {v.vitalParameterName}
                           </Typography>
                           <Grid container spacing={1}>
                              <Grid item xs={6}>
                                 <TextField
                                    fullWidth size="small" label="Result"
                                    value={formValues[v.vitalParameterID]?.result || ''}
                                    onChange={(e) => handleInputChange(v.vitalParameterID, 'result', e.target.value)}
                                    InputProps={{ endAdornment: <InputAdornment position="end">{v.vitalUnitName}</InputAdornment> }}
                                 />
                              </Grid>
                              <Grid item xs={6}>
                                 <TextField
                                    fullWidth size="small" label="Comment"
                                    value={formValues[v.vitalParameterID]?.comment || ''}
                                    onChange={(e) => handleInputChange(v.vitalParameterID, 'comment', e.target.value)}
                                 />
                              </Grid>
                           </Grid>
                        </Paper>
                     </Grid>
                  ))}
               </Grid>

               <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <Button 
                     variant="contained" 
                     startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                     onClick={onFinish}
                     disabled={loading}
                     sx={{ borderRadius: 2, px: 4 }}
                  >
                     Save Vitals
                  </Button>
               </Box>
            </CardContent>
         </Card>

         <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}><Typography variant="h6" fontWeight="bold">History</Typography></Box>
            <TableContainer sx={{ maxHeight: 400 }}>
               <Table stickyHeader size="small">
                  <TableHead>
                     <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Parameter</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Result</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {historyData.map((row: any, i: number) => (
                        <TableRow key={i}>
                           <TableCell>{row.vitalDateTimeVar}</TableCell>
                           <TableCell fontWeight="bold">{row.vitalParameterName}</TableCell>
                           <TableCell><Chip label={`${row.vitalResult} ${row.vitalUnitName}`} size="small" color="primary" variant="outlined" /></TableCell>
                           <TableCell>
                              <IconButton size="small" color="error" onClick={() => handleDelete(row)}><DeleteIcon fontSize="small" /></IconButton>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </TableContainer>
         </Paper>
      </Box>
   );
};

export default VitalSign;
