import React, { useEffect, useState, useMemo } from 'react';
import {
   Box, Grid, Typography, Paper, TextField, Button, IconButton, 
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   Divider, CircularProgress, Card, Autocomplete, Chip, Avatar,
   Tooltip, InputAdornment, Stack,useTheme
} from '@mui/material';
import { 
   Delete as DeleteIcon, 
   Save as SaveIcon, 
   Search as SearchIcon,
   LocalPharmacy as MedIcon,
   Science as LabIcon,
   Info as InfoIcon,
   History as HistoryIcon,
   CheckCircle as CheckIcon,
   Cancel as CancelIcon
} from '@mui/icons-material';
import api from '../../../utils/Url';
import { toast } from 'react-toastify';
import moment from 'moment';



const Diagnosis = ({ patientDetails = {}, patientCaseID, onSaveSuccess, admNo }: any) => {

    const theme = useTheme();
   const [loading, setLoading] = useState(false);
   const [diseaseList, setDiseaseList] = useState<any[]>([]);
   const [selectedDisease, setSelectedDisease] = useState<any>(null);
   
   const [medicineOptions, setMedicineOptions] = useState<any[]>([]);
   const [prescribedMeds, setPrescribedMeds] = useState<any[]>([]);
   
   const [testOptions, setTestOptions] = useState<any[]>([]);
   const [selectedTests, setSelectedTests] = useState<any[]>([]);

   const historyData = patientDetails?.result4 || [];

   useEffect(() => {
      fetchMasterData();
   }, []);

   // 1. Fetch Initial Dropdowns
   const fetchMasterData = async () => {
      try {
         setLoading(true);
         // Diseases
         const dRes = await api.post("MasterForm/api/GetDisease", {"diseaseID":"-1","diseaseTypeID":"-1","specialTypeID":"-1","isActive":"-1","type":1});
         setDiseaseList(dRes.data.result || []);

         // Investigations
         const iRes = await api.post("MasterForm/api/GetInvParameterMasterList", {"invParameterID":-1,"invGroupID":-1,"isActive":-1,"formID":-1,"type":1});
         setTestOptions(iRes.data.result?.map((t: any) => ({ label: t.invName, value: t.invParameterID })) || []);

         // Medicines
         const mRes = await api.post("InventoryForm/GetItem", {"itemID":-1,"itemCatID":-1,"itemSearch":"","userID":-1,"formID":-1,"type":1});
         setMedicineOptions(mRes.data.result || []);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   // 2. Logic: Jab Disease select ho, linked Meds aur Tests load honge
   const handleDiseaseChange = async (event: any, newValue: any) => {
      setSelectedDisease(newValue);
      if (!newValue) return;

      try {
         setLoading(true);
         // Get Linked Medicines
         const linkedRes = await api.post('MasterForm/GetDiseaseLink', { "diseaseID": newValue.diseaseID, "type": 2 });
         if (linkedRes.data.isSuccess) {
            const meds = await Promise.all(linkedRes.data.result.map(async (m: any) => {
               const bal = await getItemBalance(m.itemID);
               return {
                  ...m,
                  id: m.itemID,
                  qty: bal,
                  noOfDays: 1,
                  timesPerDay: 1,
                  qtyPerTime: 1,
                  instruction: ""
               };
            }));
            setPrescribedMeds(meds);
         }

         // Get Linked Tests
         const testRes = await api.post('MasterForm/GetDiseaseLink', { "diseaseID": newValue.diseaseID, "type": 1 });
         if (testRes.data.isSuccess) {
            setSelectedTests(testRes.data.result.map((t: any) => ({ label: t.commonName, value: t.invParameterID })));
         }
      } catch (e) {
         console.error(e);
      } finally {
         setLoading(false);
      }
   };

   const getItemBalance = async (id: any) => {
      const res = await api.post('/InventoryForm/GetItemBalance', {"itemID": id,"itemCatID":-1,"sectionID":-1,"fundID":-1,"productID":-1,"unitID":-1,"curDate":"","userID":-1,"formID":1,"type":1});
      return res.data.result?.[0]?.balQuantitySum || 0;
   };

     const getBasePayload = () => ({
      "col1": "", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", "col8": "", "col9": "", "col10": "",
      "col11": "", "col12": "", "col13": "", "col14": "", "col15": "", "col16": "", "col17": "", "col18": "", "col19": "", "col20": "",
      "col21": "", "col22": "",
      "isForDelete": false,
      "lstType_DocPatient": [{"col1": "", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", "col8": "", "col9": "", "col10": "", "col11": "", "col12": "", "col13": "", "col14": "", "col15": ""}],
      "lstType_Patient": [{"col1": "", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", "col8": "", "col9": "", "col10": "", "col11": "", "col12": "", "col13": "", "col14": "", "col15": ""}],
      "userID": "-2",
      "formID": -1
   });

   const handleSaveAll = async () => {
      if (!selectedDisease) {
         toast.error("Please select a disease first");
         return;
      }
      setLoading(true);
      try {
         // 1. SAVE DIAGNOSIS (Type 3)
         const diagPayload = {
            ...getBasePayload(),
            patientCaseID: patientCaseID.toString(),
            admNo: admNo.toString(),
            col1: selectedDisease.diseaseID.toString(),
            col3: admNo.toString(),
            type: 3
         };
         const diagRes = await api.post('AddDelPatientForDoctorOPIP', diagPayload);

         // 2. SAVE MEDICATION (Type 4) - Loop for each medicine
         for (const med of prescribedMeds) {
            const medPayload = {
               ...getBasePayload(),
               patientCaseID: patientCaseID.toString(),
               admNo: admNo.toString(),
               col1: med.id.toString(), // drugID
               col2: med.noOfDays.toString(),
               col3: (parseInt(med.qtyPerTime) * parseInt(med.timesPerDay)).toString(), // Qty Per Day
               col4: med.instruction || "",
               col9: (parseInt(med.qtyPerTime) * parseInt(med.timesPerDay) * parseInt(med.noOfDays)).toString(), // Total Qty
               col10: med.timesPerDay.toString(),
               type: 4
            };
            await api.post('AddDelPatientForDoctorOPIP', medPayload);
         }

         // 3. SAVE INVESTIGATION (Type 5)
         if (selectedTests.length > 0) {
            const invPayload = {
               ...getBasePayload(),
               patientCaseID: patientCaseID.toString(),
               admNo: admNo.toString(),
               col7: selectedTests.map(t => t.value).join(','),
               col21: moment().format('DD-MMM-YYYY'),
               type: 5
            };
            await api.post('AddDelPatientForDoctorOPIP', invPayload);
         }

         if (diagRes.data.isSuccess) {
            toast.success("Complete Treatment Plan Saved!");
            setSelectedDisease(null);
            setPrescribedMeds([]);
            setSelectedTests([]);
            onSaveSuccess({ tab: "DIAGNOSIS" });
         } else {
            toast.error(diagRes.data.msg);
         }
      } catch (e) {
         toast.error("Internal Server Error");
      } finally { setLoading(false); }
   };
   return (
      <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
         <Grid container spacing={3}>
            
            {/* LEFT COLUMN: Entry Section */}
            <Grid item xs={12} lg={8}>
               <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mb: 3 }}>
                  
                  {/* Diagnosis Selection */}
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                     Diagnosis & Clinical Finding
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                     <Grid item xs={12} sm={8}>
                        <Autocomplete
                           options={diseaseList}
                           getOptionLabel={(o) => `${o.diseaseName} [${o.diseaseNameHindi || ''}]`}
                           value={selectedDisease}
                           onChange={handleDiseaseChange}
                           renderInput={(params) => <TextField {...params} label="Search/Select Disease" size="small" fullWidth />}
                        />
                     </Grid>
                     <Grid item xs={12} sm={4}>
                        {selectedDisease?.diseasesImage && (
                           <Avatar 
                              src={`data:image/png;base64,${selectedDisease.diseasesImage}`} 
                              variant="rounded" 
                              sx={{ width: '100%', height: 60, border: '1px solid #ddd' }} 
                           />
                        )}
                     </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  {/* Medication Table */}
                  <Box sx={{ mb: 3 }}>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <MedIcon color="secondary" /> Medication / Prescription
                        </Typography>
                        <Autocomplete
                           sx={{ width: 300 }}
                           options={medicineOptions}
                           getOptionLabel={(o) => o.itemName}
                           onChange={(e, v: any) => v && setPrescribedMeds([...prescribedMeds, { ...v, id: v.itemID, itemName: v.itemName, noOfDays: 1, timesPerDay: 1 }])}
                           renderInput={(params) => <TextField {...params} label="Add Manual Medicine" size="small" />}
                        />
                     </Box>
                     <TableContainer sx={{ border: '1px solid #eee', borderRadius: 2, maxHeight: 300 }}>
                        <Table size="small" stickyHeader>
                           <TableHead>
                              <TableRow>
                                 <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 'bold' }}>Medicine</TableCell>
                                 <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 'bold' }}>Days</TableCell>
                                 <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 'bold' }}>Freq</TableCell>
                                 <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 'bold' }}>Stock</TableCell>
                                 <TableCell sx={{ bgcolor: '#f5f5f5', fontWeight: 'bold' }} align="right">Action</TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {prescribedMeds.map((med, index) => (
                                 <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: '600' }}>{med.itemName || med.commonName}</TableCell>
                                    <TableCell><TextField size="small" type="number" sx={{ width: 60 }} defaultValue={med.noOfDays} /></TableCell>
                                    <TableCell><TextField size="small" type="number" sx={{ width: 60 }} defaultValue={med.timesPerDay} /></TableCell>
                                    <TableCell>
                                       {med.qty > 0 ? 
                                          <Tooltip title="In Stock"><CheckIcon color="success" fontSize="small" /></Tooltip> : 
                                          <Tooltip title="Out of Stock"><CancelIcon color="error" fontSize="small" /></Tooltip>
                                       }
                                       <Typography variant="caption" sx={{ ml: 0.5 }}>{med.qty}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                       <IconButton size="small" color="error" onClick={() => setPrescribedMeds(prescribedMeds.filter((_, i) => i !== index))}>
                                          <DeleteIcon fontSize="small" />
                                       </IconButton>
                                    </TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </TableContainer>
                  </Box>

                  {/* Investigation Section */}
                  <Box>
                     <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LabIcon color="primary" /> Investigation (Tests)
                     </Typography>
                     <Autocomplete
                        multiple
                        options={testOptions}
                        value={selectedTests}
                        onChange={(e, v) => setSelectedTests(v)}
                        renderTags={(value, getTagProps) =>
                           value.map((option, index) => (
                              <Chip label={option.label} color="primary" variant="outlined" size="small" {...getTagProps({ index })} />
                           ))
                        }
                        renderInput={(params) => <TextField {...params} placeholder="Search Tests..." size="small" />}
                     />
                  </Box>

                  <Box sx={{ mt: 4, textAlign: 'right' }}>
                     <Button 
                        variant="contained" 
                        size="large" 
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        onClick={handleSaveAll}
                        disabled={loading}
                        sx={{ borderRadius: 3, px: 6, fontWeight: 'bold' }}
                     >
                        Save Complete Plan
                     </Button>
                  </Box>
               </Paper>
            </Grid>

            {/* RIGHT COLUMN: History List */}
            <Grid item xs={12} lg={4}>
               <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', height: '100%' }}>
                  <Box sx={{ p: 2, bgcolor: theme.palette.grey[100], display: 'flex', alignItems: 'center', gap: 1 }}>
                     <HistoryIcon />
                     <Typography variant="h6" fontWeight="bold">Diagnosis History</Typography>
                  </Box>
                  <Box sx={{ maxHeight: 700, overflowY: 'auto', p: 1 }}>
                     {historyData.map((row: any, i: number) => (
                        <Card key={i} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                           <Box sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                 <Typography color="primary" fontWeight="bold">{row.diseaseName}</Typography>
                                 <Typography variant="caption" color="textSecondary">{row.enterDateVar}</Typography>
                              </Box>
                              <Chip label={row.diseaseTypeName} size="small" sx={{ fontSize: '10px' }} />
                              <Box sx={{ textAlign: 'right' }}>
                                 <IconButton size="small" color="error">
                                    <DeleteIcon fontSize="small" />
                                 </IconButton>
                              </Box>
                           </Box>
                        </Card>
                     ))}
                     {historyData.length === 0 && <Typography sx={{ textAlign: 'center', py: 5, color: '#aaa' }}>No history records</Typography>}
                  </Box>
               </Paper>
            </Grid>

         </Grid>
      </Box>
   );
};

export default Diagnosis;
