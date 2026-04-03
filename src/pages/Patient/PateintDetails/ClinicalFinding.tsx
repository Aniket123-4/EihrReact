import React, { useEffect, useState } from 'react';
import {
   Box, Grid, Typography, Paper, TextField, Button, Divider, 
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   CircularProgress, Card, CardContent, IconButton, Tooltip, Avatar, Stack, 
   useTheme,
   Chip // <--- Ye missing tha, ise yahan add karein
} from '@mui/material';
import { 
   Mic as MicIcon, 
   MicOff as MicOffIcon, 
   DeleteSweep as ClearIcon, 
   Save as SaveIcon,
   History as HistoryIcon,
   RecordVoiceOver as VoiceIcon
} from '@mui/icons-material';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import api from '../../../utils/Url';
import { toast } from 'react-toastify';

const ClinicalFinding = ({ patientDetails = {}, patientCaseID, onSaveSuccess, admNo }: any) => {
   const theme = useTheme();
   const [loading, setLoading] = useState(false);
   const [findingText, setFindingText] = useState("");

   // History Records from result10
   const historyList = patientDetails?.result10 || [];

   const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition
   } = useSpeechRecognition();

   // Voice Transcript ko local state mein sync karna
   useEffect(() => {
      if (transcript) {
         setFindingText(transcript);
      }
   }, [transcript]);

   const startListening = () => SpeechRecognition.startListening({ continuous: true });
   const stopListening = () => SpeechRecognition.stopListening();

   const handleClear = () => {
      resetTranscript();
      setFindingText("");
   };

   const onFinish = async () => {
      if (!findingText.trim()) {
         toast.warning("Please enter or speak some findings");
         return;
      }

      setLoading(true);
      const payload = {
         "patientCaseID": patientCaseID.toString(),
         "admNo": admNo.toString(),
         "col1": "", "col2": "", "col3": "", "col4": "",
         "col5": findingText, // Finding Text goes here
         "col6": "", "col7": "", "col8": "", "col9": "", "col10": "",
         "col11": "", "col12": "", "col13": "", "col14": "", "col15": "",
         "col16": "", "col17": "", "col18": "", "col19": "", "col20": "",
         "col21": "", "col22": "",
         "isForDelete": false,
         "lstType_DocPatient": [{ "col1": "", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", "col8": "", "col9": "", "col10": "", "col11": "", "col12": "", "col13": "", "col14": "", "col15": "" }],
         "lstType_Patient": [{ "col1": "", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", "col8": "", "col9": "", "col10": "", "col11": "", "col12": "", "col13": "", "col14": "", "col15": "" }],
         "userID": "-2",
         "formID": -1,
         "type": 13 // Type 13 for Clinical Finding
      };

      try {
         const response = await api.post('AddDelPatientForDoctorOPIP', payload);
         if (response.data.isSuccess) {
            toast.success("Clinical Finding Saved");
            handleClear();
            onSaveSuccess({ tab: "CLINICAL_FINDING" });
         } else {
            toast.error(response.data.msg || "Save Failed");
         }
      } catch (error) {
         toast.error("Network Error");
      } finally {
         setLoading(false);
      }
   };

   if (!browserSupportsSpeechRecognition) {
      return <Typography color="error">Voice recognition is not supported in this browser.</Typography>;
   }

   return (
      <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
         <Grid container spacing={3}>
            
            {/* LEFT: Voice Typing & Form */}
            <Grid item xs={12} md={6}>
               <Card sx={{ borderRadius: 4, height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <CardContent sx={{ p: 3 }}>
                     <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight="bold" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <VoiceIcon /> Voice Dictation
                        </Typography>
                        {listening && (
                           <Chip 
                              label="Listening..." 
                              color="error" 
                              size="small" 
                              sx={{ animation: 'pulse 1.5s infinite', fontWeight: 'bold' }} 
                           />
                        )}
                     </Stack>

                     <Paper variant="outlined" sx={{ p: 1, bgcolor: '#fbfbfb', mb: 2 }}>
                        <TextField
                           multiline
                           rows={6}
                           fullWidth
                           variant="standard"
                           placeholder="Start speaking or type findings here..."
                           value={findingText}
                           onChange={(e) => setFindingText(e.target.value)}
                           InputProps={{ disableUnderline: true, sx: { fontSize: '1.1rem' } }}
                        />
                     </Paper>

                     <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Box>
                           <Tooltip title={listening ? "Stop Mic" : "Start Voice Typing"}>
                              <IconButton 
                                 onMouseDown={startListening} 
                                 onMouseUp={stopListening}
                                 sx={{ 
                                    bgcolor: listening ? theme.palette.error.main : theme.palette.primary.main,
                                    color: 'white',
                                    '&:hover': { bgcolor: listening ? theme.palette.error.dark : theme.palette.primary.dark }
                                 }}
                              >
                                 {listening ? <MicIcon /> : <MicOffIcon />}
                              </IconButton>
                           </Tooltip>
                           <Button 
                              startIcon={<ClearIcon />} 
                              onClick={handleClear} 
                              sx={{ ml: 1 }}
                           >
                              Clear
                           </Button>
                        </Box>

                        <Button 
                           variant="contained" 
                           startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                           onClick={onFinish}
                           disabled={loading}
                           sx={{ borderRadius: 2, px: 4 }}
                        >
                           Save Record
                        </Button>
                     </Stack>
                  </CardContent>
               </Card>
            </Grid>

            {/* RIGHT: History Log */}
            <Grid item xs={12} md={6}>
               <Paper sx={{ borderRadius: 4, overflow: 'hidden', height: '100%', border: '1px solid #eee' }}>
                  <Box sx={{ p: 2, bgcolor: theme.palette.grey[100], display: 'flex', alignItems: 'center', gap: 1 }}>
                     <HistoryIcon color="action" />
                     <Typography variant="h6" fontWeight="bold">History Log</Typography>
                  </Box>
                  <TableContainer sx={{ maxHeight: 400 }}>
                     <Table stickyHeader size="small">
                        <TableHead>
                           <TableRow>
                              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#eee' }}>Date</TableCell>
                              <TableCell sx={{ fontWeight: 'bold', bgcolor: '#eee' }}>Clinical Findings</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {historyList.length > 0 ? (
                              historyList.map((row: any, i: number) => (
                                 <TableRow key={i} hover>
                                    <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
                                       {row.entryDate}
                                    </TableCell>
                                    <TableCell>
                                       <Typography variant="body2" fontWeight="500">
                                          {row.clinicalFinding}
                                       </Typography>
                                    </TableCell>
                                 </TableRow>
                              ))
                           ) : (
                              <TableRow><TableCell colSpan={2} align="center" sx={{ py: 5 }}>No history records found</TableCell></TableRow>
                           )}
                        </TableBody>
                     </Table>
                  </TableContainer>
               </Paper>
            </Grid>
         </Grid>

         {/* Animation CSS */}
         <style>{`
            @keyframes pulse {
               0% { opacity: 1; transform: scale(1); }
               50% { opacity: 0.5; transform: scale(1.05); }
               100% { opacity: 1; transform: scale(1); }
            }
         `}</style>
      </Box>
   );
};

export default ClinicalFinding;
