import * as React from "react";
import { useState, useEffect } from "react";
import {
    Box, Grid, Typography, Paper, TextField, Button, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Card, CircularProgress, 
    Autocomplete, Avatar, Chip, useTheme
} from "@mui/material";
import {
    LocalHospital as HospitalIcon,
    CheckCircle as SeenIcon,
    Output as CheckoutIcon,
    PendingActions as WaitingIcon,
    Search as SearchIcon,
    CalendarMonth as DateIcon,
    Person as DoctorIcon
} from "@mui/icons-material";
import dayjs from "dayjs";
import api from "../../utils/Url";
import ToastApp from "../../ToastApp";
import { toast } from "react-toastify";

interface DoctorOption {
    label: string;
    value: number | string;
}

interface PatientDataRow {
    userID: number;
    userName: string;
    patientAdmitted: number;
    seenByDoc: number;
    patientCheckedOut: number;
    patientNotSeen: number;
}

export default function DrPatientStatus() {
    const theme = useTheme();
    const today = dayjs().format("YYYY-MM-DD");

    const [fromDate, setFromDate] = useState<string>(today);
    const [doctor, setDoctor] = useState<number | string>(-1);
    const [doctorOptions, setDoctorOptions] = useState<DoctorOption[]>([]);
    
    const [patientData, setPatientData] = useState<PatientDataRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isDoctorListLoaded, setIsDoctorListLoaded] = useState<boolean>(false);

    // --- Fetch Doctors ---
    useEffect(() => {
        const getDoctors = async () => {
            try {
                const resp = await api.get(`Login/GetUserList?CommonID=-1&Type=3`);
                const fetchedOptions: DoctorOption[] = resp?.data?.data?.map((item: any) => ({
                    label: item?.userName || "Unknown Doctor",
                    value: item?.userID,
                })) || [];
                setDoctorOptions([{ label: "All Doctors", value: -1 }, ...fetchedOptions]);
            } catch (error) {
                setDoctorOptions([{ label: "All Doctors", value: -1 }]);
            } finally {
                 setIsDoctorListLoaded(true);
            }
        };
        getDoctors();
    }, []);

    // --- Fetch Report Data ---
    const fetchData = async () => {
        if (!fromDate) return toast.warning("Please select a date");
        setLoading(true);
        try {
            const payload = {
                fromDate: dayjs(fromDate).format("DD MMM YYYY"),
                doctorID: doctor,
                toDate: dayjs().format("DD MMM YYYY"), // Current date formatting
                userID: -1,
                formID: -1,
                type: 5,
            };
            const resp = await api.post(`Reports/GetDoctorWiseAna`, payload);
            if (resp?.data?.isSuccess) {
                setPatientData(resp.data.result || []);
            } else {
                setPatientData([]);
            }
        } catch (error) {
            toast.error("Error fetching report data");
            setPatientData([]);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Grand Totals for Top Cards
    const totalAdmitted = patientData.reduce((acc, curr) => acc + (curr.patientAdmitted || 0), 0);
    const totalSeen = patientData.reduce((acc, curr) => acc + (curr.seenByDoc || 0), 0);
    const totalCheckedOut = patientData.reduce((acc, curr) => acc + (curr.patientCheckedOut || 0), 0);
    const totalNotSeen = patientData.reduce((acc, curr) => acc + (curr.patientNotSeen || 0), 0);

    const StatCard = ({ title, count, icon: Icon, color, bg }: any) => (
        <Card elevation={0} sx={{ p: 2, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2, bgcolor: bg, border: `1px solid ${color}30` }}>
            <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}><Icon fontSize="large" /></Avatar>
            <Box>
                <Typography variant="h4" fontWeight="900" color={color}>{count}</Typography>
                <Typography variant="subtitle2" color="textSecondary" fontWeight="bold" textTransform="uppercase">{title}</Typography>
            </Box>
        </Card>
    );

    return (
        <Box sx={{ animation: 'fadeIn 0.5s ease-in', p: 1 }}>
            <ToastApp />

            {/* HEADER SECTION */}
            <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HospitalIcon fontSize="large" /> Doctor Wise Patient Analytics
            </Typography>
            
            {/* 1. FILTER SECTION */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 4, bgcolor: '#fdfdfd' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4} md={3}>
                        <TextField
                            fullWidth size="small" type="date" label="Date"
                            value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                            InputProps={{ startAdornment: <DateIcon color="action" sx={{ mr: 1 }} /> }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={5} md={4}>
                        <Autocomplete
                            options={doctorOptions}
                            value={doctorOptions.find(opt => opt.value === doctor) || doctorOptions[0]}
                            onChange={(e, newValue) => setDoctor(newValue ? newValue.value : -1)}
                            renderInput={(params) => (
                                <TextField {...params} label="Select Doctor" size="small" 
                                   InputProps={{ ...params.InputProps, startAdornment: <DoctorIcon color="action" sx={{ ml: 1, mr: 1 }} /> }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3} md={2}>
                        <Button 
                            fullWidth variant="contained" size="large"
                            onClick={fetchData} disabled={!isDoctorListLoaded || loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                            sx={{ borderRadius: 2, fontWeight: 'bold' }}
                        >
                            Generate
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* 2. GRAND TOTAL CARDS (Visible only when data exists) */}
            {patientData.length > 0 && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Total Admitted" count={totalAdmitted} icon={HospitalIcon} color={theme.palette.primary.main} bg="#e3f2fd" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Consultation Done" count={totalSeen} icon={SeenIcon} color={theme.palette.success.main} bg="#e8f5e9" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Checked Out" count={totalCheckedOut} icon={CheckoutIcon} color={theme.palette.info.main} bg="#e1f5fe" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard title="Not Seen (Waiting)" count={totalNotSeen} icon={WaitingIcon} color={theme.palette.warning.main} bg="#fff8e1" />
                    </Grid>
                </Grid>
            )}

            {/* 3. DOCTOR WISE REPORT TABLE */}
            <Paper elevation={3} sx={{ borderRadius: 4, overflow: "hidden" }}>
                <Box sx={{ p: 2, bgcolor: theme.palette.grey[100], borderBottom: '1px solid #eee' }}>
                    <Typography variant="h6" fontWeight="bold">Doctor Wise Breakdown</Typography>
                </Box>
                
                {loading ? ( 
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                        <CircularProgress />
                    </Box>
                ) : patientData.length > 0 ? (
                    <TableContainer sx={{ maxHeight: 500 }}>
                        <Table stickyHeader size="medium">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fafafa', fontSize: '1.05rem' }}>Doctor Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fafafa' }} align="center">Admitted</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fafafa' }} align="center">Seen</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fafafa' }} align="center">Checked Out</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fafafa' }} align="center">Not Seen</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {patientData.map((row, index) => (
                                    <TableRow key={index} hover sx={{ '&:last-child td': { border: 0 } }}>
                                        <TableCell>
                                           <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                                               {row.userName}
                                           </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                           <Chip label={row.patientAdmitted} size="small" sx={{ fontWeight: 'bold', minWidth: 40 }} />
                                        </TableCell>
                                        <TableCell align="center">
                                           <Chip label={row.seenByDoc} color="success" size="small" variant={row.seenByDoc > 0 ? "filled" : "outlined"} sx={{ fontWeight: 'bold', minWidth: 40 }} />
                                        </TableCell>
                                        <TableCell align="center">
                                           <Chip label={row.patientCheckedOut} color="info" size="small" variant={row.patientCheckedOut > 0 ? "filled" : "outlined"} sx={{ fontWeight: 'bold', minWidth: 40 }} />
                                        </TableCell>
                                        <TableCell align="center">
                                           <Chip label={row.patientNotSeen} color="warning" size="small" variant={row.patientNotSeen > 0 ? "filled" : "outlined"} sx={{ fontWeight: 'bold', minWidth: 40 }} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box textAlign="center" py={10}>
                        <WaitingIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="textSecondary">No report data found for this date.</Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
