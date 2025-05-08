import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import {
    Button,
    CardContent,
    Grid,
    TextField,
    Typography,
    Box,
    IconButton,
    SwipeableDrawer,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import api from "../utils/Url"; // Assuming correct path
import { getISTDate } from "../utils/Constant"; // Assuming correct path
import * as Yup from 'yup';
import ToastApp from "../ToastApp"; // Assuming correct path

interface Props {
    open: boolean;
    onClose: () => void;
}

export function InstActivateDrawer({ open, onClose }: Props) {
    const { t } = useTranslation();
    const { defaultValuestime } = getISTDate();
    const [toaster, setToaster] = useState(false); // Consider if this state is still needed if using react-toastify directly
    const [showform, setShowform] = useState(false);

    const handleClose = () => {
        // Reset form state on close if desired
        formik.resetForm();
        setShowform(false);
        onClose();
    };

    // --- Validation Schema ---
    // Now includes conditional OTP validation based on the 'type' field
    const validationSchema = Yup.object({
        mobileNo: Yup.string()
            .test(
                "required",
                t("MobileNo IsRequired"),
                function (value: any) {
                    return value && value.trim() !== "";
                }
            )
            .test(
                "valid-length",
                t("Mobile number must be exactly 10 digits"), // Use t() for translation
                function (value: any) {
                    return value && value.replace(/\D/g, "").length === 10;
                }
            ),
        emailID: Yup.string()
            .required(t("EmailId Is Required")) // Use t()
            .test(
                "is-valid-email",
                t("Invalid email format"), // Use t()
                function (value: any) {
                  
                    if (!value) return true; // Or false if always required
                    const trimmedValue = value.trim();
                  
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue);
                }
            ),
        otp: Yup.string().when('type', {
            is: 5, // Make OTP required only when type is 5
            then: (schema) => schema
                .required(t("OTP Is Required")) // Use t()
                .matches(/^[0-9]+$/, t("OTP must contain only digits")) // Ensure digits only
                .min(4, t("OTP must be at least 4 digits")) // Example minimum length
                .max(6, t("OTP must be at most 6 digits")), // Example maximum length
            otherwise: (schema) => schema.notRequired(), // Not required for type 4
        }),
    });

    // --- Formik Setup ---
    const formik = useFormik({
        initialValues: {
            "firstName": "",
            "lastName": "",
            "candPassword": "",
            "mobileNo": "",
            "emailID": "",
            "dob": defaultValuestime || "",
            "panNo": "",
            "aadhaarNo": "",
            "maritalStatusID": -1,
            "genderID": -1,
            "instUiqueID": "",
            "branchID": -1,
            "otherBranchName": "",
            "instName": "",
            "candidateAddress": "",
            "instAddress": "",
            "stateID": -1,
            "districtID": -1,
            "cityID": -1,
            "areaID": -1,
            "landmark": "",
            "sessionName": "",
            "candidateID": "-1",
            "profileImage": "",
            "userID": "-1",
            "formID": 2,
            "type": 4, // Default type is 4
            "otp": ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            console.log("Submitting with values:", values); // Log the actual submitted values
            // setToaster(false); // Reset toaster state if needed

            try {
                // Use the 'type' from the values object, which was set before submission
                const response = await api.post(
                    `Candidate/AddCandidate`, // Consider if the endpoint needs to change based on 'type'
                    values
                );

                if (response.data.isSuccess) {
                    toast.success(response.data.msg);
                    if (values.type === 4) {
                        // If it was the first step (type 4), show the OTP form
                        setShowform(true);
                    } else if (values.type === 5) {
                        // If it was the verification step (type 5), close the drawer or navigate
                        toast.info("Verification successful!"); // Example feedback
                        handleClose(); // Close the drawer on successful verification
                        // navigate("home"); // Or navigate if needed
                    }
                } else {
                    toast.error(response.data.msg);
                }
            } catch (error) {
                // setToaster(true); // Consider if this state is useful
                console.error("API Error:", error);
              
                const errorMsg = error.response?.data?.msg || t("An error occurred. Please try again.");
                toast.error(errorMsg);
            } finally {
                setSubmitting(false); // Ensure form is re-enabled after submission attempt
            }
        },
    });
   
    const requiredFieldsInitial = ["mobileNo", "emailID"];
    const requiredFieldsOTP = ["otp"]; // OTP is only required visually/validation-wise in the second step

    const handleInitialSubmit = () => {
        formik.setFieldValue('type', 4); // Set type to 4 for the initial step
        formik.handleSubmit(); // Trigger Formik's submit handler (validates then calls onSubmit if valid)
    };

    const handleVerifySubmit = () => {
        formik.setFieldValue('type', 5); // Set type to 5 for the verification step
        formik.handleSubmit(); // Trigger Formik's submit handler (validates then calls onSubmit if valid)
    };


    return (
        <>
            <SwipeableDrawer
                anchor="right"
                open={open}
                onClose={() => { /* Keep empty or call handleClose if direct close should reset */ }}
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
                        width: '50%',
                    },
                }}
                style={{
                    zIndex: 1300,
                }}
            >

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, backgroundColor: "whitesmoke" }}>
                     {/* Title moved inside Box for better alignment with close button */}
                     <Typography variant="h6" sx={{ ml: 2 }}> {/* Adjust styling as needed */}
                        {t("Institute User Activate")}
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose} // Use the reset handler
                        sx={{ color: (theme: any) => theme.palette.grey[500] }}
                    >
                        <CloseIcon style={{ color: "red" }} />
                    </IconButton>
                </Box>

                {/* Form Content */}
                <div style={{ padding: "10px", marginTop: "1vh" }}>
                    <CardContent>
                        {/* Removed redundant title */}
                        {/* <Typography variant="h5" textAlign="center" style={{ fontSize: "18px", fontWeight: 500, marginBottom: "15px", color: "blue" }}>
                           Institute User Activate
                        </Typography> */}

                        <div style={{
                            padding: "10px",
                            backgroundColor: "#ffffff",
                            borderRadius: "5px",
                            border: "0.5px solid #FF7722",
                            // marginTop: "3vh", // Reduced margin as title is removed
                        }}>
                            {/* Use formik.isSubmitting to disable elements during submission */}
                            <fieldset disabled={formik.isSubmitting} style={{ border: 'none', padding: 0, margin: 0 }}>
                                <ToastApp />
                                {!showform ? (
                                    // --- Initial Form (Mobile & Email) ---
                                    <Grid
                                        container // Use container directly
                                        spacing={2}
                                        justifyContent="center"
                                        alignItems="center"
                                        direction="column"
                                    >
                                        <Grid item xs={12} sx={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: 'column', alignItems: 'center' }}>
                                            <TextField
                                                fullWidth // Make text field take available width
                                                id="mobileNo"
                                                name="mobileNo"
                                                value={formik.values.mobileNo}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur} // Add onBlur for touch state
                                                placeholder={t("text.Mobile")}
                                                size="small"
                                                inputProps={{ maxLength: 10 }}
                                                label={
                                                    <span>
                                                        {t("text.mobileNo")}{" "}
                                                        {requiredFieldsInitial.includes("mobileNo") && (
                                                            <span style={{ color: formik.values.mobileNo ? "green" : "red" }}>*</span>
                                                        )}
                                                    </span>
                                                }
                                                error={formik.touched.mobileNo && Boolean(formik.errors.mobileNo)}
                                                // helperText={formik.touched.mobileNo && formik.errors.mobileNo} // Display error below field
                                                sx={{
                                                    backgroundColor: "white",
                                                    maxWidth: "300px", // Max width for consistency
                                                }}
                                            />
                                            {/* Display error message separately if helperText is not used */}
                                            {formik.touched.mobileNo && formik.errors.mobileNo && (
                                                <Typography variant="caption" color="error" sx={{ display: 'block', textAlign: 'center', maxWidth: '300px', width: '100%' }}>
                                                    {formik.errors.mobileNo}
                                                </Typography>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} sx={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: 'column', alignItems: 'center' }}>
                                            <TextField
                                                fullWidth
                                                id="emailID"
                                                name="emailID"
                                                value={formik.values.emailID}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder={t("text.EmailAddress")}
                                                size="small"
                                                label={
                                                    <span>
                                                        {t("text.EmailAddress")}{" "}
                                                        {requiredFieldsInitial.includes("emailID") && (
                                                            <span style={{ color: formik.values.emailID ? "green" : "red" }}>*</span>
                                                        )}
                                                    </span>
                                                }
                                                error={formik.touched.emailID && Boolean(formik.errors.emailID)}
                                                // helperText={formik.touched.emailID && formik.errors.emailID}
                                                sx={{
                                                    backgroundColor: "white",
                                                    maxWidth: "300px",
                                                }}
                                            />
                                            {formik.touched.emailID && formik.errors.emailID && (
                                                <Typography variant="caption" color="error" sx={{ display: 'block', textAlign: 'center', maxWidth: '300px', width: '100%' }}>
                                                    {formik.errors.emailID}
                                                </Typography>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                                            <Button
                                                type="button" // Changed from submit
                                                onClick={handleInitialSubmit} // Use specific handler
                                                disabled={formik.isSubmitting} // Disable while submitting
                                                sx={{
                                                    backgroundColor: "lightblue", // Use sx for styling
                                                    color: "black",
                                                    width: "150px",
                                                    '&:hover': { backgroundColor: 'deepskyblue' }, // Example hover
                                                }}
                                            >
                                                {formik.isSubmitting && formik.values.type === 4 ? t("Submitting...") : t("text.save")}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    // --- Verification Form (OTP) ---
                                    <Grid
                                        container
                                        spacing={2}
                                        justifyContent="center"
                                        alignItems="center"
                                        direction="column"
                                    >
                                        {/* Optionally display Mobile/Email read-only here if needed */}
                                         <Typography variant="body2" sx={{ mb: 1, color: 'grey' }}>
                                            {t("Enter OTP sent to")}  {formik.values.emailID}
                                        </Typography>

                                        <Grid item xs={12} sx={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: 'column', alignItems: 'center' }}>
                                            <TextField
                                                fullWidth
                                                id="otp"
                                                name="otp"
                                                value={formik.values.otp}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder={t("Enter OTP")} // More specific placeholder
                                                size="small"
                                                inputProps={{ maxLength: 6 }} // Adjust maxLength if needed
                                                label={
                                                    <span>
                                                        {t("OTP")}{" "}
                                                        {/* Asterisk indicates required for this step */}
                                                        <span style={{ color: formik.values.otp ? "green" : "red" }}>*</span>
                                                    </span>
                                                }
                                                error={formik.touched.otp && Boolean(formik.errors.otp)}
                                                // helperText={formik.touched.otp && formik.errors.otp}
                                                sx={{
                                                    backgroundColor: "white",
                                                    maxWidth: "300px",
                                                }}
                                            />
                                             {formik.touched.otp && formik.errors.otp && (
                                                <Typography variant="caption" color="error" sx={{ display: 'block', textAlign: 'center', maxWidth: '300px', width: '100%' }}>
                                                    {formik.errors.otp}
                                                </Typography>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                                            <Button
                                                type="button" // Changed from submit
                                                onClick={handleVerifySubmit} // Use specific handler
                                                disabled={formik.isSubmitting} // Disable while submitting
                                                sx={{
                                                    backgroundColor: "lightblue",
                                                    color: "black",
                                                    width: "150px",
                                                    '&:hover': { backgroundColor: 'deepskyblue' },
                                                }}
                                            >
                                                 {formik.isSubmitting && formik.values.type === 5 ? t("Verifying...") : t("Verify")}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )}
                            </fieldset>
                        </div>
                    </CardContent>
                </div>
            </SwipeableDrawer >
        </>
    );
}