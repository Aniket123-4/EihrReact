import React, { useEffect, useState } from 'react';
import {
   Box, Grid, Typography, Paper, TextField, Button, Divider, 
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   CircularProgress, Card, CardContent, Autocomplete, Chip, Avatar, useTheme
} from '@mui/material';
import { 
   PersonAdd as ReferralIcon, 
   MedicalServices as DoctorIcon,
   Business as SectionIcon,
   Science as LabIcon,
   Save as SaveIcon,
   History as HistoryIcon,
   CheckCircle as CheckIcon
} from '@mui/icons-material';
import api from '../../../utils/Url';
import { toast } from 'react-toastify';

const ReferralDoctor = ({ patientDetails = {}, patientCaseID, onSaveSuccess, admNo }: any) => {
   const theme = useTheme();
   const [loading, setLoading] = useState(false);
   const [sections, setSections] = useState<any[]>([]);
   const [doctorList, setDoctorList] = useState<any[]>([]);
   const [invParameters, setInvParameters] = useState<any[]>([]);

   // Form State
   const [formValues, setFormValues] = useState({
      sectionID: null,
      doctorID: null,
      invParameterID: null
   });

   // History Records from result9
   const referralHistory = patientDetails?.result9 || [];

   useEffect(() => {
      fetchInitialData();
   }, []);

   // 1. Initial Data Fetch (Sections & Parameters)
   const fetchInitialData = async () => {
      try {
         setLoading(true);
         // Fetch Sections
         const sectionRes = await api.post('/MasterForm/GetSection', { "sectionID": -1, "type": 1 });
         if (sectionRes.data.isSuccess) {
            setSections(sectionRes.data.result.map((s: any) => ({ label: s.sectionName, value: s.sectionID })));
         }

         // Fetch Inv Parameters
         const invRes = await api.post('MasterForm/GetInvestigationParameter', {"invParameterID":-1,"invGroupID":-1,"isActive":-1,"type":2});
         if (invRes.data.isSuccess) {
            setInvParameters(invRes.data.result.map((i: any) => ({ label: i.invName, value: i.invParameterID })));
         }
      } catch (e) {
         console.error(e);
      } finally {
         setLoading(false);
      }
   };

   // 2. Fetch Doctors based on selected Section (Cascading)
   const handleSectionChange = async (event: any, newValue: any) => {
      setFormValues({ ...formValues, sectionID: newValue?.value, doctorID: null });
      if (!newValue) {
         setDoctorList([]);
         return;
      }
      try {
         // Query params for GetUserList
         const res = await api.get(`/Login/GetUserList?CommonID=${newValue.value}&Type=3`);
         if (res.data.isSuccess || res.data) {
            const list = (res.data.result || res.data?.data).map((d: any) => ({ label: d.userName, value: d.userID }));
            setDoctorList(list);
         }
      } catch (e) {
         console.error(e);
      }
   };

   // 3. Save Referral Logic
   const handleSave = async () => {
      if (!formValues.doctorID) {
         toast.warning("Please select a doctor to refer");
         return;
      }

      setLoading(true);
      try {
         // AAPKE EXACT PAYLOAD STRUCTURE KE ANUSAR:
         const payload = {
            "patientCaseID": patientCaseID.toString(),
            "admNo": admNo.toString(),
            "col1": formValues.doctorID.toString(), // Selected Doctor ID
            "col2": formValues.invParameterID ? formValues.invParameterID.toString() : "0", // Selected Parameter or 0
            "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", 
            "col8": "", "col9": "", "col10": "", "col11": "", "col12": "", 
            "col13": "", "col14": "", "col15": "", "col16": "", "col17": "", 
            "col18": "", "col19": "", "col20": "", "col21": "", "col22": "",
            "isForDelete": false,
            "lstType_DocPatient": [
               {
                  "col1": "", "col2": "", "col3": "", "col4": "", "col5": "", 
                  "col6": "", "col7": "", "col8": "", "col9": "", "col10": "", 
                  "col11": "", "col12": "", "col13": "", "col14": "", "col15": ""
               }
            ],
            "lstType_Patient": [
               {
                  "col1": "", "col2": "", "col3": "", "col4": "", "col5": "", 
                  "col6": "", "col7": "", "col8": "", "col9": "", "col10": "", 
                  "col11": "", "col12": "", "col13": "", "col14": "", "col15": ""
               }
            ],
            "userID": "-2", // As per your request
            "formID": -1,   // As per your request
            "type": 12      // As per your request
         };

         console.log("Sending Referral Payload:", payload);

         const response = await api.post('/AddDelPatientForDoctorOPIP', payload);
         
         if (response.data.isSuccess) {
            toast.success(response.data.msg || "Referral Saved Successfully");
            // Form reset
            setFormValues({ sectionID: null, doctorID: null, invParameterID: null });
            // Refresh main page
            onSaveSuccess({ tab: "REFERAL_DOCTOR" });
         } else {
            toast.error(response.data.msg || "Failed to save referral");
         }
      } catch (error) {
         console.error("Referral Error:", error);
         toast.error("Error connecting to server");
      } finally {
         setLoading(false);
      }
   };

   return (
      <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
         
         {/* ENTRY FORM SECTION */}
         <Card sx={{ borderRadius: 4, mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                     <ReferralIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">New Referral / Consultation</Typography>
               </Box>
               
               <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                     <Autocomplete
                        options={sections}
                        value={sections.find(s => s.value === formValues.sectionID) || null}
                        onChange={handleSectionChange}
                        renderInput={(params) => (
                           <TextField {...params} label="Select Section" size="small" 
                              InputProps={{ ...params.InputProps, startAdornment: <SectionIcon color="action" sx={{ mr: 1 }} /> }}
                           />
                        )}
                     />
                  </Grid>

                  <Grid item xs={12} md={4}>
                     <Autocomplete
                        options={doctorList}
                        disabled={!formValues.sectionID}
                        value={doctorList.find(d => d.value === formValues.doctorID) || null}
                        onChange={(e, v) => setFormValues({ ...formValues, doctorID: v?.value })}
                        renderInput={(params) => (
                           <TextField {...params} label="Select Doctor" size="small" 
                              InputProps={{ ...params.InputProps, startAdornment: <DoctorIcon color="action" sx={{ mr: 1 }} /> }}
                           />
                        )}
                     />
                  </Grid>

                  <Grid item xs={12} md={4}>
                     <Autocomplete
                        options={invParameters}
                        value={invParameters.find(i => i.value === formValues.invParameterID) || null}
                        onChange={(e, v) => setFormValues({ ...formValues, invParameterID: v?.value })}
                        renderInput={(params) => (
                           <TextField {...params} label="Service / Parameter" size="small" 
                              InputProps={{ ...params.InputProps, startAdornment: <LabIcon color="action" sx={{ mr: 1 }} /> }}
                           />
                        )}
                     />
                  </Grid>
               </Grid>

               <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <Button 
                     variant="contained" 
                     color="secondary"
                     startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                     onClick={handleSave}
                     disabled={loading}
                     sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}
                  >
                     Save Referral
                  </Button>
               </Box>
            </CardContent>
         </Card>

         {/* HISTORY TABLE SECTION */}
         <Paper sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Box sx={{ p: 2, bgcolor: theme.palette.grey[100], display: 'flex', alignItems: 'center', gap: 1 }}>
               <HistoryIcon color="action" />
               <Typography variant="h6" fontWeight="bold">Referral History</Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 400 }}>
               <Table stickyHeader size="small">
                  <TableHead>
                     <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#eee' }}>Doctor Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#eee' }}>Department</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#eee' }}>Inv Parameter</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#eee' }}>First Doc</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#eee' }}>Entered By</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {referralHistory.length > 0 ? (
                        referralHistory.map((row: any, index: number) => (
                           <TableRow key={index} hover>
                              <TableCell>
                                 <Typography variant="body2" fontWeight="bold" color="primary">
                                    {row.doctorName}
                                 </Typography>
                              </TableCell>
                              <TableCell>{row.sectionName || '---'}</TableCell>
                              <TableCell>{row.invParameterName || '---'}</TableCell>
                              <TableCell>
                                 {row.isFirstDoc ? (
                                    <Chip icon={<CheckIcon />} label="Yes" color="success" size="small" variant="outlined" />
                                 ) : (
                                    <Typography variant="caption">No</Typography>
                                 )}
                              </TableCell>
                              <TableCell>{row.enterBYName}</TableCell>
                           </TableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell colSpan={5} align="center" sx={{ py: 3 }}>No referral records found.</TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </TableContainer>
         </Paper>
      </Box>
   );
};

export default ReferralDoctor;
