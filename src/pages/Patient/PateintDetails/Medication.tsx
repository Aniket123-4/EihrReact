import React, { useEffect, useState } from 'react';
import {
   Box, Grid, Typography, Paper, TextField, Button, IconButton, 
   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
   Divider, CircularProgress, Card, Autocomplete, Chip, 
   InputAdornment, Tooltip
} from '@mui/material';
import { 
   Delete as DeleteIcon, 
   Save as SaveIcon, 
   LocalPharmacy as MedIcon,
   History as HistoryIcon,
   Inventory as StockIcon
} from '@mui/icons-material';
import api from '../../../utils/Url';
import { toast } from 'react-toastify';

const Medication = ({ patientDetails = {}, patientCaseID, onSaveSuccess, admNo, showForm }: any) => {
   const [loading, setLoading] = useState(false);
   const [itemCat, setItemCat] = useState<any[]>([]);
   const [drugList, setDrugList] = useState<any[]>([]);
   const [balanceList, setBalanceList] = useState<any[]>([]);
   
   const [instructionList] = useState([
      { value: "Serve with Tea", label: "Serve with Tea" },
      { value: "Serve with Water", label: "Serve with Water" },
      { value: "Serve with Milk", label: "Serve with Milk" },
      { value: "Serve with Honey", label: "Serve with Honey" },
   ]);

   // Form State
   const [formValues, setFormValues] = useState<any>({
      itemCategoryID: null,
      drugID: null,
      itemID: null, // Yahi variable use hoga batch ke liye
      noOfDays: 1,
      qtyTimesPerDay: 1,
      qtyPerDay: 1,
      totalQty: 1,
      instruction: '',
      advice: '',
      diet: ''
   });

   const prescribedMeds = patientDetails?.result5 || [];

   useEffect(() => {
      fetchItemCategories();
   }, []);

   const fetchItemCategories = async () => {
      try {
         const res = await api.post('InventoryForm/GetItemCat', {"itemCatID":-1,"sectionID":-1,"fundID":-1,"userID":-1,"formID":-1,"mainType":2,"type":1});
         if (res.data.isSuccess) setItemCat(res.data.result);
      } catch (e) { console.error(e); }
   };

   const handleCategoryChange = async (event: any, newValue: any) => {
      setFormValues({ ...formValues, itemCategoryID: newValue?.itemCatID, drugID: null, itemID: null });
      if (!newValue) return;
      try {
         const res = await api.post('/InventoryForm/FnGetItem', {"itemID":-1,"itemCatID":newValue.itemCatID || "","sectionID":-1,"fundID":-1,"ledgerNo":"","itemSearch":"","userID":-1,"formID":1,"type":1});
         if (res.data.isSuccess) setDrugList(res.data.result);
      } catch (e) { console.error(e); }
   };

   const handleDrugChange = async (event: any, newValue: any) => {
      setFormValues({ ...formValues, drugID: newValue?.itemID, itemID: null });
      if (!newValue) return;
      try {
         const res = await api.post('/InventoryForm/GetItemBalance', {"itemID":newValue.itemID,"itemCatID":newValue.itemCatID,"sectionID":0,"fundID":0,"productID":0,"unitID":0,"curDate":"","userID":-1,"formID":1,"type":1});
         if (res.data.isSuccess) setBalanceList(res.data.result);
      } catch (e) { console.error(e); }
   };

   // Auto Calculation logic
   useEffect(() => {
      const total = (Number(formValues.noOfDays) || 0) * (Number(formValues.qtyTimesPerDay) || 0) * (Number(formValues.qtyPerDay) || 1);
      setFormValues(prev => ({ ...prev, totalQty: total }));
   }, [formValues.noOfDays, formValues.qtyTimesPerDay, formValues.qtyPerDay]);

   const getBasePayload = () => ({
      "col1": "", "col2": "", "col3": "", "col4": "", "col5": "", "col6": "", "col7": "", "col8": "", "col9": "", "col10": "", "col11": "", "col12": "", "col13": "", "col14": "", "col15": "", "col16": "", "col17": "", "col18": "", "col19": "", "col20": "", "col21": "", "col22": "",
      "isForDelete": false,
      "lstType_DocPatient": [{"col1": ""}],
      "lstType_Patient": [{"col1": ""}],
      "userID": "-2", "formID": -1, "type": 4
   });

   const handleSave = async () => {
   if (!formValues.itemID) {
      toast.warning("Please select a specific Batch/Item from the list");
      return;
   }

   setLoading(true);
   try {
      // 1. Numeric calculations ko handle karein safely
      const days = Number(formValues.noOfDays) || 0;
      const times = Number(formValues.qtyTimesPerDay) || 0;
      const dose = Number(formValues.qtyPerDay) || 0;
      const total = days * times * dose;

      // 2. Exact Payload Structure jaisa backend expect kar raha hai
      const payload = {
         "patientCaseID": patientCaseID ? patientCaseID.toString() : "",
         "admNo": admNo ? admNo.toString() : "",
         "col1": formValues.itemID.toString(),       // Selected Item/Batch ID
         "col2": days.toString(),                    // No of Days
         "col3": (dose * times).toString(),          // Qty Per Day
         "col4": formValues.instruction || "",
         "col5": formValues.advice || "",
         "col6": formValues.diet || "",
         "col7": "", "col8": "",
         "col9": total.toString(),                   // Total Qty
         "col10": times.toString(),                  // No of times per day
         "col11": "0", "col12": "", "col13": "", "col14": "", "col15": "", 
         "col16": "", "col17": "", "col18": "", "col19": "", "col20": "", 
         "col21": "", "col22": "",
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
         "userID": "-2", 
         "formID": -1, 
         "type": 4 // Type 4 for Medication
      };

      // 3. URL se leading slash hataya gaya (Relative path)
      const res = await api.post('AddDelPatientForDoctorOPIP', payload);
      
      if (res.data.isSuccess) {
         toast.success(res.data.msg || "Medication Added Successfully");
         setFormValues({ ...formValues, itemID: null, totalQty: 1 }); // Clear selection
         onSaveSuccess({ tab: "MEDICATION" }); // Refresh list
      } else {
         toast.error(res.data.msg || "Server rejected the request");
      }
   } catch (e: any) {
      // Precise Error Logging
      console.error("Save Error Response:", e.response?.data);
      const errorMsg = e.response?.data?.msg || "Network Error: Could not reach server";
      toast.error(errorMsg);
   } finally {
      setLoading(false);
   }
};

   const handleDelete = async (record: any) => {
      if (!window.confirm("Remove this medication?")) return;
      try {
         const payload = { 
            ...getBasePayload(),
            "patientCaseID": patientCaseID.toString(), 
            "admNo": record.admNo.toString(), 
            "col1": record.drugID.toString(), 
            "col8": record.admNo.toString(),
            "isForDelete": true, 
            "type": 4 
         };
         const res = await api.post('/AddDelPatientForDoctorOPIP', payload);
         if (res.data.isSuccess) {
            toast.success("Medication removed");
            onSaveSuccess({ tab: "MEDICATION" });
         }
      } catch (e) { console.error(e); }
   };

   return (
      <Box sx={{ animation: 'fadeIn 0.5s ease-in' }}>
         {!showForm && (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mb: 4, borderTop: '6px solid #4caf50' }}>
               <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MedIcon color="success" /> New Medication Entry
               </Typography>
               <Divider sx={{ mb: 3 }} />
               <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                     <Autocomplete
                        options={itemCat}
                        getOptionLabel={(o) => o.itemCatName || ""}
                        onChange={handleCategoryChange}
                        renderInput={(params) => <TextField {...params} label="Category" size="small" />}
                     />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                     <Autocomplete
                        options={drugList}
                        getOptionLabel={(o) => o.itemName || ""}
                        onChange={handleDrugChange}
                        renderInput={(params) => <TextField {...params} label="Drug / Generic" size="small" />}
                     />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                     <Autocomplete
                        options={balanceList || []}
                        getOptionLabel={(o) => `${o.itemName} (Stock: ${o.balanceQuantity})`}
                        value={balanceList.find(b => b.itemID === formValues.itemID) || null}
                        onChange={(e, v) => setFormValues({ ...formValues, itemID: v?.itemID })}
                        renderInput={(params) => <TextField {...params} label="Select Batch / Store Item" size="small" />}
                     />
                  </Grid>

                  <Grid item xs={6} sm={2}>
                     <TextField 
                        label="No of Days" type="number" size="small" fullWidth 
                        value={formValues.noOfDays}
                        onChange={(e) => setFormValues({...formValues, noOfDays: e.target.value})}
                     />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                     <TextField 
                        label="Times / Day" type="number" size="small" fullWidth 
                        value={formValues.qtyTimesPerDay}
                        onChange={(e) => setFormValues({...formValues, qtyTimesPerDay: e.target.value})}
                     />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                     <TextField 
                        label="Qty per Dose" type="number" size="small" fullWidth 
                        value={formValues.qtyPerDay}
                        onChange={(e) => setFormValues({...formValues, qtyPerDay: e.target.value})}
                     />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                     <TextField 
                        label="Total Qty" size="small" fullWidth disabled 
                        value={formValues.totalQty}
                        InputProps={{ startAdornment: <InputAdornment position="start"><StockIcon fontSize="small" /></InputAdornment> }}
                     />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                     <Autocomplete
                        options={instructionList}
                        getOptionLabel={(o) => o.label}
                        onChange={(e, v) => setFormValues({ ...formValues, instruction: v?.value })}
                        renderInput={(params) => <TextField {...params} label="Instructions" size="small" />}
                     />
                  </Grid>

                  <Grid item xs={12} sm={10}>
                     <TextField 
                        label="Doctor Advice / Diet Note" size="small" fullWidth 
                        onChange={(e) => setFormValues({...formValues, advice: e.target.value})}
                     />
                  </Grid>
                  
                  <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                     <Button 
                        fullWidth variant="contained" color="success" 
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        onClick={handleSave}
                        disabled={loading}
                     >
                        Add
                     </Button>
                  </Grid>
               </Grid>
            </Paper>
         )}

         {/* HISTORY TABLE */}
         <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
               <Typography variant="h6" fontWeight="bold">Current Medications</Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 400 }}>
               <Table stickyHeader size="small">
                  <TableHead>
                     <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Medicine</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Schedule</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Total Qty</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {prescribedMeds.map((med: any, i: number) => (
                        <TableRow key={i} hover>
                           <TableCell><Typography variant="body2" fontWeight="bold" color="primary">{med.drugName}</Typography></TableCell>
                           <TableCell>{med.noOfDays} Days x {med.qtyTimesPerDay} Times</TableCell>
                           <TableCell><Chip label={med.qtyCal} size="small" color="secondary" variant="outlined" /></TableCell>
                           <TableCell>
                              <IconButton color="error" size="small" onClick={() => handleDelete(med)}>
                                 <DeleteIcon fontSize="small" />
                              </IconButton>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </TableContainer>
         </Paper>
      </Box>
   );
};

export default Medication;
