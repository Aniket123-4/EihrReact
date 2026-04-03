import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import {
   Box, Grid, Typography, Paper, TextField, Button, Avatar, 
   CircularProgress, Autocomplete, Chip, Divider, Stack, useTheme,
   InputAdornment
} from '@mui/material';
import { 
   Search as SearchIcon, 
   Badge as BadgeIcon, 
   PersonSearch as PersonSearchIcon,
   Bloodtype as BloodIcon,
   Wc as GenderIcon,
   Phone as PhoneIcon,
   Home as HomeIcon,
   Emergency as EmergencyIcon
} from '@mui/icons-material';
import api from '../../utils/Url';
import { toast } from 'react-toastify';

const PatientDetailsCommon = forwardRef((props: any, ref) => {
   const theme = useTheme();
   const [loading, setLoading] = useState(false);
   
   // Search & Input States
   const [searchList, setSearchList] = useState<any[]>([]);
   const [patientNoInput, setPatientNoInput] = useState<string>("");

   // Patient Data States
   const [patientData, setPatientData] = useState<any>(null);
   const [patientPhoto, setPatientPhoto] = useState<string | null>(null);

   // Dropdown States for Case and Admission
   const [caseList, setCaseList] = useState<any[]>([]);
   const [selectedCase, setSelectedCase] = useState<any>(null);
   
   const [admList, setAdmList] = useState<any[]>([]);
   const [selectedAdm, setSelectedAdm] = useState<any>(null);

   useEffect(() => {
      fetchPatientSearchList("");
   }, []);

   // Expose functions to parent if needed via ref
   useImperativeHandle(ref, () => ({
      resetData: () => {
         setPatientData(null);
         setPatientPhoto(null);
         setPatientNoInput("");
         setSelectedCase(null);
         setSelectedAdm(null);
      }
   }));

   // 1. Fetch Search Autocomplete List
   const fetchPatientSearchList = async (searchText: string) => {
      try {
         const payload = { "patientNo": "", "patientName": searchText, "userID": -1, "formID": -1, "type": 1 };
         const res = await api.post('FnGetPatientSearch', payload);
         if (res.data?.result?.length > 0) {
            setSearchList(res.data.result.map((item: any) => ({
               label: item.patientName, 
               value: item.patientNo 
            })));
         }
      } catch (error) {
         console.error(error);
      }
   };

   // 2. Fetch Full Patient Details (On Submit or Autocomplete Select)
   const fetchPatientDetails = async (patNoToSearch: string) => {
      if (!patNoToSearch) return;
      setLoading(true);
      try {
         const payload = { patientNo: patNoToSearch, patientID: -1, userID: -2, formID: 1, type: 1 };
         const res = await api.post('GetPatientHeader', payload);
         
         if (res.data?.isSuccess && res.data?.result1?.length > 0) {
            const rawData = res.data.result1[0];
            setPatientData(rawData);
            
            // Photo handling
            if (res.data.result2?.length > 0 && res.data.result2[0].photo) {
               setPatientPhoto(res.data.result2[0].photo);
            } else {
               setPatientPhoto(null);
            }

            // Case Dropdown handling
            const cases = res.data.result3?.map((c: any) => ({ label: c.patientCaseNo, value: c.patientCaseID })) || [];
            setCaseList(cases);

            if (cases.length > 0) {
               setSelectedCase(cases[0]);
               fetchAdmissionNumbers(cases[0].value, rawData);
            } else {
               // Emit without case if none found
               emitToParent(rawData, null, null);
            }
         } else {
            toast.error("NO PATIENT FOUND");
            setPatientData(null);
            setPatientPhoto(null);
            emitToParent(null, null, null);
         }
      } catch (error) {
         toast.error("Error fetching patient details");
      } finally {
         setLoading(false);
      }
   };

   // 3. Fetch Admission Numbers based on Case
   const fetchAdmissionNumbers = async (caseId: string, currentPatData: any) => {
      try {
         const payload = { "patientCaseID": caseId.toString(), "patientCaseNo": 1, "userID": -1, "formID": -1, "type": 1 };
         const res = await api.post('GetPatientVisitNo', payload);
         
         if (res.data?.result?.length > 0) {
            const adms = res.data.result.map((item: any) => ({ label: item.admNo, value: item.rowID }));
            setAdmList(adms);
            
            // Auto select latest admission
            const latestAdm = adms[adms.length - 1];
            setSelectedAdm(latestAdm);
            
            // Emit final merged data to parent
            emitToParent(currentPatData, caseId, latestAdm.label);
         } else {
            setAdmList([]);
            setSelectedAdm(null);
            emitToParent(currentPatData, caseId, null);
         }
      } catch (error) {
         console.error(error);
      }
   };

   // Change Handlers
   const handleCaseChange = (e: any, newValue: any) => {
      setSelectedCase(newValue);
      setSelectedAdm(null);
      if (newValue) {
         fetchAdmissionNumbers(newValue.value, patientData);
      }
   };

   const handleAdmChange = (e: any, newValue: any) => {
      setSelectedAdm(newValue);
      if (newValue) {
         emitToParent(patientData, selectedCase?.value, newValue.label);
      }
   };

   const emitToParent = (data: any, caseID: any, admNo: any) => {
      if (props.onChange && data) {
         props.onChange({
            ...data,
            patientCaseID: caseID,
            admNo: admNo
         });
      } else if (props.onChange && !data) {
         props.onChange(null);
      }
   };

   const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      fetchPatientDetails(patientNoInput);
   };

   // Reusable Label Component
   const InfoLabel = ({ label, value }: any) => (
      <Box sx={{ mb: 1.5 }}>
         <Typography variant="caption" color="textSecondary" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
            {label}
         </Typography>
         <Typography variant="body2" fontWeight="600" color="textPrimary">
            {value || '---'}
         </Typography>
      </Box>
   );

   return (
      <Box sx={{ mb: 3 }}>
         {/* 1. SEARCH BAR SECTION */}
         <Paper elevation={3} sx={{ p: 2, borderRadius: 3, mb: 2, bgcolor: '#fdfdfd', borderTop: `4px solid ${theme.palette.primary.main}` }}>
            <form onSubmit={handleSearchSubmit}>
               <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={5} md={4}>
                     <Autocomplete
                        options={searchList}
                        freeSolo
                        onInputChange={(e, val) => fetchPatientSearchList(val)}
                        onChange={(e, val: any) => {
                           if (val?.value) {
                              setPatientNoInput(val.value);
                              fetchPatientDetails(val.value);
                           }
                        }}
                        renderInput={(params) => (
                           <TextField {...params} label="Search Patient Name" size="small" 
                              InputProps={{ ...params.InputProps, startAdornment: <PersonSearchIcon sx={{ color: 'action.active', mr: 1, ml: 1 }} /> }}
                           />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                     <TextField 
                        fullWidth size="small" label="Patient No" 
                        value={patientNoInput} onChange={(e) => setPatientNoInput(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><BadgeIcon color="primary"/></InputAdornment> }}
                     />
                  </Grid>
                  <Grid item xs={12} sm={3} md={2}>
                     <Button 
                        type="submit" fullWidth variant="contained" 
                        disabled={loading || !patientNoInput}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                        sx={{ borderRadius: 2 }}
                     >
                        Search
                     </Button>
                  </Grid>
               </Grid>
            </form>
         </Paper>

         {/* 2. PATIENT ID CARD & CASE SELECTION */}
         {patientData && (
            <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden', animation: 'fadeIn 0.5s' }}>
               <Grid container>
                  {/* Left Side: Identity */}
                  <Grid item xs={12} md={4} sx={{ bgcolor: 'primary.main', color: 'white', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                     <Avatar 
                        src={patientPhoto ? `data:image/png;base64,${patientPhoto}` : undefined}
                        sx={{ width: 100, height: 100, mb: 2, border: '4px solid rgba(255,255,255,0.3)', fontSize: 36, fontWeight: 'bold' }}
                     >
                        {!patientPhoto && patientData.candName?.charAt(0)}
                     </Avatar>
                     <Typography variant="h5" fontWeight="bold" gutterBottom>{patientData.candName}</Typography>
                     <Chip label={`ID: ${patientData.patientNo}`} sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold', mb: 2 }} />
                     
                     <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" gap={1}>
                        <Chip icon={<BloodIcon sx={{color:'white'}}/>} label={patientData.bloodGroup || 'N/A'} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                        <Chip icon={<GenderIcon sx={{color:'white'}}/>} label={patientData.genderName} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                     </Stack>
                  </Grid>

                  {/* Right Side: Details & Dropdowns */}
                  <Grid item xs={12} md={8} sx={{ p: 3, bgcolor: '#fafafa' }}>
                     {/* Case & Admission Selection Highlighted */}
                     <Box sx={{ mb: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 2, border: '1px dashed #90caf9' }}>
                        <Grid container spacing={2}>
                           <Grid item xs={12} sm={6}>
                              <Autocomplete
                                 options={caseList} value={selectedCase} onChange={handleCaseChange}
                                 renderInput={(params) => <TextField {...params} label="Select Patient Case" size="small" sx={{ bgcolor: 'white' }} required={props.required} />}
                              />
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <Autocomplete
                                 options={admList} value={selectedAdm} onChange={handleAdmChange}
                                 renderInput={(params) => <TextField {...params} label="Select Admission No" size="small" sx={{ bgcolor: 'white' }} required={props.required} />}
                              />
                           </Grid>
                        </Grid>
                     </Box>

                     <Divider sx={{ mb: 2 }} />

                     <Grid container spacing={2}>
                        <Grid item xs={6} sm={4}><InfoLabel label="Date of Birth" value={patientData.dob} /></Grid>
                        <Grid item xs={6} sm={4}><InfoLabel label="Marital Status" value={patientData.civilStatusName} /></Grid>
                        <Grid item xs={6} sm={4}><InfoLabel label="Mobile No" value={patientData.curMobileNo} /></Grid>
                        
                        <Grid item xs={12} sm={8}>
                           <Typography variant="caption" color="textSecondary" fontWeight="bold">ADDRESS</Typography>
                           <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mt: 0.5 }}>
                              <HomeIcon fontSize="small" color="action" /> {patientData.curAddress || 'N/A'}
                           </Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                           <Typography variant="caption" color="textSecondary" fontWeight="bold">EMERGENCY CONTACT</Typography>
                           <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: 'error.main', fontWeight: 'bold' }}>
                              <EmergencyIcon fontSize="small" /> {patientData.emerGencyName} ({patientData.emerGencyContact})
                           </Typography>
                        </Grid>
                     </Grid>
                  </Grid>
               </Grid>
            </Paper>
         )}
      </Box>
   );
});

export default PatientDetailsCommon;
