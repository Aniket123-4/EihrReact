import React, { useState, useMemo } from 'react';
import {
   Box, Grid, Typography, Paper, Divider, Avatar, useTheme, 
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
   Chip, TextField, InputAdornment
} from '@mui/material';
import {
   Person as PersonIcon, Badge as BadgeIcon, EventNote as CaseIcon,
   History as AgeIcon, Domain as SectionIcon, MedicalServices as DoctorIcon,
   VerifiedUser as InsuranceIcon, Search as SearchIcon, Event as DateIcon
} from '@mui/icons-material';

const GeneralInformation = ({ apiData }: any) => {
   const theme = useTheme();
   const [searchTerm, setSearchTerm] = useState('');

   // API Data extraction
   const mainInfo = apiData?.result1?.[0] || {};
   const visitHistory = apiData?.result11 || [];

   // Filter Logic for Visit History
   const filteredHistory = useMemo(() => {
      return visitHistory.filter((visit: any) => {
         const searchStr = searchTerm.toLowerCase();
         return (
            visit.doctorName?.toLowerCase().includes(searchStr) ||
            visit.patientCaseNo?.toLowerCase().includes(searchStr) ||
            visit.sectionName?.toLowerCase().includes(searchStr) ||
            visit.displayName?.toLowerCase().includes(searchStr)
         );
      });
   }, [searchTerm, visitHistory]);

   const InfoBox = ({ icon: Icon, label, value, color }: any) => (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
         <Avatar sx={{ bgcolor: color || theme.palette.primary.light, mr: 2, width: 40, height: 40 }}>
            <Icon sx={{ color: color ? '#fff' : theme.palette.primary.main, fontSize: 20 }} />
         </Avatar>
         <Box>
            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: '700' }}>
               {label}
            </Typography>
            <Typography variant="body2" fontWeight="600" color="textPrimary">
               {value || '---'}
            </Typography>
         </Box>
      </Box>
   );

   return (
      <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
         <Grid container spacing={3}>
            
            {/* LEFT SIDE: Patient Summary Cards */}
            <Grid item xs={12} md={4}>
               <Stack spacing={3}>
                  {/* Basic Bio Card */}
                  <Paper elevation={3} sx={{ p: 3, borderRadius: 3, borderLeft: `6px solid ${theme.palette.primary.main}` }}>
                     <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                        Patient Bio-Data
                     </Typography>
                     <Divider sx={{ mb: 2 }} />
                     <InfoBox icon={PersonIcon} label="Full Name" value={mainInfo.patNameTitle} />
                     <InfoBox icon={BadgeIcon} label="Patient No" value={mainInfo.patientNo} />
                     <InfoBox icon={AgeIcon} label="Age" value={`${mainInfo.age} Years`} />
                     <InfoBox icon={InsuranceIcon} label="Insurance" value={mainInfo.insuranceComp || 'Private/Cash'} />
                  </Paper>

                  {/* Case Context Card */}
                  <Paper elevation={3} sx={{ p: 3, borderRadius: 3, borderLeft: `6px solid ${theme.palette.secondary.main}` }}>
                     <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="secondary">
                        Current Case Info
                     </Typography>
                     <Divider sx={{ mb: 2 }} />
                     <InfoBox icon={CaseIcon} label="Current Case No" value={mainInfo.patientCaseNo} color={theme.palette.secondary.main} />
                     <InfoBox icon={SectionIcon} label="Section" value={mainInfo.sectionName || 'N/A'} color={theme.palette.secondary.main} />
                     <InfoBox icon={DoctorIcon} label="Consultant" value={mainInfo.doctorName || 'Not Assigned'} color={theme.palette.secondary.main} />
                  </Paper>
               </Stack>
            </Grid>

            {/* RIGHT SIDE: Scrollable Visit History with Filter */}
            <Grid item xs={12} md={8}>
               <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* History Header & Search */}
                  <Box sx={{ p: 2, bgcolor: theme.palette.grey[50], display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                     <Typography variant="h6" fontWeight="bold">
                        Visit History 
                        <Chip label={filteredHistory.length} size="small" sx={{ ml: 1, bgcolor: theme.palette.primary.main, color: '#fff' }} />
                     </Typography>
                     
                     <TextField
                        size="small"
                        placeholder="Search history..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ bgcolor: 'white', width: { xs: '100%', sm: 250 } }}
                        InputProps={{
                           startAdornment: (
                              <InputAdornment position="start">
                                 <SearchIcon fontSize="small" />
                              </InputAdornment>
                           ),
                        }}
                     />
                  </Box>

                  <Divider />

                  {/* Scrollable Table Container */}
                  <TableContainer sx={{ maxHeight: 450, overflowY: 'auto' }}>
                     <Table stickyHeader size="small">
                        <TableHead>
                           <TableRow>
                              <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 'bold' }}>Visit Date & Time</TableCell>
                              <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 'bold' }}>Case No</TableCell>
                              <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 'bold' }}>Doctor</TableCell>
                              <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 'bold' }}>Section</TableCell>
                              <TableCell sx={{ bgcolor: theme.palette.grey[200], fontWeight: 'bold', textAlign: 'center' }}>Status</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {filteredHistory.length > 0 ? (
                              filteredHistory.map((visit: any, index: number) => (
                                 <TableRow key={index} hover>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <DateIcon fontSize="small" color="disabled" />
                                          <span dangerouslySetInnerHTML={{ __html: visit.displayName.split('</BR>')[0] }} />
                                       </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: '500' }}>{visit.patientCaseNo}</TableCell>
                                    <TableCell>{visit.doctorName || '---'}</TableCell>
                                    <TableCell>{visit.sectionName === "0" ? "General" : visit.sectionName}</TableCell>
                                    <TableCell align="center">
                                       {visit.isCurrent ? (
                                          <Chip label="Current" size="small" color="success" sx={{ fontSize: '10px', height: 20 }} />
                                       ) : (
                                          <Chip label="Visited" size="small" variant="outlined" sx={{ fontSize: '10px', height: 20 }} />
                                       )}
                                    </TableCell>
                                 </TableRow>
                              ))
                           ) : (
                              <TableRow>
                                 <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                    <Typography color="textSecondary">No visits found matching your search.</Typography>
                                 </TableCell>
                              </TableRow>
                           )}
                        </TableBody>
                     </Table>
                  </TableContainer>

                  {/* Footer Info */}
                  <Box sx={{ p: 1.5, bgcolor: theme.palette.grey[50], textAlign: 'right' }}>
                     <Typography variant="caption" color="textSecondary">
                        * Use the search bar to filter by Doctor or Case Number.
                     </Typography>
                  </Box>
               </Paper>
            </Grid>

         </Grid>
      </Box>
   );
};

// Simple Stack component fallback if not imported
const Stack = ({ children, spacing }: any) => (
   <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
      {children}
   </Box>
);

export default GeneralInformation;
