import { GridColDef } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import {
    Autocomplete,
    Avatar,
    Stack,
    TextField,
} from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import { ConfirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
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

export default function ItemMaster() {
    const { t } = useTranslation();
    const [ItemCatoption, setItemCatOption] = useState([
        { value: "-1", label: t("text.SelectCountryName") },
    ]);
    const [UnitOption, setUnitOption] = useState([
        { value: "-1", label: t("text.SelectCountryName") },
    ]);
    const [SupplierOption, setSupplierOption] = useState([
        { value: "-1", label: t("text.SelectCountryName") },
    ]);
    const [editId, setEditId] = useState(0);
    const [items, setItems] = useState([]);
    const [columns, setColumns] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lang, setLang] = useState<Language>("en");

    useEffect(() => {
        getItemCat();
        getUnit();
        GetSupplier();
        const timeout = setTimeout(() => {
            fetchItemsData();
        }, 1000);
        return () => clearTimeout(timeout);
    }, []);
    const getItemCat = () => {
        const collectData = {
            "itemCatID": -1, "sectionID": -1, "fundID": 1, "userID": -1, "formID": -1, "mainType": 2, "type": 1
        };
        api.post(`InventoryForm/GetItemCat`, collectData).then((res) => {
            const arr: any = [];
            for (let index = 0; index < res.data.result.length; index++) {
                arr.push({
                    label: res.data.result[index]["itemCatName"],
                    value: res.data.result[index]["itemCatID"],
                });
            }
            setItemCatOption(arr);
        });
    };

    const getUnit = () => {
        const collectData = {
            "unitID": -1, "isActive": 1, "type": 1
        }; 
        api.post(`InventoryForm/GetUnit`, collectData).then((res) => {
            const arr: any = [];
            for (let index = 0; index < res.data.result.length; index++) {
                arr.push({
                    label: res.data.result[index]["unitName"],
                    value: res.data.result[index]["unitID"],
                });
            }
            setUnitOption(arr);
        });
    };
    const GetSupplier = () => {
        const collectData = {
            "supplierID": -1, "suplierSearch": "", "userID": -1, "formID": -1, "type": 1
        };
        api.post(`InventoryForm/GetSupplier`, collectData).then((res) => {
            const arr: any = [];
            for (let index = 0; index < res.data.result.length; index++) {
                arr.push({
                    label: res.data.result[index]["supplierName"],
                    value: res.data.result[index]["supplierID"],
                });
            }
            setSupplierOption(arr);
        });
    };

    const handleConversionChange = (params: any, text: string) => {
        formik.setFieldValue(params, text);
    };
    const routeChangeEdit = (row: any) => {
        formik.setFieldValue("itemID", row.itemID);
        formik.setFieldValue("itemName", row.itemName);
        formik.setFieldValue("itemCode", row.itemCode); 
        formik.setFieldValue("itemCatID", row.itemCatID);
        formik.setFieldValue("itemNameML", row.itemNameML);
        formik.setFieldValue("unitID", row.unitID);
        formik.setFieldValue("chemicalName", row.chemicalName); 
        formik.setFieldValue("supplierID", row.supplierID);
        formik.setFieldValue("itemComment", row.itemComment);
        formik.setFieldValue("isVATApplicable", row.isVATApplicable);
        formik.setFieldValue("isActive", row.isActive === "Active");
        formik.setFieldValue("cgstPercent", row.cgstPercent);
        formik.setFieldValue("sgstPercent", row.sgstPercent);
        formik.setFieldValue("vatPercent", row.vatPercent);
        formik.setFieldValue("userID", -1);
        formik.setFieldValue("formID", -1);
        formik.setFieldValue("type", 1);
        setEditId(row.itemID);
    };

    const fetchItemsData = async () => {
        try {
            const collectData = {
                "itemID": -1, "itemCatID": -1, "itemSearch": "", "userID": -1, "formID": -1, "type": 2
            };
            const response = await api.post(`InventoryForm/GetItem`, collectData);
            const data = response.data.result || []; // ✅ Use "result" instead of "data"
            console.log("🚀 ~ fetchItemsData ~ response.data.result:", data);
            const itemsWithIds = data.map((item: any, index: any) => ({
                ...item,
                serialNo: index + 1,
                id: item.itemID,
                isActive: item.isActive === true ? "Active" : "Inactive",
            }));
            setItems(itemsWithIds);
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
                    { field: "serialNo", headerName: t("text.SrNo"), flex: 1 },
                    { field: "itemName", headerName: t("text.itemName"), flex: 1 },
                    { field: "itemCode", headerName: t("text.itemCode"), flex: 1 },
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
        itemName: Yup.string().required(t("text.reqitemName")),
        itemCode: Yup.string().required(t("text.reqitemCode")),
        itemCatID: Yup.string().required(t("text.reqItemcat")),
        unitID: Yup.string().required(t("text.reqUnit")),
        supplierID: Yup.string().required(t("text.reqSupplier")),


    });

    const requiredFields = ["itemName"];
    const formik = useFormik({
        initialValues: {
            "itemID": "-1",
            "itemName": "",
            "itemCode": "",
            "itemCatID": "",
            "itemNameML": "",
            "unitID": "",
            "chemicalName": "",
            "supplierID": "",
            "itemComment": "",
            "isVATApplicable": false,
            "isActive": true,
            "cgstPercent": "",
            "sgstPercent": "",
            "userID": -1,
            "formID": -1,
            "type": 1,
            "vatPercent": "0"
        },
        validationSchema: validationSchema,

        onSubmit: async (values: any) => {
            let endpoint = "InventoryForm/AddItem";

            // Build payload explicitly to ensure all required fields are present
            const payload = {
                itemID: editId !== 0 ? editId : "-1",
                itemName: values.itemName,
                itemCode: values.itemCode,
                itemCatID: values.itemCatID,
                itemNameML: values.itemNameML,
                unitID: values.unitID,
                chemicalName: values.chemicalName,
                supplierID: values.supplierID,
                itemComment: values.itemComment,
                isVATApplicable: values.isVATApplicable,
                isActive: values.isActive,
                cgstPercent: values.cgstPercent,
                sgstPercent: values.sgstPercent,
                vatPercent: values.vatPercent,
                userID: -1,
                formID: -1,
                type: 1
            };

            try {
                const response = await api.post(endpoint, payload);
                const res = response.data;

                if (res.isSuccess && res.result && res.result[0]?.isSuccess) {
                    toast.success(res.result[0].msg || "Operation successful!");
                    formik.resetForm();
                    fetchItemsData();
                    setEditId(0);
                } else {
                    toast.error(res.result?.[0]?.msg || "Something went wrong.");
                }
            } catch (error) {
                toast.error("API Error. Please try again.");
                console.error("Error submitting form:", error);
            }
        },

        // onSubmit: async (values: any) => {
        //     let endpoint = "InventoryForm/AddItem ";
        //     if (editId !== 0) {
        //         values.itemID = editId;
        //     }
        //     try {
        //         const response = await api.post(endpoint, values);
        //         const res = response.data;
        //         if (res.isSuccess && res.result && res.result[0]?.isSuccess) {
        //             const successMsg = res.result[0].msg || "Operation successful!";
        //             toast.success(successMsg);
        //             formik.resetForm();
        //             fetchItemsData();
        //             setEditId(0); // Reset the edit mode
        //         } else {
        //             const errorMsg = res.result?.[0]?.msg || "Something went wrong.";
        //             toast.error(errorMsg);
        //         }
        //     } catch (error) {
        //         toast.error("API Error. Please try again.");
        //         console.error("Error submitting form:", error);
        //     }
        // },
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
                                    <Inventory2OutlinedIcon />
                                </Avatar>
                                <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom

                                    component="div"
                                    sx={{ padding: "20px" }}
                                    align="left">{t("text.ItemMaster")}</Typography>
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
                                    label={t("text.enteritemName")}
                                    value={formik.values.itemName}
                                    onChangeText={(text: string) => handleConversionChange('itemName', text)}
                                    required={true}
                                    lang={lang}
                                />
                                {formik.touched.itemName && formik.errors.itemName ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {typeof formik.errors.itemName === "string" ? formik.errors.itemName : ""}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid xs={12} sm={4} lg={4} item>
                                <TranslateTextField
                                    label={t("text.enteritemCode")}
                                    value={formik.values.itemCode}
                                    onChangeText={(text: string) => handleConversionChange('itemCode', text)}
                                    required={true}
                                    lang={lang}
                                />
                                {formik.touched.itemCode && formik.errors.itemCode ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {typeof formik.errors.itemCode === "string" ? formik.errors.itemCode : ""}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid xs={12} sm={4} lg={4} item>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={ItemCatoption}
                                    fullWidth
                                    size="small"
                                    value={
                                        ItemCatoption.find(
                                            (option: any) => option.value === formik.values.itemCatID
                                        ) || null
                                    }
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue);
                                        formik.setFieldValue("itemCatID", newValue?.value);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.SelectItemCategory")}
                                                    required={true}
                                                />
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.itemCatID && formik.errors.itemCatID ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {typeof formik.errors.itemCatID === "string" ? formik.errors.itemCatID : ""}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid xs={12} sm={4} lg={4} item>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={UnitOption}
                                    fullWidth
                                    size="small"
                                    value={
                                        UnitOption.find(
                                            (option: any) => option.value === formik.values.unitID
                                        ) || null
                                    }
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue);

                                        formik.setFieldValue("unitID", newValue?.value);


                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.SelectUnit")}
                                                    required={true}
                                                />
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.unitID && formik.errors.unitID ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {typeof formik.errors.unitID === "string" ? formik.errors.unitID : ""}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid xs={12} sm={4} lg={4} item>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={SupplierOption}
                                    fullWidth
                                    size="small"
                                    value={
                                        SupplierOption.find(
                                            (option: any) => option.value === formik.values.supplierID
                                        ) || null
                                    }
                                    onChange={(event, newValue: any) => {
                                        console.log(newValue);
                                        formik.setFieldValue("supplierID", newValue?.value);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <CustomLabel
                                                    text={t("text.SelectSupplier")}
                                                    required={true}
                                                />
                                            }
                                        />
                                    )}
                                />
                                {formik.touched.supplierID && formik.errors.supplierID ? (
                                    <div style={{ color: "red", margin: "5px" }}>
                                        {typeof formik.errors.supplierID === "string" ? formik.errors.supplierID : ""}
                                    </div>
                                ) : null}
                            </Grid>

                            <Grid xs={12} sm={4} lg={4} item>
                                <TranslateTextField
                                    label={t("text.enterchemicalName")}
                                    value={formik.values.chemicalName}
                                    onChangeText={(text: string) => handleConversionChange('chemicalName', text)}
                                    required={false}
                                    lang={lang}
                                />
                            </Grid>

                            <Grid item xs={12} sm={2} lg={2}>
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

                            <Grid item xs={12} sm={2} lg={2}>
                                <Stack direction="row" alignItems="center">
                                    <label>{t("text.GST")}</label>
                                    <input
                                        type="checkbox"
                                        checked={formik.values.isVATApplicable}
                                        onChange={(e) => formik.setFieldValue("isVATApplicable", e.target.checked)}
                                        style={{ transform: "scale(1.3)", marginLeft: "10px" }}
                                    />
                                </Stack>
                            </Grid>

                            {formik.values.isVATApplicable && (
                                <>
                                    <Grid item xs={12} sm={4} lg={4}>
                                        <TextField
                                            label={<CustomLabel text={t("text.Entercgst")} />}
                                            value={formik.values.cgstPercent}
                                            name="cgstPercent"
                                            id="cgstPercent"
                                            placeholder={t("text.Entercgst")}
                                            size="small"
                                            fullWidth
                                            style={{ backgroundColor: "white" }}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4} lg={4}>
                                        <TextField
                                            label={<CustomLabel text={t("text.Entersgst")} />}
                                            value={formik.values.sgstPercent}
                                            name="sgstPercent"
                                            id="sgstPercent"
                                            placeholder={t("text.Entersgst")}
                                            size="small"
                                            fullWidth
                                            style={{ backgroundColor: "white" }}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid xs={12} sm={4} lg={4} item>
                                <TranslateTextField
                                    label={t("text.enteritemComment")}
                                    value={formik.values.itemComment}
                                    onChangeText={(text: string) => handleConversionChange('itemComment', text)}
                                    required={false}
                                    lang={lang}
                                />
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
                            rows={items}
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