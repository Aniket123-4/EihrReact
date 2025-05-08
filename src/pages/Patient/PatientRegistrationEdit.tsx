import React, { useEffect, useState } from "react";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import {
    Box,
    Button,
    Divider,
    Grid,
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
    Autocomplete,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    CircularProgress, // To show loading while processing
    LinearProgress,   // Added for page loading
    Paper,
    Card,
    Collapse,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'; // Icon for close button
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../utils/Url"; // Ensure this path is correct
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { getISTDate } from "../../utils/Constant";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


import 'react-toastify/dist/ReactToastify.css';

// Define option types for clarity
interface SelectOption {
    label: string;
    value: string | number;
}

// --- NEW TYPE --- for Modal Content
interface ModalContent {
    name: string | null;
    type: string | null; // Mime type (e.g., 'image/jpeg', 'application/pdf')
    data: string | null; // Base64 data
}

// Define the structure of the initial form values for clarity


export default function PatientRegistrationEdit() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const patientID = location?.state?.patientID;

    // --- State ---
    const [isLoading, setIsLoading] = useState(false); // For fetching patient data
    const [isDataLoaded, setIsDataLoaded] = useState(false); // Track successful data load
    const [isPermanentAddressOpen, setIsPermanentAddressOpen] = useState(false);
    const [sameAsCurrent, setSameAsCurrent] = useState(false);

    // Dropdown/Autocomplete options
    const [genderOptions, setGenderOptions] = useState<SelectOption[]>([]);
    const [countryOptions, setCountryOptions] = useState<SelectOption[]>([]);
    const [districtOptions, setDistrictOptions] = useState<SelectOption[]>([]);
    const [stateOptions, setStateOptions] = useState<SelectOption[]>([]);
    const [documentOptions, setDocumentOptions] = useState<SelectOption[]>([]);
    const [permanentStateOptions, setPermanentStateOptions] = useState<SelectOption[]>([]);
    const [permanentDistrictOptions, setPermanentDistrictOptions] = useState<SelectOption[]>([]);


    // Image & File Preview State
    const [photoPreview, setPhotoPreview] = useState<string | null>(null); // Can hold base64 or blob URL
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null); // Can hold base64 or blob URL
    const [documentFileNamePreview, setDocumentFileNamePreview] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<ModalContent>({ name: null, type: null, data: null });
    const [isProcessingFile, setIsProcessingFile] = useState(false); // For new file uploads
    const { defaultValuestime } = getISTDate();


    // --- Formik Setup ---
    const initialValues: any = {
        patientID: 0,
        patientNo: "",
        fName: "",
        fNameML: "",
        mName: "",
        mNameML: "",
        lName: "",
        lNameML: "",
        genderID: 0,
        fatherName: "",
        fatherNameML: "",
        motherName: "",
        motherNameML: "",
        dob: "",
        birthPlace: "",
        civilStatusID: 0,
        bGroupID: 0,
        religionID: 0,
        nationalityID: 0,
        curHouseNo: "",
        curAddress: "",
        curVillageName: "",
        curTehsilName: "",
        curPinCode: "",
        curStateID: 0,
        curDistrictID: 0,
        curCountryID: 0,
        curMobileNoCC: "+91",
        curMobileNo: "",
        curPhoneCC: "",
        curPhoneAC: "",
        curPhoneNo: "",
        eMail: "",
        alternateEmail: "",
        perHouseNo: "",
        perAddress: "",
        perVillageName: "",
        perTehsilName: "",
        perPinCode: "",
        perStateID: 0,
        perDistrictID: 0,
        perCountryID: 0,
        perMobileNoCC: "+91", // Default for perm as well
        perMobileNo: "",
        perPhoneCC: "",
        perPhoneAC: "",
        perPhoneNo: "",
        vUniqueID: 0,
        vUniqueName: "",
        passIssueDate: "",
        passIssuePlace: "",
        photo: "",
        signature: "",
        uidDocFile: "",
        uidDocName: "",
        uidDocExt: "",
        uidDocPath: "",
        uidDocID: 0,
        lstType_Patient: [],
        istType_Pat: [],
        isVIP: false,
        userID: 0, // Should be set based on logged-in user ideally
        formID: 0, // Or set appropriately
        type: 1,   // Default to 1 (Add), will be changed to 2 on load for edit
    };

    const validationSchema = Yup.object({
        fName: Yup.string().required(t("text.reqFirstName")),
        lName: Yup.string().required(t("text.reqLastName")),
        genderID: Yup.number().required(t("text.reqGender")).min(1, t("text.reqGender")),
        dob: Yup.date().required(t("text.reqDOB")).nullable(),
        eMail: Yup.string().email(t("text.invalidEmail")).notRequired(),
        curAddress: Yup.string().required("Address is required"),
        curPinCode: Yup.string().required("PinCode is required").matches(/^[1-9][0-9]{5}$/, "Invalid PinCode"),
        curMobileNo: Yup.string().required("Mobile Number is required").matches(/^[6-9]\d{9}$/, "Invalid Mobile Number"),
        vUniqueID: Yup.number().required("Document Type is required").min(1, "Document Type is required"),
        vUniqueName: Yup.string().required("Document Number is required"),
        // Validation for base64 fields is tricky, often done on server or via custom logic if needed
        photo: Yup.string().notRequired(),
        signature: Yup.string().notRequired(),
        uidDocFile: Yup.string().notRequired(),
    });


    const formik:any = useFormik<any>({ // Use the FormValues interface
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            // Type should be 2 because getPateint sets it for edit
            const payload = { ...values };
            console.log("Updating Payload:", payload);
            // Disable submit button while processing
            formik.setSubmitting(true);
            try {
                const response = await api.post(`AddUpdatePatient`, payload);

                if (response.data.isSuccess) {
                    toast.success(
                      response.data.msg || "Patient updated successfully!",
                      { autoClose: 2000 } // Ensure toast stays for 2 seconds
                    );
                    // Delay navigation to allow toast to be visible
                    setTimeout(() => {
                      formik.resetForm();
                      // ... other state resets
                      navigate('/Patient/PatientRegistration');
                    }, 2000);
                  } else {
                    toast.error(response.data.msg || "Update failed. Please try again.");
                  }
              
            } catch (error: any) {
                console.error("API Error:", error);
                const errorMsg = error?.response?.data?.mesg || error?.response?.data?.Message || "An error occurred during submission.";
                toast.error(errorMsg);
            } finally {
                 formik.setSubmitting(false); // Re-enable submit button
            }
        },
    });

    // --- API Calls ---
    const getGender = async () => { /* ... remains the same ... */
        try {
            const res = await api.get(`Common/Getgender`);
            const data = res?.data?.data || [];
            const arr = data.map((item: any) => ({
                label: item.genderName,
                value: item.genderID,
            }));
            setGenderOptions(arr);
        } catch (error) {
            console.error("Error fetching gender:", error);
            toast.error("Failed to load genders.");
        }
    };
    const getCountry = async () => { /* ... remains the same ... */
        try {
            const res = await api.post(`Common/GetCountry?CountryID=-1&Type=1`);
            const data = res?.data || []; const arr = (Array.isArray(data) ? data : [data]).filter((item: any) => item && item.countryID != null).map((item: any) => ({ label: item.countryName, value: item.countryID, }));
            setCountryOptions(arr);
        } catch (error) {
            console.error("Error fetching countries:", error);
            toast.error("Failed to load countries.");
        }
    };
    const getState = async (countryId: any | string, isPermanent: boolean = false) => { /* ... remains the same ... */
        if (!countryId || countryId <= 0) {
            if (isPermanent) setPermanentStateOptions([]);
            else setStateOptions([]);
            return;
        };
        try {
            const res = await api.post(`Common/GetState?CountryID=${countryId}&StateID=-1&Type=1`);
            const data = res?.data || []; const arr = data.map((item: any) => ({ label: item.stateName, value: item.stateID, }));
            if (isPermanent) {
                setPermanentStateOptions(arr);
            } else {
                setStateOptions(arr);
            }
        } catch (error) {
            console.error(`Error fetching states for country ${countryId}:`, error);
            toast.error("Failed to load states.");
            if (isPermanent) setPermanentStateOptions([]);
            else setStateOptions([]);
        }
    };
    const getDistrict = async (stateId: any | string, isPermanent: boolean = false) => { /* ... remains the same ... */
        if (!stateId || stateId <= 0) {
            if (isPermanent) setPermanentDistrictOptions([]);
            else setDistrictOptions([]);
            return;
        }; try {
            const res = await api.post(`Common/GetDistrict?&StateID=${stateId}&DistrictID=-1&Type=1`);
            const data = res?.data || []; const arr = data.map((item: any) => ({
                label: item.districtName,
                value: item.districtID,
            }));
            if (isPermanent) {
                setPermanentDistrictOptions(arr);
            } else {
                setDistrictOptions(arr);
            }
        } catch (error) {
            console.error(`Error fetching districts for state ${stateId}:`, error);
            toast.error("Failed to load districts.");
            if (isPermanent) setPermanentDistrictOptions([]);
            else setDistrictOptions([]);
        }
    };
    const getDocument = async () => { /* ... remains the same ... */
        try {
            const res = await api.get(`MasterForm/vUniqueID`);
            const data = res?.data?.result || [];
            const arr = data.map((item: any) => ({
                label: item.uniqueName,
                value: item.uniqueID,
            }));
            setDocumentOptions(arr);
        } catch (error) {
            console.error("Error fetching documents:", error);
            toast.error("Failed to load document types.");
        }
    };

    // --- Updated getPateint ---
    const getPateint = async (patientId: any) => {
        if (!patientId) {
            toast.error("No Patient ID provided for editing.");
            navigate('/Patient/PatientRegistration'); // Redirect if no ID
            return;
        }
        setIsLoading(true);
        setIsDataLoaded(false); // Reset load status

        const collectData = {
            "patientNo": "",
            "patientUIDNo": "",
            "ageGreater": 0,
            "genderID": -1,
            "civilStatusID": -1,
            "bloodGroupID": -1,
            "nationalityID": -1,
            "serviceTypeID": -1,
            "patientName": "",
            "patientMobileNo": "",
            "patientPhoneNo": "",
            "patientDOB": "1900-01-01",
            "fromDate": "1900-01-01",
            "toDate": new Date().toISOString(), // Use current date for 'toDate' usually
            "isDeleted": false,
            "userID": -1, // Consider setting this based on logged-in user
            "formID": -1, // Consider setting this
            "type": 2, // Type 2 for Search/Edit scenario
            "patientID": patientId || ""
        };

        try {
            const res = await api.post(`GetPatientSearch`, collectData);

            if (res.data && res.data.isSuccess && res.data.result && res.data.result1 && res.data.result2) {
                const patientCore = res.data.result?.[0];
                const patientAddress = res.data.result1?.[0];
                const patientFiles = res.data.result2?.[0]; // Assume photo/signature are base64

                if (!patientCore || !patientAddress || !patientFiles) {
                    toast.error("Incomplete patient data received from API.");
                    setIsLoading(false);
                    return;
                }

                // --- Prepare data for Formik ---
                const formData: any = { ...initialValues }; // Start with initial values

                // Map Core Details (result) - Use || '' or || 0 for safety
                formData.fName = patientCore.fName || "";
                formData.mName = patientCore.mName || "";
                formData.lName = patientCore.lName || "";
                formData.genderID = parseInt(patientCore.genderID || "0", 10);
                formData.fatherName = patientCore.fatherName || "";
                formData.motherName = patientCore.motherName || "";
                formData.dob = patientCore.dob ? patientCore.dob.split('T')[0] : "";
                formData.vUniqueID = parseInt(patientCore.vUniqueID || "0", 10);
                formData.vUniqueName = patientCore.vUniqueName || "";
                formData.isVIP = patientCore.isVIP || false;
                formData.birthPlace = patientCore.birthPlace || "";
                formData.civilStatusID = parseInt(patientCore.civilStatusID || "0", 10);
                formData.religionID = parseInt(patientCore.religionID || "0", 10);
                formData.nationalityID = parseInt(patientCore.nationalityID || "0", 10);
                formData.bGroupID = parseInt(patientCore.bGroupID || "-1", 10); // Added from result[0]
                formData.patientNo = patientCore.patientNo || ""; // Added from result[0]

                // Map Address Details (result1)
                formData.curHouseNo = patientAddress.curHouseNo || "";
                formData.curAddress = patientAddress.curAddress || "";
                formData.curVillageName = patientAddress.curVillageName || "";
                formData.curTehsilName = patientAddress.curTehsilName || "";
                formData.curPinCode = patientAddress.curPinCode || "";
                formData.curCountryID = parseInt(patientAddress.curCountryID || "0", 10); // API returns -1, might need adjustment
                formData.curStateID = parseInt(patientAddress.curStateID || "0", 10); // API returns 1, might be valid
                formData.curDistrictID = parseInt(patientAddress.curDistrictID || "0", 10); // API returns -1
                formData.curMobileNo = patientAddress.curMobileNo || "";
                formData.curPhoneNo = patientAddress.curPhoneNo || "";
                formData.eMail = patientAddress.eMail || "";
                formData.alternateEmail = patientAddress.alternateEmail || "";
                formData.perHouseNo = patientAddress.perHouseNo || "";
                formData.perAddress = patientAddress.perAddress || "";
                formData.perVillageName = patientAddress.perVillageName || "";
                formData.perTehsilName = patientAddress.perTehsilName || "";
                formData.perPinCode = patientAddress.perPinCode || "";
                formData.perCountryID = parseInt(patientAddress.perCountryID || "0", 10); // API returns -1
                formData.perStateID = parseInt(patientAddress.perStateID || "0", 10); // API returns 1
                formData.perDistrictID = parseInt(patientAddress.perDistrictID || "0", 10); // API returns -1
                formData.perMobileNo = patientAddress.perMobileNo || "";
                formData.perPhoneNo = patientAddress.perPhoneNo || "";
                formData.passIssueDate = patientAddress.passportIssueDate ? patientAddress.passportIssueDate.split('T')[0] : "";
                formData.passIssuePlace = patientAddress.passportIssuePlace || "";

                // Map File Details (result2) - Assuming API returns base64
                // Prepend base64 header if missing
                const formatBase64 = (data: string | null, mimeType: string): string | null => {
                    if (!data) return null;
                    if (data.startsWith(`data:${mimeType};base64,`)) return data;
                    return `data:${mimeType};base64,${data}`;
                }
                formData.photo = formatBase64(patientFiles.photo, 'image/jpeg'); // Assuming JPEG for photo
                formData.signature = formatBase64(patientFiles.signature, 'image/png'); // Assuming PNG for signature, adjust if needed
                formData.uidDocFile = patientFiles.uidDocFile || ""; // Assume this IS already formatted base64 if present
                formData.uidDocName = patientAddress.uidDocName || ""; // Name comes from result1 in your example
                formData.uidDocExt = patientAddress.uidDocExt || "";   // Extension comes from result1
                formData.uidDocID = parseInt(patientAddress.uidDocID || "0", 10); // ID comes from result1

                // Set patientID and type for update
                formData.patientID = patientId;
                formData.type = 2; // Set type to 2 for update operation

                // --- Set Formik Values ---
                await formik.setValues(formData); // Use await to ensure values are set before fetching dropdowns

                // --- Set Preview States ---
                if (formData.photo) {
                    setPhotoPreview(formData.photo); // Directly use formatted base64
                }
                if (formData.signature) {
                    setSignaturePreview(formData.signature); // Directly use formatted base64
                }
                 // Set document name preview based on uidDocName from result1
                 if (formData.uidDocName) {
                    setDocumentFileNamePreview(formData.uidDocName + (formData.uidDocExt ? `.${formData.uidDocExt}` : ''));
                 } else if (formData.uidDocFile) {
                    // Fallback if name is missing but data exists
                    setDocumentFileNamePreview("Uploaded Document");
                 }


                // --- Fetch dependent dropdowns AFTER setting values ---
                // Handle potential -1 from API for Country/State/District
                 const validCurCountryId = formData.curCountryID > 0 ? formData.curCountryID : null;
                 const validCurStateId = formData.curStateID > 0 ? formData.curStateID : null;
                 if (validCurCountryId) {
                    await getState(validCurCountryId, false);
                    if (validCurStateId) {
                       await getDistrict(validCurStateId, false);
                    }
                 }

                 // --- Handle Permanent Address ---
                 const hasPermanentAddress = !!(formData.perAddress || formData.perCountryID > 0 || formData.perStateID > 0 || formData.perDistrictID > 0);
                 const isSame = formData.curAddress === formData.perAddress &&
                                formData.curCountryID === formData.perCountryID &&
                                formData.curStateID === formData.perStateID &&
                                formData.curDistrictID === formData.perDistrictID &&
                                formData.curPinCode === formData.perPinCode &&
                                formData.curHouseNo === formData.perHouseNo &&
                                formData.curVillageName === formData.perVillageName &&
                                formData.curTehsilName === formData.perTehsilName;

                 if (hasPermanentAddress) {
                     setIsPermanentAddressOpen(true);
                     setSameAsCurrent(isSame);
                     const validPerCountryId = formData.perCountryID > 0 ? formData.perCountryID : null;
                     const validPerStateId = formData.perStateID > 0 ? formData.perStateID : null;
                     if (!isSame && validPerCountryId) {
                         await getState(validPerCountryId, true);
                         if (validPerStateId) {
                             await getDistrict(validPerStateId, true);
                         }
                     }
                 } else {
                     setIsPermanentAddressOpen(false);
                     setSameAsCurrent(false);
                 }

                setIsDataLoaded(true); // Mark as loaded

            } else {
                toast.error(res.data?.msg || "Failed to fetch patient data or data is incomplete.");
            }
        } catch (error) {
            console.error("Error fetching patient:", error);
            toast.error("Failed to load patient data.");
        } finally {
            setIsLoading(false);
        }
    };


    // --- Effects ---
    useEffect(() => {
        // Fetch static dropdowns first
        getGender();
        getCountry();
        getDocument();

        // Fetch patient data if ID exists
        if (patientID) {
            getPateint(patientID);
        } else {
             toast.error("No Patient ID found for editing.");
             navigate('/Patient/PatientRegistration'); // Or appropriate listing page
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientID, navigate]); // Rerun if patientID changes


    useEffect(() => {
        // Cleanup for blob URLs if needed (usually not needed for base64 previews)
        return () => {
            if (photoPreview && photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
            if (signaturePreview && signaturePreview.startsWith('blob:')) URL.revokeObjectURL(signaturePreview);
        };
    }, [photoPreview, signaturePreview]);


    // --- Event Handlers ---
    const handlePermanentAddressToggle = () => { setIsPermanentAddressOpen(!isPermanentAddressOpen); };
    const handleSameAsCurrentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
         const isChecked = event.target.checked;
         setSameAsCurrent(isChecked);
         const fieldsToCopy = ['HouseNo', 'Address', 'VillageName', 'TehsilName', 'PinCode', 'StateID', 'DistrictID', 'CountryID',];
         if (isChecked) {
             fieldsToCopy.forEach(field => {
                 formik.setFieldValue(`per${field}`, formik.values[`cur${field}`]);
             });
             // Trigger fetching permanent dropdowns based on current values
             const currentCountryId = formik.values.curCountryID;
             const currentStateId = formik.values.curStateID;
             if (currentCountryId && currentCountryId > 0) {
                 getState(currentCountryId, true).then(() => {
                     if (currentStateId && currentStateId > 0) {
                         getDistrict(currentStateId, true);
                     } else {
                         setPermanentDistrictOptions([]);
                     }
                 });
             } else {
                 setPermanentStateOptions([]);
                 setPermanentDistrictOptions([]);
             }
         } else {
             // Clear permanent address fields if unchecked
             fieldsToCopy.forEach(field => {
                 const initialValue = initialValues[`per${field}` as keyof typeof initialValues];
                 formik.setFieldValue(`per${field}`, initialValue);
             });
             setPermanentStateOptions([]);
             setPermanentDistrictOptions([]);
         }
     };


    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
        fieldName: 'photo' | 'signature' | 'uidDocFile'
    ) => {
        const file = event.target.files?.[0];
        event.target.value = ''; // Reset input immediately

        if (!file) {
            // Handle file removal: Clear formik value and preview
             formik.setFieldValue(fieldName, "");
             if (fieldName === 'photo') setPhotoPreview(null);
             else if (fieldName === 'signature') setSignaturePreview(null);
             else if (fieldName === 'uidDocFile') {
                 setDocumentFileNamePreview(null);
                 formik.setFieldValue('uidDocName', ''); // Clear associated fields too
                 formik.setFieldValue('uidDocExt', '');
             }
             return;
        }

        // Size validation
        const maxSize = fieldName === 'uidDocFile' ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error(`File size exceeds the limit of ${maxSize / (1024 * 1024)}MB.`);
            return;
        }

        // Show Loading for document processing
        if (fieldName === 'uidDocFile') {
            setIsProcessingFile(true);
            setDocumentFileNamePreview(`Processing: ${file.name}`);
            setModalContent({ name: null, type: null, data: null });
        }

        // Convert file to Base64 string
        const toBase64 = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
        };

        try {
            const base64String = await toBase64(file);
            formik.setFieldValue(fieldName, base64String); // Store base64 string

            // Update previews / modal trigger / associated fields
            if (fieldName === 'photo') {
                setPhotoPreview(base64String); // Use base64 directly for preview
            } else if (fieldName === 'signature') {
                 setSignaturePreview(base64String); // Use base64 directly for preview
            } else if (fieldName === 'uidDocFile') {
                 setDocumentFileNamePreview(file.name); // Update file name preview
                 // Set associated fields
                 const nameParts = file.name.split('.');
                 const ext = nameParts.length > 1 ? nameParts.pop() : '';
                 const name = nameParts.join('.');
                 formik.setFieldValue('uidDocName', name);
                 formik.setFieldValue('uidDocExt', ext);

                 // Set modal content and open it
                 setModalContent({
                     name: file.name,
                     type: file.type, // Store mime type
                     data: base64String
                 });
                 setIsModalOpen(true);
            }
            formik.setFieldError(fieldName, undefined); // Clear errors
        } catch (error) {
            console.error("Error processing file:", error);
            toast.error("Could not process file.");
            formik.setFieldValue(fieldName, ""); // Reset field value on error
            // Clear previews/file name on error
            if (fieldName === 'photo') setPhotoPreview(null);
            else if (fieldName === 'signature') setSignaturePreview(null);
            else if (fieldName === 'uidDocFile') {
                setDocumentFileNamePreview(null);
                setModalContent({ name: null, type: null, data: null });
                formik.setFieldValue('uidDocName', '');
                formik.setFieldValue('uidDocExt', '');
            }
        } finally {
            if (fieldName === 'uidDocFile') {
                setIsProcessingFile(false);
                // Re-set filename preview correctly after processing finishes
                 if (formik.values.uidDocFile && formik.values.uidDocName) {
                    setDocumentFileNamePreview(formik.values.uidDocName + (formik.values.uidDocExt ? `.${formik.values.uidDocExt}` : ''));
                 } else if (file && !formik.values.uidDocFile) { // If there was an error
                    setDocumentFileNamePreview(null);
                 }
            }
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };


    // --- Render ---
    return (
        <>
        <ToastContainer/>
        <Card style={{ width: "100%", backgroundColor: "#E9FDEE", border: ".5px solid #2B4593 ", marginTop: "3vh", }} >
            <Paper sx={{ width: "100%", overflow: "hidden", position: 'relative' }} style={{ padding: "10px" }}>
                {/* Loading Overlay */}
                {isLoading && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10 // Ensure it's above the form
                    }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Loading Patient Data...</Typography>
                    </Box>
                )}

                {/* Header */}
                 <Grid item xs={12} container spacing={2}>
                     <Grid item lg={4} md={4} xs={4}>
                                <button onClick={() => navigate(-1)}>Back</button>
                              </Grid>

                    <Grid item lg={8} md={8} xs={8}>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
                  <ManageAccountsIcon />
                </Avatar>
                <Typography variant="h5" gutterBottom
                  fontWeight={700} color="text.primary"
                  component="div"
                  sx={{ padding: "20px" }}
                  align="left">{t("text.UpdatePatientRegistration")}</Typography>
              </Box>
            </Grid>
                    
                </Grid>
                <Divider />
                <Box height={10} />

                {/* Show Form only when data might be loaded or initial render */}
                 <form onSubmit={formik.handleSubmit}>
                    {/* Patient Details Section */}
                    <Typography variant="h6" sx={{ mb: 2, backgroundColor: '#f0f0f0', padding: 1 }}>Patient Details</Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {/* Fields are mapped directly using formik.values */}
                         <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.FirstName") + " *"} name="fName" value={formik.values.fName} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.fName && Boolean(formik.errors.fName)} helperText={formik.touched.fName && formik.errors.fName} variant="outlined" size="small" /></Grid>
                         <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.MiddleName")} name="mName" value={formik.values.mName} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid>
                         <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.LastName") + " *"} name="lName" value={formik.values.lName} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.lName && Boolean(formik.errors.lName)} helperText={formik.touched.lName && formik.errors.lName} variant="outlined" size="small" /></Grid>
                         <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.FatherName")} name="fatherName" value={formik.values.fatherName} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid>
                         <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.MotherName")} name="motherName" value={formik.values.motherName} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid>
                         <Grid item xs={12} sm={6} md={4}><Autocomplete disablePortal id="gender-autocomplete" options={genderOptions} getOptionLabel={(option) => option.label || ""} value={genderOptions.find(opt => opt.value === formik.values.genderID) || null} onChange={(event, newValue) => formik.setFieldValue("genderID", newValue ? newValue.value : 0)} onBlur={() => formik.setFieldTouched("genderID", true)} fullWidth size="small" renderInput={(params) => (<TextField {...params} label={t("text.Gender") + " *"} error={formik.touched.genderID && Boolean(formik.errors.genderID)} helperText={formik.touched.genderID && formik.errors.genderID} />)} /></Grid>
                         <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.DOB") + " *"} name="dob" type="date" value={formik.values.dob} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.dob && Boolean(formik.errors.dob)} helperText={formik.touched.dob && formik.errors.dob} variant="outlined" size="small" InputLabelProps={{ shrink: true }} /></Grid>
                         <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.BirthPlace")} name="birthPlace" value={formik.values.birthPlace} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid> {/* Added BirthPlace */}
                         <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.Email")} name="eMail" type="email" value={formik.values.eMail} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.eMail && Boolean(formik.errors.eMail)} helperText={formik.touched.eMail && formik.errors.eMail} variant="outlined" size="small" /></Grid>
                         <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.AltEmail")} name="alternateEmail" type="email" value={formik.values.alternateEmail} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid> {/* Added Alt Email */}
                        {/* Add other fields like Civil Status, Religion, Nationality if dropdown options are available */}
                    </Grid>

                    {/* Current Address Section */}
                    <Box sx={{ backgroundColor: '#2B4593', color: 'white', padding: 1, mb: 2, mt: 2 }}> <Typography variant="h6">Current Address</Typography> </Box>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                         <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.HouseNo")} name="curHouseNo" value={formik.values.curHouseNo} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.curHouseNo && Boolean(formik.errors.curHouseNo)} helperText={formik.touched.curHouseNo && formik.errors.curHouseNo} variant="outlined" size="small" /></Grid>
                         <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.Address") + " *"} name="curAddress" value={formik.values.curAddress} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.curAddress && Boolean(formik.errors.curAddress)} helperText={formik.touched.curAddress && formik.errors.curAddress} variant="outlined" size="small" /></Grid>
                         <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.Village")} name="curVillageName" value={formik.values.curVillageName} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid>
                         <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.Tehsil")} name="curTehsilName" value={formik.values.curTehsilName} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid>
                         <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.PinCode") + " *"} name="curPinCode" value={formik.values.curPinCode} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.curPinCode && Boolean(formik.errors.curPinCode)} helperText={formik.touched.curPinCode && formik.errors.curPinCode} variant="outlined" size="small" /></Grid>
                         <Grid item xs={12} sm={6} md={3}><Autocomplete disablePortal id="cur-country-autocomplete" options={countryOptions} getOptionLabel={(option) => option.label || ""} value={countryOptions.find(opt => opt.value === formik.values.curCountryID) || null} onChange={(event, newValue) => { const ncId:any = newValue ? newValue.value : 0; formik.setFieldValue("curCountryID", ncId); formik.setFieldValue("curStateID", 0); formik.setFieldValue("curDistrictID", 0); setStateOptions([]); setDistrictOptions([]); if (ncId && ncId > 0) getState(ncId, false); }} onBlur={() => formik.setFieldTouched("curCountryID", true)} fullWidth size="small" renderInput={(params) => (<TextField {...params} label={t("text.Country")} error={formik.touched.curCountryID && Boolean(formik.errors.curCountryID)} helperText={formik.touched.curCountryID && formik.errors.curCountryID} />)} /></Grid>
                         <Grid item xs={12} sm={6} md={3}><Autocomplete disablePortal id="cur-state-autocomplete" options={stateOptions} getOptionLabel={(option) => option.label || ""} value={stateOptions.find(opt => opt.value === formik.values.curStateID) || null} onChange={(event, newValue) => { const nsId:any = newValue ? newValue.value : 0; formik.setFieldValue("curStateID", nsId); formik.setFieldValue("curDistrictID", 0); setDistrictOptions([]); if (nsId && nsId > 0) getDistrict(nsId, false); }} onBlur={() => formik.setFieldTouched("curStateID", true)} fullWidth size="small" disabled={!formik.values.curCountryID || formik.values.curCountryID <= 0 || stateOptions.length === 0} renderInput={(params) => (<TextField {...params} label={t("text.State")} error={formik.touched.curStateID && Boolean(formik.errors.curStateID)} helperText={formik.touched.curStateID && formik.errors.curStateID} />)} /></Grid>
                         <Grid item xs={12} sm={6} md={3}><Autocomplete disablePortal id="cur-district-autocomplete" options={districtOptions} getOptionLabel={(option) => option.label || ""} value={districtOptions.find(opt => opt.value === formik.values.curDistrictID) || null} onChange={(event, newValue) => formik.setFieldValue("curDistrictID", newValue ? newValue.value : 0)} onBlur={() => formik.setFieldTouched("curDistrictID", true)} fullWidth size="small" disabled={!formik.values.curStateID || formik.values.curStateID <= 0 || districtOptions.length === 0} renderInput={(params) => (<TextField {...params} label={t("text.District")} error={formik.touched.curDistrictID && Boolean(formik.errors.curDistrictID)} helperText={formik.touched.curDistrictID && formik.errors.curDistrictID} />)} /></Grid>
                         <Grid item xs={12} sm={6} md={6}><TextField fullWidth label={t("text.MobileNumber") + " *"} name="curMobileNo" value={formik.values.curMobileNo} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.curMobileNo && Boolean(formik.errors.curMobileNo)} helperText={formik.touched.curMobileNo && formik.errors.curMobileNo} variant="outlined" size="small" InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>{formik.values.curMobileNoCC || '+91'}</Typography> }} /></Grid>
                         <Grid item xs={12} sm={6} md={6}><TextField fullWidth label={t("text.PhoneNumber")} name="curPhoneNo" value={formik.values.curPhoneNo} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid> {/* Added Phone */}
                    </Grid>
                    <Divider />

                    {/* Permanent Address Section */}
                    <Box mt={2} display="flex" alignItems="center">
                         <Button onClick={handlePermanentAddressToggle} style={{ textTransform: 'none' }}> {isPermanentAddressOpen ? "Hide" : "Show"} Permanent Address </Button>
                         <FormControlLabel control={<Checkbox checked={sameAsCurrent} onChange={handleSameAsCurrentChange} disabled={!isPermanentAddressOpen} />} label="Same As Current Address" sx={{ ml: 2 }} />
                    </Box>
                    <Collapse in={isPermanentAddressOpen} timeout="auto" unmountOnExit>
                        <Box sx={{ backgroundColor: '#f0f0f0', padding: 2, mt: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.HouseNo")} name="perHouseNo" value={formik.values.perHouseNo} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" disabled={sameAsCurrent} /></Grid>
                                <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.Address")} name="perAddress" value={formik.values.perAddress} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" disabled={sameAsCurrent} /></Grid>
                                <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.Village")} name="perVillageName" value={formik.values.perVillageName} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" disabled={sameAsCurrent} /></Grid>
                                <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.Tehsil")} name="perTehsilName" value={formik.values.perTehsilName} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" disabled={sameAsCurrent} /></Grid>
                                <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.PinCode")} name="perPinCode" value={formik.values.perPinCode} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" disabled={sameAsCurrent} /></Grid>
                                <Grid item xs={12} sm={6} md={3}><Autocomplete disablePortal id="per-country-autocomplete" options={countryOptions} getOptionLabel={(option) => option.label || ""} value={countryOptions.find(opt => opt.value === formik.values.perCountryID) || null} onChange={(event, newValue) => { const npcId:any = newValue ? newValue.value : 0; formik.setFieldValue("perCountryID", npcId); formik.setFieldValue("perStateID", 0); formik.setFieldValue("perDistrictID", 0); setPermanentStateOptions([]); setPermanentDistrictOptions([]); if (npcId && npcId > 0) getState(npcId, true); }} onBlur={() => formik.setFieldTouched("perCountryID", true)} fullWidth size="small" disabled={sameAsCurrent} renderInput={(params) => (<TextField {...params} label={t("text.Country")} />)} /></Grid>
                                <Grid item xs={12} sm={6} md={3}><Autocomplete disablePortal id="per-state-autocomplete" options={permanentStateOptions} getOptionLabel={(option) => option.label || ""} value={permanentStateOptions.find(opt => opt.value === formik.values.perStateID) || null} onChange={(event, newValue) => { const npsId:any = newValue ? newValue.value : 0; formik.setFieldValue("perStateID", npsId); formik.setFieldValue("perDistrictID", 0); setPermanentDistrictOptions([]); if (npsId && npsId > 0) getDistrict(npsId, true); }} onBlur={() => formik.setFieldTouched("perStateID", true)} fullWidth size="small" disabled={sameAsCurrent || !formik.values.perCountryID || formik.values.perCountryID <= 0 || permanentStateOptions.length === 0} renderInput={(params) => (<TextField {...params} label={t("text.State")} />)} /></Grid>
                                <Grid item xs={12} sm={6} md={3}><Autocomplete disablePortal id="per-district-autocomplete" options={permanentDistrictOptions} getOptionLabel={(option) => option.label || ""} value={permanentDistrictOptions.find(opt => opt.value === formik.values.perDistrictID) || null} onChange={(event, newValue) => formik.setFieldValue("perDistrictID", newValue ? newValue.value : 0)} onBlur={() => formik.setFieldTouched("perDistrictID", true)} fullWidth size="small" disabled={sameAsCurrent || !formik.values.perStateID || formik.values.perStateID <= 0 || permanentDistrictOptions.length === 0} renderInput={(params) => (<TextField {...params} label={t("text.District")} />)} /></Grid>
                                <Grid item xs={12} sm={6} md={6}><TextField fullWidth label={t("text.MobileNumber")} name="perMobileNo" value={formik.values.perMobileNo} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" disabled={sameAsCurrent} InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>{formik.values.perMobileNoCC || '+91'}</Typography> }} /></Grid> {/* Added Perm Mobile */}
                                <Grid item xs={12} sm={6} md={6}><TextField fullWidth label={t("text.PhoneNumber")} name="perPhoneNo" value={formik.values.perPhoneNo} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" disabled={sameAsCurrent} /></Grid> {/* Added Perm Phone */}
                            </Grid>
                        </Box>
                    </Collapse>

                    {/* Documents Section */}
                    <Box sx={{ backgroundColor: '#2B4593', color: 'white', padding: 1, mb: 2, mt: 2 }}> <Typography variant="h6">Documents</Typography> </Box>
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6} md={3}><Autocomplete disablePortal id="document-type-autocomplete" options={documentOptions} getOptionLabel={(option) => option.label || ""} value={documentOptions.find(opt => opt.value === formik.values.vUniqueID) || null} onChange={(event, newValue) => formik.setFieldValue("vUniqueID", newValue ? newValue.value : 0)} onBlur={() => formik.setFieldTouched("vUniqueID", true)} fullWidth size="small" renderInput={(params) => (<TextField {...params} label={t("text.DocumentType") + " *"} error={formik.touched.vUniqueID && Boolean(formik.errors.vUniqueID)} helperText={formik.touched.vUniqueID && formik.errors.vUniqueID} />)} /></Grid>
                        <Grid item xs={12} sm={6} md={3}><TextField fullWidth label="Document Number *" name="vUniqueName" value={formik.values.vUniqueName} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.vUniqueName && Boolean(formik.errors.vUniqueName)} helperText={formik.touched.vUniqueName && formik.errors.vUniqueName} variant="outlined" size="small" /></Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box display="flex" flexDirection="column" alignItems="flex-start">
                                <Box display="flex" gap={1}> {/* Group buttons */}
                                     <Button variant="outlined" component="label" size="small" disabled={isProcessingFile}>
                                        {isProcessingFile ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                                        {formik.values.uidDocFile ? "Change Document" : "Upload Document File"}
                                        <input type="file" hidden onChange={(e) => handleFileChange(e, 'uidDocFile')} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" disabled={isProcessingFile} />
                                     </Button>
                                     {/* --- VIEW BUTTON --- */}
                                     {formik.values.uidDocFile && formik.values.uidDocName && !isProcessingFile && (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="info"
                                            onClick={() => {
                                                // Try to determine MIME type from extension
                                                const ext = formik.values.uidDocExt?.toLowerCase() || '';
                                                let type = 'application/octet-stream'; // Default
                                                if (['jpg', 'jpeg'].includes(ext)) type = 'image/jpeg';
                                                else if (ext === 'png') type = 'image/png';
                                                else if (ext === 'gif') type = 'image/gif';
                                                else if (ext === 'pdf') type = 'application/pdf';
                                                // Add doc, docx later if needed (preview might not work well)

                                                setModalContent({
                                                    name: formik.values.uidDocName + (formik.values.uidDocExt ? `.${formik.values.uidDocExt}` : ''),
                                                    type: type,
                                                    data: formik.values.uidDocFile // Assumes this is correct base64 from API
                                                });
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            View
                                        </Button>
                                     )}
                                     {/* --- END VIEW BUTTON --- */}
                                </Box>
                                {/* File Name Preview Logic */}
                                {documentFileNamePreview && !isProcessingFile && (
                                    <Typography variant="caption" display="block" sx={{ mt: 0.5, wordBreak: 'break-all' }}>
                                         {formik.values.uidDocFile ? "Current: " : "Selected: "} {documentFileNamePreview}
                                    </Typography>
                                )}
                                {isProcessingFile && documentFileNamePreview && (
                                    <Typography variant="caption" display="block" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                                        {documentFileNamePreview}
                                    </Typography>
                                )}
                                {formik.touched.uidDocFile && formik.errors.uidDocFile && !formik.values.uidDocFile && (
                                    <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                                        {formik.errors.uidDocFile}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                         {/* Add fields for PassIssueDate and PassIssuePlace */}
                        <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.PassportIssueDate")} name="passIssueDate" type="date" value={formik.values.passIssueDate} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" InputLabelProps={{ shrink: true }} /></Grid>
                        <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.PassportIssuePlace")} name="passIssuePlace" value={formik.values.passIssuePlace} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid>
                        <Grid item xs={12} sm={6} md={3}></Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />

                    {/* Photo & Signature Section */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Photo</Typography>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Button variant="outlined" component="label" size="small"> {photoPreview ? "Change" : "Upload"} Photo <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} /> </Button>
                                {photoPreview && (<Avatar src={photoPreview} alt="Photo Preview" sx={{ width: 80, height: 80 }} variant="rounded" />)}
                                {formik.errors.photo && formik.touched.photo && (<Typography color="error" variant="caption">{String(formik.errors.photo)}</Typography>)}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Signature</Typography>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Button variant="outlined" component="label" size="small"> {signaturePreview ? "Change" : "Upload"} Signature <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'signature')} /> </Button>
                                {signaturePreview && (<img src={signaturePreview} alt="Signature Preview" style={{ maxHeight: '60px', maxWidth: '150px', border: '1px solid #ccc', padding: '2px', backgroundColor: 'white' }} />)}
                                {formik.errors.signature && formik.touched.signature && (<Typography color="error" variant="caption">{String(formik.errors.signature)}</Typography>)}
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Submit Button */}
                    <Box mt={3} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={formik.isSubmitting || isProcessingFile || isLoading || !isDataLoaded} // Disable while submitting, processing, loading data or if data failed to load
                        >
                            {formik.isSubmitting ? t("text.save") : t("text.UPDATE")} {/* Change text to Update */}
                        </Button>
                        <Button variant="outlined" color="secondary" sx={{ ml: 2 }} onClick={() => navigate('/Patient/PatientRegistration')} disabled={formik.isSubmitting || isLoading}>
                             {t("text.Cancel")}
                         </Button>
                    </Box>
                </form>


                {/* Document Preview Modal */}
                <Dialog
                    onClose={handleModalClose}
                    aria-labelledby="document-preview-dialog-title"
                    open={isModalOpen}
                    maxWidth="md" // Adjust size as needed
                    fullWidth
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="document-preview-dialog-title">
                        Document Preview
                        <IconButton
                            aria-label="close"
                            onClick={handleModalClose}
                            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500], }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers sx={{ minHeight: '60vh', maxHeight:'80vh', display: 'flex', flexDirection: 'column' }}> {/* Adjust height */}
                        {modalContent.data && modalContent.type ? (
                            <>
                                <Typography gutterBottom variant="subtitle1">
                                    Filename: {modalContent.name || 'N/A'}
                                </Typography>
                                {modalContent.type.startsWith('image/') && (
                                    <Box sx={{ textAlign: 'center', flexGrow: 1, overflow: 'auto' }}>
                                        <img
                                            src={modalContent.data}
                                            alt="Document Preview"
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                        />
                                    </Box>
                                )}
                                {modalContent.type === 'application/pdf' && (
                                    <Box sx={{ flexGrow: 1, height: '100%', overflow:'hidden' }}> {/* Ensure Box takes space */}
                                     <iframe
                                        src={modalContent.data}
                                        title="Document Preview"
                                        style={{ width: '100%', height: '100%', border: 'none' }}
                                     />
                                    
                                     </Box>
                                )}
                                {!modalContent.type.startsWith('image/') && modalContent.type !== 'application/pdf' && (
                                    <Typography sx={{ mt: 2 }}>
                                        Preview is not available for this file type ({modalContent.type}). You might need to download it.
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <Typography>No document data available for preview.</Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleModalClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

            </Paper>
        </Card>
        </>
    );
}