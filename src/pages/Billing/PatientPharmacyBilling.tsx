import React, { useState, useEffect } from 'react';
import {
   Autocomplete,
   Box,
   Button,
   Container,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   Grid,
   IconButton,
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
   Typography,
   CircularProgress
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import api from "../../utils/Url";
import { useFormik } from 'formik';
import { getISTDate } from '../../utils/Constant';
import { toast, ToastContainer } from 'react-toastify';

// --- RAZORPAY GLOBAL TYPE ---
declare global {
   interface Window {
      Razorpay: any;
   }
}

// --- UTILITY TO LOAD RAZORPAY SCRIPT ---
const loadRazorpayScript = () => {
   return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
   });
};

interface PaymentModalProps {
   open: boolean;
   onClose: () => void;
   onPay: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ open, onClose, onPay }) => {
   return (
      <Dialog
         open={open}
         onClose={onClose}
         PaperProps={{ sx: { borderRadius: 5, px: 3, py: 2, minWidth: 400, boxShadow: 20, bgcolor: 'background.paper' } }}
      >
         <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0 }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main">Payment Info</Typography>
            <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}><CloseIcon fontSize="small" /></IconButton>
         </DialogTitle>
         <DialogContent>
            <Box sx={{ mt: 3, mb: 2, p: 2, borderRadius: 2, bgcolor: 'success.lighter', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Typography variant="body1" fontWeight={600} color="success.dark" textAlign="center">
                  Patient bill details successfully inserted
               </Typography>
            </Box>
         </DialogContent>
         <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button variant="contained" color="success" onClick={onPay} sx={{ borderRadius: 3, px: 5, fontWeight: 'bold', textTransform: 'capitalize', boxShadow: 3, ':hover': { boxShadow: 5 } }}>
               Pay Now
            </Button>
         </DialogActions>
      </Dialog>
   );
};

const PatientPharmacyBilling = () => {
   const { defaultValues } = getISTDate();
   const [tab, setTab] = useState(0);
   const [billReceiptData, setBillReceiptData] = useState<any>([]);
   const [billReceiptData1, setBillReceiptData1] = useState<any>([]);

   const [patients, setPatients] = useState<any[]>([]);
   const [selectedPatient, setSelectedPatient] = useState<any>(null);
   const [patientInfo, setPatientInfo] = useState<any>(null);
   const [visitInfo, setVisitInfo] = useState<any>(null);
   const [caseData, setCaseData] = useState<any>([]);
   const [Case, setCase] = useState("");
   const [remark, setRemark] = useState("");
   const [billNoOptions, setBillNoOptions] = useState<any>([]);
   const [selectedBillNo, setSelectedBillNo] = useState<any>(null);

   const [doctorDetail, setDoctorDetail] = useState<any>([]);
   const [medicineDetail, setMedicineDetail] = useState<any>([]);

   const [itemBalance, setItemBalance] = useState<any[]>([]);
   const [showTable, setShowTable] = useState(false);
   const [anchorPos, setAnchorPos] = useState({ x: 0, y: 0 });

   // Exact State format used by AntD Calculations
   const [billPayload, setbillPayload] = useState({ 
      grossAmt: "0.00", 
      finalGrossAmt: "0.00", 
      discountAmt: "0.00", 
      balanceAmt: "0.00", 
      netAmt: "0.00", 
      actPayAmt: "", 
      defaultTotalPayable: 0 
   });

   const [modalOpen, setModalOpen] = useState(false);
   const [finalBillPayload, setFinalBillPayload] = useState<any>();

   const [pdfModalOpen, setPdfModalOpen] = useState(false);
   const [pdfBase64, setPdfBase64] = useState("");
   const [isPdfLoading, setIsPdfLoading] = useState(false);

   useEffect(() => {
      fetchPatientList();
   }, []);

   const fetchPatientList = async () => {
      try {
         const res = await api.post("/FnGetPatientSearch", { patientNo: "", patientName: "", userID: -1, formID: -1, type: 1 });
         if (res.data.isSuccess) setPatients(res.data.result);
      } catch (error) { console.error("Fetch patient error:", error); }
   };

   const handlePatientSelect = async (patient: any) => {
      setSelectedPatient(patient);
      try {
         const headerRes = await api.post("/GetPatientHeader", { patientNo: patient.patientNo, patientID: -1, userID: -2, formID: 1, type: 1 });
         if (headerRes.data.isSuccess) {
            const patientData = headerRes.data.result1?.[0];
            const photoData = headerRes.data.result2?.[0];
            const caseData = headerRes.data.result3?.[0];

            setPatientInfo({ ...patientData, photo: photoData?.photo, caseNo: caseData?.patientCaseNo, patientCaseID: caseData?.patientCaseID });

            const caseArr = headerRes.data.result3.map((item: any) => ({ ...item, value: item.patientCaseID, label: item.patientCaseNo }));
            setCaseData(caseArr);
            setCase(caseData?.patientCaseNo);

            getPatientBill(caseData?.patientCaseID || "");
            getPatientBillNumber(caseData?.patientCaseID || "");

            const visitRes = await api.post("/GetPatientVisitNo", { patientCaseID: caseData?.patientCaseID, patientCaseNo: 1, userID: -1, formID: -1, type: 1 });
            if (visitRes.data.isSuccess) setVisitInfo(visitRes.data.result?.[0]);
         }
      } catch (error) { console.error("Fetch header/visit info error:", error); }
   };

   // Fetch Medicines when Case ID changes
   const getPatientBill = async (caseID: string) => {
      try {
         const payload = { patientCaseID: caseID, patientCaseNo: "", admNo: "1", patientBillID: -1, userID: -1, formID: -1, type: 1 };
         const billRes = await api.post(`GetPatientPharmaBill`, payload);
         if (billRes.data.isSuccess) {
            const meds = billRes.data.result1 || [];
            setMedicineDetail(meds);
            setDoctorDetail(billRes.data.result3 || []);
            updateTotals(meds); // Calculate initial totals immediately
         }
      } catch (error) { console.log(error); }
   };

   const getPatientBillNumber = async (caseID: any) => {
      try {
         const payload = { patientCaseID: caseID, patientCaseNo: "", admNo: "1", isCancel: false, userID: -1, formID: -1, type: 1 };
         const response = await api.post("GetPatientBillNo", payload);
         if (response.data.isSuccess) {
            const data = response.data.result.filter((item: any) => item.billID !== "-1");
            const arr = data.map((item: any) => ({ ...item, label: item.billNo, value: item.billID }));
            setBillNoOptions(arr);
         }
      } catch (error) { console.log(error); }
   };

   const getBillReciept = async (caseId: string, billId: string): Promise<void> => {
      try {
         const payload = { patientCaseID: caseId, patientCaseNo: "", admNo: "1", patientBillID: billId, userID: -1, formID: -1, type: 1 };
         const { data } = await api.post("GetPatientPharmaBill", payload);
         if (data?.isSuccess) {
            setBillReceiptData(data.result1 ?? []);
            setBillReceiptData1(data.result2 ?? []);
         }
      } catch (error) { console.error("Error fetching bill receipt:", error); }
   };

   // ======================== CORE CALCULATIONS (AntD Replica) ========================
   const updateTotals = (medList: any[], customPayAmt: any = null) => {
      let totGross = 0, totFinalGross = 0, totNet = 0, totDiscount = 0, vatSum = 0;
      
      medList.forEach(item => {
         totGross += parseFloat(item.grossAmount || 0);
         totFinalGross += parseFloat(item.finalGrossAmount || 0);
         totNet += parseFloat(item.netAmount || 0);
         totDiscount += parseFloat(item.remainingAmt || 0); 
         vatSum += (parseFloat(item.netAmount || 0) * parseFloat(item.netAmountVATPercent || 0)) / 100;
      });

      const defaultActualPay = totNet + vatSum;
      const actualPay = customPayAmt !== null && customPayAmt !== "" ? parseFloat(customPayAmt || 0) : defaultActualPay;
      const balance = defaultActualPay - actualPay;

      setbillPayload({
         grossAmt: totGross.toFixed(2),
         finalGrossAmt: totFinalGross.toFixed(2),
         discountAmt: totDiscount.toFixed(2),
         netAmt: totNet.toFixed(2),
         actPayAmt: customPayAmt !== null ? customPayAmt : defaultActualPay.toFixed(2), 
         balanceAmt: balance.toFixed(2),
         defaultTotalPayable: defaultActualPay 
      });
   };

   const handleQuantityChange = (row: any, value: string) => {
      const qty = parseInt(value || "0");
      const newMedList = medicineDetail.map((item: any) => {
         if (item.invParameterID === row.invParameterID) {
            const price = parseFloat(item.salePricePerUnit || 0);
            const rebate = parseFloat(item.compRebate || 100);
            const gross = price * qty;
            const net = (gross * rebate) / 100;
            const remaining = gross - net;
            return { ...item, qty, grossAmount: gross, finalGrossAmount: net, netAmount: net, remainingAmt: remaining };
         }
         return item;
      });
      setMedicineDetail(newMedList);
      updateTotals(newMedList, billPayload.actPayAmt);
   };

   const getItemBalance = async (itemID: string, event: React.MouseEvent) => {
      setAnchorPos({ x: event.clientX, y: event.clientY }); 
      setShowTable(true); 
      try {
         const payload = { baarCode: "", itemID: itemID, itemCatID: -1, sectionID: -1, fundID: -1, productID: -1, unitID: -1, curDate: new Date().toISOString(), userID: -1, formID: -1, type: 2 };
         const response = await api.post("InventoryForm/GetItemBalanceWithBaarCode_1", payload);
         setItemBalance(response.data.result || []);
      } catch (error) { console.log(error); }
   };

   const setUnitPrice = (row: any, voucherItem: any) => {
      const newMedList = medicineDetail.map((item: any) => {
         if (item.invParameterID === row.invParameterID) {
            const price = parseFloat(voucherItem.salePricePerUnit || 0);
            const qty = parseInt(item.qty || 1);
            const rebate = parseFloat(item.compRebate || 100);
            const gross = price * qty;
            const net = (gross * rebate) / 100;
            const remaining = gross - net;

            return { 
               ...item, 
               salePricePerUnit: price,
               finalSalePricePerUnit: price,
               expDate: voucherItem.eslDate,
               itemInID: voucherItem.itemInID,
               itemCatID: voucherItem.itemCatID,
               unitID: voucherItem.unitID,
               productID: voucherItem.productID,
               grossAmount: gross, 
               finalGrossAmount: net, 
               netAmount: net, 
               remainingAmt: remaining 
            };
         }
         return item;
      });
      setMedicineDetail(newMedList);
      updateTotals(newMedList); 
      setShowTable(false); 
   };

   const handleDeleteMedicine = (record: any) => {
      const filteredList = medicineDetail.filter((item: any) => item.patientBillCompID !== record.patientBillCompID);
      setMedicineDetail(filteredList);
      updateTotals(filteredList);
   };

   const handleActualPayChange = (val: string) => {
      const payAmt = parseFloat(val) || 0;
      const balance = billPayload.defaultTotalPayable - payAmt;
      setbillPayload(prev => ({ ...prev, actPayAmt: val, balanceAmt: balance.toFixed(2) }));
   };
   // =================================================================================

   const formik = useFormik({
      initialValues: { billDate: defaultValues },
      onSubmit: async (values) => {
         const amtList = medicineDetail.map((item: any) => item.netAmount);
         const isSubmit = amtList.every((el: any) => parseFloat(el) > 0);

         if (!isSubmit) { toast.error("Please Set All Medicine Price"); return; }
         if (remark.length === 0) { toast.error("Please add a remark"); return; }

         const typPatientBillMapped = medicineDetail.map((item: any) => ({
            "col1": item?.patientBillID?.toString() || "-1",
            "col2": item?.patientBillCompID?.toString() || "-1",
            "col3": item?.patientID?.toString() || "",
            "col4": item?.patientCaseID?.toString() || "",
            "col5": item?.admNo?.toString() || "1",
            "col6": item?.invGroupID?.toString() || "-1",
            "col7": item?.discountParameterID?.toString() || "-1",
            "col8": item?.invParameterID?.toString() || "",
            "col9": item?.noOfDays?.toString() || "1",
            "col10": item?.quantityPerDay?.toString() || "1",
            "col11": item?.compID?.toString() || "-1",
            "col12": item?.compRebate?.toString() || "100",
            "col13": item?.insuranceCompID?.toString() || "-1",
            "col14": item?.insuranceRebate?.toString() || "0",
            "col15": item?.grossAmount?.toString() || "0",
            "col16": item?.netAmount?.toString() || "0",
            "col17": item?.finalGrossAmount?.toString() || "0",
            "col18": item?.isConsultency ? "1" : "0",
            "col19": item?.isMedic ? "1" : "0",
            "col20": item?.isRoom ? "1" : "0",
            "col21": item?.isManual ? "1" : "0",
            "col22": remark,
            "col23": item?.barCode?.toString() || "",
            "col24": item?.qty?.toString() || "0",
            "col25": item?.itemInID?.toString() || "-1",
            "col26": item?.itemCatID?.toString() || "-1",
            "col27": item?.productID?.toString() || "-1",
            "col28": item?.unitID?.toString() || "-1",
            "col29": item?.salePricePerUnit?.toString() || "0.000",
            "col30": item?.finalSalePricePerUnit?.toString() || "0.000",
            "col31": "", "col32": "", "col33": "", "col34": "", "col35": "",
            "col36": "", "col37": "", "col38": "", "col39": "", "col40": ""
         }));

         const payloadType1 = {
            "typPatientBill": typPatientBillMapped,
            "totDiscountAmt": parseFloat(billPayload.discountAmt),
            "billDate": values.billDate,
            "patientBillID": -1, 
            "paidAmt": billPayload.actPayAmt.toString() || "0",
            "payDate": "",
            "payTypeID": -1,
            "payTypeNo": "",
            "payTypeDetail": "",
            "isCancel": false,
            "userID": -1,
            "formID": -1,
            "type": 1 
         };

         try {
            const res = await api.post('AddPatientPharmaBill', payloadType1);
            if (res.data.isSuccess) {
               toast.success(res.data.msg);
               const generatedBillID = res.data.result[0].billID.toString();
               const updatedTypPatientBillForPay = typPatientBillMapped.map(row => ({ ...row, "col1": generatedBillID }));

               setFinalBillPayload({
                  ...payloadType1,
                  "typPatientBill": updatedTypPatientBillForPay,
                  "patientBillID": generatedBillID, 
               });

               setModalOpen(true); 
            } else { toast.error(res.data.msg); }
         } catch (error) { toast.error("Internal Server Error (500)"); }
      }
   });

   const handlePay = async () => {
      const res = await loadRazorpayScript();
      if (!res) { toast.error("Razorpay SDK failed to load."); return; }

      const amountToPay = parseFloat(finalBillPayload.paidAmt) || 0;
      if (amountToPay <= 0) { toast.error("Invalid amount for payment."); return; }

      const options = {
         key: "rzp_test_SYZuRxwlKGWymN", // ⚠️ ADD YOUR TEST/LIVE KEY HERE
         amount: Math.round(amountToPay * 100), 
         currency: "INR",
         name: "Hospital Pharmacy",
         description: `Pharmacy Bill for Case: ${patientInfo?.caseNo || ''}`,
         handler: async function (response: any) {
            const payParams = {
               ...finalBillPayload,
               type: 2, 
               payTypeDetail: "Razorpay",
               payTypeNo: response.razorpay_payment_id, 
            };

            try {
               const apiRes = await api.post('AddPatientPharmaBill', payParams);
               if (apiRes.data.isSuccess) {
                  toast.success("Payment Successful & Bill Updated!");
                  setModalOpen(false);
                  setMedicineDetail([]);
                  setRemark("");
                  updateTotals([]); 
                  if (patientInfo?.patientCaseID) getPatientBillNumber(patientInfo.patientCaseID);
               } else { toast.error(apiRes.data.msg); }
            } catch (error) { toast.error("Failed to update database."); }
         },
         prefill: {
            name: patientInfo?.candName || "Patient",
            email: patientInfo?.email || "patient@example.com",
            contact: patientInfo?.curMobileNo || "9999999999",
         },
         theme: { color: "#1976d2" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
         toast.error(`Payment Failed: ${response.error.description}`);
      });
      paymentObject.open();
   };

   // --- PDF PREVIEW ---
   const printTablePDF = async () => {
      if (!selectedBillNo) { toast.warning("Please select a Bill No first"); return; }
      setIsPdfLoading(true);
      try {
         const payload = {
            patientCaseID: patientInfo?.patientCaseID || "",
            patientCaseNo: "", admNo: "1", patientBillID: selectedBillNo.billID,
            userID: -1, formID: -1, type: 1, show: false, exportOption: ".pdf"
         };
         const res = await api.post("Reports/GetPatientPharmaBill", payload);
         if (res.data) {
            setPdfBase64(res.data.result);
            setPdfModalOpen(true);
         } else { toast.error(res.data.msg || "Failed to fetch PDF"); }
      } catch (error) { toast.error("Error fetching PDF receipt"); }
      setIsPdfLoading(false);
   };

   // --- CANCEL BILL ---
   const handleCancelBill = async () => {
      if (!selectedBillNo) return;
      if (!window.confirm("Are you sure you want to cancel this bill?")) return;

      try {
         const payload = {
            typPatientBill: [], totDiscountAmt: 0, billDate: defaultValues,
            patientBillID: selectedBillNo.billID, paidAmt: 0, payDate: "", payTypeID: -1,
            payTypeNo: "", payTypeDetail: "", isCancel: true, userID: -1, formID: -1, type: 2
         };
         const res = await api.post("AddPatientPharmaBill", payload);
         if (res.data.isSuccess) {
            toast.success(res.data.msg);
            setBillReceiptData([]); setBillReceiptData1([]); setSelectedBillNo(null);
            getPatientBillNumber(patientInfo?.patientCaseID); 
         } else { toast.error(res.data.msg); }
      } catch (error) { toast.error("Cancellation Failed"); }
   };

   return (
      <Container maxWidth="lg">
         <ToastContainer />
         <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
               🧾 Patient Pharmacy Billing Details
            </Typography>

            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
               <Grid item xs={12} sm={4} md={3}>
                  <Autocomplete disablePortal options={patients} getOptionLabel={(option) => option.patientName || ""} value={selectedPatient}
                     onChange={(e, newValue) => { if (newValue) { handlePatientSelect(newValue); } else { setSelectedPatient(null); setPatientInfo(null); setVisitInfo(null); } }}
                     renderInput={(params) => (<TextField {...params} label="Search Patient" size="small" />)}
                  />
               </Grid>
               <Grid item xs={12} sm={3}>
                  <TextField label="Patient No" value={selectedPatient?.patientNo || ""} fullWidth size="small" />
               </Grid>
               <Grid item xs={12} sm={3}>
                  <Autocomplete disablePortal options={caseData} value={Case}
                     onChange={(e, newValue: any) => { if (!newValue) return; getPatientBill(newValue.patientCaseID); getPatientBillNumber(newValue.patientCaseID); setCase(newValue?.patientCaseNo || ""); }}
                     renderInput={(params) => (<TextField {...params} label="Case No" size="small" />)}
                  />
               </Grid>
               <Grid item xs={12} sm={3}>
                  <TextField label="Admission No" value={visitInfo?.admNo || ""} fullWidth size="small" />
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
                        </Grid>
                     </Grid>
                     <Grid item xs={12} md={3} display="flex" justifyContent="center" alignItems="center">
                        <Box component="img" src={`data:image/jpeg;base64,${patientInfo.photo}`} alt="Patient"
                           sx={{ width: 150, height: 150, objectFit: "cover", borderRadius: 2, border: "2px solid #ccc" }} />
                     </Grid>
                  </Grid>
               </Paper>
            )}

            <Tabs value={tab} onChange={(_, newVal) => setTab(newVal)} sx={{ mt: 4, borderBottom: 1, borderColor: 'divider' }}>
               <Tab label="Generate Bill" />
               <Tab label="Bill Receipt" />
            </Tabs>

            <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
               {tab === 0 ? (
                  <>
                     <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 2 }}>
                        <Table size="small">
                           <TableHead sx={{ backgroundColor: "#1976d2" }}>
                              <TableRow>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Doctor</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Department</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Visit No</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Entry Date</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Patient FileNo</TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {doctorDetail.length === 0 ? (
                                 <TableRow><TableCell colSpan={5} align="center">No data available</TableCell></TableRow>
                              ) : (
                                 doctorDetail.map((row: any, index: any) => (
                                    <TableRow key={index} hover>
                                       <TableCell>{row.doctorName}</TableCell>
                                       <TableCell>{row.clinic}</TableCell>
                                       <TableCell>{row.admNo}</TableCell>
                                       <TableCell>{row.entryDate}</TableCell>
                                       <TableCell>{row.patientFileNo}</TableCell>
                                    </TableRow>
                                 ))
                              )}
                           </TableBody>
                        </Table>
                     </TableContainer>

                     <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 2, overflowX: "auto" }}>
                        <Table size="small" sx={{ minWidth: 900 }}>
                           <TableHead sx={{ backgroundColor: "#1976d2" }}>
                              <TableRow>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Medicine</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Dose</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Price/Unit</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Quantity</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Gross Amt</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Payable %</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Disc Amt</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Final Gross Amt</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Net Amount</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Action</TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {medicineDetail.length === 0 ? <TableRow><TableCell colSpan={10} align="center">No data available</TableCell></TableRow> :
                                 medicineDetail.map((row: any, index: any) => (
                                    <TableRow key={index}>
                                       <TableCell>
                                          <Typography sx={{ color: "#1976d2", cursor: "pointer", position: "relative", whiteSpace: "nowrap" }} onClick={(e) => getItemBalance(row.invParameterID, e)}>
                                             {row.invParameterName} ▾
                                          </Typography>

                                          {showTable && (
                                             <Box sx={{ position: "fixed", top: anchorPos.y + 10, left: anchorPos.x + 10, zIndex: 999, backgroundColor: "#fff", borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", p: 2, minWidth: 600 }} onMouseLeave={() => setShowTable(false)}>
                                                <TableContainer component={Paper}>
                                                   <Table size="small">
                                                      <TableHead>
                                                         <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                                                            <TableCell><b>Voucher No</b></TableCell>
                                                            <TableCell><b>Unit</b></TableCell>
                                                            <TableCell><b>Price/Unit</b></TableCell>
                                                            <TableCell><b>Is Billed</b></TableCell>
                                                            <TableCell><b>Expiry Date</b></TableCell>
                                                            <TableCell><b>Balance Qty</b></TableCell>
                                                            <TableCell><b>BalQtySum</b></TableCell>
                                                         </TableRow>
                                                      </TableHead>
                                                      <TableBody>
                                                         {itemBalance.map((item, idx) => (
                                                            <TableRow key={idx} hover>
                                                               <TableCell>
                                                                  <Button variant="outlined" size="small" onClick={() => setUnitPrice(row, item)}>
                                                                     {item.voucherNo}
                                                                  </Button>
                                                               </TableCell>
                                                               <TableCell>{item.unitName}</TableCell>
                                                               <TableCell>{parseFloat(item.salePricePerUnit).toFixed(3)}</TableCell>
                                                               <TableCell>{item.isBilled ? "YES" : "NO"}</TableCell>
                                                               <TableCell>{new Date(item.eslDate).toLocaleDateString()}</TableCell>
                                                               <TableCell>{parseFloat(item.balanceQuantity).toFixed(2)}</TableCell>
                                                               <TableCell>{parseFloat(item.balQuantitySum).toFixed(2)}</TableCell>
                                                            </TableRow>
                                                         ))}
                                                      </TableBody>
                                                   </Table>
                                                </TableContainer>
                                             </Box>
                                          )}
                                       </TableCell>
                                       <TableCell>{row.dose}</TableCell>
                                       <TableCell>{row.salePricePerUnit}</TableCell>
                                       <TableCell>
                                          <TextField type="number" size="small" value={row.qty} onChange={(e) => handleQuantityChange(row, e.target.value)} sx={{ width: 80 }} inputProps={{ min: 1 }} />
                                       </TableCell>
                                       <TableCell>{parseFloat(row.grossAmount || 0).toFixed(2)}</TableCell>
                                       <TableCell>{row.compRebate}</TableCell>
                                       <TableCell>{parseFloat(row.remainingAmt || 0).toFixed(2)}</TableCell>
                                       <TableCell>{parseFloat(row.finalGrossAmount || 0).toFixed(2)}</TableCell>
                                       <TableCell>{parseFloat(row.netAmount || 0).toFixed(2)}</TableCell>
                                       <TableCell>
                                          <Button size="small" color="error" variant="contained" onClick={() => handleDeleteMedicine(row)} sx={{ textTransform: 'none' }}>Delete</Button>
                                       </TableCell>
                                    </TableRow>
                                 ))}
                           </TableBody>
                        </Table>
                     </TableContainer>

                     <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 2 }}>
                        <Table size="small">
                           <TableHead sx={{ backgroundColor: "#1976d2" }}>
                              <TableRow>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Gross Amount</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Final Gross Amount</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Discount Amount</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Balance Amount</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Net Amount</TableCell>
                                 <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>Actual Pay Amount</TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              <TableRow>
                                 <TableCell>{billPayload.grossAmt}</TableCell>
                                 <TableCell>{billPayload.finalGrossAmt}</TableCell>
                                 <TableCell>{billPayload.discountAmt}</TableCell>
                                 <TableCell>{billPayload.balanceAmt}</TableCell>
                                 <TableCell>{billPayload.netAmt}</TableCell>
                                 <TableCell>
                                    <TextField 
                                       type="number" size="small" value={billPayload.actPayAmt} 
                                       onChange={(e) => handleActualPayChange(e.target.value)} 
                                       onFocus={(e) => e.target.select()} sx={{ width: 100 }} 
                                    />
                                 </TableCell>
                              </TableRow>
                           </TableBody>
                        </Table>
                     </TableContainer>

                     <Typography fontWeight="bold" mb={1}>Remark</Typography>
                     <TextField fullWidth multiline rows={2} value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="maxLength is 200" inputProps={{ maxLength: 200 }} />
                     <Box mt={2} textAlign="right">
                        <Button variant="contained" size="small" sx={{ backgroundColor: "#1976d2", fontWeight: "bold", textTransform: "none", px: 4 }} onClick={() => formik.handleSubmit()} >
                           Save Bill
                        </Button>
                     </Box>
                     <PaymentModal open={modalOpen} onClose={() => setModalOpen(false)} onPay={handlePay} />
                  </>
               ) : (
                  <>
                     <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={3}>
                           <Autocomplete disablePortal fullWidth options={billNoOptions}
                              onChange={(e, newValue: any) => {
                                 setSelectedBillNo(newValue);
                                 if (!newValue) { setBillReceiptData([]); setBillReceiptData1([]); return; }
                                 getBillReciept(newValue.patientCaseID, newValue.billID);
                              }}
                              renderInput={(params) => (<TextField {...params} label="Bill No" size="small" />)}
                           />
                        </Grid>
                        {selectedBillNo && billReceiptData.length > 0 && (
                           <Grid item display="flex" gap={1}>
                              <IconButton color="error" onClick={handleCancelBill} title="Cancel Bill"><CancelIcon /></IconButton>
                              <IconButton color="primary" onClick={printTablePDF} disabled={isPdfLoading} title="Print Bill">
                                 {isPdfLoading ? <CircularProgress size={24} /> : <PrintIcon />}
                              </IconButton>
                           </Grid>
                        )}
                     </Grid>

                     <Table size="small" id="billing-table">
                        <TableHead sx={{ backgroundColor: '#0288d1' }}>
                           <TableRow>
                              {['Medicine', 'Qty', 'Payable %', 'Gross Amount', 'Final Gross Amount', 'Net Amount'].map((col) => (
                                 <TableCell key={col} sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', py: 1 }} >{col}</TableCell>
                              ))}
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {billReceiptData.length === 0 ? (
                              <TableRow><TableCell colSpan={6} align="center" sx={{ fontStyle: 'italic', py: 2 }}>No data found</TableCell></TableRow>
                           ) : (
                              billReceiptData.map((row: any, idx: any) => (
                                 <TableRow key={idx} hover>
                                    <TableCell>{row.invParameterName}</TableCell>
                                    <TableCell align="center">{row.qty}</TableCell>
                                    <TableCell align="center">{row.compRebate}</TableCell>
                                    <TableCell align="center">{row.grossAmount}</TableCell>
                                    <TableCell align="center">{row.finalGrossAmount}</TableCell>
                                    <TableCell align="center">{row.netAmount}</TableCell>
                                 </TableRow>
                              ))
                           )}
                        </TableBody>
                        <TableFooter>
                           {billReceiptData1.length > 0 && (
                              <React.Fragment>
                                 <TableRow>
                                    <TableCell colSpan={5} sx={{ fontWeight: 'bold' }}>Total Net Amt</TableCell>
                                    <TableCell align="center">{billReceiptData1[0]?.totNetAmount ?? '0.00'}</TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell colSpan={5} sx={{ fontWeight: 'bold' }}>Total Received Amt</TableCell>
                                    <TableCell align="center">{billReceiptData1[0]?.actualPayAmt ?? '0.00'}</TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell colSpan={5} sx={{ fontWeight: 'bold' }}>Total Balance Amt</TableCell>
                                    <TableCell align="center">{billReceiptData1[0]?.balanceAmt ?? '0.00'}</TableCell>
                                 </TableRow>
                              </React.Fragment>
                           )}
                        </TableFooter>
                     </Table>
                  </>
               )}
            </Paper>
         </Paper>

         {/* BACKEND PDF MODAL */}
         <Dialog open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} fullWidth maxWidth="lg">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
               <Typography variant="h6" fontWeight="bold">Bill Receipt Report</Typography>
               <IconButton onClick={() => setPdfModalOpen(false)}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0, height: '80vh' }}>
               {pdfBase64 ? (
                  <iframe src={`data:application/pdf;base64,${pdfBase64}`} width="100%" height="100%" style={{ border: 'none' }} title="Report PDF" />
               ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                     <Typography>No Report Available</Typography>
                  </Box>
               )}
            </DialogContent>
         </Dialog>
      </Container>
   );
};

const Info = ({ label, value }: { label: string; value: any }) => (
   <Grid item xs={12} sm={6} md={4}>
      <Typography variant="body2" color="text.secondary" gutterBottom>{label}</Typography>
      <Typography fontWeight={500}>{value || "-"}</Typography>
   </Grid>
);

export default PatientPharmacyBilling;
