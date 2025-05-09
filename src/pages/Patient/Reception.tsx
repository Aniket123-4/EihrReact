import React, { ReactNode, useEffect, useState, useCallback, useMemo } from "react";
import {
    Box,
    Button,
    Grid,
    Typography,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Card,
    Paper,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    Collapse,
    Divider,
    useTheme,
    Autocomplete,
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
    // Slide, // Slide transition was commented out, keeping it so
    Skeleton,
    Chip,
    Avatar,
    DialogActions,
    Theme, // Added for typing
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
import api from "../../utils/Url"; // Ensure this path is correct
import { getISTDate } from "../../utils/Constant"; // Ensure this path is correct
import { useFormik } from "formik";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import { Phone as PhoneIconLucide, Tag as TagIconLucide } from "lucide-react";

interface SelectOption {
    label: string;
    value: string | number;
}

interface CheckinModalData {
    admissionDate: string;
    sectionID: number;
    consultantDocID: number;
    proDiagnosis: string;
    patientFileNo: string;
    deductablePercentage: string;
    referToDocID: string;
    invParameterID: number;
    allergy: string;
    warnings: string;
    addiction: string;
    socialHistory: string;
    familyHistory: string;
    personalHistory: string;
    pastMedicalHistory: string;
    obstetrics: string;
    dischargeDate: string;
    patientID: string;
    patientCaseID: string;
    userID: number;
    formID: number;
    type: number;
    serviceID: number;
    isNextVisit: boolean;
    patientFoundID: number;
    preEmpTypeID: string;
    admTypeID: number;
    caseType: number;
}
interface PatientData {
    bloodGroup: string | null;
    patientID: number;
    patientNo: string;
    candName: string;
    curMobileNo: string | null;
    dob: string | null;
    email: string | null;
    patientCaseNo?: string;
    isVIP?: boolean;
    age?: string;
    genderName?: string;
}

type StatusModalType = 'registration' | 'new' | 'revisit' | 'checkout';

// --- Extracted CheckinModalComponent ---
interface CheckinModalComponentProps {
    open: boolean;
    onClose: () => void;
    formData: CheckinModalData;
    onFormDataChange: (field: keyof CheckinModalData, value: any) => void;
    specializationOptions: SelectOption[];
    consultantOptions: SelectOption[];
    investigationOptions: SelectOption[];
    fetchConsultants: (sectionId: number) => void;
    onSubmit: () => Promise<void>;
    isSubmitting: boolean;
}

const CheckinModalComponent = React.memo(({
    open,
    onClose,
    formData,
    onFormDataChange,
    specializationOptions,
    consultantOptions,
    investigationOptions,
    fetchConsultants,
    onSubmit,
    isSubmitting
}: CheckinModalComponentProps) => {

    const handleFieldChange = (field: keyof CheckinModalData, value: any) => {
        onFormDataChange(field, value);
    };

    const handleAutocompleteChange = (field: keyof CheckinModalData, newValue: SelectOption | null, isSectionTrigger: boolean = false) => {
        const value = newValue?.value ?? 0;
        onFormDataChange(field, value);
        if (isSectionTrigger && field === 'sectionID' && value) {
            fetchConsultants(value as number);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Patient Check-in
                <IconButton onClick={onClose} disabled={isSubmitting}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label="Admission Date" type="date" size="small" fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.admissionDate}
                            onChange={(e) => handleFieldChange('admissionDate', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Autocomplete
                            disablePortal id="section-autocomplete"
                            options={specializationOptions}
                            value={specializationOptions.find(opt => opt.value === formData.sectionID) || null}
                            onChange={(_event, newValue) => handleAutocompleteChange('sectionID', newValue, true)}
                            fullWidth size="small"
                            renderInput={(params) => <TextField {...params} label="Section" />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Autocomplete
                            disablePortal id="consultant-autocomplete"
                            options={consultantOptions}
                            value={consultantOptions.find(opt => opt.value === formData.consultantDocID) || null}
                            onChange={(_event, newValue) => handleAutocompleteChange('consultantDocID', newValue)}
                            fullWidth size="small"
                            renderInput={(params) => <TextField {...params} label="Consultant" />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label="Pro Diagnosis" fullWidth size="small"
                            value={formData.proDiagnosis}
                            onChange={(e) => handleFieldChange('proDiagnosis', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label="Patient File No" fullWidth size="small"
                            value={formData.patientFileNo}
                            onChange={(e) => handleFieldChange('patientFileNo', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label="Deductable Percentage" fullWidth size="small"
                            value={formData.deductablePercentage}
                            onChange={(e) => handleFieldChange('deductablePercentage', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Autocomplete
                            disablePortal id="inv-parameter-autocomplete"
                            options={investigationOptions}
                            value={investigationOptions.find(opt => opt.value === formData.invParameterID) || null}
                            onChange={(_event, newValue) => handleAutocompleteChange('invParameterID', newValue)}
                            fullWidth size="small"
                            renderInput={(params) => <TextField {...params} label="Inv Parameter" />}
                        />
                    </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Allergic History</Typography>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {[
                        { label: "Allergy", field: "allergy" as keyof CheckinModalData },
                        { label: "Warnings", field: "warnings" as keyof CheckinModalData },
                        { label: "Addiction", field: "addiction" as keyof CheckinModalData },
                        { label: "Social History", field: "socialHistory" as keyof CheckinModalData },
                        { label: "Family History", field: "familyHistory" as keyof CheckinModalData },
                        { label: "Personal History", field: "personalHistory" as keyof CheckinModalData },
                        { label: "Past Medical History", field: "pastMedicalHistory" as keyof CheckinModalData },
                        { label: "Obstetrics", field: "obstetrics" as keyof CheckinModalData },
                    ].map(item => (
                        <Grid item xs={12} sm={6} md={4} key={item.field}>
                            <TextField
                                label={item.label} size="small" fullWidth
                                value={formData[item.field]}
                                onChange={(e) => handleFieldChange(item.field, e.target.value)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                <Button variant="contained" onClick={onSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                </Button>
            </DialogActions>
        </Dialog>
    );
});
CheckinModalComponent.displayName = 'CheckinModalComponent'; // For better debugging

// --- Extracted StatBadgeComponent ---
interface StatBadgeProps {
    icon: ReactNode;
    value: string | number;
    label: string;
}
const StatBadgeComponent = React.memo(({ icon, value, label }: StatBadgeProps) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Badge badgeContent={icon} color="default" />
        <div>
            <Typography variant="body2" fontWeight={600}>{value}</Typography>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
        </div>
    </Box>
));
StatBadgeComponent.displayName = 'StatBadgeComponent';

// --- Extracted StatusModalComponent ---
interface StatusModalComponentProps {
    open: boolean;
    onClose: () => void;
    modalType: StatusModalType | null;
    patients: PatientData[];
    isLoading: boolean;
}
const StatusModalComponent = React.memo(({
    open,
    onClose,
    modalType,
    patients,
    isLoading,
}: StatusModalComponentProps) => {
    const theme = useTheme();

    const getModalConfig = useCallback((type: StatusModalType | null, currentTheme: Theme) => {
        if (!type) return { title: '', icon: null, color: currentTheme.palette.text.primary };
        switch (type) {
            case 'registration': return { title: 'Registration Patients', icon: <PersonAddAltIcon sx={{ mr: 1.5, fontSize: 28 }} />, color: currentTheme.palette.primary.main };
            case 'new': return { title: 'New Visit Patients', icon: <FiberNewIcon sx={{ mr: 1.5, fontSize: 28 }} />, color: currentTheme.palette.success.main };
            case 'revisit': return { title: 'Revisit Patients', icon: <RepeatIcon sx={{ mr: 1.5, fontSize: 28 }} />, color: currentTheme.palette.warning.main };
            case 'checkout': return { title: 'Checkout Patients', icon: <CheckCircleOutlineIcon sx={{ mr: 1.5, fontSize: 28 }} />, color: currentTheme.palette.info.main };
            default: return { title: '', icon: null, color: currentTheme.palette.text.primary };
        }
    }, []); // Removed theme from deps, pass it as arg

    if (!modalType) return null;
    const { title, icon } = getModalConfig(modalType, theme);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 4, boxShadow: 24,
                    background: 'linear-gradient(145deg, #f5f7fa 0%, #c3cfe2 100%)',
                    margin: { xs: 2, sm: 4, md: 6 },
                    width: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 64px)' }, // Responsive width
                    maxWidth: '900px',
                },
            }}
        >
            <DialogTitle sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: theme.palette.primary.main, color: theme.palette.primary.contrastText,
                py: 2, px: 3, borderTopLeftRadius: 8, borderTopRightRadius: 8,
            }}>
                <Box display="flex" alignItems="center">{icon}<Typography variant="h6" fontWeight="600">{title}</Typography></Box>
                <IconButton onClick={onClose} sx={{ color: theme.palette.primary.contrastText }}><CloseIcon fontSize="medium" /></IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <StatBadgeComponent icon={<PeopleIcon color="info" />} value={patients.length} label="Total Patients" />
                    <StatBadgeComponent icon={<TodayIcon color="success" />} value={new Date().toLocaleDateString()} label="Current Date" />
                    <StatBadgeComponent icon={<FilterListIcon color="warning" />} value="Active" label="Status" />
                </Box>
                <TableContainer component={Paper} sx={{ maxHeight: 'calc(70vh - 120px)', border: 'none', '&::-webkit-scrollbar': { width: '8px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: theme.palette.primary.light, borderRadius: 4 } }}>
                    <Table stickyHeader size="small" sx={{ minWidth: 800 }}>
                        <TableHead>
                            <TableRow sx={{ '& th': { backgroundColor: theme.palette.primary.light, color: theme.palette.primary.contrastText, fontWeight: 600, fontSize: '0.95rem' } }}>
                                <TableCell sx={{ width: '15%' }}>Patient NO.</TableCell>
                                <TableCell sx={{ width: '30%' }}>Patient Details</TableCell>
                                <TableCell sx={{ width: '20%' }}>Contact</TableCell>
                                <TableCell sx={{ width: '20%' }}>Date of Birth</TableCell>
                                <TableCell sx={{ width: '15%' }}>Blood Group</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                Array(5).fill(0).map((_, index) => (
                                    <TableRow key={index}><TableCell colSpan={5}><Skeleton variant="text" height={40} /></TableCell></TableRow>
                                ))
                            ) : patients.length > 0 ? (
                                patients.map(patient => (
                                    <TableRow key={patient.patientID} hover sx={{ '&:hover': { backgroundColor: theme.palette.action.hover }, '&:last-child td': { borderBottom: 0 } }}>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <TagIconLucide size={16} color={theme.palette.action.active} style={{ marginRight: 8 }} />
                                                <Typography variant="body2" fontWeight={500}>{patient.patientNo}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: theme.palette.secondary.main }}>{patient.candName?.charAt(0)}</Avatar>
                                                <div>
                                                    <Typography fontWeight={500}>{patient.candName}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{patient.email || 'No email'}</Typography>
                                                </div>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <PhoneIconLucide size={16} color={theme.palette.action.active} style={{ marginRight: 8 }} />
                                                {patient.curMobileNo || '-'}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'} size="small" icon={<CalendarTodayIcon fontSize="small" />} />
                                        </TableCell>
                                        <TableCell><Box display="flex" alignItems="center">{patient.bloodGroup || '-'}</Box></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ py: 4 }}>
                                        <Box textAlign="center" sx={{ maxWidth: 400, mx: 'auto', color: 'text.secondary' }}>
                                            <img src="/empty-state.svg" alt="No patients found illustration" style={{ height: 120, marginBottom: theme.spacing(2) }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                                            <InfoOutlinedIcon sx={{ fontSize: 60, mb: 1, color: theme.palette.grey[400] }} />
                                            <Typography variant="h6" gutterBottom>No Patients Found</Typography>
                                            <Typography variant="body2">Try adjusting your filters or check back later.</Typography>
                                            <Button variant="outlined" sx={{ mt: 2 }} onClick={onClose}>Close</Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Showing {patients.length} of {patients.length} results</Typography>
                    {/* Optionally, add pagination here if modal content can be paged */}
                </Box>
            </DialogContent>
        </Dialog>
    );
});
StatusModalComponent.displayName = 'StatusModalComponent';

export default function Reception() {
    const theme = useTheme();
    const { defaultValuestime } = useMemo(() => getISTDate(), []);
    const todayDate = useMemo(() => defaultValuestime.slice(0, 10), [defaultValuestime]);

    const [selectedModal, setSelectedModal] = useState<StatusModalType | null>(null);
    const [modalPatients, setModalPatients] = useState<PatientData[]>([]);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [isCheckinSubmitting, setIsCheckinSubmitting] = useState(false);

    const [caseTypeOptions, setCaseTypeOptions] = useState<SelectOption[]>([]);
    const [specializationOptions, setSpecializationOptions] = useState<SelectOption[]>([]);
    const [doctorOptions, setDoctorOptions] = useState<SelectOption[]>([{ label: "All", value: "all" }]);
    const [patientList, setPatientList] = useState<PatientData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingStatus, setIsFetchingStatus] = useState(false);
    const [selectedVisitType, setSelectedVisitType] = useState('newVisit');
    const [openFilter, setOpenFilter] = useState(false);
    const [statusCounts, setStatusCounts] = useState({
        registration: { count: 0, typeId: 1 },
        new: { count: 0, typeId: 3 },
        revisit: { count: 0, typeId: 4 },
        checkout: { count: 0, typeId: 2 }, // Note: typeId was 2, card was 3. Assuming typeId is correct for API.
    });
    const [investigationOptions, setInvestigationOptions] = useState<SelectOption[]>([]);
    const [consultantOptions, setConsultantOptions] = useState<SelectOption[]>([]);
    const [checkinModalOpen, setCheckinModalOpen] = useState(false);

    const initialCheckinFormData = useMemo<CheckinModalData>(() => ({
        admissionDate: todayDate,
        sectionID: 0, consultantDocID: 0, proDiagnosis: '', patientFileNo: '',
        deductablePercentage: '100', referToDocID: '0', invParameterID: 0,
        allergy: '', warnings: '', addiction: '', socialHistory: '', familyHistory: '',
        personalHistory: '', pastMedicalHistory: '', obstetrics: '',
        dischargeDate: todayDate, patientID: '', patientCaseID: '-1', userID: -1, formID: -1,
        type: 1, serviceID: -1, isNextVisit: false, patientFoundID: 1,
        preEmpTypeID: '1', admTypeID: 1, caseType: 1
    }), [todayDate]);

    const [checkinFormData, setCheckinFormData] = useState<CheckinModalData>(initialCheckinFormData);

    const handleCheckinFormDataChange = useCallback((field: keyof CheckinModalData, value: any) => {
        setCheckinFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const closeCheckinModal = useCallback(() => {
        setCheckinModalOpen(false);
        // Optionally reset form or keep data based on UX preference
        // setCheckinFormData(initialCheckinFormData); 
    }, []);


    const fetchConsultants = useCallback(async (sectionId: number) => {
        if (!sectionId || sectionId === 0) { // Don't fetch for "All" or invalid ID
            setConsultantOptions([]);
            return;
        }
        try {
            const response = await api.get(`/Login/GetUserList?CommonID=${sectionId}&Type=3`);
            const consultants = response.data.data.map((user: any) => ({ label: user.userName, value: user.userID }));
            setConsultantOptions(consultants);
        } catch (error) {
            console.error('Error fetching consultants:', error);
            setConsultantOptions([]);
        }
    }, []);

    const handleCheckinSubmit = useCallback(async () => {
        setIsCheckinSubmitting(true);
        try {
            const payload = {
                ...checkinFormData,
                consultantDocID: checkinFormData.consultantDocID.toString(),
                referToDocID: checkinFormData.consultantDocID.toString(), // Assuming referTo is same as consultant
                // Ensure all numeric fields that API expects as numbers are converted if needed
                // e.g., sectionID: Number(checkinFormData.sectionID) || 0,
                userID: -1, // Default as per original
                formID: -1, // Default as per original
                serviceID: -1, // Default as per original
                isNextVisit: false, // Default as per original
                patientFoundID: 1, // Default as per original
                lstType_ro: [], // Default as per original
                admTypeID: 1, // Default as per original
                caseType: 1 // Default as per original
            };
            await api.post('/AddUpdatePatientCase', payload);
            closeCheckinModal();
            // Consider success notification and refreshing main patient list if relevant
        } catch (error) {
            console.error('Check-in failed:', error);
            // Consider error notification
        } finally {
            setIsCheckinSubmitting(false);
        }
    }, [checkinFormData, closeCheckinModal]);


    const handleCheckin = useCallback(async (patient: PatientData) => {
        try {
            const params = {
                patientCaseID: "-1", patientCaseNo: "", patientID: patient.patientID.toString(),
                patientNo: "", patientUIDNo: "", caseTypeID: -1, sectionID: -1,
                consultantDocID: -1, patientFileNo: "", patientName: "", patientMobile: "",
                patientPhone: "", fromDate: new Date().toISOString().slice(0, 10), toDate: new Date().toISOString().slice(0, 10), // Use YYYY-MM-DD
                userID: -1, formID: -1, type: 6, preEmpTypeID: "1"
            };
            const response = await api.post('/GetPatientSearchOPIP', params);
            const patientDetailsFromResult = response.data.result?.[0] || {}; // Get first patient from result
            const compRebate = response.data.result2?.[0]?.compRebatePercentage ?? 100;

            const newSectionID = patientDetailsFromResult?.lastSectionID || 0;

            setCheckinFormData(prev => ({
                ...initialCheckinFormData, // Reset to initial state first
                admissionDate: todayDate,
                dischargeDate: todayDate,
                deductablePercentage: String(compRebate),
                patientFileNo: patient.patientNo, // From clicked patient
                patientID: patient.patientID.toString(), // From clicked patient
                sectionID: newSectionID,
                // Potentially pre-fill other fields from patientDetailsFromResult if available and relevant
                // proDiagnosis: patientDetailsFromResult?.lastDiagnosis || '',
            }));

            if (newSectionID) {
                fetchConsultants(newSectionID); // Fetch consultants for the pre-filled section
            } else {
                setConsultantOptions([]); // Clear consultants if no section
            }
            setCheckinModalOpen(true);
        } catch (error) {
            console.error('Error preparing for check-in:', error);
        }
    }, [todayDate, fetchConsultants, initialCheckinFormData]);


    const fetchPatientsForModal = useCallback(async (type: StatusModalType) => { // Renamed to avoid confusion
        setIsModalLoading(true);
        try {
            const typeId = statusCounts[type].typeId;
            const collectData = {
                type: typeId, fromToDate: [todayDate, todayDate], patientCaseNo: "",
                patientNo: "", patientName: "", patientUIDNo: "", caseTypeID: -1,
                sectionID: -1, consultantDocID: -1, patientFileNo: "", patientMobile: "",
                patientPhone: "", fromDate: todayDate, toDate: todayDate, patientID: -1,
                userID: -1, patientCaseID: "-1", formID: -1,
            };
            const res = await api.post(`GetPatientSearchOPIP`, collectData);
            setModalPatients(res?.data?.result || []);
        } catch (error) {
            console.error(`Error fetching ${type} patients:`, error);
            setModalPatients([]);
        } finally {
            setIsModalLoading(false);
        }
    }, [statusCounts, todayDate]);

    const handleStatusCardClick = useCallback((type: StatusModalType) => {
        setSelectedModal(type);
        fetchPatientsForModal(type);
    }, [fetchPatientsForModal]);


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const formik = useFormik({
        initialValues: {
            fromDate: todayDate, toDate: todayDate, caseNo: "", peteintNo: "", name: "",
            UId: "", fileNO: "", mobNo: "", phnNo: "", CaseTypeId: 0,
            specilizationID: 0, doctorID: "all", type: 1,
        },
        onSubmit: async (values) => {
            // searchPatients will be called by formik's handleSubmit
            // This function is primarily for the formik config
            await searchMainPatientList(values); // Renamed for clarity
        },
    });

    const handleVisitTypeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = (event.target as HTMLInputElement).value;
        setSelectedVisitType(value);
        if (value === "followUpVisit") formik.setFieldValue('type', 2);
        else if (value === "visitStatusUpdate") formik.setFieldValue('type', 3);
        else formik.setFieldValue('type', 1);
    }, [formik.setFieldValue]); // formik.setFieldValue is stable

    const handleToggleFilter = useCallback(() => setOpenFilter(prev => !prev), []);

    const getStatus = useCallback(async () => {
        setIsFetchingStatus(true);
        try {
            const collectData = { curDate: defaultValuestime, cntTypeID: -1, userID: -1, formID: -1, type: 1 };
            const res = await api.post(`GetPatientDailyCount`, collectData);
            const data = res?.data?.result[0] || {};
            setStatusCounts(prev => ({
                ...prev,
                registration: { ...prev.registration, count: data?.patReg || 0 },
                new: { ...prev.new, count: data?.patNewCase || 0 },
                revisit: { ...prev.revisit, count: data?.patRevisit || 0 },
                checkout: { ...prev.checkout, count: data?.patCheckOut || 0 },
            }));
        } catch (error) { console.error("Error fetching status counts:", error); }
        finally { setIsFetchingStatus(false); }
    }, [defaultValuestime]);

    const getSection = useCallback(async () => {
        try {
            const res = await api.post(`MasterForm/GetSection`, { sectionID: -1, userID: -1, formID: -1, type: 1 });
            const arr = (res?.data?.result || []).map((item: any) => ({ label: item.sectionName, value: item.sectionID }));
            setSpecializationOptions([{ label: "All", value: 0 }, ...arr]);
        } catch (error) { console.error("Error fetching sections:", error); }
    }, []);

    const getInvestigation = useCallback(async () => {
        try {
            const res = await api.post(`MasterForm/GetInvestigationParameter`, { "invParameterID": -1, "invGroupID": -1, "isActive": -1, "type": 2 });
            const arr = (res?.data?.result || []).map((item: any) => ({ label: item.invName, value: item.invParameterID }));
            setInvestigationOptions([{ label: "All", value: 0 }, ...arr]);
        } catch (error) { console.error("Error fetching investigations:", error); }
    }, []);

    const getCaseType = useCallback(async () => {
        try {
            const res = await api.post(`MasterForm/vPreEmpType`);
            const arr = (res?.data?.result || []).map((item: any) => ({ label: item.preEmpTypeName, value: item.preEmpTypeID }));
            setCaseTypeOptions([{ label: "All", value: 0 }, ...arr]);
        } catch (error) { console.error("Error fetching case types:", error); }
    }, []);

    useEffect(() => {
        getStatus();
        getSection();
        getCaseType();
        getInvestigation();
    }, [getStatus, getSection, getCaseType, getInvestigation]);

    const searchMainPatientList = useCallback(async (formValues: typeof formik.initialValues, resetPg = true) => {
        setIsLoading(true);
        if (resetPg) setPage(0);
        try {
            const collectData = {
                fromToDate: [formValues.fromDate, formValues.toDate],
                patientCaseNo: formValues.caseNo || "", patientNo: formValues.peteintNo || "",
                patientName: formValues.name || "", patientUIDNo: formValues.UId || "",
                caseTypeID: Number(formValues.CaseTypeId) || -1, // Ensure number
                sectionID: Number(formValues.specilizationID) || -1, // Ensure number
                consultantDocID: formValues.doctorID === "all" ? -1 : Number(formValues.doctorID),
                patientFileNo: formValues.fileNO || "", patientMobile: formValues.mobNo || "",
                patientPhone: formValues.phnNo || "", fromDate: formValues.fromDate || "",
                toDate: formValues.toDate || "", patientID: -1, userID: -1,
                patientCaseID: "-1", formID: -1, type: formValues.type,
            };
            const res = await api.post(`GetPatientSearchOPIP`, collectData);
            setPatientList(res?.data?.result || []);
        } catch (error) {
            console.error("Error searching patients:", error);
            setPatientList([]);
        } finally { setIsLoading(false); }
    }, [/* setIsLoading, setPage, setPatientList are stable */]);


    const handleClearFilters = useCallback(() => {
        formik.resetForm({
            values: { // Reset to specific initial values if needed
                fromDate: todayDate, toDate: todayDate, caseNo: "", peteintNo: "", name: "",
                UId: "", fileNO: "", mobNo: "", phnNo: "", CaseTypeId: 0,
                specilizationID: 0, doctorID: "all", type: 1,
            }
        });
        setPatientList([]);
        setPage(0);
        setSelectedVisitType('newVisit'); // Reset radio group
    }, [formik.resetForm, todayDate]);

    const handleChangePage = useCallback((_event: unknown, newPage: number) => setPage(newPage), []);
    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const displayedPatients = useMemo(() => patientList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [patientList, page, rowsPerPage]);
    const emptyRows = useMemo(() => page > 0 ? Math.max(0, (1 + page) * rowsPerPage - patientList.length) : 0, [page, rowsPerPage, patientList.length]);

    const statusCardsData = useMemo(() => [
        { type: 'registration' as StatusModalType, label: "Registration", value: statusCounts.registration.count, IconComponent: PersonAddAltIcon, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { type: 'new' as StatusModalType, label: "New Visit", value: statusCounts.new.count, IconComponent: FiberNewIcon, gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' },
        { type: 'revisit' as StatusModalType, label: "Revisit", value: statusCounts.revisit.count, IconComponent: RepeatIcon, gradient: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)' },
        { type: 'checkout' as StatusModalType, label: "Checkout", value: statusCounts.checkout.count, IconComponent: CheckCircleOutlineIcon, gradient: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)' }
    ], [statusCounts]);


    return (
        <Box sx={{ width: "100%", mt: 2 }}>
            <StatusModalComponent
                open={selectedModal !== null}
                onClose={() => setSelectedModal(null)}
                modalType={selectedModal}
                patients={modalPatients}
                isLoading={isModalLoading}
            />
            <CheckinModalComponent
                open={checkinModalOpen}
                onClose={closeCheckinModal}
                formData={checkinFormData}
                onFormDataChange={handleCheckinFormDataChange}
                specializationOptions={specializationOptions}
                consultantOptions={consultantOptions}
                investigationOptions={investigationOptions}
                fetchConsultants={fetchConsultants}
                onSubmit={handleCheckinSubmit}
                isSubmitting={isCheckinSubmitting}
            />

            <Paper elevation={3} sx={{ width: "100%", overflow: "hidden", p: { xs: 1.5, md: 3 } }}>
                <Grid container spacing={3} sx={{ mb: 4, px: { xs: 1, md: 2 } }}>
                    {statusCardsData.map((status) => {
                        // const IconComponent = status.iconName; // Corrected this line
                        return (
                            <Grid item xs={12} sm={6} md={3} key={status.type}
                                onClick={() => handleStatusCardClick(status.type)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Card
                                    elevation={4}
                                    sx={{
                                        p: 1.5, position: 'relative', overflow: 'visible',
                                        background: status.gradient, color: 'white',
                                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: theme.shadows[8],
                                            '& .hover-arrow': { opacity: 1, right: -12 }
                                        },
                                        '&::before': {
                                            content: '""', position: 'absolute', top: -16, right: -16,
                                            width: 48, height: 48, background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '50%', backdropFilter: 'blur(3px)'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ p: 1.5, background: 'rgba(255,255,255,0.2)', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }}>
                                            <status.IconComponent sx={{ fontSize: 28, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }} />
                                        </Box>
                                        <Box className="hover-arrow" sx={{ position: 'absolute', right: 0, opacity: 0, transition: 'all 0.3s ease', color: 'white' }}>
                                            <ArrowForwardIosIcon fontSize="small" />
                                        </Box>
                                    </Box>
                                    <Box sx={{ mt: 2, minHeight: '4.5rem' /* Maintain consistent height */ }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, letterSpacing: '0.5px', opacity: 0.9, mb: 0.5 }}>{status.label}</Typography>
                                        {isFetchingStatus ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '3rem' }}>
                                                <CircularProgress size={28} thickness={4} sx={{ color: 'rgba(255,255,255,0.8)' }} />
                                                <Typography variant="body2" sx={{ opacity: 0.8 }}>Loading...</Typography>
                                            </Box>
                                        ) : (
                                            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.2, textShadow: '0 1px 3px rgba(0,0,0,0.15)', height: '3rem' }}>
                                                {status.value}
                                                <Typography component="span" variant="body2" sx={{ ml: 1, opacity: 0.8, verticalAlign: 'middle' }}>Patients</Typography>
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box sx={{ position: 'absolute', bottom: -16, right: 16, width: 32, height: 32, background: 'rgba(255,255,255,0.15)', borderRadius: '8px', transform: 'rotate(45deg)' }} />
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                <Box sx={{ mb: 2 }}>
                    <Button
                        onClick={handleToggleFilter} variant="contained" color="secondary" fullWidth
                        sx={{ justifyContent: 'space-between', py: 1, px: 2, textTransform: 'none', fontSize: '1rem', backgroundColor: theme.palette.mode === 'dark' ? 'grey.700' : 'grey.200', color: theme.palette.text.primary, '&:hover': { backgroundColor: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.300', } }}
                        startIcon={<FilterListIcon />} endIcon={openFilter ? <ExpandLess /> : <ExpandMore />}
                    >
                        Search Filters
                    </Button>
                </Box>

                <Collapse in={openFilter} >
                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 2.5, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: theme.shape.borderRadius, bgcolor: 'background.paper' }}>
                        <Grid container spacing={2.5} alignItems="center">
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
                            {[
                                { label: "From Date", name: "fromDate", type: "date" }, { label: "To Date", name: "toDate", type: "date" },
                                { label: "Patient Case No", name: "caseNo" }, { label: "Patient No", name: "peteintNo" },
                                { label: "Patient Name", name: "name" }, { label: "Patient UID No", name: "UId" },
                                { label: "Patient File No", name: "fileNO" }, { label: "Mobile No", name: "mobNo" },
                                { label: "Phone No", name: "phnNo" },
                            ].map(field => (
                                <Grid item xs={12} sm={6} md={3} key={field.name}>
                                    <TextField
                                        fullWidth label={field.label} name={field.name} type={field.type || "text"}
                                        InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                                        size="small" variant="outlined"
                                        value={(formik.values as any)[field.name]}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={(formik.touched as any)[field.name] && Boolean((formik.errors as any)[field.name])}
                                        helperText={(formik.touched as any)[field.name] && (formik.errors as any)[field.name]}
                                    />
                                </Grid>
                            ))}
                            <Grid item xs={12} sm={6} md={3} /> {/* Spacer for alignment with 3-column layout */}

                            <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Autocomplete
                                    disablePortal id="case-type-autocomplete" options={caseTypeOptions}
                                    value={caseTypeOptions.find(opt => opt.value === formik.values.CaseTypeId) || null}
                                    onChange={(_event, newValue) => formik.setFieldValue("CaseTypeId", newValue?.value ?? 0)}
                                    fullWidth size="small" renderInput={(params) => <TextField {...params} label="Case Type" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Autocomplete
                                    disablePortal id="specialization-autocomplete" options={specializationOptions}
                                    value={specializationOptions.find(opt => opt.value === formik.values.specilizationID) || null}
                                    onChange={(_event, newValue) => {
                                        formik.setFieldValue("specilizationID", newValue?.value ?? 0);
                                        //  fetchConsultants(newValue?.value as number ?? 0); // Optionally fetch doctors on specialization change
                                    }}
                                    fullWidth size="small" renderInput={(params) => <TextField {...params} label="Specialization" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="doctor-label">Doctor</InputLabel>
                                    <Select
                                        labelId="doctor-label" label="Doctor" name="doctorID"
                                        value={formik.values.doctorID}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        {doctorOptions.map((option) => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                                <Button variant="outlined" color="secondary" onClick={handleClearFilters} startIcon={<ClearAllIcon />}>Clear</Button>
                                <Button type="submit" variant="contained" color="primary" disabled={isLoading || formik.isSubmitting} startIcon={(isLoading || formik.isSubmitting) ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}>Apply Filters</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Collapse>

                <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: openFilter ? 0 : 2 }}>Patient List ({patientList.length} found)</Typography>
                <TableContainer component={Paper} elevation={2} sx={{ maxHeight: 600 }}>
                    <Table stickyHeader sx={{ minWidth: 650 }} aria-label="patient list table" size="small">
                        <TableHead>
                            <TableRow sx={{ '& th': { backgroundColor: theme.palette.primary.light, color: theme.palette.primary.contrastText, fontWeight: 'bold' } }}>
                                <TableCell>Patient No</TableCell><TableCell>Name</TableCell>
                                <TableCell>Case No</TableCell><TableCell align="center">VIP</TableCell>
                                <TableCell>D.O.B</TableCell><TableCell>Age</TableCell>
                                <TableCell align="center">Gender</TableCell><TableCell>Blood Group</TableCell>
                                <TableCell>Mobile Number</TableCell><TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={10} align="center" sx={{ py: 4 }}><CircularProgress /><Typography>Loading Patients...</Typography></TableCell></TableRow>
                            ) : displayedPatients.length > 0 ? (
                                displayedPatients.map((patient) => (
                                    <TableRow key={patient.patientID} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: theme.palette.action.hover } }}>
                                        <TableCell>{patient.patientNo}</TableCell>
                                        <TableCell>{patient.candName}</TableCell>
                                        <TableCell>{patient.patientCaseNo || '-'}</TableCell>
                                        <TableCell align="center">{patient.isVIP ? <Tooltip title="VIP Patient"><StarIcon color="warning" fontSize="small" /></Tooltip> : '-'}</TableCell>
                                        <TableCell>{patient.dob ? new Date(patient.dob).toLocaleDateString() : '-'}</TableCell>
                                        <TableCell>{patient.age || '-'}</TableCell>
                                        <TableCell align="center">{patient.genderName || '-'}</TableCell>
                                        <TableCell>{patient.bloodGroup || '-'}</TableCell>
                                        <TableCell>{patient.curMobileNo || '-'}</TableCell>
                                        <TableCell><Button variant="contained" size="small" onClick={() => handleCheckin(patient)} disabled={isCheckinSubmitting}>Check-in</Button></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                                        <Box sx={{ display: "flex", flexDirection: 'column', alignItems: "center", color: "text.secondary" }}>
                                            <InfoOutlinedIcon sx={{ fontSize: 40, mb: 1 }} />
                                            <Typography variant="subtitle1">No Patient Data Found</Typography>
                                            <Typography variant="body2">Try adjusting your filters or check if patients match the criteria.</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                            {emptyRows > 0 && !isLoading && displayedPatients.length > 0 && (
                                <TableRow style={{ height: (41 * emptyRows) /* Adjust based on actual small row height */ }}><TableCell colSpan={10} /></TableRow>
                            )}
                        </TableBody>
                        {patientList.length > 0 && !isLoading && (
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 50, { label: 'All', value: -1 }]}
                                        colSpan={10} count={patientList.length} rowsPerPage={rowsPerPage} page={page}
                                        SelectProps={{ inputProps: { 'aria-label': 'rows per page' }, native: true }}
                                        onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}
                                        sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
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