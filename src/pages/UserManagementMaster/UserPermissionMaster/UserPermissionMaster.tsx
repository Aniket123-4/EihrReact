import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import HOST_URL from "../../../utils/Url";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
// import TableContainer from '@mui/material/TableContainer';
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import api from "../../../utils/Url";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "180vh",
  height: "92vh",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

function createData(
  srno: number,
  id: string,
  roleName: string,
  userName: string
): any {
  return {
    srno,
    id,
    roleName,
    userName,
  };
}
function createdData(
  // srno: number,
  id: string,
  menuId: number,
  parentId: number,
  menuName: string,
  parentMenuName: string,
  isAdd: boolean,
  isEdit: boolean,
  isDel: boolean,
  isView: boolean,
  isPrint: boolean,
  isExport: boolean,
  isRelease: boolean,
  isPost: boolean,
  UserId: string
): any {
  return {
    // srno,
    id,
    menuId,
    parentId,
    menuName,
    parentMenuName,
    isAdd,
    isEdit,
    isDel,
    isView,
    isPrint,
    isExport,
    isRelease,
    isPost,
    UserId,
  };
}

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}

export default function UserPermissionMaster() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<any>([]);
  const [records, setRecords] = useState(rows);

  const [roleOption, setRoleOption] = useState([
    { value: "-1", label: "Select Role Name" },
  ]);
  const { i18n, t } = useTranslation();
  const [users, setUsers] = useState<any>([]);
  const [employeeId, setEmployeeId] = useState<string>("");

  const [enteredEmployeeName, setEnteredEployeeName] = useState<any>("");
  const [enteredRoleName, setEnteredRoleName] =
    React.useState<FilmOptionType | null>(null);
  const [selectedRoleID, setSelectedRoleID] = useState(enteredRoleName?.value);
  const [selectedRoleData, setSelectedRoleData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });
  const [edit, setEditID] = useState(selectedRoleID);

  const location = useLocation();

  const handleUserChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    console.log(newValue?.ranK_ID);
    // handleEmployeeIdChange(newValue?.value);
    // console.log(enteredEmployeeName)
    setEnteredEployeeName(newValue);
    if (newValue) {
      setEmployeeId(`${newValue.useR_ID}`);
      setSelectedRoleID(`${newValue.ranK_ID}`);
      getRolebyid(newValue.ranK_ID);
    } else {
      setEmployeeId("");
    }
  };

  const handleEmployeeIdChange = (event: any) => {
    const employeeIds = event.target.value;
    console.log(employeeIds);

    setEmployeeId(employeeIds);
    const matchingUser = users.find(
      (users: any) => `${users.useR_ID}` === employeeId
    );

    setEnteredEployeeName(
      matchingUser
        ? `${matchingUser.firsT_NAME} ${matchingUser.middlE_NAME} ${matchingUser.suR_NAME}`
        : ""
    );
    // console.log(setEnteredEployeeName);
    // console.log(enteredEmployeeName);
  };

  let delete_id = "";
  useEffect(() => {
    getRole();
    if (selectedRoleID) {
      getEmployeeNamebyID(selectedRoleID);
    }
    getEmployeeName();
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

  // }, [isLoading]);

  interface FilmOptionType {
    label: string;
    value: string;
  }

  const getEmployeeNamebyID = (id: any) => {
    const collectData = {
      useR_ID: id,
    };
    api.post(`Auth/GetUSER`, collectData).then((res) => {
      const arr = [];
      console.log("GetUSER result" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        setUsers(res.data.data);
      }
      // setOption(arr);
    });
  };

  const getEmployeeName = () => {
    const collectData = {
      useR_ID: "-1",
    };
    api.post(`Auth/GetUSER`, collectData).then(
      (res) => {
        // const arr = [];
        console.log("GetUSER" + JSON.stringify(res.data.data));
        setUsers(res.data.data);
      }
      // setOption(arr);
    );
  };

  const getRole = () => {
    const collectData = {
      roleId: "-1",
    };
    api.post(`Auth/GetRoleMaster`, collectData).then((res) => {
      const arr: any = [];
      console.log("GetRoleMaster" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["roleName"],
          value: res.data.data[index]["roleId"],
        });
      }
      setRoleOption(arr);
    });
  };

  const getRolebyid = (selectedRoleid: any) => {
    const collectDatas = {
      roleId: selectedRoleid,
    };
    api.post(`Auth/GetRoleSelectMenu`, collectDatas).then((res) => {
      const arr: any = [];
      console.log(
        "GetRoleSelectMenu" + JSON.stringify(res.data.data[0]["rolePermission"])
      );
      for (
        let index = 0;
        index < res.data.data[0]["rolePermission"].length;
        index++
      ) {
        arr.push(
          createdData(
            // index + 1,
            res.data.data[0]["rolePermission"][index]["roleId"],
            res.data.data[0]["rolePermission"][index]["menuId"],
            res.data.data[0]["rolePermission"][index]["parentId"],
            res.data.data[0]["rolePermission"][index]["menuName"],
            res.data.data[0]["rolePermission"][index]["parentMenuName"],
            res.data.data[0]["rolePermission"][index]["isAdd"],
            res.data.data[0]["rolePermission"][index]["isEdit"],
            res.data.data[0]["rolePermission"][index]["isDel"],
            res.data.data[0]["rolePermission"][index]["isView"],
            res.data.data[0]["rolePermission"][index]["isPrint"],
            res.data.data[0]["rolePermission"][index]["isExport"],
            res.data.data[0]["rolePermission"][index]["isRelease"],
            res.data.data[0]["rolePermission"][index]["isPost"],
            // res.data.data[0]["rolePermission"][index]["userId"],
            "-1"
          )
        );
      }
      // console.log(arr);
      setSelectedRoleData(arr);
      console.log(selectedRoleData);
    });
  };

  function handleFilter(event: any) {
    const newRows = rows.filter((rowss: { userName: string }) => {
      return rowss.userName
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    setRecords(newRows);
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setEnteredEployeeName(null);
    setEmployeeId("");
    setEnteredRoleName(null);
    setSelectedRoleID("");
    setEditID("");
    setOpen(false);
    // setSelectedRoleData("");
  };

  const handleOpen = () => {
    setEnteredEployeeName(null);
    setEmployeeId("");
    setEnteredRoleName(null);
    setOpen(true);
  };

  const getList = () => {
    const collectData = {
      userId: "-1",
      userPermission: [
        {
          userId: "",
          menuId: -1,
          parentId: 0,
          isAdd: true,
          isEdit: true,
          isDel: true,
          isView: true,
          isPrint: true,
          isExport: true,
          isRelease: true,
          isPost: true,
          menuName: "",
          parentMenuName: "",
          path: "",
          icon: "",
          displayNo: 0,
          parentDisplayNo: 0,
        },
      ],
    };
    api.post(`Auth/GetUserPermissionList`, collectData).then((res) => {
      const arr: any = [];
      console.log("GetUserPermissionList" + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push(
          createData(
            index + 1,
            res.data.data[index]["userId"],
            res.data.data[index]["userName"],
            res.data.data[index]["roleName"]
          )
        );
      }
      setRows(arr);
      setRecords(arr);
      setIsLoading(false);

      // console.log(records);
    });
  };

  const getRolebyID = (id: any) => {
    const collectData = {
      userId: id,
    };
    api.post("Auth/GetUserPermissionMaster", collectData).then((res) => {
      const arr: any = [];
      // console.log("result get " + JSON.stringify(res.data.data));
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push(
          createdData(
            // index + 1,
            res.data.data[index]["roleId"],
            res.data.data[index]["menuId"],
            res.data.data[index]["parentId"],
            res.data.data[index]["menuName"],
            res.data.data[index]["parentMenuName"],
            res.data.data[index]["isAdd"],
            res.data.data[index]["isEdit"],
            res.data.data[index]["isDel"],
            res.data.data[index]["isView"],
            res.data.data[index]["isPrint"],
            res.data.data[index]["isExport"],
            res.data.data[index]["isRelease"],
            res.data.data[index]["isPost"],
            id
          )
        );
      }
      // console.log(arr);
      //setRows(arr);
      setSelectedRoleData([]);
      setSelectedRoleData(arr);
      // console.log("records");
      // console.log(arr);
    });
  };


  const accept = () => {
    const collectData = {
      userId: delete_id,
    };
    // console.log(collectData);
    api
      .delete(`Auth/DeleteUserPermissionMaster`, { data: collectData })
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg);
          getList();
        } else {
          toast.error(response.data.mesg);
        }
      });
  };

  const reject = () => {
    //toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (row: any) => {
    console.log("row", row);
    delete_id = row.id;
    confirmDialog({
      message: "Do you want to delete this record ?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p=-button-danger",
      accept,
      reject,
    });
  };

  const routeChangeEdit = (row: any) => {
    const matchingUser = users.find(
      (users: any) => `${users.useR_ID}` === row.id
    );
    // var userdata= users.find((x:any)=>x.id==row.id);
    //  console.log(matchingUser)
    //getList();
    setEditID(row.id);
    setOpen(true);
    setEnteredEployeeName(matchingUser);
    setEmployeeId(row.id);
    getRolebyID(row.id);
  };

  /// NExt Page
  let navigate = useNavigate();
  const routeChangeAdd = () => {
    let path = `/master/TaxMasterAdd`;
    navigate(path);
  };

  const handleSelectAll = (value: string, evnt: any) => {
    if (value == "isAdd") {
      setSelectedRoleData((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isAdd: evnt,
        }))
      );
    } else if (value == "isEdit") {
      setSelectedRoleData((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isEdit: evnt,
        }))
      );
    } else if (value == "isDel") {
      setSelectedRoleData((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isDel: evnt,
        }))
      );
    } else if (value == "isView") {
      setSelectedRoleData((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isView: evnt,
        }))
      );
    } else if (value == "isPrint") {
      setSelectedRoleData((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isPrint: evnt,
        }))
      );
    } else if (value == "isExport") {
      setSelectedRoleData((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isExport: evnt,
        }))
      );
    } else if (value == "isRelease") {
      setSelectedRoleData((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isRelease: evnt,
        }))
      );
    } else if (value == "isPost") {
      setSelectedRoleData((prevData: any) =>
        prevData.map((item: any) => ({
          ...item,
          isPost: evnt,
        }))
      );
    }
  };

  const handleCheckboxChange = (selectedRoleid: any, header: string) => {
    // console.log(selectedRoleID)

    if (header == "isAdd") {
      // console.log(header)
      setSelectedRoleData((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === selectedRoleid
            ? { ...item, isAdd: !item.isAdd }
            : item
        )
      );
    } else if (header == "isEdit") {
      setSelectedRoleData((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === selectedRoleid
            ? { ...item, isEdit: !item.isEdit }
            : item
        )
      );
    } else if (header == "isDel") {
      setSelectedRoleData((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === selectedRoleid
            ? { ...item, isDel: !item.isDel }
            : item
        )
      );
    } else if (header == "isView") {
      setSelectedRoleData((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === selectedRoleid
            ? { ...item, isView: !item.isView }
            : item
        )
      );
    } else if (header == "isPrint") {
      setSelectedRoleData((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === selectedRoleid
            ? { ...item, isPrint: !item.isPrint }
            : item
        )
      );
    } else if (header == "isExport") {
      setSelectedRoleData((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === selectedRoleid
            ? { ...item, isExport: !item.isExport }
            : item
        )
      );
    } else if (header == "isRelease") {
      setSelectedRoleData((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === selectedRoleid
            ? { ...item, isRelease: !item.isRelease }
            : item
        )
      );
    } else if (header == "isPost") {
      setSelectedRoleData((prevData: any) =>
        prevData.map((item: any) =>
          item.menuId === selectedRoleid
            ? { ...item, isPost: !item.isPost }
            : item
        )
      );
    }
  };

  const selectedroleMasterSubmitHandler = (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();
    const collectData = {
      userId: employeeId,
      userPermission: selectedRoleData,
    };
    // console.log(collectData);
    api.post("Auth/AddUpdateUserPermissionMaster", collectData).then((res) => {
      if (res.data.isSuccess) {
        toast.success(res.data.mesg);
        setEnteredRoleName(null);
        setEnteredEployeeName(null);

        setOpen(false);
        let path = `/UserManagement/UserPermissionMaster`;
        getList();
        navigate(path);
      } else {
        toast.error(res.data.mesg);
      }
    });
  };

  const columns = [
    {
      field: "action",
      headerClassName: "MuiDataGrid-colCell",
      headerName: t("text.Action"),
      minWidth: 150,
      renderCell: (params: any) => (
        <Stack spacing={2} direction="row">
          <EditIcon
            style={{
              fontSize: "20px",
              color: "blue",
              cursor: "pointer",
            }}
            onClick={() => routeChangeEdit(params.row)}
          />
          <DeleteIcon
            style={{
              fontSize: "20px",
              color: "red",
              cursor: "pointer",
            }}
            onClick={() => handledeleteClick(params.row)}
          />
        </Stack>
      ),
    },
    // {
    //   field: "serialNo",
    //   headerName: t("text.SrNo"),
    //   flex: 1,
    //   headerClassName: "MuiDataGrid-colCell",
    // },
    {
      field: "userName",
      headerName: t("text.UserName"),
      flex: 1,
      headerClassName: "MuiDataGrid-colCell",
    },

    {
      field: "roleName",
      headerName: t("text.RoleName"),
      flex: 1,
      headerClassName: "MuiDataGrid-colCell",
    },
  ];

  return (
    <>
      <Card
        style={{
          width: "100%",
          // height: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #FF7722 ",
          marginTop: "3vh",
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
            {t("text.UserPermissionMaster")}
          </Typography>
          <Divider />

          <Box height={10} />

          <Stack direction="row" spacing={2} classes="my-2 mb-2">
            {/*permissionData?.isAdd == true && ( */}
            <Button
              onClick={handleOpen}
              variant="contained"
              endIcon={<AddCircleIcon />}
              size="large"
              style={{ backgroundColor: `var(--header-background)` }}
            >
              {t("text.add")}
            </Button>
            {/*)} */}

            {/*{permissionData?.isPrint == true ? (
              <Button variant="contained" endIcon={<PrintIcon />} size="large">
                {t("text.print")}
              </Button>
            ) : (
              ""
            )} */}
          </Stack>

          <Modal open={open}>
            <Box sx={style}>
              <form
                onSubmit={selectedroleMasterSubmitHandler}
              // onReset={rolemasterResetHandler}
              >
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    right: 10,
                    top: 8,
                    color: (theme) => theme.palette.grey[900],
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <Grid
                  container
                  spacing={2}
                  style={{ marginTop: "1px", marginBottom: "1px" }}
                >
                  <Grid md={4} item>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={users}
                      getOptionLabel={(users: any) =>
                        `${users.firsT_NAME} ${users.middlE_NAME} ${users.suR_NAME}`
                      }
                      fullWidth
                      // onOpen={() => {
                      //   getEmployeeName();
                      // }}
                      value={enteredEmployeeName}
                      size="small"
                      onChange={handleUserChange}
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          label={t("text.SelectEmployeeName")}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item lg={4} sm={4}>
                    <Grid>
                      <Button
                        type="submit"
                        fullWidth
                        style={{
                          backgroundColor: `var(--header-background)`,
                          color: `var(--header-color)`,
                          marginBottom: "10px",
                          marginTop: "3px",
                        }}
                      >
                        {edit == selectedRoleID
                          ? t("text.save")
                          : t("text.update")}
                      </Button>
                    </Grid>
                  </Grid>

                  <Grid item lg={4} sm={4}>
                    <Button
                      type="reset"
                      fullWidth
                      style={{
                        backgroundColor: "#F43F5E",
                        color: "white",
                        marginBottom: "10px",
                        marginTop: "3px",
                      }}
                    >
                      {t("text.reset")}
                    </Button>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid md={12} item>
                    <Grid style={{}}>
                      <TableContainer sx={{ maxHeight: "65vh" }}>
                        <table
                          style={{
                            width: "100%",
                            border: "1px solid black",
                            borderCollapse: "collapse",
                          }}
                        >
                          <thead>
                            <tr
                              style={{
                                border: "1px solid black",
                                fontSize: "2.7vh",
                                fontWeight: "500",
                                backgroundColor: `var(--header-background)`,
                                color: `var(--header-color)`,
                                textAlign: "center",
                              }}
                            >
                              {/* <td>Sr. No.</td> */}
                              <td>{t("text.MenuName")}</td>
                              <td>{t("text.ParentName")}</td>
                              <td>
                                {t("text.add")}
                                <br />
                                <input
                                  type="checkbox"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                  checked={
                                    selectedRoleData.length > 0
                                      ? selectedRoleData.every(
                                        (item: any) => item.isAdd
                                      )
                                      : false
                                  }
                                  defaultChecked={false}
                                  onChange={(e) =>
                                    handleSelectAll("isAdd", e.target.checked)
                                  }
                                />
                              </td>
                              <td>
                                {t("text.Edit")}
                                <br />
                                <input
                                  type="checkbox"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                  checked={
                                    selectedRoleData.length > 0
                                      ? selectedRoleData.every(
                                        (item: any) => item.isEdit
                                      )
                                      : false
                                  }
                                  onChange={(e) =>
                                    handleSelectAll("isEdit", e.target.checked)
                                  }
                                />
                              </td>
                              <td>
                                {t("text.delete")}
                                <br />
                                <input
                                  type="checkbox"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                  checked={
                                    selectedRoleData.length > 0
                                      ? selectedRoleData.every(
                                        (item: any) => item.isDel
                                      )
                                      : false
                                  }
                                  onChange={(e) =>
                                    handleSelectAll("isDel", e.target.checked)
                                  }
                                />
                              </td>
                              <td>
                                {t("text.View")}
                                <br />
                                <input
                                  type="checkbox"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                  checked={
                                    selectedRoleData.length > 0
                                      ? selectedRoleData.every(
                                        (item: any) => item.isView
                                      )
                                      : false
                                  }
                                  onChange={(e) =>
                                    handleSelectAll("isView", e.target.checked)
                                  }
                                />
                              </td>
                              <td>
                                {t("text.Print")}
                                <br />
                                <input
                                  type="checkbox"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                  checked={
                                    selectedRoleData.length > 0
                                      ? selectedRoleData.every(
                                        (item: any) => item.isPrint
                                      )
                                      : false
                                  }
                                  onChange={(e) =>
                                    handleSelectAll("isPrint", e.target.checked)
                                  }
                                />
                              </td>
                              <td>
                                {t("text.Export")}
                                <br />
                                <input
                                  type="checkbox"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                  checked={
                                    selectedRoleData.length > 0
                                      ? selectedRoleData.every(
                                        (item: any) => item.isExport
                                      )
                                      : false
                                  }
                                  onChange={(e) =>
                                    handleSelectAll(
                                      "isExport",
                                      e.target.checked
                                    )
                                  }
                                />
                              </td>

                              <td>
                                {t("text.Post")}
                                <br />
                                <input
                                  type="checkbox"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                  checked={
                                    selectedRoleData.length > 0
                                      ? selectedRoleData.every(
                                        (item: any) => item.isPost
                                      )
                                      : false
                                  }
                                  onChange={(e) =>
                                    handleSelectAll("isPost", e.target.checked)
                                  }
                                />
                              </td>
                              <td>
                                {t("text.Release")}
                                <br />
                                <input
                                  type="checkbox"
                                  style={{
                                    marginLeft: "10px",
                                    marginRight: "10px",
                                  }}
                                  checked={
                                    selectedRoleData.length > 0
                                      ? selectedRoleData.every(
                                        (item: any) => item.isRelease
                                      )
                                      : false
                                  }
                                  onChange={(e) =>
                                    handleSelectAll(
                                      "isRelease",
                                      e.target.checked
                                    )
                                  }
                                />
                              </td>

                            </tr>
                          </thead>
                          <tbody style={{ color: "black" }}>
                            {selectedRoleData.map(
                              (rows: any, key: string | number | any) => {
                                return (
                                  <>
                                    {
                                      <tr
                                        style={{
                                          border: "1px solid black",
                                          fontSize: "2.7vh",
                                          // fontWeight: "600",
                                          // background: "#5f9ea0",
                                          // color: "white",
                                        }}
                                      >
                                        {/* <td
                                    style={{
                                      padding: "10px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {rows.srno}
                                  </td> */}
                                        <td
                                          style={{
                                            padding: "10px",
                                            textAlign: "center",
                                          }}
                                        >
                                          {rows.menuName}
                                        </td>
                                        <td
                                          style={{
                                            padding: "10px",
                                            textAlign: "center",
                                          }}
                                        >
                                          {rows.parentMenuName}
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={
                                              selectedRoleData[key]["isAdd"]
                                                ? true
                                                : false
                                            }
                                            name="isAdd"
                                            className="isAdd"
                                            style={{
                                              marginLeft: "20px",
                                              marginRight: "20px",
                                            }}
                                            // aria-checked={selectedRoleData.every((item:any) =>  item.isAdd)}
                                            onChange={(e) =>
                                              handleCheckboxChange(
                                                rows.menuId,
                                                "isAdd"
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={
                                              selectedRoleData[key]["isEdit"]
                                                ? true
                                                : false
                                            }
                                            name="isEdit"
                                            className="isEdit"
                                            style={{
                                              marginLeft: "20px",
                                              marginRight: "20px",
                                            }}
                                            // aria-checked={selectedRoleData.every((item:any) =>  item.isEdit)}
                                            onChange={(e) =>
                                              handleCheckboxChange(
                                                rows.menuId,
                                                "isEdit"
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={
                                              selectedRoleData[key]["isDel"]
                                                ? true
                                                : false
                                            }
                                            name="isDel"
                                            className="isDel"
                                            style={{
                                              marginLeft: "20px",
                                              marginRight: "20px",
                                            }}
                                            // aria-aria-checked={selectedRoleData.every((item:any) =>  item.isDel)}
                                            onChange={(e) =>
                                              handleCheckboxChange(
                                                rows.menuId,
                                                "isDel"
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={
                                              selectedRoleData[key]["isView"]
                                                ? true
                                                : false
                                            }
                                            name="isView"
                                            className="isView"
                                            style={{
                                              marginLeft: "20px",
                                              marginRight: "20px",
                                            }}
                                            // aria-checked={selectedRoleData.every((item:any) =>  item.isView)}
                                            onChange={(e) =>
                                              handleCheckboxChange(
                                                rows.menuId,
                                                "isView"
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={
                                              selectedRoleData[key]["isPrint"]
                                                ? true
                                                : false
                                            }
                                            name="isPrint"
                                            className="isPrint"
                                            style={{
                                              marginLeft: "20px",
                                              marginRight: "20px",
                                            }}
                                            // aria-checked={selectedRoleData.every((item:any) =>  item.isPrint)}
                                            onChange={(e) =>
                                              handleCheckboxChange(
                                                rows.menuId,
                                                "isPrint"
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={
                                              selectedRoleData[key]["isExport"]
                                                ? true
                                                : false
                                            }
                                            name="isExport"
                                            className="isExport"
                                            style={{
                                              marginLeft: "25px",
                                              marginRight: "25px",
                                            }}
                                            // aria-checked={selectedRoleData.every((item:any) =>  item.isExport)}
                                            onChange={(e) =>
                                              handleCheckboxChange(
                                                rows.menuId,
                                                "isExport"
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={
                                              selectedRoleData[key]["isPost"]
                                                ? true
                                                : false
                                            }
                                            name="isPost"
                                            className="isPost"
                                            style={{
                                              marginLeft: "20px",
                                              marginRight: "20px",
                                            }}
                                            // aria-checked={selectedRoleData.every((item:any) =>  item.isPost)}
                                            onChange={(e) =>
                                              handleCheckboxChange(
                                                rows.menuId,
                                                "isPost"
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={
                                              selectedRoleData[key]["isRelease"]
                                                ? true
                                                : false
                                            }
                                            name="isRelease"
                                            className="isRelease"
                                            style={{
                                              marginLeft: "25px",
                                              marginRight: "25px",
                                            }}
                                            // aria-checked={selectedRoleData.every((item:any) =>  item.isRelease)}
                                            onChange={(e) =>
                                              handleCheckboxChange(
                                                rows.menuId,
                                                "isRelease"
                                              )
                                            }
                                          />
                                        </td>

                                      </tr>
                                    }
                                  </>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Modal>

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
            <Box>
              <br />
              <div
                style={{
                  width: "100%",
                  backgroundColor: `var(--grid-background)`,
                }}
              >
                <DataGrid
                  rows={records}
                  columns={columns}
                  autoHeight
                  slots={{
                    toolbar: GridToolbar,
                  }}
                  rowSpacingType="border"
                  pagination={true}
                  pageSizeOptions={[5, 10, 25, 50, 100].map((size) => ({
                    value: size,
                    label: `${size}`,
                  }))}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                />
              </div>
            </Box>
          )}
        </Paper>
      </Card>

      <ToastApp />
    </>
  );
}
