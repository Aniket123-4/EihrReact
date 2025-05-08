
import React, { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import api from "../../../utils/Url";
import Card from "@mui/material/Card";
import {
  Box,
  Divider,
  Stack,
  Grid,
  Typography,
  Input,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Switch from "@mui/material/Switch";
import { useNavigate, useLocation } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getId } from "../../../utils/Constant";
import ButtonWithLoader from "../../../utils/ButtonWithLoader";
import CustomLabel from "../../../CustomLable";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";

import CustomDataGrid from "../../../utils/CustomDatagrid";
import DataGrids from "../../../utils/Datagrids";
import AddCircleIcon from "@mui/icons-material/AddCircle";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function ZoneMaster() {
  const Userid = getId();
  const [editId, setEditId] = useState(-1);
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

  const navigate = useNavigate();


  let delete_id = "";
  const accept = () => {
    const collectData = {
      id: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`Comm/DeleteEmailSetting`,  collectData )
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
        } else {
          toast.error(response.data.mesg);
        }
        fetchZonesData();
      });
  };
  const reject = () => {
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
    delete_id = del_id;
    confirmDialog({
      message: "Do you want to delete this record ?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p=-button-danger",
      accept,
      reject,
    });
  };


  useEffect(() => {

    fetchZonesData();
  }, []);


  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any
  ) => {
    const collectData = {

      "id": value.id,
      "name": value.name,
      "email": value.email,
      "password": value.password,
      "host": value.host,
      "port": value.port || 0,
      "isTls": true,
      "isSSl": true,

      "srno": 0,
      isActive: event.target.checked,

    };
    console.log("collect Data addUpdate", collectData)
    api.post(`Comm/UpsertEmailSetting`, collectData).then((response) => {
      if (response.data.status === 1) {
        toast.success(response.data.message);
        fetchZonesData();
      } else {
        toast.error(response.data.message);
      }
    });
  };

  const routeChangeEdit = (row: any) => {
    let path = `/emailsystem/EditEmailSetting`;
    navigate(path, {
      state: row,
    });
  };



  const routeChangeAdd = () => {
    let path = `/emailsystem/AddEmailSetting`;
    navigate(path);
  };


  const fetchZonesData = async () => {
    try {
      const collectData = {
        "orderby": "",
        "pageNo": 0,
        "pageSize": 0,
        "intnotnullvalue1": 0,
        "userId": "",

        "str1": "",
        "str2": "",
        "str3": "",
        "str4": "",
        "str5": "",
        "intvalue1": 0,
        "intvalue2": 0,
        "intvalue3": 0,
        "intvalue4": 0,
        "intnotnullvalue2": 0,
        "intnotnullvalue3": 0,
        "date1": "2024-11-08T06:41:55.008Z",
        "date2": "2024-11-08T06:41:55.008Z",
        "date3": "2024-11-08T06:41:55.008Z",
        "date4": "2024-11-08T06:41:55.008Z",
        "dec1": 0,
        "dec2": 0,
        "dec3": 0,
        "dec4": 0,
        "flag": true,
        "data": "",
        "success": true,
        "error": "",
        "selectPerindex": 0,
        "show": true
      };
      const response = await api.post(`Comm/GetAllEmailSetting`, collectData);
      const data = response.data.data;
      console.log("🚀 ~ fetchZonesData ~ response.data.data:", response.data.data)
      const zonesWithIds = data.map((zone: any, index: any) => ({
        ...zone,
        serialNo: index + 1,
        id: zone.id,
      }));
      setZones(zonesWithIds);
      setIsLoading(false);

      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",

            headerName: t("text.Action"),
            width: 150,

            renderCell: (params) => {
              return [
                <Stack
                  spacing={1}
                  direction="row"
                  sx={{ alignItems: "center", marginTop: "5px" }}
                >




                  
                  <EditIcon
                    style={{
                      fontSize: "20px",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    className="cursor-pointer"
                    onClick={() => routeChangeEdit(params.row)}
                  />
                  
                  <DeleteIcon
                    style={{
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handledeleteClick(params.row.id);
                    }}
                  />
                 

                  <Switch
                    checked={Boolean(params.row.isActive)}
                    style={{
                      color: params.row.isActive ? "green" : "#FE0000",
                    }}
                    onChange={(value: any) =>
                      handleSwitchChange(value, params.row)
                    }
                    inputProps={{
                      "aria-label": "Toggle Switch",
                    }}
                  />
                </Stack>,
              ];
            },
          },

          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 1,

          },
          {
            field: "name",
            headerName: t("text.name"),
            flex: 1,

          },
          {
            field: "email",
            headerName: t("text.email12"),
            flex: 1,

          },
          {
            field: "isActive",
            headerName: t("text.Status"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
            renderCell: (params) => [
              <Stack direction="row" spacing={1}>
                {params.row.isActive ? (
                  <Chip
                    label={t("text.Active")}
                    color="success"
                    style={{ fontSize: "14px" }}
                  />
                ) : (
                  <Chip
                    label={t("text.InActive")}
                    color="error"
                    style={{ fontSize: "14px" }}
                  />
                )}
              </Stack>,
            ],
          },
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
    name: Yup.string().test(
      "required",
      t("text.reqname"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
  });

  const requiredFields = ["name"];

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
      "isActive": true,
      "srno": 0
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.id = editId;

      console.log("before submitting value check", values);
      const response = await api.post(`Comm/UpsertEmailSetting`, values);
      if (response.data.isSuccess) {
        formik.setFieldValue("name", "");
        formik.setFieldValue("email", "");
        fetchZonesData();
        toast.success(response.data.message);
        setEditId(-1);
      } else {
        toast.error(response.data.message);
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
            <Grid item lg={10} md={10} xs={12}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="left"
              >
                {t("text.Emailsettingmaster")}
              </Typography>
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

          <Stack direction="row" spacing={2} classes="my-2 mb-2">
            {/* {permissionData?.isAdd == true ? ( */}
            <Button
              onClick={routeChangeAdd}
              variant="contained"
              endIcon={<AddCircleIcon />}
              size="large"
              style={{ backgroundColor: `var(--header-background)` }}
            >
              {t("text.add")}
            </Button>

          </Stack>


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
