import * as React from "react";
import { useEffect, useState, useRef } from "react";
import {
    Box, Grid, IconButton, SwipeableDrawer, Typography, CircularProgress,
    Avatar, Divider, Chip, List, ListItem, ListItemIcon, ListItemText,
    Skeleton, Autocomplete, TextField, Stack, Button, ListItemSecondaryAction,
    Tooltip, useTheme, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, Paper, Alert, AlertTitle
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { toast } from "react-toastify";

// Utils & Shared Components
import api from "../../utils/Url";
import { getISTDate } from "../../utils/Constant";
import DataGrids from "../../utils/Datagrids";
import ToastApp from "../../ToastApp";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import CakeIcon from '@mui/icons-material/Cake';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import WcIcon from '@mui/icons-material/Wc';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import FlagIcon from '@mui/icons-material/Flag';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import AttachmentIcon from '@mui/icons-material/Attachment';
import FindInPageIcon from '@mui/icons-material/FindInPage';

// --- Interfaces ---
interface PatientDetails {
    patientID: string; patientNo: string; patientUIDNo: string; nationality: string;
    candName: string; dob: string; age: string; curAddress: string; curMobileNo: string;
    civilStatusName: string; bloodGroup: string; email: string; emerGencyName: string;
    emerGencyContact: string; genderName: string; insuranceComp: string | null;
}

interface Props {
    open: boolean;
    onClose: () => void;
    PateintNo: string | number;
}

// --- Helper Components ---
const InfoItem: React.FC<{ label: string; value: string | null | undefined; icon?: React.ReactNode; isId?: boolean }> = ({ label, value, icon, isId = false }) => (
    <Grid item xs={12} sm={6} md={isId ? 12 : 4}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            {icon && <Box sx={{ color: 'primary.main', display: 'flex', fontSize: '1.1rem' }}>{icon}</Box>}
            <Typography variant="body2" fontWeight="medium" color="text.secondary">{label}:</Typography>
        </Stack>
        <Typography variant="body1" sx={{ pl: icon ? 3.5 : 0, wordBreak: 'break-word' }}>
            {value || <Typography component="span" variant="body2" color="text.disabled">N/A</Typography>}
        </Typography>
    </Grid>
);

const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
};

export default function UnifiedPatientDrawer({ open, onClose, PateintNo }: Props) {
    const theme = useTheme();
    const { t } = useTranslation();
    const { defaultValuestime } = getISTDate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- SHARED GLOBAL STATE ---
    const [tabValue, setTabValue] = useState(0);
    const [patientData, setPatientData] = useState<PatientDetails | null>(null);
    const [patientPhoto, setPatientPhoto] = useState<string | null>(null);
    const [isLoadingHeader, setIsLoadingHeader] = useState(false);
    const [caseOptions, setCaseOptions] = useState<any[]>([]);
    const [selectedCase, setSelectedCase] = useState<any>(null);

    // --- TAB 0 (FILE & DOCS) STATE ---
    const [patientDoc, setPatientDoc] = useState<any[]>([]);
    const [isLoadingDocs, setIsLoadingDocs] = useState(false);
    const [reportTypeOptions, setReportTypeOptions] = useState<any[]>([]);
    const [selectedReportType, setSelectedReportType] = useState<any>(null);
    const [docTypeOptions, setDocTypeOptions] = useState<any[]>([]);
    const [selectedDocType, setSelectedDocType] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmittingReport, setIsSubmittingReport] = useState(false);
    const [pateintDocId, setPateintDocId] = useState<string>("");

    // --- TAB 1 (CHECK-IN/OUT) STATE ---
    const [checkInOutRows, setCheckInOutRows] = useState<any[]>([]);
    const [isLoadingGrid, setIsLoadingGrid] = useState(false);
    const [filterStatus, setFilterStatus] = useState<number | null>(2);
    const [fromDate, setFromDate] = useState<string>("1900-01-01");
    const [toDate, setToDate] = useState<string>(defaultValuestime || new Date().toISOString().split('T')[0]);
    const [isReadinessModalOpen, setIsReadinessModalOpen] = useState(false);
    const [readinessData, setReadinessData] = useState<any[]>([]);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // --- API CALLS: CORE DATA ---
    const fetchHeaderData = async () => {
        if (!PateintNo) return;
        setIsLoadingHeader(true);
        try {
            const response = await api.post(`GetPatientHeader`, {
                patientNo: PateintNo.toString(), patientID: "-1", userID: -2, formID: 1, type: 1,
            });
            if (response.data?.isSuccess) {
                setPatientData(response.data.result1?.[0]);
                setPatientPhoto(response.data.result2?.[0]?.photo);
                setCaseOptions(response.data.result3?.map((c: any) => ({ label: c.patientCaseNo, value: String(c.patientCaseID) })));
                fetchMasterData();
                fetchUniqueId();
            }
        } finally { setIsLoadingHeader(false); }
    };

    const fetchUniqueId = async () => {
        const res = await api.post(`DefaultForm/api/GetUniqueID`);
        if (res.data?.isSuccess) setPateintDocId(String(res.data.result));
    };

    const fetchMasterData = async () => {
        const res = await api.post(`MasterForm/api/GetInvGroup`, { invGroupID: -1, isActive: -1, type: 1 });
        if (res.data?.isSuccess) setReportTypeOptions(res.data.result.map((i: any) => ({ label: i.invGroupName, value: i.invGroupID })));
    };

    const fetchDocTypes = async (groupId: any) => {
        const res = await api.post(`MasterForm/api/GetInvParameterMasterList`, { invGroupID: groupId, isActive: -1, type: 1 });
        if (res.data?.isSuccess) setDocTypeOptions(res.data.result.map((i: any) => ({ label: i.invName, value: String(i.invParameterID) })));
    };

    const fetchPatientDocs = async (caseId: string) => {
        setIsLoadingDocs(true);
        try {
            const res = await api.post(`GetPatientDoc`, { patientID: patientData?.patientID, patientCaseID: caseId, type: 1 });
            setPatientDoc(res.data?.result || []);
        } finally { setIsLoadingDocs(false); }
    };

    // --- API CALLS: CHECK-IN/OUT ---
    const fetchCheckInOutList = async () => {
        setIsLoadingGrid(true);
        try {
            const res = await api.post(`GetCheckOutPatient`, {
                searchBy: "-1", fromDate, toDate, type: 2, mainType: filterStatus ?? -1, userID: -1, formID: -1
            });
            if (res.data?.isSuccess) {
                const filtered = res.data.result.filter((item: any) => 
                    item.patientNo?.toString().trim() === PateintNo.toString().trim()
                );
                setCheckInOutRows(filtered.map((item: any, i: number) => ({ ...item, id: item.patientCaseID || i })));
            }
        } finally { setIsLoadingGrid(false); }
    };

    // --- HANDLERS ---
    const handleReportSubmit = async () => {
        if (!selectedCase || !selectedDocType) {
            toast.warn("Please select Case and Document Type");
            return;
        }
        setIsSubmittingReport(true);
        try {
            let docName = selectedFile ? selectedFile.name.split('.').slice(0, -1).join('.') : selectedDocType.label;
            let docExt = selectedFile ? selectedFile.name.split('.').pop() : "";

            const payload = {
                patientID: patientData?.patientID,
                patientCaseID: selectedCase.value,
                docTypeID: selectedDocType.value,
                lstType_PatientDoc: [{ patientDocID: pateintDocId, docName, docExt, docPath: "" }],
                docDateTime: new Date().toISOString(),
                type: 1
            };

            const metaRes = await api.post(`AddUpdatePatientDoc`, payload);
            if (metaRes.data?.isSuccess) {
                if (selectedFile) {
                    const base64 = await readFileAsDataURL(selectedFile);
                    await api.post(`MasterForm/UploadFileAsync`, { data: base64, fileName: `${pateintDocId}.${docExt}` });
                }
                toast.success("Document Saved Successfully!");
                fetchPatientDocs(selectedCase.value);
                setSelectedFile(null);
                fetchUniqueId();
            }
        } finally { setIsSubmittingReport(false); }
    };

 const handleStatusChange = async (rowData: any) => {
    if (rowData.statusName === "CHECK-IN") {
        // यह Check-Out की प्रक्रिया है (Readiness Modal दिखाएगा)
        setIsActionLoading(true);
        try {
            const res = await api.post("GetPatientCheckOutInfo", { patientCaseID: rowData.patientCaseID, type: 1 });
            if (res.data?.isSuccess) {
                setReadinessData(res.data.result);
                setSelectedCase({ value: rowData.patientCaseID, label: rowData.patientCaseNo });
                setIsReadinessModalOpen(true);
            }
        } finally { setIsActionLoading(false); }
    } else {
        // Check-In की प्रक्रिया: यहाँ से ConfirmDialog हटा दिया गया है
        try {
            const res = await api.post(`UpdatePatientStatus`, { patientCaseID: rowData.patientCaseID, type: 1 });
            if (res.data?.isSuccess) { 
                toast.success("Checked In!"); 
                fetchCheckInOutList(); 
            }
        } catch (error) {
            toast.error("Check-In failed");
        }
    }
};

    const proceedCheckOut = async () => {
        const res = await api.post(`UpdateCaseCheckOut`, { patientCaseID: selectedCase.value, type: 1 });
        if (res.data?.isSuccess) {
            toast.success("Checked Out Successfully!");
            setIsReadinessModalOpen(false);
            fetchCheckInOutList();
        }
    };

    // --- EFFECTS ---
    useEffect(() => { if (open) fetchHeaderData(); }, [open, PateintNo]);
    useEffect(() => { if (open && tabValue === 1) fetchCheckInOutList(); }, [tabValue, open, filterStatus, fromDate, toDate]);
    useEffect(() => { if (selectedCase?.value && tabValue === 0) fetchPatientDocs(selectedCase.value); }, [selectedCase, tabValue]);
    useEffect(() => { if (selectedReportType) fetchDocTypes(selectedReportType.value); }, [selectedReportType]);

    const formatDate = (date: string) => date ? new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A";

    return (
        <SwipeableDrawer
            anchor="right" open={open} onClose={onClose} onOpen={() => {}}
            // Z-INDEX FIX: Drawer ko normal level par rakha taaki dropdown upar dikhe
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 50 }}
            PaperProps={{ sx: { width: { xs: '100%', md: '80%' }, height: '100vh', display: 'flex', flexDirection: 'column' } }}
        >
            {/* STICKY HEADER */}
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ width: 50, height: 50, border: '2px solid white' }} src={patientPhoto ? `data:image/jpeg;base64,${patientPhoto}` : ""} />
                    <Box>
                        <Typography variant="h6" sx={{ lineHeight: 1.2 }}>{patientData?.candName || t("Loading...")}</Typography>
                        <Typography variant="caption">Patient No: {PateintNo}</Typography>
                    </Box>
                </Stack>
                <IconButton onClick={onClose} sx={{ color: 'white' }}><CloseIcon /></IconButton>
            </Box>

            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tab label={t("Patient Profile & Documents")} />
                <Tab label={t("Check-In / Out Status")} />
            </Tabs>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {isLoadingHeader ? <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box> : (
                    <>
                        {/* TAB 0: PROFILE UI */}
                        {tabValue === 0 && patientData && (
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <Stack spacing={2.5} alignItems="center" sx={{ position: 'sticky', top: 16 }}>
                                            <Avatar src={patientPhoto ? `data:image/jpeg;base64,${patientPhoto}` : ""} sx={{ width: 140, height: 140, border: `3px solid ${theme.palette.divider}` }} />
                                            <Typography variant="h5" fontWeight={500} textAlign="center">{patientData.candName}</Typography>
                                            <Chip icon={<BadgeIcon />} label={`Patient No: ${patientData.patientNo}`} color="primary" variant="outlined" />
                                            
                                            <Stack spacing={1.5} width="100%" sx={{ px: 2 }}>
                                                <InfoItem label="Patient ID" value={patientData.patientID} icon={<BadgeIcon fontSize="small" />} isId />
                                                <InfoItem label="UID No" value={patientData.patientUIDNo} icon={<FingerprintIcon fontSize="small" />} isId />
                                            </Stack>
                                            
                                            <Divider sx={{ width: '100%', my: 2 }} />
                                            
                                            <Box width="100%" sx={{ px: 2 }}>
                                                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <FolderZipIcon fontSize="small" /> {t("Select Case")}
                                                </Typography>
                                                <Autocomplete
                                                    options={caseOptions}
                                                    value={selectedCase}
                                                    isOptionEqualToValue={(opt, val) => opt.value === val.value}
                                                    onChange={(_, n) => setSelectedCase(n)}
                                                    renderInput={(p) => <TextField {...p} label="Case Number" size="small" />}
                                                />
                                            </Box>
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} md={8}>
                                        <Typography variant="h6" gutterBottom color="primary.dark" sx={{ borderLeft: `4px solid ${theme.palette.primary.main}`, pl: 1.5, mb: 2 }}>Personal Details</Typography>
                                        <Grid container spacing={2.5} sx={{ mb: 4 }}>
                                            <InfoItem label="DOB" value={formatDate(patientData.dob)} icon={<CakeIcon fontSize="small" />} />
                                            <InfoItem label="Age" value={patientData.age} icon={<AccessibilityNewIcon fontSize="small" />} />
                                            <InfoItem label="Gender" value={patientData.genderName} icon={<WcIcon fontSize="small" />} />
                                            <InfoItem label="Blood Grp" value={patientData.bloodGroup} icon={<BloodtypeIcon fontSize="small" />} />
                                            <InfoItem label="Nationality" value={patientData.nationality} icon={<FlagIcon fontSize="small" />} />
                                            <InfoItem label="Civil Status" value={patientData.civilStatusName} icon={<FamilyRestroomIcon fontSize="small" />} />
                                        </Grid>

                                        <Typography variant="h6" gutterBottom color="primary.dark" sx={{ borderLeft: `4px solid ${theme.palette.primary.main}`, pl: 1.5, mb: 2 }}>Contact Information</Typography>
                                        <Grid container spacing={2.5} sx={{ mb: 4 }}>
                                            <InfoItem label="Mobile" value={patientData.curMobileNo} icon={<PhoneIcon fontSize="small" />} />
                                            <InfoItem label="Email" value={patientData.email} icon={<EmailIcon fontSize="small" />} />
                                            <Grid item xs={12}>
                                                <Stack direction="row" spacing={1}>
                                                    <LocationOnIcon fontSize="small" color="primary" />
                                                    <Box><Typography variant="body2" color="text.secondary">Address:</Typography><Typography variant="body1">{patientData.curAddress}</Typography></Box>
                                                </Stack>
                                            </Grid>
                                        </Grid>

                                        <Typography variant="h6" gutterBottom color="primary.dark" sx={{ borderLeft: `4px solid ${theme.palette.primary.main}`, pl: 1.5, mb: 2 }}>Case Documents</Typography>
                                        {!selectedCase ? <Alert severity="info">{t("Select a Case Number to view documents.")}</Alert> : (
                                            <Box>
                                                {isLoadingDocs ? <Skeleton variant="rectangular" height={150} /> : (
                                                    <List sx={{ bgcolor: 'grey.50', borderRadius: 1, border: '1px solid #ddd', mb: 3 }}>
                                                        {patientDoc.map((doc, i) => (
                                                            <ListItem key={i} divider secondaryAction={
                                                                <IconButton onClick={() => window.open(doc.docPath, '_blank')}><DownloadIcon /></IconButton>
                                                            }>
                                                                <ListItemIcon><DescriptionIcon /></ListItemIcon>
                                                                <ListItemText primary={doc.docName} secondary={`${doc.docTypeName} | ${formatDate(doc.docDateTime)}`} />
                                                            </ListItem>
                                                        ))}
                                                        {patientDoc.length === 0 && <Typography sx={{ p: 2, textAlign: 'center', fontStyle: 'italic' }}>No documents found.</Typography>}
                                                    </List>
                                                )}

                                                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, bgcolor: 'grey.50' }}>
                                                    <Typography variant="subtitle1" fontWeight="500" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                        <FindInPageIcon /> Attach / Generate Report
                                                    </Typography>
                                                    <Stack spacing={2}>
                                                        <Autocomplete options={reportTypeOptions} isOptionEqualToValue={(opt, val) => opt.value === val.value} size="small" onChange={(_, n) => setSelectedReportType(n)} renderInput={(p) => <TextField {...p} label="Report Type" />} />
                                                        <Autocomplete options={docTypeOptions} isOptionEqualToValue={(opt, val) => opt.value === val.value} size="small" onChange={(_, n) => setSelectedDocType(n)} renderInput={(p) => <TextField {...p} label="Document Type" />} />
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Button variant="outlined" component="label" size="small" startIcon={<AttachmentIcon />}>
                                                                Attach File
                                                                <input type="file" hidden onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                                                            </Button>
                                                            {selectedFile && <Chip label={selectedFile.name} onDelete={() => setSelectedFile(null)} size="small" />}
                                                        </Box>
                                                        <Button variant="contained" fullWidth onClick={handleReportSubmit} disabled={isSubmittingReport}>
                                                            {isSubmittingReport ? <CircularProgress size={24} /> : t("Submit Metadata & Upload")}
                                                        </Button>
                                                    </Stack>
                                                </Box>
                                            </Box>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* TAB 1: CHECK-IN/OUT GRID */}
                        {tabValue === 1 && (
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid item xs={12} sm={4}><TextField type="date" label="From Date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></Grid>
                                    <Grid item xs={12} sm={4}><TextField type="date" label="To Date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={toDate} onChange={(e) => setToDate(e.target.value)} /></Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Autocomplete
                                            options={[{ label: "Check-Out", value: 1 }, { label: "Check-In", value: 2 }]}
                                            size="small"
                                            isOptionEqualToValue={(opt, val) => opt.value === val.value}
                                            value={filterStatus === 1 ? { label: "Check-Out", value: 1 } : { label: "Check-In", value: 2 }}
                                            onChange={(_, v) => setFilterStatus(v?.value || 2)}
                                            renderInput={(p) => <TextField {...p} label="Status" />}
                                        />
                                    </Grid>
                                </Grid>
                                <Box sx={{ height: 600 }}>
                                    <DataGrids
                                        isLoading={isLoadingGrid}
                                        rows={checkInOutRows}
                                        columns={[
                                            { field: "patientCaseNo", headerName: t("Case No"), flex: 1 },
                                            { field: "vPreEmpTypeName", headerName: t("Case Type"), flex: 1 },
                                            { field: "statusName", headerName: t("Status"), flex: 1 },
                                            {
                                                field: "Action", headerName: t("Action"), flex: 1, renderCell: (p: any) => {
                                                    const isCheckIn = p.row.statusName === "CHECK-IN";
                                                    return (
                                                        <Button
                                                            variant="contained" size="small"
                                                            sx={{ bgcolor: isCheckIn ? "error.main" : "success.main", color: 'white' }}
                                                            onClick={() => handleStatusChange(p.row)}
                                                        >
                                                            {isCheckIn ? t("Check Out") : t("Check In")}
                                                        </Button>
                                                    );
                                                }
                                            }
                                        ]}
                                    />
                                </Box>
                            </Box>
                        )}
                    </>
                )}
            </Box>

            {/* CHECKOUT READINESS MODAL */}
            <Dialog 
                open={isReadinessModalOpen} 
                onClose={() => setIsReadinessModalOpen(false)} 
                fullWidth 
                maxWidth="sm"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 200 }} // Modal Drawer ke upar rahega
            >
                <DialogTitle>{t("Checkout Readiness checklist")}</DialogTitle>
                <DialogContent dividers>
                    <List dense>
                        {readinessData.map((item, i) => (
                            <ListItem key={i}>
                                <ListItemIcon>
                                    {item.isPresent === false ? <HighlightOffIcon color="disabled" /> : 
                                     item.isOk ? <CheckCircleOutlineIcon color="success" /> : <HighlightOffIcon color="error" />}
                                </ListItemIcon>
                                <ListItemText primary={item.activityName} secondary={item.activityStatus} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsReadinessModalOpen(false)}>{t("Close")}</Button>
                    <Button variant="contained" color="success" onClick={proceedCheckOut}>{t("Proceed with Checkout")}</Button>
                </DialogActions>
            </Dialog>

           <ConfirmDialog  />
            <ToastApp />
        </SwipeableDrawer>
    );
}
