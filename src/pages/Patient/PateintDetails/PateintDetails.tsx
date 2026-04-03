import React, { useEffect, useState } from 'react';
import {
   Box, Tab, Tabs, Typography, Paper, Divider, useTheme, 
   Grid, Chip, CircularProgress, Avatar, Stack, Button
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../../utils/Url';
import { ToastContainer } from 'react-toastify';

// Sub-Components Import (Aapne jo banwaye hain)
import GeneralInformation from './GeneralInformation'; 
import VitalSign from './VitalSign';
import Diagnosis from './Diagnosis';
import Medication from './Medication';
import Investigation from './Investigation';
import PatientHistory from './PatientHistory';
import PatientDocument from './PatientDocument';
import ReferralDoctor from './ReferralDoctor';
import ClinicalFinding from './ClinicalFinding';
import DischargeSummary from './DischargeSummary';



// Custom Tab Panel Wrapper
interface TabPanelProps {
   children?: React.ReactNode;
   index: number;
   value: number;
}

function CustomTabPanel(props: TabPanelProps) {
   const { children, value, index, ...other } = props;
   return (
      <div role="tabpanel" hidden={value !== index} id={`p-tabpanel-${index}`} {...other}>
         {value === index && (
            <Box sx={{ py: 3, animation: 'fadeIn 0.3s ease-in' }}>
               {children}
            </Box>
         )}
      </div>
   );
}

const PatientDetails = () => {
   const { t } = useTranslation();
   const theme = useTheme();
   const location = useLocation();
   const navigate = useNavigate();
   
   const [tabValue, setTabValue] = useState(0);
   const [segments, setSegments] = useState<any[]>([]); 
   const [apiData, setApiData] = useState<any>(null); 
   const [loading, setLoading] = useState(true);

   // Navigation state se data nikalna
   const patientData = location.state || {};
   

   useEffect(() => {
      if (patientData?.patientID) {
         fetchFullPatientDetails();
      }
   }, [patientData]);

   const fetchFullPatientDetails = async () => {
      setLoading(true);
      try {
         const payload = {
            "patientCaseID": patientData?.patientCaseID || "",
            "patientCaseNo": patientData?.patientCaseNo || "",
            "patientID": patientData?.patientID || "",
            "patientNo": patientData?.patientNo || "",
            "caseTypeID": patientData?.caseTypeID || -1,
            "patientName": "",
            "fromDate": "01 Jan 1900",
            "toDate": "01 Jan 1900",
            "userID": -2,
            "formID": 1,
            "type": 2
         };

         const response = await api.post("GetPatientForDoctorOPIP", payload);
         if (response.data.isSuccess) {
            setApiData(response.data);
            setSegments(response.data.result); // Dynamic Tabs Mapping
         }
      } catch (error) {
         console.error("Critical API Error:", error);
      } finally {
         setLoading(false);
      }
   };

   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
   };

   // Master Logic: Segment ID ke hisaab se component chunna
   const renderTabContent = (segment: any) => {
   
   // Ye props har clinical entry form (Vital, Diagnosis, Med, Inv) ke liye common hain
   const clinicalProps = {
      patientCaseID: patientData.patientCaseID, // Router state se
      admNo: patientData.admNo,                 // Router state se
      onSaveSuccess: fetchFullPatientDetails    // Refresh function
   };

   switch (segment.segmentID) {
      case "1": // GENERAL INFORMATION
         return <GeneralInformation apiData={apiData} />;
      
      case "3": // VITAL SIGN
         return <VitalSign patientDetails={apiData} {...clinicalProps} />;

      case "4": // DIAGNOSIS
         return <Diagnosis patientDetails={apiData} {...clinicalProps} />;

      case "5": // MEDICATION
         return <Medication patientDetails={apiData} {...clinicalProps} />;

      case "6": // INVESTIGATION
         return <Investigation patientDetails={apiData} {...clinicalProps} />;

      case "7": // PATIENT HISTORY (Agar result7 use kar rahe hain)
        return <PatientHistory patientDetails={apiData} {...clinicalProps} />;
        case "14": return <DischargeSummary patientDetails={apiData} {...clinicalProps} />;
        case "15": // PATIENT DOCUMENT
   return <PatientDocument patientDetails={apiData} />;
   case "16": return <ReferralDoctor patientDetails={apiData} {...clinicalProps} />;
   case "17": return <ClinicalFinding patientDetails={apiData} {...clinicalProps} />;

      default:
         return (
            <Box sx={{ p: 5, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 4 }}>
               <Typography color="textSecondary">{segment.segmentName} Module Coming Soon</Typography>
            </Box>
         );
   }
};

   // Dynamic Header data from result1
   const currentPat = apiData?.result1?.[0] || patientData;
   

   return (
      <Box sx={{ width: '100%', mt: 1, px: { xs: 1, md: 3 }, pb: 5 }}>
        <ToastContainer /> 
         
         {/* Top Back Button */}
         <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)} 
            sx={{ mb: 2, fontWeight: 'bold' }}
         >
            Back to Patient List
         </Button>

         <Paper elevation={6} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #ddd' }}>
            
            {/* SECTION 1: High-Profile Header */}
            <Box sx={{ p: 3, bgcolor: theme.palette.primary.main, color: 'white', position: 'relative' }}>
               <Grid container spacing={2} alignItems="center">
                  <Grid item>
                     <Avatar sx={{ bgcolor: 'white', color: theme.palette.primary.main, width: 64, height: 64, fontSize: 28, fontWeight: '900', boxShadow: 3 }}>
                        {currentPat.patNameTitle?.charAt(0)}
                     </Avatar>
                  </Grid>
                  <Grid item xs>
                     <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: -1 }}>
                        {currentPat.patNameTitle}
                     </Typography>
                     <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />}>
                        <Typography variant="subtitle1">Patient No: <b>{currentPat.patientNo}</b></Typography>
                        <Typography variant="subtitle1">Case: <b>{currentPat.patientCaseNo}</b></Typography>
                        <Typography variant="subtitle1">Type: <b>{currentPat.caseTypeName}</b></Typography>
                     </Stack>
                  </Grid>
                  <Grid item>
                     <Chip 
                        label={currentPat.statusName || "ACTIVE"} 
                        sx={{ bgcolor: '#fff', color: theme.palette.primary.main, fontWeight: 'bold', px: 2 }} 
                     />
                  </Grid>
               </Grid>
            </Box>

            {/* SECTION 2: Vital Stats Strip */}
            <Box sx={{ px: 3, py: 1.5, bgcolor: '#f4f7f9', borderBottom: '1px solid #e0e0e0', display: 'flex', gap: 5, overflowX: 'auto' }}>
               <Box><Typography variant="caption" color="textSecondary">GENDER</Typography><Typography variant="body2" fontWeight="bold">{currentPat.genderName || patientData.genderName}</Typography></Box>
               <Box><Typography variant="caption" color="textSecondary">AGE</Typography><Typography variant="body2" fontWeight="bold">{currentPat.age || patientData.age} Yrs</Typography></Box>
               <Box><Typography variant="caption" color="textSecondary">NATIONALITY</Typography><Typography variant="body2" fontWeight="bold">{currentPat.nationality || 'INDIAN'}</Typography></Box>
               <Box><Typography variant="caption" color="textSecondary">BLOOD GROUP</Typography><Typography variant="body2" fontWeight="bold" color="error">{patientData.bloodGroup || 'N/A'}</Typography></Box>
               <Box><Typography variant="caption" color="textSecondary">ADMISSION</Typography><Typography variant="body2" fontWeight="bold">{patientData.admissionDate}</Typography></Box>
            </Box>

            {/* SECTION 3: Dynamic Tabs Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
               <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  indicatorColor="primary"
                  textColor="primary"
                  sx={{
                     '& .MuiTab-root': { fontWeight: '700', fontSize: '0.85rem', minWidth: 150, py: 2.5 },
                     '& .Mui-selected': { color: theme.palette.primary.main, bgcolor: '#f0f4ff' }
                  }}
               >
                  {segments.map((s, index) => (
                     <Tab key={s.segmentID} label={s.segmentName} />
                  ))}
               </Tabs>
            </Box>

            {/* SECTION 4: Sub-Module Content Rendering */}
            <Box sx={{ bgcolor: '#fafafa', minHeight: '60vh', px: { xs: 2, md: 4 } }}>
               {segments.map((segment, index) => (
                  <CustomTabPanel key={segment.segmentID} value={tabValue} index={index}>
                     {renderTabContent(segment)}
                  </CustomTabPanel>
               ))}
            </Box>

         </Paper>
      </Box>
   );
};

export default PatientDetails;
