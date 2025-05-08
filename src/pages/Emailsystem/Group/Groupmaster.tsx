import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
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
import axios from "axios";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import HOST_URL from '../../../utils/Url';
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
import { getISTDate } from "../../../utils/Constant";
import {
  GridColDef,
} from "@mui/x-data-grid";
import DataGrids from "../../../utils/Datagrids";
import api from "../../../utils/Url";

const { defaultValuestime } = getISTDate();
interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}
export default function Groupmaster() {
  const [item, setItem] = useState([]);
  const [columns, setColumns] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  let navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {
    fetchgroupData();

  }, [isLoading]);
  const routeChangeEdit = (row: any) => {
    console.log("row " + row);

    let path = `/emailsystem/Editgroupmaster`;
    navigate(path, {
      state: row,
    });
  };
  const routeChangeAdd = () => {
    let path = `/emailsystem/Creategroupmaster`;
    navigate(path);
  };
  let delete_id = "";
  const accept = () => {
    const collectData = {
      groupId: delete_id,
    };
    console.log("collectData " + JSON.stringify(collectData));
    api
      .post(`Comm/DeleteCommGroup`, collectData)
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        fetchgroupData();
      });
  };
  const reject = () => {
    toast.warn("Rejected: You have rejected", { autoClose: 3000 });
  };

  const handledeleteClick = (del_id: any) => {
    console.log(del_id + " del_id ");
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
  const fetchgroupData = async () => {
    try {
      const collectData = {
        groupId: -1

      };
      const response = await api.post(`Comm/GetCommGroup`, collectData);
      const data = response.data.data;
      console.log("🚀 ~ fetchgroupData ~ response.data.data:", response.data.data)
      const groupWithIds = data.map((group: any, index: any) => ({
        ...group,
        serialNo: index + 1,
        id: group.groupId,
      }));
      setItem(groupWithIds);
      setIsLoading(false);
      if (data.length > 0) {
        const columns: GridColDef[] = [
          {
            field: "actions",
            headerClassName: "MuiDataGrid-colCell",
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
                </Stack>,
              ];
            },
          },
          {
            field: "serialNo",
            headerName: t("text.SrNo"),
            flex: 1,
            // headerClassName: "MuiDataGrid-colCell",
          },
          {
            field: "name",
            headerName: t("text.name"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },

          {
            field: "description",
            headerName: t("text.description"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
          
          {
            field: "isActive",
            headerName: t("text.isActive"),
            flex: 1,
            headerClassName: "MuiDataGrid-colCell",
          },
        ];
        setColumns(columns as any);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // setLoading(false);
    }
  };
  const adjustedColumns = columns.map((column: any) => ({
    ...column,
  }));
  return (
    <>
      <Card
        style={{
          width: "100%",
          // height: "100%",
          backgroundColor: "#E9FDEE",
          border: ".5px solid #FF7722 ",
          marginTop: "3vh"
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
              fontWeight: 900
            },
          }}
          style={{ padding: "10px", }}
        >
          <ConfirmDialog />
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "20px" }}
            align="left"
          >
            {t("text.Groupmaster")}
          </Typography>
          <Divider />
          <Box height={10} />
          <Stack direction="row" spacing={2} classes="my-2 mb-2">
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
          <DataGrids
            isLoading={isLoading}
            rows={item}
            columns={adjustedColumns}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialPageSize={5}
          />
        </Paper>
      </Card>
      <ToastApp />
    </>
  );
}
