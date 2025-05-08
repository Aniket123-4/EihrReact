import React, { useState, useEffect, use } from 'react';
import {
   Autocomplete,
   Avatar,
   Box,
   Button,
   Container,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
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
import CloseIcon from '@mui/icons-material/Close';
import { deepPurple } from '@mui/material/colors';
import api from "../../utils/Url";
import { useFormik } from 'formik';
import { getISTDate } from '../../utils/Constant';
import { toast, ToastContainer } from 'react-toastify';


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
         PaperProps={{
            sx: {
               borderRadius: 5,
               px: 3,
               py: 2,
               minWidth: 400,
               boxShadow: 20,
               bgcolor: 'background.paper',
            },
         }}
      >
         <DialogTitle
            sx={{
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               pb: 0,
            }}
         >
            <Typography variant="h6" fontWeight="bold" color="primary.main">
               Payment Info
            </Typography>
            <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
               <CloseIcon fontSize="small" />
            </IconButton>
         </DialogTitle>

         <DialogContent>
            <Box
               sx={{
                  mt: 3,
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'success.lighter', // Light green background
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
               }}
            >
               <Typography
                  variant="body1"
                  fontWeight={600}
                  color="success.dark"
                  textAlign="center"
               >
                  Patient bill details successfully inserted
               </Typography>
            </Box>
         </DialogContent>

         <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button
               variant="contained"
               color="success"
               onClick={onPay}
               sx={{
                  borderRadius: 3,
                  px: 5,
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  boxShadow: 3,
                  ':hover': {
                     boxShadow: 5,
                  },
               }}
            >
               Pay Now
            </Button>
         </DialogActions>
      </Dialog>
   );
};



const PatientPharmacyBilling = () => {
   const { defaultValues, defaultValuestime } = getISTDate();
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


   const [doctorDetail, setDoctorDetail] = useState<any>([]);
   const [medicineDetail, setMedicineDetail] = useState<any>([]);

   const [typPatientBill, settypPatientBill] = useState<any>([]);

   const [itemBalance, setItemBalance] = useState<any[]>([]);
   const [showTable, setShowTable] = useState(false);
   const [anchorPos, setAnchorPos] = useState({ x: 0, y: 0 });

   const [billPayload, setbillPayload] = useState({
      grossAmt: 0,
      finalGrossAmt: 0,
      discountAmt: 0,
      balanceAmt: 0,
      netAmt: 0,
      actPayAmt: 0
   })

   const [modalOpen, setModalOpen] = useState(false);
   const [finalBillPayload, setFinalBillPayload] = useState<any>();

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


   useEffect(() => {
      getPatientBill("");

   }, [])


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
         const billRes = await api.post(`GetPatientPharmaBill`, payload);
         if (billRes.data.isSuccess) {
            setMedicineDetail(billRes.data.result1);
            setDoctorDetail(billRes.data.result3);
         }

         console.log("doctorDetail", doctorDetail);
         console.log("doctorDetail", medicineDetail);



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
                padding: 40px;
                color: #333;
                background-color: #fff;
              }
              h2 {
                text-align: center;
                margin-bottom: 25px;
                color: #1976d2;
                border-bottom: 2px solid #1976d2;
                padding-bottom: 10px;
                font-size: 22px;
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
                background-color: #1976d2;
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
                  zoom: 90%;
                }
                h2 {
                  page-break-before: avoid;
                }
                table {
                  page-break-inside: auto;
                }
                tr {
                  page-break-inside: avoid;
                  page-break-after: auto;
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

      // Wait for print window to fully load before printing
      printWindow.onload = () => {
         setTimeout(() => {
            printWindow.print();
            printWindow.close();
         }, 500);
      };
   };



   const getBillReciept = async (caseId: string, billId: string): Promise<void> => {
      try {
         const payload = {
            patientCaseID: caseId,
            patientCaseNo: "",
            admNo: "1",
            patientBillID: billId,
            userID: -1,
            formID: -1,
            type: 1,
         };

         const { data } = await api.post("GetPatientPharmaBill", payload);

         if (data?.isSuccess) {
            console.log("@@@@", data.result1);
            setBillReceiptData(data.result1 ?? []);
            setBillReceiptData1(data.result2 ?? []);
         } else {
            console.warn("Bill receipt fetch failed.");
            // Optional toast/alert: toast.warning("No billing data found.");
         }
      } catch (error) {
         console.error("Error fetching bill receipt:", error);
         // Optional toast/alert: toast.error("Failed to fetch billing information.");
      }
   };


   const getPatientBillNumber = async (caseID) => {
      try {
         const payload = { "patientCaseID": caseID, "patientCaseNo": "", "admNo": "1", "isCancel": false, "userID": -1, "formID": -1, "type": 1 };
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

   const getItemBalance = async (itemID: string, event: React.MouseEvent) => {
      setAnchorPos({ x: event.clientX, y: event.clientY }); // Track mouse pos
      setShowTable(true); // Show the floating table

      try {
         const payload = {
            baarCode: "",
            itemID: itemID,
            itemCatID: -1,
            sectionID: -1,
            fundID: -1,
            productID: -1,
            unitID: -1,
            curDate: new Date().toISOString(),
            userID: -1,
            formID: -1,
            type: 2,
         };
         const response = await api.post("InventoryForm/GetItemBalanceWithBaarCode_1", payload);
         setItemBalance(response.data.result || []);
      } catch (error) {
         console.log(error);
      }
   };


   const handleQuantityChange = (row, value) => {
      const itemPrice = row.salePricePerUnit;
      const updatedRow = {
         ...row,
         qty: value,
         grossAmount: value * itemPrice,
         finalGrossAmount: (value * itemPrice) * (row.compRebate / 100),
         netAmount: (value * itemPrice) * (row.compRebate / 100),
         discountAmount: (value * itemPrice) * ((100 - row.compRebate) / 100),
      };

      const updatedData = [
         ...medicineDetail.filter(e => e.invParameterID !== row.invParameterID),
         updatedRow,
      ];

      setMedicineDetail(updatedData);
      setBillTableData(updatedData);
      addTableData(updatedRow);
   };


   const setUnitPrice = (row, itemPrice) => {
      const updatedRow = {
         ...row,
         salePricePerUnit: itemPrice,
         grossAmount: row.qty * itemPrice,
         finalGrossAmount: (row.qty * itemPrice) * (row.compRebate / 100),
         netAmount: (row.qty * itemPrice) * (row.compRebate / 100),
         discountAmount: (row.qty * itemPrice) * ((100 - row.compRebate) / 100),
      };

      const updatedData = [
         ...medicineDetail.filter(e => e.invParameterID !== row.invParameterID),
         updatedRow,
      ];

      setMedicineDetail(updatedData);
      setBillTableData(updatedData);
      addTableData(updatedRow);
   };


   const setBillTableData = (data, paidAmount: any = undefined) => {
      let grossAmt = 0;
      let finalGrossAmt = 0;
      let discountAmt = 0;
      let netAmt = 0;
      let totalPayable = 0;
      let actPayAmt = 0;
      let balanceAmt = 0;

      data.forEach(item => {
         grossAmt += item.grossAmount;
         finalGrossAmt += item.finalGrossAmount;
         discountAmt += item.discountAmount;
         netAmt += item.netAmount;
         totalPayable += item.netAmount + ((item.netAmount * (item.netAmountVATPercent || 0)) / 100);
      });

      if (paidAmount === "") {
         // Case: input cleared
         actPayAmt = 0;
         balanceAmt = totalPayable;
      } else if (paidAmount === undefined) {
         // Case: initial load
         actPayAmt = totalPayable;
         balanceAmt = 0;
      } else {
         const paid = parseFloat(paidAmount);
         const isValidPaidAmount = !isNaN(paid) && paid >= 0;
         if (isValidPaidAmount) {
            actPayAmt = paid;
            balanceAmt = totalPayable - paid;
         } else {
            actPayAmt = totalPayable;
            balanceAmt = 0;
         }
      }

      setbillPayload({
         grossAmt,
         finalGrossAmt,
         discountAmt,
         balanceAmt,
         netAmt,
         actPayAmt,
      });
   };

   const addTableData = (row: any) => {
      console.log("rowData", row);

      const index = typPatientBill.findIndex(e => e.col8 === row.invParameterID);

      const dataRow = {
         "col1": row.patientBillID,
         "col2": row.patientBillCompID,
         "col3": row.patientID,
         "col4": row.patientCaseID,
         "col5": row.admNo,
         "col6": row.invGroupID,
         "col7": row.discountParameterID,
         "col8": row.invParameterID,
         "col9": row.noOfDays,
         "col10": row.quantityPerDay,
         "col11": row.compID,
         "col12": row.compRebate,
         "col13": row.insuranceCompID,
         "col14": row.insuranceRebate,
         "col15": row.grossAmount,
         "col16": row.netAmount,
         "col17": row.finalGrossAmount,
         "col18": row.isConsultency ? "1" : "0",
         "col19": row.isMedic ? "1" : "0",
         "col20": row.isRoom ? "1" : "0",
         "col21": row.isManual ? "1" : "0",
         "col22": row.remark,
         "col23": row.barCode,
         "col24": row.qty,
         "col25": row.itemInID,
         "col26": row.itemCatID,
         "col27": row.productID,
         "col28": row.unitID,
         "col29": row.salePricePerUnit,
         "col30": row.finalSalePricePerUnit,
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
      };

      if (index !== -1) {
         // Update existing row
         const updatedList = [...typPatientBill];
         updatedList[index] = dataRow;
         settypPatientBill(updatedList);
      } else {
         // Add new row
         settypPatientBill([...typPatientBill, dataRow]);
      }
   };

   const handleModalClose = () => {
      setModalOpen(false);
   };

   const handlePay = async () => {
      console.log('Payment Triggered');
      try {
         const payload = { ...finalBillPayload, type: 2 }

         const response = await api.post('AddPatientPharmaBill', payload);
         if (response.data.isSuccess) {
            toast.success(response.data.msg);
            setModalOpen(false);
         }
         else {
            toast.error(response.data.msg)
         }
      } catch (error) {
         console.log(error);
      }

   };


   const hideTable = () => {
      setShowTable(false);
   };

   const handleDeleteTest = (indexToDelete: number) => {
      setMedicineDetail(prev => prev.filter((_, index) => index !== indexToDelete));
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
         "paidAmt": "",
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
            console.log("formik", { ...values, totDiscountAmt: billPayload.discountAmt, paidAmt: (billPayload.actPayAmt).toString(), typPatientBill: typPatientBill })
            const response = await api.post('AddPatientPharmaBill', { ...values, totDiscountAmt: billPayload.discountAmt, paidAmt: (billPayload.actPayAmt).toString(), typPatientBill: typPatientBill });
            if (response.data.isSuccess) {
               toast.success(response.data.msg);
               setFinalBillPayload({ ...values, patientBillID: response.data.result[0].billID, totDiscountAmt: billPayload.discountAmt, paidAmt: (billPayload.actPayAmt).toString(), typPatientBill: typPatientBill })
               setModalOpen(true);
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
      <Container maxWidth="lg">

         <ToastContainer />

         <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
               🧾 Patient Pharmacy Billing Details
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
                     {/* Top Summary Row */}
                     <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 2 }}>
                        <Table>
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
                                 <TableRow>
                                    <TableCell colSpan={5} align="center">No data available</TableCell>
                                 </TableRow>
                              ) : (
                                 doctorDetail.map((row, index) => (
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

                     {/* Billing Details Table */}
                     <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 2 }}>
                        <Table>
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
                                 medicineDetail.map((row, index) => (
                                    <TableRow key={index}>
                                       <TableCell>
                                          <Typography
                                             sx={{ color: "#1976d2", position: "relative" }}
                                             onMouseOver={(e) => getItemBalance(row.invParameterID, e)}
                                          >
                                             {row.invParameterName}
                                          </Typography>

                                          {/* Floating Table */}
                                          {showTable && (
                                             <Box
                                                sx={{
                                                   position: "fixed",
                                                   top: anchorPos.y + 10,
                                                   left: anchorPos.x + 10,
                                                   zIndex: 999,
                                                   backgroundColor: "#fff",
                                                   borderRadius: 2,
                                                   boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                                                   width: "auto",
                                                   maxWidth: 900,
                                                   p: 2,
                                                   minWidth: 600,
                                                   transition: "opacity 0.2s ease-in-out",
                                                }}
                                                onMouseLeave={hideTable}
                                             >
                                                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
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
                                                         {itemBalance.map((item, index) => (
                                                            <TableRow
                                                               key={index}
                                                               sx={{
                                                                  "&:hover": {
                                                                     backgroundColor: "#f1f8ff",
                                                                  },
                                                               }}
                                                            >
                                                               <TableCell>
                                                                  <Button
                                                                     variant="outlined"
                                                                     size="small"
                                                                     color="primary"
                                                                     sx={{ fontSize: "0.75rem", textTransform: "none" }}
                                                                     onClick={() => {
                                                                        setUnitPrice(row, item.salePricePerUnit);
                                                                        // addTableData(row);
                                                                     }}
                                                                  >
                                                                     {item.voucherNo}
                                                                  </Button>
                                                               </TableCell>
                                                               <TableCell>{item.unitName}</TableCell>
                                                               <TableCell>{parseFloat(item.salePricePerUnit).toFixed(3)}</TableCell>
                                                               <TableCell>{item.isBilled ? "YES" : "NO"}</TableCell>
                                                               <TableCell>
                                                                  {new Date(item.eslDate).toLocaleDateString("en-GB", {
                                                                     day: "2-digit",
                                                                     month: "short",
                                                                     year: "numeric",
                                                                  })}
                                                               </TableCell>
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
                                          <TextField
                                             size="small"
                                             value={row.qty}
                                             onChange={(e) => handleQuantityChange(row, parseInt(e.target.value || "0"))}
                                             sx={{ width: 80 }}
                                          />
                                       </TableCell>
                                       <TableCell>{row.grossAmount}</TableCell>
                                       <TableCell>{row.compRebate}</TableCell>
                                       <TableCell>{row.discountAmount || "0.00"}</TableCell>
                                       <TableCell>{row.finalGrossAmount}</TableCell>
                                       <TableCell>{row.netAmount}</TableCell>
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

                     {/* Billing Summary Footer */}
                     <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mb: 2 }}>
                        <Table>
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
                                       size="small"
                                       value={billPayload.actPayAmt}
                                       onChange={(e) =>
                                          setBillTableData(medicineDetail, e.target.value)
                                       }
                                       onFocus={(e) => e.target.select()}
                                       sx={{ width: 100 }}
                                    />
                                 </TableCell>
                              </TableRow>
                           </TableBody>
                        </Table>
                     </TableContainer>

                     {/* Remark and Save Button */}
                     <Typography fontWeight="bold" mb={1}>
                        Remark
                     </Typography>
                     <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder="maxLength is 200"
                        inputProps={{ maxLength: 200 }}
                     />
                     <Box mt={2} textAlign="right">
                        <Button
                           variant="contained"
                           size="small"
                           sx={{
                              backgroundColor: "#1976d2",
                              fontWeight: "bold",
                              textTransform: "none",
                              "&:hover": { backgroundColor: "#115293" },
                           }}
                           onClick={() => formik.handleSubmit()}
                        >
                           Save Bill
                        </Button>
                     </Box>
                     <PaymentModal open={modalOpen} onClose={handleModalClose} onPay={handlePay} />
                  </>


               ) : (
                  <>
                     <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={3}>
                           <Autocomplete
                              disablePortal
                              fullWidth
                              options={billNoOptions}
                              onChange={(e, newValue: any) => {
                                 if (!newValue) return;
                                 getBillReciept(newValue.patientCaseID, newValue.billID);
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
                              {[
                                 'Medicine',
                                 'Qty',
                                 'Payable %',
                                 'Gross Amount',
                                 'Final Gross Amount',
                                 'Net Amount'
                              ].map((col) => (
                                 <TableCell
                                    key={col}
                                    sx={{
                                       color: 'white',
                                       fontWeight: 'bold',
                                       textAlign: 'center',
                                       py: 1
                                    }}
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
                                 <TableCell colSpan={6} align="center" sx={{ fontStyle: 'italic', py: 2 }}>
                                    No data found
                                 </TableCell>
                              </TableRow>
                           ) : (
                              billReceiptData.map((row, idx) => (
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

                        {/* Table Summary Footer */}
                        <TableFooter>
                           {billReceiptData1.length > 0 && (
                              <React.Fragment>
                                 <TableRow>
                                    <TableCell colSpan={5} sx={{ fontWeight: 'bold' }}>
                                       Total Net Amt
                                    </TableCell>
                                    <TableCell align="left">
                                       {billReceiptData1[0]?.totNetAmount ?? '0.00'}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell colSpan={5} sx={{ fontWeight: 'bold' }}>
                                       Total Received Amt
                                    </TableCell>
                                    <TableCell align="left">
                                       {billReceiptData1[0]?.actualPayAmt ?? '0.00'}
                                    </TableCell>
                                 </TableRow>
                                 <TableRow>
                                    <TableCell colSpan={5} sx={{ fontWeight: 'bold' }}>
                                       Total Balance Amt
                                    </TableCell>
                                    <TableCell align="left">
                                       {billReceiptData1[0]?.balanceAmount ?? '0.00'}
                                    </TableCell>
                                 </TableRow>
                              </React.Fragment>
                           )}
                        </TableFooter>
                     </Table>
                  </>

               )}
            </Paper>
         </Paper>

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

export default PatientPharmacyBilling;

