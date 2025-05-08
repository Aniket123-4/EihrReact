

import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Card,
  Grid,
  Avatar,
  Skeleton,
  useMediaQuery,
  Switch,
  FormControlLabel,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate, useLocation } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import api from "../../utils/Url";
import { useTranslation } from "react-i18next";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { getISTDate } from "../../utils/Constant";
import { PatientFile } from "./PatientFile";
//import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";

interface PatientData {
  serialNo: number;
  id: number;
  patientID: number;
  patientNo: string;
  candName: string;
  dob: string;
  age: number;
  genderName: string;
  bloodGroup: string;
  curMobileNo: string;
  email: string;
  [key: string]: any;
}

export default function PatientRegistration() {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPatientFile, setShowPatientFile] = useState(false);
  const [selectedPatientData, setSelectedPatientData] = useState<PatientData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
interface Props {
  open: boolean;
  onClose: () => void;
  PateintNo: string;
  theme?: string; // Add the theme prop as optional
}
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { defaultValuestime } = getISTDate();

  // Enhanced theme variables
  const themeStyles = {
    dark: {
      background: '#1A2027',
      text: '#ffffff',
      gridHeader: '#2D3846',
      gridRow: '#2D3846',
    },
    light: {
      background: '#FFFFFF',
      text: '#1A2027',
      gridHeader: '#F8F9FA',
      gridRow: '#FFFFFF',
    }
  };

  const currentTheme = isDarkMode ? themeStyles.dark : themeStyles.light;

  // Enhanced export functionality
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(patients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
    XLSX.writeFile(workbook, "Patients.xlsx");
  };
  
  let delete_id: number | null = null; // Use appropriate type

  const acceptDelete = () => {
    if (delete_id === null) return;
    const collectData = {
      PatientID: delete_id, // Assuming API expects PatientID
      // Add other required fields for deletion if necessary
      // UserID: ...
    };
    // *** IMPORTANT: Verify the correct API endpoint and payload for deletion ***
    // Example: api.delete or api.post for soft delete
    api
      .post(`Patient/DeletePatient`, collectData) // Replace with your actual delete endpoint and method
      .then((response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.mesg || t("text.SuccessfullyDeleted"));
        //  getList(); // Refresh list after delete
        } else {
          toast.error(response.data.mesg || t("text.FailedToDelete"));
        }
      })
      .catch(err => {
        toast.error(t("text.FailedToDelete"));
        console.error("Deletion error:", err);
      });
  };

  const rejectDelete = () => {
    toast.info(t("text.DeletionCancelled"), { autoClose: 3000 });
  };

  const handleDeleteClick = (id: number) => {
    delete_id = id;
    confirmDialog({
      message: t("text.AreYouSureToDelete"), // Use translation
      header: t("text.DeleteConfirmation"), // Use translation
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: acceptDelete,
      reject: rejectDelete,
    });
  };
  const handlePatientNoClick = (patientData: PatientData) => {
    setSelectedPatientData(patientData);
    setShowPatientFile(true);
  };
  const routeChangeEdit = (row: any) => {
    // console.log(row);
    let path = `/Patient/PatientRegistrationEdit`;
    navigate(path, {
      state: row,
    });
  };

  const routeChangeAdd = () => {
    navigate(`/Patient/PatientRegistrationAdd`); // Ensure route is correct
  };

 const getList = async () => {
    setIsLoading(true);
    try {
      const collectData = {
        patientNo: "",
        patientUIDNo: "",
        ageGreater: 0,
        genderID: -1,
        civilStatusID: -1,
        bloodGroupID: -1,
        nationalityID: -1,
        serviceTypeID: -1,
        patientName: "",
        patientMobileNo: "",
        patientPhoneNo: "",
        patientDOB: "1900-01-01",
        fromDate: "1900-01-21",
        toDate: defaultValuestime,
        isDeleted: false,
        userID: -1,
        formID: -1,
        type: 1,
        patientID: -1,
      };
      const response = await api.post<{ isSuccess: boolean; result: any[], mesg: string }>(
        `GetPatientSearch`,
        collectData
      );

      if (response.data.isSuccess) {
        const data = response.data.result;
        const patientsWithSerial: PatientData[] = data.map((patient: any, index: any) => ({
          ...patient,
          serialNo: index + 1,
          id: patient.patientID, // Ensure 'id' is set for DataGrid
        }));
        setPatients(patientsWithSerial);
      } else {
        toast.error(response.data.mesg || t("text.FailedToFetchData"));
        setPatients([]); // Clear data on error
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      toast.error(t("text.NetworkOrServerError"));
      setPatients([]); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getList();
  }, []); 
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Patient List", 14, 16);
    autoTable(doc, {
      head: [['No.', 'Patient ID', 'Name', 'Age', 'Gender', 'Blood Group', 'Mobile']],
      body: patients.map(p => [p.serialNo, p.patientNo, p.candName, p.age, p.genderName, p.bloodGroup, p.curMobileNo]),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });
    doc.save('patients.pdf');
  };

  // Enhanced columns with responsive widths
  const columns: GridColDef<PatientData>[] = [
    {
      field: "actions",
      headerName: t("text.Action"),
      width: 70, // Adjust width as needed
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<any, PatientData>) => ( // Use specific type
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title={t("text.edit") || "Edit"}>
          
            <IconButton size="small" color="primary" onClick={() => routeChangeEdit(params.row)}>
              <EditIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>

        </Stack>
      ),
    },

    {
      field: "patientNo",
      headerName: "Patient No.",
      width: 100,
      renderCell: (params: any) => (
        <Typography
          component="span"
          onClick={() => handlePatientNoClick(params.row)}
          sx={{
            cursor: 'pointer',
            color: 'primary.main',
            textDecoration: 'underline',
            '&:hover': {
              color: 'primary.dark',
            },
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    { field: "candName", headerName: "Candidate Name", width: 200, flex: 2 },
    { field: "dob", headerName: t("text.DOB"), width: 120 },
  ///  { field: "age", headerName: t("text.Age"), width: 90 },
    { field: "genderName", headerName: t("text.GenderName") || "Gender", width: 110 },
    { field: "bloodGroup", headerName: "Blood Group", width: 120 },
    { field: "curMobileNo", headerName: t("text.MobileNumber") || "Mobile Number", width: 150 },
    { field: "email", headerName: t("text.Email"), width: 200, flex: 1 },
    // Add other columns as needed
  ];

  return (
    <Card sx={{ 
      m: 2, 
      boxShadow: 3, 
      borderRadius: 4,
      backgroundColor: currentTheme.background,
      transition: 'background 0.3s ease'
    }}>
      <Paper sx={{ 
        p: 2, 
        backgroundColor: currentTheme.background,
        borderRadius: 4
      }}>
        <ConfirmDialog />
        
        <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={8} md={10}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ 
                bgcolor: isDarkMode ? '#2D3846' : 'primary.main',
                width: 40,
                height: 40,
                transition: 'all 0.3s ease'
              }}>
                <PersonSearchIcon fontSize={isMobile ? "small" : "medium"} />
              </Avatar>
              <Typography variant="h4" sx={{ 
                color: currentTheme.text,
                fontWeight: 700,
                fontSize: isMobile ? '1.5rem' : '2rem'
              }}>
                {t("text.PatientSearch")}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} md={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={isDarkMode}
                  onChange={() => setIsDarkMode(!isDarkMode)}
                  color="primary"
                />
              }
              label={isDarkMode ? t("text.DarkMode") : t("text.LightMode")}
              sx={{ color: currentTheme.text }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ 
          borderColor: isDarkMode ? '#2D3846' : '#e0e0e0', 
          mb: 3 
        }} />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
          <Button
            onClick={() => navigate('/Patient/PatientRegistrationAdd')}
            variant="contained"
            startIcon={<AddCircleIcon />}
            sx={{
              bgcolor: isDarkMode ? '#2D3846' : 'primary.main',
              color: isDarkMode ? '#fff' : '#fff',
              '&:hover': {
                bgcolor: isDarkMode ? '#3A4552' : 'primary.dark',
                transform: 'translateY(-2px)',
                boxShadow: 3
              },
              transition: 'all 0.3s ease',
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1
            }}
          >
            {t("text.AddPatient")}
          </Button>

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportToExcel}
            sx={{
              borderColor: isDarkMode ? '#2D3846' : 'primary.main',
              color: isDarkMode ? currentTheme.text : 'primary.main',
              '&:hover': {
                borderColor: isDarkMode ? '#3A4552' : 'primary.dark',
                backgroundColor: isDarkMode ? 'rgba(45,56,70,0.1)' : 'rgba(25,118,210,0.04)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease',
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1
            }}
          >
            Export Excel
          </Button>
        </Stack>

        <Box sx={{ height: 'calc(100vh - 250px)', width: '100%', backgroundColor: `var(--grid-background)` }}>
          <DataGrid
            rows={patients}
            columns={columns}
            loading={isLoading}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            slots={{
              toolbar: GridToolbar,
              loadingOverlay: () => (
                <Box sx={{
                  position: 'absolute', top: 0, width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.7)'
                }}>
                  <CircularProgress />
                </Box>
              ),
              noRowsOverlay: () => (
                <Box sx={{
                  p: 3, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', height: '100%'
                }}>
                  <Typography>No Patient Data Found</Typography>
                </Box>
              )
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
                printOptions: { disableToolbarButton: true },
                csvOptions: { disableToolbarButton: false },
              },
            }}
            disableRowSelectionOnClick
            sx={{
              border: 1,
              borderColor: 'divider',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: `var(--grid-headerBackground)`,
                color: `var(--grid-headerColor)`,
              },
              '& .MuiDataGrid-toolbarContainer': {
                padding: 1,
                borderBottom: 1,
                borderColor: 'divider',
              }
            }}
          />

        </Box>

        {/* Enhanced Patient File Modal */}
        {selectedPatientData && (
          <PatientFile
            open={showPatientFile}
            onClose={() => {
              setShowPatientFile(false);
              setSelectedPatientData(null);
            }}
            PateintNo={selectedPatientData.patientNo}
          //  theme={isDarkMode ? 'dark' : 'light'}
          />
        )}
      </Paper>
    </Card>
  );
}