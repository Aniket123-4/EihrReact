
import React, { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Autocomplete,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Avatar,

} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocalHospital, Schedule } from '@mui/icons-material';
import dayjs from 'dayjs';
import api from '../../utils/Url';

// Interfaces
interface Section {
  value: number;
  label: string;
}

interface Slot {
  start: string;
  end: string;
  userSlotID: string;
  docUserID: string;
  date: string;
  booked?: boolean;
  userWeekSlotID?: string;
  otpNo?: string;
}

interface BookingForm {
  patientName: string;
  email: string;
  phoneNo: string;
  otpNo: string;
  remark: string;
}

interface DoctorSlots {
  doctorId: string;
  doctorName: string;
  slots: Slot[];
}

// Constants
const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const phoneRegex = /^[0-9]{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BookingModal = ({ open, onClose, onSubmit, slot, loading, resetTrigger }) => {

  const [errors, setErrors] = useState<{ patientName?: string; email?: string; phoneNo?: string; otpNo?: string }>({});
  const theme = useTheme();
  const [formData, setFormData] = useState<BookingForm>({
    patientName: '',
    email: '',
    phoneNo: '',
    otpNo: '',
    remark: ''
  });
  const [selectedSevenMinSlot, setSelectedSevenMinSlot] = useState<Slot | null>(null);
  const [selectedTiming, setSelectedTiming] = useState<string>('');
  const [sevenMinSlots, setSevenMinSlots] = useState<Slot[]>([]);
  const [slotLoading, setSlotLoading] = useState(true);

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    } else if (formData.patientName.trim().length < 2) {
      newErrors.patientName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNo)) {
      newErrors.phoneNo = 'Phone number must be 10 digits';
    }

    // if (!formData.otpNo.trim()) {
    //   newErrors.otpNo = 'OTP is required';
    // } else if (!/^\d{4,6}$/.test(formData.otpNo)) {
    //   newErrors.otpNo = 'OTP must be 4 to 6 digits';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const fetch7MinSlots = useCallback(async (startTime: string, endTime: string) => {
    if (!slot) return;
    const fromHrs = `${startTime}:00`;
    const toHrs = `${endTime}:00`;
    try {
      setSlotLoading(true);
      const response = await api.post('/Online/GetPatDocAppointment', {
        userSlotID: slot.userSlotID,
        docUserID: slot.docUserID,
        slotFromDate: dayjs(slot.date).format('DD MMM YYYY'),
        slotToDate: dayjs(slot.date).format('DD MMM YYYY'),
        isActive: -1,
        sectionID: -1,
        fromHrs,
        toHrs,
        showAll: 0,
        userID: -1,
        formID: -1,
        mainType: 1,
        type: 5
      });

      if (response.data.isSuccess) {
        setSevenMinSlots(response.data.result.map(apiSlot => ({
          start: apiSlot.pTime, // Use original time format from API
          end: dayjs(`2000-01-01T${apiSlot.pTime}`)
            .add(7, 'minute')
            .format('HH:mm:ss'),
          booked: !apiSlot.isFree,
          userWeekSlotID: apiSlot.userWeekSlotID,
          otpNo: apiSlot.otpNo
        })));
      }
    } catch (error) {
      console.error('Error fetching 7min slots:', error);
    } finally {
      setSlotLoading(false);
    }
  }, [slot]);


  useEffect(() => {
    if (open && slot) {
      setSlotLoading(true);
      const timer = setTimeout(() => {
        fetch7MinSlots(slot.start, slot.end);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [open, slot, fetch7MinSlots]);


  const handleSlotClick = (slot: Slot) => {
    if (!slot.booked) {
      setSelectedSevenMinSlot(slot);
      setSelectedTiming(`${slot.start} - ${slot.end}`);
      setFormData(prev => ({
        ...prev,
        otpNo: slot.otpNo || ''
      }));
    }
  };

 // Optional error handling
 useEffect(() => {
  try {
    // Get entire user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Extract verifiedUser from nested structure
    const verifiedUser = userData?.verifiedUser || {};

    // Update form data with user info
    setFormData(prev => ({
      ...prev,
      patientName: verifiedUser.userName || '',
      email: verifiedUser.loginName || '',
      phoneNo: verifiedUser.curMobile || ''
    }));

  } catch (error) {
    console.error('Error loading user data:', error);
  }
}, [open]); // Trigger when modal opens


useEffect(() => {
  if (resetTrigger) {
    setFormData({
      patientName: '',
      email: '',
      phoneNo: '',
      otpNo: '',
      remark: ''
    });
    setSelectedTiming('');
    setSelectedSevenMinSlot(null); // Add this line
    setErrors({});
  }
}, [resetTrigger]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // ✨ this adds color theme
      />
      <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
        <Schedule sx={{ mr: 1 }} />
        Booking Timing - {slot?.start} to {slot?.end}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Time Slots Column */}
          <Grid item xs={6}>
            <Typography variant="h6" mb={2} color="text.secondary">
              Available Slots
            </Typography>
            {slotLoading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              sevenMinSlots.map((s, i) => (
                <Button
                  key={i}
                  fullWidth
                  variant={s.booked ? "contained" : "outlined"}
                  color={s.booked ? "error" : "primary"}
                  onClick={() => handleSlotClick(s)}
                  disabled={s.booked}
                  sx={{
                    mb: 1,
                    textTransform: 'none',
                    borderRadius: 1,
                    '&:hover': { transform: s.booked ? 'none' : 'scale(1.02)' }
                  }}
                >
                  {s.start} {s.booked ? '(Booked)' : '(Book)'}
                </Button>
              ))
            )}
          </Grid>

          {/* Patient Information Column */}
          <Grid item xs={6}>
            <Typography variant="h6" mb={2} color="text.secondary">
              Patient Information
            </Typography>

            <TextField
              label="Selected Slot Timing"
              value={selectedTiming}
              InputProps={{ readOnly: true }}
              fullWidth
              sx={{ mb: 3 }}
            />

            <Box component="form" onSubmit={(e) => e.preventDefault()}>
              <TextField
                label="Patient Name "
                fullWidth
                required
                sx={{ mb: 2 }}
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                error={!!errors.patientName}
                helperText={errors.patientName}
              />

              <TextField
                label="Email "
                type="email"
                fullWidth
                required
                sx={{ mb: 2 }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
              />

              <TextField
                label="Mobile No "
                type="tel"
                fullWidth
                required
                sx={{ mb: 2 }}
                value={formData.phoneNo}
                onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                error={!!errors.phoneNo}
                helperText={errors.phoneNo}
              />

              <TextField
                label="OTP "
                // type="number"
                fullWidth
                required
                sx={{ mb: 2 }}
                value={formData.otpNo}
                onChange={(e) => setFormData({ ...formData, otpNo: e.target.value })}
                error={!!errors.otpNo}
                helperText={errors.otpNo}
              />

              <TextField
                label="Remark"
                multiline
                rows={3}
                fullWidth
                sx={{ mb: 2 }}
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
  onClick={() => {
    if (validateForm() && selectedSevenMinSlot) {
      onSubmit({ 
        ...formData,
        userWeekSlotID: selectedSevenMinSlot.userWeekSlotID,
        slot: selectedSevenMinSlot.start
      });
    }
  }}
  variant="contained"
  color="primary"
  disabled={!selectedTiming || loading}
  startIcon={loading && <CircularProgress size={20} />}
>
  {loading ? 'Processing...' : 'Confirm Booking'}
</Button>

      </DialogActions>
    </Dialog>
  );
};


const DayColumn = ({
  date,
  doctors,
  loading,
  isToday,
  onClick,
  onSlotClick
}) => {
  const theme = useTheme();

  return (
    <Grid item xs={12} sm={3} md
      sx={{
        border: `2px solid ${isToday ? theme.palette.primary.main : theme.palette.divider}`,
        bgcolor: isToday ? alpha(theme.palette.primary.light, 0.1) : 'background.paper',
        minHeight: 300,
        position: 'relative',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)'
        },
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          py: 2,
          textAlign: 'center',
          borderBottom: `2px solid ${theme.palette.primary.main}`,
          bgcolor: alpha(theme.palette.primary.light, 0.1),
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          {daysOfWeek[date.day() - 1]}
        </Typography>
        <Typography
          variant="h6"
          color={isToday ? 'primary' : 'text.primary'}
          fontWeight={600}
        >
          {date.format('DD MMM')}
        </Typography>
      </Box>

      <Box sx={{ p: 1.5 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          doctors?.map((doctor) => (
            <Box key={doctor.doctorId} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{
                  bgcolor: theme.palette.primary.main,
                  mr: 1,
                  width: 28,
                  height: 28
                }}>
                  <LocalHospital fontSize="small" />
                </Avatar>
                <Typography variant="subtitle2" fontWeight="600">
                  Dr. {doctor.doctorName}
                </Typography>
              </Box>

              {doctor.slots.map((slot, index) => (
                <Button
                  key={index}
                  fullWidth
                  variant={slot.booked ? "contained" : "outlined"}
                //  color={slot.booked ? "secondary" : "primary"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSlotClick({
                      ...slot,
                      date: dayjs(slot.date).format('YYYY-MM-DD')
                    });
                  }}
                 // disabled={slot.booked}
                  sx={{
                    mb: 1,
                    py: 0.8,
                    textTransform: 'none',
                    borderRadius: 1,
                    transition: 'all 0.2s ease',
                  }}>

                  {dayjs(`2000-01-01T${slot.start}`).format('HH:mm:ss')}
                  {/* {dayjs(`2000-01-01T${slot.end}`).format('HH:mm:ss')} */}
                  {/* {slot.start} - {slot.end} */}
                </Button>
              ))}
            </Box>
          ))
        )}
      </Box>
    </Grid>
  );
};

const Appointment = () => {

  const [selectedSevenMinSlot, setSelectedSevenMinSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]); // Define slots state
  const [selectedDateSlots, setSelectedDateSlots] = useState<{ [key: string]: DoctorSlots[] }>({});
  const [loadingDates, setLoadingDates] = useState<{ [key: string]: boolean }>({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [section, setSection] = useState<number>(-1);
  const [sectionsList, setSectionsList] = useState<Section[]>([{ value: -1, label: 'All' }]);
  const [currentWeekStart, setCurrentWeekStart] = useState(dayjs().startOf('week').add(1, 'day'));
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingResetTrigger, setBookingResetTrigger] = useState(false);
  const theme = useTheme();

  const generateWeekDates = useCallback(() => {
    return Array.from({ length: 7 }, (_, index) =>
      currentWeekStart.add(index, 'day')
    );
  }, [currentWeekStart]);

  const handleWeekChange = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(prev => direction === 'prev' ? prev.subtract(7, 'day') : prev.add(7, 'day'));
  };

  const handleDayClick = async (date: dayjs.Dayjs) => {
    const dateKey = date.format('YYYY-MM-DD');

    // ✅ Reset previous state
    setSelectedSlot(null); // clear previously selected slot
    setSelectedDateSlots({}); // clear all previously loaded slots
    setError(''); // clear old errors if any

    // ✅ Set loading state for the current day
    setLoadingDates(prev => ({ ...prev, [dateKey]: true }));

    try {
      const response = await api.post('/Online/GetPatDocAppointment', {
        userSlotID: -1,
        docUserID: -1,
        slotFromDate: date.format('DD MMM YYYY'),
        slotToDate: "",
        isActive: -1,
        sectionID: section,
        fromHrs: "00:00:00", // Add full time format
        toHrs: "23:59:59",
        // fromHrs: "",
        // toHrs: "",
        showAll: 0,
        userID: -1,
        formID: -1,
        mainType: 1,
        type: 4
      });

      if (response.data.isSuccess) {
        const result = response.data.result;
        const doctorsMap = new Map<string, DoctorSlots>();

        result.forEach((appointment: any) => {
          const doctorId = appointment.doctorID;
          const doctorName = appointment.doctorName;

          if (!doctorsMap.has(doctorId)) {
            doctorsMap.set(doctorId, {
              doctorId,
              doctorName,
              slots: []
            });
          }

          const doctorEntry = doctorsMap.get(doctorId)!;

          for (let i = 1; i <= 24; i++) {
            const fHrs = appointment[`fHrs${i}`];
            const tHrs = appointment[`tHrs${i}`];

            if (fHrs !== 'X' && tHrs !== 'X') {
              doctorEntry.slots.push({
                start: fHrs?.substring(0, 5) || '',
                end: tHrs?.substring(0, 5) || '',
                userSlotID: appointment.userSlotID,
                docUserID: appointment.doctorID,
                date: appointment.inputDate,
              });
            }
          }
        });

        const doctorSlotsArray = Array.from(doctorsMap.values());

        // ✅ Show toast if no slots found
        if (doctorSlotsArray.length === 0) {
          toast.info("No slots available for the selected day.");
        }

        // ✅ Update selected slots
        setSelectedDateSlots({
          [dateKey]: doctorSlotsArray
        });
      } else {
        toast.error("Failed to fetch slots.");
      }
    } catch (error) {
      toast.error("Error fetching slots.");
      console.error("handleDayClick error:", error);
    } finally {
      setLoadingDates(prev => ({ ...prev, [dateKey]: false }));
    }
  };


  const handleBookingSubmit = async (formData: BookingForm & {
    userWeekSlotID?: string;
    slot?: string;
  }) => {
    try {
      setSubmitting(true);
  
      const payload = {
        patientName: formData.patientName,
        email: formData.email,
        phoneNo: formData.phoneNo,
        otpNo: formData.otpNo,
        remark: formData.remark,
        userWeekSlotID: formData.userWeekSlotID,
        slot: formData.slot,
        patientId: -1,
        remarkId: -1,
        userID: -1,
        formID: -1,
        type: 1
      };
  
      console.log('Submitting payload:', payload); // Add for debugging
      
      const response = await api.post('/Online/AddPatRequest', payload);
  
      if (response.data.isSuccess) {
        toast.success(response.data.msg || "Booking successful!");
        // Update UI state
        setSelectedDateSlots(prev => {
          const newState = { ...prev };
          const dateKey = dayjs(selectedSlot?.date).format('YYYY-MM-DD');
          
          if (newState[dateKey]) {
            newState[dateKey] = newState[dateKey].map(doctor => ({
              ...doctor,
              slots: doctor.slots.map(slot =>
                slot.userSlotID === selectedSlot?.userSlotID &&
                slot.start === selectedSlot?.start
                  ? { ...slot, booked: true }
                  : slot
              )
            }));
          }
          return newState;
        });
  
        setBookingResetTrigger(prev => !prev);
        setTimeout(() => setOpenModal(false), 900);
      } else {
        toast.error(response.data.msg || "Booking failed");
      }
    } catch (error) {
      toast.error('Failed to book appointment. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setSubmitting(false);
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
        setSectionsList([
          { value: -1, label: 'All' },
          ...response.data.result.map((item: any) => ({
            value: item.sectionID,
            label: item.sectionName,
          })),
        ]);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(config => {
      console.log('Request Config:', config);
      return config;
    });
    
    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  useEffect(() => {
    fetchSections();
  }, []);

  return (
    <Box sx={{
      p: 3,
      maxWidth: 1400,
      margin: '0 auto',
      '& .MuiGrid-container': {
        gap: '8px',
        '& > .MuiGrid-item': {
          borderRadius: 2,
          overflow: 'hidden',
        }
      }
    }}>
      <Typography variant="h4" fontWeight="bold" mb={3} color="primary">
        <LocalHospital sx={{ mr: 1 }} />
        Appointment Booking
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card sx={{ boxShadow: theme.shadows[3] }}>
        <CardContent>
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3,
            alignItems: 'center',
            [theme.breakpoints.down('sm')]: { flexDirection: 'column' }
          }}>
            <Autocomplete
              disablePortal
              options={sectionsList}
              getOptionLabel={(option) => option.label}
              value={sectionsList.find((s) => s.value === section)}
              onChange={(e, newValue) => setSection(newValue?.value ?? -1)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Section"
                  size="small"
                  sx={{ minWidth: 200 }}
                />
              )}
              isOptionEqualToValue={(option, value) => option.value === value.value}
            />

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              ml: 'auto',
              [theme.breakpoints.down('sm')]: { width: '100%', justifyContent: 'space-between' }
            }}>
              <Button
                variant="outlined"
                onClick={() => handleWeekChange('prev')}
                sx={{ minWidth: 100 }}
              >
                ← Previous
              </Button>
              <Typography variant="h6" fontWeight={500}>
                {currentWeekStart.format('MMMM YYYY')}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => handleWeekChange('next')}
                sx={{ minWidth: 100 }}
              >
                Next →
              </Button>
            </Box>
          </Box>

          <Grid container spacing={1}>
            <ToastContainer></ToastContainer>
            {generateWeekDates().map((date) => {
              const dateKey = date.format('YYYY-MM-DD');
              return (
                <DayColumn
                  key={dateKey}
                  date={date}
                  doctors={selectedDateSlots[dateKey]}
                  loading={loadingDates[dateKey]}
                  isToday={date.isSame(dayjs(), 'day')}
                  onClick={() => handleDayClick(date)}
                  onSlotClick={(slot) => {
                    setSelectedSlot(slot);
                    setOpenModal(true);
                  }}
                />
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      <BookingModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleBookingSubmit}
        slot={selectedSlot}
        loading={submitting}
        resetTrigger={bookingResetTrigger} />
    </Box>
  );
};

export default Appointment;