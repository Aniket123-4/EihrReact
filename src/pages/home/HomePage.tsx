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
    TableFooter, // Added for Pagination
    TablePagination, // Added for Pagination
    Tooltip, // Added for icons
    CircularProgress,
    Badge,
    Slide,
    Skeleton,
    Chip,
    Avatar, // Added for loading state
} from "@mui/material";

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StarIcon from '@mui/icons-material/Star';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'; // Icon for Registration
import FiberNewIcon from '@mui/icons-material/FiberNew'; // Icon for New
import RepeatIcon from '@mui/icons-material/Repeat'; // Icon for Revisit
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Icon for Checkout
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // Icon for navigation
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // Icon for Date
import TodayIcon from '@mui/icons-material/Today'; // Icon for Current Date
import PeopleIcon from '@mui/icons-material/People'; // Icon for Total Patients
import SearchIcon from '@mui/icons-material/Search'; // Icon for Apply Filters
import ClearAllIcon from '@mui/icons-material/ClearAll'; // Icon for Clear Filters
import api from "../../utils/Url";
import { getISTDate } from "../../utils/Constant";
import { useFormik } from "formik";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import { PhoneIcon, TagIcon } from "lucide-react";
interface SelectOption {
    label: string;
    value: string | number;
}
// Interface for Patient Data (adjust based on actual API response)
interface PatientData {
    bloodGroup: string | null;
    patientID: number;
    patientNo: string;
    candName: string;
    curMobileNo: string | null;
    dob: string | null;
    email: string | null;
}

export default function HomePage() {
    type StatusModalType = 'registration' | 'new' | 'revisit' | 'checkout';
    const [selectedModal, setSelectedModal] = useState<StatusModalType | null>(null);
    const [modalPatients, setModalPatients] = useState<PatientData[]>([]);
    const [isModalLoading, setIsModalLoading] = useState(false);


    const theme = useTheme();
    const { defaultValuestime } = getISTDate();

    const [patientList, setPatientList] = useState<PatientData[]>([]); // Use specific interface
    const [isLoading, setIsLoading] = useState(false); // Loading state for API calls
    const [isFetchingStatus, setIsFetchingStatus] = useState(false); // Loading state for status cards
    const [selectedVisitType, setSelectedVisitType] = useState('newVisit');
    const [openFilter, setOpenFilter] = useState(false); // Default to open for initial view?
    const [statusCounts, setStatusCounts] = useState({
        registration: { count: 0, typeId: 1 },
        new: { count: 0, typeId: 3 },
        revisit: { count: 0, typeId: 4 },
        checkout: { count: 0, typeId: 2 },
    });
    const handleStatusCardClick = async (type: StatusModalType) => {
        setSelectedModal(type);
        fetchPatients(type);
    };
    useEffect(() => {
        getStatus();

    }, []);

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
                // type: 1,
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

    // --- Pagination State ---
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
    const handleVisitTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedVisitType((event.target as HTMLInputElement).value);
        if (event.target.value === "followUpVisit") {
            formik.setFieldValue('type', 2)
        } else if (event.target.value === "visitStatusUpdate") {
            formik.setFieldValue('type', 3)
        } else {
            formik.setFieldValue('type', 1)
        }
    };
    const handleToggleFilter = () => {
        setOpenFilter(!openFilter);
    };

    interface StatusModalProps {
        // Add any props that the StatusModal component should accept
    }

    const StatusModal = React.forwardRef<HTMLDivElement, StatusModalProps>((props, ref) => {
        const getModalConfig = (type: StatusModalType) => {
            switch (type) {
                case 'registration':
                    return {
                        title: 'Registration Patients',
                        icon: <PersonAddAltIcon sx={{ mr: 1.5, fontSize: 28 }} />,
                        color: theme.palette.primary.main
                    };
                case 'new':
                    return {
                        title: 'New Visit Patients',
                        icon: <FiberNewIcon sx={{ mr: 1.5, fontSize: 28 }} />,
                        color: theme.palette.success.main
                    };
                case 'revisit':
                    return {
                        title: 'Revisit Patients',
                        icon: <RepeatIcon sx={{ mr: 1.5, fontSize: 28 }} />,
                        color: theme.palette.warning.main
                    };
                case 'checkout':
                    return {
                        title: 'Checkout Patients',
                        icon: <CheckCircleOutlineIcon sx={{ mr: 1.5, fontSize: 28 }} />,
                        color: theme.palette.info.main
                    };
                default:
                    return { title: '', icon: null, color: '' };
            }
        };

        const { title, icon, color } = getModalConfig(selectedModal!);

        return (
            <div ref={ref}>
                <Dialog
                    open={!!selectedModal}
                    onClose={() => setSelectedModal(null)}
                    fullWidth
                    maxWidth="md"
                    scroll="paper"
                    // TransitionComponent={(props) => <Slide {...props} direction="up" />}
                    sx={{
                        '& .MuiDialog-paper': {
                            borderRadius: 4,
                            boxShadow: 24,
                            background: 'linear-gradient(145deg, #f5f7fa 0%, #c3cfe2 100%)',
                            margin: 6,
                            width: 'calc(100% - 32px)',
                        },
                    }}
                >

                    <DialogTitle
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            py: 2,
                            px: 3,
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                        }}
                    >
                        <Box display="flex" alignItems="center">
                            {icon}
                            <Typography variant="h6" fontWeight="600">
                                {title}
                            </Typography>
                        </Box>
                        <IconButton
                            onClick={() => setSelectedModal(null)}
                            sx={{ color: theme.palette.primary.contrastText }}
                        >
                            <CloseIcon fontSize="medium" />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers sx={{ p: 0 }}>
                        <Box sx={{
                            p: 2,
                            bgcolor: 'background.paper',
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            display: 'flex',
                            gap: 3,
                            flexWrap: 'wrap'
                        }}>
                            <StatBadge
                                icon={<PeopleIcon color="info" />}
                                value={modalPatients.length}
                                label="Total Patients"
                            />
                            <StatBadge
                                icon={<TodayIcon color="success" />}
                                value={new Date().toLocaleDateString()}
                                label="Current Date"
                            />
                            <StatBadge
                                icon={<FilterListIcon color="warning" />}
                                value="Active"
                                label="Status"
                            />
                        </Box>
                        <TableContainer
                            component={Paper}
                            sx={{
                                maxHeight: '70vh',
                                border: 'none',
                                '&::-webkit-scrollbar': { width: '8px' },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: theme.palette.primary.light,
                                    borderRadius: 4
                                }
                            }}
                        >
                            <Table stickyHeader size="small" sx={{ minWidth: 800 }}>
                                <TableHead>
                                    <TableRow sx={{
                                        '& th': {
                                            backgroundColor: theme.palette.primary.light,
                                            color: theme.palette.primary.contrastText,
                                            fontWeight: 600,
                                            fontSize: '0.95rem'
                                        }
                                    }}>
                                        <TableCell sx={{ width: '15%' }}>Patient NO.</TableCell>
                                        <TableCell sx={{ width: '30%' }}>Patient Details</TableCell>
                                        <TableCell sx={{ width: '20%' }}>Contact</TableCell>
                                        <TableCell sx={{ width: '20%' }}>Date of Birth</TableCell>
                                        <TableCell sx={{ width: '15%' }}>Blood Group</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {isModalLoading ? (
                                        Array(5).fill(0).map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell colSpan={5}>
                                                    <Skeleton variant="text" height={40} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : modalPatients.length > 0 ? (
                                        modalPatients.map(patient => (
                                            <TableRow
                                                key={patient.patientID}
                                                hover
                                                sx={{
                                                    '&:hover': { backgroundColor: 'action.hover' },
                                                    '&:last-child td': { borderBottom: 0 }
                                                }}
                                            >
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <TagIcon fontSize="small" color="action" style={{ marginRight: 8 }} />
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {patient.patientNo}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar sx={{
                                                            width: 32,
                                                            height: 32,
                                                            mr: 2,
                                                            bgcolor: theme.palette.secondary.main
                                                        }}>
                                                            {patient.candName.charAt(0)}
                                                        </Avatar>
                                                        <div>
                                                            <Typography fontWeight={500}>{patient.candName}</Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {patient.email || 'No email'}
                                                            </Typography>
                                                        </div>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <PhoneIcon style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.54)', marginRight: '8px' }} />
                                                        {patient.curMobileNo || '-'}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'}
                                                        size="small"
                                                        icon={<CalendarTodayIcon fontSize="small" />}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        {patient.bloodGroup || '-'}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} sx={{ py: 4 }}>
                                                <Box
                                                    textAlign="center"
                                                    sx={{
                                                        maxWidth: 400,
                                                        mx: 'auto',
                                                        color: 'text.secondary'
                                                    }}
                                                >
                                                    <img
                                                        src="/empty-state.svg"
                                                        alt="No patients"
                                                        style={{ height: 120, marginBottom: 2 }}
                                                    />
                                                    <Typography variant="h6" gutterBottom>
                                                        No Patients Found
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Try adjusting your filters or check back later
                                                    </Typography>
                                                    <Button
                                                        variant="outlined"
                                                        sx={{ mt: 2 }}
                                                        onClick={() => setSelectedModal(null)}
                                                    >
                                                        Close
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{
                            p: 2,
                            bgcolor: 'background.paper',
                            borderTop: `1px solid ${theme.palette.divider}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography variant="body2" color="text.secondary">
                                Showing {modalPatients.length} of {modalPatients.length} results
                            </Typography>
                        </Box>
                    </DialogContent>

                </Dialog>
            </div>
        );
    });



    const searchPatients = async (resetPage = true) => {
        setIsLoading(true);
        if (resetPage) {
            setPage(0);
        }
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
            const data: PatientData[] = res?.data?.result || []; // Type assertion
            setPatientList(data);
        } catch (error) {
            console.error("Error searching patients:", error);
            setPatientList([]);
        } finally {
            setIsLoading(false);
        }
    };
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
        onSubmit: async (values) => {
            searchPatients();
        },
    });
    const handleClearFilters = () => {
        formik.resetForm();
        setPatientList([]);
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Go back to the first page
    };

    const displayedPatients = patientList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    // Calculate empty rows to avoid layout jumps
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - patientList.length) : 0;

    const StatBadge = ({ icon, value, label }: { icon: ReactNode; value: string | number; label: string }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Badge badgeContent={icon} color="default" />
            <div>
                <Typography variant="body2" fontWeight={600}>{value}</Typography>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
            </div>
        </Box>
    );

    return (
        <Box sx={{ width: "100%", mt: 2 }}> {/* Reduced top margin slightly */}
            <StatusModal />
            <Paper elevation={3} sx={{ width: "100%", overflow: "hidden", p: { xs: 1.5, md: 3 } }}>
                <Grid container spacing={3} sx={{ mb: 4, px: 2 }}>
                    {[
                        {
                            type: 'registration' as StatusModalType,
                            label: "Registration",
                            value: statusCounts.registration.count,
                            typeId: 1,
                            icon: <PersonAddAltIcon fontSize="medium" />,
                            color: theme.palette.primary.main,
                            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            loading: isFetchingStatus
                        },
                        {
                            type: 'new' as StatusModalType,
                            label: "New Visit",
                            value: statusCounts.new.count,
                            typeId: 3,
                            // value: statusCounts.new,
                            icon: <FiberNewIcon fontSize="medium" />,
                            color: theme.palette.success.main,
                            gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                            loading: isFetchingStatus
                        },
                        {
                            type: 'revisit' as StatusModalType,
                            label: "Revisit",
                            value: statusCounts.revisit.count,
                            typeId: 4,
                            //value: statusCounts.revisit,
                            icon: <RepeatIcon fontSize="medium" />,
                            color: theme.palette.warning.main,
                            gradient: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                            loading: isFetchingStatus
                        },
                        {
                            type: 'checkout' as StatusModalType,
                            label: "Checkout",
                            value: statusCounts.checkout.count,
                            typeId: 3,
                            //  value: statusCounts.checkout,
                            icon: <CheckCircleOutlineIcon fontSize="medium" />,
                            color: theme.palette.info.main,
                            gradient: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                            loading: isFetchingStatus
                        }
                    ].map((status: any, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}
                            onClick={() => handleStatusCardClick(status.type)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <Card
                                elevation={4}
                                sx={{
                                    p: 1,
                                    position: 'relative',
                                    overflow: 'visible',
                                    cursor: index === 0 ? 'pointer' : 'default',
                                    background: status.gradient,
                                    color: 'white',
                                    //  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: theme.shadows[6],
                                        ...(index === 0 && {
                                            '& .hover-arrow': {
                                                opacity: 1,
                                                right: -10
                                            }
                                        })
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -16,
                                        right: -16,
                                        width: 48,
                                        height: 48,
                                        background: 'rgba(255,255,255,0.15)',
                                        borderRadius: '50%',
                                        backdropFilter: 'blur(4px)'
                                    }
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Box sx={{
                                        p: 1.5,
                                        background: 'rgba(255,255,255,0.15)',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                    }}>
                                        {React.cloneElement(status.icon, {
                                            sx: {
                                                fontSize: 28,
                                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                            }
                                        })}
                                    </Box>

                                    {index === 0 && (
                                        <Box className="hover-arrow" sx={{
                                            position: 'absolute',
                                            right: 0,
                                            opacity: 0,
                                            //   transition: 'all 0.3s ease',
                                            color: 'white'
                                        }}>
                                            <ArrowForwardIosIcon fontSize="small" />
                                        </Box>
                                    )}
                                </Box>

                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" sx={{
                                        fontWeight: 600,
                                        letterSpacing: '0.5px',
                                        opacity: 0.9,
                                        mb: 0.5
                                    }}>
                                        {status.label}
                                    </Typography>

                                    {status.loading ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <CircularProgress
                                                size={28}
                                                thickness={4}
                                                sx={{ color: 'rgba(255,255,255,0.8)' }}
                                            />
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                Loading...
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Typography variant="h4" sx={{
                                            fontWeight: 700,
                                            letterSpacing: '-0.5px',
                                            lineHeight: 1.2,
                                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}>
                                            {status.value}
                                            <Typography component="span" variant="body2" sx={{
                                                ml: 1,
                                                opacity: 0.8,
                                                verticalAlign: 'middle'
                                            }}>
                                                Patients
                                            </Typography>
                                        </Typography>
                                    )}
                                </Box>

                                <Box sx={{
                                    position: 'absolute',
                                    bottom: -16,
                                    right: 16,
                                    width: 32,
                                    height: 32,
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '8px',
                                    transform: 'rotate(45deg)'
                                }} />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                {/* --- Filters Section Toggle --- */}
                <Box sx={{ mb: 2 }}>
                    <Button
                        onClick={handleToggleFilter}
                        variant="contained" // Changed to contained for more emphasis
                        color="secondary"
                        fullWidth
                        sx={{
                            justifyContent: 'space-between',
                            py: 1,
                            px: 2,
                            textTransform: 'none', // Prevent uppercase text
                            fontSize: '1rem',
                            backgroundColor: theme.palette.mode === 'dark' ? 'grey.700' : 'grey.200', // Subtle background
                            color: theme.palette.text.primary, // Use primary text color
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.300',
                            }
                        }}
                        startIcon={<FilterListIcon />}
                        endIcon={openFilter ? <ExpandLess /> : <ExpandMore />}
                    >
                        Search Filters
                    </Button>
                </Box>

                {/* --- Collapsible Filter Area --- */}
                <Collapse in={openFilter} unmountOnExit>
                    <Box
                        component="form" // Use form element for semantic correctness
                        onSubmit={formik.handleSubmit} // Handle submission via formik
                        sx={{
                            p: 2.5, // Slightly more padding
                            mb: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: theme.shape.borderRadius,
                            bgcolor: 'background.paper'
                        }}
                    >
                        <Grid container spacing={2.5} alignItems="center"> {/* Increased spacing */}

                            {/* Row 1: Visit Type Radios */}
                            <Grid item xs={12}>
                                <FormControl component="fieldset">
                                    <RadioGroup row name="visitType" value={selectedVisitType} onChange={handleVisitTypeChange}>
                                        <FormControlLabel value="newVisit" control={<Radio size="small" />} label="New Visit" />
                                        <FormControlLabel value="followUpVisit" control={<Radio size="small" />} label="Follow Up Visit" />
                                        <FormControlLabel value="visitStatusUpdate" control={<Radio size="small" />} label="Visit Status Update" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    id="fromDate"
                                    name="fromDate" // Name should match formik value
                                    label="From Date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    size="small"
                                    variant="outlined"
                                    value={formik.values.fromDate}
                                    onChange={formik.handleChange}
                                    error={formik.touched.fromDate && Boolean(formik.errors.fromDate)}
                                    helperText={formik.touched.fromDate && formik.errors.fromDate}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    id="toDate"
                                    name="toDate" // Name should match formik value
                                    label="To Date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    size="small"
                                    variant="outlined"
                                    value={formik.values.toDate}
                                    onChange={formik.handleChange}
                                    error={formik.touched.toDate && Boolean(formik.errors.toDate)}
                                    helperText={formik.touched.toDate && formik.errors.toDate}
                                />
                            </Grid>
                            {/* Row 3: Patient Identifiers */}

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField fullWidth label="Patient No" size="small" variant="outlined" id="peteintNo" name="peteintNo" value={formik.values.peteintNo} onChange={formik.handleChange} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField fullWidth label="Patient Name" size="small" variant="outlined" id="name" name="name" value={formik.values.name} onChange={formik.handleChange} />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleClearFilters}
                                    startIcon={<ClearAllIcon />}
                                >
                                    Clear
                                </Button>
                                <Button
                                    type="submit" // Submit the formik form
                                    variant="contained"
                                    color="primary"
                                    disabled={isLoading} // Disable button while loading
                                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                                >
                                    Apply Filters
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Collapse>

                {/* --- Patient List Section --- */}
                <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: openFilter ? 0 : 2 }}>
                    Patient List ({patientList.length} found)
                </Typography>

                <TableContainer component={Paper} elevation={2} sx={{ maxHeight: 600 }}> {/* Added Max Height for scroll */}
                    <Table stickyHeader sx={{ minWidth: 650 }} aria-label="patient list table" size="small">
                        <TableHead>
                            <TableRow sx={{ '& th': { backgroundColor: theme.palette.primary.light, color: theme.palette.primary.contrastText, fontWeight: 'bold' } }}>
                                <TableCell>Patient No</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Case No</TableCell>
                                <TableCell align="center">VIP</TableCell>
                                <TableCell>D.O.B</TableCell>
                                <TableCell>Age</TableCell>
                                <TableCell align="center">Gender</TableCell>
                                <TableCell>Blood Group</TableCell>
                                <TableCell>Mobile Number</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                                        <CircularProgress />
                                        <Typography>Loading Patients...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : displayedPatients.length > 0 ? (
                                displayedPatients.map((patient: any) => (
                                    <TableRow
                                        key={patient.patientID}
                                        hover
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'action.hover' } }}
                                    >
                                        <TableCell component="th" scope="row">{patient.patientNo}</TableCell>
                                        <TableCell>{patient.candName}</TableCell>
                                        <TableCell>{patient.patientCaseNo || '-'}</TableCell>
                                        <TableCell align="center">
                                            {patient.isVIP ? (
                                                <Tooltip title="VIP Patient">
                                                    <StarIcon color="warning" fontSize="small" />
                                                </Tooltip>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell component="th" scope="row">{patient.dob}</TableCell>
                                        <TableCell>{patient.age}</TableCell>
                                        <TableCell>{patient.genderName || '-'}</TableCell>
                                        <TableCell component="th" scope="row">{patient.bloodGroup}</TableCell>
                                        <TableCell>{patient.curMobileNo}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                // No Data Found Row (when not loading)
                                <TableRow>
                                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: 'column',
                                                alignItems: "center",
                                                color: "text.secondary",
                                            }}
                                        >
                                            <InfoOutlinedIcon sx={{ fontSize: 40, mb: 1 }} />
                                            <Typography variant="subtitle1">
                                                No Patient Data Found
                                            </Typography>
                                            <Typography variant="body2">
                                                Try adjusting your filters or check if patients match the criteria.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                            {emptyRows > 0 && !isLoading && displayedPatients.length > 0 && (
                                <TableRow style={{ height: 41 * emptyRows }}> {/* Adjust height based on your row height */}
                                    <TableCell colSpan={10} />
                                </TableRow>
                            )}
                        </TableBody>
                        {patientList.length > 0 && !isLoading && (
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 50, { label: 'All', value: -1 }]}
                                        colSpan={10}
                                        count={patientList.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: { 'aria-label': 'rows per page' },
                                            native: true,
                                        }}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        sx={{ borderTop: `1px solid ${theme.palette.divider}` }} // Add 
                                    />
                                </TableRow>
                            </TableFooter>
                        )}
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}




