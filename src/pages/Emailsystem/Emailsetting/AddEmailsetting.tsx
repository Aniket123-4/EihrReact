import {
    Button,
    CardContent,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { Divider } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import api from "../../../utils/Url";
import CustomLabel from "../../../CustomLable";
import React from "react";

type Props = {};

const AddEmailsetting = (props: Props) => {
    const { t } = useTranslation();

    let navigate = useNavigate();

    const back = useNavigate();







    const [toaster, setToaster] = useState(false);

    // useEffect(() => {
    //   getRole();
    //   getGender();
    //   getUserType();
    // }, []);

    const validationSchema = Yup.object({
        name: Yup.string().test(
            "required",
            "Name Is Required",
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),
        email: Yup.string().test(
            "required",
           "Email Is Required",
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),

        password: Yup.string().test(
            "required",
           "Password Is Required",
            function (value: any) {
                return value && value.trim() !== "";
            }
        ),

    });



    const formik = useFormik({
        initialValues: {
            "id": 0,
            "name": "",
            "email": "",
            "password": "",
            "host": "",
            "port": 0,
            "isTls": true,
            "isSSl": true,
            "isActive": false,
            "srno": 0
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {


            const response = await api.post(
                `Comm/UpsertEmailSetting`,
                values
            );
            if (response.data.status === 1) {
                setToaster(false);
                toast.success(response.data.message);
                navigate("/emailsystem/emailsetting");
            } else {
                setToaster(true);
                toast.success(response.data.message);
            }
        },
    });



    return (
        <div>
            <div
                style={{
                    padding: "-5px 5px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "5px",
                    border: ".5px solid #ff7722",
                    marginTop: "3vh"
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        textAlign="center"
                        style={{ marginTop: "10px", fontSize: "18px", fontWeight: 500 }}
                    >
                        {t("text.AddEmailSetting")}
                    </Typography>
                    <Grid xs={4} sm={12} item>
                        <Typography style={{ marginTop: "-75px" }}>
                            <Button
                                type="submit"
                                onClick={() => back(-1)}
                                variant="contained"
                                style={{
                                    marginBottom: 15,
                                    marginTop: "45px",
                                    backgroundColor: `var(--header-background)`,
                                    width: 20,
                                }}
                            >
                                <ArrowBackSharpIcon />
                            </Button>
                        </Typography>
                    </Grid>
                    <Divider />
                    <br />
                    <form onSubmit={formik.handleSubmit}>
                        {toaster === false ? "" : <ToastApp />}
                        <Grid item xs={12} container spacing={2}>
                            <Grid xs={12} sm={4} item>

                                <TextField
                                    id="name"
                                    name="name"
                                    label={<CustomLabel text={t("text.Name")} required={false} />}
                                    value={formik.values.name}
                                    placeholder={t("text.Name")}
                                    size="small"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                                {formik.touched.name && formik.errors.name ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.name}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid xs={12} sm={4} item>

                                <TextField
                                    id="email"
                                    name="email"
                                    label={<CustomLabel text={t("text.Email")} required={false} />}
                                    value={formik.values.email}
                                    placeholder={t("text.Email")}
                                    size="small"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />


                                {formik.touched.email && formik.errors.email ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.email}
                                    </div>
                                ) : null}
                            </Grid>


                            <Grid xs={12} sm={4} item>

                                <TextField
                                    id="password"
                                    name="password"
                                    label={<CustomLabel text={t("text.Password")} required={false} />}
                                    value={formik.values.password}
                                    placeholder={t("text.Password")}
                                    type="password"
                                    size="small"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                                {formik.touched.password && formik.errors.password ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.password}
                                    </div>
                                ) : null}
                            </Grid>


                            <Grid item lg={4} xs={12}>
                                <TextField
                                    id="host"
                                    name="host"
                                    label={<CustomLabel text={t("text.Host")} required={false} />}
                                    value={formik.values.host}
                                    placeholder={t("text.Host")}
                                    size="small"
                                    fullWidth
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </Grid>


                            <Grid item lg={4} xs={12}>
                                    <TextField
                                        id="port"
                                        name="port"
                                        label={<CustomLabel text={t("text.Port")} required={false} />}
                                        value={formik.values.port}
                                        placeholder={t("text.Port")}
                                        size="small"
                                        fullWidth
                                        onChange={(e:any) => {
                                            formik.setFieldValue('port',parseInt(e.target.value))

                                        }}
                                        onBlur={formik.handleBlur}
                                    />
                                </Grid>



                            <Grid xs={12} item>
                                <div style={{ justifyContent: "space-between", flex: 2 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        style={{
                                            width: "48%",
                                            backgroundColor: `var(--header-background)`,
                                            margin: "1%",
                                        }}
                                    >
                                        {t("text.save")}
                                    </Button>

                                    <Button
                                        type="reset"
                                        variant="contained"
                                        style={{
                                            width: "48%",
                                            backgroundColor: "#F43F5E",
                                            margin: "1%",
                                        }}
                                        onClick={() => formik.resetForm()}
                                    >
                                        {t("text.reset")}
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </div>
        </div>
    );
};
export default AddEmailsetting;
