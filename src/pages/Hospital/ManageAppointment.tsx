
import React, { useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import api from '../../utils/Url';
import { useTranslation } from 'react-i18next';

export default function ManageAppointment() {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('All');
  const todayDate = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayDate);
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(1); // Pagination starts at 1
  const rowsPerPage = 5;

  const fetchAppointments = async (date) => {
    try {
      const response = await api.post('/Online/GetAppointmentSearch', {
        mainType: 1,
        userID: -1,
        formID: -1,
        type: '1',
        urlType: 'Online',
        show: false,
        exportOption: '.pdf',
        slotDate: date,
        phoneNo: '',
        docUserID: '-1',
      });

      if (response.data.isSuccess) {
        setAppointments(response.data.result || []);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAppointments(date);
  }, [date]);

  useEffect(() => {
    if (tabValue === 1) {
      setDate(todayDate); // update date to today
      setAppointments([]); // Reset appointments when switching to Today Slot tab
      fetchAppointments(todayDate); // Fetch today's appointments
    }
  }, [tabValue]);

const handleSync = async (appt: any) => {
  try {
    const payload = {
      onlinePatientID: appt.onlinePatientID,
      patientNo: appt.patientNo || '',
      patientCaseNo: appt.patientCaseNo || '',
      admNo: appt.admNo || 1,
      userID: -1,
      formID: -1,
      type: 1,
    };

    const response = await api.post('/Online/SyncOnlinePatient', payload);

    if (response.data.isSuccess) {
      alert('Synced successfully: ' + response.data.msg);
    } else {
      alert('Sync failed: ' + (response.data.msg || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error syncing patient:', error);
    alert('Sync failed due to network or server error.');
  }
};


  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    if (newValue === 1) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today); // set today's date
      setAppointments([]); // reset appointments list when switching to Today Slot tab
      fetchAppointments(today); // fetch today's appointments
    }
  };
  const handlePrint = () => {
    const printContent = document.getElementById('print-table')?.outerHTML;
    const newWindow = window.open('', '', 'width=800,height=600');

    if (printContent && newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Appointment Report</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }
  
              h2 {
                text-align: center;
                margin-bottom: 20px;
              }
  
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
              }
  
              th, td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
                font-size: 14px;
              }
  
              th {
                background-color: #f2f2f2;
              }
  
              tr:nth-child(even) {
                background-color: #fafafa;
              }
  
              @media print {
                body {
                  margin: 0;
                }
              }
            </style>
          </head>
          <body>
            <h2>Appointment Report</h2>
            ${printContent}
          </body>
        </html>
      `);

      newWindow.document.close();
      newWindow.print();
    }
  };

  const uniqueDoctors = ['All', ...new Set(appointments.map((appt: any) => appt.userName).filter(Boolean))];

  const filteredAppointments = appointments.filter((appt: any) => {
    const matchDoctor = selectedDoctor === 'All' || appt.userName === selectedDoctor;
    const matchSearch =
      (appt.patientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (appt.patientNo || '').toLowerCase().includes(search.toLowerCase());

    return matchDoctor && matchSearch;
  });

  const paginatedAppointments = filteredAppointments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
      {t('text.ManageAppointments')}
      </Typography>

      <Card variant="outlined">
        <CardContent>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 3 }}
          >
           <Tab label={t('text.Search')} />
            <Tab label={t('text.TodaySlot')} />
            <Tab label={t('text.DoctorAndSlotDate')} />
          </Tabs>

          <Grid container spacing={2} alignItems="center">
            {tabValue !== 1 && (
              <Grid item xs={12} md={3}>
                <TextField
                  type="date"
                  size="small"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  fullWidth
                />
              </Grid>
            )}
            <Grid item xs={12} md={4}>
              <InputBase
                placeholder={t('text.SearchByPatient')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                sx={{ border: '1px solid #ccc', borderRadius: 1, px: 2, py: 0.5 }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Select
                size="small"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                fullWidth
                displayEmpty
              >
                {uniqueDoctors.map((doc) => (
                  <MenuItem key={doc} value={doc}>
                   {doc === 'All' ? t('text.AllDoctors') : doc}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={2} textAlign="right">
              <Button onClick={handlePrint} color="primary" variant="contained" fullWidth>
              {t('text.Print')}
              </Button>
            </Grid>
          </Grid>

          <Box mt={4}>
            <Typography fontWeight="bold" mb={1}>
            {t('text.AppointmentList')}
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
              <Table size="small" id="print-table" sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#1976d2' }}>
                  {[
                      t('text.Sync'),
                      t('text.Doctor'),
                      t('text.Specialization'),
                      t('text.SlotDate'),
                      t('text.PatientName'),
                      t('text.PatientNo'),
                      t('text.Remark'),
                    ].map((header, index) => (
                      <TableCell key={index} sx={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAppointments.map((appt: any, index) => (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                        '&:hover': {
                          backgroundColor: '#e3f2fd',
                        }
                      }}
                    >
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          onClick={() => handleSync(appt)}
                        >
                        {t('text.Sync')}
                        </Button>
                      </TableCell>

                      <TableCell>{appt.userName}</TableCell>
                      <TableCell>{appt.sectionName}</TableCell>
                      <TableCell>{appt.displaySlotDate}</TableCell>
                      <TableCell>{appt.patientName || '-'}</TableCell>
                      <TableCell>{appt.patientNo || '-'}</TableCell>
                      <TableCell>{appt.remark || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>


            {filteredAppointments.length > rowsPerPage && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={Math.ceil(filteredAppointments.length / rowsPerPage)}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
