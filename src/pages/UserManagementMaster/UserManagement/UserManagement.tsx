import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate, useLocation } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import axios from "axios";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import HOST_URL from "../../../utils/Url";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SwipeableTemporaryDrawer from "./SwipeableTemporaryDrawer";
import details from "../../../assets/images/face-recognition.png";
import reports from "../../../assets/images/report.png";
import Modal from "@mui/material/Modal";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { usePermissionData } from "../../../usePermissionData";
import dayjs from "dayjs";
import api from "../../../utils/Url";
import CustomDataGrid from "../../../utils/CustomDatagrid";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "180vh",
  height: "85vh",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function UserManagement() {
  const [rows, setRows] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpenUser, setDrawerOpenUser] = useState(false);
  const [drawerData, setDrawerData] = useState<any>([]);
  const [pdfReport, setPdfReport] = useState<string | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(true);
  const [docOpens, setDocOpens] = useState(false);

  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  let navigate = useNavigate();
  const { t } = useTranslation();

  const location = useLocation();
  const [columns, setColumns] = useState<any>([]);

  const handleOtherDocClose = () => {
    setDocOpens(false);
  };

  const handleOtherDocOpen = () => {
    setDocOpens(true);
  };

  useEffect(() => {
    // const dataString = localStorage.getItem("userdata");
    //   if (dataString) {
    //     const data = JSON.parse(dataString);
    //     if (data && data.length > 0) {
    //       const userPermissionData = data[0]?.userPermission;
    //       if (userPermissionData && userPermissionData.length > 0) {
    //         const menudata = userPermissionData[0]?.parentMenu;
    //         for (let index = 0; index < menudata.length; index++) {
    //           const childMenudata = menudata[index]?.childMenu;
    //           const pathrow = childMenudata.find(
    //             (x: any) => x.path === location.pathname
    //           );
    //           console.log("data", pathrow);
    //           if (pathrow) {
    //             setPermissionData(pathrow);
    //             getList();
    //           }
    //         }
    //       }
    //     }
    //   }
    getList();
  }, []);


  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: any
  ) => {
    console.log(value);
    console.log("switch", event.target.checked);
    const collectData = {
      useR_ID: value.id,
      ranK_ID: value.ranK_ID,
      suR_NAME: value.suR_NAME,
      firsT_NAME: value.firsT_NAME,
      middlE_NAME: value.middlE_NAME,
      shorT_NAME: "",
      useR_CODE: value.useR_CODE,
      dob: value.dob,
      doa: "1900-01-01",
      doj: "1900-01-01",
      gendeR_ID: value.gendeR_ID,
      cuR_PHONE: value.cuR_PHONE,
      cuR_MOBILE: value.cuR_MOBILE,
      email: value.email,
      iS_ACTIVE: event.target.checked,
      iS_DELETED: false,
      useR_TYPE_ID: value.useR_TYPE_ID,
      otp: "",
      logiN_NAME: value.logiN_NAME,
      password: value.password,
      rolename: value.rolename,
    };
    console.log("value check", collectData);
    api
      .post( `Auth/AddUpdateUSER`, collectData)
      .then((res) => {
        if (res.data.isSuccess) {
          getList();
        }
      });
  };

  let delete_id = "";
  const accept = () => {
    const collectData = {
      useR_ID: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .delete( `Auth/DeleteUSER`, {data : collectData})
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
        } else {
          toast.error(response.data.mesg);
        }
        getList();
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

 
  const getList = () => {
    const collectData = {
      useR_ID: "-1",
    };
    try {
      api
        .get(`Login/GetUserList?CommonID=-1&type=0`)
        .then((res) => {
          const data = res.data.data;
          const arr = data.map((item: any, index: any) => ({
            ...item,
            serialNo: index + 1,
            id: item.userID,
            name:
              item.firsT_NAME +
              " " +
              (item.middlE_NAME == " " ? item.middlE_NAME + " " : "") +
              "" +
              item.suR_NAME,
            dob: dayjs(item.dob).format("YYYY-MM-DD"),
          }));
          setRows(arr);
          setIsLoading(false);

          if (arr.length > 0) {
            const columns: GridColDef[] = [
              {
                field: "actions",
                headerClassName: "MuiDataGrid-colCell",
                headerName: t("text.Action"),
                width: 160,

                renderCell: (params) => {
                  // console.log("Is Edit Allowed:", permissionData?.isEdit);
                  return [
                    <Stack
                      spacing={1}
                      direction="row"
                      sx={{ alignItems: "center", marginTop: "5px" }}
                    >
                      {/* {permissionData?.isEdit ? ( */}
                      <EditIcon
                        style={{
                          fontSize: "20px",
                          color: "blue",
                          cursor: "pointer",
                        }}
                        className="cursor-pointer"
                        onClick={() => routeChangeEdit(params.row)}
                      />
                    
                  
                     
                     
                     
                     
                    </Stack>,
                  ];
                },
              },

              {
                field: "serialNo",
                headerName: t("text.SrNo"),
                flex: 1,
                headerClassName: "MuiDataGrid-colCell",
              },
              {
                field: "userName",
                headerName: t("text.Name"),
                flex: 1,
                headerClassName: "MuiDataGrid-colCell",
              },
             
              {
                field: "eMail",
                headerName: t("text.Email"),
                flex: 1,
                headerClassName: "MuiDataGrid-colCell",
              },
              {
                field: "curMobile",
                headerName: t("text.MobNo"),
                flex: 1,
                headerClassName: "MuiDataGrid-colCell",
              },
            

             
            ];
            setColumns(columns as any);
          }
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const routeChangeEdit = (row: any) => {
    let path = `/User/UserManagementEdit`;
    navigate(path, {
      state: row,
    });
  };

  const routeChangeAdd = () => {
    let path = `/User/UserManagementAdd`;
    navigate(path);
  };

  const getDrawerData = (row: any) => {
    console.log(row);
    setDrawerData([row]);
    console.log(drawerData);

    if (drawerOpenUser) {
      setDrawerOpenUser(false);
    } else {
      setDrawerOpenUser(true);
    }

  };

  return (
    <>
      <div></div>
      <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
        <Card
          style={{
            width: "100%",
            height: "50%",
            backgroundColor: "#E9FDEE",
            border: ".5px solid green ",
          }}
        >
          <Paper
            sx={{
              width: "100%",
              overflow: "hidden",
              "& .MuiDataGrid-colCell": {
                backgroundColor: `var(--grid-headerBackground)`,
                color: `var(--grid-headerColor)`,
                fontSize: 17,
                fontWeight: 900,
              },
            }}
            style={{ padding: "10px" }}
          >
            <ConfirmDialog />
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ padding: "20px" }}
              align="left"
            >
              {t("text.UserManegment")}
            </Typography>
            <Divider />

            <Box height={10} />

            <Grid>
              <Modal open={docOpens} onClose={handleOtherDocClose}>
                <Box sx={style}>
                  {isReportLoading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CircularProgress />
                    </div>
                  ) : pdfReport !== null ? (
                    <embed
                      src={`data:application/pdf;base64,${pdfReport}`}
                      type="application/pdf"
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                    />
                  ) : (
                    <Typography>{t("text.NoDataAvailable")}</Typography>
                  )}
                </Box>
              </Modal>
            </Grid>

            <Stack direction="row" spacing={2} classes="my-2 mb-2">
              {/* {permissionData?.isAdd == true ? ( */}
              <Button
                onClick={routeChangeAdd}
                variant="contained"
                endIcon={<AddCircleIcon />}
                size="large"
                style={{backgroundColor:`var(--header-background)`}}
              >
                {t("text.add")}
              </Button>
              {/* ) : (
                ""
              )} */}

              {/* {permissionData?.isPrint == true ? (
                <Button
                  variant="contained"
                  endIcon={<PrintIcon />}
                  size="large"
                >
                  {t("text.print")}
                </Button>
              ) : (
                ""
              )} */}
            </Stack>
                  <CustomDataGrid
                    isLoading={isLoading}
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 25, 50, 100]}
                    initialPageSize={5}
                  />
          </Paper>
        </Card>
      </Grid>
      <ToastApp />
    </>
  );
}
