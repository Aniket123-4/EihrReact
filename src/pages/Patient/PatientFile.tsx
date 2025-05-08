import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState, useRef } from "react";
import {
    Box,
    Grid,
    IconButton,
    SwipeableDrawer,
    Typography,
    CircularProgress,
    Avatar,
    Divider,
    Chip,
    Alert,
    AlertTitle,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Skeleton,
    Autocomplete,
    TextField,
    Stack,
    Button,
    ListItemSecondaryAction,
    Tooltip,
    useTheme,
} from "@mui/material";
import api from "../../utils/Url"; // Assuming this path is correct for your project
import { toast } from "react-toastify";
import ToastApp from "../../ToastApp"; // Assuming this path is correct

// --- Icons ---
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import WcIcon from '@mui/icons-material/Wc';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import BadgeIcon from '@mui/icons-material/Badge';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import FlagIcon from '@mui/icons-material/Flag';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import DownloadIcon from '@mui/icons-material/Download';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import AttachmentIcon from '@mui/icons-material/Attachment';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// --- Interfaces ---
interface PatientDetails {
    patientID: string;
    patientNo: string;
    patientUIDNo: string;
    nationality: string;
    candName: string;
    candNameML: string;
    dob: string;
    age: string;
    curAddress: string;
    curMobileNo: string;
    curPhoneNo: string;
    civilStatusName: string;
    bloodGroup: string;
    email: string;
    isDeleted: boolean;
    emerGencyName: string;
    emerGencyContact: string;
    genderID: string;
    genderName: string;
    insuranceComp: string | null;
}

interface PatientDocument {
    patientDocID: string;
    patientCaseID: string;
    patientCaseNo: string;
    docTypeID: string;
    docSerialNo: string;
    docName: string;
    docExt: string;
    docPath: string;
    remark: string;
    docDateTime: string;
    entryDate: string;
    phyName: string;
    downloadName: string;
    docTypeName: string;
}

interface CaseInfoOption {
    label: string;
    value: string;
}

interface ReportOption {
    label: string;
    value: string | number;
}

interface DocTypeOption extends ReportOption {
    // Can include other properties from GetInvParameterMasterList if needed
    // Example: invName: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    PateintNo: any; // Ideally should be string | null
}

// --- Helper Component: InfoItem ---
const InfoItem: React.FC<{ label: string; value: string | null | undefined; icon?: React.ReactNode; isId?: boolean }> = ({ label, value, icon, isId = false }) => (
    <Grid item xs={12} sm={6} md={isId ? 12 : 4} lg={isId ? 12 : 4}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            {icon && <Box sx={{ color: 'primary.main', display: 'flex', fontSize: '1.1rem' }}>{icon}</Box>}
            <Typography variant="body2" fontWeight="medium" color="text.secondary">
                {label}:
            </Typography>
        </Stack>
        <Typography
            variant="body1"
            sx={{
                pl: icon ? 3.5 : 0,
                wordBreak: isId ? 'break-all' : 'break-word',
                overflowWrap: 'break-word',
            }}
        >
            {value || <Typography component="span" variant="body2" color="text.disabled">N/A</Typography>}
        </Typography>
    </Grid>
);

// --- Helper function to read file as Data URL ---
const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

// --- Main Component: PatientFile ---
export function PatientFile({ open, onClose, PateintNo }: Props) {
    const theme = useTheme();
    const [patientData, setPatientData] = useState<PatientDetails | null>(null);
    const [patientPhoto, setPatientPhoto] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loader for initial patient data
    const [error, setError] = useState<string | null>(null);
    const [patientDoc, setPatientDoc] = useState<PatientDocument[]>([]);
    const [isLoadingDocs, setIsLoadingDocs] = useState<boolean>(false); // Loader for case documents
    const [caseOptions, setCaseOptions] = useState<CaseInfoOption[]>([]);
    const [selectedCase, setSelectedCase] = useState<CaseInfoOption | null>(null);

    // State for the "Find Specific Reports" / Attach section
    const [reportTypeOptions, setReportTypeOptions] = useState<ReportOption[]>([]);
    const [selectedReportType, setSelectedReportType] = useState<ReportOption | null>(null);
    const [docTypeOptions, setDocTypeOptions] = useState<DocTypeOption[]>([]);
    const [selectedDocType, setSelectedDocType] = useState<DocTypeOption | null>(null);
    const [isSubmittingReport, setIsSubmittingReport] = useState<boolean>(false); // Loader for report submission
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pateintDocId, setPateintDocId] = useState<string>(""); // Stores the Unique ID for the *next* document

    // --- State Reset Function ---
    // FIX: Removed setIsLoading(false) from here to prevent immediate clearing
    const resetState = () => {
        setPatientData(null);
        setPatientPhoto(null);
        setError(null);
        // setIsLoading(false); // <--- REMOVED THIS LINE
        setPatientDoc([]);
        setIsLoadingDocs(false); // Keep this reset, it's for a different loader
        setCaseOptions([]);
        setSelectedCase(null);
        setReportTypeOptions([]);
        setSelectedReportType(null);
        setDocTypeOptions([]);
        setSelectedDocType(null);
        setIsSubmittingReport(false); // Keep this reset, for submission button state
        setSelectedFile(null);
        setPateintDocId("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // --- API Call: Fetch Unique ID ---
    const fetchUniqueId = async (): Promise<string | null> => {
        try {
            const response = await api.post(`DefaultForm/api/GetUniqueID`);
            if (response?.data?.isSuccess && response?.data?.result) {
                const newId = String(response.data.result);
                setPateintDocId(newId);
                return newId;
            } else {
                console.error("Failed to fetch Unique Patient Doc ID:", response?.data?.msg);
                toast.error("Could not generate a document ID. Submission may fail.");
                setPateintDocId("");
                return null;
            }
        } catch (err) {
            console.error("API Error fetching Unique ID:", err);
            toast.error("Error generating document ID.");
            setPateintDocId("");
            return null;
        }
    };

    // --- API Call: Fetch Patient Details ---
    const fetchPatientDetails = async (patientNo: string) => {
        // console.log("Fetching details for PateintNo:", patientNo);
        resetState(); // Reset all state first
        setIsLoading(true); // <<< FIX: Set loading TRUE *after* resetState
        setError(null); // Explicitly reset error for this fetch

        try {
            const collectData = {
                patientNo: patientNo,
                patientID: "-1",
                userID: -2,
                formID: 1,
                type: 1,
            };

            const response = await api.post(`GetPatientHeader`, collectData);
            const responseData = response?.data;
            // console.log("Patient Header API Response:", responseData);

            if (responseData?.isSuccess) {
                const details = responseData.result1?.[0] as PatientDetails | undefined;
                const photoData = responseData.result2?.[0]?.photo;
                const caseData = responseData.result3 || [];

                const caseInfoOptions: CaseInfoOption[] = caseData.map((item: any) => ({
                    label: item?.patientCaseNo || 'Unknown Case',
                    value: String(item?.patientCaseID),
                }));

                if (details) {
                    const formattedDetails = {
                        ...details,
                        patientID: String(details.patientID),
                        patientUIDNo: String(details.patientUIDNo || ''),
                    };
                    setPatientData(formattedDetails);
                    setPatientPhoto(photoData || null);
                    setCaseOptions(caseInfoOptions);
                    setError(null); // Clear error on success
                    fetchReportTypes(); // Fetch dependent data
                    await fetchUniqueId(); // Fetch initial unique ID
                } else {
                    setError(`Patient record not found for No: ${patientNo}.`);
                    toast.warn(`Patient record not found for No: ${patientNo}.`);
                }
            } else {
                const errorMsg = responseData?.msg || 'Failed to retrieve patient data.';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.msg || err.message || 'An unexpected error occurred.';
            console.error("API Fetch Error (Patient Details):", err);
            setError(`Failed to fetch patient details: ${errorMsg}`);
            toast.error(`Failed to fetch patient details: ${errorMsg}`);
        } finally {
            setIsLoading(false); // <<< FIX: Set loading FALSE when done (success or error)
        }
    };

    // --- API Call: Fetch Patient Documents for a Case ---
    const fetchPatientDoc = async (caseId: string | null | undefined) => {
        if (!caseId || !patientData?.patientID) {
            setPatientDoc([]);
            return;
        }

        setIsLoadingDocs(true); // Start document loading
        setPatientDoc([]); // Clear previous docs
        try {
            const collectData = {
                patientID: patientData.patientID,
                patientCaseID: caseId,
                userID: -1,
                formID: -1,
                type: 1,
            };

            const response = await api.post(`GetPatientDoc`, collectData);
            const responseData = response?.data;
            // console.log("Document API Response:", responseData);

            if (responseData?.isSuccess && responseData.result && Array.isArray(responseData.result)) {
                 const formattedDocs = responseData.result.map((doc: any) => ({
                     ...doc,
                     patientDocID: String(doc.patientDocID),
                     patientCaseID: String(doc.patientCaseID),
                     docTypeID: String(doc.docTypeID),
                 })) as PatientDocument[];
                setPatientDoc(formattedDocs);
            } else {
                console.warn("No documents found or API error:", responseData?.msg);
                setPatientDoc([]); // Ensure empty array if no results
            }
        } catch (docError: any) {
            const errorMsg = docError.response?.data?.msg || docError.message || 'An error occurred fetching documents';
            console.error("Error fetching patient documents:", docError);
            toast.error(`Failed to load documents: ${errorMsg}`);
            setPatientDoc([]); // Ensure empty array on error
        } finally {
            setIsLoadingDocs(false); // Stop document loading
        }
    };

    // --- API Call: Fetch Master Data for Report Types (InvGroup) ---
    const fetchReportTypes = async () => {
        setReportTypeOptions([]); // Clear previous options
        try {
            const collectData = { invGroupID: -1, discountParameterID: -1, isActive: -1, formID: -1, type: 1 };
            const response = await api.post(`MasterForm/api/GetInvGroup`, collectData);
            if (response?.data?.isSuccess && Array.isArray(response.data.result)) {
                const options: ReportOption[] = response.data.result.map((item: any) => ({
                    label: item?.invGroupName || 'Unnamed Group',
                    value: item?.invGroupID, // Keep original type if needed, or String()
                }));
                setReportTypeOptions(options);
            } else {
                console.warn("Could not fetch report types:", response?.data?.msg);
            }
        } catch (error) {
            console.error("Error fetching report types:", error);
            toast.error("Failed to load report types.");
        }
    };

    // --- API Call: Fetch Doc Types (InvParameterMasterList) based on selected Report Type ---
    const fetchDocTypes = async (invGroupId: string | number | null | undefined) => {
        setDocTypeOptions([]); // Clear previous options
        setSelectedDocType(null); // Reset selection

        if (!invGroupId) {
            return;
        }

        try {
            const collectData = { invParameterID: -1, invGroupID: invGroupId, isActive: -1, formID: -1, type: 1 };
            const response = await api.post(`MasterForm/api/GetInvParameterMasterList`, collectData);
            if (response?.data?.isSuccess && Array.isArray(response.data.result)) {
                const options: DocTypeOption[] = response.data.result.map((item: any) => ({
                    label: item?.invName || 'Unnamed Document Type',
                    value: String(item?.invParameterID), // Ensure value is string for consistency if needed
                     ...item // Include the rest of the item data if DocTypeOption needs it
                }));
                setDocTypeOptions(options);
            } else {
                console.warn("Could not fetch document types:", response?.data?.msg);
            }
        } catch (error) {
            console.error("Error fetching document types:", error);
            toast.error("Failed to load document types.");
        }
    };

    // --- File Handling ---
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleClearFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the file input visually
        }
    };

    // --- API Call: Upload File (Base64) ---
    const DocSubmit = async (fileToUpload: File, documentId: string): Promise<boolean> => {
        if (!fileToUpload || !documentId) {
            console.error("DocSubmit called without file or documentId");
            toast.error("Internal error: Missing file or ID for upload.");
            return false;
        }

        const uploadToastId = toast.info(`Uploading ${fileToUpload.name}...`, { autoClose: false });

        try {
            const base64Data = await readFileAsDataURL(fileToUpload);
            const originalFileName = fileToUpload.name;
            const lastDotIndex = originalFileName.lastIndexOf('.');
            // Handle filenames with no extension or leading dots carefully
            const fileExtension = (lastDotIndex > 0 && lastDotIndex < originalFileName.length - 1)
                ? originalFileName.substring(lastDotIndex) // Includes the dot
                : "";
            const serverFileName = `${documentId}${fileExtension}`; // e.g., "uniqueID123.pdf"

            const values = {
                data: base64Data,
                fileName: serverFileName,
            };

            const response = await api.post(`MasterForm/UploadFileAsync`, values);

            if (response?.data?.isSuccess === true) {
                toast.update(uploadToastId, { render: response.data.msg || `${fileToUpload.name} uploaded successfully!`, type: "success", autoClose: 5000 });
                return true;
            } else {
                const errorMsg = response?.data?.msg || "Failed to upload file.";
                toast.update(uploadToastId, { render: `Upload Error: ${errorMsg}`, type: "error", autoClose: 5000 });
                console.error("File upload failed:", response?.data);
                return false;
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.msg || error.message || 'An error occurred during file upload.';
            toast.update(uploadToastId, { render: `Upload Exception: ${errorMsg}`, type: "error", autoClose: 5000 });
            console.error("File Upload Exception:", error.response || error);
            return false;
        }
    };

    // --- Form Submission Logic ---
    const handleReportSubmit = async () => {
        // --- Initial Checks ---
        if (!selectedCase) {
            toast.warn("Please select a Case Number first.");
            return;
        }
        if (!selectedReportType || !selectedDocType) {
            toast.warn("Please select both a Report Type and a Document Type.");
            return;
        }

        // Fetch a new ID right before submission if the current one is empty (e.g., initial fetch failed)
        let currentSubmissionDocId = pateintDocId;
        if (!currentSubmissionDocId) {
            toast.info("Document ID missing, attempting to fetch a new one...");
            const fetchedId = await fetchUniqueId();
            if (!fetchedId) {
                toast.error("Failed to obtain a Document ID. Cannot submit. Please try again or contact support.");
                return;
            }
            currentSubmissionDocId = fetchedId;
            toast.info("New Document ID obtained, proceeding with submission.");
        }

        setIsSubmittingReport(true); // Start submission loader
        let metadataSuccess = false;
        let fileUploadAttempted = false;
        let fileUploadSuccess = false;

        try {
            // --- Step 1: Prepare and Submit Metadata (AddUpdatePatientDoc) ---
            let docName = "";
            let docExt = "";
            if (selectedFile) {
                const fileName = selectedFile.name;
                const lastDotIndex = fileName.lastIndexOf('.');
                 if (lastDotIndex > 0 && lastDotIndex < fileName.length - 1) { // Ensure dot is not first or last char
                    docName = fileName.substring(0, lastDotIndex);
                    docExt = fileName.substring(lastDotIndex + 1); // Extension without dot
                } else {
                    docName = fileName; // Filename is the name if no extension
                    docExt = "";
                }
            } else {
                // If no file, use the selected DocType label as the name
                docName = selectedDocType?.label || "Generated Report";
                docExt = ""; // No extension if no file
            }

            const metadataPayload = {
                patientID: patientData?.patientID || "0", // Ensure defaults if data is missing
                patientCaseID: selectedCase.value || "0",
                docTypeID: String(selectedDocType.value || "0"), // Ensure string

                lstType_PatientDoc: [
                    {
                        patientDocID: currentSubmissionDocId, // Use the obtained unique ID
                        docName: docName,
                        docExt: docExt,
                        docPath: "", // Backend should determine the actual path based on ID/config
                        remark: "" // Add remark if needed
                    }
                ],
                docDateTime: new Date().toISOString(), // Use ISO format for consistency
                isDelete: false,
                userID: -1, // Replace with actual logged-in user ID if available
                formID: -1, // Replace with actual form ID if needed
                type: 1 // Usually means 'Insert'
            };

            // console.log("Submitting Metadata Payload (Final):", JSON.stringify(metadataPayload, null, 2));
            const metadataResponse = await api.post(`AddUpdatePatientDoc`, metadataPayload);

            if (metadataResponse?.data?.isSuccess === true) {
                metadataSuccess = true;
                toast.success(metadataResponse.data.msg || "Document metadata saved successfully!");
                // console.log("Metadata submission successful:", metadataResponse.data);

                // --- Step 2: Upload File (DocSubmit) if metadata was successful AND a file exists ---
                if (selectedFile) {
                    fileUploadAttempted = true;
                    // console.log("Attempting file upload for DocID:", currentSubmissionDocId);
                    fileUploadSuccess = await DocSubmit(selectedFile, currentSubmissionDocId);
                } else {
                    // console.log("No file selected, skipping file upload step.");
                    fileUploadSuccess = true; // No file to upload, so "success" in this context
                }

            } else {
                // Metadata submission failed
                toast.error(metadataResponse?.data?.msg || "Failed to save document metadata.");
                console.error("Metadata submission failed:", metadataResponse?.data);
            }

        } catch (error: any) {
            const errorMsg = error.response?.data?.msg || error.message || 'An error occurred during submission.';
            toast.error(`Submission error: ${errorMsg}`);
            console.error("Submit Exception:", error.response || error);
            // Resetting loader is handled in finally
        } finally {
            // --- Post-Submission Actions ---
            // console.log("--- Submission Finish ---");
            // console.log(`Metadata Success: ${metadataSuccess}, File Upload Attempted: ${fileUploadAttempted}, File Upload Success: ${fileUploadSuccess}`);

            // Only reset form and fetch new ID/docs if the core metadata operation was successful
            // AND (either no file was attempted OR the file upload was also successful)
            if (metadataSuccess && (!fileUploadAttempted || fileUploadSuccess)) {
                handleClearFile(); // Clear selected file input
                setSelectedDocType(null); // Reset doc type selection (keep report type maybe?)
                // Optionally reset Report Type as well:
                // setSelectedReportType(null);

                // Refresh the document list for the current case
                if (selectedCase?.value) {
                    fetchPatientDoc(selectedCase.value);
                }
                // Fetch a new Unique ID for the *next* potential submission
                await fetchUniqueId();

            } else if (metadataSuccess && fileUploadAttempted && !fileUploadSuccess) {
                // Metadata saved, but file failed. Inform user, potentially allow retry?
                toast.warn("Document entry created, but the file upload failed. The entry may be incomplete.");
                // Fetch a new ID anyway, as the previous one might be associated with the failed attempt (depending on backend logic)
                 await fetchUniqueId();

            } else {
                 // Metadata submission failed, keep user selections to allow correction/retry
                 // console.log("Metadata submission failed, keeping selections.");
                 // Fetch a new ID in case the previous one became invalid or was consumed by the failed attempt
                 await fetchUniqueId();
            }

            setIsSubmittingReport(false); // Stop submission loader regardless of outcome
        }
    };

    // --- Document Download Logic ---
    const handleDownloadDocument = (doc: PatientDocument) => {
        if (!doc.docPath) {
            toast.error("Document path is missing, cannot download.");
            return;
        }
        // console.log("Attempting to download:", doc.docPath, "Suggested filename:", doc.downloadName);

        try {
            // Use the provided docPath directly as the URL
            const link = document.createElement('a');
            link.href = doc.docPath;
            // Open in new tab is generally safer for various file types
            link.target = "_blank";
            // Use downloadName if provided, otherwise construct from docName and docExt
            const filename = doc.downloadName || `${doc.docName || 'document'}${doc.docExt ? '.' + doc.docExt : ''}`;
            link.download = filename; // Suggests a filename to the browser

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Could not initiate download. Check console for details.");
        }
    };

    // --- useEffect Hooks ---
    useEffect(() => {
        if (open && PateintNo) {
            // Convert PateintNo to string explicitly if it might be a number
            fetchPatientDetails(String(PateintNo));
        } else if (!open) {
            // Reset everything when the drawer closes
            resetState();
        }
        // Ensure PateintNo is stable or handle its changes correctly
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, PateintNo]); // Re-fetch only when open status or PateintNo changes

    useEffect(() => {
        // Fetch documents when a case is selected
        if (selectedCase?.value) {
            // console.log("Selected Case Changed:", selectedCase);
            fetchPatientDoc(selectedCase.value);
            // Reset downstream selections when case changes
            setSelectedReportType(null);
            setSelectedDocType(null);
            handleClearFile();
        } else {
            // Clear documents if no case is selected
            setPatientDoc([]);
             // Also clear selections
             setSelectedReportType(null);
             setSelectedDocType(null);
             handleClearFile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCase]); // Re-run only when selectedCase changes

    useEffect(() => {
        // Fetch document types when a report type is selected
        if (selectedReportType?.value) {
             fetchDocTypes(selectedReportType.value);
        } else {
             // Clear doc types if no report type is selected
             setDocTypeOptions([]);
             setSelectedDocType(null); // Also reset doc type selection
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedReportType]); // Re-run only when selectedReportType changes


    // --- Drawer Close Handler ---
    const handleClose = () => {
        onClose(); // Call the callback passed via props
    };

    // --- Date Formatting Utility ---
    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            // Check if the date is valid after parsing
            if (isNaN(date.getTime())) {
                 // console.warn("Invalid date string encountered:", dateString);
                 return "Invalid Date";
            }
            // Use locale-sensitive date formatting
            return date.toLocaleDateString(undefined, { // Or specify a locale like 'en-GB'
                year: 'numeric', month: 'short', day: 'numeric',
            });
        } catch (e) {
            console.error("Error formatting date:", dateString, e);
            return dateString; // Return original string if formatting fails
        }
    };

    // --- Render Logic ---
    const renderContent = () => {
        // ---- Initial Loading State ----
        if (isLoading) {
            return (
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ height: 'calc(100vh - 120px)', p: 3 }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography color="text.secondary">Loading Patient Data...</Typography>
                </Box>
            );
        }

        // ---- Error State ----
        if (error) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 'calc(100vh - 120px)', p: 3 }}>
                    <Alert severity="error" sx={{ width: '100%', maxWidth: '600px' }}>
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                </Box>
            );
        }

        // ---- No Patient Data (e.g., PateintNo was null or fetch failed) ----
        if (!patientData) {
            // This case might be hit briefly between isLoading=false and patientData being set,
            // or if fetch failed without setting an error message explicitly, or if PateintNo was null.
             return (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 'calc(100vh - 120px)', p: 3 }}>
                    <Alert severity="info">
                        {PateintNo ? "Patient data could not be loaded." : "Please provide a Patient Number to view details."}
                    </Alert>
                </Box>
            );
        }

        // ---- Main Content Display (Patient Data Loaded) ----
        return (
            <Paper
                sx={{
                    m: 0, // No margin inside the scrollable area
                    p: { xs: 1.5, sm: 2, md: 3 }, // Responsive padding
                    boxSizing: 'border-box',
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : '#fff', // Adapt background
                    height: '100%', // Take full height of the container
                    overflowY: 'auto' // Allow scrolling ONLY within this paper
                }}
                elevation={0} // No shadow inside the drawer
            >
                <Grid container spacing={3}>
                    {/* === Left Column: Photo, ID, Case Selection === */}
                    <Grid item xs={12} md={4}>
                        {/* Use Stack for vertical layout and consistent spacing */}
                        <Stack spacing={2.5} alignItems="center" sx={{ position: 'sticky', top: 16 }}> {/* Sticky position */}
                            <Avatar
                                alt={patientData.candName || 'Patient Photo'}
                                src={patientPhoto ? `data:image/jpeg;base64,${patientPhoto}` : undefined}
                                sx={{ width: 140, height: 140, mb: 1, border: `3px solid ${theme.palette.divider}` }}
                            >
                                {/* Fallback Icon */}
                                {!patientPhoto && <PersonIcon sx={{ width: 80, height: 80, color: 'text.secondary' }} />}
                            </Avatar>
                            <Typography variant="h5" component="h2" fontWeight={500} textAlign="center" sx={{ wordBreak: 'break-word' }}>
                                {patientData.candName || <Typography component="span" color="text.disabled">N/A</Typography>}
                            </Typography>
                            <Chip
                                icon={<BadgeIcon />}
                                label={`Patient No: ${patientData.patientNo}`}
                                size="medium"
                                color="primary"
                                variant="outlined"
                                sx={{ mb: 1 }}
                            />

                            {/* IDs Section */}
                            <Stack spacing={1.5} alignItems="flex-start" width="100%" sx={{ px: { xs: 1, sm: 2 } }}>
                                <InfoItem label="Patient ID" value={patientData.patientID} icon={<BadgeIcon fontSize="small" />} isId={true} />
                                <InfoItem label="UID No" value={patientData.patientUIDNo} icon={<FingerprintIcon fontSize="small" />} isId={true} />
                            </Stack>

                            <Divider sx={{ width: '80%', my: 2 }} />

                            {/* Case Selection Section */}
                             <Stack spacing={1} width="100%" sx={{ px: { xs: 1, sm: 2 } }}>
                                <Typography variant="subtitle1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <FolderZipIcon color="action" fontSize="small" /> Select Case
                                </Typography>
                                <Autocomplete
                                    id="case-no-select"
                                    options={caseOptions}
                                    value={selectedCase}
                                    onChange={(event, newValue) => {
                                        setSelectedCase(newValue);
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                    renderInput={(params) => <TextField {...params} label="Case Number" placeholder="Select a case" />}
                                    fullWidth
                                    size="small"
                                    disabled={caseOptions.length === 0 || isLoading} // Disable while loading initial data too
                                    ListboxProps={{ style: { maxHeight: 200 } }}
                                    noOptionsText={isLoading ? "Loading cases..." : (caseOptions.length > 0 ? "No matching cases" : "No cases found")}
                                />
                             </Stack>
                        </Stack>
                    </Grid>

                    {/* === Right Column: Detailed Information, Documents, Actions === */}
                    <Grid item xs={12} md={8}>
                        <Box>
                            {/* --- Personal Details Section --- */}
                            <Typography variant="h6" gutterBottom color="primary.dark" sx={{ borderLeft: `4px solid ${theme.palette.primary.main}`, pl: 1.5, mb: 2 }}>Personal Details</Typography>
                            <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
                                <InfoItem label="DOB" value={formatDate(patientData.dob)} icon={<CakeIcon fontSize="small" />} />
                                <InfoItem label="Age" value={patientData.age} icon={<AccessibilityNewIcon fontSize="small" />} />
                                <InfoItem label="Gender" value={patientData.genderName} icon={<WcIcon fontSize="small" />} />
                                <InfoItem label="Blood Grp" value={patientData.bloodGroup} icon={<BloodtypeIcon fontSize="small" />} />
                                <InfoItem label="Nationality" value={patientData.nationality} icon={<FlagIcon fontSize="small" />} />
                                <InfoItem label="Civil Status" value={patientData.civilStatusName} icon={<FamilyRestroomIcon fontSize="small" />} />
                            </Grid>

                            {/* --- Contact Info Section --- */}
                            <Typography variant="h6" gutterBottom color="primary.dark" sx={{ mt: 3.5, borderLeft: `4px solid ${theme.palette.primary.main}`, pl: 1.5, mb: 2 }}>Contact Information</Typography>
                            <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
                                <InfoItem label="Mobile" value={patientData.curMobileNo} icon={<PhoneIcon fontSize="small" />} />
                                <InfoItem label="Email" value={patientData.email} icon={<EmailIcon fontSize="small" />} />
                                {/* Address needs full width */}
                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 0.5 }}>
                                        <Box sx={{ color: 'primary.main', display: 'flex', mt: 0.3 }}><LocationOnIcon fontSize="small" /></Box>
                                        <Stack>
                                             <Typography variant="body2" fontWeight="medium" color="text.secondary">Address:</Typography>
                                              <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                                                {patientData.curAddress || <Typography component="span" variant="body2" color="text.disabled">N/A</Typography>}
                                             </Typography>
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>

                            {/* --- Other Info Section --- */}
                            <Typography variant="h6" gutterBottom color="primary.dark" sx={{ mt: 3.5, borderLeft: `4px solid ${theme.palette.primary.main}`, pl: 1.5, mb: 2 }}>Other Information</Typography>
                            <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
                                <InfoItem label="Emergency Contact" value={patientData.emerGencyName} icon={<ContactEmergencyIcon fontSize="small" />} />
                                <InfoItem label="Emergency No" value={patientData.emerGencyContact} icon={<ContactEmergencyIcon fontSize="small" />} />
                                <InfoItem label="Insurance" value={patientData.insuranceComp} icon={<AssuredWorkloadIcon fontSize="small" />} />
                            </Grid>

                            {/* --- Patient Documents Section --- */}
                            <Typography variant="h6" gutterBottom color="primary.dark" sx={{ mt: 4, borderLeft: `4px solid ${theme.palette.primary.main}`, pl: 1.5, mb: 1.5 }}>Case Documents</Typography>

                            {/* Show message if no case is selected */}
                            {!selectedCase && (
                                <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
                                    Select a Case Number from the left panel to view associated documents.
                                </Alert>
                             )}

                            {/* Show Skeleton Loaders for Documents */}
                            {selectedCase && isLoadingDocs && (
                                <Box sx={{ my: 2, px: 1 }}>
                                    {[...Array(3)].map((_, index) => (
                                        <ListItem key={index} disableGutters sx={{ py: 0.8 }}>
                                            <ListItemIcon sx={{ minWidth: '40px' }}><Skeleton variant="circular" width={24} height={24} /></ListItemIcon>
                                            <ListItemText
                                                primary={<Skeleton variant="text" width="70%" height={20} />}
                                                secondary={<Skeleton variant="text" width="50%" height={15} />}
                                             />
                                            <ListItemSecondaryAction><Skeleton variant="circular" width={32} height={32} /></ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </Box>
                            )}

                            {/* Show Document List */}
                            {selectedCase && !isLoadingDocs && patientDoc.length > 0 && (
                                <List dense sx={{ maxHeight: 350, overflowY: 'auto', mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, p: 1, bgcolor: 'grey.50' }}>
                                    {patientDoc.map((doc) => (
                                        <ListItem
                                            key={doc.patientDocID}
                                            divider
                                            sx={{
                                                py: 0.75, // Adjust padding
                                                '&:last-child': { borderBottom: 'none' },
                                                '&:hover': { bgcolor: 'action.hover' }
                                             }}
                                        >
                                            <ListItemIcon sx={{ minWidth: '40px', color: 'text.secondary', pt: 0.5 }}>
                                                <DescriptionIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={doc.docName || "Unnamed Document"}
                                                secondary={
                                                    <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                        {doc.docTypeName || 'N/A'} ({formatDate(doc.docDateTime || doc.entryDate)}){doc.docSerialNo ? ` | Ser: ${doc.docSerialNo}`: ''}
                                                    </Typography>
                                                }
                                                primaryTypographyProps={{
                                                     variant: 'body2',
                                                     fontWeight: 500,
                                                     overflow: 'hidden',
                                                     textOverflow: 'ellipsis',
                                                     whiteSpace: 'nowrap',
                                                     pr: 5 // Add padding right to prevent overlap with action
                                                }}
                                            />
                                            <ListItemSecondaryAction>
                                                <Tooltip title="Download Document">
                                                    {/* Span needed for disabled button tooltip */}
                                                    <span>
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="download"
                                                            onClick={() => handleDownloadDocument(doc)}
                                                            disabled={!doc.docPath} // Disable if no path
                                                            size="small"
                                                        >
                                                            <DownloadIcon fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            )}

                            {/* Show Message if No Documents Found */}
                            {selectedCase && !isLoadingDocs && patientDoc.length === 0 && (
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 3, textAlign: 'center', py: 3, border: `1px dashed ${theme.palette.divider}`, borderRadius: 1 }}>
                                    No documents found for this case.
                                </Typography>
                            )}

                            {/* --- Attach / Generate Report Section (Only shows if a case is selected) --- */}
                            {selectedCase && (
                                <Box sx={{ mt: 3, p: { xs: 1.5, sm: 2, md: 2.5 }, border: `1px dashed ${theme.palette.divider}`, borderRadius: 1, bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50' }}>
                                    <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, fontWeight: 500 }}>
                                        <FindInPageIcon color="action" /> Attach / Generate Report
                                    </Typography>
                                    <Stack spacing={2}>
                                        <Autocomplete
                                            id="report-type-select"
                                            options={reportTypeOptions}
                                            value={selectedReportType}
                                            onChange={(event, newValue) => setSelectedReportType(newValue)}
                                            getOptionLabel={(option) => option.label}
                                            isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                            renderInput={(params) => <TextField {...params} label="Report Type" placeholder="Select report type" />}
                                            fullWidth size="small"
                                            disabled={reportTypeOptions.length === 0 || isSubmittingReport} // Also disable during submit
                                            ListboxProps={{ style: { maxHeight: 200 } }}
                                        />
                                        <Autocomplete
                                            id="doc-type-select"
                                            options={docTypeOptions}
                                            value={selectedDocType}
                                            onChange={(event, newValue) => setSelectedDocType(newValue)}
                                            getOptionLabel={(option) => option.label}
                                            isOptionEqualToValue={(option, value) => String(option?.value) === String(value?.value)}
                                            renderInput={(params) => <TextField {...params} label="Document Type" placeholder="Select document type" />}
                                            fullWidth size="small"
                                            disabled={!selectedReportType || docTypeOptions.length === 0 || isSubmittingReport} // Also disable during submit
                                            noOptionsText={!selectedReportType ? "Select Report Type first" : (docTypeOptions.length > 0 ? "No matching types" : "No document types found")}
                                            ListboxProps={{ style: { maxHeight: 200 } }}
                                        />

                                        {/* File Attachment Area */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            <Button
                                                variant="outlined"
                                                component="label" // Makes the button act like a label for the hidden input
                                                size="small"
                                                startIcon={<AttachmentIcon fontSize="small" />}
                                                color="secondary"
                                                disabled={isSubmittingReport} // Disable during submit
                                            >
                                                Attach File
                                                <input
                                                    type="file"
                                                    hidden
                                                    onChange={handleFileChange}
                                                    ref={fileInputRef}
                                                    disabled={isSubmittingReport} // Disable during submit
                                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,image/*,.txt,.rtf" // Example accepted types
                                                />
                                            </Button>
                                            {selectedFile && (
                                                <Chip
                                                    label={selectedFile.name}
                                                    size="small"
                                                    // Only allow delete if NOT submitting
                                                    onDelete={isSubmittingReport ? undefined : handleClearFile}
                                                    color="secondary"
                                                    variant="outlined"
                                                    sx={{
                                                        maxWidth: 'calc(100% - 150px)', // Adjust max width as needed
                                                        '& .MuiChip-label': {
                                                            display: 'block',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        {/* Submit Button */}
                                        <Button
                                            variant="contained"
                                            onClick={handleReportSubmit}
                                            disabled={!selectedCase || !selectedReportType || !selectedDocType || !pateintDocId || isSubmittingReport } // Disable conditions
                                            startIcon={isSubmittingReport
                                                ? <CircularProgress size={18} color="inherit" /> // Show loader when submitting
                                                : (selectedFile ? <CloudUploadIcon fontSize="small" /> : <FindInPageIcon fontSize="small" />) // Dynamic icon
                                            }
                                            sx={{ alignSelf: 'flex-start', mt: 1 }} // Align button left
                                            size="medium"
                                        >
                                            {isSubmittingReport ? 'Processing...' : (selectedFile ? 'Submit & Upload' : 'Submit Metadata')}
                                        </Button>
                                    </Stack>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        );
    };

    // --- Drawer Structure ---
    return (
        <>
            <SwipeableDrawer
                anchor="right"
                open={open}
                onClose={handleClose} // Use the handler to call props.onClose
                onOpen={() => {}} // Required empty fn for SwipeableDrawer
                disableBackdropTransition={true} // Performance optimization
                disableDiscovery={true} // Performance optimization
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: '90%', md: '80%', lg: '75%', xl: '70%' }, // Responsive width
                        maxWidth: '1200px', // Max width constraint
                        height: '100vh', // Full viewport height
                        display: 'flex',
                        flexDirection: 'column', // Ensure column layout
                        boxShadow: theme.shadows[10], // Apply shadow
                        overflow: 'hidden' // Prevent double scrollbars on the Paper itself
                    },
                }}
                // Ensure drawer is above other elements if needed
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 100 }}
            >
                {/* Header Section (Fixed) */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: { xs: 1, sm: 1.5, md: 2 }, // Responsive padding
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        flexShrink: 0, // Prevent header from shrinking
                    }}
                >
                    <Typography variant="h6" component="div" noWrap sx={{ maxWidth: 'calc(100% - 60px)', fontWeight: 500 }}>
                        Patient File {patientData?.candName ? `- ${patientData.candName}` : ''} {patientData?.patientNo ? `(${patientData.patientNo})` : ''}
                    </Typography>
                    <Tooltip title="Close">
                        <IconButton aria-label="Close" onClick={handleClose} sx={{ color: 'primary.contrastText' }}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Content Area (Scrollable) */}
                <Box sx={{
                     flexGrow: 1, // Allow content to take remaining space
                     overflowY: 'auto', // Enable vertical scrolling HERE
                     bgcolor: 'background.default' // Background for the scrollable area
                }}>
                    {renderContent()}
                </Box>

                {/* Toast Container - Ensure it's rendered */}
                <ToastApp />
            </SwipeableDrawer>
        </>
    );
}