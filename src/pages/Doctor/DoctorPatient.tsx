import * as React from "react";
import { useState, useEffect } from "react";
import {
   Box, Divider, TextField, Typography, Grid, Table, TableBody, TableCell, 
   TableContainer, TableHead, TableRow, Card, CircularProgress, 
   TablePagination, Tabs, Tab, Button, Paper, Chip, Avatar, useTheme
} from "@mui/material";
import { 
   Event as EventIcon, 
   PersonSearch as PersonSearchIcon, 
   ArrowForwardIos as ViewIcon,
   LocalHospital as HospitalIcon,
   CheckCircle as SeenIcon,
   AccessTimeFilled as WaitingIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../utils/Url";
import ToastApp from "../../ToastApp";

interface PatientData {
   patientID: string;
   patientNo: string;
   patientCaseID: string;
   patientCaseNo: string;
   patientName: string;
   genderName?: string;
   age?: string;
   isPaid: boolean;
   isDocSeen: boolean;
   tokenNo: string;
   admissionDate: string;
   admNo?: string;
}

type ViewFilter = 'notSeen' | 'seen';

export default function DoctorPatient() {
   const theme = useTheme();
   const navigate = useNavigate();

   const today = dayjs().format('YYYY-MM-DD');
   const [fromDate, setFromDate] = useState<string>(today);
   const [toDate, setToDate] = useState<string>(today);
   const [isName, setName] = useState<string>("");

   const [patientData, setPatientData] = useState<PatientData[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [viewFilter, setViewFilter] = useState<ViewFilter>('notSeen');

   const useRID = JSON.parse(localStorage.getItem('useR_ID') as string || "-2");

   useEffect(() => {
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [fromDate, toDate, isName]);

   const fetchData = async () => {
      setLoading(true);
      setPage(0);

      const payload = {
         "patientCaseID": -1,
         "patientCaseNo": "",
         "patientID": -1,
         "patientNo": "",
         "caseTypeID": 1,
         "patientName": isName || "",
         "fromDate": fromDate ? dayjs(fromDate).format('DD MMM YYYY') : "", 
         "toDate": toDate ? dayjs(toDate).format('DD MMM YYYY') : "",
         "userID": useRID,
         "formID": 1,
         "type": 1
      };

      try {
         const resp = await api.post(`GetPatientForDoctorOPIP`, payload);
         const data = resp?.data?.result;
         if (data && Array.isArray(data)) {
            setPatientData(data as PatientData[]);
         } else {
            setPatientData([]);
         }
      } catch (error) {
         console.error(error);
         setPatientData([]);
      } finally {
         setLoading(false);
      }
   };

   const pateintDetails = (row: any) => {
      navigate(`/Patient/pateintDetails`, { state: row });
   };

   const filteredPatientData = patientData.filter(p => viewFilter === 'seen' ? p.isDocSeen : !p.isDocSeen);
   const currentTableData = filteredPatientData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

   const totalPatients = patientData.length;
   const seenCount = patientData.filter(p => p.isDocSeen).length;
   const notSeenCount = totalPatients - seenCount;

   const StatCard = ({ title, count, icon: Icon, color, bgColor }: any) => (
      <Card elevation={0} sx={{ p: 2, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, bgcolor: bgColor, border: `1px solid ${color}30` }}>
         <Avatar sx={{ bgcolor: color, width: 50, height: 50 }}><Icon fontSize="large" /></Avatar>
         <Box>
            <Typography variant="h4" fontWeight="bold" color={color}>{count}</Typography>
            <Typography variant="subtitle2" color="textSecondary" fontWeight="bold" textTransform="uppercase">{title}</Typography>
         </Box>
      </Card>
   );

   return (
      // FIX HERE: Added pt: 4 (padding-top) so cards don't hide under the header
      <Box sx={{ pt: 4, px: 3, pb: 4, animation: 'fadeIn 0.5s ease-in' }}>
         <ToastApp />

         {/* Stats Section */}
         <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
               <StatCard title="Waiting Patients" count={notSeenCount} icon={WaitingIcon} color={theme.palette.warning.main} bgColor="#fff8e1" />
            </Grid>
            <Grid item xs={12} md={4}>
               <StatCard title="Consultation Done" count={seenCount} icon={SeenIcon} color={theme.palette.success.main} bgColor="#e8f5e9" />
            </Grid>
            <Grid item xs={12} md={4}>
               <StatCard title="Total Appointments" count={totalPatients} icon={HospitalIcon} color={theme.palette.primary.main} bgColor="#e3f2fd" />
            </Grid>
         </Grid>

         {/* Filter & Data Section */}
         <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            
            <Box sx={{ p: 3, bgcolor: '#fbfbfb', borderBottom: '1px solid #eee' }}>
               <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonSearchIcon color="primary" /> Find Patients
               </Typography>
               <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} md={3}>
                     <TextField fullWidth label="From Date" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} size="small" InputProps={{ startAdornment: <EventIcon sx={{ color: 'action.active', mr: 1 }} /> }} />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                     <TextField fullWidth label="To Date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} size="small" InputProps={{ startAdornment: <EventIcon sx={{ color: 'action.active', mr: 1 }} /> }} />
                  </Grid>
                  <Grid item xs={12} sm={4} md={6}>
                     <TextField fullWidth label="Search by Patient Name" value={isName} onChange={(e) => setName(e.target.value)} size="small" placeholder="Start typing name..." />
                  </Grid>
               </Grid>
            </Box>

            <Box sx={{ px: 3, pt: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
               <Tabs value={viewFilter} onChange={(e, v) => { setViewFilter(v); setPage(0); }} textColor="primary" indicatorColor="primary">
                  <Tab label={`WAITING (${notSeenCount})`} value="notSeen" sx={{ fontWeight: 'bold' }} />
                  <Tab label={`COMPLETED (${seenCount})`} value="seen" sx={{ fontWeight: 'bold' }} />
               </Tabs>
            </Box>

            <Box sx={{ p: 2, minHeight: 400 }}>
               {loading ? (
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={300} gap={2}>
                     <CircularProgress size={40} />
                     <Typography color="textSecondary">Loading Appointments...</Typography>
                  </Box>
               ) : (
                  <>
                     <TableContainer>
                        <Table size="medium">
                           <TableHead>
                              <TableRow sx={{ bgcolor: theme.palette.grey[100] }}>
                                 <TableCell sx={{ fontWeight: 'bold' }}>Token</TableCell>
                                 <TableCell sx={{ fontWeight: 'bold' }}>Patient Info</TableCell>
                                 <TableCell sx={{ fontWeight: 'bold' }}>Case details</TableCell>
                                 <TableCell sx={{ fontWeight: 'bold' }} align="center">Payment</TableCell>
                                 <TableCell sx={{ fontWeight: 'bold' }} align="center">Status</TableCell>
                                 <TableCell sx={{ fontWeight: 'bold' }} align="right">Action</TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {currentTableData.length > 0 ? (
                                 currentTableData.map((row, index) => (
                                    <TableRow key={index} hover sx={{ transition: '0.2s', '&:hover': { bgcolor: '#f0f7ff' } }}>
                                       <TableCell>
                                          <Avatar sx={{ bgcolor: viewFilter === 'notSeen' ? 'warning.main' : 'success.main', width: 45, height: 45, fontWeight: 'bold', fontSize: '1.2rem' }}>
                                             {row.tokenNo}
                                          </Avatar>
                                       </TableCell>
                                       <TableCell>
                                          <Typography variant="subtitle2" fontWeight="bold" color="primary.main">{row.patientName}</Typography>
                                          <Typography variant="caption" color="textSecondary">ID: {row.patientNo} | {row.genderName} | {row.age} Yrs</Typography>
                                       </TableCell>
                                       <TableCell>
                                          <Typography variant="body2" fontWeight="500">{row.patientCaseNo}</Typography>
                                          <Typography variant="caption" color="textSecondary">Visit: {row.admissionDate}</Typography>
                                       </TableCell>
                                       <TableCell align="center">
                                          {row.isPaid ? <Chip label="Paid" color="success" size="small" variant="outlined"/> : <Chip label="Unpaid" color="error" size="small" variant="outlined"/>}
                                       </TableCell>
                                       <TableCell align="center">
                                          {row.isDocSeen ? <Chip icon={<SeenIcon/>} label="Consulted" color="success" size="small" sx={{fontWeight:'bold'}}/> : <Chip icon={<WaitingIcon/>} label="Waiting" color="warning" size="small" sx={{fontWeight:'bold'}}/>}
                                       </TableCell>
                                       <TableCell align="right">
                                          <Button 
                                             variant="contained" 
                                             color={viewFilter === 'notSeen' ? 'primary' : 'inherit'}
                                             size="small"
                                             endIcon={<ViewIcon fontSize="small"/>}
                                             onClick={() => pateintDetails(row)}
                                             sx={{ borderRadius: 6, textTransform: 'none', fontWeight: 'bold' }}
                                          >
                                             {viewFilter === 'notSeen' ? 'Consult Now' : 'View File'}
                                          </Button>
                                       </TableCell>
                                    </TableRow>
                                 ))
                              ) : (
                                 <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                       <Typography variant="h6" color="textSecondary">No appointments found for this selection.</Typography>
                                    </TableCell>
                                 </TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </TableContainer>
                     {currentTableData.length > 0 && (
                        <TablePagination
                           rowsPerPageOptions={[10, 25, 50]}
                           component="div"
                           count={filteredPatientData.length}
                           rowsPerPage={rowsPerPage}
                           page={page}
                           onPageChange={(e, newPage) => setPage(newPage)}
                           onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                        />
                     )}
                  </>
               )}
            </Box>
         </Paper>
      </Box>
   );
}
