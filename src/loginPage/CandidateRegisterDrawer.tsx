
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import {
    Button,
    CardContent,
    Grid,
    TextField,
    Typography,
    Box,
    Autocomplete,
    IconButton,
    SwipeableDrawer,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import api from "../utils/Url";
import { getISTDate } from "../utils/Constant";
import * as Yup from 'yup';
import ToastApp from "../ToastApp";

interface Props {
    open: boolean;
    onClose: () => void;
}

export function CandidateRegisterDrawer({ open, onClose }: Props) {
    const { t } = useTranslation();
    const [gender, setGender] = useState([{ value: -1, label: t("text.genderID") }]);
    const [showform, setShowform] = useState(true);

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
            toast.error("Failed to load genders.");
        }
    };

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


    const otpgeneratetypefour = async () => {
        const collectData = {
            ...formik.values,
            type: 4,
            onlinePatientID: "-1",
            userID: "2",
            formID: 2,
        };

        try {
            const response = await api.post(`/Online/AddOnlineLogin`, collectData);
            if (response.data.isSuccess === "True") {
                toast.success(response.data.msg || "OTP sent to email.");
                setShowform(false); // Show OTP form
            } else {
                toast.error(response.data.msg || "Failed to generate OTP.");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.msg || "Error generating OTP.");
        }
    };

    const otpgeneratetypefive = async () => {
        const collectData = {
            ...formik.values,
            type: 5,
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
        fName: Yup.string().trim().required(t("FirstName Is Required")),
        lName: Yup.string().trim().required(t("LastName Is Required")),
        password: Yup.string().trim().required(t("Password Is Required")),
        curMobileNo: Yup.string()
            .trim()
            .required(t("MobileNo IsRequired"))
            .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
        eMail: Yup.string()
            .trim()
            .required(t("eMail Is Required"))
            .email("Invalid email format"),
        dob: Yup.date()
            .required(t("DOB Is Required"))
            .max(new Date(), "Date of Birth cannot be in the future"),
        genderID: Yup.string()
            .required(t("Gender Is Required"))
            .test('is-not-default', t("Gender Is Required"), (value: any) => value !== "-1" && value),
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
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
              // Step 1: Register user
              const response = await api.post(`/Online/AddOnlineLogin`, { ...values, type: 1 });
          
              if (response.data.isSuccess) {
                toast.success(response.data.msg || "Registered successfully.");
          
                // Step 2: Generate OTP
                const otpResponse = await api.post(`/Online/AddOnlineLogin`, {
                  ...values,
                  type: 4,
                  onlinePatientID: "-1",
                  userID: "2",
                  formID: 2,
                });
          
                if (otpResponse.data.isSuccess) {
                  toast.success(otpResponse.data.msg || "OTP generated successfully.");
          
                  // ✅ Step 3: Send OTP email
                  const sendMailPayload = {
                    email: values.eMail,        // ✅ user's email
                    mobileNo: values.curMobileNo, // Optional if required
                    otp: "",                     // Let backend fetch from DB if needed
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
              } else {
                toast.error(response.data.msg || "Registration failed.");
              }
            } catch (error: any) {
              toast.error(error?.response?.data?.msg || "Error during registration.");
            }
          }
          




      
    });

    return (
        <>
            <SwipeableDrawer
                anchor="right"
                open={open}
                onClose={() => { }}
                onOpen={() => { }}
                slotProps={{
                    backdrop: {
                        style: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                    },
                }}
                PaperProps={{
                    style: {
                        boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.2)",
                        backgroundColor: "white",
                        width: '80%',
                    },
                }}
                style={{
                    zIndex: 1300,
                }}
            >
                <Box sx={{ backgroundColor: "whitesmoke" }}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            left: 8,
                            top: 8,
                            color: (theme: any) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon style={{ color: "red" }} />
                    </IconButton>
                </Box>
                <div>
                    <div
                        style={{
                            padding: "10px",
                            backgroundColor: "#ffffff",
                            marginTop: "3vh",
                        }}
                    >
                        <CardContent>
                            {showform && (
                                <>
                                    <Typography variant="h5" textAlign="center" style={{ fontSize: "18px", fontWeight: 500, marginBottom: "15px", color: "blue" }}>
                                        {t("Candidate Registration")}
                                    </Typography>
                                </>
                            )}

                            <form onSubmit={formik.handleSubmit}>
                                <ToastApp />
                                {showform ? (
                                    <Grid container spacing={2}>
                                        {/* First name */}
                                        <Grid item lg={4} xs={12}>
                                            <TextField
                                                id="fName"
                                                name="fName"
                                                value={formik.values.fName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder={t("text.FirstName")}
                                                size="small"
                                                fullWidth
                                                error={formik.touched.fName && Boolean(formik.errors.fName)}
                                                helperText={formik.touched.fName && formik.errors.fName}
                                                label={<span>{t("text.FirstName")} <span style={{ color: "red" }}>*</span></span>}
                                            />
                                        </Grid>

                                        {/* Middle name */}
                                        <Grid item lg={4} xs={12}>
                                            <TextField
                                                id="mName"
                                                name="mName"
                                                label={t("text.MiddleName")}
                                                value={formik.values.mName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder={t("text.MiddleName")}
                                                size="small"
                                                fullWidth
                                            />
                                        </Grid>

                                        {/* Last name */}
                                        <Grid item lg={4} xs={12}>
                                            <TextField
                                                id="lName"
                                                name="lName"
                                                value={formik.values.lName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder={t("text.lastName")}
                                                size="small"
                                                fullWidth
                                                error={formik.touched.lName && Boolean(formik.errors.lName)}
                                                helperText={formik.touched.lName && formik.errors.lName}
                                                label={<span>{t("text.lastName")} <span style={{ color: "red" }}>*</span></span>}
                                            />
                                        </Grid>

                                        {/* Password */}
                                        <Grid item lg={4} xs={12}>
                                            <TextField
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder={t("text.Password")}
                                                size="small"
                                                fullWidth
                                                error={formik.touched.password && Boolean(formik.errors.password)}
                                                helperText={formik.touched.password && formik.errors.password}
                                                label={<span>{t("text.Password")} <span style={{ color: "red" }}>*</span></span>}
                                            />
                                        </Grid>

                                        {/* Mobile Number */}
                                        <Grid item lg={4} xs={12}>
                                            <TextField
                                                id="curMobileNo"
                                                name="curMobileNo"
                                                value={formik.values.curMobileNo}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder={t("text.Mobile")}
                                                size="small"
                                                fullWidth
                                                inputProps={{ maxLength: 10 }}
                                                error={formik.touched.curMobileNo && Boolean(formik.errors.curMobileNo)}
                                                helperText={formik.touched.curMobileNo && formik.errors.curMobileNo}
                                                label={<span>{t("text.mobileNo")} <span style={{ color: "red" }}>*</span></span>}
                                            />
                                        </Grid>

                                        {/* Email */}
                                        <Grid item lg={4} xs={12}>
                                            <TextField
                                                id="eMail"
                                                name="eMail"
                                                type="email"
                                                value={formik.values.eMail}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder={t("text.EmailAddress")}
                                                size="small"
                                                fullWidth
                                                error={formik.touched.eMail && Boolean(formik.errors.eMail)}
                                                helperText={formik.touched.eMail && formik.errors.eMail}
                                                label={<span>{t("text.EmailAddress")} <span style={{ color: "red" }}>*</span></span>}
                                            />
                                        </Grid>

                                        {/* Gender */}
                                        <Grid item xs={12} sm={4} lg={4}>
                                            <Autocomplete
                                                id="genderID"
                                                options={gender}
                                                onChange={(_, newValue) => {
                                                    formik.setFieldValue("genderID", newValue?.value.toString() || "");
                                                }}
                                                onBlur={() => formik.setFieldTouched("genderID", true)}
                                                getOptionLabel={(option) => option.label || ""}
                                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                                fullWidth
                                                size="small"
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label={<span>{t("text.SelectGender")} <span style={{ color: "red" }}>*</span></span>}
                                                        error={formik.touched.genderID && Boolean(formik.errors.genderID)}
                                                        helperText={formik.touched.genderID && formik.errors.genderID}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        {/* Date of Birth */}
                                        <Grid item lg={4} xs={12}>
                                            <TextField
                                                id="dob"
                                                name="dob"
                                                type="date"
                                                value={formik.values.dob}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder={t("text.Dob")}
                                                size="small"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                error={formik.touched.dob && Boolean(formik.errors.dob)}
                                                helperText={formik.touched.dob && formik.errors.dob}
                                                label={<span>{t("text.Dob")} <span style={{ color: "red" }}>*</span></span>}
                                                inputProps={{ max: new Date().toISOString().split("T")[0] }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} container justifyContent="center" mt={2}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                disabled={formik.isSubmitting}
                                                sx={{ backgroundColor: "orange", color: "white", width: '200px' }}
                                            >
                                                {formik.isSubmitting ? t("Submitting...") : t("Register")}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <div>
                                        <Typography variant="h5" textAlign="center" style={{ fontSize: "18px", fontWeight: 500, marginBottom: "15px", color: "blue" }}>
                                            {t("OTP Verification")}
                                        </Typography>
                                        <Grid container spacing={2} justifyContent="center">
                                            <Grid item xs={12} container justifyContent="center">
                                                <TextField
                                                    id="otp"
                                                    name="otp"
                                                    value={formik.values.otp}
                                                    onChange={formik.handleChange}
                                                    placeholder={t("OTP")}
                                                    size="small"
                                                    inputProps={{ maxLength: 10 }}
                                                    label={<span>{t("OTP")} <span style={{ color: "red" }}>*</span></span>}
                                                    style={{ width: "300px" }}
                                                    error={formik.touched.otp && Boolean(formik.errors.otp)}
                                                    helperText={formik.touched.otp && formik.errors.otp}
                                                />
                                            </Grid>
                                            <Grid item xs={12} container justifyContent="center">
                                                <Button
                                                    type="button" // ✅ Prevents form resubmission
                                                    onClick={otpgeneratetypefive}
                                                    style={{
                                                        backgroundColor: "lightblue",
                                                        color: "black",
                                                        width: "150px",
                                                    }}
                                                >
                                                    {t("Verify")}
                                                </Button>

                                            </Grid>
                                        </Grid>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </div>
                </div>
            </SwipeableDrawer>
        </>
    );
}