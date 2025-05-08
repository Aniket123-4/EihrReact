
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
    Button,
    CardContent,
    Grid,
    TextField,
    Typography,
    Box,
    IconButton,
    SwipeableDrawer,
    InputAdornment,
    CircularProgress,
    Link,
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

interface Props {
    open: boolean;
    onClose: () => void;
}

export function AddInstUser({ open, onClose }: Props) {
    const { t } = useTranslation();
    const [showform, setShowform] = useState(true);

    const Sendemail = async () => {
        const collectData = {
            "email": "",
            "mobileNo": "",
            "otp": ""
        };
        const response = await api.post(`Login/SendMail`, collectData);
        if (response?.data) {
            setShowform(false);
        }
    };

    // const otpgeneratetypefour = async () => {
    //     const collectData = {
    //         ...formik.values,
    //         type: 4,
    //         onlinePatientID: "-1",
    //         userID: "2",
    //         formID: 2,
    //     };

    //     try {
    //         const response = await api.post(`/Online/AddOnlineLogin`, collectData);
    //         if (response.data.isSuccess === "True") {
    //             toast.success(response.data.msg || "OTP sent to email.");
    //             setShowform(false); // Show OTP form
    //         } else {
    //             toast.error(response.data.msg || "Failed to generate OTP.");
    //         }
    //     } catch (error: any) {
    //         toast.error(error?.response?.data?.msg || "Error generating OTP.");
    //     }
    // };

    const otpgeneratetypefive = async () => {
        const collectData = {
            ...formik.values,
            type: 4,
            onlinePatientID: "-1",
            userID: "2",
            formID: 2,
        };

        try {
            const response = await api.post(`/Online/AddOnlineLogin`, collectData);
            if (response.data.isSuccess) {
                toast.success(response.data.msg || "Registration completed!");
                formik.resetForm();
                setShowform(true);
                onClose();
            } else {
                toast.error(response.data.msg || "Invalid OTP.");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.msg || "Error verifying OTP.");
        }
    };

    const handleClose = () => {
        formik.resetForm();
        setShowform(true);
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
    });

    const formik = useFormik({
        initialValues: {
            "onlinePatientID": 0,
            "eMail": "",
            "password": "",
            "curMobileNoCC": "",
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
            try {
                // Step 2: Generate OTP
                const otpResponse = await api.post(`/Online/AddOnlineLogin`, {
                  ...values,
                  type: 4,
                  
                });
          
                if (otpResponse.data.isSuccess) {
                  toast.success(otpResponse.data.msg || "OTP generated successfully.");
          
                  // ✅ Step 3: Send OTP email
                  const sendMailPayload = {
                    email: values.eMail,       
                    mobileNo: values.curMobileNo, 
                    otp: "",                     
                  };
          
                  const mailResponse = await api.post(`Login/SendMail`, sendMailPayload);
                  if (mailResponse?.data) {
                    toast.success("OTP sent to email.");
                    setShowform(false); // Show OTP form
                  } else {
                    toast.error("Failed to send OTP email.");
                  }
          
                } else {
                  toast.error(otpResponse.data.msg || "Failed to generate OTP.");
                }
              
            } catch (error: any) {
              toast.error(error?.response?.data?.msg || "Error during registration.");
            }
            finally {
                setSubmitting(false);
            }
          }
        
    });
    return (
        <>
       <SwipeableDrawer
    anchor="right"
    open={open}
    onClose={handleClose}
    onOpen={() => {}}
    transitionDuration={300}
    slotProps={{
        backdrop: { style: { backgroundColor: "rgba(0, 0, 0, 0.7)" } },
    }}
    PaperProps={{
        style: {
            width: '400px',
            maxWidth: '90vw',
          //  boxShadow: theme.shadows[10],
            borderRadius: '12px 0 0 12px',
        },
    }}
>
    <Box sx={{ 
        p: 2,
        bgcolor: 'background.paper',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    }}>
        
        <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${useTheme().palette.divider}`,
         //   borderBottom: `1px solid ${theme.palette.divider}`,
            pb: 2
        }}>
            <Typography variant="h6" sx={{ 
                fontWeight: 600,
            //    color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                {showform ? (
                    <>
                        <PersonAddIcon fontSize="small" />
                        {t("Activate Patient")}
                    </>
                ) : (
                    <>
                        <VerifiedUserIcon fontSize="small" />
                        {t("OTP Verification")}
                    </>
                )}
            </Typography>
            <IconButton onClick={handleClose} size="small">
                <CloseIcon sx={{ color: 'error.main' }} />
            </IconButton>
        </Box>

        <CardContent sx={{ flex: 1, overflow: 'auto' }}>
            <form onSubmit={formik.handleSubmit}>
                <ToastApp />
                {showform ? (
                    <Grid container spacing={3}>
                        {/* Mobile Number */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                id="curMobileNo"
                                name="curMobileNo"
                                label={t("Mobile Number")}
                                placeholder="+91 9876543210"
                                value={formik.values.curMobileNo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.curMobileNo && Boolean(formik.errors.curMobileNo)}
                                helperText={
                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {formik.touched.curMobileNo && formik.errors.curMobileNo && (
                                            <ErrorOutlineIcon fontSize="small" color="error" />
                                        )}
                                        {formik.touched.curMobileNo && formik.errors.curMobileNo}
                                    </Box>
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIphoneIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{ maxLength: 10 }}
                            />
                        </Grid>
                        {/* Email */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                id="eMail"
                                name="eMail"
                                type="email"
                                label={t("Email Address")}
                                placeholder="name@example.com"
                                value={formik.values.eMail}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.eMail && Boolean(formik.errors.eMail)}
                                helperText={
                                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {formik.touched.eMail && formik.errors.eMail && (
                                            <ErrorOutlineIcon fontSize="small" color="error" />
                                        )}
                                        {formik.touched.eMail && formik.errors.eMail}
                                    </Box>
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        {/* Submit Button */}
                        <Grid item xs={12} sx={{ mt: 4 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                disabled={formik.isSubmitting}
                                sx={{
                                    py: 1.5,
                                    borderRadius: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: 1.1,
                                    '&:hover': {
                                        boxShadow: 2,
                                    }
                                }}
                            >
                                {formik.isSubmitting ? (
                                    <CircularProgress size={24} sx={{ color: 'white' }} />
                                ) : (
                                    t("Submit")
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                ) : (
                    /* OTP Verification */
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                            {t("We've sent a verification code to your contact details")}
                        </Typography>

                        <Grid container spacing={3} justifyContent="center">
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    id="otp"
                                    name="otp"
                                    label={t("Enter OTP")}
                                    value={formik.values.otp}
                                    onChange={formik.handleChange}
                                    inputProps={{ 
                                        maxLength: 6,
                                        inputMode: 'numeric',
                                        pattern: '[0-9]*'
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockClockIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ maxWidth: 300 }}
                                    error={formik.touched.otp && Boolean(formik.errors.otp)}
                                    helperText={formik.touched.otp && formik.errors.otp}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    onClick={(e) => {
                                        e.preventDefault(); // Add this line
                                        otpgeneratetypefive();
                                    }}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: '8px',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1.1,
                                        bgcolor: 'success.main',
                                        '&:hover': {
                                            bgcolor: 'success.dark',
                                        }
                                    }}
                                >
                                    {t("Verify OTP")}
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                                    {t("Didn't receive code?")}{' '}
                                    <Link href="#" sx={{ cursor: 'pointer' }}>
                                        {t("Resend")}
                                    </Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </form>
        </CardContent>
    </Box>
</SwipeableDrawer>
        </>
    );
}