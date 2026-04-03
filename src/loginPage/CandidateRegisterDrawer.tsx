// import CloseIcon from "@mui/icons-material/Close";
// import React, { useEffect, useState } from "react";
// import {
//     Button,
//     CardContent,
//     Grid,
//     TextField,
//     Typography,
//     Box,
//     Autocomplete,
//     IconButton,
//     SwipeableDrawer,
//     CircularProgress
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { useFormik } from "formik";
// import { toast } from "react-toastify";
// import api from "../utils/Url";
// import * as Yup from 'yup';
// import ToastApp from "../ToastApp";

// interface Props {
//     open: boolean;
//     onClose: () => void;
// }

// export function CandidateRegisterDrawer({ open, onClose }: Props) {
//     const { t } = useTranslation();
//     const navigate = useNavigate();
//     const [gender, setGender] = useState([{ value: -1, label: t("text.genderID") }]);
//     const [showform, setShowform] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [registeredData, setRegisteredData] = useState<any>(null);

//     useEffect(() => {
//         if (open) {
//             // Reset everything when drawer opens
//             setShowform(true);
//             setRegisteredData(null);
//             setIsSubmitting(false);
//             formik.resetForm();
//         }
//     }, [open]);

//     useEffect(() => {
//         getGender();
//     }, []);

//     const getGender = async () => {
//         try {
//             const response = await api.get(`Common/Getgender`);
//             if (response.data?.data) {
//                 const data = response.data.data;
//                 const arr = data.map((item: any) => ({
//                     label: item["genderName"],
//                     value: item["genderID"],
//                 }));
//                 setGender(arr);
//             } else {
//                 setGender([]);
//             }
//         } catch (error) {
//             console.error("Error fetching gender:", error);
//             setGender([]);
//         }
//     };

//     const handleClose = () => {
//         formik.resetForm();
//         setShowform(true);
//         setRegisteredData(null);
//         setIsSubmitting(false);
//         onClose();
//     };

//     // Separate validation schemas for registration and OTP
//     const registrationValidationSchema = Yup.object({
//         fName: Yup.string().trim().required("First Name Is Required"),
//         lName: Yup.string().trim().required("Last Name Is Required"),
//         password: Yup.string().trim().required("Password Is Required").min(4, "Password must be at least 4 characters"),
//         curMobileNo: Yup.string()
//             .trim()
//             .required("Mobile No Is Required")
//             .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
//         eMail: Yup.string()
//             .trim()
//             .required("Email Is Required")
//             .email("Invalid email format"),
//         dob: Yup.date()
//             .required("DOB Is Required")
//             .max(new Date(), "Date of Birth cannot be in the future"),
//         genderID: Yup.string()
//             .required("Gender Is Required")
//             .test('is-not-default', "Gender Is Required", (value: any) => value && value !== "-1" && value !== 0),
//     });

//     const otpValidationSchema = Yup.object({
//         otp: Yup.string().required("OTP is required").min(4, "OTP must be at least 4 digits").max(6, "OTP must be at most 6 digits"),
//     });

//     const formik = useFormik({
//         initialValues: {
//             "onlinePatientID": 0,
//             "eMail": "",
//             "password": "",
//             "curMobileNoCC": "+91",
//             "curMobileNo": "",
//             "fName": "",
//             "mName": "",
//             "lName": "",
//             "genderID": "",
//             "fNameML": "",
//             "dob": "",
//             "nationalityID": 0,
//             "uniqueID": 0,
//             "uniqueName": "",
//             "curAddress": "",
//             "otp": "",
//             "userID": "-1",
//             "formID": -1,
//             "type": 1
//         },
//         validationSchema: showform ? registrationValidationSchema : otpValidationSchema,
//         enableReinitialize: true,
//         onSubmit: async (values, { setSubmitting, resetForm }) => {
//             if (showform) {
//                 await handleRegistration(values);
//             } else {
//                 await handleOTPVerification(values);
//             }
//             setSubmitting(false);
//         }
//     });

//     const handleRegistration = async (values: any) => {
//         setIsSubmitting(true);
//         try {
//             // Step 1: Create login (type: 1)
//             const registerPayload = {
//                 onlinePatientID: 0,
//                 eMail: values.eMail,
//                 password: values.password,
//                 curMobileNoCC: values.curMobileNoCC,
//                 curMobileNo: values.curMobileNo,
//                 fName: values.fName,
//                 mName: values.mName || "",
//                 lName: values.lName,
//                 genderID: values.genderID,
//                 fNameML: "",
//                 dob: values.dob,
//                 nationalityID: 0,
//                 uniqueID: 0,
//                 uniqueName: "",
//                 curAddress: "",
//                 otp: "",
//                 userID: "-1",
//                 formID: -1,
//                 type: 1
//             };

//             const registerResponse = await api.post(`/Online/AddOnlineLogin`, registerPayload);

//             if (registerResponse.data.isSuccess === true) {
//                 toast.success(registerResponse.data.msg || "Login created successfully!");

//                 // Store registered data
//                 const storedData = {
//                     eMail: values.eMail,
//                     curMobileNo: values.curMobileNo,
//                     password: values.password,
//                     fName: values.fName,
//                     mName: values.mName || "",
//                     lName: values.lName,
//                     genderID: values.genderID,
//                     dob: values.dob,
//                     curMobileNoCC: values.curMobileNoCC
//                 };
//                 setRegisteredData(storedData);

//                 // Step 2: Generate OTP (type: 4)
//                 const otpPayload = {
//                     onlinePatientID: "-1",
//                     eMail: values.eMail,
//                     password: values.password,
//                     curMobileNoCC: values.curMobileNoCC,
//                     curMobileNo: values.curMobileNo,
//                     fName: values.fName,
//                     mName: values.mName || "",
//                     lName: values.lName,
//                     genderID: values.genderID,
//                     fNameML: "",
//                     dob: values.dob,
//                     nationalityID: 0,
//                     uniqueID: 0,
//                     uniqueName: "",
//                     curAddress: "",
//                     otp: "",
//                     userID: "2",
//                     formID: 2,
//                     type: 4
//                 };

//                 const otpResponse = await api.post(`/Online/AddOnlineLogin`, otpPayload);

//                 if (otpResponse.data.isSuccess === true) {
//                     toast.success(otpResponse.data.msg || "OTP generated successfully!");
//                     // ✅ CRITICAL: Switch to OTP form
//                     setShowform(false);
//                     // Clear any previous OTP
//                     formik.setFieldValue('otp', '');
//                 } else {
//                     toast.error(otpResponse.data.msg || "Failed to generate OTP.");
//                 }
//             } else {
//                 toast.error(registerResponse.data.msg || "Registration failed.");
//             }
//         } catch (error: any) {
//             console.error("Registration error:", error);
//             toast.error(error?.response?.data?.msg || "Error during registration.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleOTPVerification = async (values: any) => {
//         // ✅ Check if registeredData exists
//         if (!registeredData) {
//             toast.error("Session expired. Please register again.");
//             setShowform(true);
//             setRegisteredData(null);
//             formik.resetForm();
//             return;
//         }

//         setIsSubmitting(true);
//         try {
//             const verifyPayload = {
//                 onlinePatientID: "-1",
//                 eMail: registeredData.eMail,
//                 password: registeredData.password,
//                 curMobileNoCC: registeredData.curMobileNoCC,
//                 curMobileNo: registeredData.curMobileNo,
//                 fName: registeredData.fName,
//                 mName: registeredData.mName,
//                 lName: registeredData.lName,
//                 genderID: registeredData.genderID,
//                 fNameML: "",
//                 dob: registeredData.dob,
//                 nationalityID: 0,
//                 uniqueID: 0,
//                 uniqueName: "",
//                 curAddress: "",
//                 otp: values.otp,
//                 userID: "2",
//                 formID: 2,
//                 type: 5
//             };

//             const response = await api.post(`/Online/AddOnlineLogin`, verifyPayload);

//             if (response.data.isSuccess === true) {
//                 toast.success(response.data.msg || "Registration completed successfully!");

//                 // Reset everything
//                 formik.resetForm();
//                 setShowform(true);
//                 setRegisteredData(null);
//                 onClose();

//                 // Navigate to login
//                 setTimeout(() => {
//                     navigate('/login');
//                 }, 1000);
//             } else {
//                 toast.error(response.data.msg || "Invalid OTP. Please try again.");
//                 // Clear only OTP field
//                 formik.setFieldValue('otp', '');
//             }
//         } catch (error: any) {
//             console.error("OTP verification error:", error);
//             toast.error(error?.response?.data?.msg || "Error verifying OTP.");
//             formik.setFieldValue('otp', '');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleResendOTP = async () => {
//         if (!registeredData) {
//             toast.error("Cannot resend OTP. Please register again.");
//             setShowform(true);
//             setRegisteredData(null);
//             formik.resetForm();
//             return;
//         }

//         setIsSubmitting(true);
//         try {
//             const resendPayload = {
//                 onlinePatientID: "-1",
//                 eMail: registeredData.eMail,
//                 password: registeredData.password,
//                 curMobileNoCC: registeredData.curMobileNoCC,
//                 curMobileNo: registeredData.curMobileNo,
//                 fName: registeredData.fName,
//                 mName: registeredData.mName,
//                 lName: registeredData.lName,
//                 genderID: registeredData.genderID,
//                 fNameML: "",
//                 dob: registeredData.dob,
//                 nationalityID: 0,
//                 uniqueID: 0,
//                 uniqueName: "",
//                 curAddress: "",
//                 otp: "",
//                 userID: "2",
//                 formID: 2,
//                 type: 4
//             };

//             const response = await api.post(`/Online/AddOnlineLogin`, resendPayload);

//             if (response.data.isSuccess === true) {
//                 toast.success("OTP resent successfully!");
//                 formik.setFieldValue('otp', '');
//             } else {
//                 toast.error(response.data.msg || "Failed to resend OTP.");
//             }
//         } catch (error: any) {
//             console.error("Resend OTP error:", error);
//             toast.error(error?.response?.data?.msg || "Error resending OTP.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <SwipeableDrawer
//             anchor="right"
//             open={open}
//             onClose={handleClose}
//             onOpen={() => {}}
//             disableSwipeToOpen={false}
//             slotProps={{
//                 backdrop: {
//                     style: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
//                 },
//             }}
//             PaperProps={{
//                 style: {
//                     boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.2)",
//                     backgroundColor: "white",
//                     width: '80%',
//                     maxWidth: '500px',
//                 },
//             }}
//         >
//             <Box sx={{ backgroundColor: "whitesmoke", position: 'relative' }}>
//                 <IconButton
//                     aria-label="close"
//                     onClick={handleClose}
//                     sx={{
//                         position: "absolute",
//                         left: 8,
//                         top: 8,
//                         color: (theme: any) => theme.palette.grey[500],
//                         zIndex: 1,
//                     }}
//                 >
//                     <CloseIcon style={{ color: "red" }} />
//                 </IconButton>
//             </Box>
//             <div style={{ padding: "10px", backgroundColor: "#ffffff", marginTop: "3vh", minHeight: '400px' }}>
//                 <CardContent>
//                     {showform ? (
//                         <Typography 
//                             variant="h5" 
//                             textAlign="center" 
//                             style={{ fontSize: "18px", fontWeight: 500, marginBottom: "15px", color: "blue" }}
//                         >
//                             {t("Candidate Registration")}
//                         </Typography>
//                     ) : (
//                         <Typography 
//                             variant="h5" 
//                             textAlign="center" 
//                             style={{ fontSize: "18px", fontWeight: 500, marginBottom: "15px", color: "blue" }}
//                         >
//                             OTP Verification
//                         </Typography>
//                     )}

//                     <form onSubmit={formik.handleSubmit}>
//                         <ToastApp />

//                         {showform ? (
//                             // Registration Form
//                             <Grid container spacing={2}>
//                                 <Grid item lg={4} xs={12}>
//                                     <TextField
//                                         id="fName"
//                                         name="fName"
//                                         value={formik.values.fName}
//                                         onChange={formik.handleChange}
//                                         onBlur={formik.handleBlur}
//                                         placeholder={t("text.FirstName")}
//                                         size="small"
//                                         fullWidth
//                                         error={formik.touched.fName && Boolean(formik.errors.fName)}
//                                         helperText={formik.touched.fName && formik.errors.fName}
//                                         label={<span>{t("text.FirstName")} <span style={{ color: "red" }}>*</span></span>}
//                                     />
//                                 </Grid>

//                                 <Grid item lg={4} xs={12}>
//                                     <TextField
//                                         id="mName"
//                                         name="mName"
//                                         label={t("text.MiddleName")}
//                                         value={formik.values.mName}
//                                         onChange={formik.handleChange}
//                                         onBlur={formik.handleBlur}
//                                         placeholder={t("text.MiddleName")}
//                                         size="small"
//                                         fullWidth
//                                     />
//                                 </Grid>

//                                 <Grid item lg={4} xs={12}>
//                                     <TextField
//                                         id="lName"
//                                         name="lName"
//                                         value={formik.values.lName}
//                                         onChange={formik.handleChange}
//                                         onBlur={formik.handleBlur}
//                                         placeholder={t("text.lastName")}
//                                         size="small"
//                                         fullWidth
//                                         error={formik.touched.lName && Boolean(formik.errors.lName)}
//                                         helperText={formik.touched.lName && formik.errors.lName}
//                                         label={<span>{t("text.lastName")} <span style={{ color: "red" }}>*</span></span>}
//                                     />
//                                 </Grid>

//                                 <Grid item lg={4} xs={12}>
//                                     <TextField
//                                         id="password"
//                                         name="password"
//                                         type="password"
//                                         value={formik.values.password}
//                                         onChange={formik.handleChange}
//                                         onBlur={formik.handleBlur}
//                                         placeholder={t("text.Password")}
//                                         size="small"
//                                         fullWidth
//                                         error={formik.touched.password && Boolean(formik.errors.password)}
//                                         helperText={formik.touched.password && formik.errors.password}
//                                         label={<span>{t("text.Password")} <span style={{ color: "red" }}>*</span></span>}
//                                     />
//                                 </Grid>

//                                 <Grid item lg={4} xs={12}>
//                                     <TextField
//                                         id="curMobileNo"
//                                         name="curMobileNo"
//                                         value={formik.values.curMobileNo}
//                                         onChange={formik.handleChange}
//                                         onBlur={formik.handleBlur}
//                                         placeholder={t("text.Mobile")}
//                                         size="small"
//                                         fullWidth
//                                         inputProps={{ maxLength: 10 }}
//                                         error={formik.touched.curMobileNo && Boolean(formik.errors.curMobileNo)}
//                                         helperText={formik.touched.curMobileNo && formik.errors.curMobileNo}
//                                         label={<span>{t("text.mobileNo")} <span style={{ color: "red" }}>*</span></span>}
//                                     />
//                                 </Grid>

//                                 <Grid item lg={4} xs={12}>
//                                     <TextField
//                                         id="eMail"
//                                         name="eMail"
//                                         type="email"
//                                         value={formik.values.eMail}
//                                         onChange={formik.handleChange}
//                                         onBlur={formik.handleBlur}
//                                         placeholder={t("text.EmailAddress")}
//                                         size="small"
//                                         fullWidth
//                                         error={formik.touched.eMail && Boolean(formik.errors.eMail)}
//                                         helperText={formik.touched.eMail && formik.errors.eMail}
//                                         label={<span>{t("text.EmailAddress")} <span style={{ color: "red" }}>*</span></span>}
//                                     />
//                                 </Grid>

//                                 <Grid item xs={12} sm={4} lg={4}>
//                                     <Autocomplete
//                                         id="genderID"
//                                         options={gender}
//                                         onChange={(_, newValue) => {
//                                             formik.setFieldValue("genderID", newValue?.value || "");
//                                         }}
//                                         onBlur={() => formik.setFieldTouched("genderID", true)}
//                                         getOptionLabel={(option) => option.label || ""}
//                                         isOptionEqualToValue={(option, value) => option.value === value.value}
//                                         fullWidth
//                                         size="small"
//                                         renderInput={(params) => (
//                                             <TextField
//                                                 {...params}
//                                                 label={<span>{t("text.SelectGender")} <span style={{ color: "red" }}>*</span></span>}
//                                                 error={formik.touched.genderID && Boolean(formik.errors.genderID)}
//                                                 helperText={formik.touched.genderID && formik.errors.genderID}
//                                             />
//                                         )}
//                                     />
//                                 </Grid>

//                                 <Grid item lg={4} xs={12}>
//                                     <TextField
//                                         id="dob"
//                                         name="dob"
//                                         type="date"
//                                         value={formik.values.dob}
//                                         onChange={formik.handleChange}
//                                         onBlur={formik.handleBlur}
//                                         size="small"
//                                         fullWidth
//                                         InputLabelProps={{ shrink: true }}
//                                         error={formik.touched.dob && Boolean(formik.errors.dob)}
//                                         helperText={formik.touched.dob && formik.errors.dob}
//                                         label={<span>{t("text.Dob")} <span style={{ color: "red" }}>*</span></span>}
//                                         inputProps={{ max: new Date().toISOString().split("T")[0] }}
//                                     />
//                                 </Grid>

//                                 <Grid item xs={12} container justifyContent="center" mt={2}>
//                                     <Button
//                                         type="submit"
//                                         variant="contained"
//                                         disabled={isSubmitting}
//                                         sx={{ backgroundColor: "orange", color: "white", width: '200px' }}
//                                     >
//                                         {isSubmitting ? <CircularProgress size={24} /> : t("Register")}
//                                     </Button>
//                                 </Grid>
//                             </Grid>
//                         ) : (
//                             // OTP Form - Simplified to prevent white screen
//                             <Grid container spacing={2} justifyContent="center">
//                                 <Grid item xs={12}>
//                                     <Typography 
//                                         textAlign="center" 
//                                         style={{ fontSize: "14px", marginBottom: "20px", color: "#666" }}
//                                     >
//                                         OTP has been sent to {registeredData?.eMail || 'your email'}
//                                     </Typography>
//                                 </Grid>

//                                 <Grid item xs={12} container justifyContent="center">
//                                     <Grid item xs={10} sm={8} md={6}>
//                                         <TextField
//                                             id="otp"
//                                             name="otp"
//                                             value={formik.values.otp}
//                                             onChange={formik.handleChange}
//                                             onBlur={formik.handleBlur}
//                                             placeholder="Enter OTP"
//                                             size="medium"
//                                             fullWidth
//                                             inputProps={{ maxLength: 6 }}
//                                             label={<span>OTP <span style={{ color: "red" }}>*</span></span>}
//                                             error={formik.touched.otp && Boolean(formik.errors.otp)}
//                                             helperText={formik.touched.otp && formik.errors.otp}
//                                             autoFocus
//                                         />
//                                     </Grid>
//                                 </Grid>

//                                 <Grid item xs={12} container justifyContent="center" spacing={2}>
//                                     <Grid item>
//                                         <Button
//                                             type="submit"
//                                             variant="contained"
//                                             disabled={isSubmitting}
//                                             sx={{ backgroundColor: "orange", color: "white", width: "120px" }}
//                                         >
//                                             {isSubmitting ? <CircularProgress size={24} /> : "Verify"}
//                                         </Button>
//                                     </Grid>
//                                     <Grid item>
//                                         <Button
//                                             type="button"
//                                             onClick={handleResendOTP}
//                                             disabled={isSubmitting}
//                                             variant="text"
//                                             sx={{ color: "blue" }}
//                                         >
//                                             Resend OTP
//                                         </Button>
//                                     </Grid>
//                                 </Grid>
//                             </Grid>
//                         )}
//                     </form>
//                 </CardContent>
//             </div>
//         </SwipeableDrawer>
//     );
// }






import React, { useEffect, useState } from "react";
import {
    Button,
    Grid,
    TextField,
    Typography,
    Box,
    Autocomplete,
    CircularProgress,
    Modal,
    Fade,
    Backdrop,
    Paper,
    IconButton,
    Divider,
    alpha,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import api from "../utils/Url";
import * as Yup from 'yup';
import ToastApp from "../ToastApp";
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WcIcon from '@mui/icons-material/Wc';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Props {
    open: boolean;
    onClose: () => void;
}

export function CandidateRegisterDrawer({ open, onClose }: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [gender, setGender] = useState([{ value: -1, label: t("text.genderID") }]);
    const [showform, setShowform] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registeredData, setRegisteredData] = useState<any>(null);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        if (open) {
            setShowform(true);
            setRegisteredData(null);
            setIsSubmitting(false);
            setActiveStep(0);
            formik.resetForm();
        }
    }, [open]);

    useEffect(() => {
        getGender();
    }, []);

    const getGender = async () => {
        try {
            const response = await api.get(`Common/Getgender`);
            if (response.data?.data) {
                const data = response.data.data;
                const arr = data.map((item: any) => ({
                    label: item["genderName"],
                    value: item["genderID"],
                }));
                setGender(arr);
            } else {
                setGender([]);
            }
        } catch (error) {
            console.error("Error fetching gender:", error);
            setGender([]);
        }
    };

    const handleClose = () => {
        formik.resetForm();
        setShowform(true);
        setRegisteredData(null);
        setIsSubmitting(false);
        setActiveStep(0);
        onClose();
    };

    const registrationValidationSchema = Yup.object({
        fName: Yup.string().trim().required("First Name Is Required"),
        lName: Yup.string().trim().required("Last Name Is Required"),
        password: Yup.string().trim().required("Password Is Required").min(4, "Password must be at least 4 characters"),
        curMobileNo: Yup.string()
            .trim()
            .required("Mobile No Is Required")
            .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
        eMail: Yup.string()
            .trim()
            .required("Email Is Required")
            .email("Invalid email format"),
        dob: Yup.date()
            .required("DOB Is Required")
            .max(new Date(), "Date of Birth cannot be in the future"),
        genderID: Yup.string()
            .required("Gender Is Required")
            .test('is-not-default', "Gender Is Required", (value: any) => value && value !== "-1" && value !== 0),
    });

    const otpValidationSchema = Yup.object({
        otp: Yup.string().required("OTP is required").min(4, "OTP must be at least 4 digits").max(6, "OTP must be at most 6 digits"),
    });

    const formik = useFormik({
        initialValues: {
            "onlinePatientID": 0,
            "eMail": "",
            "password": "",
            "curMobileNoCC": "+91",
            "curMobileNo": "",
            "fName": "",
            "mName": "",
            "lName": "",
            "genderID": "",
            "fNameML": "",
            "dob": "",
            "nationalityID": 0,
            "uniqueID": 0,
            "uniqueName": "",
            "curAddress": "",
            "otp": "",
            "userID": "-1",
            "formID": -1,
            "type": 1
        },
        validationSchema: showform ? registrationValidationSchema : otpValidationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            if (showform) {
                await handleRegistration(values);
            } else {
                await handleOTPVerification(values);
            }
            setSubmitting(false);
        }
    });

    const handleRegistration = async (values: any) => {
        setIsSubmitting(true);
        try {
            const registerPayload = {
                onlinePatientID: 0,
                eMail: values.eMail,
                password: values.password,
                curMobileNoCC: values.curMobileNoCC,
                curMobileNo: values.curMobileNo,
                fName: values.fName,
                mName: values.mName || "",
                lName: values.lName,
                genderID: values.genderID,
                fNameML: "",
                dob: values.dob,
                nationalityID: 0,
                uniqueID: 0,
                uniqueName: "",
                curAddress: "",
                otp: "",
                userID: "-1",
                formID: -1,
                type: 1
            };

            const registerResponse = await api.post(`/Online/AddOnlineLogin`, registerPayload);

            if (registerResponse.data.isSuccess === true) {
                toast.success(registerResponse.data.msg || "Login created successfully!");

                const storedData = {
                    eMail: values.eMail,
                    curMobileNo: values.curMobileNo,
                    password: values.password,
                    fName: values.fName,
                    mName: values.mName || "",
                    lName: values.lName,
                    genderID: values.genderID,
                    dob: values.dob,
                    curMobileNoCC: values.curMobileNoCC
                };
                setRegisteredData(storedData);

                const otpPayload = {
                    onlinePatientID: "-1",
                    eMail: values.eMail,
                    password: values.password,
                    curMobileNoCC: values.curMobileNoCC,
                    curMobileNo: values.curMobileNo,
                    fName: values.fName,
                    mName: values.mName || "",
                    lName: values.lName,
                    genderID: values.genderID,
                    fNameML: "",
                    dob: values.dob,
                    nationalityID: 0,
                    uniqueID: 0,
                    uniqueName: "",
                    curAddress: "",
                    otp: "",
                    userID: "2",
                    formID: 2,
                    type: 4
                };

                const otpResponse = await api.post(`/Online/AddOnlineLogin`, otpPayload);

                if (otpResponse.data.isSuccess === true) {
                    toast.success(otpResponse.data.msg || "OTP generated successfully!");
                    setShowform(false);
                    setActiveStep(1);
                    formik.setFieldValue('otp', '');
                } else {
                    toast.error(otpResponse.data.msg || "Failed to generate OTP.");
                }
            } else {
                toast.error(registerResponse.data.msg || "Registration failed.");
            }
        } catch (error: any) {
            console.error("Registration error:", error);
            toast.error(error?.response?.data?.msg || "Error during registration.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOTPVerification = async (values: any) => {
        if (!registeredData) {
            toast.error("Session expired. Please register again.");
            setShowform(true);
            setRegisteredData(null);
            formik.resetForm();
            return;
        }

        setIsSubmitting(true);
        try {
            const verifyPayload = {
                onlinePatientID: "-1",
                eMail: registeredData.eMail,
                password: registeredData.password,
                curMobileNoCC: registeredData.curMobileNoCC,
                curMobileNo: registeredData.curMobileNo,
                fName: registeredData.fName,
                mName: registeredData.mName,
                lName: registeredData.lName,
                genderID: registeredData.genderID,
                fNameML: "",
                dob: registeredData.dob,
                nationalityID: 0,
                uniqueID: 0,
                uniqueName: "",
                curAddress: "",
                otp: values.otp,
                userID: "2",
                formID: 2,
                type: 5
            };

            const response = await api.post(`/Online/AddOnlineLogin`, verifyPayload);

            if (response.data.isSuccess === true) {
                toast.success(response.data.msg || "Registration completed successfully!", {
                    autoClose: 2000,
                    onClose: () => {
                        formik.resetForm();
                        setShowform(true);
                        setRegisteredData(null);
                        onClose();
                        navigate('/login');
                    }
                });
            } else {
                toast.error(response.data.msg || "Invalid OTP. Please try again.");
                formik.setFieldValue('otp', '');
            }
        } catch (error: any) {
            console.error("OTP verification error:", error);
            toast.error(error?.response?.data?.msg || "Error verifying OTP.");
            formik.setFieldValue('otp', '');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOTP = async () => {
        if (!registeredData) {
            toast.error("Cannot resend OTP. Please register again.");
            setShowform(true);
            setRegisteredData(null);
            formik.resetForm();
            return;
        }

        setIsSubmitting(true);
        try {
            const resendPayload = {
                onlinePatientID: "-1",
                eMail: registeredData.eMail,
                password: registeredData.password,
                curMobileNoCC: registeredData.curMobileNoCC,
                curMobileNo: registeredData.curMobileNo,
                fName: registeredData.fName,
                mName: registeredData.mName,
                lName: registeredData.lName,
                genderID: registeredData.genderID,
                fNameML: "",
                dob: registeredData.dob,
                nationalityID: 0,
                uniqueID: 0,
                uniqueName: "",
                curAddress: "",
                otp: "",
                userID: "2",
                formID: 2,
                type: 4
            };

            const response = await api.post(`/Online/AddOnlineLogin`, resendPayload);

            if (response.data.isSuccess === true) {
                toast.success("OTP resent successfully!");
                formik.setFieldValue('otp', '');
            } else {
                toast.error(response.data.msg || "Failed to resend OTP.");
            }
        } catch (error: any) {
            console.error("Resend OTP error:", error);
            toast.error(error?.response?.data?.msg || "Error resending OTP.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = ['Registration Details', 'OTP Verification'];

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                    style: { backgroundColor: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(4px)" }
                },
            }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        maxWidth: '680px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        outline: 'none',
                    }}
                >
                    <Paper
                        elevation={24}
                        sx={{
                            borderRadius: '24px',
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
                            position: 'relative',
                        }}
                    >
                        {/* Close Button */}
                        <IconButton
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                right: 16,
                                top: 16,
                                zIndex: 10,
                                bgcolor: alpha('#000', 0.05),
                                '&:hover': { bgcolor: alpha('#000', 0.1) },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        {/* Header with Gradient */}
                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                p: 1,
                                textAlign: 'center',
                                color: '#fff',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    mx: 'auto',
                                    mb: 0.5,
                                    bgcolor: alpha('#fff', 0.2),
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {showform ? (
                                    <PersonAddIcon sx={{ fontSize: 24, color: '#fff' }} />
                                ) : (
                                    <VerifiedUserIcon sx={{ fontSize: 24, color: '#fff' }} />
                                )}
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                {showform ? "Create New Account" : "Verify Your Account"}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {showform
                                    ? "Please fill in your details to create a new account"
                                    : `We've sent a verification code to ${registeredData?.eMail || 'your email'}`
                                }
                            </Typography>

                            {/* Stepper */}
                            <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 2 }}>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel
                                            StepIconProps={{
                                                sx: {
                                                    color: "#fff", // 👈 default circle color
                                                    "& .MuiStepIcon-text": {
                                                        fill: "#333", // 👈 number color (IMPORTANT FIX)
                                                        fontWeight: 600,
                                                    },
                                                    "&.Mui-active": {
                                                        color: "#fff",
                                                        "& .MuiStepIcon-text": {
                                                            fill: "#000", // active step number
                                                        },
                                                    },
                                                    "&.Mui-completed": {
                                                        color: "#fff",
                                                        "& .MuiStepIcon-text": {
                                                            fill: "#000",
                                                        },
                                                    },
                                                },
                                            }}
                                            sx={{
                                                "& .MuiStepLabel-label": {
                                                    color: "#fff",
                                                    fontSize: "12px",
                                                },
                                            }}
                                        >
                                            {label}
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>

                        {/* Form Content */}
                        <Box sx={{ p: 4 }}>
                            <ToastApp />
                            <form onSubmit={formik.handleSubmit}>
                                {showform ? (
                                    <Grid container spacing={2.5}>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                id="fName"
                                                name="fName"
                                                value={formik.values.fName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="John"
                                                size="small"
                                                error={formik.touched.fName && Boolean(formik.errors.fName)}
                                                helperText={formik.touched.fName && formik.errors.fName}
                                                label={<span>First Name <span style={{ color: "red" }}>*</span></span>}
                                                InputProps={{
                                                    startAdornment: <PersonAddIcon sx={{ mr: 1, color: '#667eea' }} fontSize="small" />,
                                                }}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                id="mName"
                                                name="mName"
                                                label="Middle Name"
                                                value={formik.values.mName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Robert"
                                                size="small"
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                id="lName"
                                                name="lName"
                                                value={formik.values.lName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Doe"
                                                size="small"
                                                error={formik.touched.lName && Boolean(formik.errors.lName)}
                                                helperText={formik.touched.lName && formik.errors.lName}
                                                label={<span>Last Name <span style={{ color: "red" }}>*</span></span>}
                                                InputProps={{
                                                    startAdornment: <PersonAddIcon sx={{ mr: 1, color: '#667eea' }} fontSize="small" />,
                                                }}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="••••••••"
                                                size="small"
                                                error={formik.touched.password && Boolean(formik.errors.password)}
                                                helperText={formik.touched.password && formik.errors.password}
                                                label={<span>Password <span style={{ color: "red" }}>*</span></span>}
                                                InputProps={{
                                                    startAdornment: <LockIcon sx={{ mr: 1, color: '#667eea' }} fontSize="small" />,
                                                }}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                id="curMobileNo"
                                                name="curMobileNo"
                                                value={formik.values.curMobileNo}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="9876543210"
                                                size="small"
                                                inputProps={{ maxLength: 10 }}
                                                error={formik.touched.curMobileNo && Boolean(formik.errors.curMobileNo)}
                                                helperText={formik.touched.curMobileNo && formik.errors.curMobileNo}
                                                label={<span>Mobile Number <span style={{ color: "red" }}>*</span></span>}
                                                InputProps={{
                                                    startAdornment: <PhoneIcon sx={{ mr: 1, color: '#667eea' }} fontSize="small" />,
                                                }}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                id="eMail"
                                                name="eMail"
                                                type="email"
                                                value={formik.values.eMail}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="john@example.com"
                                                size="small"
                                                error={formik.touched.eMail && Boolean(formik.errors.eMail)}
                                                helperText={formik.touched.eMail && formik.errors.eMail}
                                                label={<span>Email Address <span style={{ color: "red" }}>*</span></span>}
                                                InputProps={{
                                                    startAdornment: <EmailIcon sx={{ mr: 1, color: '#667eea' }} fontSize="small" />,
                                                }}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Autocomplete
                                                id="genderID"
                                                options={gender}
                                                onChange={(_, newValue) => {
                                                    formik.setFieldValue("genderID", newValue?.value || "");
                                                }}
                                                onBlur={() => formik.setFieldTouched("genderID", true)}
                                                getOptionLabel={(option) => option.label || ""}
                                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                                fullWidth
                                                size="small"
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label={<span>Gender <span style={{ color: "red" }}>*</span></span>}
                                                        error={formik.touched.genderID && Boolean(formik.errors.genderID)}
                                                        helperText={formik.touched.genderID && formik.errors.genderID}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: <WcIcon sx={{ mr: 1, color: '#667eea' }} fontSize="small" />,
                                                        }}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                id="dob"
                                                name="dob"
                                                type="date"
                                                value={formik.values.dob}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                size="small"
                                                InputLabelProps={{ shrink: true }}
                                                error={formik.touched.dob && Boolean(formik.errors.dob)}
                                                helperText={formik.touched.dob && formik.errors.dob}
                                                label={<span>Date of Birth <span style={{ color: "red" }}>*</span></span>}
                                                inputProps={{ max: new Date().toISOString().split("T")[0] }}
                                                InputProps={{
                                                    startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: '#667eea' }} fontSize="small" />,
                                                }}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Divider sx={{ my: 2 }} />
                                            <Button
                                                fullWidth
                                                type="submit"
                                                variant="contained"
                                                disabled={isSubmitting}
                                                sx={{
                                                    py: 1.75,
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    fontSize: '16px',
                                                    fontWeight: 600,
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                                                    },
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                {isSubmitting ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : "Register Account"}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Grid container spacing={3} justifyContent="center">
                                        <Grid item xs={12}>
                                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                                <CheckCircleIcon sx={{ fontSize: 64, color: '#4caf50' }} />
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                id="otp"
                                                name="otp"
                                                value={formik.values.otp}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Enter 6-digit OTP"
                                                size="medium"
                                                error={formik.touched.otp && Boolean(formik.errors.otp)}
                                                helperText={formik.touched.otp && formik.errors.otp}
                                                label="OTP Verification Code"
                                                inputProps={{
                                                    maxLength: 6,
                                                    style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                        '& input': { textAlign: 'center', fontSize: '20px', letterSpacing: '4px' },
                                                    },
                                                }}
                                                autoFocus
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Button
                                                fullWidth
                                                type="submit"
                                                variant="contained"
                                                disabled={isSubmitting}
                                                sx={{
                                                    py: 1.75,
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    fontSize: '16px',
                                                    fontWeight: 600,
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)',
                                                        transform: 'translateY(-2px)',
                                                    },
                                                }}
                                            >
                                                {isSubmitting ? <CircularProgress size={24} /> : "Verify & Complete Registration"}
                                            </Button>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Divider sx={{ my: 2 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Didn't receive the code?
                                                </Typography>
                                            </Divider>
                                            <Button
                                                fullWidth
                                                onClick={handleResendOTP}
                                                disabled={isSubmitting}
                                                variant="outlined"
                                                sx={{
                                                    py: 1.5,
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    borderColor: '#667eea',
                                                    color: '#667eea',
                                                    '&:hover': {
                                                        borderColor: '#5a67d8',
                                                        background: alpha('#667eea', 0.05),
                                                    },
                                                }}
                                            >
                                                Resend OTP
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )}
                            </form>
                        </Box>
                    </Paper>
                </Box>
            </Fade>
        </Modal>
    );
}