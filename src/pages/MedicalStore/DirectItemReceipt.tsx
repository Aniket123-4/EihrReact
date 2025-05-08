import { GridColDef } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import {
  Autocomplete,
  Avatar,
  Stack,
  TextField,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import IconButton from "@mui/material/IconButton";
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
import MoveToInboxOutlinedIcon from "@mui/icons-material/MoveToInboxOutlined";
import { Tabs, Tab } from "@mui/material";
import { getISTDate } from "../../utils/Constant";
import api from "../../utils/Url";
import { toast } from "react-toastify";
import ToastApp from "../../ToastApp";
import { confirmDialog } from 'primereact/confirmdialog';
export default function DirectItemReceipt() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0); // 0 = Pending, 1 = Approved

  const [UnitOption, setUnitOption] = useState([
    { value: "-1", label: t("text.SelectCountryName") },
  ]);
  const [SupplierOption, setSupplierOption] = useState([
    { value: "-1", label: t("text.SelectCountryName") },
  ]);
  const [ItemOption, setItemOption] = useState([
    { value: "-1", label: t("text.SelectCountryName") },
  ]);

  const [editId, setEditId] = useState(0);
  const [receipt, setReceipt] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { defaultValues } = getISTDate();
  const [lang, setLang] = useState<Language>("en");
  useEffect(() => {
    getItem();
    getUnit();
    GetSupplier();
    const timeout = setTimeout(() => {
      fetchReceiptsData();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [activeTab]);

  const getItem = () => {
    const collectData = {
      "itemID": -1, "itemCatID": -1, "itemSearch": "", "userID": -1, "formID": -1, "type": 1
    };
    api.post(`InventoryForm/GetItem`, collectData).then((res) => {
      const arr: any = [];
      for (let index = 0; index < res.data.result.length; index++) {
        arr.push({
          label: res.data.result[index]["itemName"],
          value: res.data.result[index]["itemID"],
        });
      }
      setItemOption(arr);
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

  const handleApprove = (row: any) => {
    confirmDialog({
      message: "Are you sure you want to approve this item receipt?",
      header: "Approval Confirmation",
      icon: "pi pi-check-circle",
      acceptClassName: "p-button-success",
      accept: async () => {
        try {
          const issueDateFormatted = row.issueDate.replace(/-/g, ''); // Format to YYYYMMDD

          const payload = {
            itemIssueID: row.itemIssueID,
            issueVoucherNo: row.issueVoucherNo,
            issueDate: issueDateFormatted,
            supplierID: row.supplierID,
            type_Pats: [
              {
                col1: "", col2: "", col3: "", col4: "", col5: "",
                col6: "", col7: "", col8: "", col9: "", col10: "",
                col11: "", col12: "", col13: "", col14: "", col15: ""
              }
            ],
            userID: -1,
            formID: -1,
            type: 3
          };

          const response = await api.post("InventoryForm/AddDirectItemReceipt", payload);
          const res = response.data;

          if (res.isSuccess && res.result?.[0]?.isSuccess) {
            toast.success(res.result[0].msg || "Approved successfully!");
            fetchReceiptsData(); // Refresh the DataGrid
          } else {
            const errorMsg = res.result?.[0]?.msg || "Approval failed.";
            toast.error(errorMsg);
          }
        } catch (error) {
          toast.error("Error approving receipt.");
          console.error("Approval error:", error);
        }
      },
      reject: () => {
        // Optional: Add any logic when user cancels
        toast.info("Approval cancelled.");
      }
    });
  };



  const routeChangeEdit = async (row: any) => {
    setEditId(row.itemIssueID); // set edit mode
    formik.setFieldValue("issueVoucherNo", row.issueVoucherNo);
    formik.setFieldValue("issueDate", dayjs(row.itemInDate).format("YYYY-MM-DD"));
    formik.setFieldValue("supplierID", row.supplierID);

    //  Call the API to get type_Pats data
    const payload = {
      itemIssueID: row.itemIssueID,
      issueVoucherNo: "",
      fromDate: "19000101",
      toDate: dayjs().format("YYYY-MM-DD"),
      isFinalApproved: 0,
      supplierID: -1,
      userID: -1,
      formID: -1,
      type: 2,
    };

    try {
      const response = await api.post("InventoryForm/GetDirectItemReceipt", payload);
      const resData = response.data.result?.[0];

      if (resData) {
        formik.setFieldValue("type_Pats", [
          {
            col: 1,
            col1: resData.unitID,
            col2: resData.itemID,
            col3: resData.itemQuantity,
            col4: resData.itemRate,
            col5: dayjs(resData.serviceTillDate).format("YYYY-MM-DD"),
            col6: "1",
            col7: resData.itemInID, // ✅ this will be used in update payload
            col8: "",
            col9: "",
            col10: "",
            col11: "",
            col12: "",
            col13: "",
            col14: "",
            col15: "",
            itemInID: resData.itemInID // ✅ assign here so it's accessible in `onSubmit`
          }
        ]);
      }
    } catch (error) {
      toast.error("Failed to load edit data.");
      console.error("Edit fetch error:", error);
    }
  };


  const fetchReceiptsData = async () => {
    try {
      const collectData = {
        itemIssueID: -1,
        issueVoucherNo: "",
        fromDate: "19000101",
        toDate: "2026-04-21",
        isFinalApproved: activeTab === 0 ? 0 : 1,
        supplierID: -1,
        userID: -1,
        formID: -1,
        type: 1,
      };

      const response = await api.post(`InventoryForm/GetDirectItemReceipt`, collectData);
      const data = response.data.result || [];

      const receiptWithIds = data.map((receipt: any, index: any) => ({
        ...receipt,
        serialNo: index + 1,
        id: receipt.itemIssueID,
        isFinalApproved: receipt.isFinalApproved === "1" ? "Yes" : "No",
      }));

      setReceipt(receiptWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            headerName: t("text.Action"),
            width: 150,
            renderCell: (params) => (
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", marginTop: "5px" }}>
                {params.row.isFinalApproved === "No" && (
                  <IconButton color="success" onClick={() => handleApprove(params.row)}>
                    <CheckIcon />
                  </IconButton>
                )}
                <EditIcon
                  style={{ fontSize: "20px", color: "blue", cursor: "pointer" }}
                  onClick={() => routeChangeEdit(params.row)}
                />
              </Stack>
            ),
          },
          { field: "serialNo", headerName: t("text.SrNo"), flex: 1 },
          { field: "issueVoucherNo", headerName: t("text.issueVoucherNo"), flex: 1 },
          { field: "isFinalApproved", headerName: t("text.isFinalApproved"), flex: 1 },
          { field: "issueDate", headerName: t("text.issueDate"), flex: 1 },
          { field: "supplierName", headerName: t("text.supplierName"), flex: 1 },
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
    issueVoucherNo: Yup.string().required(t("text.reqVoucherNo")),
    supplierID: Yup.string().required(t("text.reqSupplier")),
    type_Pats: Yup.array().of(
      Yup.object().shape({
        col1: Yup.string().required(t("text.reqUnit")),       // Unit
        col2: Yup.string().required(t("text.reqItem")),       // Item
        col3: Yup.number()
          .typeError(t("text.invalidQuantity"))
          .positive(t("text.positiveQuantity"))
          .required(t("text.reqQuantity")),
        col4: Yup.number()
          .typeError(t("text.invalidRate"))
          .positive(t("text.positiveRate"))
          .required(t("text.reqRate")),
        col5: Yup.date()
          .required(t("text.reqExpiryDate"))
          .typeError(t("text.invalidDate")),
      })
    ),
  });
  const formik = useFormik({
    initialValues: {
      issueVoucherNo: "",
      issueDate: defaultValues,
      supplierID: "",
      itemIssueID: "-1",
      type_Pats: [
        {
          col: 1,
          col1: "", col2: "", col3: "", col4: "", col5: "",
          col6: "1", col7: "-1",
          col8: "", col9: "", col10: "",
          col11: "", col12: "", col13: "", col14: "", col15: "",
          itemInID: "" // Added property
        }
      ],
      userID: -1,
      formID: -1,
      type: 1,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {

      const isUpdate = editId !== 0;
      // Set the endpoint for the API
      const endpoint = "InventoryForm/AddDirectItemReceipt";


      const itemEntry = {
        col: 1,
        col1: values.type_Pats[0].col1,
        col2: values.type_Pats[0].col2,
        col3: values.type_Pats[0].col3,
        col4: values.type_Pats[0].col4,
        col5: values.type_Pats[0].col5,
        col6: "1",
        col7: isUpdate
          ? values.type_Pats[0].itemInID || "-1" // ✅ For update: use itemInID if available
          : "-1",                                // ✅ For add: always "-1"
        col8: "",
        col9: "",
        col10: "",
        col11: "",
        col12: "",
        col13: "",
        col14: "",
        col15: "",
      };
      // Construct the payload to be sent to the backend
      const payload = {
        issueVoucherNo: values.issueVoucherNo,  // Voucher number from form
        issueDate: values.issueDate,            // Issue date from form
        supplierID: values.supplierID,          // Supplier ID from form
        itemIssueID: isUpdate ? editId : "-1",  // itemIssueID for update, or -1 for add
        type_Pats: [itemEntry],                 // Array of item entries
        userID: -1,                             // Static user ID (or replace with actual userID)
        formID: -1,                             // Static form ID (or replace with actual formID)
        type: isUpdate ? 2 : 1                 // 2 for update, 1 for add
      };
      // Send the request to the API
      try {
        const response = await api.post(endpoint, payload);
        const res = response.data;
        // Check if the response is successful and show appropriate messages
        if (res.isSuccess && res.result?.[0]?.isSuccess) {
          const successMsg = res.result[0].msg || (isUpdate ? "Item Receipt updated!" : "Item Receipt saved!");
          toast.success(successMsg);  // Show success toast
          formik.resetForm();         // Reset the form after successful submission
          fetchReceiptsData();           // Refresh grid with updated data
          setEditId(0);               // Reset mode to Add after successful operation
        } else {
          const errorMsg = res.result?.[0]?.msg || "Something went wrong.";
          toast.error(errorMsg);      // Show error toast if something went wrong
        }
      } catch (error) {
        toast.error("API Error. Please try again.");  // Handle any errors during the API call
        console.error("Error submitting form:", error); // Log the error for debugging
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
                  <MoveToInboxOutlinedIcon />
                </Avatar>
                <Typography variant="h5" gutterBottom
                  fontWeight={700} color="text.primary"
                  component="div"
                  sx={{ padding: "20px" }}
                  align="left">{t("text.DirectItemReceipt")}</Typography>
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
                  label={t("text.enterReceiptVoucherNo")}
                  value={formik.values.issueVoucherNo}
                  onChangeText={(text: string) => handleConversionChange('issueVoucherNo', text)}
                  required={true}
                  lang={lang}
                />
                {formik.touched.issueVoucherNo && formik.errors.issueVoucherNo ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.issueVoucherNo}
                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="issueDate"
                  name="issueDate"
                  label={<CustomLabel text={t("text.issueDate")} required={true} />}
                  value={formik.values.issueDate}
                  placeholder={t("text.issueDate")}
                  size="small"
                  fullWidth
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />

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
                    {formik.errors.supplierID}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} lg={4} item>
                <Autocomplete
                  disablePortal
                  options={ItemOption}
                  fullWidth
                  size="small"
                  value={
                    ItemOption.find(
                      (option: any) =>
                        option.value === formik.values.type_Pats?.[0]?.col2
                    ) || null
                  }
                  onChange={(event, newValue: any) => {
                    const updatedTypePats = [...formik.values.type_Pats];
                    updatedTypePats[0].col2 = newValue?.value || "";
                    formik.setFieldValue("type_Pats", updatedTypePats);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.SelectItem")}
                          required={true}
                        />
                      }
                    />
                  )}
                />
                {formik.touched.type_Pats?.[0]?.col2 && (formik.errors.type_Pats?.[0] as any)?.col2 ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {(formik.errors.type_Pats?.[0] as any)?.col2}

                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} lg={4} item>
                <Autocomplete
                  disablePortal
                  options={UnitOption}
                  fullWidth
                  size="small"
                  value={
                    UnitOption.find(
                      (option: any) =>
                        option.value === formik.values.type_Pats?.[0]?.col1
                    ) || null
                  }
                  onBlur={() => formik.setFieldTouched("type_Pats[0].col1", true)}
                  onChange={(event, newValue: any) => {
                    const updatedTypePats = [...formik.values.type_Pats];
                    updatedTypePats[0].col1 = newValue?.value || "";
                    formik.setFieldValue("type_Pats", updatedTypePats);
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
                {formik.touched.type_Pats?.[0]?.col1 && (formik.errors.type_Pats?.[0] as any)?.col1 ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {(formik.errors.type_Pats?.[0] as any)?.col1}

                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.EnterItemQuantity")} required={true} />}
                  value={formik.values.type_Pats[0].col3}
                  onChange={(e) => formik.setFieldValue("type_Pats[0].col3", e.target.value)}
                  name="col3"
                  id="col3"
                  placeholder={t("text.EnterItemQuantity")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.type_Pats?.[0]?.col3 && (formik.errors.type_Pats?.[0] as any)?.col3 ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {(formik.errors.type_Pats?.[0] as any)?.col3}

                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={<CustomLabel text={t("text.EnterItemRate")} required={true} />}
                  value={formik.values.type_Pats[0].col4}
                  onChange={(e) => formik.setFieldValue("type_Pats[0].col4", e.target.value)}
                  name="col4"
                  id="col4"
                  placeholder={t("text.EnterItemRate")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.type_Pats?.[0]?.col4 && (formik.errors.type_Pats?.[0] as any)?.col4 ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {(formik.errors.type_Pats?.[0] as any)?.col4}

                  </div>
                ) : null}
              </Grid>

              <Grid item lg={4} xs={12}>
                <TextField
                  id="col5"
                  name="col5"
                  label={<CustomLabel text={t("text.expiryDate")} required={true} />}
                  value={formik.values.type_Pats[0].col5}
                  onChange={(e) => formik.setFieldValue("type_Pats[0].col5", e.target.value)}
                  placeholder={t("text.expiryDate")}
                  size="small"
                  fullWidth
                  type="date"
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
                {formik.touched.type_Pats?.[0]?.col5 && (formik.errors.type_Pats?.[0] as any)?.col5 ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {(formik.errors.type_Pats?.[0] as any)?.col5}

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
            <Box
              sx={{
                backgroundColor: "#003366",
                color: "white",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                px: 2,
                pt: 2,
              }}
            >
              {/* <Typography variant="h6" sx={{ mb: 1 }}>
    Saved Voucher List
  </Typography> */}
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                textColor="primary"
                indicatorColor="primary"
                TabIndicatorProps={{ style: { backgroundColor: "#2196f3" } }}
                sx={{
                  ".MuiTab-root": {
                    color: "#fff",
                    fontWeight: "bold",
                    backgroundColor: "#003366",
                    borderRadius: "5px 5px 0 0",
                    mr: 1,
                    minWidth: 25,
                  },
                  ".Mui-selected": {
                    backgroundColor: "#2196f3",
                    color: "white",
                  },
                }}
              >
                <Tab label={t("text.Pending")}/>
                <Tab label={t("text.Approved")} />
              </Tabs>
            </Box>
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
              rows={receipt}
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

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
