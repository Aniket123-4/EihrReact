// import CloseIcon from "@mui/icons-material/Close";
// import React, { useEffect, useState } from "react";
// import { useTheme } from "@mui/material/styles";
// import {
//     Button,
//     CardContent,
//     Grid,
//     TextField,
//     Typography,
//     Box,
//     IconButton,
//     SwipeableDrawer,
//     InputAdornment,
//     CircularProgress,
//     Link,
// } from "@mui/material";
// import { useTranslation } from "react-i18next";
// import { useFormik } from "formik";
// import { toast } from "react-toastify";
// import api from "../utils/Url";
// import * as Yup from 'yup';
// import ToastApp from "../ToastApp";
// import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
// import EmailIcon from '@mui/icons-material/Email';
// import LockClockIcon from '@mui/icons-material/LockClock';
// import PersonAddIcon from '@mui/icons-material/PersonAdd';
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// interface Props {
//     open: boolean;
//     onClose: () => void;
// }

// export function AddInstUser({ open, onClose }: Props) {
//     const { t } = useTranslation();
//     const theme = useTheme();
//     const [showform, setShowform] = useState(true);
//     const [loading, setLoading] = useState(false);
//     const [userData, setUserData] = useState({ eMail: "", curMobileNo: "" });

//     // Reset when drawer opens
//     useEffect(() => {
//         if (open) {
//             setShowform(true);
//             setLoading(false);
//             formik.resetForm();
//         }
//     }, [open]);

//     const handleClose = () => {
//         formik.resetForm();
//         setShowform(true);
//         setLoading(false);
//         onClose();
//     };

//     const validationSchema = Yup.object({
//         curMobileNo: Yup.string()
//             .trim()
//             .required(t("MobileNo IsRequired"))
//             .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
//         eMail: Yup.string()
//             .trim()
//             .required(t("eMail Is Required"))
//             .email("Invalid email format"),
//         otp: Yup.string().when([], {
//             is: () => !showform,
//             then: (schema) => schema.required("OTP is required").min(4, "OTP must be at least 4 digits"),
//             otherwise: (schema) => schema.notRequired(),
//         }),
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
//             "genderID": 0,
//             "fNameML": "",
//             "dob": "2023-11-28T12:49:16.420Z",
//             "nationalityID": 0,
//             "uniqueID": 0,
//             "uniqueName": "",
//             "curAddress": "",
//             "otp": "",
//             "userID": "-1",
//             "formID": -1,
//             "type": 1
//         },
//         validationSchema: validationSchema,
//         onSubmit: async (values, { setSubmitting }) => {
//             if (showform) {
//                 // Step 1: Generate OTP (type 4)
//                 await generateOTP(values);
//             } else {
//                 // Step 2: Verify OTP (type 5)
//                 await verifyOTP(values);
//             }
//             setSubmitting(false);
//         }
//     });

//     // ✅ Generate OTP - type 4 (NO SendMail)
//     const generateOTP = async (values: any) => {
//         setLoading(true);
//         try {
//             const collectData = {
//                 ...values,
//                 type: 4,
//                 onlinePatientID: "-1",
//                 userID: "2",
//                 formID: 2,
//                 curMobileNoCC: "+91",
//                 password: "123456"
//             };

//             console.log("Generating OTP with type 4:", collectData);
            
//             const response = await api.post(`/Online/AddOnlineLogin`, collectData);
            
//             if (response.data.isSuccess === true || response.data.isSuccess === "True") {
//                 toast.success(response.data.msg || "OTP generated successfully.");
                
//                 // Store user data for verification
//                 setUserData({
//                     eMail: values.eMail,
//                     curMobileNo: values.curMobileNo
//                 });
                
//                 // Show OTP form
//                 setShowform(false);
//             } else {
//                 toast.error(response.data.msg || "Failed to generate OTP.");
//             }
//         } catch (error: any) {
//             console.error("OTP Generation Error:", error);
//             toast.error(error?.response?.data?.msg || "Error generating OTP.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ✅ Verify OTP - type 5
//     const verifyOTP = async (values: any) => {
//         setLoading(true);
//         try {
//             const collectData = {
//                 onlinePatientID: "-1",
//                 eMail: userData.eMail,
//                 password: "123456",
//                 curMobileNoCC: "+91",
//                 curMobileNo: userData.curMobileNo,
//                 fName: "",
//                 mName: "",
//                 lName: "",
//                 genderID: 0,
//                 fNameML: "",
//                 dob: "2023-11-28T12:49:16.420Z",
//                 nationalityID: 0,
//                 uniqueID: 0,
//                 uniqueName: "",
//                 curAddress: "",
//                 otp: values.otp,
//                 userID: "2",
//                 formID: 2,
//                 type: 5
//             };

//             console.log("Verifying OTP with type 5:", collectData);
            
//             const response = await api.post(`/Online/AddOnlineLogin`, collectData);
            
//             if (response.data.isSuccess === true || response.data.isSuccess === "True") {
//                 toast.success(response.data.msg || "Patient activated successfully!");
                
//                 // Reset and close
//                 setTimeout(() => {
//                     formik.resetForm();
//                     setShowform(true);
//                     onClose();
//                 }, 1500);
//             } else {
//                 toast.error(response.data.msg || "Invalid OTP.");
//                 formik.setFieldValue('otp', '');
//             }
//         } catch (error: any) {
//             console.error("OTP Verification Error:", error);
//             toast.error(error?.response?.data?.msg || "Error verifying OTP.");
//             formik.setFieldValue('otp', '');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ✅ Resend OTP - type 4 again
//     const handleResendOTP = async () => {
//         setLoading(true);
//         try {
//             const collectData = {
//                 onlinePatientID: "-1",
//                 eMail: userData.eMail,
//                 password: "123456",
//                 curMobileNoCC: "+91",
//                 curMobileNo: userData.curMobileNo,
//                 fName: "",
//                 mName: "",
//                 lName: "",
//                 genderID: 0,
//                 fNameML: "",
//                 dob: "2023-11-28T12:49:16.420Z",
//                 nationalityID: 0,
//                 uniqueID: 0,
//                 uniqueName: "",
//                 curAddress: "",
//                 otp: "",
//                 userID: "2",
//                 formID: 2,
//                 type: 4
//             };

//             console.log("Resending OTP with type 4:", collectData);
            
//             const response = await api.post(`/Online/AddOnlineLogin`, collectData);
            
//             if (response.data.isSuccess === true || response.data.isSuccess === "True") {
//                 toast.success("OTP resent successfully!");
//                 formik.setFieldValue('otp', '');
//             } else {
//                 toast.error(response.data.msg || "Failed to resend OTP.");
//             }
//         } catch (error: any) {
//             console.error("Resend OTP Error:", error);
//             toast.error(error?.response?.data?.msg || "Error resending OTP.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <SwipeableDrawer
//             anchor="right"
//             open={open}
//             onClose={handleClose}
//             onOpen={() => {}}
//             transitionDuration={300}
//             slotProps={{
//                 backdrop: { style: { backgroundColor: "rgba(0, 0, 0, 0.7)" } },
//             }}
//             PaperProps={{
//                 style: {
//                     width: '400px',
//                     maxWidth: '90vw',
//                     borderRadius: '12px 0 0 12px',
//                 },
//             }}
//         >
//             <Box sx={{ 
//                 p: 2,
//                 bgcolor: 'background.paper',
//                 height: '100%',
//                 display: 'flex',
//                 flexDirection: 'column'
//             }}>
//                 <Box sx={{ 
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'space-between',
//                     borderBottom: `1px solid ${theme.palette.divider}`,
//                     pb: 2
//                 }}>
//                     <Typography variant="h6" sx={{ 
//                         fontWeight: 600,
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 1
//                     }}>
//                         {showform ? (
//                             <>
//                                 <PersonAddIcon fontSize="small" />
//                                 {t("Activate Patient")}
//                             </>
//                         ) : (
//                             <>
//                                 <VerifiedUserIcon fontSize="small" />
//                                 {t("OTP Verification")}
//                             </>
//                         )}
//                     </Typography>
//                     <IconButton onClick={handleClose} size="small">
//                         <CloseIcon sx={{ color: 'error.main' }} />
//                     </IconButton>
//                 </Box>

//                 <CardContent sx={{ flex: 1, overflow: 'auto' }}>
//                     <form onSubmit={formik.handleSubmit}>
//                         <ToastApp />
//                         {showform ? (
//                             <Grid container spacing={3}>
//                                 <Grid item xs={12}>
//                                     <TextField
//                                         fullWidth
//                                         variant="outlined"
//                                         id="curMobileNo"
//                                         name="curMobileNo"
//                                         label={t("Mobile Number")}
//                                         placeholder="9876543210"
//                                         value={formik.values.curMobileNo}
//                                         onChange={formik.handleChange}
//                                         onBlur={formik.handleBlur}
//                                         error={formik.touched.curMobileNo && Boolean(formik.errors.curMobileNo)}
//                                         helperText={
//                                             <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                                 {formik.touched.curMobileNo && formik.errors.curMobileNo && (
//                                                     <ErrorOutlineIcon fontSize="small" color="error" />
//                                                 )}
//                                                 {formik.touched.curMobileNo && formik.errors.curMobileNo}
//                                             </Box>
//                                         }
//                                         InputProps={{
//                                             startAdornment: (
//                                                 <InputAdornment position="start">
//                                                     <PhoneIphoneIcon color="action" />
//                                                 </InputAdornment>
//                                             ),
//                                         }}
//                                         inputProps={{ maxLength: 10 }}
//                                     />
//                                 </Grid>

//                                 <Grid item xs={12}>
//                                     <TextField
//                                         fullWidth
//                                         variant="outlined"
//                                         id="eMail"
//                                         name="eMail"
//                                         type="email"
//                                         label={t("Email Address")}
//                                         placeholder="name@example.com"
//                                         value={formik.values.eMail}
//                                         onChange={formik.handleChange}
//                                         onBlur={formik.handleBlur}
//                                         error={formik.touched.eMail && Boolean(formik.errors.eMail)}
//                                         helperText={
//                                             <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                                 {formik.touched.eMail && formik.errors.eMail && (
//                                                     <ErrorOutlineIcon fontSize="small" color="error" />
//                                                 )}
//                                                 {formik.touched.eMail && formik.errors.eMail}
//                                             </Box>
//                                         }
//                                         InputProps={{
//                                             startAdornment: (
//                                                 <InputAdornment position="start">
//                                                     <EmailIcon color="action" />
//                                                 </InputAdornment>
//                                             ),
//                                         }}
//                                     />
//                                 </Grid>

//                                 <Grid item xs={12} sx={{ mt: 4 }}>
//                                     <Button
//                                         fullWidth
//                                         variant="contained"
//                                         type="submit"
//                                         disabled={loading}
//                                         sx={{
//                                             py: 1.5,
//                                             borderRadius: '8px',
//                                             textTransform: 'uppercase',
//                                             letterSpacing: 1.1,
//                                             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                                             '&:hover': {
//                                                 background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)',
//                                                 boxShadow: 2,
//                                             }
//                                         }}
//                                     >
//                                         {loading ? (
//                                             <CircularProgress size={24} sx={{ color: 'white' }} />
//                                         ) : (
//                                             t("Send OTP")
//                                         )}
//                                     </Button>
//                                 </Grid>
//                             </Grid>
//                         ) : (
//                             <Box sx={{ textAlign: 'center' }}>
//                                 <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>
//                                     {t("We've sent a verification code to")}
//                                 </Typography>
//                                 <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600, color: '#667eea' }}>
//                                     {userData.eMail || 'your email'}
//                                 </Typography>

//                                 <Grid container spacing={3} justifyContent="center">
//                                     <Grid item xs={12}>
//                                         <TextField
//                                             fullWidth
//                                             variant="outlined"
//                                             id="otp"
//                                             name="otp"
//                                             label={t("Enter OTP")}
//                                             value={formik.values.otp}
//                                             onChange={formik.handleChange}
//                                             onBlur={formik.handleBlur}
//                                             error={formik.touched.otp && Boolean(formik.errors.otp)}
//                                             helperText={formik.touched.otp && formik.errors.otp}
//                                             inputProps={{ 
//                                                 maxLength: 6,
//                                                 inputMode: 'numeric',
//                                                 pattern: '[0-9]*'
//                                             }}
//                                             InputProps={{
//                                                 startAdornment: (
//                                                     <InputAdornment position="start">
//                                                         <LockClockIcon color="action" />
//                                                     </InputAdornment>
//                                                 ),
//                                             }}
//                                             sx={{ maxWidth: 300, mx: 'auto' }}
//                                             autoFocus
//                                         />
//                                     </Grid>

//                                     <Grid item xs={12}>
//                                         <Button
//                                             type="submit"
//                                             variant="contained"
//                                             disabled={loading}
//                                             sx={{
//                                                 px: 4,
//                                                 py: 1.5,
//                                                 borderRadius: '8px',
//                                                 textTransform: 'uppercase',
//                                                 letterSpacing: 1.1,
//                                                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                                                 '&:hover': {
//                                                     background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)',
//                                                 }
//                                             }}
//                                         >
//                                             {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : t("Verify OTP")}
//                                         </Button>
//                                     </Grid>

//                                     <Grid item xs={12}>
//                                         <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
//                                             {t("Didn't receive code?")}{' '}
//                                             <Link 
//                                                 href="#" 
//                                                 onClick={(e) => {
//                                                     e.preventDefault();
//                                                     handleResendOTP();
//                                                 }}
//                                                 sx={{ cursor: 'pointer' }}
//                                             >
//                                                 {t("Resend")}
//                                             </Link>
//                                         </Typography>
//                                     </Grid>
//                                 </Grid>
//                             </Box>
//                         )}
//                     </form>
//                 </CardContent>
//             </Box>
//         </SwipeableDrawer>
//     );
// }









import React, { useEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import {
    Button,
    Grid,
    TextField,
    Typography,
    Box,
    InputAdornment,
    CircularProgress,
    Link,
    Modal,
    Fade,
    Backdrop,
    Paper,
    Divider,
    alpha,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import api from "../utils/Url";
import * as Yup from 'yup';
import ToastApp from "../ToastApp";
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import EmailIcon from '@mui/icons-material/Email';
import LockClockIcon from '@mui/icons-material/LockClock';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Props {
    open: boolean;
    onClose: () => void;
}

export function AddInstUser({ open, onClose }: Props) {
    const { t } = useTranslation();
    const [showform, setShowform] = useState(true);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({ eMail: "", curMobileNo: "" });

    // Reset when modal opens
    useEffect(() => {
        if (open) {
            setShowform(true);
            setLoading(false);
            formik.resetForm();
        }
    }, [open]);

    const handleClose = () => {
        formik.resetForm();
        setShowform(true);
        setLoading(false);
        onClose();
    };

    const validationSchema = Yup.object({
        curMobileNo: Yup.string()
            .trim()
            .required(t("MobileNo IsRequired"))
            .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
        eMail: Yup.string()
            .trim()
            .required(t("eMail Is Required"))
            .email("Invalid email format"),
        otp: Yup.string().when([], {
            is: () => !showform,
            then: (schema) => schema.required("OTP is required").min(4, "OTP must be at least 4 digits"),
            otherwise: (schema) => schema.notRequired(),
        }),
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
            "genderID": 0,
            "fNameML": "",
            "dob": "2023-11-28T12:49:16.420Z",
            "nationalityID": 0,
            "uniqueID": 0,
            "uniqueName": "",
            "curAddress": "",
            "otp": "",
            "userID": "-1",
            "formID": -1,
            "type": 1
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            if (showform) {
                await generateOTP(values);
            } else {
                await verifyOTP(values);
            }
            setSubmitting(false);
        }
    });

    // Generate OTP - type 4
    const generateOTP = async (values: any) => {
        setLoading(true);
        try {
            const collectData = {
                ...values,
                type: 4,
                onlinePatientID: "-1",
                userID: "2",
                formID: 2,
                curMobileNoCC: "+91",
                password: "123456"
            };

            const response = await api.post(`/Online/AddOnlineLogin`, collectData);
            
            if (response.data.isSuccess === true || response.data.isSuccess === "True") {
                toast.success(response.data.msg || "OTP generated successfully.");
                
                setUserData({
                    eMail: values.eMail,
                    curMobileNo: values.curMobileNo
                });
                
                setShowform(false);
            } else {
                toast.error(response.data.msg || "Failed to generate OTP.");
            }
        } catch (error: any) {
            console.error("OTP Generation Error:", error);
            toast.error(error?.response?.data?.msg || "Error generating OTP.");
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP - type 5
    const verifyOTP = async (values: any) => {
        setLoading(true);
        try {
            const collectData = {
                onlinePatientID: "-1",
                eMail: userData.eMail,
                password: "123456",
                curMobileNoCC: "+91",
                curMobileNo: userData.curMobileNo,
                fName: "",
                mName: "",
                lName: "",
                genderID: 0,
                fNameML: "",
                dob: "2023-11-28T12:49:16.420Z",
                nationalityID: 0,
                uniqueID: 0,
                uniqueName: "",
                curAddress: "",
                otp: values.otp,
                userID: "2",
                formID: 2,
                type: 5
            };

            const response = await api.post(`/Online/AddOnlineLogin`, collectData);
            
            if (response.data.isSuccess === true || response.data.isSuccess === "True") {
                toast.success(response.data.msg || "Patient activated successfully!");
                
                setTimeout(() => {
                    formik.resetForm();
                    setShowform(true);
                    onClose();
                }, 1500);
            } else {
                toast.error(response.data.msg || "Invalid OTP.");
                formik.setFieldValue('otp', '');
            }
        } catch (error: any) {
            console.error("OTP Verification Error:", error);
            toast.error(error?.response?.data?.msg || "Error verifying OTP.");
            formik.setFieldValue('otp', '');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP - type 4
    const handleResendOTP = async () => {
        setLoading(true);
        try {
            const collectData = {
                onlinePatientID: "-1",
                eMail: userData.eMail,
                password: "123456",
                curMobileNoCC: "+91",
                curMobileNo: userData.curMobileNo,
                fName: "",
                mName: "",
                lName: "",
                genderID: 0,
                fNameML: "",
                dob: "2023-11-28T12:49:16.420Z",
                nationalityID: 0,
                uniqueID: 0,
                uniqueName: "",
                curAddress: "",
                otp: "",
                userID: "2",
                formID: 2,
                type: 4
            };

            const response = await api.post(`/Online/AddOnlineLogin`, collectData);
            
            if (response.data.isSuccess === true || response.data.isSuccess === "True") {
                toast.success("OTP resent successfully!");
                formik.setFieldValue('otp', '');
            } else {
                toast.error(response.data.msg || "Failed to resend OTP.");
            }
        } catch (error: any) {
            console.error("Resend OTP Error:", error);
            toast.error(error?.response?.data?.msg || "Error resending OTP.");
        } finally {
            setLoading(false);
        }
    };

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
                        maxWidth: '520px',
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

                        {/* Header */}
                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                p: 4,
                                textAlign: 'center',
                                color: '#fff',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    mx: 'auto',
                                    mb: 1,
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
                                {showform ? "Activate Patient" : "OTP Verification"}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {showform 
                                    ? "Please verify your contact details to activate your account"
                                    : `We've sent a verification code to ${userData.eMail || 'your email'}`
                                }
                            </Typography>
                        </Box>

                        {/* Form Content */}
                        <Box sx={{ p: 4 }}>
                            <ToastApp />
                            <form onSubmit={formik.handleSubmit}>
                                {showform ? (
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="curMobileNo"
                                                name="curMobileNo"
                                                label="Mobile Number"
                                                placeholder="9876543210"
                                                value={formik.values.curMobileNo}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.curMobileNo && Boolean(formik.errors.curMobileNo)}
                                                helperText={formik.touched.curMobileNo && formik.errors.curMobileNo}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PhoneIphoneIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                inputProps={{ maxLength: 10 }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                        '&:hover fieldset': {
                                                            borderColor: '#667eea',
                                                        },
                                                    },
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                id="eMail"
                                                name="eMail"
                                                type="email"
                                                label="Email Address"
                                                placeholder="name@example.com"
                                                value={formik.values.eMail}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.eMail && Boolean(formik.errors.eMail)}
                                                helperText={formik.touched.eMail && formik.errors.eMail}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EmailIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                        '&:hover fieldset': {
                                                            borderColor: '#667eea',
                                                        },
                                                    },
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                type="submit"
                                                disabled={loading}
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
                                                {loading ? (
                                                    <CircularProgress size={24} sx={{ color: '#fff' }} />
                                                ) : (
                                                    "Send OTP"
                                                )}
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
                                                variant="outlined"
                                                id="otp"
                                                name="otp"
                                                label="Enter OTP"
                                                value={formik.values.otp}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.otp && Boolean(formik.errors.otp)}
                                                helperText={formik.touched.otp && formik.errors.otp}
                                                inputProps={{ 
                                                    maxLength: 6,
                                                    inputMode: 'numeric',
                                                    pattern: '[0-9]*',
                                                    style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LockClockIcon color="action" />
                                                        </InputAdornment>
                                                    ),
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
                                                variant="contained"
                                                type="submit"
                                                disabled={loading}
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
                                                {loading ? <CircularProgress size={24} /> : "Verify & Activate"}
                                            </Button>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Divider sx={{ my: 2 }} />
                                            <Typography textAlign="center" variant="body2" color="text.secondary">
                                                Didn't receive code?{' '}
                                                <Link
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleResendOTP();
                                                    }}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        color: '#667eea',
                                                        fontWeight: 600,
                                                        textDecoration: 'none',
                                                        '&:hover': { textDecoration: 'underline' },
                                                    }}
                                                >
                                                    Resend OTP
                                                </Link>
                                            </Typography>
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


