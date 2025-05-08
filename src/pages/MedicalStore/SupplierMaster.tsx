import { GridColDef } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import {
    Stack,
    TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ConfirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getId } from "../../utils/Constant";
import ButtonWithLoader from "../../utils/ButtonWithLoader";
import CustomLabel from "../../CustomLable";
import Languages from "../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../TranslateTextField";
import DataGrids from "../../utils/Datagrids";
import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Divider,
} from "@mui/material";
import api from "../../utils/Url";
import { toast } from "react-toastify";
import ToastApp from "../../ToastApp";
import BusinessIcon from "@mui/icons-material/Business"; // Import icon
import { Avatar } from "@mui/material";

interface MenuPermission {
    isAdd: boolean;
    isEdit: boolean;
    isPrint: boolean;
    isDel: boolean;
}
export default function SupplierMaster() {
    const UserId = getId();
    const [editId, setEditId] = useState(0);
    const [zones, setZones] = useState([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [lang, setLang] = useState<Language>("en");
    const [permissionData, setPermissionData] = useState<MenuPermission>({
        isAdd: false,
        isEdit: false,
        isPrint: false,
        isDel: false,
    });
    const { t } = useTranslation();
    const [showStates, setShowStates] = useState({ showState1: false });

    useEffect(() => {
        fetchZonesData();
    }, []);

    const handleConversionChange = (params: any, text: string) => {
        formik.setFieldValue(params, text);
    };

    const routeChangeEdit = (row: any) => {
        formik.setFieldValue("supplierID", row.supplierID);
        formik.setFieldValue("supplierName", row.supplierName);
        formik.setFieldValue("supplierCode", row.supplierCode);
        formik.setFieldValue("supplierAddress", row.supplierAddress);
        formik.setFieldValue("isActive", row.isActive === "Active");
        setEditId(row.supplierID);
    };

    const fetchZonesData = async () => {
        try {
            const collectData = {
                supplierID: -1,
                suplierSearch: "",
                userID: -1,
                formID: -1,
                type: 0,
            };
            const response = await api.post(`InventoryForm/GetSupplier`, collectData);
            const data = response.data.result || []; // Use "result" instead of "data"
            console.log("🚀 ~ fetchZonesData ~ response.data.result:", data);
            const zonesWithIds = data.map((zone: any, index: any) => ({
                ...zone,
                serialNo: index + 1,
                id: zone.supplierID,
                isActive: zone.isActive === true ? "Active" : "Inactive"
            }));
            setZones(zonesWithIds);
            setIsLoading(false);

            if (data.length > 0) {
                const columns: GridColDef[] = [
                    {
                        field: "actions",
                        headerName: t("text.Action"),
                        width: 150,
                        renderCell: (params) => (
                            <Stack
                                spacing={1}
                                direction="row"
                                sx={{ alignItems: "center", marginTop: "5px" }}
                            >
                                <EditIcon
                                    style={{ fontSize: "20px", color: "blue", cursor: "pointer" }}
                                    onClick={() => routeChangeEdit(params.row)}
                                />
                            </Stack>
                        ),
                    },
                    { field: "supplierName", headerName: t("text.supplierName"), flex: 1 },
                    { field: "supplierCode", headerName: t("text.supplierCode"), flex: 1 },
                    { field: "supplierAddress", headerName: t("text.supplierAddress"), flex: 1 },
                    { field: "isActive", headerName: t("text.isActive"), flex: 1 },
                ];
                setColumns(columns as any);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const adjustedColumns = columns.map((column: any) => ({
        ...column,
    }));

    const validationSchema = Yup.object({
        supplierName: Yup.string().required(t("text.reqsupplierName")),
        supplierCode: Yup.string().required(t("text.reqsupplierCode")),
        supplierAddress: Yup.string().required(t("text.reqsupplierAddress"))

    });
    const requiredFields = ["supplierName"];

    const formik = useFormik({
        initialValues: {
            supplierID: -1,
            supplierName: "",
            supplierCode: "",
            supplierAddress: "",
            "isActive": true,
            "userID": -1,
            "formID": -1,
            "type": 1
        },

        validationSchema: validationSchema,
        onSubmit: async (values) => {
            let endpoint = "InventoryForm/AddSupplier";
            if (editId !== 0) {
                values.supplierID = editId;
            }
            try {
                const response = await api.post(endpoint, values);
                const res = response.data;
                if (res.isSuccess && res.result && res.result[0]?.isSuccess) {
                    const successMsg = res.result[0].msg || "Operation successful!";
                    toast.success(successMsg);
                    formik.resetForm();
                    fetchZonesData();
                    setEditId(0); // Reset the edit mode
                } else {
                    const errorMsg = res.result?.[0]?.msg || "Something went wrong.";
                    toast.error(errorMsg);
                }
            } catch (error) {
                toast.error("API Error. Please try again.");
                console.error("Error submitting form:", error);
            }
        },
    });
    const handleSubmitWrapper = async () => {
       await formik.handleSubmit();
    };
    return (
        <>
            <Card
                style={{
                    width: "100%",
                    backgroundColor: "lightgreen",
                    border: ".5px solid #2B4593",
                    marginTop: "3vh",
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
                    <Grid item xs={12} container spacing={1}>                     
                        <Grid item xs={10}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
                                <BusinessIcon />
                            </Avatar>
                            <Typography variant="h5" fontWeight={700} 
                                component="div"
                                sx={{ padding: "20px" }}
                                align="left" color="text.primary">{t("text.SupplierMaster")}</Typography>
                        </Box>
                    </Grid>

                        <Grid item lg={2} md={2} xs={12} marginTop={2}>
                            <select
                                className="language-dropdown"
                                value={lang}
                                onChange={(e) => setLang(e.target.value as Language)}
                            >
                                {Languages.map((l) => (
                                    <option key={l.value} value={l.value}>
                                        {l.label}
                                    </option>
                                ))}
                            </select>
                        </Grid>
                    </Grid>
                    <Divider />

                    <Box height={10} />
                    <form onSubmit={formik.handleSubmit}>
                        <Grid item xs={12} container spacing={2}>
                            <Grid xs={12} sm={4} lg={4} item>
                                <TranslateTextField
                                    label={t("text.entersupplierName")}
                                    value={formik.values.supplierName}
                                    onChangeText={(text: string) => handleConversionChange('supplierName', text)}
                                    required={true}
                                    lang={lang}
                                />
                                {formik.touched.supplierName && formik.errors.supplierName ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.supplierName}
                                    </div>
                                ) : null}
                            </Grid>
                            <Grid item xs={12} sm={4} lg={4}>
                                {/* {(showStates.showState1) ? ( */}
                                <TextField
                                    label={
                                        <CustomLabel
                                            text={t("text.entersupplierCode")}
                                            required={true}
                                        />
                                    }
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    name="supplierCode"
                                    id="supplierCode"
                                    value={formik.values.supplierCode}
                                    placeholder={t("text.entersupplierCode")}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.supplierCode && formik.errors.supplierCode ? (
                                    <div style={{ color: 'red', margin: '5px' }}>
                                        {formik.errors.supplierCode}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid item xs={12} sm={4} lg={4}>
                                <Stack direction="row" alignItems="center" >
                                    <label>{t("text.isActive")}</label>
                                    <input
                                        type="checkbox"
                                        checked={formik.values.isActive}
                                        onChange={(e) => formik.setFieldValue("isActive", e.target.checked)}
                                        style={{ transform: "scale(1.3)", marginLeft: "10px" }}
                                    />
                                </Stack>
                            </Grid>

                            <Grid xs={12} sm={12} lg={12} item>
                                <TranslateTextField
                                    label={t("text.entersupplierAddress")}
                                    value={formik.values.supplierAddress}
                                    onChangeText={(text: string) => handleConversionChange('supplierAddress', text)}
                                    required={true}
                                    lang={lang}
                                />
                                {formik.touched.supplierAddress && formik.errors.supplierAddress ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {formik.errors.supplierAddress}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid item xs={2} sx={{ m: -1 }}>
                                {editId === 0 ? (
                                    <ButtonWithLoader
                                        buttonText={t("text.save")}
                                        onClickHandler={handleSubmitWrapper}
                                        fullWidth={true}
                                    />
                                ) : (
                                    <ButtonWithLoader
                                        buttonText={t("text.update")}
                                        onClickHandler={handleSubmitWrapper}
                                        fullWidth={true}
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </form>

                    {isLoading ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <CircularProgress />
                        </div>
                    ) : (
                        <DataGrids
                            isLoading={isLoading}
                            rows={zones}
                            columns={adjustedColumns}
                            pageSizeOptions={[5, 10, 25, 50, 100]}
                            initialPageSize={5}
                        />
                    )}
                </Paper>
            </Card>
            <ToastApp />
        </>
    );
};




