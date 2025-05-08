import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import api from '../../utils/Url';
import { getISTDate } from '../../utils/Constant';


const HospitalBillingDetail = () => {
  const theme = useTheme();
  const { defaultValues } = getISTDate();
  const [fromDate, setFromDate] = useState(defaultValues);
  const [toDate, setToDate] = useState(defaultValues);
  const [data, setData] = useState<any>({});
  const [tableData, setTableData] = useState<any>([]);

  useEffect(() => {
    getHospitalData();
  }, [])

  function addHierarchicalIds(data, parentId = '') {
    return data.map((item, index) => {
      const currentId = parentId ? `${parentId}.${index + 1}` : `${index + 1}`;
      const newItem = { ...item, id: currentId };

      if (item.lstTotalPayResp && item.lstTotalPayResp.length > 0) {
        newItem.lstTotalPayResp = addHierarchicalIds(item.lstTotalPayResp, currentId);

        newItem.lstTotalPayResp.forEach(payResp => {
          if (payResp.lstPayBIllCompResp && payResp.lstPayBIllCompResp.length > 0) {
            payResp.lstPayBIllCompResp = payResp.lstPayBIllCompResp.map((compResp, compIndex) => ({
              ...compResp,
              id: `${payResp.id}.${compIndex + 1}`
            }));
          }
        });
      }

      return newItem;
    });
  }

  const getHospitalData = async () => {
    try {
      const payload = {
        "fromDate": fromDate,
        "toDate": toDate,
        "userID": -2,
        "formID": -1,
        "type": 1
      }
      const response = await api.post("Reports/GetHospitalBill", payload);
      const data = addHierarchicalIds(response.data.result.lstPayDateResp)
      console.log("@@@@@", data);
      if (response.data.isSuccess) {
        setData(response.data.result)
        setTableData(data);
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <Paper elevation={3} sx={{ p: 3, m: 3, borderRadius: 3 }}>
      {/* Date Filter Section */}

      <Grid container spacing={2} sx={{ marginBottom: "1.5rem" }}>

        <Grid item xs={12} sm={4} md={3}>
          <TextField
            label="From Date"
            type="date"
            size="small"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthIcon />
                </InputAdornment>
              ),
            }}
            value={dayjs(fromDate).format("YYYY-MM-DD")}
            onChange={(e) => setFromDate(dayjs(e.target.value).format("YYYY-MM-DD"))}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <TextField
            label="To Date"
            type="date"
            size="small"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthIcon />
                </InputAdornment>
              ),
            }}
            value={dayjs(toDate).format("YYYY-MM-DD")}
            onChange={(e) => setToDate(dayjs(e.target.value).format("YYYY-MM-DD"))}
          />
        </Grid>

        <Grid item xs={12} sm={4} md="auto">
          <Button
            variant="contained"
            color="primary"
            onClick={getHospitalData}
            sx={{
              height: '100%',
              px: 4,
              boxShadow: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.03)',
              },
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>

      {/* Billing Summary Cards */}
      <Grid container spacing={3}>
        {/* Net Amount Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              boxShadow: 4,
              borderRadius: 3,
              height: '100%',
              background: 'linear-gradient(to right, #e3f2fd, #bbdefb)',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'scale(1.02)' },
            }}
          >
            <Box sx={{ mr: 2 }}>
              <CurrencyRupeeIcon
                fontSize="large"
                sx={{
                  color: '#2e7d32',
                  backgroundColor: "#81c656",
                  borderRadius: "1rem",
                  p: 0.5,
                }}
              />
            </Box>
            <CardContent sx={{ p: 0 }}>
              <Typography fontWeight="bold" color="textSecondary">
                Total Net Amount
              </Typography>
              <Typography variant="h6" mt={0.5} color="#2e7d32">
                ₹ {data?.totNetAmount || "- -"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Gross Amount Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              boxShadow: 4,
              borderRadius: 3,
              height: '100%',
              background: 'linear-gradient(to right, #fff8e1, #ffe082)',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'scale(1.02)' },
            }}
          >
            <Box sx={{ mr: 2 }}>
              <AccountBalanceWalletIcon
                fontSize="large"
                sx={{
                  color: '#ff6f00',
                }}
              />
            </Box>
            <CardContent sx={{ p: 0 }}>
              <Typography fontWeight="bold" color="textSecondary">
                Total Gross Amount
              </Typography>
              <Typography variant="h6" mt={0.5} color="#ff6f00">
                ₹ {data?.totFinalGrossAmount || "- -"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* GST Card */}
        <Grid item xs={12} sm={12} md={4}>
          <Card
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              boxShadow: 4,
              borderRadius: 3,
              height: '100%',
              background: 'linear-gradient(to right, #f3e5f5, #ce93d8)',
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'scale(1.02)' },
            }}
          >
            <Box sx={{ mr: 2 }}>
              <ReceiptLongIcon
                fontSize="large"
                sx={{
                  color: '#6a1b9a',
                }}
              />
            </Box>
            <CardContent sx={{ p: 0 }}>
              <Typography fontWeight="bold" color="textSecondary">
                GST
              </Typography>
              <Typography variant="h6" mt={0.5} color="#6a1b9a">
                ₹ {data?.netAmountVAT || "- -"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>



      {/* table */}

      <ParentTable data={tableData} />

    </Paper >
  );
};


const ParentTable = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const handleExpandRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <TableContainer component={Paper} elevation={3} sx={{ margin: '20px 0', borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: '#1976d2' }}>
          <TableRow>
            <TableCell />
            {['Pay Date', 'Final Amount', 'Net Amount', 'Discount', 'GST No'].map((header) => (
              <TableCell key={header}>
                <Typography fontWeight="bold" color="#fff">{header}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow><TableCell colSpan={6}>No data available</TableCell></TableRow>
          ) : (
            data.map((parentRow, idx) => (
              <React.Fragment key={parentRow.id}>
                <TableRow hover sx={{ backgroundColor: idx % 2 === 0 ? '#fafafa' : 'white' }}>
                  <TableCell>
                    {parentRow.lstTotalPayResp && (
                      <IconButton onClick={() => handleExpandRow(parentRow.id)} size="small">
                        {expandedRows[parentRow.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>{parentRow.payDateVar}</TableCell>
                  <TableCell>{parentRow.totFinalGrossAmount}</TableCell>
                  <TableCell>{parentRow.totNetAmount}</TableCell>
                  <TableCell>{parentRow.disCountAmt}</TableCell>
                  <TableCell>{parentRow.netAmountVAT}</TableCell>
                </TableRow>
                {parentRow.lstTotalPayResp && (
                  <TableRow>
                    <TableCell style={{ padding: 0 }} colSpan={9}>
                      <Collapse in={expandedRows[parentRow.id]} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <ChildTable data={parentRow.lstTotalPayResp} />
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ChildTable = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const handleExpandRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, my: 2 }}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: '#efa' }}>
          <TableRow>
            <TableCell />
            {['Name', 'Pay Date', 'Gross Amount', 'Total Amount', 'Discount', 'ReceiptNo', 'CaseNo'].map((header) => (
              <TableCell key={header}>
                <Typography fontWeight="bold">{header}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((childRow, idx) => (
            <React.Fragment key={childRow.id}>
              <TableRow hover sx={{ backgroundColor: idx % 2 === 0 ? '#fcfcfc' : 'white' }}>
                <TableCell>
                  {childRow.lstPayBIllCompResp && (
                    <IconButton onClick={() => handleExpandRow(childRow.id)} size="small">
                      {expandedRows[childRow.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>{childRow.patientName}</TableCell>
                <TableCell>{childRow.payDateVar}</TableCell>
                <TableCell>{childRow.totFinalGrossAmount}</TableCell>
                <TableCell>{childRow.totNetAmount}</TableCell>
                <TableCell>{childRow.disCountAmt}</TableCell>
                <TableCell>{childRow.receiptNo}</TableCell>
                <TableCell>{childRow.patientCaseNo}</TableCell>
                {/* <TableCell>
                  <Chip
                    label={childRow.isMedic ? 'Medic' : 'Non-Medic'}
                    color={childRow.isMedic ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell> */}
              </TableRow>
              {childRow.lstPayBIllCompResp && (
                <TableRow>
                  <TableCell style={{ padding: 0 }} colSpan={10}>
                    <Collapse in={expandedRows[childRow.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <SubChildTable data={childRow.lstPayBIllCompResp} />
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const SubChildTable = ({ data }) => {
  return (
    <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: '#f0f4c3' }}>
          <TableRow>
            {['Name', 'Case No', 'Patient No', 'Visit No', 'Parameter Name', 'NetAmount', 'GST', 'Final Amount', 'Quantity'].map((header) => (
              <TableCell key={header}>
                <Typography fontWeight="bold">{header}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((subChildRow, idx) => (
            <TableRow key={subChildRow.id} hover sx={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
              <TableCell>{subChildRow.patientName}</TableCell>
              <TableCell>{subChildRow.patientCaseNo}</TableCell>
              <TableCell>{subChildRow.patientNo}</TableCell>
              <TableCell>{subChildRow.admNo}</TableCell>
              <TableCell>{subChildRow.invParameterName}</TableCell>
              <TableCell>{subChildRow.netAmount}</TableCell>
              <TableCell>{subChildRow.netAmountVAT}</TableCell>
              <TableCell>{subChildRow.finalGrossAmount}</TableCell>
              <TableCell>{subChildRow.qty}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};



export default HospitalBillingDetail;
