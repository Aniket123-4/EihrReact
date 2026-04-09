import React, { useState, useEffect } from 'react';
import {
   Autocomplete,
   Avatar,
   Box,
   Button,
   Container,
   Grid,
   IconButton,
   MenuItem,
   Paper,
   Tab,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableFooter,
   TableHead,
   TableRow,
   Tabs,
   TextField,
   Typography
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import { deepPurple } from '@mui/material/colors';
import api from "../../utils/Url";
import { useFormik } from 'formik';
import { getISTDate } from '../../utils/Constant';
import { toast, ToastContainer } from 'react-toastify';
import PatientPharmacyBilling from './PatientPharmacyBilling';
import PayPartialPharmacyBilling from './PayPartialPharmacyBilling';

// Declare window interface for Razorpay
declare global {
   interface Window {
      Razorpay: any;
   }
}

// Utility to load Razorpay Script
const loadRazorpayScript = () => {
   return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
   });
};

const PatientBilling = () => {
   const { defaultValues } = getISTDate();
   const [maintab, setMainTab] = useState(0);
   const [tab, setTab] = useState(0);
   
   const [patients, setPatients] = useState<any[]>([]);
   const [selectedPatient, setSelectedPatient] = useState<any>(null);
   const [patientInfo, setPatientInfo] = useState<any>(null);
   const [visitInfo, setVisitInfo] = useState<any>(null);
   const [caseData, setCaseData] = useState<any>([]);
   const [Case, setCase] = useState("");
   
   // Billing Logic States
   const [testDetails, setTestDetails] = useState<any[]>([]);
   const [billSummary, setBillSummary] = useState<any[]>([]);
   const [remark, setRemark] = useState("");
   const [billNoOptions, setBillNoOptions] = useState<any>([]);
   const [billReceiptData, setBillReceiptData] = useState<any>([]);
   const [billReceiptData1, setBillReceiptData1] = useState<any>([]);

   useEffect(() => {
      fetchPatientList();
   }, []);

   const fetchPatientList = async () => {
      try {
         const res = await api.post("/FnGetPatientSearch", {
            patientNo: "", patientName: "", userID: -1, formID: -1, type: 1,
         });
         if (res.data.isSuccess) setPatients(res.data.result);
      } catch (error) {
         console.error("Fetch patient error:", error);
      }
   };

   const handlePatientSelect = async (patient: any) => {
      if (!patient) return;
      setSelectedPatient(patient);
      try {
         const headerRes = await api.post("/GetPatientHeader", {
            patientNo: patient.patientNo, patientID: -1, userID: -2, formID: 1, type: 1,
         });

         if (headerRes.data.isSuccess) {
            const patientData = headerRes.data.result1?.[0];
            const photoData = headerRes.data.result2?.[0];
            const caseDataList = headerRes.data.result3 || [];

            setPatientInfo({ ...patientData, photo: photoData?.photo });
            const caseArr = caseDataList.map((item: any) => ({ ...item, value: item.patientCaseID, label: item.patientCaseNo }));
            setCaseData(caseArr);

            if (caseDataList.length > 0) {
               setCase(caseDataList[0].patientCaseNo);
               getPatientBill(caseDataList[0].patientCaseID);
               getPatientBillNumber(caseDataList[0].patientCaseID);
            }
         }
      } catch (error) {
         console.error("Fetch header info error:", error);
      }
   };

   const getPatientBill = async (caseID: string) => {
      try {
         const payload = { "patientCaseID": caseID, "patientCaseNo": "", "admNo": "1", "patientBillID": -1, "userID": -1, "formID": -1, "type": 1 };
         const billRes = await api.post(`GetPatientBill`, payload);
         if (billRes.data.isSuccess) {
            setTestDetails(billRes.data.result1 || []);
            setBillSummary(billRes.data.result2 || []);
            setRemark(billRes.data.result1[0]?.remark || "");
         }
      } catch (error) { console.log(error); }
   };

   // --- DELETE LOGIC & RECALCULATION (As per AntD Logic) ---
   const handleDeleteTest = (record: any) => {
      const updatedList = testDetails.filter(item => item.patientBillCompID !== record.patientBillCompID);
      
      const calculateSum = (array: any[], property: string) => 
         array.reduce((acc, curr) => acc + parseFloat(curr[property] || 0), 0);

      const newSummary = [{
         ...billSummary[0],
         totNetAmount: calculateSum(updatedList, 'netAmount'),
         actualPayAmt: calculateSum(updatedList, 'netAmount'),
         totFinalGrossAmount: calculateSum(updatedList, 'finalGrossAmount'),
         disCountAmt: calculateSum(updatedList, 'remainingAmt')
      }];

      setTestDetails(updatedList);
      setBillSummary(newSummary);
   };

   // --- SAVE TO DATABASE ---
   const saveBillToDatabase = async (values: any, paymentId: string) => {
      try {
         const typPatientBillMapped = testDetails.map((item: any) => ({
            "col1": item.patientBillID || -1,
            "col2": item.patientBillCompID,
            "col3": item.patientID,
            "col4": item.patientCaseID,
            "col5": item.admNo || "1",
            "col6": item.invGroupID,
            "col7": item.discountParameterID,
            "col8": item.invParameterID,
            "col9": item.noOfDays,
            "col10": item.quantityPerDay,
            "col11": item.compID,
            "col12": item.compRebate,
            "col13": item.insuranceCompID,
            "col14": item.insuranceRebate,
            "col15": item.grossAmount,
            "col16": item.netAmount,
            "col17": item.finalGrossAmount,
            "col18": item.isConsultency ? "1" : "0",
            "col19": item.isMedic ? "1" : "0",
            "col20": item.isRoom ? "1" : "0",
            "col21": item.isManual ? "1" : "0",
            "col22": remark,
            "col23": item.barCode || "",
            "col24": "", "col25": "", "col26": "", "col27": "", "col28": "", "col29": "", "col30": "",
            "col31": "", "col32": "", "col33": "", "col34": "", "col35": "", "col36": "", "col37": "", "col38": "", "col39": "", "col40": ""
         }));

         const payload = {
            ...values,
            typPatientBill: typPatientBillMapped,
            totDiscountAmt: billSummary[0]?.disCountAmt || 0,
            paidAmt: billSummary[0]?.actualPayAmt || 0,
            payTypeNo: paymentId,
            payTypeDetail: "Razorpay",
         };

         const response = await api.post('AddPatientBill', payload);
         if (response.data.isSuccess) {
            toast.success("Bill Paid & Saved Successfully!");
            // REFRESH PAGE DATA
            setTab(1); // Switch to Receipt
            handlePatientSelect(selectedPatient); // Reload patient data
            setRemark("");
         } else {
            toast.error(response.data.msg);
         }
      } catch (error) {
         toast.error("Error saving bill to database.");
      }
   };

   // --- RAZORPAY PAYMENT ---
   const handleRazorpayPayment = async (values: any) => {
      if (!remark) { toast.warning("Please add a remark"); return; }
      const res = await loadRazorpayScript();
      if (!res) { toast.error("Razorpay SDK failed to load"); return; }

      const payAmount = billSummary[0]?.actualPayAmt || 0;
      if (payAmount <= 0) { toast.warning("Amount must be greater than zero"); return; }

      const options = {
         key: "rzp_test_SYZuRxwlKGWymN",
         amount: payAmount * 100,
         currency: "INR",
         name: "Hospital Management",
         description: `Patient Bill - Case: ${Case}`,
         handler: (response: any) => saveBillToDatabase(values, response.razorpay_payment_id),
         prefill: { name: patientInfo?.candName, contact: patientInfo?.curMobileNo },
         theme: { color: "#1976d2" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
   };

   const formik = useFormik({
      initialValues: {
         "totDiscountAmt": 0, "billDate": defaultValues, "patientBillID": -1, "paidAmt": 0, "payDate": "", "payTypeID": -1, "payTypeNo": "", "payTypeDetail": "", "isCancel": false, "userID": -1, "formID": -1, "type": 1
      },
      onSubmit: (values) => handleRazorpayPayment(values)
   });

   const getBillReciept = async (caseId: string, billId: string) => {
      try {
         const payload = { "patientCaseID": caseId, "patientCaseNo": "", "admNo": "1", "patientBillID": billId, "userID": -1, "formID": -1, "type": 1 }
         const billRes = await api.post(`GetPatientBill`, payload);
         setBillReceiptData(billRes.data.result1 || []);
         setBillReceiptData1(billRes.data.result2 || []);
      } catch (error) { console.log(error) }
   }

   const getPatientBillNumber = async (caseID) => {
      try {
         const payload = { "patientCaseID": caseID, "patientCaseNo": "", "admNo": "1", "isCancel": false, "userID": -1, "formID": -1, "type": 2 };
         const response = await api.post("GetPatientBillNo", payload);
         if (response.data.isSuccess) {
            setBillNoOptions(response.data.result.map(item => ({ ...item, label: item.billNo, value: item.billID })));
         }
      } catch (error) { console.log(error) }
   }

   const printTable = () => {
      const tableContent = document.getElementById("billing-table")?.outerHTML;
      const printWindow = window.open("", "", "height=800,width=1000");
      if (!printWindow || !tableContent) return;
      printWindow.document.write(`<html><head><title>Print Receipt</title><style>table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ccc;padding:10px;text-align:center;} thead{background-color:#0288d1;color:white;}</style></head><body>${tableContent}</body></html>`);
      printWindow.document.close();
      printWindow.print();
   };

   return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
         <Tabs value={maintab} onChange={(_, v) => setMainTab(v)} textColor="primary" indicatorColor="primary" sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
            <Tab label="Patient Billing" />
            <Tab label="Patient Pharmacy Billing" />
            <Tab label="Pay Partial Pharmacy Billing" />
         </Tabs>

         <ToastContainer />

         {maintab === 0 && (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
               <Typography variant="h5" fontWeight="bold" gutterBottom>🧾 Patient Billing Details</Typography>

               <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={4} md={3}>
                     <Autocomplete
                        options={patients}
                        getOptionLabel={(o) => o.patientName || ""}
                        onChange={(_, v) => handlePatientSelect(v)}
                        renderInput={(params) => <TextField {...params} label="Search Patient" size="small" />}
                     />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                     <TextField label="Patient No" value={selectedPatient?.patientNo || ""} fullWidth size="small" />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                     <Autocomplete
                        options={caseData}
                        value={Case}
                        onChange={(_, v: any) => { if (!v) return; getPatientBill(v.patientCaseID); getPatientBillNumber(v.patientCaseID); setCase(v.patientCaseNo); }}
                        renderInput={(params) => <TextField {...params} label="Case No" size="small" />}
                     />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                     <TextField label="Admission No" value="1" fullWidth size="small" />
                  </Grid>
               </Grid>

               {patientInfo && (
                  <Paper sx={{ p: 2, mt: 2, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                     <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                           <Grid container spacing={2}>
                              <Info label="Name" value={patientInfo.candName} />
                              <Info label="DOB" value={patientInfo.dob} />
                              <Info label="Age" value={patientInfo.age} />
                              <Info label="Gender" value={patientInfo.genderName} />
                              <Info label="Mobile" value={patientInfo.curMobileNo} />
                              <Info label="Phone" value={patientInfo.curPhoneNo} />
                              <Info label="Email" value={patientInfo.email} />
                              <Info label="Address" value={patientInfo.curAddress} />
                              <Info label="Marital Status" value={patientInfo.civilStatusName} />
                              <Info label="Blood Group" value={patientInfo.bloodGroup} />
                              <Info label="Emergency Contact Person Name" value={patientInfo.emerGencyName} />
                              <Info label="Emergency Contact Number" value={patientInfo.emerGencyContact} />
                           </Grid>
                        </Grid>
                        <Grid item xs={12} md={3} display="flex" justifyContent="center" alignItems="center">
                           <Box component="img" src={`data:image/jpeg;base64,${patientInfo.photo}`} sx={{ width: 150, height: 150, objectFit: "cover", borderRadius: 2, border: "2px solid #ccc" }} />
                        </Grid>
                     </Grid>
                  </Paper>
               )}

               <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 4, borderBottom: 1, borderColor: 'divider' }}>
                  <Tab label="Generate Bill" />
                  <Tab label="Bill Receipt" />
               </Tabs>

               <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
                  {tab === 0 ? (
                     <>
                        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
                           <Table>
                              <TableHead sx={{ backgroundColor: "#1976d2" }}>
                                 <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Test Parameter</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Case Type</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Payable %</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Final Gross Amt</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Disc Amt</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Net Amt</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Action</TableCell>
                                 </TableRow>
                              </TableHead>
                              <TableBody>
                                 {testDetails.length === 0 ? <TableRow><TableCell colSpan={7} align="center">No data available</TableCell></TableRow> :
                                    testDetails.map((test, index) => (
                                       <TableRow key={index} hover>
                                          <TableCell>{test.invParameterName}</TableCell>
                                          <TableCell>{test.vPreEmpType}</TableCell>
                                          <TableCell>{test.compRebate}</TableCell>
                                          <TableCell>{test.finalGrossAmount}</TableCell>
                                          <TableCell>{test.remainingAmt || 0}</TableCell>
                                          <TableCell>{test.netAmount}</TableCell>
                                          <TableCell>
                                             <IconButton color="error" size="small" onClick={() => handleDeleteTest(test)}>
                                                <DeleteIcon fontSize="small" />
                                             </IconButton>
                                          </TableCell>
                                       </TableRow>
                                    ))}
                              </TableBody>
                           </Table>
                        </TableContainer>

                        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
                           <Table>
                              <TableHead sx={{ backgroundColor: "#1976d2" }}>
                                 <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Final Gross Amt</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Total Disc Amt</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Balance Amt</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Net Amt</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Actual Pay Amt</TableCell>
                                 </TableRow>
                              </TableHead>
                              <TableBody>
                                 <TableRow>
                                    <TableCell>{billSummary[0]?.totFinalGrossAmount}</TableCell>
                                    <TableCell>{billSummary[0]?.disCountAmt}</TableCell>
                                    <TableCell>{billSummary[0]?.balanceAmt}</TableCell>
                                    <TableCell>{billSummary[0]?.totNetAmount}</TableCell>
                                    <TableCell>{billSummary[0]?.actualPayAmt}</TableCell>
                                 </TableRow>
                              </TableBody>
                           </Table>
                        </TableContainer>

                        <Typography fontWeight="bold" mb={1}>Remark</Typography>
                        <TextField fullWidth multiline rows={2} value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Enter remarks (max 200 characters)" inputProps={{ maxLength: 200 }} />
                        <Box mt={2} textAlign="right">
                           <Button variant="contained" size="small" sx={{ backgroundColor: "#1976d2", fontWeight: "bold" }} onClick={() => formik.handleSubmit()}>Pay Bill</Button>
                        </Box>
                     </>
                  ) : (
                     <>
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                           <Grid item xs={12} sm={3}>
                              <Autocomplete options={billNoOptions} onChange={(_, v: any) => v && getBillReciept(v.patientCaseID, v.billID)} renderInput={(params) => <TextField {...params} label="Bill No" size="small" />} />
                           </Grid>
                           <Grid item>
                              <IconButton color="primary" onClick={printTable}><PrintIcon /></IconButton>
                           </Grid>
                        </Grid>
                        <Table size="small" id="billing-table">
                           <TableHead sx={{ backgroundColor: '#0288d1' }}>
                              <TableRow>
                                 {["Test", "Payable %", "Final Gross Amt", "Net Amt", "Remark"].map((col) => (
                                    <TableCell key={col} sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>{col}</TableCell>
                                 ))}
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {billReceiptData.length === 0 ? <TableRow><TableCell colSpan={5} align="center">No data found</TableCell></TableRow> :
                                 billReceiptData.map((row, idx) => (
                                    <TableRow key={idx}>
                                       <TableCell align="center">{row.invParameterName}</TableCell>
                                       <TableCell align="center">{row.compRebate}</TableCell>
                                       <TableCell align="center">{row.finalGrossAmount}</TableCell>
                                       <TableCell align="center">{row.netAmount}</TableCell>
                                       <TableCell align="center">{row.remark}</TableCell>
                                    </TableRow>
                                 ))}
                           </TableBody>
                           <TableFooter sx={{ backgroundColor: '#f5f5f5' }}>
                              {billReceiptData1.map((row, idx) => (
                                 <React.Fragment key={idx}>
                                    <TableRow>
                                       <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Total Net Amt</TableCell>
                                       <TableCell colSpan={3} align="left">{row.totNetAmount}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                       <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Total Received Amt</TableCell>
                                       <TableCell colSpan={3} align="left">{row.actualPayAmt}</TableCell>
                                    </TableRow>
                                 </React.Fragment>
                              ))}
                           </TableFooter>
                        </Table>
                     </>
                  )}
               </Paper>
            </Paper>
         )}

         {maintab === 1 && <PatientPharmacyBilling />}
         {maintab === 2 && <PayPartialPharmacyBilling />}
      </Container>
   );
};

const Info = ({ label, value }: { label: string; value: any }) => (
   <Grid item xs={12} sm={6} md={4}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={500}>{value || "-"}</Typography>
   </Grid>
);

export default PatientBilling;
