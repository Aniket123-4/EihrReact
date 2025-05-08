import React, { useEffect, useState } from 'react';
import {
   Box, Button, TextField, MenuItem, Typography,
   Table, TableHead, TableRow, TableCell, TableBody,
   Paper, Grid, Divider,
   Autocomplete
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import api from '../../utils/Url';
import { getISTDate } from '../../utils/Constant';
import { toast, ToastContainer } from 'react-toastify';

const patients = [
   { id: 1, name: 'John Doe' },
   { id: 2, name: 'Jane Smith' }
];

const PayPartialPharmacyBilling: React.FC = () => {
   const { defaultValues, defaultValuestime } = getISTDate();
   const [tableData, setTableData] = useState<any>([]);
   const [filterDate, setFilterDate] = useState({
      fromDate: defaultValues,
      toDate: defaultValues
   })


   useEffect(() => {
      getPaymentRecord(filterDate);
   }, []);


   const getPaymentRecord = async (filterDate) => {
      try {
         const payload = {
            "userID": -1,
            "formID": -1,
            "type": 1,
            "fromDate": filterDate.fromDate,
            "toDate": filterDate.toDate
         }
         const response = await api.post("GetBalanceBill", payload);
         const data = response.data.result.map((item) => {
            return {
               ...item,
               value: item.patientBillID,
               label: item.patientName
            }
         })
         setTableData(data);

      } catch (error) {
         console.log(error);
      }
   }

   const handleTableAction = (row) => {
      console.log(row);
      formik.setFieldValue("oldPatientBillID", row.patientBillID)
      formik.setFieldValue("paidAmt", row.balanceAmt)
   }


   const formik = useFormik({
      initialValues: {
         "oldPatientBillID": "",
         "paidAmt": "",
         "userID": -1,
         "formID": -1,
         "type": 1
      },
      onSubmit: async (values) => {
         try {
            const response = await api.post("AddPatientBalanceBill", values);
            if (response.data.isSuccess) {
               toast.success(response.data.msg);
               formik.resetForm();
               getPaymentRecord(filterDate);
            } else {
               toast.error(response.data.msg);
            }

         } catch (error) {
            console.log(error);
         }
      }
   })


   return (
      <Box>
         {/* Top Section */}
         <ToastContainer />
         <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
               🧾 Partial Pay Amount
            </Typography>
            <Grid container spacing={2}>
               <Grid item xs={12} md={5}>
                  <Autocomplete
                     disablePortal
                     fullWidth
                     options={tableData}
                     value={tableData[tableData.findIndex((e: any) => e.value == formik.values.oldPatientBillID)]?.label || ""}
                     onChange={(e, newValue: any) => {
                        if (!newValue) return;
                        formik.setFieldValue("oldPatientBillID", newValue)
                     }}
                     renderInput={(params) => (
                        <TextField {...params} label="Select Patient" size="small" />
                     )}
                  />
               </Grid>
               <Grid item xs={12} md={5}>
                  <TextField
                     fullWidth
                     required
                     label="Enter Amount to Pay"
                     type="number"
                     size="small"
                     value={formik.values.paidAmt}
                     onChange={(e) => {
                        formik.setFieldValue("paidAmt", e.target.value);
                     }}
                  />
               </Grid>
               <Grid item xs={6} md={1}>
                  <Button
                     variant="contained"
                     fullWidth
                     size="small"
                     onClick={() => formik.handleSubmit()}
                  >
                     Pay
                  </Button>
               </Grid>
               <Grid item xs={6} md={1}>
                  <Button
                     variant="outlined"
                     fullWidth
                     size="small"
                     onClick={() => formik.resetForm()}
                  >
                     Cancel
                  </Button>
               </Grid>
            </Grid>
         </Paper>

         {/* Date Filter */}
         <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
               <Grid item xs={12} md={5}>
                  <TextField
                     label="From Date"
                     type="date"
                     size="small"
                     fullWidth
                     InputLabelProps={{
                        shrink: true,
                     }}
                     value={dayjs(filterDate.fromDate).format('YYYY-MM-DD') || ''}
                     onChange={(e) => {
                        const fromDate = dayjs(e.target.value).format('YYYY-MM-DD');
                        setFilterDate({ ...filterDate, fromDate: fromDate })
                     }}
                  />
               </Grid>

               <Grid item xs={12} md={5}>
                  <TextField
                     label="To Date"
                     type="date"
                     size="small"
                     fullWidth
                     InputLabelProps={{
                        shrink: true,
                     }}
                     value={dayjs(filterDate.toDate).format('YYYY-MM-DD') || ''}
                     onChange={(e) => {
                        const toDate = dayjs(e.target.value).format('YYYY-MM-DD');
                        setFilterDate({ ...filterDate, toDate: toDate })
                     }}
                  />
               </Grid>

               <Grid item xs={12} md={1}>
                  <Button fullWidth variant="contained" size="small"
                     onClick={() => {
                        getPaymentRecord(filterDate)
                     }}
                  >
                     Filter
                  </Button>
               </Grid>
            </Grid>

         </Paper>

         {/* Data Table */}
         <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Payment Records</Typography>
            <Divider sx={{ mb: 2 }} />
            <Table size="small" >
               <TableHead sx={{ backgroundColor: '#1976d2' }}>
                  <TableRow>
                     <TableCell sx={{ color: '#fff' }}>Patient Name</TableCell>
                     <TableCell sx={{ color: '#fff' }}>Mobile No</TableCell>
                     <TableCell sx={{ color: '#fff' }}>Email</TableCell>
                     <TableCell sx={{ color: '#fff' }}>ActualPayAmt</TableCell>
                     <TableCell sx={{ color: '#fff' }}>BalanceAmt</TableCell>
                     <TableCell sx={{ color: '#fff' }}>PatientNo</TableCell>
                     <TableCell sx={{ color: '#fff' }}>PatientCaseNo</TableCell>
                     <TableCell sx={{ color: '#fff' }}>PayDate</TableCell>
                     <TableCell sx={{ color: '#fff' }}>Pay</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {tableData.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={9} align="center">
                           <Typography variant="body2" color="text.secondary">
                              No data available
                           </Typography>
                        </TableCell>
                     </TableRow>
                  ) : (
                     tableData.map((row, index) => (
                        <TableRow key={index}>
                           <TableCell>{row.patientName}</TableCell>
                           <TableCell>{row.mobileNo}</TableCell>
                           <TableCell>{row.email}</TableCell>
                           <TableCell>{row.actualPayAmt}</TableCell>
                           <TableCell>{row.balanceAmt}</TableCell>
                           <TableCell>{row.patientNo}</TableCell>
                           <TableCell>{row.patientCaseNo}</TableCell>
                           <TableCell>{row.payDate}</TableCell>
                           <TableCell>
                              <Button variant="contained" size="small"
                                 onClick={() => {
                                    handleTableAction(row);
                                 }}
                              >
                                 Pay
                              </Button>
                           </TableCell>
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </Paper>
      </Box>
   );
};

export default PayPartialPharmacyBilling;
