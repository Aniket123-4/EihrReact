// import React, { useEffect, useState } from "react";
// import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
// import {
//     Box,
//     Button,
//     Divider,
//     Grid,
//     Typography,
//     TextField,
//     Checkbox,
//     FormControlLabel,
//     Autocomplete,
//     Avatar,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     IconButton,
//     CircularProgress, // To show loading while processing
//     LinearProgress,   // Added for page loading
//     Paper,
//     Card,
//     Collapse,
// } from "@mui/material";
// import CloseIcon from '@mui/icons-material/Close'; // Icon for close button
// import { useTranslation } from "react-i18next";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import api from "../../utils/Url"; // Ensure this path is correct
// import { toast } from "react-toastify";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getISTDate } from "../../utils/Constant";
// import { ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';


// import 'react-toastify/dist/ReactToastify.css';

// // Define option types for clarity
// interface SelectOption {
//     label: string;
//     value: string | number;
// }

// // --- NEW TYPE --- for Modal Content
// interface ModalContent {
//     name: string | null;
//     type: string | null; // Mime type (e.g., 'image/jpeg', 'application/pdf')
//     data: string | null; // Base64 data
// }

// // Define the structure of the initial form values for clarity


// export default function PatientRegistrationEdit() {
//     const { t } = useTranslation();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const patientID = location?.state?.patientID;

//     // --- State ---
//     const [isLoading, setIsLoading] = useState(false); // For fetching patient data
//     const [isDataLoaded, setIsDataLoaded] = useState(false); // Track successful data load
//     const [isPermanentAddressOpen, setIsPermanentAddressOpen] = useState(false);
//     const [sameAsCurrent, setSameAsCurrent] = useState(false);

//     // Dropdown/Autocomplete options
//     const [genderOptions, setGenderOptions] = useState<SelectOption[]>([]);
//     const [countryOptions, setCountryOptions] = useState<SelectOption[]>([]);
//     const [districtOptions, setDistrictOptions] = useState<SelectOption[]>([]);
//     const [stateOptions, setStateOptions] = useState<SelectOption[]>([]);
//     const [documentOptions, setDocumentOptions] = useState<SelectOption[]>([]);
//     const [permanentStateOptions, setPermanentStateOptions] = useState<SelectOption[]>([]);
//     const [permanentDistrictOptions, setPermanentDistrictOptions] = useState<SelectOption[]>([]);


//     // Image & File Preview State
//     const [photoPreview, setPhotoPreview] = useState<string | null>(null); // Can hold base64 or blob URL
//     const [signaturePreview, setSignaturePreview] = useState<string | null>(null); // Can hold base64 or blob URL
//     const [documentFileNamePreview, setDocumentFileNamePreview] = useState<string | null>(null);

//     // Modal State
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [modalContent, setModalContent] = useState<ModalContent>({ name: null, type: null, data: null });
//     const [isProcessingFile, setIsProcessingFile] = useState(false); // For new file uploads
//     const { defaultValuestime } = getISTDate();


//     // --- Formik Setup ---
//     const initialValues: any = {
//         patientID: 0,
//         patientNo: "",
//         fName: "",
//         fNameML: "",
//         mName: "",
//         mNameML: "",
//         lName: "",
//         lNameML: "",
//         genderID: 0,
//         fatherName: "",
//         fatherNameML: "",
//         motherName: "",
//         motherNameML: "",
//         dob: "",
//         birthPlace: "",
//         civilStatusID: 0,
//         bGroupID: 0,
//         religionID: 0,
//         nationalityID: 0,
//         curHouseNo: "",
//         curAddress: "",
//         curVillageName: "",
//         curTehsilName: "",
//         curPinCode: "",
//         curStateID: 0,
//         curDistrictID: 0,
//         curCountryID: 0,
//         curMobileNoCC: "+91",
//         curMobileNo: "",
//         curPhoneCC: "",
//         curPhoneAC: "",
//         curPhoneNo: "",
//         eMail: "",
//         alternateEmail: "",
//         perHouseNo: "",
//         perAddress: "",
//         perVillageName: "",
//         perTehsilName: "",
//         perPinCode: "",
//         perStateID: 0,
//         perDistrictID: 0,
//         perCountryID: 0,
//         perMobileNoCC: "+91", // Default for perm as well
//         perMobileNo: "",
//         perPhoneCC: "",
//         perPhoneAC: "",
//         perPhoneNo: "",
//         vUniqueID: 0,
//         vUniqueName: "",
//         passIssueDate: "",
//         passIssuePlace: "",
//         photo: "",
//         signature: "",
//         uidDocFile: "",
//         uidDocName: "",
//         uidDocExt: "",
//         uidDocPath: "",
//         uidDocID: 0,
//         lstType_Patient: [],
//         istType_Pat: [],
//         isVIP: false,
//         userID: 0, // Should be set based on logged-in user ideally
//         formID: 0, // Or set appropriately
//         type: 1,   // Default to 1 (Add), will be changed to 2 on load for edit
//     };

//     const validationSchema = Yup.object({
//         fName: Yup.string().required(t("text.reqFirstName")),
//         lName: Yup.string().required(t("text.reqLastName")),
//         genderID: Yup.number().required(t("text.reqGender")).min(1, t("text.reqGender")),
//         dob: Yup.date().required(t("text.reqDOB")).nullable(),
//         eMail: Yup.string().email(t("text.invalidEmail")).notRequired(),
//         curAddress: Yup.string().required("Address is required"),
//         curPinCode: Yup.string().required("PinCode is required").matches(/^[1-9][0-9]{5}$/, "Invalid PinCode"),
//         curMobileNo: Yup.string().required("Mobile Number is required").matches(/^[6-9]\d{9}$/, "Invalid Mobile Number"),
//         vUniqueID: Yup.number().required("Document Type is required").min(1, "Document Type is required"),
//         vUniqueName: Yup.string().required("Document Number is required"),
//         // Validation for base64 fields is tricky, often done on server or via custom logic if needed
//         photo: Yup.string().notRequired(),
//         signature: Yup.string().notRequired(),
//         uidDocFile: Yup.string().notRequired(),
//     });


//     const formik:any = useFormik<any>({ // Use the FormValues interface
//         initialValues: initialValues,
//         validationSchema: validationSchema,
//         onSubmit: async (values) => {
//             // Type should be 2 because getPateint sets it for edit
//             const payload = { ...values };
//             console.log("Updating Payload:", payload);
//             // Disable submit button while processing
//             formik.setSubmitting(true);
//             try {
//                 const response = await api.post(`AddUpdatePatient`, payload);

//                 if (response.data.isSuccess) {
//                     toast.success(
//                       response.data.msg || "Patient updated successfully!",
//                       { autoClose: 2000 } // Ensure toast stays for 2 seconds
//                     );
//                     // Delay navigation to allow toast to be visible
//                     setTimeout(() => {
//                       formik.resetForm();
//                       // ... other state resets
//                       navigate('/Patient/PatientRegistration');
//                     }, 2000);
//                   } else {
//                     toast.error(response.data.msg || "Update failed. Please try again.");
//                   }
              
//             } catch (error: any) {
//                 console.error("API Error:", error);
//                 const errorMsg = error?.response?.data?.mesg || error?.response?.data?.Message || "An error occurred during submission.";
//                 toast.error(errorMsg);
//             } finally {
//                  formik.setSubmitting(false); // Re-enable submit button
//             }
//         },
//     });

//     // --- API Calls ---
//     const getGender = async () => { /* ... remains the same ... */
//         try {
//             const res = await api.get(`Common/Getgender`);
//             const data = res?.data?.data || [];
//             const arr = data.map((item: any) => ({
//                 label: item.genderName,
//                 value: item.genderID,
//             }));
//             setGenderOptions(arr);
//         } catch (error) {
//             console.error("Error fetching gender:", error);
//             toast.error("Failed to load genders.");
//         }
//     };
//     const getCountry = async () => { /* ... remains the same ... */
//         try {
//             const res = await api.post(`Common/GetCountry?CountryID=-1&Type=1`);
//             const data = res?.data || []; const arr = (Array.isArray(data) ? data : [data]).filter((item: any) => item && item.countryID != null).map((item: any) => ({ label: item.countryName, value: item.countryID, }));
//             setCountryOptions(arr);
//         } catch (error) {
//             console.error("Error fetching countries:", error);
//             toast.error("Failed to load countries.");
//         }
//     };
//     const getState = async (countryId: any | string, isPermanent: boolean = false) => { /* ... remains the same ... */
//         if (!countryId || countryId <= 0) {
//             if (isPermanent) setPermanentStateOptions([]);
//             else setStateOptions([]);
//             return;
//         };
//         try {
//             const res = await api.post(`Common/GetState?CountryID=${countryId}&StateID=-1&Type=1`);
//             const data = res?.data || []; const arr = data.map((item: any) => ({ label: item.stateName, value: item.stateID, }));
//             if (isPermanent) {
//                 setPermanentStateOptions(arr);
//             } else {
//                 setStateOptions(arr);
//             }
//         } catch (error) {
//             console.error(`Error fetching states for country ${countryId}:`, error);
//             toast.error("Failed to load states.");
//             if (isPermanent) setPermanentStateOptions([]);
//             else setStateOptions([]);
//         }
//     };
//     const getDistrict = async (stateId: any | string, isPermanent: boolean = false) => { /* ... remains the same ... */
//         if (!stateId || stateId <= 0) {
//             if (isPermanent) setPermanentDistrictOptions([]);
//             else setDistrictOptions([]);
//             return;
//         }; try {
//             const res = await api.post(`Common/GetDistrict?&StateID=${stateId}&DistrictID=-1&Type=1`);
//             const data = res?.data || []; const arr = data.map((item: any) => ({
//                 label: item.districtName,
//                 value: item.districtID,
//             }));
//             if (isPermanent) {
//                 setPermanentDistrictOptions(arr);
//             } else {
//                 setDistrictOptions(arr);
//             }
//         } catch (error) {
//             console.error(`Error fetching districts for state ${stateId}:`, error);
//             toast.error("Failed to load districts.");
//             if (isPermanent) setPermanentDistrictOptions([]);
//             else setDistrictOptions([]);
//         }
//     };
//     const getDocument = async () => { /* ... remains the same ... */
//         try {
//             const res = await api.get(`MasterForm/vUniqueID`);
//             const data = res?.data?.result || [];
//             const arr = data.map((item: any) => ({
//                 label: item.uniqueName,
//                 value: item.uniqueID,
//             }));
//             setDocumentOptions(arr);
//         } catch (error) {
//             console.error("Error fetching documents:", error);
//             toast.error("Failed to load document types.");
//         }
//     };

//     // --- Updated getPateint ---
//     const getPateint = async (patientId: any) => {
//         if (!patientId) {
//             toast.error("No Patient ID provided for editing.");
//             navigate('/Patient/PatientRegistration'); // Redirect if no ID
//             return;
//         }
//         setIsLoading(true);
//         setIsDataLoaded(false); // Reset load status

//         const collectData = {
//             "patientNo": "",
//             "patientUIDNo": "",
//             "ageGreater": 0,
//             "genderID": -1,
//             "civilStatusID": -1,
//             "bloodGroupID": -1,
//             "nationalityID": -1,
//             "serviceTypeID": -1,
//             "patientName": "",
//             "patientMobileNo": "",
//             "patientPhoneNo": "",
//             "patientDOB": "1900-01-01",
//             "fromDate": "1900-01-01",
//             "toDate": new Date().toISOString(), // Use current date for 'toDate' usually
//             "isDeleted": false,
//             "userID": -1, // Consider setting this based on logged-in user
//             "formID": -1, // Consider setting this
//             "type": 2, // Type 2 for Search/Edit scenario
//             "patientID": patientId || ""
//         };

//         try {
//             const res = await api.post(`GetPatientSearch`, collectData);

//             if (res.data && res.data.isSuccess && res.data.result && res.data.result1 && res.data.result2) {
//                 const patientCore = res.data.result?.[0];
//                 const patientAddress = res.data.result1?.[0];
//                 const patientFiles = res.data.result2?.[0]; // Assume photo/signature are base64

//                 if (!patientCore || !patientAddress || !patientFiles) {
//                     toast.error("Incomplete patient data received from API.");
//                     setIsLoading(false);
//                     return;
//                 }

//                 // --- Prepare data for Formik ---
//                 const formData: any = { ...initialValues }; // Start with initial values

//                 // Map Core Details (result) - Use || '' or || 0 for safety
//                 formData.fName = patientCore.fName || "";
//                 formData.mName = patientCore.mName || "";
//                 formData.lName = patientCore.lName || "";
//                 formData.genderID = parseInt(patientCore.genderID || "0", 10);
//                 formData.fatherName = patientCore.fatherName || "";
//                 formData.motherName = patientCore.motherName || "";
//                 formData.dob = patientCore.dob ? patientCore.dob.split('T')[0] : "";
//                 formData.vUniqueID = parseInt(patientCore.vUniqueID || "0", 10);
//                 formData.vUniqueName = patientCore.vUniqueName || "";
//                 formData.isVIP = patientCore.isVIP || false;
//                 formData.birthPlace = patientCore.birthPlace || "";
//                 formData.civilStatusID = parseInt(patientCore.civilStatusID || "0", 10);
//                 formData.religionID = parseInt(patientCore.religionID || "0", 10);
//                 formData.nationalityID = parseInt(patientCore.nationalityID || "0", 10);
//                 formData.bGroupID = parseInt(patientCore.bGroupID || "-1", 10); // Added from result[0]
//                 formData.patientNo = patientCore.patientNo || ""; // Added from result[0]

//                 // Map Address Details (result1)
//                 formData.curHouseNo = patientAddress.curHouseNo || "";
//                 formData.curAddress = patientAddress.curAddress || "";
//                 formData.curVillageName = patientAddress.curVillageName || "";
//                 formData.curTehsilName = patientAddress.curTehsilName || "";
//                 formData.curPinCode = patientAddress.curPinCode || "";
//                 formData.curCountryID = parseInt(patientAddress.curCountryID || "0", 10); // API returns -1, might need adjustment
//                 formData.curStateID = parseInt(patientAddress.curStateID || "0", 10); // API returns 1, might be valid
//                 formData.curDistrictID = parseInt(patientAddress.curDistrictID || "0", 10); // API returns -1
//                 formData.curMobileNo = patientAddress.curMobileNo || "";
//                 formData.curPhoneNo = patientAddress.curPhoneNo || "";
//                 formData.eMail = patientAddress.eMail || "";
//                 formData.alternateEmail = patientAddress.alternateEmail || "";
//                 formData.perHouseNo = patientAddress.perHouseNo || "";
//                 formData.perAddress = patientAddress.perAddress || "";
//                 formData.perVillageName = patientAddress.perVillageName || "";
//                 formData.perTehsilName = patientAddress.perTehsilName || "";
//                 formData.perPinCode = patientAddress.perPinCode || "";
//                 formData.perCountryID = parseInt(patientAddress.perCountryID || "0", 10); // API returns -1
//                 formData.perStateID = parseInt(patientAddress.perStateID || "0", 10); // API returns 1
//                 formData.perDistrictID = parseInt(patientAddress.perDistrictID || "0", 10); // API returns -1
//                 formData.perMobileNo = patientAddress.perMobileNo || "";
//                 formData.perPhoneNo = patientAddress.perPhoneNo || "";
//                 formData.passIssueDate = patientAddress.passportIssueDate ? patientAddress.passportIssueDate.split('T')[0] : "";
//                 formData.passIssuePlace = patientAddress.passportIssuePlace || "";

//                 // Map File Details (result2) - Assuming API returns base64
//                 // Prepend base64 header if missing
//                 const formatBase64 = (data: string | null, mimeType: string): string | null => {
//                     if (!data) return null;
//                     if (data.startsWith(`data:${mimeType};base64,`)) return data;
//                     return `data:${mimeType};base64,${data}`;
//                 }
//                 formData.photo = formatBase64(patientFiles.photo, 'image/jpeg'); // Assuming JPEG for photo
//                 formData.signature = formatBase64(patientFiles.signature, 'image/png'); // Assuming PNG for signature, adjust if needed
//                 formData.uidDocFile = patientFiles.uidDocFile || ""; // Assume this IS already formatted base64 if present
//                 formData.uidDocName = patientAddress.uidDocName || ""; // Name comes from result1 in your example
//                 formData.uidDocExt = patientAddress.uidDocExt || "";   // Extension comes from result1
//                 formData.uidDocID = parseInt(patientAddress.uidDocID || "0", 10); // ID comes from result1

//                 // Set patientID and type for update
//                 formData.patientID = patientId;
//                 formData.type = 2; // Set type to 2 for update operation

//                 // --- Set Formik Values ---
//                 await formik.setValues(formData); // Use await to ensure values are set before fetching dropdowns

//                 // --- Set Preview States ---
//                 if (formData.photo) {
//                     setPhotoPreview(formData.photo); // Directly use formatted base64
//                 }
//                 if (formData.signature) {
//                     setSignaturePreview(formData.signature); // Directly use formatted base64
//                 }
//                  // Set document name preview based on uidDocName from result1
//                  if (formData.uidDocName) {
//                     setDocumentFileNamePreview(formData.uidDocName + (formData.uidDocExt ? `.${formData.uidDocExt}` : ''));
//                  } else if (formData.uidDocFile) {
//                     // Fallback if name is missing but data exists
//                     setDocumentFileNamePreview("Uploaded Document");
//                  }


//                 // --- Fetch dependent dropdowns AFTER setting values ---
//                 // Handle potential -1 from API for Country/State/District
//                  const validCurCountryId = formData.curCountryID > 0 ? formData.curCountryID : null;
//                  const validCurStateId = formData.curStateID > 0 ? formData.curStateID : null;
//                  if (validCurCountryId) {
//                     await getState(validCurCountryId, false);
//                     if (validCurStateId) {
//                        await getDistrict(validCurStateId, false);
//                     }
//                  }

//                  // --- Handle Permanent Address ---
//                  const hasPermanentAddress = !!(formData.perAddress || formData.perCountryID > 0 || formData.perStateID > 0 || formData.perDistrictID > 0);
//                  const isSame = formData.curAddress === formData.perAddress &&
//                                 formData.curCountryID === formData.perCountryID &&
//                                 formData.curStateID === formData.perStateID &&
//                                 formData.curDistrictID === formData.perDistrictID &&
//                                 formData.curPinCode === formData.perPinCode &&
//                                 formData.curHouseNo === formData.perHouseNo &&
//                                 formData.curVillageName === formData.perVillageName &&
//                                 formData.curTehsilName === formData.perTehsilName;

//                  if (hasPermanentAddress) {
//                      setIsPermanentAddressOpen(true);
//                      setSameAsCurrent(isSame);
//                      const validPerCountryId = formData.perCountryID > 0 ? formData.perCountryID : null;
//                      const validPerStateId = formData.perStateID > 0 ? formData.perStateID : null;
//                      if (!isSame && validPerCountryId) {
//                          await getState(validPerCountryId, true);
//                          if (validPerStateId) {
//                              await getDistrict(validPerStateId, true);
//                          }
//                      }
//                  } else {
//                      setIsPermanentAddressOpen(false);
//                      setSameAsCurrent(false);
//                  }

//                 setIsDataLoaded(true); // Mark as loaded

//             } else {
//                 toast.error(res.data?.msg || "Failed to fetch patient data or data is incomplete.");
//             }
//         } catch (error) {
//             console.error("Error fetching patient:", error);
//             toast.error("Failed to load patient data.");
//         } finally {
//             setIsLoading(false);
//         }
//     };


//     // --- Effects ---
//     useEffect(() => {
//         // Fetch static dropdowns first
//         getGender();
//         getCountry();
//         getDocument();

//         // Fetch patient data if ID exists
//         if (patientID) {
//             getPateint(patientID);
//         } else {
//              toast.error("No Patient ID found for editing.");
//              navigate('/Patient/PatientRegistration'); // Or appropriate listing page
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [patientID, navigate]); // Rerun if patientID changes


//     useEffect(() => {
//         // Cleanup for blob URLs if needed (usually not needed for base64 previews)
//         return () => {
//             if (photoPreview && photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
//             if (signaturePreview && signaturePreview.startsWith('blob:')) URL.revokeObjectURL(signaturePreview);
//         };
//     }, [photoPreview, signaturePreview]);


//     // --- Event Handlers ---
//     const handlePermanentAddressToggle = () => { setIsPermanentAddressOpen(!isPermanentAddressOpen); };
//     const handleSameAsCurrentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//          const isChecked = event.target.checked;
//          setSameAsCurrent(isChecked);
//          const fieldsToCopy = ['HouseNo', 'Address', 'VillageName', 'TehsilName', 'PinCode', 'StateID', 'DistrictID', 'CountryID',];
//          if (isChecked) {
//              fieldsToCopy.forEach(field => {
//                  formik.setFieldValue(`per${field}`, formik.values[`cur${field}`]);
//              });
//              // Trigger fetching permanent dropdowns based on current values
//              const currentCountryId = formik.values.curCountryID;
//              const currentStateId = formik.values.curStateID;
//              if (currentCountryId && currentCountryId > 0) {
//                  getState(currentCountryId, true).then(() => {
//                      if (currentStateId && currentStateId > 0) {
//                          getDistrict(currentStateId, true);
//                      } else {
//                          setPermanentDistrictOptions([]);
//                      }
//                  });
//              } else {
//                  setPermanentStateOptions([]);
//                  setPermanentDistrictOptions([]);
//              }
//          } else {
//              // Clear permanent address fields if unchecked
//              fieldsToCopy.forEach(field => {
//                  const initialValue = initialValues[`per${field}` as keyof typeof initialValues];
//                  formik.setFieldValue(`per${field}`, initialValue);
//              });
//              setPermanentStateOptions([]);
//              setPermanentDistrictOptions([]);
//          }
//      };


//     const handleFileChange = async (
//         event: React.ChangeEvent<HTMLInputElement>,
//         fieldName: 'photo' | 'signature' | 'uidDocFile'
//     ) => {
//         const file = event.target.files?.[0];
//         event.target.value = ''; // Reset input immediately

//         if (!file) {
//             // Handle file removal: Clear formik value and preview
//              formik.setFieldValue(fieldName, "");
//              if (fieldName === 'photo') setPhotoPreview(null);
//              else if (fieldName === 'signature') setSignaturePreview(null);
//              else if (fieldName === 'uidDocFile') {
//                  setDocumentFileNamePreview(null);
//                  formik.setFieldValue('uidDocName', ''); // Clear associated fields too
//                  formik.setFieldValue('uidDocExt', '');
//              }
//              return;
//         }

//         // Size validation
//         const maxSize = fieldName === 'uidDocFile' ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
//         if (file.size > maxSize) {
//             toast.error(`File size exceeds the limit of ${maxSize / (1024 * 1024)}MB.`);
//             return;
//         }

//         // Show Loading for document processing
//         if (fieldName === 'uidDocFile') {
//             setIsProcessingFile(true);
//             setDocumentFileNamePreview(`Processing: ${file.name}`);
//             setModalContent({ name: null, type: null, data: null });
//         }

//         // Convert file to Base64 string
//         const toBase64 = (file: File): Promise<string> => {
//             return new Promise((resolve, reject) => {
//                 const reader = new FileReader();
//                 reader.readAsDataURL(file);
//                 reader.onload = () => resolve(reader.result as string);
//                 reader.onerror = error => reject(error);
//             });
//         };

//         try {
//             const base64String = await toBase64(file);
//             formik.setFieldValue(fieldName, base64String); // Store base64 string

//             // Update previews / modal trigger / associated fields
//             if (fieldName === 'photo') {
//                 setPhotoPreview(base64String); // Use base64 directly for preview
//             } else if (fieldName === 'signature') {
//                  setSignaturePreview(base64String); // Use base64 directly for preview
//             } else if (fieldName === 'uidDocFile') {
//                  setDocumentFileNamePreview(file.name); // Update file name preview
//                  // Set associated fields
//                  const nameParts = file.name.split('.');
//                  const ext = nameParts.length > 1 ? nameParts.pop() : '';
//                  const name = nameParts.join('.');
//                  formik.setFieldValue('uidDocName', name);
//                  formik.setFieldValue('uidDocExt', ext);

//                  // Set modal content and open it
//                  setModalContent({
//                      name: file.name,
//                      type: file.type, // Store mime type
//                      data: base64String
//                  });
//                  setIsModalOpen(true);
//             }
//             formik.setFieldError(fieldName, undefined); // Clear errors
//         } catch (error) {
//             console.error("Error processing file:", error);
//             toast.error("Could not process file.");
//             formik.setFieldValue(fieldName, ""); // Reset field value on error
//             // Clear previews/file name on error
//             if (fieldName === 'photo') setPhotoPreview(null);
//             else if (fieldName === 'signature') setSignaturePreview(null);
//             else if (fieldName === 'uidDocFile') {
//                 setDocumentFileNamePreview(null);
//                 setModalContent({ name: null, type: null, data: null });
//                 formik.setFieldValue('uidDocName', '');
//                 formik.setFieldValue('uidDocExt', '');
//             }
//         } finally {
//             if (fieldName === 'uidDocFile') {
//                 setIsProcessingFile(false);
//                 // Re-set filename preview correctly after processing finishes
//                  if (formik.values.uidDocFile && formik.values.uidDocName) {
//                     setDocumentFileNamePreview(formik.values.uidDocName + (formik.values.uidDocExt ? `.${formik.values.uidDocExt}` : ''));
//                  } else if (file && !formik.values.uidDocFile) { // If there was an error
//                     setDocumentFileNamePreview(null);
//                  }
//             }
//         }
//     };

//     const handleModalClose = () => {
//         setIsModalOpen(false);
//     };


//     // --- Render ---
//     return (
//         <>
//         <ToastContainer/>
//         <Card style={{ width: "100%", backgroundColor: "#E9FDEE", border: ".5px solid #2B4593 ", marginTop: "3vh", }} >
//             <Paper sx={{ width: "100%", overflow: "hidden", position: 'relative' }} style={{ padding: "10px" }}>
//                 {/* Loading Overlay */}
//                 {isLoading && (
//                     <Box sx={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         width: '100%',
//                         height: '100%',
//                         backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         zIndex: 10 // Ensure it's above the form
//                     }}>
//                         <CircularProgress />
//                         <Typography sx={{ ml: 2 }}>Loading Patient Data...</Typography>
//                     </Box>
//                 )}

//                 {/* Header */}
//                  <Grid item xs={12} container spacing={2}>
//                      <Grid item lg={4} md={4} xs={4}>
//                                 <button onClick={() => navigate(-1)}>Back</button>
//                               </Grid>

//                     <Grid item lg={8} md={8} xs={8}>
//               <Box display="flex" alignItems="center" gap={1}>
//                 <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
//                   <ManageAccountsIcon />
//                 </Avatar>
//                 <Typography variant="h5" gutterBottom
//                   fontWeight={700} color="text.primary"
//                   component="div"
//                   sx={{ padding: "20px" }}
//                   align="left">{t("text.UpdatePatientRegistration")}</Typography>
//               </Box>
//             </Grid>
                    
//                 </Grid>
//                 <Divider />
//                 <Box height={10} />

//                 {/* Show Form only when data might be loaded or initial render */}
//                  <form onSubmit={formik.handleSubmit}>
//                     {/* Patient Details Section */}
//                     <Typography variant="h6" sx={{ mb: 2, backgroundColor: '#f0f0f0', padding: 1 }}>Patient Details</Typography>
//                     <Grid container spacing={2} sx={{ mb: 2 }}>
//                         {/* Fields are mapped directly using formik.values */}
//                          <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.FirstName") + " *"} name="fName" value={formik.values.fName} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.fName && Boolean(formik.errors.fName)} helperText={formik.touched.fName && formik.errors.fName} variant="outlined" size="small" /></Grid>
//                          <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.MiddleName")} name="mName" value={formik.values.mName} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid>
//                          <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.LastName") + " *"} name="lName" value={formik.values.lName} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.lName && Boolean(formik.errors.lName)} helperText={formik.touched.lName && formik.errors.lName} variant="outlined" size="small" /></Grid>
//                          <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.FatherName")} name="fatherName" value={formik.values.fatherName} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid>
//                          <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.MotherName")} name="motherName" value={formik.values.motherName} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid>
//                          <Grid item xs={12} sm={6} md={4}><Autocomplete disablePortal id="gender-autocomplete" options={genderOptions} getOptionLabel={(option) => option.label || ""} value={genderOptions.find(opt => opt.value === formik.values.genderID) || null} onChange={(event, newValue) => formik.setFieldValue("genderID", newValue ? newValue.value : 0)} onBlur={() => formik.setFieldTouched("genderID", true)} fullWidth size="small" renderInput={(params) => (<TextField {...params} label={t("text.Gender") + " *"} error={formik.touched.genderID && Boolean(formik.errors.genderID)} helperText={formik.touched.genderID && formik.errors.genderID} />)} /></Grid>
//                          <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.DOB") + " *"} name="dob" type="date" value={formik.values.dob} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.dob && Boolean(formik.errors.dob)} helperText={formik.touched.dob && formik.errors.dob} variant="outlined" size="small" InputLabelProps={{ shrink: true }} /></Grid>
//                          <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.BirthPlace")} name="birthPlace" value={formik.values.birthPlace} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid> {/* Added BirthPlace */}
//                          <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.Email")} name="eMail" type="email" value={formik.values.eMail} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.eMail && Boolean(formik.errors.eMail)} helperText={formik.touched.eMail && formik.errors.eMail} variant="outlined" size="small" /></Grid>
//                          <Grid item xs={12} sm={6} md={4}><TextField fullWidth label={t("text.AltEmail")} name="alternateEmail" type="email" value={formik.values.alternateEmail} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid> {/* Added Alt Email */}
//                         {/* Add other fields like Civil Status, Religion, Nationality if dropdown options are available */}
//                     </Grid>

//                     {/* Current Address Section */}
//                     <Box sx={{ backgroundColor: '#2B4593', color: 'white', padding: 1, mb: 2, mt: 2 }}> <Typography variant="h6">Current Address</Typography> </Box>
//                     <Grid container spacing={2} sx={{ mb: 2 }}>
//                          <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.HouseNo")} name="curHouseNo" value={formik.values.curHouseNo} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.curHouseNo && Boolean(formik.errors.curHouseNo)} helperText={formik.touched.curHouseNo && formik.errors.curHouseNo} variant="outlined" size="small" /></Grid>
//                          <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.Address") + " *"} name="curAddress" value={formik.values.curAddress} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.curAddress && Boolean(formik.errors.curAddress)} helperText={formik.touched.curAddress && formik.errors.curAddress} variant="outlined" size="small" /></Grid>
//                          <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.Village")} name="curVillageName" value={formik.values.curVillageName} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid>
//                          <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.Tehsil")} name="curTehsilName" value={formik.values.curTehsilName} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid>
//                          <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.PinCode") + " *"} name="curPinCode" value={formik.values.curPinCode} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.curPinCode && Boolean(formik.errors.curPinCode)} helperText={formik.touched.curPinCode && formik.errors.curPinCode} variant="outlined" size="small" /></Grid>
//                          <Grid item xs={12} sm={6} md={3}><Autocomplete disablePortal id="cur-country-autocomplete" options={countryOptions} getOptionLabel={(option) => option.label || ""} value={countryOptions.find(opt => opt.value === formik.values.curCountryID) || null} onChange={(event, newValue) => { const ncId:any = newValue ? newValue.value : 0; formik.setFieldValue("curCountryID", ncId); formik.setFieldValue("curStateID", 0); formik.setFieldValue("curDistrictID", 0); setStateOptions([]); setDistrictOptions([]); if (ncId && ncId > 0) getState(ncId, false); }} onBlur={() => formik.setFieldTouched("curCountryID", true)} fullWidth size="small" renderInput={(params) => (<TextField {...params} label={t("text.Country")} error={formik.touched.curCountryID && Boolean(formik.errors.curCountryID)} helperText={formik.touched.curCountryID && formik.errors.curCountryID} />)} /></Grid>
//                          <Grid item xs={12} sm={6} md={3}><Autocomplete disablePortal id="cur-state-autocomplete" options={stateOptions} getOptionLabel={(option) => option.label || ""} value={stateOptions.find(opt => opt.value === formik.values.curStateID) || null} onChange={(event, newValue) => { const nsId:any = newValue ? newValue.value : 0; formik.setFieldValue("curStateID", nsId); formik.setFieldValue("curDistrictID", 0); setDistrictOptions([]); if (nsId && nsId > 0) getDistrict(nsId, false); }} onBlur={() => formik.setFieldTouched("curStateID", true)} fullWidth size="small" disabled={!formik.values.curCountryID || formik.values.curCountryID <= 0 || stateOptions.length === 0} renderInput={(params) => (<TextField {...params} label={t("text.State")} error={formik.touched.curStateID && Boolean(formik.errors.curStateID)} helperText={formik.touched.curStateID && formik.errors.curStateID} />)} /></Grid>
//                          <Grid item xs={12} sm={6} md={3}><Autocomplete disablePortal id="cur-district-autocomplete" options={districtOptions} getOptionLabel={(option) => option.label || ""} value={districtOptions.find(opt => opt.value === formik.values.curDistrictID) || null} onChange={(event, newValue) => formik.setFieldValue("curDistrictID", newValue ? newValue.value : 0)} onBlur={() => formik.setFieldTouched("curDistrictID", true)} fullWidth size="small" disabled={!formik.values.curStateID || formik.values.curStateID <= 0 || districtOptions.length === 0} renderInput={(params) => (<TextField {...params} label={t("text.District")} error={formik.touched.curDistrictID && Boolean(formik.errors.curDistrictID)} helperText={formik.touched.curDistrictID && formik.errors.curDistrictID} />)} /></Grid>
//                          <Grid item xs={12} sm={6} md={6}><TextField fullWidth label={t("text.MobileNumber") + " *"} name="curMobileNo" value={formik.values.curMobileNo} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.curMobileNo && Boolean(formik.errors.curMobileNo)} helperText={formik.touched.curMobileNo && formik.errors.curMobileNo} variant="outlined" size="small" InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>{formik.values.curMobileNoCC || '+91'}</Typography> }} /></Grid>
//                          <Grid item xs={12} sm={6} md={6}><TextField fullWidth label={t("text.PhoneNumber")} name="curPhoneNo" value={formik.values.curPhoneNo} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid> {/* Added Phone */}
//                     </Grid>
//                     <Divider />

//                     {/* Permanent Address Section */}
//                     <Box mt={2} display="flex" alignItems="center">
//                          <Button onClick={handlePermanentAddressToggle} style={{ textTransform: 'none' }}> {isPermanentAddressOpen ? "Hide" : "Show"} Permanent Address </Button>
//                          <FormControlLabel control={<Checkbox checked={sameAsCurrent} onChange={handleSameAsCurrentChange} disabled={!isPermanentAddressOpen} />} label="Same As Current Address" sx={{ ml: 2 }} />
//                     </Box>
//                     <Collapse in={isPermanentAddressOpen} timeout="auto" unmountOnExit>
//                         <Box sx={{ backgroundColor: '#f0f0f0', padding: 2, mt: 1 }}>
//                             <Grid container spacing={2}>
//                                 <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.HouseNo")} name="perHouseNo" value={formik.values.perHouseNo} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" disabled={sameAsCurrent} /></Grid>
//                                 <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.Address")} name="perAddress" value={formik.values.perAddress} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" disabled={sameAsCurrent} /></Grid>
//                                 <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.Village")} name="perVillageName" value={formik.values.perVillageName} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" disabled={sameAsCurrent} /></Grid>
//                                 <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.Tehsil")} name="perTehsilName" value={formik.values.perTehsilName} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" disabled={sameAsCurrent} /></Grid>
//                                 <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.PinCode")} name="perPinCode" value={formik.values.perPinCode} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" disabled={sameAsCurrent} /></Grid>
//                                 <Grid item xs={12} sm={6} md={3}><Autocomplete disablePortal id="per-country-autocomplete" options={countryOptions} getOptionLabel={(option) => option.label || ""} value={countryOptions.find(opt => opt.value === formik.values.perCountryID) || null} onChange={(event, newValue) => { const npcId:any = newValue ? newValue.value : 0; formik.setFieldValue("perCountryID", npcId); formik.setFieldValue("perStateID", 0); formik.setFieldValue("perDistrictID", 0); setPermanentStateOptions([]); setPermanentDistrictOptions([]); if (npcId && npcId > 0) getState(npcId, true); }} onBlur={() => formik.setFieldTouched("perCountryID", true)} fullWidth size="small" disabled={sameAsCurrent} renderInput={(params) => (<TextField {...params} label={t("text.Country")} />)} /></Grid>
//                                 <Grid item xs={12} sm={6} md={3}><Autocomplete disablePortal id="per-state-autocomplete" options={permanentStateOptions} getOptionLabel={(option) => option.label || ""} value={permanentStateOptions.find(opt => opt.value === formik.values.perStateID) || null} onChange={(event, newValue) => { const npsId:any = newValue ? newValue.value : 0; formik.setFieldValue("perStateID", npsId); formik.setFieldValue("perDistrictID", 0); setPermanentDistrictOptions([]); if (npsId && npsId > 0) getDistrict(npsId, true); }} onBlur={() => formik.setFieldTouched("perStateID", true)} fullWidth size="small" disabled={sameAsCurrent || !formik.values.perCountryID || formik.values.perCountryID <= 0 || permanentStateOptions.length === 0} renderInput={(params) => (<TextField {...params} label={t("text.State")} />)} /></Grid>
//                                 <Grid item xs={12} sm={6} md={3}><Autocomplete disablePortal id="per-district-autocomplete" options={permanentDistrictOptions} getOptionLabel={(option) => option.label || ""} value={permanentDistrictOptions.find(opt => opt.value === formik.values.perDistrictID) || null} onChange={(event, newValue) => formik.setFieldValue("perDistrictID", newValue ? newValue.value : 0)} onBlur={() => formik.setFieldTouched("perDistrictID", true)} fullWidth size="small" disabled={sameAsCurrent || !formik.values.perStateID || formik.values.perStateID <= 0 || permanentDistrictOptions.length === 0} renderInput={(params) => (<TextField {...params} label={t("text.District")} />)} /></Grid>
//                                 <Grid item xs={12} sm={6} md={6}><TextField fullWidth label={t("text.MobileNumber")} name="perMobileNo" value={formik.values.perMobileNo} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" disabled={sameAsCurrent} InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>{formik.values.perMobileNoCC || '+91'}</Typography> }} /></Grid> {/* Added Perm Mobile */}
//                                 <Grid item xs={12} sm={6} md={6}><TextField fullWidth label={t("text.PhoneNumber")} name="perPhoneNo" value={formik.values.perPhoneNo} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" disabled={sameAsCurrent} /></Grid> {/* Added Perm Phone */}
//                             </Grid>
//                         </Box>
//                     </Collapse>

//                     {/* Documents Section */}
//                     <Box sx={{ backgroundColor: '#2B4593', color: 'white', padding: 1, mb: 2, mt: 2 }}> <Typography variant="h6">Documents</Typography> </Box>
//                     <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
//                         <Grid item xs={12} sm={6} md={3}><Autocomplete disablePortal id="document-type-autocomplete" options={documentOptions} getOptionLabel={(option) => option.label || ""} value={documentOptions.find(opt => opt.value === formik.values.vUniqueID) || null} onChange={(event, newValue) => formik.setFieldValue("vUniqueID", newValue ? newValue.value : 0)} onBlur={() => formik.setFieldTouched("vUniqueID", true)} fullWidth size="small" renderInput={(params) => (<TextField {...params} label={t("text.DocumentType") + " *"} error={formik.touched.vUniqueID && Boolean(formik.errors.vUniqueID)} helperText={formik.touched.vUniqueID && formik.errors.vUniqueID} />)} /></Grid>
//                         <Grid item xs={12} sm={6} md={3}><TextField fullWidth label="Document Number *" name="vUniqueName" value={formik.values.vUniqueName} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.vUniqueName && Boolean(formik.errors.vUniqueName)} helperText={formik.touched.vUniqueName && formik.errors.vUniqueName} variant="outlined" size="small" /></Grid>
//                         <Grid item xs={12} sm={6} md={3}>
//                             <Box display="flex" flexDirection="column" alignItems="flex-start">
//                                 <Box display="flex" gap={1}> {/* Group buttons */}
//                                      <Button variant="outlined" component="label" size="small" disabled={isProcessingFile}>
//                                         {isProcessingFile ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
//                                         {formik.values.uidDocFile ? "Change Document" : "Upload Document File"}
//                                         <input type="file" hidden onChange={(e) => handleFileChange(e, 'uidDocFile')} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" disabled={isProcessingFile} />
//                                      </Button>
//                                      {/* --- VIEW BUTTON --- */}
//                                      {formik.values.uidDocFile && formik.values.uidDocName && !isProcessingFile && (
//                                         <Button
//                                             variant="contained"
//                                             size="small"
//                                             color="info"
//                                             onClick={() => {
//                                                 // Try to determine MIME type from extension
//                                                 const ext = formik.values.uidDocExt?.toLowerCase() || '';
//                                                 let type = 'application/octet-stream'; // Default
//                                                 if (['jpg', 'jpeg'].includes(ext)) type = 'image/jpeg';
//                                                 else if (ext === 'png') type = 'image/png';
//                                                 else if (ext === 'gif') type = 'image/gif';
//                                                 else if (ext === 'pdf') type = 'application/pdf';
//                                                 // Add doc, docx later if needed (preview might not work well)

//                                                 setModalContent({
//                                                     name: formik.values.uidDocName + (formik.values.uidDocExt ? `.${formik.values.uidDocExt}` : ''),
//                                                     type: type,
//                                                     data: formik.values.uidDocFile // Assumes this is correct base64 from API
//                                                 });
//                                                 setIsModalOpen(true);
//                                             }}
//                                         >
//                                             View
//                                         </Button>
//                                      )}
//                                      {/* --- END VIEW BUTTON --- */}
//                                 </Box>
//                                 {/* File Name Preview Logic */}
//                                 {documentFileNamePreview && !isProcessingFile && (
//                                     <Typography variant="caption" display="block" sx={{ mt: 0.5, wordBreak: 'break-all' }}>
//                                          {formik.values.uidDocFile ? "Current: " : "Selected: "} {documentFileNamePreview}
//                                     </Typography>
//                                 )}
//                                 {isProcessingFile && documentFileNamePreview && (
//                                     <Typography variant="caption" display="block" sx={{ mt: 0.5, fontStyle: 'italic' }}>
//                                         {documentFileNamePreview}
//                                     </Typography>
//                                 )}
//                                 {formik.touched.uidDocFile && formik.errors.uidDocFile && !formik.values.uidDocFile && (
//                                     <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
//                                         {formik.errors.uidDocFile}
//                                     </Typography>
//                                 )}
//                             </Box>
//                         </Grid>
//                          {/* Add fields for PassIssueDate and PassIssuePlace */}
//                         <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.PassportIssueDate")} name="passIssueDate" type="date" value={formik.values.passIssueDate} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" InputLabelProps={{ shrink: true }} /></Grid>
//                         <Grid item xs={12} sm={6} md={3}><TextField fullWidth label={t("text.PassportIssuePlace")} name="passIssuePlace" value={formik.values.passIssuePlace} onChange={formik.handleChange} onBlur={formik.handleBlur} variant="outlined" size="small" /></Grid>
//                         <Grid item xs={12} sm={6} md={3}></Grid>
//                     </Grid>
//                     <Divider sx={{ my: 2 }} />

//                     {/* Photo & Signature Section */}
//                     <Grid container spacing={3}>
//                         <Grid item xs={12} md={6}>
//                             <Typography variant="h6">Photo</Typography>
//                             <Box display="flex" alignItems="center" gap={2}>
//                                 <Button variant="outlined" component="label" size="small"> {photoPreview ? "Change" : "Upload"} Photo <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} /> </Button>
//                                 {photoPreview && (<Avatar src={photoPreview} alt="Photo Preview" sx={{ width: 80, height: 80 }} variant="rounded" />)}
//                                 {formik.errors.photo && formik.touched.photo && (<Typography color="error" variant="caption">{String(formik.errors.photo)}</Typography>)}
//                             </Box>
//                         </Grid>
//                         <Grid item xs={12} md={6}>
//                             <Typography variant="h6">Signature</Typography>
//                             <Box display="flex" alignItems="center" gap={2}>
//                                 <Button variant="outlined" component="label" size="small"> {signaturePreview ? "Change" : "Upload"} Signature <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'signature')} /> </Button>
//                                 {signaturePreview && (<img src={signaturePreview} alt="Signature Preview" style={{ maxHeight: '60px', maxWidth: '150px', border: '1px solid #ccc', padding: '2px', backgroundColor: 'white' }} />)}
//                                 {formik.errors.signature && formik.touched.signature && (<Typography color="error" variant="caption">{String(formik.errors.signature)}</Typography>)}
//                             </Box>
//                         </Grid>
//                     </Grid>

//                     {/* Submit Button */}
//                     <Box mt={3} display="flex" justifyContent="flex-end">
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             type="submit"
//                             disabled={formik.isSubmitting || isProcessingFile || isLoading || !isDataLoaded} // Disable while submitting, processing, loading data or if data failed to load
//                         >
//                             {formik.isSubmitting ? t("text.save") : t("text.UPDATE")} {/* Change text to Update */}
//                         </Button>
//                         <Button variant="outlined" color="secondary" sx={{ ml: 2 }} onClick={() => navigate('/Patient/PatientRegistration')} disabled={formik.isSubmitting || isLoading}>
//                              {t("text.Cancel")}
//                          </Button>
//                     </Box>
//                 </form>


//                 {/* Document Preview Modal */}
//                 <Dialog
//                     onClose={handleModalClose}
//                     aria-labelledby="document-preview-dialog-title"
//                     open={isModalOpen}
//                     maxWidth="md" // Adjust size as needed
//                     fullWidth
//                 >
//                     <DialogTitle sx={{ m: 0, p: 2 }} id="document-preview-dialog-title">
//                         Document Preview
//                         <IconButton
//                             aria-label="close"
//                             onClick={handleModalClose}
//                             sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500], }}
//                         >
//                             <CloseIcon />
//                         </IconButton>
//                     </DialogTitle>
//                     <DialogContent dividers sx={{ minHeight: '60vh', maxHeight:'80vh', display: 'flex', flexDirection: 'column' }}> {/* Adjust height */}
//                         {modalContent.data && modalContent.type ? (
//                             <>
//                                 <Typography gutterBottom variant="subtitle1">
//                                     Filename: {modalContent.name || 'N/A'}
//                                 </Typography>
//                                 {modalContent.type.startsWith('image/') && (
//                                     <Box sx={{ textAlign: 'center', flexGrow: 1, overflow: 'auto' }}>
//                                         <img
//                                             src={modalContent.data}
//                                             alt="Document Preview"
//                                             style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
//                                         />
//                                     </Box>
//                                 )}
//                                 {modalContent.type === 'application/pdf' && (
//                                     <Box sx={{ flexGrow: 1, height: '100%', overflow:'hidden' }}> {/* Ensure Box takes space */}
//                                      <iframe
//                                         src={modalContent.data}
//                                         title="Document Preview"
//                                         style={{ width: '100%', height: '100%', border: 'none' }}
//                                      />
                                    
//                                      </Box>
//                                 )}
//                                 {!modalContent.type.startsWith('image/') && modalContent.type !== 'application/pdf' && (
//                                     <Typography sx={{ mt: 2 }}>
//                                         Preview is not available for this file type ({modalContent.type}). You might need to download it.
//                                     </Typography>
//                                 )}
//                             </>
//                         ) : (
//                             <Typography>No document data available for preview.</Typography>
//                         )}
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={handleModalClose} color="primary">
//                             Close
//                         </Button>
//                     </DialogActions>
//                 </Dialog>

//             </Paper>
//         </Card>
//         </>
//     );
// }

import React, { useEffect, useState, useCallback } from "react";
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
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    CircularProgress,
    Paper,
    Card,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    InputAdornment,
    FormControl,
    InputLabel,
    FormHelperText,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../utils/Url";
import { toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { getISTDate } from "../../utils/Constant";

// Define option types for clarity
interface SelectOption {
    label: string;
    value: string | number;
}

interface ModalContent {
    name: string | null;
    type: string | null;
    data: string | null;
}

interface FamilyMember {
    col1: string | number;
    col2: string;
    col3: string;
    col4: string;
    col5: string;
    col6: string;
    col7: string;
    col8: string;
    col9: string | number;
    col10: string;
    col11: string;
    col12: string;
    col13: string;
    col14: string;
    col15: string;
}

// --- Family Form Component (memoized to prevent re-renders) ---
const FamilyForm = React.memo(({ 
    values, 
    onValueChange, 
    onSubmit,
    relationOptions,
    bloodGroupOptions
}: { 
    values: any; 
    onValueChange: (field: string, value: any) => void; 
    onSubmit: () => void;
    relationOptions: SelectOption[];
    bloodGroupOptions: SelectOption[];
}) => {
    const getCharacterError = (val: string) => {
        const regex = /^[A-Za-z\s]*$/;
        if (val && !regex.test(val)) {
            return "Only characters are allowed";
        }
        return undefined;
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Contact Name"
                        value={values.col3}
                        onChange={(e) => onValueChange("col3", e.target.value)}
                        error={!!getCharacterError(values.col3)}
                        helperText={getCharacterError(values.col3)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Relation</InputLabel>
                        <Select
                            value={values.col1}
                            label="Relation"
                            onChange={(e) => onValueChange("col1", e.target.value)}
                        >
                            <MenuItem value="">Select</MenuItem>
                            {relationOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Mobile Number"
                        value={values.col5}
                        onChange={(e) => onValueChange("col5", e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <TextField
                                        size="small"
                                        value={values.col4}
                                        onChange={(e) => onValueChange("col4", e.target.value)}
                                        sx={{ width: 60, mr: 1 }}
                                        placeholder="+91"
                                    />
                                </InputAdornment>
                            ),
                        }}
                        error={!!values.col5 && !/^[6-9]\d{9}$/.test(values.col5)}
                        helperText={values.col5 && !/^[6-9]\d{9}$/.test(values.col5) ? "Invalid mobile number" : ""}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Phone Number"
                        value={values.col8}
                        onChange={(e) => onValueChange("col8", e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <TextField
                                        size="small"
                                        value={values.col6}
                                        onChange={(e) => onValueChange("col6", e.target.value)}
                                        sx={{ width: 70, mr: 1 }}
                                        placeholder="STD"
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Blood Group</InputLabel>
                        <Select
                            value={values.col9}
                            label="Blood Group"
                            onChange={(e) => onValueChange("col9", e.target.value)}
                        >
                            <MenuItem value="">Select</MenuItem>
                            {bloodGroupOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button 
                        variant="contained" 
                        onClick={onSubmit} 
                        startIcon={<AddIcon />}
                    >
                        Add
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
});

// --- Family Table Component (memoized) ---
const FamilyTable = React.memo(({ 
    data, 
    onDelete,
    relationOptions,
    bloodGroupOptions
}: { 
    data: FamilyMember[]; 
    onDelete: (key: string) => void;
    relationOptions: SelectOption[];
    bloodGroupOptions: SelectOption[];
}) => {
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteKey, setDeleteKey] = useState<string | null>(null);

    const handleDeleteClick = (key: string) => {
        setDeleteKey(key);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteKey) {
            onDelete(deleteKey);
        }
        setDeleteConfirmOpen(false);
        setDeleteKey(null);
    };

    return (
        <>
            <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400, overflow: 'auto' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Sr No.</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Contact Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Relation</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Mobile Number</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Blood Group</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Phone Number</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No Record found</TableCell>
                            </TableRow>
                        ) : (
                            data.map((row) => (
                                <TableRow key={row.col2} hover>
                                    <TableCell>{row.col2}</TableCell>
                                    <TableCell>{row.col3}</TableCell>
                                    <TableCell>
                                        {relationOptions.find(r => r.value === row.col1)?.label || '-'}
                                    </TableCell>
                                    <TableCell>{row.col5}</TableCell>
                                    <TableCell>
                                        {bloodGroupOptions.find(b => b.value === row.col9)?.label || '-'}
                                    </TableCell>
                                    <TableCell>{row.col8}</TableCell>
                                    <TableCell>
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => handleDeleteClick(row.col2)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this item?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});

export default function PatientRegistrationEdit() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const patientID = location?.state?.patientID;

    // --- State ---
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isPermanentAddressOpen, setIsPermanentAddressOpen] = useState(false);
    const [sameAsCurrent, setSameAsCurrent] = useState(false);
    const [sameEmergency, setSameEmergency] = useState(false);

    // Dropdown/Autocomplete options
    const [genderOptions, setGenderOptions] = useState<SelectOption[]>([]);
    const [countryOptions, setCountryOptions] = useState<SelectOption[]>([]);
    const [districtOptions, setDistrictOptions] = useState<SelectOption[]>([]);
    const [stateOptions, setStateOptions] = useState<SelectOption[]>([]);
    const [documentOptions, setDocumentOptions] = useState<SelectOption[]>([]);
    const [permanentStateOptions, setPermanentStateOptions] = useState<SelectOption[]>([]);
    const [permanentDistrictOptions, setPermanentDistrictOptions] = useState<SelectOption[]>([]);
    const [civilStatusOptions, setCivilStatusOptions] = useState<SelectOption[]>([]);
    const [bloodGroupOptions, setBloodGroupOptions] = useState<SelectOption[]>([]);
    const [religionOptions, setReligionOptions] = useState<SelectOption[]>([]);
    const [relationOptions, setRelationOptions] = useState<SelectOption[]>([]);
    const [nationalityOptions, setNationalityOptions] = useState<SelectOption[]>([]);

    // Family and Emergency Contact Tables
    const [lstType_Patient, setLstType_Patient] = useState<FamilyMember[]>([]);
    const [istType_Pat, setIstType_Pat] = useState<FamilyMember[]>([]);

    // Image & File Preview State
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
    const [documentFileNamePreview, setDocumentFileNamePreview] = useState<string | null>(null);

    // Document Upload State
    const [selectedDoc, setSelectedDoc] = useState<any>();
    const [patientDocUpload, setPatientDocUpload] = useState<any>();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<ModalContent>({
        name: null,
        type: null,
        data: null,
    });
    const [isProcessingFile, setIsProcessingFile] = useState(false);

    // Family and Emergency Form Values
    const [familyFormValues, setFamilyFormValues] = useState({
        col1: "",
        col3: "",
        col4: "+91",
        col5: "",
        col6: "0512",
        col8: "",
        col9: "",
    });

    const [emergencyFormValues, setEmergencyFormValues] = useState({
        col1: "",
        col3: "",
        col4: "+91",
        col5: "",
        col6: "0512",
        col8: "",
        col9: "",
    });

    const { defaultValues } = getISTDate();

    // --- Formik Setup ---
    const initialValues = {
        patientID: "",
        patientNo: "",
        fName: "",
        fNameML: "",
        mName: "",
        mNameML: "",
        lName: "",
        lNameML: "",
        genderID: "",
        fatherName: "",
        fatherNameML: "",
        motherName: "",
        motherNameML: "",
        dob: "",
        birthPlace: "",
        civilStatusID: "",
        bGroupID: "",
        religionID: "",
        nationalityID: "",
        curHouseNo: "",
        curAddress: "",
        curVillageName: "",
        curTehsilName: "",
        curPinCode: "",
        curStateID: "",
        curDistrictID: "",
        curCountryID: "",
        curMobileNoCC: "91",
        curMobileNo: "",
        curPhoneCC: "0512",
        curPhoneAC: "",
        curPhoneNo: "",
        eMail: "",
        alternateEmail: "",
        perHouseNo: "",
        perAddress: "",
        perVillageName: "",
        perTehsilName: "",
        perPinCode: "",
        perStateID: "",
        perDistrictID: "",
        perCountryID: "",
        perMobileNoCC: "",
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
        lstType_Patient: [],
        istType_Pat: [],
        isVIP: false,
        uidDocName: "",
        uidDocExt: "",
        uidDocPath: "",
        uidDocID: 0,
        userID: -1,
        formID: -1,
        type: 2, // Type 2 for Update
    };

    const validationSchema = Yup.object({
        fName: Yup.string().required(t("text.reqFirstName")),
        lName: Yup.string().required(t("text.reqLastName")),
        genderID: Yup.number().required(t("text.reqGender")).min(1, t("text.reqGender")),
        dob: Yup.date().required(t("text.reqDOB")).nullable(),
        eMail: Yup.string().email(t("text.invalidEmail")).nullable(),
        curAddress: Yup.string().required("Address is required"),
        curPinCode: Yup.string()
            .required("PinCode is required")
            .matches(/^[1-9][0-9]{5}$/, "Invalid PinCode"),
        curMobileNo: Yup.string()
            .required("Mobile Number is required")
            .matches(/^[6-9]\d{9}$/, "Invalid Mobile Number"),
        vUniqueID: Yup.number()
            .required("Document Type is required")
            .min(1, "Document Type is required"),
        vUniqueName: Yup.string().required("Document Number is required"),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const formatDateWithTimezone = (date: any) => {
                if (!date) return null;
                const d = new Date(date);
                const tzOffset = d.getTimezoneOffset();
                const adjustedDate = new Date(d.getTime() - (tzOffset * 60 * 1000));
                return adjustedDate.toISOString().replace('Z', '+05:30');
            };

            const payload = {
                ...values,
                
                // Convert IDs to numbers
                genderID: Number(values.genderID),
                civilStatusID: Number(values.civilStatusID),
                bGroupID: Number(values.bGroupID),
                religionID: Number(values.religionID),
                nationalityID: Number(values.nationalityID),
                
                curStateID: Number(values.curStateID),
                curDistrictID: Number(values.curDistrictID),
                curCountryID: Number(values.curCountryID),
                
                perStateID: Number(values.perStateID),
                perDistrictID: Number(values.perDistrictID),
                perCountryID: Number(values.perCountryID),
                
                // Mobile CC - remove + sign if present
                curMobileNoCC: values.curMobileNoCC?.replace('+', '') || "91",
                perMobileNoCC: values.perMobileNoCC?.replace('+', '') || "",
                
                // Date format with timezone
                dob: formatDateWithTimezone(values.dob),
                passIssueDate: formatDateWithTimezone(values.passIssueDate),
                
                // Ensure arrays are properly formatted
                lstType_Patient: lstType_Patient.map(item => ({
                    ...item,
                    col1: String(item.col1),
                    col2: String(item.col2),
                    col9: String(item.col9),
                    col4: item.col4 || "+91",
                    col6: item.col6 || "0512"
                })),
                
                istType_Pat: istType_Pat.map(item => ({
                    ...item,
                    col1: String(item.col1),
                    col2: String(item.col2),
                    col9: String(item.col9),
                    col4: item.col4 || "+91",
                    col6: item.col6 || "0512"
                })),
                
                // Phone AC fields
                curPhoneAC: values.curPhoneAC || "0",
                perPhoneAC: values.perPhoneAC || "0",
                
                // Clean pincode
                perPinCode: String(values.perPinCode || "").replace(/\D/g, ""),
                
                // Document fields
                uidDocName: patientDocUpload?.uidDocName || values.uidDocName || "",
                uidDocExt: patientDocUpload?.uidDocExt || values.uidDocExt || "",
                uidDocID: patientDocUpload?.uidDocID || values.uidDocID || 0,
                
                // Ensure these fields are proper
                vUniqueID: String(values.vUniqueID),
                vUniqueName: String(values.vUniqueName || ""),
                
                // Fixed fields for update
                patientID: patientID,
                type: 2,
                userID: -1,
                formID: -1,
            };
            
            console.log("Updating Payload:", payload);
            formik.setSubmitting(true);
            
            try {
                const response = await api.post(`AddUpdatePatient`, payload);
                formik.setSubmitting(false);
                
                if (response.data.isSuccess) {
                    toast.success(response.data.msg || "Patient updated successfully!", { autoClose: 2000 });
                    setTimeout(() => {
                        navigate('/Patient/PatientRegistration');
                    }, 2000);
                } else {
                    toast.error(response.data.msg || "Update failed. Please try again.");
                }
            } catch (error: any) {
                formik.setSubmitting(false);
                console.error("API Error:", error);
                const errorMsg = error?.response?.data?.msg || error?.response?.data?.Message || "An error occurred during submission.";
                toast.error(errorMsg);
            }
        },
    });

    // --- API Calls ---
    const getGender = async () => {
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

    const getCountry = async () => {
        try {
            const res = await api.post(`Common/GetCountry?CountryID=-1&Type=1`);
            const data = res?.data || [];
            const arr = (Array.isArray(data) ? data : [data])
                .filter((item: any) => item && item.countryID != null)
                .map((item: any) => ({
                    label: item.countryName,
                    value: item.countryID,
                }));
            setCountryOptions(arr);
            
            const nationalityArr = (Array.isArray(data) ? data : [data])
                .filter((item: any) => item && item.countryID != null)
                .map((item: any) => ({
                    label: item.nationality,
                    value: item.countryID,
                }));
            setNationalityOptions(nationalityArr);
        } catch (error) {
            console.error("Error fetching countries:", error);
            toast.error("Failed to load countries.");
        }
    };

    const getState = async (countryId: number | string = 1, isPermanent: boolean = false) => {
        if (!countryId) {
            if (isPermanent) setPermanentStateOptions([]);
            else setStateOptions([]);
            return;
        }
        try {
            const res = await api.post(
                `Common/GetState?CountryID=${countryId}&StateID=-1&Type=1`
            );
            const data = res?.data || [];
            const arr = data.map((item: any) => ({
                label: item.stateName,
                value: item.stateID,
            }));
            if (isPermanent) {
                setPermanentStateOptions(arr);
            } else {
                setStateOptions(arr);
            }
        } catch (error) {
            console.error(`Error fetching states:`, error);
            toast.error("Failed to load states.");
            if (isPermanent) setPermanentStateOptions([]);
            else setStateOptions([]);
        }
    };

    const getDistrict = async (stateId: number | string, isPermanent: boolean = false) => {
        if (!stateId) {
            if (isPermanent) setPermanentDistrictOptions([]);
            else setDistrictOptions([]);
            return;
        }
        try {
            const res = await api.post(
                `Common/GetDistrict?&StateID=${stateId}&DistrictID=-1&Type=1`
            );
            const data = res?.data || [];
            const arr = data.map((item: any) => ({
                label: item.districtName,
                value: item.districtID,
            }));
            if (isPermanent) {
                setPermanentDistrictOptions(arr);
            } else {
                setDistrictOptions(arr);
            }
        } catch (error) {
            console.error(`Error fetching districts:`, error);
            toast.error("Failed to load districts.");
            if (isPermanent) setPermanentDistrictOptions([]);
            else setDistrictOptions([]);
        }
    };

    const getDocument = async () => {
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

    const getCivilStatus = async () => {
        try {
            const res = await api.post(`MasterForm/api/GetCivilStatus`, {
                civilStatusID: -1,
                type: -1,
            });
            const data = res?.data?.result || [];
            const arr = data.map((item: any) => ({
                label: item.civilStatusName,
                value: Number(item.civilStatusID),
            }));
            setCivilStatusOptions(arr);
        } catch (error) {
            console.error("Error fetching civil status:", error);
            toast.error("Failed to load civil status");
        }
    };

    const getBloodGroup = async () => {
        try {
            const res = await api.post(`MasterForm/api/GetBloodGroup`, {
                bGroupID: -1,
                type: -1,
            });
            const data = res?.data?.result || [];
            const arr = data.map((item: any) => ({
                label: item.bGroupName,
                value: Number(item.bGroupID),
            }));
            setBloodGroupOptions(arr);
        } catch (error) {
            console.error("Error fetching blood groups:", error);
            toast.error("Failed to load blood groups");
        }
    };

    const getReligion = async () => {
        try {
            const res = await api.post(`MasterForm/api/GetReligion`, {
                religionID: -1,
                type: -1,
            });
            const data = res?.data?.result || [];
            const arr = data.map((item: any) => ({
                label: item.religionName,
                value: Number(item.religionID),
            }));
            setReligionOptions(arr);
        } catch (error) {
            console.error("Error fetching religions:", error);
            toast.error("Failed to load religions");
        }
    };

    const getRelation = async () => {
        try {
            const res = await api.post(`MasterForm/api/GetRelation`, {
                relationID: -1,
                type: -1,
            });
            const data = res?.data?.result || [];
            const arr = data.map((item: any) => ({
                label: item.relationName,
                value: Number(item.relationID),
            }));
            setRelationOptions(arr);
        } catch (error) {
            console.error("Error fetching relations:", error);
            toast.error("Failed to load relations");
        }
    };

    // --- Get Patient Data ---
    const getPatient = async (patientId: any) => {
        if (!patientId) {
            toast.error("No Patient ID provided for editing.");
            navigate('/Patient/PatientRegistration');
            return;
        }
        
        setIsLoading(true);
        setIsDataLoaded(false);

        const collectData = {
            patientNo: "",
            patientUIDNo: "",
            ageGreater: 0,
            genderID: -1,
            civilStatusID: -1,
            bloodGroupID: -1,
            nationalityID: -1,
            serviceTypeID: -1,
            patientName: "",
            patientMobileNo: "",
            patientPhoneNo: "",
            patientDOB: "1900-01-01",
            fromDate: "1900-01-01",
            toDate: new Date().toISOString(),
            isDeleted: false,
            userID: -1,
            formID: -1,
            type: 2,
            patientID: patientId || ""
        };

        try {
            const res = await api.post(`GetPatientSearch`, collectData);

            if (res.data && res.data.isSuccess && res.data.result && res.data.result1 && res.data.result2) {
                const patientCore = res.data.result?.[0];
                const patientAddress = res.data.result1?.[0];
                const patientFiles = res.data.result2?.[0];

                if (!patientCore || !patientAddress) {
                    toast.error("Incomplete patient data received from API.");
                    setIsLoading(false);
                    return;
                }

                // Prepare data for Formik
                const formData: any = { ...initialValues };

                // Map Core Details
                formData.fName = patientCore.fName || "";
                formData.mName = patientCore.mName || "";
                formData.lName = patientCore.lName || "";
                formData.genderID = patientCore.genderID || "";
                formData.fatherName = patientCore.fatherName || "";
                formData.motherName = patientCore.motherName || "";
                formData.dob = patientCore.dob ? patientCore.dob.split('T')[0] : "";
                formData.vUniqueID = patientCore.vUniqueID || "";
                formData.vUniqueName = patientCore.vUniqueName || "";
                formData.isVIP = patientCore.isVIP || false;
                formData.birthPlace = patientCore.birthPlace || "";
                formData.civilStatusID = patientCore.civilStatusID || "";
                formData.religionID = patientCore.religionID || "";
                formData.nationalityID = patientCore.nationalityID || "";
                formData.bGroupID = patientCore.bGroupID || "";
                formData.patientNo = patientCore.patientNo || "";
                formData.patientID = patientCore.patientID || patientId;

                // Map Address Details
                formData.curHouseNo = patientAddress.curHouseNo || "";
                formData.curAddress = patientAddress.curAddress || "";
                formData.curVillageName = patientAddress.curVillageName || "";
                formData.curTehsilName = patientAddress.curTehsilName || "";
                formData.curPinCode = patientAddress.curPinCode || "";
                formData.curCountryID = patientAddress.curCountryID || "";
                formData.curStateID = patientAddress.curStateID || "";
                formData.curDistrictID = patientAddress.curDistrictID || "";
                formData.curMobileNo = patientAddress.curMobileNo || "";
                formData.curMobileNoCC = patientAddress.curMobileNoCC || "91";
                formData.curPhoneNo = patientAddress.curPhoneNo || "";
                formData.curPhoneCC = patientAddress.curPhoneCC || "0512";
                formData.eMail = patientAddress.eMail || "";
                formData.alternateEmail = patientAddress.alternateEmail || "";
                formData.perHouseNo = patientAddress.perHouseNo || "";
                formData.perAddress = patientAddress.perAddress || "";
                formData.perVillageName = patientAddress.perVillageName || "";
                formData.perTehsilName = patientAddress.perTehsilName || "";
                formData.perPinCode = patientAddress.perPinCode || "";
                formData.perCountryID = patientAddress.perCountryID || "";
                formData.perStateID = patientAddress.perStateID || "";
                formData.perDistrictID = patientAddress.perDistrictID || "";
                formData.perMobileNo = patientAddress.perMobileNo || "";
                formData.perMobileNoCC = patientAddress.perMobileNoCC || "";
                formData.perPhoneNo = patientAddress.perPhoneNo || "";
                formData.perPhoneCC = patientAddress.perPhoneCC || "";
                formData.passIssueDate = patientAddress.passportIssueDate ? patientAddress.passportIssueDate.split('T')[0] : "";
                formData.passIssuePlace = patientAddress.passportIssuePlace || "";
                formData.uidDocName = patientAddress.uidDocName || "";
                formData.uidDocExt = patientAddress.uidDocExt || "";
                formData.uidDocID = patientAddress.uidDocID || 0;

                // Map File Details
                const formatBase64 = (data: string | null, mimeType: string): string | null => {
                    if (!data) return null;
                    if (data.startsWith(`data:${mimeType};base64,`)) return data;
                    return `data:${mimeType};base64,${data}`;
                };
                
                formData.photo = formatBase64(patientFiles?.photo, 'image/jpeg');
                formData.signature = formatBase64(patientFiles?.signature, 'image/png');
                formData.uidDocFile = patientFiles?.uidDocFile || "";

                // Map Family Data
                const dataMaskForFamily = res.data?.result3?.map((item: any, index: number) => ({
                    col1: item.relationID || "",
                    col2: String(item.contactSerialNo || index + 1),
                    col3: item.contactName || "",
                    col4: item.contactMobileNoCC || "+91",
                    col5: item.contactMobileNo || "",
                    col6: item.contactPhoneCC || "0512",
                    col7: "",
                    col8: item.contactPhoneNo || "",
                    col9: item.bGroupID || "",
                    col10: "",
                    col11: "",
                    col12: "",
                    col13: "",
                    col14: "",
                    col15: "",
                }));
                const familyData = dataMaskForFamily?.filter((item: any) => item.col3 !== "") || [];
                setLstType_Patient(familyData);

                // Map Emergency Data
                const dataMaskForEmergency = res.data?.result4?.map((item: any, index: number) => ({
                    col1: item.relationID || "",
                    col2: String(item.contactSerialNo || index + 1),
                    col3: item.contactName || "",
                    col4: item.contactMobileNoCC || "+91",
                    col5: item.contactMobileNo || "",
                    col6: item.contactPhoneCC || "0512",
                    col7: "",
                    col8: item.contactPhoneNo || "",
                    col9: item.bGroupID || "",
                    col10: "",
                    col11: "",
                    col12: "",
                    col13: "",
                    col14: "",
                    col15: "",
                }));
                const emergencyData = dataMaskForEmergency?.filter((item: any) => item.col3 !== "") || [];
                setIstType_Pat(emergencyData);

                // Set Formik Values
                await formik.setValues(formData);

                // Set Previews
                if (formData.photo) setPhotoPreview(formData.photo);
                if (formData.signature) setSignaturePreview(formData.signature);
                if (formData.uidDocName) {
                    setDocumentFileNamePreview(formData.uidDocName + (formData.uidDocExt ? `.${formData.uidDocExt}` : ''));
                }

                // Fetch dependent dropdowns
                const validCurCountryId = formData.curCountryID && formData.curCountryID > 0 ? formData.curCountryID : null;
                const validCurStateId = formData.curStateID && formData.curStateID > 0 ? formData.curStateID : null;
                if (validCurCountryId) {
                    await getState(validCurCountryId, false);
                    if (validCurStateId) {
                        await getDistrict(validCurStateId, false);
                    }
                }

                // Handle Permanent Address
                const hasPermanentAddress = !!(formData.perAddress || formData.perCountryID > 0);
                const isSame = formData.curAddress === formData.perAddress &&
                               formData.curCountryID === formData.perCountryID &&
                               formData.curStateID === formData.perStateID &&
                               formData.curDistrictID === formData.perDistrictID &&
                               formData.curPinCode === formData.perPinCode;

                if (hasPermanentAddress) {
                    setIsPermanentAddressOpen(true);
                    setSameAsCurrent(isSame);
                    const validPerCountryId = formData.perCountryID && formData.perCountryID > 0 ? formData.perCountryID : null;
                    const validPerStateId = formData.perStateID && formData.perStateID > 0 ? formData.perStateID : null;
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

                setIsDataLoaded(true);
            } else {
                toast.error(res.data?.msg || "Failed to fetch patient data.");
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
        getGender();
        getCountry();
        getDocument();
        getCivilStatus();
        getBloodGroup();
        getReligion();
        getRelation();
        getState();

        if (patientID) {
            getPatient(patientID);
        } else {
            toast.error("No Patient ID found for editing.");
            navigate('/Patient/PatientRegistration');
        }
    }, [patientID]);

    // --- Event Handlers with useCallback for stability ---
    const handlePermanentAddressToggle = useCallback(() => {
        setIsPermanentAddressOpen(prev => !prev);
    }, []);

    const handleSameAsCurrentChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setSameAsCurrent(isChecked);
        
        if (isChecked) {
            formik.setFieldValue("perHouseNo", formik.values.curHouseNo);
            formik.setFieldValue("perAddress", formik.values.curAddress);
            formik.setFieldValue("perVillageName", formik.values.curVillageName);
            formik.setFieldValue("perTehsilName", formik.values.curTehsilName);
            formik.setFieldValue("perPinCode", formik.values.curPinCode);
            formik.setFieldValue("perStateID", formik.values.curStateID);
            formik.setFieldValue("perDistrictID", formik.values.curDistrictID);
            formik.setFieldValue("perCountryID", formik.values.curCountryID);
            formik.setFieldValue("perMobileNoCC", formik.values.curMobileNoCC);
            formik.setFieldValue("perMobileNo", formik.values.curMobileNo);
            formik.setFieldValue("perPhoneCC", formik.values.curPhoneCC);
            formik.setFieldValue("perPhoneNo", formik.values.curPhoneNo);
            
            if (formik.values.curCountryID) {
                getState(formik.values.curCountryID, true);
                if (formik.values.curStateID) {
                    getDistrict(formik.values.curStateID, true);
                }
            }
        } else {
            formik.setFieldValue("perHouseNo", "");
            formik.setFieldValue("perAddress", "");
            formik.setFieldValue("perVillageName", "");
            formik.setFieldValue("perTehsilName", "");
            formik.setFieldValue("perPinCode", "");
            formik.setFieldValue("perStateID", "");
            formik.setFieldValue("perDistrictID", "");
            formik.setFieldValue("perCountryID", "");
            formik.setFieldValue("perMobileNoCC", "");
            formik.setFieldValue("perMobileNo", "");
            formik.setFieldValue("perPhoneCC", "");
            formik.setFieldValue("perPhoneNo", "");
        }
    }, [formik.values.curHouseNo, formik.values.curAddress, formik.values.curVillageName, formik.values.curTehsilName, formik.values.curPinCode, formik.values.curStateID, formik.values.curDistrictID, formik.values.curCountryID, formik.values.curMobileNoCC, formik.values.curMobileNo, formik.values.curPhoneCC, formik.values.curPhoneNo]);

    const handleEmergencyChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setSameEmergency(isChecked);
        
        if (isChecked) {
            const newEmergencyItems = lstType_Patient.map((item: FamilyMember, index: number) => ({
                col1: item.col1,
                col2: String(istType_Pat.length + index + 1),
                col3: item.col3,
                col4: item.col4,
                col5: item.col5,
                col6: item.col6,
                col7: item.col7,
                col8: item.col8,
                col9: item.col9,
                col10: "",
                col11: "",
                col12: "",
                col13: "",
                col14: "",
                col15: "",
            }));
            setIstType_Pat(prev => [...prev, ...newEmergencyItems]);
            toast.success("Family Information से Emergency Contact में सभी members copy हो गए");
        } else {
            setIstType_Pat([]);
        }
    }, [lstType_Patient, istType_Pat.length]);

    const handleFamilyValueChange = useCallback((field: string, value: any) => {
        setFamilyFormValues(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleEmergencyValueChange = useCallback((field: string, value: any) => {
        setEmergencyFormValues(prev => ({ ...prev, [field]: value }));
    }, []);

    const addFamilyItem = useCallback(() => {
        if (!familyFormValues.col3) {
            toast.error("Please enter Contact Name");
            return;
        }
        
        const family: FamilyMember = {
            col1: familyFormValues.col1 || "",
            col2: String(lstType_Patient.length + 1),
            col3: familyFormValues.col3 || "",
            col4: familyFormValues.col4 || "+91",
            col5: familyFormValues.col5 || "",
            col6: familyFormValues.col6 || "0512",
            col7: "",
            col8: familyFormValues.col8 || "",
            col9: familyFormValues.col9 || "",
            col10: "",
            col11: "",
            col12: "",
            col13: "",
            col14: "",
            col15: "",
        };
        
        setLstType_Patient(prev => [...prev, family]);
        setFamilyFormValues({
            col1: "",
            col3: "",
            col4: "+91",
            col5: "",
            col6: "0512",
            col8: "",
            col9: "",
        });
    }, [familyFormValues, lstType_Patient.length]);

    const addEmergencyItem = useCallback(() => {
        if (!emergencyFormValues.col3) {
            toast.error("Please enter Contact Name");
            return;
        }
        
        const emergency: FamilyMember = {
            col1: emergencyFormValues.col1 || "",
            col2: String(istType_Pat.length + 1),
            col3: emergencyFormValues.col3 || "",
            col4: emergencyFormValues.col4 || "+91",
            col5: emergencyFormValues.col5 || "",
            col6: emergencyFormValues.col6 || "0512",
            col7: "",
            col8: emergencyFormValues.col8 || "",
            col9: emergencyFormValues.col9 || "",
            col10: "",
            col11: "",
            col12: "",
            col13: "",
            col14: "",
            col15: "",
        };
        
        setIstType_Pat(prev => [...prev, emergency]);
        setEmergencyFormValues({
            col1: "",
            col3: "",
            col4: "+91",
            col5: "",
            col6: "0512",
            col8: "",
            col9: "",
        });
    }, [emergencyFormValues, istType_Pat.length]);

    const handleDeleteFamily = useCallback((key: string) => {
        setLstType_Patient(prev => prev.filter((item) => item.col2 !== key));
    }, []);

    const handleDeleteEmergency = useCallback((key: string) => {
        setIstType_Pat(prev => prev.filter((item) => item.col2 !== key));
    }, []);

    const handleDocTypeSelect = useCallback((value: any) => {
        setSelectedDoc(value);
    }, []);

    const getBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileChange = useCallback(async (
        event: React.ChangeEvent<HTMLInputElement>,
        fieldName: "photo" | "signature" | "uidDocFile"
    ) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) {
            formik.setFieldValue(fieldName, "");
            if (fieldName === "photo") setPhotoPreview(null);
            else if (fieldName === "signature") setSignaturePreview(null);
            else if (fieldName === "uidDocFile") setDocumentFileNamePreview(null);
            return;
        }

        const maxSize = fieldName === "uidDocFile" ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error(`File size exceeds the limit of ${maxSize / (1024 * 1024)}MB.`);
            return;
        }

        if (fieldName === "uidDocFile") {
            setIsProcessingFile(true);
            setDocumentFileNamePreview(`Processing: ${file.name}`);
        }

        try {
            const base64String = await getBase64(file);
            formik.setFieldValue(fieldName, base64String);

            if (fieldName === "photo") {
                setPhotoPreview(base64String);
            } else if (fieldName === "signature") {
                setSignaturePreview(base64String);
            } else if (fieldName === "uidDocFile") {
                const ext = file.name.split('.').pop() || '';
                const name = file.name.substring(0, file.name.lastIndexOf('.'));
                setDocumentFileNamePreview(file.name);
                setPatientDocUpload({
                    uidDocID: Date.now(),
                    uidDocExt: ext,
                    uidDocName: name,
                });
                setModalContent({
                    name: file.name,
                    type: file.type,
                    data: base64String,
                });
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Error processing file:", error);
            toast.error("Could not process file.");
            formik.setFieldValue(fieldName, "");
            if (fieldName === "photo") setPhotoPreview(null);
            else if (fieldName === "signature") setSignaturePreview(null);
            else if (fieldName === "uidDocFile") {
                setDocumentFileNamePreview(null);
                setPatientDocUpload(undefined);
            }
        } finally {
            if (fieldName === "uidDocFile") {
                setIsProcessingFile(false);
            }
        }
    }, []);

    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    // --- Render ---
    return (
        <>
            <ToastContainer />
            <Card sx={{ width: "100%", backgroundColor: "#E9FDEE", border: ".5px solid #2B4593", marginTop: "3vh", position: 'relative' }}>
                <Paper sx={{ width: "100%", overflow: "hidden", padding: "10px" }}>
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
                            zIndex: 10
                        }}>
                            <CircularProgress />
                            <Typography sx={{ ml: 2 }}>Loading Patient Data...</Typography>
                        </Box>
                    )}

                    {/* Header */}
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={4} xs={4}>
                            <Button onClick={() => navigate(-1)} variant="outlined" size="small">
                                Back
                            </Button>
                        </Grid>
                        <Grid item lg={8} md={8} xs={8}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
                                    <ManageAccountsIcon />
                                </Avatar>
                                <Typography variant="h5" fontWeight={700} color="text.primary" component="div" sx={{ padding: "20px" }} align="left">
                                    Update Patient Registration
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Box height={10} />

                    <form onSubmit={formik.handleSubmit}>
                        {/* Patient Details Section */}
                        <Box sx={{ backgroundColor: "#004080", color: "white", padding: 1, mb: 2, mt: 2 }}>
                            <Typography variant="h6">Patient Details</Typography>
                        </Box>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    label={t("text.FirstName") + " *"}
                                    name="fName"
                                    value={formik.values.fName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.fName && Boolean(formik.errors.fName)}
                                    helperText={formik.touched.fName && formik.errors.fName}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    label={t("text.MiddleName")}
                                    name="mName"
                                    value={formik.values.mName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    label={t("text.LastName") + " *"}
                                    name="lName"
                                    value={formik.values.lName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.lName && Boolean(formik.errors.lName)}
                                    helperText={formik.touched.lName && formik.errors.lName}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    label={t("text.FatherName")}
                                    name="fatherName"
                                    value={formik.values.fatherName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    label={t("text.MotherName")}
                                    name="motherName"
                                    value={formik.values.motherName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth size="small" error={formik.touched.genderID && Boolean(formik.errors.genderID)}>
                                    <InputLabel>{t("text.Gender") + " *"}</InputLabel>
                                    <Select
                                        name="genderID"
                                        value={formik.values.genderID}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        label={t("text.Gender") + " *"}
                                    >
                                        <MenuItem value={0}>Select</MenuItem>
                                        {genderOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.genderID && formik.errors.genderID && (
                                        <FormHelperText>{formik.errors.genderID}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    label={t("text.DOB") + " *"}
                                    name="dob"
                                    type="date"
                                    value={formik.values.dob}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.dob && Boolean(formik.errors.dob)}
                                    helperText={formik.touched.dob && formik.errors.dob}
                                    variant="outlined"
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    fullWidth
                                    label={t("text.Email")}
                                    name="eMail"
                                    type="email"
                                    value={formik.values.eMail}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.eMail && Boolean(formik.errors.eMail)}
                                    helperText={formik.touched.eMail && formik.errors.eMail}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                        </Grid>

                        {/* More Information Collapse */}
                        <Collapse in={true}>
                            <Box sx={{ backgroundColor: "#004080", color: "white", padding: 1, mb: 2, mt: 1 }}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Typography variant="h6">More Information</Typography>
                                    <KeyboardArrowRightIcon />
                                </Box>
                            </Box>
                            <Grid container spacing={2} sx={{ mb: 2, p: 2 }}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Marital Status</InputLabel>
                                        <Select
                                            name="civilStatusID"
                                            value={formik.values.civilStatusID}
                                            onChange={formik.handleChange}
                                            label="Marital Status"
                                        >
                                            <MenuItem value="">Select</MenuItem>
                                            {civilStatusOptions.map((opt) => (
                                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Alternate Email"
                                        name="alternateEmail"
                                        type="email"
                                        value={formik.values.alternateEmail}
                                        onChange={formik.handleChange}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Blood Group</InputLabel>
                                        <Select
                                            name="bGroupID"
                                            value={formik.values.bGroupID}
                                            onChange={formik.handleChange}
                                            label="Blood Group"
                                        >
                                            <MenuItem value="">Select</MenuItem>
                                            {bloodGroupOptions.map((opt) => (
                                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Religion</InputLabel>
                                        <Select
                                            name="religionID"
                                            value={formik.values.religionID}
                                            onChange={formik.handleChange}
                                            label="Religion"
                                        >
                                            <MenuItem value="">Select</MenuItem>
                                            {religionOptions.map((opt) => (
                                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Nationality</InputLabel>
                                        <Select
                                            name="nationalityID"
                                            value={formik.values.nationalityID}
                                            onChange={formik.handleChange}
                                            label="Nationality"
                                        >
                                            <MenuItem value="">Select</MenuItem>
                                            {nationalityOptions.map((opt) => (
                                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Birth Place"
                                        name="birthPlace"
                                        value={formik.values.birthPlace}
                                        onChange={formik.handleChange}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </Collapse>

                        <Divider />

                        {/* Current Address Section */}
                        <Box sx={{ backgroundColor: "#004080", color: "white", padding: 1, mb: 2, mt: 2 }}>
                            <Typography variant="h6">Current Address</Typography>
                        </Box>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label={t("text.HouseNo")}
                                    name="curHouseNo"
                                    value={formik.values.curHouseNo}
                                    onChange={formik.handleChange}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label={t("text.Address") + " *"}
                                    name="curAddress"
                                    value={formik.values.curAddress}
                                    onChange={formik.handleChange}
                                    error={formik.touched.curAddress && Boolean(formik.errors.curAddress)}
                                    helperText={formik.touched.curAddress && formik.errors.curAddress}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label={t("text.Village")}
                                    name="curVillageName"
                                    value={formik.values.curVillageName}
                                    onChange={formik.handleChange}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label={t("text.Tehsil")}
                                    name="curTehsilName"
                                    value={formik.values.curTehsilName}
                                    onChange={formik.handleChange}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label={t("text.PinCode") + " *"}
                                    name="curPinCode"
                                    value={formik.values.curPinCode}
                                    onChange={formik.handleChange}
                                    error={formik.touched.curPinCode && Boolean(formik.errors.curPinCode)}
                                    helperText={formik.touched.curPinCode && formik.errors.curPinCode}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Country</InputLabel>
                                    <Select
                                        name="curCountryID"
                                        value={formik.values.curCountryID}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                            formik.setFieldValue("curStateID", 0);
                                            formik.setFieldValue("curDistrictID", 0);
                                            if (e.target.value) getState(e.target.value, false);
                                        }}
                                        label="Country"
                                    >
                                        <MenuItem value={0}>Select</MenuItem>
                                        {countryOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth size="small" disabled={!formik.values.curCountryID}>
                                    <InputLabel>State</InputLabel>
                                    <Select
                                        name="curStateID"
                                        value={formik.values.curStateID}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                            formik.setFieldValue("curDistrictID", 0);
                                            if (e.target.value) getDistrict(e.target.value, false);
                                        }}
                                        label="State"
                                    >
                                        <MenuItem value={0}>Select</MenuItem>
                                        {stateOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth size="small" disabled={!formik.values.curStateID}>
                                    <InputLabel>District</InputLabel>
                                    <Select
                                        name="curDistrictID"
                                        value={formik.values.curDistrictID}
                                        onChange={formik.handleChange}
                                        label="District"
                                    >
                                        <MenuItem value={0}>Select</MenuItem>
                                        {districtOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    label={t("text.MobileNumber") + " *"}
                                    name="curMobileNo"
                                    value={formik.values.curMobileNo}
                                    onChange={formik.handleChange}
                                    error={formik.touched.curMobileNo && Boolean(formik.errors.curMobileNo)}
                                    helperText={formik.touched.curMobileNo && formik.errors.curMobileNo}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <TextField
                                                    size="small"
                                                    name="curMobileNoCC"
                                                    value={formik.values.curMobileNoCC}
                                                    onChange={formik.handleChange}
                                                    sx={{ width: 60, mr: 1 }}
                                                    placeholder="+91"
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="curPhoneNo"
                                    value={formik.values.curPhoneNo}
                                    onChange={formik.handleChange}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <TextField
                                                    size="small"
                                                    name="curPhoneCC"
                                                    value={formik.values.curPhoneCC}
                                                    onChange={formik.handleChange}
                                                    sx={{ width: 70, mr: 1 }}
                                                    placeholder="STD"
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>

                        {/* Permanent Address Section */}
                        <Box mt={2} display="flex" alignItems="center">
                            <Button onClick={handlePermanentAddressToggle} sx={{ textTransform: "none" }}>
                                {isPermanentAddressOpen ? "Hide" : "Show"} Permanent Address
                            </Button>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={sameAsCurrent}
                                        onChange={handleSameAsCurrentChange}
                                        disabled={!isPermanentAddressOpen}
                                    />
                                }
                                label="Same As Current Address"
                                sx={{ ml: 2 }}
                            />
                        </Box>
                        <Collapse in={isPermanentAddressOpen} timeout="auto" unmountOnExit>
                            <Box sx={{ backgroundColor: "#f5f5f5", padding: 2, mt: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label={t("text.HouseNo")}
                                            name="perHouseNo"
                                            value={formik.values.perHouseNo}
                                            onChange={formik.handleChange}
                                            variant="outlined"
                                            size="small"
                                            disabled={sameAsCurrent}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label={t("text.Address")}
                                            name="perAddress"
                                            value={formik.values.perAddress}
                                            onChange={formik.handleChange}
                                            variant="outlined"
                                            size="small"
                                            disabled={sameAsCurrent}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label={t("text.Village")}
                                            name="perVillageName"
                                            value={formik.values.perVillageName}
                                            onChange={formik.handleChange}
                                            variant="outlined"
                                            size="small"
                                            disabled={sameAsCurrent}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label={t("text.Tehsil")}
                                            name="perTehsilName"
                                            value={formik.values.perTehsilName}
                                            onChange={formik.handleChange}
                                            variant="outlined"
                                            size="small"
                                            disabled={sameAsCurrent}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label={t("text.PinCode")}
                                            name="perPinCode"
                                            value={formik.values.perPinCode}
                                            onChange={formik.handleChange}
                                            variant="outlined"
                                            size="small"
                                            disabled={sameAsCurrent}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <FormControl fullWidth size="small" disabled={sameAsCurrent}>
                                            <InputLabel>Country</InputLabel>
                                            <Select
                                                name="perCountryID"
                                                value={formik.values.perCountryID}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    formik.setFieldValue("perStateID", 0);
                                                    formik.setFieldValue("perDistrictID", 0);
                                                    if (e.target.value) getState(e.target.value, true);
                                                }}
                                                label="Country"
                                            >
                                                <MenuItem value={0}>Select</MenuItem>
                                                {countryOptions.map((opt) => (
                                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <FormControl fullWidth size="small" disabled={sameAsCurrent || !formik.values.perCountryID}>
                                            <InputLabel>State</InputLabel>
                                            <Select
                                                name="perStateID"
                                                value={formik.values.perStateID}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    formik.setFieldValue("perDistrictID", 0);
                                                    if (e.target.value) getDistrict(e.target.value, true);
                                                }}
                                                label="State"
                                            >
                                                <MenuItem value={0}>Select</MenuItem>
                                                {permanentStateOptions.map((opt) => (
                                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <FormControl fullWidth size="small" disabled={sameAsCurrent || !formik.values.perStateID}>
                                            <InputLabel>District</InputLabel>
                                            <Select
                                                name="perDistrictID"
                                                value={formik.values.perDistrictID}
                                                onChange={formik.handleChange}
                                                label="District"
                                            >
                                                <MenuItem value={0}>Select</MenuItem>
                                                {permanentDistrictOptions.map((opt) => (
                                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Collapse>

                        {/* Family Information Section */}
                        <Box sx={{ backgroundColor: "#004080", color: "white", padding: 1, mb: 2, mt: 2 }}>
                            <Typography variant="h6">Family Information</Typography>
                        </Box>
                        <FamilyForm 
                            values={familyFormValues}
                            onValueChange={handleFamilyValueChange}
                            onSubmit={addFamilyItem}
                            relationOptions={relationOptions}
                            bloodGroupOptions={bloodGroupOptions}
                        />
                        <FamilyTable 
                            data={lstType_Patient} 
                            onDelete={handleDeleteFamily}
                            relationOptions={relationOptions}
                            bloodGroupOptions={bloodGroupOptions}
                        />

                        {/* Emergency Contact Section */}
                        <Box sx={{ backgroundColor: "#004080", color: "white", padding: 1, mb: 2, mt: 2 }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Typography variant="h6">Emergency Contact</Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={sameEmergency}
                                            onChange={handleEmergencyChange}
                                            sx={{ color: "white" }}
                                        />
                                    }
                                    label="Copy from Family"
                                    sx={{ color: "white" }}
                                />
                            </Box>
                        </Box>
                        <FamilyForm 
                            values={emergencyFormValues}
                            onValueChange={handleEmergencyValueChange}
                            onSubmit={addEmergencyItem}
                            relationOptions={relationOptions}
                            bloodGroupOptions={bloodGroupOptions}
                        />
                        <FamilyTable 
                            data={istType_Pat} 
                            onDelete={handleDeleteEmergency}
                            relationOptions={relationOptions}
                            bloodGroupOptions={bloodGroupOptions}
                        />

                       







                        {/* Documents Section */}
                        <Box sx={{ backgroundColor: "#004080", color: "white", padding: 1, mb: 2, mt: 2 }}>
                            <Typography variant="h6">Documents</Typography>
                        </Box>
                        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth size="small" error={formik.touched.vUniqueID && Boolean(formik.errors.vUniqueID)}>
                                    <InputLabel>{t("text.DocumentType") + " *"}</InputLabel>
                                    <Select
                                        name="vUniqueID"
                                        value={formik.values.vUniqueID}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                            handleDocTypeSelect(e.target.value);
                                        }}
                                        onBlur={formik.handleBlur}
                                        label={t("text.DocumentType") + " *"}
                                    >
                                        <MenuItem value={0}>Select</MenuItem>
                                        {documentOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                        ))}
                                    </Select>
                                    {formik.touched.vUniqueID && formik.errors.vUniqueID && (
                                        <FormHelperText>{formik.errors.vUniqueID}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label="Document Number *"
                                    name="vUniqueName"
                                    value={formik.values.vUniqueName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.vUniqueName && Boolean(formik.errors.vUniqueName)}
                                    helperText={formik.touched.vUniqueName && formik.errors.vUniqueName}
                                    variant="outlined"
                                    size="small"
                                    disabled={selectedDoc == undefined || selectedDoc == 0}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label="Issue Date"
                                    name="passIssueDate"
                                    type="date"
                                    value={formik.values.passIssueDate}
                                    onChange={formik.handleChange}
                                    variant="outlined"
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label="Issue Place"
                                    name="passIssuePlace"
                                    value={formik.values.passIssuePlace}
                                    onChange={formik.handleChange}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box display="flex" flexDirection="column" alignItems="flex-start">
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        size="small"
                                        disabled={isProcessingFile}
                                        startIcon={<UploadIcon />}
                                    >
                                        {isProcessingFile ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                                        {formik.values.uidDocFile ? "Change Document" : "Upload Document File"}
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) => handleFileChange(e, "uidDocFile")}
                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                            disabled={isProcessingFile}
                                        />
                                    </Button>
                                    {formik.values.uidDocFile && formik.values.uidDocName && !isProcessingFile && (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="info"
                                            sx={{ mt: 1 }}
                                            onClick={() => {
                                                const ext = formik.values.uidDocExt?.toLowerCase() || '';
                                                let type = 'application/octet-stream';
                                                if (['jpg', 'jpeg'].includes(ext)) type = 'image/jpeg';
                                                else if (ext === 'png') type = 'image/png';
                                                else if (ext === 'pdf') type = 'application/pdf';
                                                
                                                setModalContent({
                                                    name: formik.values.uidDocName + (formik.values.uidDocExt ? `.${formik.values.uidDocExt}` : ''),
                                                    type: type,
                                                    data: formik.values.uidDocFile
                                                });
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            View Document
                                        </Button>
                                    )}
                                    {documentFileNamePreview && !isProcessingFile && (
                                        <Typography variant="caption" display="block" sx={{ mt: 0.5, wordBreak: "break-all" }}>
                                            {formik.values.uidDocFile ? "Current: " : "Selected: "} {documentFileNamePreview}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        {/* Photo & Signature Section */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Photo</Typography>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Button variant="outlined" component="label" size="small" startIcon={<UploadIcon />}>
                                        {photoPreview ? "Change" : "Upload"} Photo
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, "photo")}
                                        />
                                    </Button>
                                    {photoPreview && (
                                        <Avatar src={photoPreview} alt="Photo Preview" sx={{ width: 80, height: 80 }} variant="rounded" />
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Signature</Typography>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Button variant="outlined" component="label" size="small" startIcon={<UploadIcon />}>
                                        {signaturePreview ? "Change" : "Upload"} Signature
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, "signature")}
                                        />
                                    </Button>
                                    {signaturePreview && (
                                        <img
                                            src={signaturePreview}
                                            alt="Signature Preview"
                                            style={{
                                                maxHeight: "60px",
                                                maxWidth: "150px",
                                                border: "1px solid #ccc",
                                                padding: "2px",
                                                backgroundColor: "white",
                                            }}
                                        />
                                    )}
                                </Box>
                            </Grid>
                        </Grid>

                        {/* VIP Checkbox */}
                        <Box mt={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="isVIP"
                                        checked={formik.values.isVIP}
                                        onChange={formik.handleChange}
                                    />
                                }
                                label="VIP"
                            />
                        </Box>

                        {/* Submit Buttons */}
                        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={formik.isSubmitting || isProcessingFile || isLoading || !isDataLoaded}
                            >
                                {formik.isSubmitting ? "Updating..." : "Update"}
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate("/Patient/PatientRegistration")}
                                disabled={formik.isSubmitting || isLoading}
                            >
                                {t("text.Cancel")}
                            </Button>
                        </Box>
                    </form>

                    {/* Document Preview Modal */}
                    <Dialog onClose={handleModalClose} open={isModalOpen} maxWidth="md" fullWidth>
                        <DialogTitle sx={{ m: 0, p: 2 }}>
                            Document Preview
                            <IconButton
                                aria-label="close"
                                onClick={handleModalClose}
                                sx={{ position: "absolute", right: 8, top: 8 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            {modalContent.data && modalContent.type ? (
                                <>
                                    <Typography gutterBottom variant="subtitle1">
                                        Filename: {modalContent.name || "N/A"}
                                    </Typography>
                                    {modalContent.type.startsWith("image/") && (
                                        <Box sx={{ textAlign: "center", maxHeight: "70vh", overflow: "auto" }}>
                                            <img
                                                src={modalContent.data}
                                                alt="Document Preview"
                                                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                            />
                                        </Box>
                                    )}
                                    {modalContent.type === "application/pdf" && (
                                        <embed
                                            src={modalContent.data}
                                            type="application/pdf"
                                            width="100%"
                                            height="500px"
                                        />
                                    )}
                                    {!modalContent.type.startsWith("image/") && modalContent.type !== "application/pdf" && (
                                        <Typography sx={{ mt: 2 }}>
                                            Preview is not available for this file type ({modalContent.type}).
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