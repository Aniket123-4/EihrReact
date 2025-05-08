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
import React from "react";

type Props = {};

const RoleFormPermission = (props: Props) => {
    const { t } = useTranslation();


    const [option1, setOption1] = useState([{ value: "-1", label: t("text.SelectForm") }]);

    const [option3, setOption3] = useState([{ value: "-1", label: t("text.SelectDesignation") }]);

    const [option4, setOption4] = useState([{ value: "-1", label: t("text.SelectSection") }]);



    let navigate = useNavigate();




    const getForm = () => {

        const collectData = {
            "collegeID": "1",
            "packageID": "-1",
            "mModuleID": "-1",
            "formID": "-1"
        }

        api
            .post(`Login/GetForm`, collectData)
            .then((res) => {
                const arr: any = [];
                console.log("result" + JSON.stringify(res.data.data));
                for (let index = 0; index < res.data.data.length; index++) {
                    arr.push({
                        label: res.data.data[index]["displayName"],
                        value: res.data.data[index]["formID"],

                    });
                }
                setOption1(arr);
            });
    };


    const getDesignation = () => {

        api
            .get(`Login/GetDesignation?DesigID=-1`)
            .then((res) => {
                const arr: any = [];
                console.log("result" + JSON.stringify(res.data.data));
                for (let index = 0; index < res.data.data.length; index++) {
                    arr.push({
                        label: res?.data?.data[index]["desigName"],
                        value: res?.data?.data[index]["desigID"]

                    });
                }
                setOption3(arr);
            });
    };



    const getSection = () => {
        const collectData = {
            "sectionID": "-1",
            "type": "1"
        }

        api
            .post(`Login/GetSectionTree`, collectData)
            .then((res) => {
                const arr: any = [];
                console.log("result" + JSON.stringify(res?.data));
                for (let index = 0; index < res?.data?.length; index++) {
                    arr.push({
                        label: res?.data[index]["sectionName"],
                        value: res?.data[index]["sectionID"]

                    });
                }
                setOption4(arr);
            });
    };


    const [toaster, setToaster] = useState(false);

    useEffect(() => {
        getForm();

        getDesignation();
        getSection();
    }, []);



    const handleForm = (event: any, newValue: any) => {


        if (!newValue || !Array.isArray(newValue)) {
            setOption1([]);
            formik.setFieldValue("formID", []);
            return;
        }

        const newRoles = newValue?.map((item: any) => ({
            "rowID": item?.value.toString() || "",
            "rowValue": item?.label || "",
            "isSelected": true
        }));

        //console.log("check new role", newRoles);
        formik.setFieldValue("formID", newRoles);
    };





    const handleDesignation = (event: any, newValue: any) => {

        if (!newValue || !Array.isArray(newValue)) {
            setOption3([]);
            formik.setFieldValue("desigID", []);
            return;
        }

        const newRoles = newValue?.map((item: any) => ({
            "rowID": item?.value.toString() || "",
            "rowValue": item?.label || "",
            "isSelected": true
        }));
        // console.log("check new role", newRoles);
        formik.setFieldValue("desigID", newRoles);
    };




    const handleSection = (event: any, newValue: any) => {

        if (!newValue || !Array.isArray(newValue)) {
            setOption4([]);
            formik.setFieldValue("sectionID", []);
            return;
        }

        const newRoles = newValue?.map((item: any) => ({
            "rowID": item?.value.toString() || "",
            "rowValue": item?.label || "",
            "isSelected": true
        }));
        // console.log("check new role", newRoles);
        formik.setFieldValue("sectionID", newRoles);
    };







    const formik = useFormik({
        initialValues: {

            "formID": [],
            "sectionID": [],
            "desigID": [],
            "type": "1",
            "userID": "-1",
            "userFormID": "-1"

        },

        onSubmit: async (values) => {


            const response = await api.post(
                `Login/UpdateFormRight`,
                values
            );
            if (response?.data?.isSuccess) {
                setToaster(false);
                toast.success(response.data.msg);
                // navigate("/UserManagement/UserManagement");
                formik.resetForm();
            } else {
                setToaster(true);
                toast.error(response.data.mesg);
            }
        },
    });



    return (
        <div style={{ backgroundColor: 'white' }}>
            <div
                style={{
                    padding: "-5px 5px",
                    backgroundColor: "white", //Ensuring white background
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
                        {t("text.RoleFormPermission")}
                    </Typography>
                    <Grid xs={4} sm={12} item>
                        <Typography style={{ marginTop: "-75px" }}>
                            <Button
                                type="submit"
                                onClick={() => navigate(-1)}
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
                                <Autocomplete
                                    multiple
                                    disablePortal
                                    id="combo-box-demo"
                                    options={option1}
                                    fullWidth
                                    size="small"
                                    onChange={handleForm}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.SelectForm")}

                                                </span>
                                            }
                                        />
                                    )}
                                />

                            </Grid>



                            <Grid xs={12} sm={4} item>
                                <Autocomplete
                                    multiple
                                    disablePortal
                                    id="combo-box-demo"
                                    options={option3}
                                    fullWidth
                                    size="small"
                                    onChange={handleDesignation}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.SelectDesignation")}

                                                </span>
                                            }
                                        />
                                    )}
                                />

                            </Grid>






                            <Grid xs={12} sm={4} item>
                                <Autocomplete
                                    multiple
                                    disablePortal
                                    id="combo-box-demo"
                                    options={option4}
                                    fullWidth
                                    size="small"
                                    onChange={handleSection}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.SelectSection")}

                                                </span>
                                            }
                                        />
                                    )}
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
export default RoleFormPermission;
