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
import api from "../utils/Url";
import { getISTDate } from "../utils/Constant";
import * as Yup from 'yup';
import ToastApp from "../ToastApp";

interface Props {
    open: boolean;
    onClose: () => void;
}

export function CandidateActivateDrawer({ open, onClose }: Props) {
    const handleClose = () => {
        onClose();
    };

    const { t } = useTranslation();
    const { defaultValuestime } = getISTDate();
    const [toaster, setToaster] = useState(false);
    const [showform, setShowform] = useState(false);


    const validationSchema = Yup.object({
        otp: Yup.string()
            .trim()
            .required(t("Otp Is Required"))

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
            "userID": "-1",
            "formID": 2,
            "type": 5,
            "otp": ""
        },
        validationSchema: validationSchema,
        //  enableReinitialize: true,

        onSubmit: async (values) => {
            console.log("🚀 ~ onSubmit: ~ values:", values)
            try {
                const response = await api.post(
                    `Online/AddOnlineLogin`,
                    values
                );
                if (response.data.isSuccess) {
                    toast.success(response.data.msg);
                    // setShowform(true);
                    toast.info("Verification successful!");
                    handleClose();

                } else {
                    toast.error(response.data.msg);
                }
            } catch (error) {
                setToaster(true);
                console.error("Error:", error);
                toast.error("An error occurred. Please try again.");
            }
        },
    });

    const requiredFields = [
      
        "otp",
    ];


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
                        width: '50%',
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
                        {" "}
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
                            <Typography variant="h5" textAlign="center" style={{ fontSize: "18px", fontWeight: 500, marginBottom: "15px", color: "blue" }}>
                                {t("Candidate Activate")}
                            </Typography>


                           
                            <div style={{
                                padding: "10px",
                                backgroundColor: "#ffffff",
                                borderRadius: "5px",
                                border: "0.5px solid #FF7722",
                                marginTop: "3vh",
                            }}>
                                <form onSubmit={formik.handleSubmit}>
                                    <ToastApp />


                                    <Grid
                                        item
                                        xs={12}
                                        container
                                        spacing={2}
                                        justifyContent="center"
                                        alignItems="center"
                                        direction="column" // Stack children vertically
                                    >

                                        <Grid item lg={12} xs={12} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                            <TextField
                                                id="otp"
                                                name="otp"
                                                value={formik.values.otp}
                                                onChange={formik.handleChange}
                                                placeholder={t("OTP")}
                                                size="small"
                                                inputProps={{ maxLength: 10 }}
                                                label={
                                                    <span>
                                                        {t("OTP")}{" "}
                                                        {requiredFields.includes("otp") && (
                                                            <span
                                                                style={{
                                                                    color: formik.values.otp ? "green" : "red",
                                                                }}
                                                            >
                                                                *
                                                            </span>
                                                        )}
                                                    </span>
                                                }
                                                style={{
                                                    backgroundColor: "white",
                                                    borderColor:
                                                        formik.touched.otp && formik.errors.otp
                                                            ? "red"
                                                            : "initial",
                                                    width: "300px",
                                                }}
                                            />
                                        </Grid>
                                        {formik.touched.otp && formik.errors.otp ? (
                                            <div style={{ color: "red", margin: "5px" }}>{formik.errors.otp}</div>
                                        ) : null}


                                        <Grid item lg={4} sm={4} xs={12} style={{ display: "flex", justifyContent: "center" }}>
                                            <Button
                                                type="submit"
                                                style={{
                                                    backgroundColor: "lightblue",
                                                    color: "black",
                                                   
                                                    width: "150px", // Optional width for consistency
                                                }}
                                            >
                                                {t("Verify")}
                                            </Button>
                                        </Grid>
                                    </Grid>

                                </form>
                            </div>


                        </CardContent>
                    </div>
                </div>

            </SwipeableDrawer >
        </>
    );
}