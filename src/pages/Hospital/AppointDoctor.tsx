
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import api from '../../utils/Url';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  useTheme,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DataGrid, GridRow } from '@mui/x-data-grid';
import { Schedule, FilterAlt, Add } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';

interface Section {
  value: number;
  label: string;
}

interface Doctor {
  userID: string;
  userName: string;
}

interface SlotData {
  days: string[];
  startTime?: string;
  endTime?: string;
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


const premiumStyles = {
  headerGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  slotHoverBorder: '2px solid #667eea',
  dayButtonHover: {
    bgcolor: 'rgba(102, 126, 234, 0.1)',
    transition: 'all 0.3s ease-in-out'
  },
  dataGridStriped: {
    '& .MuiDataGrid-row:nth-of-type(even)': {
      backgroundColor: '#f8f9fa'
    }
  },
  elevatedCard: {
    boxShadow: '0px 8px 24px rgba(149, 157, 165, 0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0px 12px 28px rgba(149, 157, 165, 0.25)'
    }
  }
};
const SlotSelector = ({ slotIndex, slotData, setSlotData }) => {
  const theme = useTheme();

  const handleDayChange = (day: string) => {
    const updatedDays = slotData[slotIndex].days.includes(day)
      ? slotData[slotIndex].days.filter((d: string) => d !== day)
      : [...slotData[slotIndex].days, day];

    setSlotData((prev: SlotData[]) => {
      const updated = [...prev];
      updated[slotIndex] = { ...updated[slotIndex], days: updatedDays };
      return updated;
    });
  };

  const handleTimeChange = (type: 'start' | 'end', value: string) => {
    setSlotData((prev: SlotData[]) => {
      const updated = [...prev];
      updated[slotIndex] = {
        ...updated[slotIndex],
        [type === 'start' ? 'startTime' : 'endTime']: value
      };
      return updated;
    });
  };

  return (
    <Card variant="outlined" sx={{
      mb: 2,
      borderColor: theme.palette.divider,
      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
      transition: 'all 0.3s ease',
      '&:hover': {
        border: premiumStyles.slotHoverBorder,
        boxShadow: theme.shadows[4]
      }
    }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Slot {slotIndex + 1}
        </Typography>

        <ToggleButtonGroup size="small" sx={{ mb: 2, gap: 1, flexWrap: 'wrap' }}>
          {days.map((day) => (
            <ToggleButton
              key={day}
              value={day}
              selected={slotData[slotIndex].days.includes(day)}
              onChange={() => handleDayChange(day)}
              sx={{
                minWidth: 40,
                textTransform: 'none',
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  background: premiumStyles.headerGradient + '!important',
                  color: '#fff',
                  '&:hover': {
                    opacity: 0.9
                  }
                },
                '&:hover': premiumStyles.dayButtonHover
              }}
            >
              {day}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Start Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={slotData[slotIndex].startTime || ''}
              onChange={(e) => handleTimeChange('start', e.target.value)}
              inputProps={{ step: 300 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="End Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={slotData[slotIndex].endTime || ''}
              onChange={(e) => handleTimeChange('end', e.target.value)}
              inputProps={{ step: 300 }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default function AppointDoctor() {
  const [detailPanelExpandedRowIds, setDetailPanelExpandedRowIds] = useState<string[]>([]);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedRowToDelete, setSelectedRowToDelete] = useState<any>(null);
  const [appointmentList, setAppointmentList] = useState<any[]>([]);
  const [expandedRowIds, setExpandedRowIds] = useState<string[]>([]);

  const theme = useTheme();
  const [sectionsList, setSectionsList] = useState<Section[]>([]);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [section, setSection] = useState<number>(-1);
  const [doctor, setDoctor] = useState<string>('');
  const [filterDate, setFilterDate] = useState<[Date | null, Date | null]>([new Date(), new Date()]);

  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [slotsPerHour, setSlotsPerHour] = useState<string>('');
  const [slotData, setSlotData] = useState<SlotData[]>([
    { days: [], startTime: '01:00', endTime: '12:00' },
    { days: [], startTime: '01:00', endTime: '12:00' },
    { days: [], startTime: '01:00', endTime: '12:00' }

  ]);
  const [loading, setLoading] = useState(false);

  const rows = appointmentList.map((item, index) => ({
    id: index + 1,
    doctor: item.docUserName,
    slots: item.noOfSlotPerHrs,
    from: item.displaySlotFromDate,
    to: item.displaySlotToDate,
    displayFromHrs1: item.displayFromHrs || '00:00',
    displayToHrs1: item.displayToHrs || '00:00',
    displayFromHrs2: item.displayFromHrs2 || '00:00',
    displayToHrs2: item.displayToHrs2 || '00:00',
    displayFromHrs3: item.displayFromHrs3 || '00:00',
    displayToHrs3: item.displayToHrs3 || '00:00',

    // Include necessary hidden values for delete/edit
    userSlotID: item.userSlotID,
    docUserID: item.docUserID,
    slotFromDate: item.slotFromDate,
    slotToDate: item.slotToDate,
  }));


  const toggleRowExpansion = (rowId: number) => {
    setExpandedRowId(prev => prev === rowId ? null : rowId);
  };
  const handleRowToggle = (rowId: string) => {
    setExpandedRowIds((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };

  const columns = [
    // {
    //   field: 'expand',
    //   headerName: '',
    //   width: 60,
    //   renderCell: (params: any) => (
    //     <IconButton
    //       size="small"
    //       onClick={() => handleRowToggle(params.row.id.toString())}
    //     >
    //       {expandedRowIds.includes(params.row.id.toString()) ? (
    //         <RemoveCircleOutline color="primary" />
    //       ) : (
    //         <AddCircleOutline />
    //       )}
    //     </IconButton>
    //   ),
    // },


    {
      field: 'expand',
      headerName: '',
      width: 60,
      renderCell: (params: any) => (
        <IconButton
          size="small"
          onClick={() => toggleRowExpansion(params.row.id)}
        >
          {expandedRowId === params.row.id ? (
            <RemoveCircleOutline color="primary" />
          ) : (
            <AddCircleOutline />
          )}
        </IconButton>
      ),
    },
    {
      field: 'doctor',
      headerName: 'Doctor',
      flex: 1,
      minWidth: 150,
      headerClassName: 'bold-header',
    },
    {
      field: 'slots',
      headerName: 'Slots/Hour',
      flex: 1,
      minWidth: 100,
      headerClassName: 'bold-header',
    },
    {
      field: 'from',
      headerName: 'From Date',
      flex: 1,
      minWidth: 150,
      headerClassName: 'bold-header',
    },
    {
      field: 'to',
      headerName: 'To Date',
      flex: 1,
      minWidth: 150,
      headerClassName: 'bold-header',
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      minWidth: 180,
      headerClassName: 'bold-header',
      renderCell: (params: any) => (
        <Box display="flex" gap={1}>

          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => {
              setSelectedRowToDelete(params.row);
              setDeleteConfirmOpen(true);
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];


  // Fetch Specializations

  const fetchFilteredAppointments = async () => {
    if (!filterDate[0]) return;

    let isActiveValue = -1;
    if (statusFilter === "Active") isActiveValue = 1;
    else if (statusFilter === "Inactive") isActiveValue = 0;

    const payload = {
      userSlotID: -1,
      docUserID: -1,
      slotFromDate: dayjs(filterDate[0]).format('YYYY-MM-DD'),
      slotToDate: filterDate[1] ? dayjs(filterDate[1]).format('YYYY-MM-DD') : dayjs(filterDate[0]).format('YYYY-MM-DD'),
      isActive: isActiveValue,
      sectionID: -1,
      fromHrs: '',
      toHrs: '',
      showAll: 1,
      userID: -1,
      formID: -1,
      mainType: 1,
      type: 1,
    };

    try {
      setLoading(true);
      const response = await api.post('/Online/GetPatDocAppointment', payload);
      if (response.data.isSuccess) {
        setAppointmentList(response.data.result || []);
      } else {
        setAppointmentList([]);
      }
    } catch (err) {
      console.error('Error fetching appointment data:', err);
      setAppointmentList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row: any) => {
    // Confirm from user
    // const confirmDelete = window.confirm(`Are you sure you want to delete the schedule for ${row.docUserName || 'this doctor'}?`);
    // if (!confirmDelete) return;

    // Safely extract values
    const userSlotID = row?.userSlotID;
    const docUserID = row?.docUserID;

    if (!userSlotID || !docUserID) {
      toast.error("Missing slot or doctor ID.");
      return;
    }

    const payload = {
      userSlotID: userSlotID,
      docUserID: docUserID,
      noOfSlotPerHrs: parseInt(row?.noOfSlotPerHrs) || 0,
      slotFromDate: row?.slotFromDate || "",  // Already in "dd MMM yyyy" format
      slotToDate: row?.slotToDate || "",
      fromHrs: "00:00:00",
      toHrs: "00:00:00",
      isActive: false,
      isForDelete: true,
      userWeekSlotID: "",
      formID: -1,
      type: 3,
      fromHrs2: "00:00:00",
      toHrs2: "00:00:00",
      fromHrs3: "00:00:00",
      toHrs3: "00:00:00",
      lstType_row: [],
    };

    try {
      const response = await api.post("/Online/AddPatDocAppointments", payload);
      const res = response.data;

      if (res.isSuccess) {
        toast.success(res?.msg || "Slot deleted successfully!");
        fetchFilteredAppointments(); // Refresh the grid
      } else {
        toast.error(res?.msg || "Failed to delete slot.");
      }
    } catch (error) {
      toast.error("Error deleting slot.");
      console.error("Delete error:", error);
    }
  };


  const fetchSections = async () => {
    try {
      const response = await api.post('/MasterForm/GetSection', {
        sectionID: -1,
        userID: -1,
        formID: -1,
        type: 1,
      });

      if (response.data.isSuccess) {
        const formattedSections = response.data.result.map((item: any) => ({
          value: parseInt(item.sectionID),
          label: item.sectionName,
        }));
        setSectionsList(formattedSections);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  // Fetch Doctors when specialization changes
  useEffect(() => {
    const fetchDoctors = async () => {
      if (section > 0) {
        try {
          const response = await api.get(`/Login/GetUserList?CommonID=${section}&Type=3`);
          if (response.data.isSuccess) {
            setDoctorsList(response.data.data);
            setDoctor(''); // Reset doctor selection
          }
        } catch (error) {
          console.error('Error fetching doctors:', error);
        }
      }
    };
    fetchDoctors();
  }, [section]);

  // Handle form submission

  const handleSubmit = async () => {
    if (!doctor || !dateRange[0] || !dateRange[1] || !slotsPerHour) {
      toast.error("Please fill all required fields");
      return;
    }

    const invalidSlot = slotData.some(slot =>
      slot.days.length > 0 && (!slot.startTime || !slot.endTime)
    );

    if (invalidSlot) {
      toast.error("Please fill all time slots for selected days");
      return;
    }

    const requestBody = {
      userSlotID: -1,
      docUserID: doctor,
      noOfSlotPerHrs: parseInt(slotsPerHour),
      slotFromDate: dayjs(dateRange[0]).format('YYYY-MM-DD'),
      slotToDate: dayjs(dateRange[1]).format('YYYY-MM-DD'),
      fromHrs: slotData[0].startTime ? `${slotData[0].startTime}:00` : "00:00:00",
      toHrs: slotData[0].endTime ? `${slotData[0].endTime}:00` : "23:00:00",
      isActive: true,
      isForDelete: true,
      userWeekSlotID: "-1",
      formID: -1,
      type: 1,
      fromHrs2: slotData[1].startTime ? `${slotData[1].startTime}:00` : "00:00:00",
      toHrs2: slotData[1].endTime ? `${slotData[1].endTime}:00` : "23:00:00",
      fromHrs3: slotData[2].startTime ? `${slotData[2].startTime}:00` : "00:00:00",
      toHrs3: slotData[2].endTime ? `${slotData[2].endTime}:00` : "23:00:00",
      lstType_row: generateSlotRows(),
    };

    try {
      setLoading(true);
      const response = await api.post('/Online/AddPatDocAppointments', requestBody);
      const res = response.data;

      if (res.isSuccess) {
        const successMsg = res?.result?.[0]?.msg || res.msg || "Slots created successfully!";
        toast.success(successMsg);

        // Slight delay for toast visibility
        setTimeout(() => {
          // Reset form states
          setSection(-1);
          setDoctor('');
          setDateRange([null, null]);
          setSlotsPerHour('');
          setSlotData([
            { days: [], startTime: '01:00', endTime: '12:00' },
            { days: [], startTime: '01:00', endTime: '12:00' },
            { days: [], startTime: '01:00', endTime: '12:00' }
          ]);
        }, 300); // 300–500ms is ideal
      } else {
        const errorMsg = res?.result?.[0]?.msg || res.msg || "Something went wrong.";
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error("API Error. Please try again.");
      console.error("Error creating slots:", error);
    } finally {
      setLoading(false);
    }
  };




  // Generate slot rows based on selected days
  const generateSlotRows = () => {
    const rows: any[] = [];

    // Support both short and full names
    const dayToIndex: Record<string, string> = {
      Sun: "0", Sunday: "0",
      Mon: "1", Monday: "1",
      Tue: "2", Tuesday: "2",
      Wed: "3", Wednesday: "3",
      Thu: "4", Thursday: "4",
      Fri: "5", Friday: "5",
      Sat: "6", Saturday: "6",
    };

    slotData.forEach((slot, index) => {
      slot.days.forEach((day: string) => {
        const trimmedDay = day.trim();
        const dayIndex = dayToIndex[trimmedDay];
        if (dayIndex !== undefined) {
          rows.push({
            rowID: dayIndex,            // Day number (0–6)
            rowValue: `${index + 1}`,   // Slot number
          });
        } else {
          console.warn("Unknown day format:", day);
        }
      });
    });

    return rows;
  };




  useEffect(() => {
    fetchSections();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, maxWidth: 1600, margin: '0 auto' }}>
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 4 }}>
          <Schedule sx={{ mr: 1 }} />
          Doctor Appointment Management
        </Typography>

        {/* Create Slot Section */}
        <Card sx={{ mb: 4 }}>
          <ToastContainer></ToastContainer>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
              Create Availability Slot
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Autocomplete
                  options={sectionsList}
                  getOptionLabel={(option) => option.label}
                  value={sectionsList.find((s) => s.value === section) || null}
                  onChange={(event, newValue) => setSection(newValue?.value || -1)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Specialization"
                      size="small"
                      required
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small" required>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value as string)}
                    label="Doctor"
                  >
                    {doctorsList.map((doc) => (
                      <MenuItem key={doc.userID} value={doc.userID}>
                        {doc.userName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      required: true
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Slots Per Hour"
                  fullWidth
                  size="small"
                  type="number"
                  value={slotsPerHour}
                  onChange={(e) => setSlotsPerHour(e.target.value)}
                  required
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 4 }} />
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Time Slots
            </Typography>

            <Grid container spacing={3}>
              {slotData.map((slot, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <SlotSelector
                    slotIndex={index}
                    slotData={slotData}
                    setSlotData={setSlotData}
                  />
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="secondary" size="large">
                Cancel
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                onClick={handleSubmit}

                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Slots'}
              </Button>
            </Box>



            <Dialog
              open={deleteConfirmOpen}
              onClose={() => {
                setDeleteConfirmOpen(false);
                setSelectedRowToDelete(null);
              }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete the schedule for{" "}
                  {selectedRowToDelete?.doctor || "this doctor"}?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    setSelectedRowToDelete(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    if (selectedRowToDelete) {
                      handleDelete(selectedRowToDelete);
                    }
                    setSelectedRowToDelete(null);
                  }}
                  color="error"
                  autoFocus
                >
                  Confirm Delete
                </Button>
              </DialogActions>
            </Dialog>

          </CardContent>
        </Card>

        {/* Filter Section */}
        <Card sx={{ mb: 4, boxShadow: theme.shadows[2] }}>
          <CardContent>
            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
              <FilterAlt sx={{ verticalAlign: 'middle', mr: 1 }} />
              Filter Appointments
            </Typography>

            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <DateRangePicker
                  value={filterDate}
                  onChange={setFilterDate}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      variant: 'outlined'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="All">All Statuses</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ height: '40px' }}
                  onClick={fetchFilteredAppointments}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Apply Filters'}
                </Button>

              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Appointment List */}
        <Card sx={{ boxShadow: theme.shadows[2] }}>
          <CardContent>
            <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
              Appointment List
            </Typography>

            <Box sx={{ height: 600, width: '100%', position: 'relative' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                components={{
                  Row: (props) => (
                    <>
                      <GridRow {...props} />
                      {expandedRowId === props.row.id && (
                        <tr>
                          <td colSpan={columns.length} style={{ padding: 0, borderBottom: 'none' }}>
                            <Box sx={{
                              p: 2,
                              bgcolor: '#f8f9fa',
                              borderLeft: '2px solid #3f51b5',
                              borderRight: '1px solid #e0e0e0',
                              borderBottom: '1px solid #e0e0e0'
                            }}>
                              <Grid container spacing={2}>
                                {/* Slot 1 */}
                                <Grid item xs={4}>
                                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Slot 1
                                  </Typography>
                                  <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                      <Typography variant="caption">From Hours</Typography>
                                      <Typography variant="body2">
                                        {props.row.displayFromHrs1}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography variant="caption">To Hours</Typography>
                                      <Typography variant="body2">
                                        {props.row.displayToHrs1}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>

                                {/* Slot 2 */}
                                <Grid item xs={4}>
                                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Slot 2
                                  </Typography>
                                  <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                      <Typography variant="caption">From Hours</Typography>
                                      <Typography variant="body2">
                                        {props.row.displayFromHrs2}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography variant="caption">To Hours</Typography>
                                      <Typography variant="body2">
                                        {props.row.displayToHrs2}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>

                                {/* Slot 3 */}
                                <Grid item xs={4}>
                                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Slot 3
                                  </Typography>
                                  <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                      <Typography variant="caption">From Hours</Typography>
                                      <Typography variant="body2">
                                        {props.row.displayFromHrs3}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography variant="caption">To Hours</Typography>
                                      <Typography variant="body2">
                                        {props.row.displayToHrs3}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Box>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                }}
                sx={{
                  '& .MuiDataGrid-cell': {
                    borderBottom: 'none',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    borderBottom: 'none',
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}