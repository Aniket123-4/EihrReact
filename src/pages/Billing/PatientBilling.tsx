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
import { deepPurple } from '@mui/material/colors';
import api from "../../utils/Url";
import { useFormik } from 'formik';
import { getISTDate } from '../../utils/Constant';
import { toast, ToastContainer } from 'react-toastify';
import PatientPharmacyBilling from './PatientPharmacyBilling';
import PayPartialPharmacyBilling from './PayPartialPharmacyBilling';

const PatientBilling = () => {
   const { defaultValues, defaultValuestime } = getISTDate();
   const [maintab, setMainTab] = useState(0);
   const [tab, setTab] = useState(0);
   const [generateBillData, setGenerateBillData] = useState([]);
   const [billReceiptData, setBillReceiptData] = useState<any>([]);
   const [billReceiptData1, setBillReceiptData1] = useState<any>([]);

   const [patients, setPatients] = useState<any[]>([]);
   const [selectedPatient, setSelectedPatient] = useState<any>(null);
   const [patientInfo, setPatientInfo] = useState<any>(null);
   const [visitInfo, setVisitInfo] = useState<any>(null);
   const [caseData, setCaseData] = useState<any>([]);
   const [Case, setCase] = useState("");
   const [testDetails, setTestDetails] = useState<any>([]);
   const [billSummary, setBillSummary] = useState<any>([]);
   const [remark, setRemark] = useState("");
   const [billNoOptions, setBillNoOptions] = useState<any>([]);


   const [typPatientBill, settypPatientBill] = useState<any>([
      {
         "col1": "",
         "col2": "",
         "col3": "",
         "col4": "",
         "col5": "",
         "col6": "",
         "col7": "",
         "col8": "",
         "col9": "",
         "col10": "",
         "col11": "",
         "col12": "",
         "col13": "",
         "col14": "",
         "col15": "",
         "col16": "",
         "col17": "",
         "col18": "",
         "col19": "",
         "col20": "",
         "col21": "",
         "col22": "",
         "col23": "",
         "col24": "",
         "col25": "",
         "col26": "",
         "col27": "",
         "col28": "",
         "col29": "",
         "col30": "",
         "col31": "",
         "col32": "",
         "col33": "",
         "col34": "",
         "col35": "",
         "col36": "",
         "col37": "",
         "col38": "",
         "col39": "",
         "col40": ""
      }
   ]);

   useEffect(() => {
      fetchPatientList();
   }, []);

   const fetchPatientList = async () => {
      try {
         const res = await api.post("/FnGetPatientSearch", {
            patientNo: "",
            patientName: "",
            userID: -1,
            formID: -1,
            type: 1,
         });
         if (res.data.isSuccess) {
            setPatients(res.data.result);
         }
      } catch (error) {
         console.error("Fetch patient error:", error);
      }
   };

   const handlePatientSelect = async (patient: any) => {
      setSelectedPatient(patient);
      try {
         const headerRes = await api.post("/GetPatientHeader", {
            patientNo: patient.patientNo,
            patientID: -1,
            userID: -2,
            formID: 1,
            type: 1,
         });

         if (headerRes.data.isSuccess) {
            const patientData = headerRes.data.result1?.[0];
            const photoData = headerRes.data.result2?.[0];
            const caseData = headerRes.data.result3?.[0];

            setPatientInfo({
               ...patientData,
               photo: photoData?.photo,
               caseNo: caseData?.patientCaseNo,
               patientCaseID: caseData?.patientCaseID,
            });

            const caseArr = headerRes.data.result3.map((item: any) => {
               return {
                  ...item,
                  value: item.patientCaseID,
                  label: item.patientCaseNo
               }
            })
            setCaseData(caseArr);
            setCase(caseData?.patientCaseNo)

            getPatientBill(headerRes.data.result3[0].patientCaseID || "")
            getPatientBillNumber(headerRes.data.result3[0].patientCaseID || "")

            const visitRes = await api.post("/GetPatientVisitNo", {
               patientCaseID: caseData?.patientCaseID,
               patientCaseNo: 1,
               userID: -1,
               formID: -1,
               type: 1,
            });

            if (visitRes.data.isSuccess) {
               setVisitInfo(visitRes.data.result?.[0]);
            }
         }
      } catch (error) {
         console.error("Fetch header/visit info error:", error);
      }
   };


   const getPatientBill = async (caseID: string) => {
      try {
         const payload = {
            "patientCaseID": caseID,
            "patientCaseNo": "",
            "admNo": "1",
            "patientBillID": -1,
            "userID": -1,
            "formID": -1,
            "type": 1
         }
         const billRes = await api.post(`GetPatientBill`, payload);

         setTestDetails(billRes.data.result1 || []);
         setBillSummary(billRes.data.result2 || []);
         setRemark(billRes.data.result1[0].remark || "")

         settypPatientBill([
            {
               "col1": billRes.data.result1[0].patientBillID,
               "col2": billRes.data.result1[0].patientBillCompID,
               "col3": billRes.data.result1[0].patientID,
               "col4": billRes.data.result1[0].patientCaseID,
               "col5": billRes.data.result1[0].admNo,
               "col6": billRes.data.result1[0].invGroupID,
               "col7": billRes.data.result1[0].discountParameterID,
               "col8": billRes.data.result1[0].invParameterID,
               "col9": billRes.data.result1[0].noOfDays,
               "col10": billRes.data.result1[0].quantityPerDay,
               "col11": billRes.data.result1[0].compID,
               "col12": billRes.data.result1[0].compRebate,
               "col13": billRes.data.result1[0].insuranceCompID,
               "col14": billRes.data.result1[0].insuranceRebate,
               "col15": billRes.data.result1[0].grossAmount,
               "col16": billRes.data.result1[0].netAmount,
               "col17": billRes.data.result1[0].finalGrossAmount,
               "col18": billRes.data.result1[0].isConsultency ? "1" : "0",
               "col19": billRes.data.result1[0].isMedic ? "1" : "0",
               "col20": billRes.data.result1[0].isRoom ? "1" : "0",
               "col21": billRes.data.result1[0].isManual ? "1" : "0",
               "col22": billRes.data.result1[0].remark || remark,
               "col23": billRes.data.result1[0].barCode,
               "col24": "",
               "col25": "",
               "col26": "",
               "col27": "",
               "col28": "",
               "col29": "",
               "col30": "",
               "col31": "",
               "col32": "",
               "col33": "",
               "col34": "",
               "col35": "",
               "col36": "",
               "col37": "",
               "col38": "",
               "col39": "",
               "col40": ""
            }
         ])


      } catch (error) {
         console.log(error);
      }

   }


   const printTable = () => {
      const tableContent = document.getElementById("billing-table")?.outerHTML;
      if (!tableContent) return;

      const printWindow = window.open("", "", "height=800,width=1000");
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>Billing Details - Print or Save</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 30px;
                color: #333;
              }
              h2 {
                text-align: center;
                margin-bottom: 20px;
                color: #1976d2;
                border-bottom: 2px solid #1976d2;
                padding-bottom: 10px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                font-size: 14px;
              }
              th, td {
                border: 1px solid #ccc;
                padding: 10px;
                text-align: center;
              }
              thead {
                background-color: #0288d1;
                color: white;
              }
              tfoot {
                background-color: #f5f5f5;
                font-weight: bold;
              }
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                h2 {
                  page-break-before: avoid;
                }
              }
            </style>
          </head>
          <body>
            <h2>Billing Details Receipt</h2>
            ${tableContent}
          </body>
        </html>
      `);

      printWindow.document.close();

      // ✅ Wait for full load before printing
      printWindow.onload = () => {
         setTimeout(() => {
            printWindow.print();
            printWindow.close();
         }, 500); // Small delay ensures proper rendering
      };
   };




   const getBillReciept = async (caseId: string, billId: string) => {
      try {
         const payload = {
            "patientCaseID": caseId,
            "patientCaseNo": "",
            "admNo": "1",
            "patientBillID": billId,
            "userID": -1,
            "formID": -1,
            "type": 1
         }
         const billRes = await api.post(`GetPatientBill`, payload);
         setBillReceiptData(billRes.data.result1 || []);
         setBillReceiptData1(billRes.data.result2 || []);

      } catch (error) {
         console.log(error)
      }
   }

   const getPatientBillNumber = async (caseID) => {
      try {
         const payload = { "patientCaseID": caseID, "patientCaseNo": "", "admNo": "1", "isCancel": false, "userID": -1, "formID": -1, "type": 2 };
         const response = await api.post("GetPatientBillNo", payload);
         if (response.data.isSuccess) {
            const data = response.data.result;
            const arr = data.map((item) => {
               return {
                  ...item,
                  label: item.billNo,
                  value: item.billID
               }
            })
            setBillNoOptions(arr);
         }

      } catch (error) {
         console.log(error)
      }

   }

   const handleDeleteTest = (indexToDelete: number) => {
      setTestDetails(prev => prev.filter((_, index) => index !== indexToDelete));
   };

   const handleMainTabChange = (_: React.SyntheticEvent, newValue: number) => {
      setMainTab(newValue);
   };

   const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
      setTab(newValue);
   };


   const formik = useFormik({
      initialValues: {
         "typPatientBill": [],
         "totDiscountAmt": 0,
         "billDate": defaultValues,
         "patientBillID": -1,
         "paidAmt": 0,
         "payDate": "",
         "payTypeID": -1,
         "payTypeNo": "",
         "payTypeDetail": "",
         "isCancel": false,
         "userID": -1,
         "formID": -1,
         "type": 1
      },
      onSubmit: async (values) => {
         try {
            const response = await api.post('AddPatientBill', { ...values, typPatientBill: typPatientBill });
            if (response.data.isSuccess) {
               toast.success(response.data.msg);
            }
            else {
               toast.error(response.data.msg)
            }

         } catch (error) {
            console.log(error);
         }
      }
   })

   return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
         <Tabs
            value={maintab}
            onChange={handleMainTabChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}
         >
            <Tab label="Patient Billing" />
            <Tab label="Patient Pharmacy Billing" />
            <Tab label="Pay Partial Pharmacy Billing" />
         </Tabs>

         <ToastContainer />

         {maintab === 0 && (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
               <Typography variant="h5" fontWeight="bold" gutterBottom>
                  🧾 Patient Billing Details
               </Typography>

               {/* Patient Search */}
               <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={4} md={3}>
                     <Autocomplete
                        disablePortal
                        options={patients}
                        getOptionLabel={(option) => option.patientName || ""}
                        value={selectedPatient}
                        onChange={(e, newValue) => {
                           if (newValue) {
                              handlePatientSelect(newValue);
                           } else {
                              setSelectedPatient(null);
                              setPatientInfo(null);
                              setVisitInfo(null);
                           }
                        }}
                        renderInput={(params) => (
                           <TextField {...params} label="Search Patient" size="small" />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                     <TextField
                        label="Patient No"
                        value={selectedPatient?.patientNo || ""}
                        fullWidth
                        size="small"
                     />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                     <Autocomplete
                        disablePortal
                        options={caseData}
                        value={Case}
                        onChange={(e, newValue: any) => {
                           if (!newValue) return;
                           getPatientBill(newValue.patientCaseID)
                           getPatientBillNumber(newValue.patientCaseID)
                           setCase(newValue?.patientCaseNo || "")
                        }}
                        renderInput={(params) => (
                           <TextField {...params} label="Case No" size="small" />
                        )}
                     />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                     <TextField
                        label="Admission No"
                        value={visitInfo?.admNo || ""}
                        fullWidth
                        size="small"
                     />
                  </Grid>
               </Grid>

               {/* Patient Info */}
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
                           <Box
                              component="img"
                              src={`data:image/jpeg;base64,${patientInfo.photo}`}
                              alt="Patient"
                              sx={{
                                 width: 150,
                                 height: 150,
                                 objectFit: "cover",
                                 borderRadius: 2,
                                 border: "2px solid #ccc",
                              }}
                           />
                        </Grid>
                     </Grid>
                  </Paper>
               )}

               {/* Billing Tabs */}
               <Tabs value={tab} onChange={handleTabChange} sx={{ mt: 4, borderBottom: 1, borderColor: 'divider' }}>
                  <Tab label="Generate Bill" />
                  <Tab label="Bill Receipt" />
               </Tabs>

               {/* Billing Table */}
               <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
                  {tab === 0 ? (
                     <>
                        {/* Billing Details Table */}
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
                                          <TableCell>0.00</TableCell>
                                          <TableCell>{test.netAmount}</TableCell>
                                          <TableCell>
                                             <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => handleDeleteTest(index)}
                                             >
                                                Delete
                                             </Button>
                                          </TableCell>
                                       </TableRow>
                                    ))}
                              </TableBody>
                           </Table>
                        </TableContainer>

                        {/* Billing Summary Table */}
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

                        {/* Remark Section and Pay Button */}
                        <Typography fontWeight="bold" mb={1}>
                           Remark
                        </Typography>
                        <TextField
                           fullWidth
                           multiline
                           rows={2}
                           value={remark}
                           onChange={(e) => setRemark(e.target.value)}
                           placeholder="Enter remarks (max 200 characters)"
                           inputProps={{ maxLength: 200 }}
                        />
                        <Box mt={2} textAlign="right">
                           <Button
                              variant="contained"
                              size="small"
                              sx={{
                                 backgroundColor: "#1976d2",
                                 "&:hover": { backgroundColor: "#1565c0" },
                                 fontWeight: "bold",
                                 textTransform: "none",
                              }}
                              onClick={() => formik.handleSubmit()}
                           >
                              Pay Bill
                           </Button>
                        </Box>
                     </>

                  ) : (
                     <>
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                           <Grid item xs={12} sm={3}>
                              <Autocomplete
                                 disablePortal
                                 fullWidth
                                 options={billNoOptions}
                                 // value={Case}
                                 onChange={(e, newValue: any) => {
                                    if (!newValue) return;
                                    getBillReciept(newValue.patientCaseID, newValue.billID)

                                 }}
                                 renderInput={(params) => (
                                    <TextField {...params} label="Bill No" size="small" />
                                 )}
                              />
                           </Grid>
                           <Grid item>
                              <IconButton color="primary" onClick={printTable}>
                                 <PrintIcon />
                              </IconButton>
                           </Grid>
                        </Grid>
                        <Table size="small" id="billing-table">
                           {/* Table Head */}
                           <TableHead sx={{ backgroundColor: '#0288d1' }}>
                              <TableRow>
                                 {["Test", "Payable %", "Final Gross Amt", "Net Amt", "Remark"].map((col) => (
                                    <TableCell
                                       key={col}
                                       sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', py: 1 }}
                                    >
                                       {col}
                                    </TableCell>
                                 ))}
                              </TableRow>
                           </TableHead>

                           {/* Table Body */}
                           <TableBody>
                              {billReceiptData.length === 0 ? (
                                 <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ fontStyle: 'italic', py: 2 }}>
                                       No data found
                                    </TableCell>
                                 </TableRow>
                              ) : (
                                 billReceiptData.map((row, idx) => (
                                    <TableRow key={idx} hover>
                                       <TableCell align="center">{row.invParameterName}</TableCell>
                                       <TableCell align="center">{row.compRebate}</TableCell>
                                       <TableCell align="center">{row.finalGrossAmount}</TableCell>
                                       <TableCell align="center">{row.netAmount}</TableCell>
                                       <TableCell align="center">{row.remark}</TableCell>
                                    </TableRow>
                                 ))
                              )}
                           </TableBody>

                           {/* Table Footer */}
                           <TableFooter sx={{ backgroundColor: '#f5f5f5' }}>
                              {billReceiptData1.length === 0 ? (
                                 ""
                              ) : (
                                 billReceiptData1.map((row, idx) => (
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
                                 ))
                              )}
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
      <Typography variant="body2" color="text.secondary" gutterBottom>
         {label}
      </Typography>
      <Typography fontWeight={500}>{value || "-"}</Typography>
   </Grid>
);

export default PatientBilling;

