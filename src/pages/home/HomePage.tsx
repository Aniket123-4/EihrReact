
import React, { ReactNode, useEffect, useState } from "react";
import {
    Box,
    Button,
    Grid,
    Typography,
    TextField,
    FormControl,
    Card,
    Paper,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    Collapse,
    Divider,
    useTheme,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableFooter,
    TablePagination,
    Tooltip,
    CircularProgress,
    Badge,
    Skeleton,
    Chip,
    Avatar,
    Container,
    CardContent,
    CardHeader,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton as MuiIconButton,
    Alert,
    Snackbar,
} from "@mui/material";

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StarIcon from '@mui/icons-material/Star';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import RepeatIcon from '@mui/icons-material/Repeat';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TodayIcon from '@mui/icons-material/Today';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CloseIcon from '@mui/icons-material/Close';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import PrintOutlined from '@mui/icons-material/PrintOutlined';

import { PhoneIcon, TagIcon } from "lucide-react";
import { PieChart } from "@mui/x-charts/PieChart";
import api from "../../utils/Url";
import { getISTDate } from "../../utils/Constant";
import { useFormik } from "formik";

// ==================== TYPES ====================
interface SelectOption {
    label: string;
    value: string | number;
}

interface PatientData {
    bloodGroup: string | null;
    patientID: number;
    patientNo: string;
    candName: string;
    curMobileNo: string | null;
    dob: string | null;
    email: string | null;
}

interface Appointment {
    doctorName: string;
    patientNo: string;
    slotDateVar: string;
    slotTimeVar: string;
    weekName: string;
    isExpired: boolean;
}

interface PatientVisit {
    doctorName: string;
    patientCaseNo: string;
    admNo: string;
    actualVisitDateVar: string;
    vPreEmpTypeName: string;
    isConsultencyPaid: boolean;
}

// ==================== MAIN COMPONENT ====================
export default function HomePage() {
    const theme = useTheme();
    const { defaultValuestime } = getISTDate();
    
    // ========== Common State (ALWAYS at top level) ==========
    const [verifiedUser, setVerifiedUser] = useState<any>(null);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [userType, setUserType] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

    // ========== Admin Dashboard State (ALWAYS at top level) ==========
    type StatusModalType = 'registration' | 'new' | 'revisit' | 'checkout';
    const [selectedModal, setSelectedModal] = useState<StatusModalType | null>(null);
    const [modalPatients, setModalPatients] = useState<PatientData[]>([]);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [patientList, setPatientList] = useState<PatientData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingStatus, setIsFetchingStatus] = useState(false);
    const [selectedVisitType, setSelectedVisitType] = useState('newVisit');
    const [openFilter, setOpenFilter] = useState(false);
    const [statusCounts, setStatusCounts] = useState({
        registration: { count: 0, typeId: 1 },
        new: { count: 0, typeId: 3 },
        revisit: { count: 0, typeId: 4 },
        checkout: { count: 0, typeId: 2 },
    });
    const [adminPage, setAdminPage] = useState(0);
    const [adminRowsPerPage, setAdminRowsPerPage] = useState(10);

    // ========== Candidate Dashboard State (ALWAYS at top level) ==========
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [appointmentHistory, setAppointmentHistory] = useState<Appointment[]>([]);
    const [patientVisits, setPatientVisits] = useState<PatientVisit[]>([]);
    const [analysis, setAnalysis] = useState<any[]>([]);
    const [candidateLoading, setCandidateLoading] = useState(false);
    const [printDataRecord, setPrintDataRecord] = useState<any>(null);
    const [showPdf, setShowPdf] = useState(false);
    const [base64Data, setBase64Data] = useState<string>("");
    const [candidatePage, setCandidatePage] = useState(0);
    const [candidateRowsPerPage, setCandidateRowsPerPage] = useState(5);

    // ========== Formik for Admin (ALWAYS at top level) ==========
    const formik = useFormik({
        initialValues: {
            fromDate: defaultValuestime.slice(0, 10),
            toDate: defaultValuestime.slice(0, 10),
            caseNo: "",
            peteintNo: "",
            name: "",
            UId: "",
            fileNO: "",
            mobNo: "",
            phnNo: "",
            CaseTypeId: 0,
            specilizationID: 0,
            doctorID: "all",
            type: 1,
        },
        onSubmit: async () => searchPatients(),
    });

    // ========== Helper Functions ==========
    const showMessage = (message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity });
    };

    const getUserFromMultipleSources = () => {
        const verifiedUserStr = localStorage.getItem("verifiedUser");
        if (verifiedUserStr) {
            try {
                const parsed = JSON.parse(verifiedUserStr);
                if (parsed?.userID) {
                    console.log("✅ User found in 'verifiedUser' key");
                    return parsed;
                }
            } catch(e) {}
        }
        
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const parsed = JSON.parse(userStr);
                if (parsed?.verifiedUser?.userID) {
                    console.log("✅ User found in 'user' key");
                    return parsed.verifiedUser;
                }
                if (parsed?.userID) {
                    console.log("✅ User found in 'user' key (direct)");
                    return parsed;
                }
            } catch(e) {}
        }
        
        return null;
    };

    // ========== Admin Dashboard APIs ==========
    const getStatus = async () => {
        setIsFetchingStatus(true);
        try {
            const collectData = {
                curDate: defaultValuestime,
                cntTypeID: -1,
                userID: -1,
                formID: -1,
                type: 1,
            };
            const res = await api.post(`GetPatientDailyCount`, collectData);
            const data = res?.data?.result[0] || {};
            setStatusCounts(prev => ({
                ...prev,
                registration: { ...prev.registration, count: data?.patReg || 0 },
                new: { ...prev.new, count: data?.patNewCase || 0 },
                revisit: { ...prev.revisit, count: data?.patRevisit || 0 },
                checkout: { ...prev.checkout, count: data?.patCheckOut || 0 },
            }));
        } catch (error) {
            console.error("Error fetching status counts:", error);
        } finally {
            setIsFetchingStatus(false);
        }
    };

    const fetchPatients = async (type: StatusModalType) => {
        setIsModalLoading(true);
        try {
            const typeId = statusCounts[type].typeId;
            const collectData = {
                type: typeId,
                fromToDate: [defaultValuestime.slice(0, 10), defaultValuestime.slice(0, 10)],
                patientCaseNo: "",
                patientNo: "",
                patientName: "",
                patientUIDNo: "",
                caseTypeID: -1,
                sectionID: -1,
                consultantDocID: -1,
                patientFileNo: "",
                patientMobile: "",
                patientPhone: "",
                fromDate: defaultValuestime.slice(0, 10),
                toDate: defaultValuestime.slice(0, 10),
                patientID: -1,
                userID: -1,
                patientCaseID: "-1",
                formID: -1,
            };
            const res = await api.post(`GetPatientSearchOPIP`, collectData);
            setModalPatients(res?.data?.result || []);
        } catch (error) {
            console.error(`Error fetching ${type} patients:`, error);
        } finally {
            setIsModalLoading(false);
        }
    };

    const searchPatients = async (resetPage = true) => {
        setIsLoading(true);
        if (resetPage) setAdminPage(0);
        try {
            const collectData = {
                fromToDate: [formik.values.fromDate, formik.values.toDate],
                patientCaseNo: formik.values.caseNo || "",
                patientNo: formik.values.peteintNo || "",
                patientName: formik.values.name || "",
                patientUIDNo: formik.values.UId || "",
                caseTypeID: formik.values.CaseTypeId || -1,
                sectionID: formik.values.specilizationID || -1,
                consultantDocID: -1,
                patientFileNo: formik.values.fileNO || "",
                patientMobile: formik.values.mobNo || "",
                patientPhone: formik.values.phnNo || "",
                fromDate: formik.values.fromDate || "",
                toDate: formik.values.toDate || "",
                patientID: -1,
                userID: -1,
                patientCaseID: "-1",
                formID: -1,
                type: formik.values.type,
            };
            const res = await api.post(`GetPatientSearchOPIP`, collectData);
            setPatientList(res?.data?.result || []);
        } catch (error) {
            console.error("Error searching patients:", error);
            setPatientList([]);
        } finally {
            setIsLoading(false);
        }
    };

    // ========== Candidate Dashboard APIs ==========
    const getOnlinePatient = async (type: number = 1) => {
        if (!verifiedUser?.userID) return;
        setCandidateLoading(true);
        try {
            const params = {
                onlinePatientID: verifiedUser.userID,
                userID: -1,
                formID: -1,
                type: type
            };
            const res = await api.post(`Online/GetOnlinePatient`, params);
            
            if (type === 1) {
                setSelectedRows(res?.data?.result?.[0] || {});
            } else if (type === 2) {
                setAppointmentHistory(res?.data?.result || []);
                setPatientVisits(res?.data?.result1 || []);
                if (res?.data?.result2 && Array.isArray(res.data.result2)) {
                    const chartData = res.data.result2.map((item: any, index: number) => ({
                        id: index,
                        value: item.visitCount || 0,
                        label: item.yearData || `Year ${index + 1}`,
                    }));
                    setAnalysis(chartData);
                }
            }
        } catch (error) {
            console.error(error);
            showMessage("Failed to load data", "error");
        } finally {
            setCandidateLoading(false);
        }
    };

    const handlePrint = (record: Appointment) => {
        setPrintDataRecord(record);
        setTimeout(() => {
            const printContents = document.getElementById("printData")?.innerHTML;
            if (printContents && printContents.trim() !== "") {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                    printWindow.document.write(`
                        <html>
                            <head>
                                <title>Print Appointment</title>
                                <style>
                                    body { font-family: Arial, sans-serif; padding: 20px; }
                                    @media print { body { margin: 0; padding: 20px; } }
                                </style>
                            </head>
                            <body>${printContents}</body>
                        </html>
                    `);
                    printWindow.document.close();
                    printWindow.print();
                    printWindow.close();
                }
            }
            setPrintDataRecord(null);
        }, 100);
    };

    const handlePrintReport = async () => {
        if (!verifiedUser?.userID) return;
        setCandidateLoading(true);
        try {
            const params = {
                onlinePatientID: verifiedUser.userID,
                userID: -1,
                formID: -1,
                type: 2,
                show: false,
                exportOption: ".pdf"
            };
            const res = await api.post(`Reports/OnlinePatientAppoinmentReceipt`, params);
            if (res?.data) {
                setBase64Data(res.data);
                setShowPdf(true);
            }
        } catch (error) {
            showMessage("Failed to generate report", "error");
        } finally {
            setCandidateLoading(false);
        }
    };

    const handleStatusCardClick = async (type: StatusModalType) => {
        setSelectedModal(type);
        fetchPatients(type);
    };

    const handleVisitTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedVisitType(event.target.value);
        if (event.target.value === "followUpVisit") formik.setFieldValue('type', 2);
        else if (event.target.value === "visitStatusUpdate") formik.setFieldValue('type', 3);
        else formik.setFieldValue('type', 1);
    };

    const handleClearFilters = () => {
        formik.resetForm();
        setPatientList([]);
        setAdminPage(0);
    };

    const handleChangeAdminPage = (event: unknown, newPage: number) => setAdminPage(newPage);
    const handleChangeAdminRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAdminRowsPerPage(parseInt(event.target.value, 10));
        setAdminPage(0);
    };

    const handleChangeCandidatePage = (event: unknown, newPage: number) => setCandidatePage(newPage);
    const handleChangeCandidateRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCandidateRowsPerPage(parseInt(event.target.value, 10));
        setCandidatePage(0);
    };

    // ========== Pagination Calculations ==========
    const displayedPatients = patientList.slice(adminPage * adminRowsPerPage, adminPage * adminRowsPerPage + adminRowsPerPage);
    const displayedAppointments = appointmentHistory.slice(candidatePage * candidateRowsPerPage, candidatePage * candidateRowsPerPage + candidateRowsPerPage);
    const emptyRows = candidatePage > 0 ? Math.max(0, (1 + candidatePage) * candidateRowsPerPage - appointmentHistory.length) : 0;

    const pieChartData = analysis.length > 0 ? analysis : [
        { id: 0, value: 33, label: "Visits" },
        { id: 1, value: 26, label: "Appointments" },
        { id: 2, value: 22, label: "Year" },
    ];

    // ========== Status Modal Component (defined inside, but it's a function, not a hook) ==========
    const renderStatusModal = () => {
        const getModalConfig = (type: StatusModalType) => {
            switch (type) {
                case 'registration':
                    return { title: 'Registration Patients', icon: <PersonAddAltIcon sx={{ mr: 1.5, fontSize: 28 }} /> };
                case 'new':
                    return { title: 'New Visit Patients', icon: <FiberNewIcon sx={{ mr: 1.5, fontSize: 28 }} /> };
                case 'revisit':
                    return { title: 'Revisit Patients', icon: <RepeatIcon sx={{ mr: 1.5, fontSize: 28 }} /> };
                case 'checkout':
                    return { title: 'Checkout Patients', icon: <CheckCircleOutlineIcon sx={{ mr: 1.5, fontSize: 28 }} /> };
                default:
                    return { title: '', icon: null };
            }
        };

        const { title, icon } = getModalConfig(selectedModal!);

        return (
            <Dialog open={!!selectedModal} onClose={() => setSelectedModal(null)} fullWidth maxWidth="md" scroll="paper">
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: theme.palette.primary.main, color: 'white' }}>
                    <Box display="flex" alignItems="center">{icon}<Typography variant="h6">{title}</Typography></Box>
                    {/* <IconButton 
                    
                    onClick={() => setSelectedModal(null)} sx={{ color: 'white' }}><CloseIcon /></IconButton> */}
                </DialogTitle>
                <DialogContent dividers>
                    <TableContainer component={Paper}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Patient NO.</TableCell><TableCell>Patient Details</TableCell><TableCell>Contact</TableCell><TableCell>Date of Birth</TableCell><TableCell>Blood Group</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isModalLoading ? (
                                    Array(5).fill(0).map((_, i) => (<TableRow key={i}><TableCell colSpan={5}><Skeleton height={40} /></TableCell></TableRow>))
                                ) : modalPatients.map(patient => (
                                    <TableRow key={patient.patientID} hover>
                                        <TableCell><TagIcon size={16} style={{ marginRight: 8 }} />{patient.patientNo}</TableCell>
                                        <TableCell><Avatar sx={{ width: 32, height: 32, mr: 2 }}>{patient.candName.charAt(0)}</Avatar>{patient.candName}</TableCell>
                                        <TableCell><PhoneIcon size={16} style={{ marginRight: 8 }} />{patient.curMobileNo || '-'}</TableCell>
                                        <TableCell><Chip label={patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'} size="small" icon={<CalendarTodayIcon />} /></TableCell>
                                        <TableCell>{patient.bloodGroup || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        );
    };

    const StatBadge = ({ icon, value, label }: { icon: ReactNode; value: string | number; label: string }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Badge badgeContent={icon} color="default" />
            <div>
                <Typography variant="body2" fontWeight={600}>{value}</Typography>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
            </div>
        </Box>
    );

    // ========== ALL useEffects at TOP LEVEL (NOT inside conditions) ==========
    // Effect 1: Load user from storage
    useEffect(() => {
        const user = getUserFromMultipleSources();
        console.log("Final extracted user:", user);
        
        if (user) {
            setVerifiedUser(user);
            const typeId = user.userTypeID?.toString() || user.userType?.toString();
            console.log("User Type ID:", typeId);
            setUserType(typeId);
        }
        setIsAuthenticating(false);
    }, []);

    // Effect 2: Load admin data if user is admin
    useEffect(() => {
        if (verifiedUser && userType && userType !== '11') {
            getStatus();
        }
    }, [verifiedUser, userType]);

    // Effect 3: Load candidate data if user is candidate
    useEffect(() => {
        if (verifiedUser?.userID && userType === '11') {
            getOnlinePatient(1);
            getOnlinePatient(2);
        }
    }, [verifiedUser?.userID, userType]);

    // ========== Loading State ==========
    if (isAuthenticating) {
        return (
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Loading dashboard...</Typography>
                </Box>
            </Container>
        );
    }

    if (!verifiedUser) {
        return (
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Card sx={{ p: 5, textAlign: "center" }}>
                    <Typography variant="h5" color="error">User Not Authenticated</Typography>
                    <Typography variant="body1">Please login to view your dashboard.</Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => window.location.href = "/login"}>Go to Login</Button>
                </Card>
            </Container>
        );
    }

    // ========== RENDER ADMIN DASHBOARD (userType !== '11') ==========
    if (userType !== '11') {
        return (
            <Box sx={{ width: "100%", mt: 2 }}>
                {renderStatusModal()}
                <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
                </Snackbar>
                
                <Paper elevation={3} sx={{ width: "100%", overflow: "hidden", p: { xs: 1.5, md: 3 } }}>
                    {/* Status Cards */}
                    <Grid container spacing={3} sx={{ mb: 4, px: 2 }}>
                        {[
                            { type: 'registration' as StatusModalType, label: "Registration", value: statusCounts.registration.count, icon: <PersonAddAltIcon />, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                            { type: 'new' as StatusModalType, label: "New Visit", value: statusCounts.new.count, icon: <FiberNewIcon />, gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' },
                            { type: 'revisit' as StatusModalType, label: "Revisit", value: statusCounts.revisit.count, icon: <RepeatIcon />, gradient: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)' },
                            { type: 'checkout' as StatusModalType, label: "Checkout", value: statusCounts.checkout.count, icon: <CheckCircleOutlineIcon />, gradient: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)' },
                        ].map((status, idx) => (
                            <Grid item xs={12} sm={6} md={3} key={idx}>
                                <Card 
                                // onClick={() => handleStatusCardClick(status.type)}
                                 sx={{ cursor: 'pointer', background: status.gradient, color: 'white', p: 2, '&:hover': { transform: 'translateY(-4px)' } }}>
                                    <Box display="flex" justifyContent="space-between">
                                        <Box sx={{ p: 1.5, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>{React.cloneElement(status.icon, { sx: { fontSize: 28 } })}</Box>
                                    </Box>
                                    <Typography variant="subtitle2" sx={{ mt: 2, opacity: 0.9 }}>{status.label}</Typography>
                                    <Typography variant="h4" fontWeight="bold">{status.value} <Typography component="span" variant="body2">Patients</Typography></Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Filters */}
                    <Box sx={{ mb: 2 }}>
                        <Button onClick={() => setOpenFilter(!openFilter)} variant="contained" color="secondary" fullWidth startIcon={<FilterListIcon />} endIcon={openFilter ? <ExpandLess /> : <ExpandMore />}>
                            Search Filters
                        </Button>
                    </Box>

                    <Collapse in={openFilter}>
                        <Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 2.5, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <RadioGroup row value={selectedVisitType} onChange={handleVisitTypeChange}>
                                        <FormControlLabel value="newVisit" control={<Radio />} label="New Visit" />
                                        <FormControlLabel value="followUpVisit" control={<Radio />} label="Follow Up Visit" />
                                        <FormControlLabel value="visitStatusUpdate" control={<Radio />} label="Visit Status Update" />
                                    </RadioGroup>
                                </Grid>
                                <Grid item xs={12}><Divider /></Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField fullWidth name="fromDate" label="From Date" type="date" size="small" InputLabelProps={{ shrink: true }} value={formik.values.fromDate} onChange={formik.handleChange} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField fullWidth name="toDate" label="To Date" type="date" size="small" InputLabelProps={{ shrink: true }} value={formik.values.toDate} onChange={formik.handleChange} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField fullWidth label="Patient No" size="small" name="peteintNo" value={formik.values.peteintNo} onChange={formik.handleChange} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField fullWidth label="Patient Name" size="small" name="name" value={formik.values.name} onChange={formik.handleChange} />
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                                    <Button variant="outlined" onClick={handleClearFilters} startIcon={<ClearAllIcon />}>Clear</Button>
                                    <Button type="submit" variant="contained" disabled={isLoading} startIcon={isLoading ? <CircularProgress size={20} /> : <SearchIcon />}>Apply Filters</Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>

                    {/* Patient List */}
                    <Typography variant="h6" gutterBottom>Patient List ({patientList.length} found)</Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow sx={{ '& th': { bgcolor: theme.palette.primary.light, color: 'white', fontWeight: 'bold' } }}>
                                    <TableCell>Patient No</TableCell><TableCell>Name</TableCell><TableCell>Case No</TableCell><TableCell align="center">VIP</TableCell><TableCell>D.O.B</TableCell><TableCell>Age</TableCell><TableCell align="center">Gender</TableCell><TableCell>Blood Group</TableCell><TableCell>Mobile Number</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={9} align="center"><CircularProgress /><Typography>Loading Patients...</Typography></TableCell></TableRow>
                                ) : displayedPatients.length > 0 ? (
                                    displayedPatients.map((patient: any) => (
                                        <TableRow key={patient.patientID} hover>
                                            <TableCell>{patient.patientNo}</TableCell>
                                            <TableCell>{patient.candName}</TableCell>
                                            <TableCell>{patient.patientCaseNo || '-'}</TableCell>
                                            <TableCell align="center">{patient.isVIP ? <StarIcon color="warning" /> : '-'}</TableCell>
                                            <TableCell>{patient.dob}</TableCell>
                                            <TableCell>{patient.age}</TableCell>
                                            <TableCell>{patient.genderName || '-'}</TableCell>
                                            <TableCell>{patient.bloodGroup}</TableCell>
                                            <TableCell>{patient.curMobileNo}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow><TableCell colSpan={9} align="center"><InfoOutlinedIcon sx={{ fontSize: 40 }} /><Typography>No Patient Data Found</Typography></TableCell></TableRow>
                                )}
                            </TableBody>
                            {patientList.length > 0 && (
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination rowsPerPageOptions={[10, 25, 50]} colSpan={9} count={patientList.length} rowsPerPage={adminRowsPerPage} page={adminPage} onPageChange={handleChangeAdminPage} onRowsPerPageChange={handleChangeAdminRowsPerPage} />
                                    </TableRow>
                                </TableFooter>
                            )}
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        );
    }

    // ========== RENDER CANDIDATE DASHBOARD (userType === '11') ==========
    return (
        <Container maxWidth="xl" sx={{ py: 3, minHeight: "100vh" }}>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>

            <Dialog open={showPdf} onClose={() => setShowPdf(false)} maxWidth="lg" fullWidth>
                <DialogTitle>Appointment Report<MuiIconButton onClick={() => setShowPdf(false)} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></MuiIconButton></DialogTitle>
                <DialogContent>{base64Data && <embed type="application/pdf" height="600" width="100%" src={`data:application/pdf;base64,${base64Data}`} />}</DialogContent>
            </Dialog>

            <div hidden id="printData">
                <Box sx={{ p: 3, border: "1px solid black", borderRadius: 2, maxWidth: 800, mx: "auto" }}>
                    <Typography variant="h4" align="center">Multifacet Systems Software Pvt Ltd</Typography>
                    <Typography variant="h5" align="center" color="primary">BR Super Specialty Hospital</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={6}><strong>Doctor Name:</strong> {printDataRecord?.doctorName}</Grid>
                        <Grid item xs={6}><strong>Patient Name:</strong> {selectedRows?.fName} {selectedRows?.lName}</Grid>
                        <Grid item xs={6}><strong>Patient No:</strong> {printDataRecord?.patientNo}</Grid>
                        <Grid item xs={6}><strong>Slot Date:</strong> {printDataRecord?.slotDateVar}</Grid>
                        <Grid item xs={6}><strong>Slot Time:</strong> {printDataRecord?.slotTimeVar}</Grid>
                        <Grid item xs={6}><strong>Week:</strong> {printDataRecord?.weekName}</Grid>
                        <Grid item xs={12}><strong>Slot Expired:</strong> {printDataRecord?.isExpired ? "Yes" : "No"}</Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" align="center">Thank you for being a customer with us!</Typography>
                </Box>
            </div>

            {candidateLoading && Object.keys(selectedRows).length === 0 ? (
                <Box display="flex" justifyContent="center" minHeight="60vh"><CircularProgress /></Box>
            ) : (
                <>
                    {/* Profile Card */}
                    <Card sx={{ mb: 4, borderRadius: 3 }}>
                        <CardContent>
                            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                                <Box position="relative" display="inline-flex">
                                    <CircularProgress variant="determinate" value={selectedRows?.profilePercentage || 0} size={160} thickness={4} />
                                    <Box position="absolute" top={0} left={0} bottom={0} right={0} display="flex" alignItems="center" justifyContent="center">
                                        <Avatar src={selectedRows?.profileImage ? `data:image/png;base64,${selectedRows.profileImage}` : undefined} sx={{ width: 145, height: 145 }}>{selectedRows?.fName?.charAt(0) || "U"}</Avatar>
                                    </Box>
                                </Box>
                                <Typography variant="h4">{`${selectedRows?.fName || ""} ${selectedRows?.mName || ""} ${selectedRows?.lName || ""}`}</Typography>
                            </Box>
                            <Divider><Chip label="Basic Information" /></Divider>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={6} md={3}><Typography variant="caption">First Name</Typography><Typography variant="body1">{selectedRows?.fName || "-"}</Typography></Grid>
                                <Grid item xs={12} sm={6} md={3}><Typography variant="caption">Middle Name</Typography><Typography variant="body1">{selectedRows?.mName || "-"}</Typography></Grid>
                                <Grid item xs={12} sm={6} md={3}><Typography variant="caption">Last Name</Typography><Typography variant="body1">{selectedRows?.lName || "-"}</Typography></Grid>
                                <Grid item xs={12} sm={6} md={3}><Typography variant="caption">Mobile No</Typography><Typography variant="body1">{selectedRows?.curMobileNo || "-"}</Typography></Grid>
                                <Grid item xs={12} sm={6} md={3}><Typography variant="caption">Date of Birth</Typography><Typography variant="body1">{selectedRows?.dob || "-"}</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Appointment List */}
                    <Card sx={{ mb: 4 }}>
                        <CardHeader title="Appointment List" action={<IconButton onClick={handlePrintReport}><DownloadOutlined /></IconButton>} />
                        <Divider />
                        <CardContent>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow><TableCell><b>Doctor Name</b></TableCell><TableCell><b>Patient No</b></TableCell><TableCell><b>Slot Date</b></TableCell><TableCell><b>Slot Time</b></TableCell><TableCell><b>Week</b></TableCell><TableCell><b>Slot Expired</b></TableCell><TableCell><b>Print</b></TableCell></TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {displayedAppointments.map((app, idx) => (
                                            <TableRow key={idx} hover>
                                                <TableCell>{app.doctorName}</TableCell>
                                                <TableCell>{app.patientNo}</TableCell>
                                                <TableCell>{app.slotDateVar}</TableCell>
                                                <TableCell>{app.slotTimeVar}</TableCell>
                                                <TableCell>{app.weekName}</TableCell>
                                                <TableCell><Chip label={app.isExpired ? "Yes" : "No"} color={app.isExpired ? "error" : "success"} size="small" /></TableCell>
                                                <TableCell><IconButton size="small" onClick={() => handlePrint(app)}><PrintOutlined /></IconButton></TableCell>
                                            </TableRow>
                                        ))}
                                        {emptyRows > 0 && <TableRow style={{ height: 53 * emptyRows }}><TableCell colSpan={7} /></TableRow>}
                                        {displayedAppointments.length === 0 && !candidateLoading && <TableRow><TableCell colSpan={7} align="center"><Typography color="textSecondary">No appointments found</Typography></TableCell></TableRow>}
                                    </TableBody>
                                    {appointmentHistory.length > 0 && (
                                        <TableFooter>
                                            <TableRow><TablePagination rowsPerPageOptions={[5, 10, 25]} colSpan={7} count={appointmentHistory.length} rowsPerPage={candidateRowsPerPage} page={candidatePage} onPageChange={handleChangeCandidatePage} onRowsPerPageChange={handleChangeCandidateRowsPerPage} /></TableRow>
                                        </TableFooter>
                                    )}
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    {/* Patient Visits */}
                    <Card sx={{ mb: 4 }}>
                        <CardHeader title="Patient Visits" />
                        <Divider />
                        <CardContent>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow><TableCell><b>Doctor Name</b></TableCell><TableCell><b>Patient Case No</b></TableCell><TableCell><b>Admission No</b></TableCell><TableCell><b>Visit Date</b></TableCell><TableCell><b>Type Name</b></TableCell><TableCell><b>Consultancy Paid</b></TableCell></TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {patientVisits.map((visit, idx) => (
                                            <TableRow key={idx} hover>
                                                <TableCell>{visit.doctorName}</TableCell>
                                                <TableCell>{visit.patientCaseNo}</TableCell>
                                                <TableCell>{visit.admNo}</TableCell>
                                                <TableCell>{visit.actualVisitDateVar}</TableCell>
                                                <TableCell>{visit.vPreEmpTypeName}</TableCell>
                                                <TableCell><Chip label={visit.isConsultencyPaid ? "Yes" : "No"} color={visit.isConsultencyPaid ? "success" : "error"} size="small" /></TableCell>
                                            </TableRow>
                                        ))}
                                        {patientVisits.length === 0 && !candidateLoading && <TableRow><TableCell colSpan={6} align="center"><Typography color="textSecondary">No patient visits found</Typography></TableCell></TableRow>}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    {/* Chart */}
                    <Card>
                        <CardHeader title="Analysis of Visits" />
                        <Divider />
                        <CardContent>
                            <Box display="flex" justifyContent="center" minHeight={400}>
                                <PieChart series={[{ data: pieChartData, highlightScope: { faded: "global", highlighted: "item" }, faded: { innerRadius: 30, additionalRadius: -30, color: "gray" } }]} height={400} width={500} slotProps={{ legend: { direction: "row", position: { vertical: "bottom", horizontal: "middle" }, padding: 0 } }} />
                            </Box>
                        </CardContent>
                    </Card>
                </>
            )}
        </Container>
    );
}