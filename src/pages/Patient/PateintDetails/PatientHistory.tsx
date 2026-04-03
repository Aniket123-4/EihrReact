import React, { useState } from 'react';
import {
   Box, Grid, Typography, Paper, TextField, Button, Divider, 
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   CircularProgress, Card, CardContent, InputAdornment, Avatar, useTheme
} from '@mui/material';
import { 
   HistoryEdu as HistoryIcon,
   WarningAmber as AllergyIcon,
   ReportProblem as WarningIcon,
   SmokingRooms as AddictionIcon,
   Groups as FamilyIcon,
   Person as PersonalIcon,
   MedicalInformation as PastIcon,
   ChildCare as ObstetricsIcon,
   Public as SocialIcon,
   Save as SaveIcon
} from '@mui/icons-material';
import api from '../../../utils/Url';
import { toast } from 'react-toastify';

// Input field component defined outside to prevent focus loss
const HistoryField = ({ name, label, icon: Icon, placeholder, value, onChange }: any) => (
   <Grid item xs={12} sm={6} md={3}>
      <TextField
         fullWidth
         size="small"
         name={name}
         label={label}
         placeholder={placeholder}
         value={value || ""}
         onChange={onChange}
         InputProps={{
            startAdornment: (
               <InputAdornment position="start">
                  <Icon fontSize="small" color="primary" />
               </InputAdornment>
            ),
         }}
         sx={{ bgcolor: '#fff' }}
      />
   </Grid>
);

const PatientHistory = ({ patientDetails = {}, patientCaseID, onSaveSuccess, admNo }: any) => {
   const theme = useTheme();
   const [loading, setLoading] = useState(false);
   
   const historyList = patientDetails?.result7 || [];

   const [values, setValues] = useState({
      allergy: '', warnings: '', addiction: '', socialHistory: '',
      familyHistory: '', personalHistory: '', pastMedicalHistory: '', obstetrics: ''
   });

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setValues(prev => ({ ...prev, [name]: value }));
   };

   const onFinish = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validation to ensure IDs are present
      if (!patientCaseID || !admNo) {
         toast.error("Missing Patient Case ID or Admission Number");
         return;
      }

      setLoading(true);

      // EXACT Payload as per your successful Referral module structure
      const payload = {
         "patientCaseID": patientCaseID.toString(),
         "admNo": admNo.toString(),
         "col1": values.allergy || "",
         "col2": values.warnings || "",
         "col3": values.addiction || "",
         "col4": values.socialHistory || "",
         "col5": values.familyHistory || "",
         "col6": values.personalHistory || "",
         "col7": values.pastMedicalHistory || "",
         "col8": values.obstetrics || "",
         "col9": "", "col10": "", "col11": "", "col12": "", "col13": "", "col14": "", "col15": "", 
         "col16": "", "col17": "", "col18": "", "col19": "", "col20": "", "col21": "", "col22": "",
         "isForDelete": false,
         "lstType_DocPatient": [
            { "col1": "", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", "col8": "", "col9": "", "col10": "", "col11": "", "col12": "", "col13": "", "col14": "", "col15": "" }
         ],
         "lstType_Patient": [
            { "col1": "", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", "col8": "", "col9": "", "col10": "", "col11": "", "col12": "", "col13": "", "col14": "", "col15": "" }
         ],
         "userID": "-2",
         "formID": -1,
         "type": 6 // Type 6 for Patient History
      };

      try {
         // TRY BOTH: change to 'AddDelPatientForDoctorOPIP' OR '/AddDelPatientForDoctorOPIP' based on your global api settings
         const response = await api.post('AddDelPatientForDoctorOPIP', payload);
         
         if (response.data.isSuccess) {
            toast.success("Patient History Updated Successfully");
            setValues({
               allergy: '', warnings: '', addiction: '', socialHistory: '',
               familyHistory: '', personalHistory: '', pastMedicalHistory: '', obstetrics: ''
            });
            onSaveSuccess({ tab: "PATIENT_HISTORY" });
         } else {
            toast.error(response.data.msg || "Server rejected the save");
         }
      } catch (error: any) {
         console.error("Full Error Object:", error);
         const errMsg = error.response?.data?.msg || "Network Error: Server is unreachable";
         toast.error(errMsg);
      } finally {
         setLoading(false);
      }
   };

   return (
      <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
         <Card sx={{ borderRadius: 4, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}><HistoryIcon /></Avatar>
                  <Typography variant="h6" fontWeight="bold">Record Patient History</Typography>
               </Box>
               
               <form onSubmit={onFinish}>
                  <Grid container spacing={2}>
                     <HistoryField name="allergy" label="Allergy" icon={AllergyIcon} value={values.allergy} onChange={handleInputChange} />
                     <HistoryField name="warnings" label="Warnings" icon={WarningIcon} value={values.warnings} onChange={handleInputChange} />
                     <HistoryField name="addiction" label="Addiction" icon={AddictionIcon} value={values.addiction} onChange={handleInputChange} />
                     <HistoryField name="socialHistory" label="Social History" icon={SocialIcon} value={values.socialHistory} onChange={handleInputChange} />
                     <HistoryField name="familyHistory" label="Family History" icon={FamilyIcon} value={values.familyHistory} onChange={handleInputChange} />
                     <HistoryField name="personalHistory" label="Personal History" icon={PersonalIcon} value={values.personalHistory} onChange={handleInputChange} />
                     <HistoryField name="pastMedicalHistory" label="Past Medical History" icon={PastIcon} value={values.pastMedicalHistory} onChange={handleInputChange} />
                     <HistoryField name="obstetrics" label="Obstetrics" icon={ObstetricsIcon} value={values.obstetrics} onChange={handleInputChange} />
                  </Grid>

                  <Box sx={{ mt: 3, textAlign: 'right' }}>
                     <Button 
                        type="submit" variant="contained" 
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        disabled={loading}
                        sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}
                     >
                        Save History
                     </Button>
                  </Box>
               </form>
            </CardContent>
         </Card>

         <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: theme.palette.grey[100] }}><Typography variant="h6" fontWeight="bold">Previous Records</Typography></Box>
            <TableContainer sx={{ maxHeight: 400 }}>
               <Table stickyHeader size="small">
                  <TableHead>
                     <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Entry Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Allergy</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Warnings</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Family History</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Past Medical</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {historyList.map((row: any, index: number) => (
                        <TableRow key={index} hover>
                           <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.entryDateVar}</TableCell>
                           <TableCell>{row.allergy || '---'}</TableCell>
                           <TableCell>{row.warnings || '---'}</TableCell>
                           <TableCell>{row.familyHistory || '---'}</TableCell>
                           <TableCell>{row.pastMedicalHistory || '---'}</TableCell>
                        </TableRow>
                     ))}
                     {historyList.length === 0 && <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>No data</TableCell></TableRow>}
                  </TableBody>
               </Table>
            </TableContainer>
         </Paper>
      </Box>
   );
};

export default PatientHistory;
