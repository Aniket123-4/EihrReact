import React, { useState } from 'react';
import {
   Box, Grid, Typography, Paper, TextField, Button, Divider, 
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   CircularProgress, Card, CardContent, Stack, useTheme
} from '@mui/material';
import { 
   AssignmentTurnedIn as SummaryIcon, 
   History as HistoryIcon,
   Save as SaveIcon,
   LocalHospital as HospitalIcon,
   Notes as NotesIcon,
   HealthAndSafety as DiagnosisIcon
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import api from '../../../utils/Url';
import { toast } from 'react-toastify';

const DischargeSummary = ({ patientDetails = {}, patientCaseID, onSaveSuccess, admNo }: any) => {
   const theme = useTheme();
   const [loading, setLoading] = useState(false);
   const historyList = patientDetails?.result8 || [];

   const [dischargeDate, setDischargeDate] = useState<Dayjs | null>(dayjs());
   const [nextVisitDate, setNextVisitDate] = useState<Dayjs | null>(dayjs().add(7, 'day'));
   
   const [values, setValues] = useState({
      condUponDischarge: '',
      briefCaseSummary: '',
      reasonForAdmission: '',
      clinicalFinding: '',
      finalDiagnosis: '',
      instructionToPatient: '',
      dischargeNotes: '',
      finalAdvice: '',
      followUpIssues: ''
   });

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [e.target.name]: e.target.value });
   };

   // 1. EXACT Payload Helper (15 Columns in Arrays)
   const getBasePayload = () => ({
      "col1": "", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", "col8": "", "col9": "", "col10": "",
      "col11": "", "col12": "", "col13": "", "col14": "", "col15": "", "col16": "", "col17": "", "col18": "", "col19": "", "col20": "",
      "col21": "", "col22": "",
      "isForDelete": false,
      "lstType_DocPatient": [
         { "col1": "", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", "col8": "", "col9": "", "col10": "", "col11": "", "col12": "", "col13": "", "col14": "", "col15": "" }
      ],
      "lstType_Patient": [
         { "col1": "", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", "col8": "", "col9": "", "col10": "", "col11": "", "col12": "", "col13": "", "col14": "", "col15": "" }
      ],
      "userID": "-2", "formID": -1, "type": 7
   });

   const onFinish = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const payload = {
         ...getBasePayload(),
         "patientCaseID": patientCaseID ? patientCaseID.toString() : "",
         "admNo": admNo ? admNo.toString() : "",
         "col1": "-1", // DisCondID
         "col2": "-1", // DischargeToID
         "col3": values.condUponDischarge,
         "col4": values.briefCaseSummary,
         "col5": values.reasonForAdmission,
         "col6": values.clinicalFinding,
         "col7": values.finalDiagnosis,
         "col8": values.instructionToPatient,
         "col9": values.dischargeNotes,
         "col10": values.finalAdvice,
         "col11": values.followUpIssues,
         "col21": dischargeDate?.format('DD-MMM-YYYY') || "",
         "col22": nextVisitDate?.format('DD-MMM-YYYY') || ""
      };

      try {
         // Path handle kar rahe hain bina leading slash ke
         const response = await api.post('AddDelPatientForDoctorOPIP', payload);
         
         if (response.data.isSuccess) {
            toast.success("Discharge Summary Saved Successfully");
            onSaveSuccess({ tab: "DISCHARGE_SUMMARY" });
         } else {
            toast.error(response.data.msg || "Server rejected data");
         }
      } catch (error: any) {
         console.error("Discharge Error Log:", error.response?.data);
         toast.error(error.response?.data?.msg || "Connection Error: Check console for details");
      } finally {
         setLoading(false);
      }
   };

   return (
      <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
         <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card sx={{ borderRadius: 4, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
               <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                     <SummaryIcon color="primary" sx={{ fontSize: 32 }} />
                     <Typography variant="h5" fontWeight="bold">Create Discharge Summary</Typography>
                  </Box>

                  <form onSubmit={onFinish}>
                     <Grid container spacing={3}>
                        {/* Clinical Section */}
                        <Grid item xs={12} md={6}>
                           <Stack spacing={2.5}>
                              <TextField fullWidth size="small" label="Reason For Admission" name="reasonForAdmission" value={values.reasonForAdmission} onChange={handleInputChange} InputProps={{ startAdornment: <HospitalIcon sx={{ mr: 1, color: 'gray' }} /> }} />
                              <TextField fullWidth multiline rows={3} label="Brief Case Summary" name="briefCaseSummary" value={values.briefCaseSummary} onChange={handleInputChange} />
                              <TextField fullWidth multiline rows={3} label="Clinical Findings" name="clinicalFinding" value={values.clinicalFinding} onChange={handleInputChange} />
                              <TextField fullWidth size="small" label="Final Diagnosis" name="finalDiagnosis" value={values.finalDiagnosis} onChange={handleInputChange} InputProps={{ startAdornment: <DiagnosisIcon sx={{ mr: 1, color: 'gray' }} /> }} />
                           </Stack>
                        </Grid>

                        {/* Instructions Section */}
                        <Grid item xs={12} md={6}>
                           <Stack spacing={2.5}>
                              <TextField fullWidth size="small" label="Condition Upon Discharge" name="condUponDischarge" value={values.condUponDischarge} onChange={handleInputChange} />
                              <TextField fullWidth multiline rows={2} label="Instruction to Patient" name="instructionToPatient" value={values.instructionToPatient} onChange={handleInputChange} />
                              <TextField fullWidth multiline rows={2} label="Final Advice" name="finalAdvice" value={values.finalAdvice} onChange={handleInputChange} />
                              <Grid container spacing={2}>
                                 <Grid item xs={6}><DatePicker label="Discharge Date" value={dischargeDate} onChange={setDischargeDate} slotProps={{ textField: { size: 'small', fullWidth: true } }} /></Grid>
                                 <Grid item xs={6}><DatePicker label="Next Follow-up" value={nextVisitDate} onChange={setNextVisitDate} slotProps={{ textField: { size: 'small', fullWidth: true } }} /></Grid>
                              </Grid>
                              <TextField fullWidth size="small" label="Discharge Notes" name="dischargeNotes" value={values.dischargeNotes} onChange={handleInputChange} />
                           </Stack>
                        </Grid>
                     </Grid>

                     <Box sx={{ mt: 5, textAlign: 'right' }}>
                        <Button type="submit" variant="contained" size="large" startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} disabled={loading} sx={{ borderRadius: 3, px: 6, fontWeight: 'bold' }}>
                           Finalize & Save Summary
                        </Button>
                     </Box>
                  </form>
               </CardContent>
            </Card>

            <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
               <Box sx={{ p: 2, bgcolor: theme.palette.grey[100] }}><Typography variant="h6" fontWeight="bold">History Records</Typography></Box>
               <TableContainer sx={{ maxHeight: 400 }}>
                  <Table stickyHeader size="small">
                     <TableHead>
                        <TableRow>
                           <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                           <TableCell sx={{ fontWeight: 'bold' }}>Condition</TableCell>
                           <TableCell sx={{ fontWeight: 'bold' }}>Diagnosis</TableCell>
                           <TableCell sx={{ fontWeight: 'bold' }}>Follow-up</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {historyList.map((row: any, i: number) => (
                           <TableRow key={i} hover>
                              <TableCell sx={{ fontWeight: 'bold' }}>{row.dischargeDateVar}</TableCell>
                              <TableCell>{row.condUponDischarge}</TableCell>
                              <TableCell color="primary.main">{row.finalDaigNosis}</TableCell>
                              <TableCell>{row.nextVisitDateVar || 'N/A'}</TableCell>
                           </TableRow>
                        ))}
                        {historyList.length === 0 && <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}>No summary found</TableCell></TableRow>}
                     </TableBody>
                  </Table>
               </TableContainer>
            </Paper>
         </LocalizationProvider>
      </Box>
   );
};

export default DischargeSummary;
