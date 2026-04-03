import React, { useState } from 'react';
import {
   Box, Grid, Typography, Paper, TextField, Button, Divider, 
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   CircularProgress, Card, CardContent, Avatar, Stack, Chip, useTheme,
   IconButton, Tooltip
} from '@mui/material';
import { 
   ConfirmationNumber as TokenIcon, 
   Update as UpdateIcon,
   Timeline as QueueIcon,
   ArrowForward as JumpIcon
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import api from '../../utils/Url';
import { toast, ToastContainer } from 'react-toastify';
import PatientDetailsCommon from './PatientDetailsCommon';

const NewTokenNo = () => {
   const theme = useTheme();
   const [loading, setLoading] = useState(false);
   const [patientData, setPatientData] = useState<any>(null);
   const [statusData, setStatusData] = useState<any[]>([]);
   
   // Form States
   const [newTokenNo, setNewTokenNo] = useState("");
   const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

   // Fetch Patient Details using Token/No
   const getPatientByTokenNo = async (value: any) => {
      if (!value) return;
      try {
         const payload = {
            userID: -1,
            tokenNo: value?.patientNo || "",
            date: dayjs().toISOString(),
            formID: -1,
            type: 2,
         };
         setLoading(true);
         const res = await api.post('GetPatientByTokenNo', payload);
         if (res.data.isSuccess && res.data.result.length > 0) {
            setPatientData(res.data.result[0]);
            // Automatically check queue for this patient's token
            getTokenNoQueueJump(res.data.result[0].tokenNo);
         } else {
            setPatientData(null);
            setStatusData([]);
            toast.info("No patient found for this token");
         }
      } catch (error) {
         toast.error("Error fetching patient details");
      } finally {
         setLoading(false);
      }
   };

   // Fetch Queue Status
   const getTokenNoQueueJump = async (tokenNo: any) => {
      try {
         const payload = {
            userID: -1,
            tokenNo: tokenNo,
            date: dayjs().toISOString(),
            formID: -1,
            type: 1,
         };
         const res = await api.post('GetTokenNoQueueJump', payload);
         if (res.data.isSuccess) {
            setStatusData(res.data.result1 || []);
         }
      } catch (error) {
         console.error(error);
      }
   };

   const handleUpdateToken = async () => {
      if (!newTokenNo) return toast.warning("Please enter a new token number");
      if (!patientData) return toast.warning("Please select a patient first");

      try {
         // YAHAN PAR DATE FORMAT FIX KIYA GAYA HAI 'YYYY-MM-DD'
         const payload = {
            patientID: patientData.patientID?.toString(),
            patientCaseID: patientData.patientCaseID?.toString(),
            admNo: patientData.admNo?.toString() || "1",
            tokenNo: newTokenNo,
            date: selectedDate?.format('YYYY-MM-DD'), // Changed from 'DD MMM YYYY' to 'YYYY-MM-DD'
            userID: -1,
            formID: -1,
            type: 1,
         };
         
         setLoading(true);
         const res = await api.post('UpdatePatientTokenNo', payload);
         if (res.data.isSuccess) {
            toast.success(res.data.msg || "Token updated successfully");
            setNewTokenNo("");
            getPatientByTokenNo({ patientNo: patientData.patientNo }); // Refresh
         } else {
            toast.error(res.data.msg);
         }
      } catch (error) {
         toast.error("Update failed");
      } finally {
         setLoading(false);
      }
   };

   return (
      <Box sx={{ p: 3, animation: 'fadeIn 0.5s ease-in' }}>
        <ToastContainer />
         
         {/* 1. SEARCH SECTION */}
         <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: '#f0f4ff' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
               Patient Token Management
            </Typography>
            <PatientDetailsCommon
               required={false}
               patData={patientData}
               onChange={(val: any) => getPatientByTokenNo(val)}
            />
         </Paper>

         {loading && !patientData ? (
            <Box textAlign="center" py={10}><CircularProgress /></Box>
         ) : patientData && (
            <Grid container spacing={3}>
               
               {/* 2. PATIENT BIO & UPDATE FORM */}
               <Grid item xs={12} md={6}>
                  <Stack spacing={3}>
                     {/* Patient Card */}
                     <Card sx={{ borderRadius: 4, borderLeft: `8px solid ${theme.palette.primary.main}`, boxShadow: 3 }}>
                        <CardContent>
                           <Box display="flex" alignItems="center" gap={2} mb={2}>
                              <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main', fontSize: 24, fontWeight: 'bold' }}>
                                 {patientData.patientName?.charAt(0)}
                              </Avatar>
                              <Box>
                                 <Typography variant="h5" fontWeight="bold">{patientData.patientName}</Typography>
                                 <Typography variant="body2" color="textSecondary">ID: {patientData.patientNo} | Case: {patientData.patientCaseNo}</Typography>
                              </Box>
                           </Box>
                           <Divider />
                           <Grid container spacing={2} sx={{ mt: 1 }}>
                              <Grid item xs={6}>
                                 <Typography variant="caption" color="textSecondary">CURRENT TOKEN</Typography>
                                 <Typography variant="h6" color="secondary" fontWeight="bold">#{patientData.tokenNo}</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                 <Typography variant="caption" color="textSecondary">DOCTOR</Typography>
                                 <Typography variant="body1" fontWeight="500">{patientData.doctorName || 'N/A'}</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                 <Typography variant="caption" color="textSecondary">ADMISSION NO</Typography>
                                 <Typography variant="body1">{patientData.admNo}</Typography>
                              </Grid>
                           </Grid>
                        </CardContent>
                     </Card>

                     {/* Update Form */}
                     <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <UpdateIcon color="primary" /> Assign New Token
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                           <Grid item xs={12} sm={6}>
                              <TextField 
                                 fullWidth size="small" label="New Token Number" 
                                 value={newTokenNo} onChange={(e) => setNewTokenNo(e.target.value)}
                                 InputProps={{ startAdornment: <TokenIcon sx={{ mr: 1, color: 'gray' }} /> }}
                              />
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                 <DatePicker 
                                    label="Token Date" value={selectedDate} 
                                    onChange={setSelectedDate}
                                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                 />
                              </LocalizationProvider>
                           </Grid>
                           <Grid item xs={12}>
                              <Button 
                                 fullWidth variant="contained" size="large"
                                 onClick={handleUpdateToken} disabled={loading}
                                 startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                 sx={{ borderRadius: 2 }}
                              >
                                 Update & Print Token
                              </Button>
                           </Grid>
                        </Grid>
                     </Paper>
                  </Stack>
               </Grid>

               {/* 3. TOKEN STATUS / QUEUE LIST */}
               <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                     <Box sx={{ p: 2, bgcolor: theme.palette.grey[100], display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <QueueIcon /> Token Queue Status
                        </Typography>
                        <Chip label={`${statusData.length} Locations`} size="small" color="primary" />
                     </Box>
                     <TableContainer sx={{ flexGrow: 1 }}>
                        <Table stickyHeader size="small">
                           <TableHead>
                              <TableRow>
                                 <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Location Name</TableCell>
                                 <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="center">Token Number</TableCell>
                                 <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">Action</TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {statusData.length > 0 ? (
                                 statusData.map((row: any, i: number) => (
                                    <TableRow key={i} hover>
                                       <TableCell sx={{ fontWeight: '500' }}>{row.locName}</TableCell>
                                       <TableCell align="center">
                                          <Chip label={row.tokenNo} color="secondary" variant="outlined" sx={{ fontWeight: 'bold', minWidth: 60 }} />
                                       </TableCell>
                                       <TableCell align="right">
                                          <Tooltip title="Jump to this location">
                                             <IconButton size="small" color="primary">
                                                <JumpIcon fontSize="small" />
                                             </IconButton>
                                          </Tooltip>
                                       </TableCell>
                                    </TableRow>
                                 ))
                              ) : (
                                 <TableRow><TableCell colSpan={3} align="center" sx={{ py: 10 }}>No live queue data found</TableCell></TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </TableContainer>
                     <Box sx={{ p: 1.5, bgcolor: '#fff9c4', textAlign: 'center' }}>
                        <Typography variant="caption" color="warning.dark" fontWeight="bold">
                           * Status updates in real-time based on counter activity
                        </Typography>
                     </Box>
                  </Paper>
               </Grid>

            </Grid>
         )}
      </Box>
   );
};

// Internal SaveIcon Fallback
const SaveIcon = () => <UpdateIcon />;

export default NewTokenNo;
