import React, { useEffect, useState } from "react";
import {
    Button,
    CardContent,
    Grid,
    TextField,
    Typography,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { Divider } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import api from "../../../utils/Url";

type Props = {};


const UserRolePermission = (props: Props) => {
    const { t } = useTranslation();

    const [option1, setOption1] = useState([{ value: "-1", label: t("text.SelectForm") }]);
    const [option3, setOption3] = useState([{ value: "-1", label: t("text.SelectOrganization") }]);
    const [option4, setOption4] = useState([{ value: "-1", label: t("text.SelectModule") }]);
    const [isPackage, setPackage] = useState([{
        value: "-1", label:
            t("text.SelectPackage")
    }]);

    const [orgId, setOrgId] = useState("");
    const [packageId, setPackageId] = useState("");
    const [moduleId, setModuleId] = useState("");
    const [formId, setFormId] = useState("");

    const [show, setShow] = useState(false);


    const [permissionData, setPermission] = useState([]);

    const useRID = JSON.parse(localStorage.getItem('useR_ID') as string)



    let navigate = useNavigate();

    useEffect(() => {
        getPermission();
    }, [formId, moduleId, packageId, orgId]);


    const getPackage = () => {
        const collectData = {
            "collegeID": "1",
            "packageID": "-1",
            "type": "1"
        }

        api
            .post(`Login/GetPackage`, collectData)
            .then((res) => {
                const arr: any = [];
                console.log("result" + JSON.stringify(res.data.data));
                for (let index = 0; index < res.data.data.length; index++) {
                    arr.push({
                        label: res.data.data[index]["packageName"],
                        value: res.data.data[index]["packageID"],
                    });
                }
                setPackage(arr);
            });
    };

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

    const getOrg = () => {
        const collectData = {
            "collegeID": "0",
            "type": "1"
        }

        api
            .post(`Login/GetOrg`, collectData)
            .then((res) => {
                const arr: any = [];
                for (let index = 0; index < res.data.data.length; index++) {
                    arr.push({
                        label: res?.data?.data[index]["orG_NAME"],
                        value: res?.data?.data[index]["orG_ID"]
                    });
                }
                setOption3(arr);
            });
    };

    const getPermission = () => {
        const collectData = {
            orgID: orgId || "-1",
            packageID: packageId || "-1",
            mModuleID: moduleId || "-1",
            formID: formId || "-1",
            type: "1"
        }

        api
            .post(`Login/GetRoleBaction`, collectData)
            .then((res) => {
                const arr: any = res?.data?.data;

                setPermission(arr);


            });
    };

    const getModule = (packageId: any) => {
        const collectData = {
            "orgID": orgId || "",
            "packageID": packageId || "",
            "mModuleID": "-1"
        }

        api
            .post(`Login/GetModule`, collectData)
            .then((res) => {
                const arr: any = [];
                for (let index = 0; index < res?.data?.data?.length; index++) {
                    arr.push({
                        label: res?.data?.data[index]["mModuleName"],
                        value: res?.data?.data[index]["mModuleID"]
                    });
                }
                setOption4(arr);
            });
    };

    const [toaster, setToaster] = useState(false);

    useEffect(() => {
        getForm();
        getOrg();
        getPackage();
    }, []);

    const handleForm: any = (event: any, newValue: any) => {
        setFormId(newValue?.value);
    };

    const handleOrg = (event: any, newValue: any) => {
        setOrgId(newValue?.value);
        setShow(true)
    };

    const handleModule = (event: any, newValue: any) => {
        setModuleId(newValue?.value);
    };

    const handlePackage = (event: any, newValue: any) => {
        getModule(newValue?.value);
        setPackageId(newValue?.value);
    };

    const formik = useFormik({
        initialValues: {
            "OrgID": "",
            "packageID": "",
            "mModuleID": "",
            "FormID": "",
            "type": "1",
            "listBaction": []
        },
        onSubmit: async (values) => {
            const listBaction = permissionData
                .filter((item: any) => item.rowType === "3")
                .reduce((acc: any, item: any) => {
                    Object.keys(item)
                        .filter(key => key.startsWith("header"))
                        .forEach(key => {
                            if (item[key] === "1") {
                                let bActionId;
                                if (key === 'header1') bActionId = '1';
                                else if (key === 'header2') bActionId = '7';
                                else if (key === 'header3') bActionId = '3';
                                else if (key === 'header4') bActionId = '5';
                                else if (key === 'header5') bActionId = '2';
                                else if (key === 'header6') bActionId = '4';
                                else if (key === 'header7') bActionId = '6';


                                if (bActionId) {
                                    acc.push({
                                        roleID: item.roleID,
                                        bActionId: bActionId,
                                    });
                                }
                            }
                        });
                    return acc;
                }, []);


            const payload = {
                OrgID: orgId,
                packageID: packageId,
                mModuleID: moduleId,
                FormID: formId,
                type: "1",
                "userID": useRID || 0,
                listBaction: listBaction,
            };


            const response = await api.post(
                `Login/UpdateRoleBAction`,
                payload
            );

            if (response?.data?.isSuccess) {
                setToaster(false);
                toast.success(response.data.msg);
                formik.resetForm();
            } else {
                setToaster(true);
                toast.error(response.data.mesg);
            }
        },
    });


    const handleCheckboxChange = (roleID: string, headerKey: string) => {

        const updatedPermissionData: any = permissionData.map((item: any) => {
            if (item.roleID === roleID) {


                const updatedItem = { ...item };


                updatedItem[headerKey] = updatedItem[headerKey] === "1" ? "0" : "1";

                return updatedItem;
            }

            return item;
        });

        setPermission(updatedPermissionData);

    };



    return (
        <div style={{ backgroundColor: 'white' }}>
            <div
                style={{
                    padding: "-5px 5px",
                    backgroundColor: "white",
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
                        User Role Permission
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
                                    disablePortal
                                    id="combo-box-demo"
                                    options={option3}
                                    fullWidth
                                    size="small"
                                    onChange={handleOrg}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.SelectOrganization")}
                                                </span>
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid xs={12} sm={4} item>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={isPackage}
                                    fullWidth
                                    size="small"
                                    onChange={handlePackage}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.SelectPackage")}
                                                </span>
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid xs={12} sm={4} item>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={option4}
                                    fullWidth
                                    size="small"
                                    onChange={handleModule}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <span>
                                                    {t("text.SelectModule")}
                                                </span>
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid xs={12} sm={4} item>
                                <Autocomplete
                                    // multiple
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

                            {show && (
                                <Grid xs={12} item>
                                    <TableContainer component={Paper} style={{ border: "1px solid silver", overflowX: "auto" }}>
                                        <Table style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <TableHead style={{ backgroundColor: "#E0F7FA" }}>
                                                <TableRow>
                                                    <TableCell style={{ backgroundColor: "#E0F7FA", fontWeight: "bold", padding: "8px", textAlign: "left", border: "1px solid #ddd", minWidth: "80px" }}>{t("text.Role")}</TableCell>
                                                    {permissionData.length > 0 &&
                                                        Object.keys(permissionData[0])
                                                            .filter(key => key.startsWith("header"))
                                                            .map((key, index) => {
                                                                let headerText: any = permissionData[0][key];
                                                                if (headerText === 'ADD') {
                                                                    headerText = t("text.add");
                                                                }
                                                                else if (headerText === 'APPROVE') {
                                                                    headerText = t("text.approve");
                                                                }
                                                                else if (headerText === 'CANCEL') {
                                                                    headerText = t("text.cancel");
                                                                } else if (headerText === 'DELETE') {
                                                                    headerText = t("text.delete");
                                                                } else if (headerText === 'EDIT') {
                                                                    headerText = t("text.edit");
                                                                } else if (headerText === 'GET') {
                                                                    headerText = t("text.get");
                                                                } else if (headerText === 'SUBMIT') {
                                                                    headerText = t("text.submit");
                                                                }
                                                                return <TableCell key={index} style={{ backgroundColor: "#E0F7FA", fontWeight: "bold", padding: "8px", textAlign: "center", border: "1px solid #ddd" }}>{headerText}</TableCell>

                                                            })
                                                    }

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {permissionData
                                                    .filter((item: any) => item.rowType === "3")
                                                    .map((row: any, index: number) => (
                                                        <TableRow key={index}>
                                                            <TableCell style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd", minWidth: "80px" }}>{row.roleName}</TableCell>
                                                            {
                                                                Object.keys(row)
                                                                    .filter(key => key.startsWith("header"))
                                                                    .map((key, index) => (
                                                                        <TableCell key={index} align="center" style={{ padding: "8px", textAlign: "center", border: "1px solid #ddd" }}>
                                                                            <Checkbox
                                                                                checked={row[key] === "1"}
                                                                                onChange={() => handleCheckboxChange(row.roleID, key)}
                                                                                color="primary"
                                                                            />
                                                                        </TableCell>
                                                                    ))
                                                            }


                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            )}

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
                        <ToastApp />
                    </form>
                </CardContent>
            </div>
        </div>
    );
};
export default UserRolePermission;