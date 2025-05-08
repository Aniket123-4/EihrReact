import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
    Autocomplete,
    Box,
    Button,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../../../utils/Url";
import { useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { getId, getISTDate } from "../../../utils/Constant";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDataGrid from "../../../utils/CustomDatagrid";
import CustomLabel from "../../../CustomLable";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import DataGrids from "../../../utils/Datagrids";



export default function ChangePassword() {
    const { i18n, t } = useTranslation();
    const { defaultValuestime } = getISTDate();

    const user:any =   JSON.parse(localStorage.getItem("user") as string)











    const validationSchema = Yup.object({
        LoginName: Yup.string().test(
            "required",
            "Login Name Is Required",
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),


        NewPwd: Yup.string().test(
            "required",
            "New Password Required",
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),

        OldPwd: Yup.string().test(
            "required",
            "Old Password Required",
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
    });


    const formik = useFormik({
        initialValues: {
            LoginName:user?.verifiedUser?.loginName,
            NewPwd: "",
            OldPwd: "",

        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {

            const response = await api.post(
                `Login/ChangePassword`,
                values
            );
            if (response.data.isSuccess) {

                toast.success(response.data.msg);
                formik.resetForm();

            } else {

                toast.error(response.data.msg);
            }
        },
    });




    const handleSubmitWrapper = async () => {
        await formik.handleSubmit();
    };

   

    return (
        <>
            <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
                <Card
                    style={{
                        width: "100%",
                        height: "50%",
                        backgroundColor: "#E9FDEE",
                        border: ".5px solid #2B4593 ",
                        marginTop: "5px",
                    }}
                >
                    <Paper
                        sx={{
                            width: "100%",
                            overflow: "hidden",
                        }}
                        style={{ padding: "10px" }}
                    >
                        <ConfirmDialog />

                        <Grid item xs={12} container spacing={2}>
                            <Grid item lg={10} md={10} xs={12}>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{ padding: "20px" }}
                                    align="left"
                                >
                                    {t("text.ChangePassword")}
                                </Typography>
                            </Grid>

                            <Grid item lg={2} md={2} xs={12} marginTop={2}>

                            </Grid>
                        </Grid>
                        <Divider />

                        <Box height={10} />

                        <form onSubmit={formik.handleSubmit}>
                            <Grid item xs={12} container spacing={3}>

                         
                               

                                <Grid item xs={4} sm={4}>
                                    <TextField
                                        type="text"
                                        value={formik.values.LoginName}
                                        name="LoginName"
                                        id="LoginName"
                                        label={<CustomLabel
                                            text={t("text.LoginName")}
                                            required={true}
                                          />}
                                        placeholder={t("text.LoginName")}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white", }}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.LoginName && formik.errors.LoginName ? (
                                        <div style={{ color: "red", margin: "5px" }}>
                                            {String(formik.errors.LoginName)}
                                        </div>
                                    ) : null}
                                </Grid>



                                <Grid item xs={4} sm={4}>
                                    <TextField
                                        type="text"
                                        value={formik.values.OldPwd}
                                        name="OldPwd"
                                        id="OldPwd"
                                        label={<CustomLabel
                                            text={t("text.OldPassword")}
                                            required={true}
                                          />}
                                        placeholder={t("text.OldPassword")}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white", }}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.OldPwd && formik.errors.OldPwd ? (
                                        <div style={{ color: "red", margin: "5px" }}>
                                            {formik.errors.OldPwd}
                                        </div>
                                    ) : null}
                                </Grid>


                                <Grid item xs={4} sm={4}>
                                    <TextField
                                        type="password"
                                        value={formik.values.NewPwd}
                                        name="NewPwd"
                                        id="NewPwd"
                                        label={<CustomLabel
                                            text={t("text.NewPassword")}
                                            required={true}
                                          />}
                                        placeholder={t("text.NewPassword")}
                                        size="small"
                                        fullWidth
                                        style={{ backgroundColor: "white", }}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.NewPwd && formik.errors.NewPwd ? (
                                        <div style={{ color: "red", margin: "5px" }}>
                                            {formik.errors.NewPwd}
                                        </div>
                                    ) : null}
                                </Grid>





                                <Grid item xs={2} sx={{ m: -1 }}>


                                    <ButtonWithLoader
                                        buttonText={t("text.save")}
                                        onClickHandler={handleSubmitWrapper}
                                        fullWidth={true}
                                    />

                                </Grid>
                            </Grid>
                        </form>


                    </Paper>
                </Card>
            </Grid>
            <ToastApp />
        </>
    );
}
