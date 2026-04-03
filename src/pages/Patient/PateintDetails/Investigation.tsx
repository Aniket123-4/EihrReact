import React, { useEffect, useState, useMemo } from 'react';
import {
   Box, Grid, Typography, Paper, TextField, Button, IconButton, 
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   Divider, CircularProgress, Card, Chip, InputAdornment, 
   List, ListItem, ListItemText, ListItemIcon, Collapse, Checkbox, Stack
} from '@mui/material';
import { 
   Science as LabIcon, 
   ExpandLess, ExpandMore, 
   Search as SearchIcon,
   Delete as DeleteIcon,
   AddCircle as AddIcon,
   History as HistoryIcon,
   AccountBalanceWallet as RateIcon,
   Save as SaveIcon
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import api from '../../../utils/Url';
import { toast } from 'react-toastify';

const Investigation = ({ patientDetails = {}, patientCaseID, onSaveSuccess, admNo }: any) => {
   const [loading, setLoading] = useState(false);
   const [groups, setGroups] = useState<any[]>([]);
   const [openGroup, setOpenGroup] = useState<string | null>(null);
   const [parameters, setParameters] = useState<{ [key: string]: any[] }>({});
   const [selectedTests, setSelectedTests] = useState<any[]>([]);
   const [observationDate, setObservationDate] = useState<Dayjs | null>(dayjs());
   
   // result6 is history
   const historyData = patientDetails?.result6 || [];

   useEffect(() => {
      fetchGroups();
   }, []);

   const fetchGroups = async () => {
      try {
         const res = await api.post('MasterForm/api/GetInvGroup', { "invGroupID": -1, "type": 1 });
         if (res.data.isSuccess) setGroups(res.data.result);
      } catch (e) { console.error(e); }
   };

   const fetchParameters = async (groupId: string) => {
      if (parameters[groupId]) return; // Already loaded
      setLoading(true);
      try {
         const res = await api.post('MasterForm/api/GetInvParameterMasterList', { 
            "invGroupID": parseInt(groupId), "type": 1 
         });
         if (res.data.isSuccess) {
            setParameters(prev => ({ ...prev, [groupId]: res.data.result }));
         }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
   };

   const handleGroupClick = (groupId: string) => {
      setOpenGroup(openGroup === groupId ? null : groupId);
      fetchParameters(groupId);
   };

   const toggleTestSelection = (test: any) => {
      const isExist = selectedTests.find(t => t.invParameterID === test.invParameterID);
      if (isExist) {
         setSelectedTests(selectedTests.filter(t => t.invParameterID !== test.invParameterID));
      } else {
         setSelectedTests([...selectedTests, test]);
      }
   };

   const handleSave = async () => {
      if (selectedTests.length === 0) {
         toast.warning("Please select at least one test");
         return;
      }
      setLoading(true);
      try {
         const payload = {
            "patientCaseID": patientCaseID,
            "admNo": admNo,
            "col7": selectedTests.map(t => t.invParameterID).join(','),
            "col21": observationDate?.format('DD MMM YYYY'),
            "isForDelete": false,
            "type": 5
         };
         const res = await api.post('/AddDelPatientForDoctorOPIP', payload);
         if (res.data.isSuccess) {
            toast.success("Investigation prescribed");
            setSelectedTests([]);
            onSaveSuccess({ tab: "INVESTIGATION" });
         }
      } catch (e) { toast.error("Error saving investigation"); }
      finally { setLoading(false); }
   };

   const handleDelete = async (row: any) => {
      if (!window.confirm("Delete this test?")) return;
      try {
         const payload = { 
            "patientCaseID": patientCaseID, 
            "admNo": row.admNo, 
            "col4": row.admNo, 
            "col5": row.invSerialNo, 
            "col7": row.invParameterID, 
            "isForDelete": true, 
            "type": 5 
         };
         await api.post('/AddDelPatientForDoctorOPIP', payload);
         onSaveSuccess({ tab: "INVESTIGATION" });
      } catch (e) { console.error(e); }
   };

   const totalCost = selectedTests.reduce((acc, curr) => acc + (curr.invRate || 0), 0);

   return (
      <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
         <Grid container spacing={3}>
            
            {/* LEFT: Investigation Catalog */}
            <Grid item xs={12} md={5}>
               <Paper elevation={3} sx={{ borderRadius: 4, height: 600, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                     <Typography variant="h6" fontWeight="bold">Investigation Catalog</Typography>
                  </Box>
                  
                  <Box sx={{ p: 2 }}>
                     <TextField 
                        fullWidth size="small" placeholder="Search Group or Test..." 
                        InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'gray' }} /> }}
                     />
                  </Box>

                  <List sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}>
                     {groups.map((group) => (
                        <React.Fragment key={group.invGroupID}>
                           <ListItem button onClick={() => handleGroupClick(group.invGroupID)} sx={{ borderRadius: 2, mb: 0.5 }}>
                              <ListItemIcon><LabIcon color="primary" /></ListItemIcon>
                              <ListItemText primary={group.invGroupName} primaryTypographyProps={{ fontWeight: '600' }} />
                              {openGroup === group.invGroupID ? <ExpandLess /> : <ExpandMore />}
                           </ListItem>
                           
                           <Collapse in={openGroup === group.invGroupID} timeout="auto" unmountOnExit>
                              <List component="div" disablePadding sx={{ pl: 4 }}>
                                 {parameters[group.invGroupID]?.map((test) => (
                                    <ListItem 
                                       key={test.invParameterID} 
                                       button 
                                       onClick={() => toggleTestSelection(test)}
                                       sx={{ borderLeft: '2px solid #ddd', my: 0.2 }}
                                    >
                                       <Checkbox 
                                          size="small" 
                                          checked={!!selectedTests.find(t => t.invParameterID === test.invParameterID)} 
                                       />
                                       <ListItemText 
                                          primary={test.invName} 
                                          secondary={`Rate: ₹${test.invRate}`}
                                       />
                                    </ListItem>
                                 ))}
                                 {loading && <Box sx={{ textAlign: 'center', p: 1 }}><CircularProgress size={20} /></Box>}
                              </List>
                           </Collapse>
                        </React.Fragment>
                     ))}
                  </List>
               </Paper>
            </Grid>

            {/* RIGHT: Selection & History */}
            <Grid item xs={12} md={7}>
               <Stack spacing={3}>
                  
                  {/* Selected Bucket */}
                  <Paper elevation={3} sx={{ p: 3, borderRadius: 4, minHeight: 250 }}>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">Selected Tests ({selectedTests.length})</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                           <DatePicker 
                              label="Date" value={observationDate} 
                              onChange={(v) => setObservationDate(v)}
                              slotProps={{ textField: { size: 'small' } }} 
                           />
                        </LocalizationProvider>
                     </Box>
                     
                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {selectedTests.map((t) => (
                           <Chip 
                              key={t.invParameterID} label={`${t.invName} (₹${t.invRate})`} 
                              onDelete={() => toggleTestSelection(t)} color="primary" variant="outlined"
                           />
                        ))}
                        {selectedTests.length === 0 && <Typography color="textSecondary">No tests selected yet.</Typography>}
                     </Box>

                     <Divider sx={{ mb: 2 }} />
                     
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <RateIcon color="action" />
                           <Typography variant="h6">Total: <b>₹{totalCost}</b></Typography>
                        </Box>
                        <Button 
                           variant="contained" startIcon={<SaveIcon />} 
                           onClick={handleSave} disabled={loading || selectedTests.length === 0}
                        >
                           Prescribe Tests
                        </Button>
                     </Box>
                  </Paper>

                  {/* History Table */}
                  <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                     <Box sx={{ p: 2, bgcolor: '#f5f5f5', display: 'flex', gap: 1, alignItems: 'center' }}>
                        <HistoryIcon />
                        <Typography variant="h6" fontWeight="bold">Previous Investigations</Typography>
                     </Box>
                     <TableContainer sx={{ maxHeight: 300 }}>
                        <Table stickyHeader size="small">
                           <TableHead>
                              <TableRow>
                                 <TableCell sx={{ fontWeight: 'bold', bgcolor: '#eee' }}>Date</TableCell>
                                 <TableCell sx={{ fontWeight: 'bold', bgcolor: '#eee' }}>Test Name</TableCell>
                                 <TableCell sx={{ fontWeight: 'bold', bgcolor: '#eee' }}>Result</TableCell>
                                 <TableCell sx={{ fontWeight: 'bold', bgcolor: '#eee' }} align="center">Action</TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {historyData.map((row: any, i: number) => (
                                 <TableRow key={i} hover>
                                    <TableCell>{row.invParameterDateVar}</TableCell>
                                    <TableCell fontWeight="bold">{row.invParameterName}</TableCell>
                                    <TableCell>
                                       {row.invParameterResult ? <Chip label={row.invParameterResult} size="small" color="info" /> : 'Pending'}
                                    </TableCell>
                                    <TableCell align="center">
                                       <IconButton color="error" size="small" onClick={() => handleDelete(row)}>
                                          <DeleteIcon fontSize="small" />
                                       </IconButton>
                                    </TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </TableContainer>
                  </Paper>
               </Stack>
            </Grid>
         </Grid>
      </Box>
   );
};

export default Investigation;
