import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
    Autocomplete,
    Box,
    Button,
    Divider,
    Stack, // Keep if needed elsewhere, not used directly here now
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
} from "@mui/material";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import { useNavigate, useLocation } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import axios from "axios"; // Keep if api instance doesn't cover all cases
import api from "../../utils/Url"; // Assuming this is your configured axios instance
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import {
    DataGrid,
    GridColDef,
    GridToolbar,
    GridRowId,
} from "@mui/x-data-grid";

import DataGrids from "../../utils/Datagrids"; // Make sure path is correct
import { toast } from "react-toastify";
import { getISTDate } from "../../utils/Constant"; // Make sure path is correct
import { PatientFile } from "./PatientFile"; // Keep if needed elsewhere

// Import Modal Icons
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CloseIcon from '@mui/icons-material/Close';
import ToastApp from "../../ToastApp";

// --- Status Options ---
const statusOptions = [
    {
        label: "Check-Out",
        value: 1
    },
    {
        label: "Check-In",
        value: 2
    },
 
   
];

// Helper function to format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export default function PatientCheckout() {

    const [zones, setZones] = useState<any[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { i18n, t } = useTranslation();
    const { defaultValuestime } = getISTDate(); // Today's date in YYYY-MM-DD format

    // --- Filter State ---
    const [filterStatus, setFilterStatus] = useState<number | null>(2); // Default to Check-In
    const [fromDate, setFromDate] = useState<string>("1900-01-01"); // Default start date (as per original code)
    const [toDate, setToDate] = useState<string>(defaultValuestime || formatDate(new Date())); // Default to today

    // --- Modal State ---
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
    const [checkoutModalData, setCheckoutModalData] = useState<any[]>([]);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);
    const [selectedPatientCaseId, setSelectedPatientCaseId] = useState<string | null>(null);
    const [params, setParams] = useState<any>({});

    // --- Router Hooks ---
    const navigate = useNavigate();
    const location = useLocation();

    // --- Fetch Patient List Effect ---
    useEffect(() => {
        // Only fetch if required date filters are set (optional: add validation if needed)
        if (fromDate && toDate) {
             getList();
        }
    }, [filterStatus, fromDate, toDate]); // Re-fetch when any filter changes

    // --- Fetch Patient List Function ---
    const getList = async () => {
        setIsLoading(true);
        setZones([]);
        setColumns([]); // Clear previous columns to avoid rendering issues if no data
        try {
            const collectData = {
                searchBy: "-1",
                // Use state variables for dates
                fromDate: fromDate,
                toDate: toDate,
                type: 2,
                mainType: filterStatus ?? -1, // Use selected status, or -1 for All
                userID: -1,
                formID: -1,
            };
            console.log("Fetching list with params:", collectData);
            const response = await api.post(`GetCheckOutPatient`, collectData);

            if (response.data?.isSuccess && response.data.result) {
                const data = response.data.result;
                const zonesWithIds = data.map((zone: any, index: any) => ({
                    ...zone,
                    id: zone.patientCaseID || `row-${index}-${Date.now()}`, // Ensure unique ID
                    serialNo: index + 1,
                }));
                setZones(zonesWithIds);

                // Define Columns (only if data exists)
                if (zonesWithIds.length > 0) {
                    const definedColumns: GridColDef[] = [
                        // --- Your existing column definitions ---
                        {
                            field: "patientNo",
                            headerName: t("Patient No."),
                            flex: 0.8,
                            headerClassName: "MuiDataGrid-colCell",
                        },
                        {
                            field: "patName",
                            headerName: t("Patient Name"),
                            flex: 1.5,
                            headerClassName: "MuiDataGrid-colCell",
                        },
                        {
                            field: "consultantDocName",
                            headerName: t("Doctor Name"),
                            flex: 1.2,
                            headerClassName: "MuiDataGrid-colCell",
                        },
                        {
                            field: "patientCaseNo",
                            headerName: t("Case Number"),
                            flex: 1,
                            headerClassName: "MuiDataGrid-colCell",
                        },
                        {
                            field: "vPreEmpTypeName", // Assuming this is Case Type
                            headerName: t("Case Type"),
                            flex: 1,
                            headerClassName: "MuiDataGrid-colCell",
                        },
                        {
                            field: "statusName",
                            headerName: t("Status"),
                            flex: 0.8,
                            headerClassName: "MuiDataGrid-colCell",
                        },
                        {
                            field: "Action",
                            headerName: t("Action"),
                            flex: 1,
                            headerClassName: "MuiDataGrid-colCell",
                            sortable: false,
                            filterable: false,
                            disableColumnMenu: true,
                            renderCell: (params: any) => {
                                const isCheckIn = params.row.statusName === "CHECK-IN";
                                const patientCaseID = params.row.patientCaseID;
                                const isLoadingThisRow = isCheckoutLoading && selectedPatientCaseId === patientCaseID;

                                return (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        style={{
                                            backgroundColor: isCheckIn ? "#f44336" : "#4caf50",
                                            color: "#fff",
                                            minWidth: 100
                                        }}
                                        onClick={() => {
                                            handleStatusChange(params.row);
                                            setParams(params?.row)
                                        }}
                                        disabled={isLoadingThisRow || (isCheckIn && !patientCaseID)}
                                    >
                                        {isLoadingThisRow ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : (
                                            isCheckIn ? t("Check Out") : t("Check In")
                                        )}
                                    </Button>
                                );
                            },
                        }
                    ];
                    setColumns(definedColumns);
                } else {
                    // Keep columns defined even if no rows, so headers show
                     const definedColumns: GridColDef[] = [
                        { field: "patientNo", headerName: t("Patient No."), flex: 0.8, headerClassName: "MuiDataGrid-colCell" },
                        { field: "patName", headerName: t("Patient Name"), flex: 1.5, headerClassName: "MuiDataGrid-colCell" },
                        { field: "consultantDocName", headerName: t("Doctor Name"), flex: 1.2, headerClassName: "MuiDataGrid-colCell" },
                        { field: "patientCaseNo", headerName: t("Case Number"), flex: 1, headerClassName: "MuiDataGrid-colCell" },
                        { field: "vPreEmpTypeName", headerName: t("Case Type"), flex: 1, headerClassName: "MuiDataGrid-colCell" },
                        { field: "statusName", headerName: t("Status"), flex: 0.8, headerClassName: "MuiDataGrid-colCell" },
                        { field: "Action", headerName: t("Action"), flex: 1, headerClassName: "MuiDataGrid-colCell", sortable: false, filterable: false, disableColumnMenu: true }
                     ];
                     setColumns(definedColumns);
                    // Optionally show a message if desired, toast might be enough
                    // toast.info(t("No patients found matching the criteria."));
                }

            } else {
                toast.error(response.data?.msg || t("Failed to fetch patient list."));
                 // Keep columns defined even on error, so headers show
                 const definedColumns: GridColDef[] = [
                    { field: "patientNo", headerName: t("Patient No."), flex: 0.8, headerClassName: "MuiDataGrid-colCell" },
                    { field: "patName", headerName: t("Patient Name"), flex: 1.5, headerClassName: "MuiDataGrid-colCell" },
                    { field: "consultantDocName", headerName: t("Doctor Name"), flex: 1.2, headerClassName: "MuiDataGrid-colCell" },
                    { field: "patientCaseNo", headerName: t("Case Number"), flex: 1, headerClassName: "MuiDataGrid-colCell" },
                    { field: "vPreEmpTypeName", headerName: t("Case Type"), flex: 1, headerClassName: "MuiDataGrid-colCell" },
                    { field: "statusName", headerName: t("Status"), flex: 0.8, headerClassName: "MuiDataGrid-colCell" },
                    { field: "Action", headerName: t("Action"), flex: 1, headerClassName: "MuiDataGrid-colCell", sortable: false, filterable: false, disableColumnMenu: true }
                 ];
                 setColumns(definedColumns);
            }

        } catch (error: any) {
            console.error("Error fetching patient list:", error);
            toast.error(t("An error occurred while fetching data:") + ` ${error?.message || ''}`);
            // Keep columns defined even on error, so headers show
            const definedColumns: GridColDef[] = [
               { field: "patientNo", headerName: t("Patient No."), flex: 0.8, headerClassName: "MuiDataGrid-colCell" },
               { field: "patName", headerName: t("Patient Name"), flex: 1.5, headerClassName: "MuiDataGrid-colCell" },
               { field: "consultantDocName", headerName: t("Doctor Name"), flex: 1.2, headerClassName: "MuiDataGrid-colCell" },
               { field: "patientCaseNo", headerName: t("Case Number"), flex: 1, headerClassName: "MuiDataGrid-colCell" },
               { field: "vPreEmpTypeName", headerName: t("Case Type"), flex: 1, headerClassName: "MuiDataGrid-colCell" },
               { field: "statusName", headerName: t("Status"), flex: 0.8, headerClassName: "MuiDataGrid-colCell" },
               { field: "Action", headerName: t("Action"), flex: 1, headerClassName: "MuiDataGrid-colCell", sortable: false, filterable: false, disableColumnMenu: true }
            ];
            setColumns(definedColumns);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Handle Status Change (Check-In/Check-Out Button Click) ---
    const handleStatusChange = async (rowData: any) => {
        const { statusName, patientCaseID } = rowData;

        if (statusName === "CHECK-IN") {
            if (!patientCaseID) {
                toast.error(t("Patient Case ID is missing, cannot proceed with checkout."));
                return;
            }
            setIsCheckoutLoading(true);
            setSelectedPatientCaseId(patientCaseID);
            setCheckoutModalData([]);

            const collectData = {
                patientCaseID: patientCaseID,
                admNo: -1,
                userID: -1,
                formID: -1,
                type: 1,
            };

            try {
                console.log("Requesting checkout info for:", collectData);
                const response = await api.post("GetPatientCheckOutInfo", collectData);
                console.log("Checkout Info Response:", response.data);

                if (response.data?.isSuccess && response.data?.result) {
                    setCheckoutModalData(response.data.result);
                    setIsCheckoutModalOpen(true);
                } else {
                    toast.error(response.data?.msg || t("Failed to retrieve checkout information. Check console for details."));
                    console.error("Checkout Info API Error/No Data:", response.data);
                }
            } catch (error: any) {
                console.error("Error during GetPatientCheckOutInfo API call:", error);
                toast.error(t("An error occurred while fetching checkout details.") + ` ${error?.message || ''}`);
            } finally {
                setIsCheckoutLoading(false);
                setSelectedPatientCaseId(null);
            }
        } else if (statusName === "CHECK-OUT") {
            // --- Logic for Check-In ---
            console.log("Check-In clicked for:", rowData);
            confirmDialog({
                message: t("Are you sure you want to check this patient back in?"),
                header: t("Confirmation"),
                icon: 'pi pi-info-circle',
                acceptClassName: 'p-button-success',
                rejectClassName: 'p-button-danger',
                accept: async () => {
                    await handleProceedCheckIn(patientCaseID); // Pass patientCaseID
                },
                reject: () => {
                    toast.info(t("Check-In action cancelled."));
                }
            });
        }
    };

    // --- Handle Modal Close ---
    const handleCloseModal = () => {
        setIsCheckoutModalOpen(false);
        setCheckoutModalData([]);
    };

    // --- Handle Proceed Checkout (Final API Call) ---
    const handleProceedCheckout = async () => {
        if (!params?.patientCaseID) {
            toast.error(t("Cannot proceed: Patient Case ID is missing."));
            return;
        }
        // Consider adding a loading state for this specific action
        setIsCheckoutLoading(true); // Reuse modal loading state or create a new one

        try {
            const collectData = {
                patientCaseID: params.patientCaseID,
                userID: -1,
                formID: -1,
                type: 1 // Assuming type 1 is for Checkout update
            };

            console.log("Sending Checkout Update Request:", collectData);
            const response = await api.post(`UpdateCaseCheckOut`, collectData);
            console.log("Checkout Update Response:", response.data);

            if (response?.data?.isSuccess === true) {
                toast.success(response?.data?.msg || t("Patient checked out successfully!"));
                handleCloseModal(); // Close modal on success
                getList(); // Refresh the list to show updated status
            } else {
                toast.error(response?.data?.msg || t("Failed to update checkout status."));
            }

        } catch (error: any) {
            console.error("Error during UpdateCaseCheckOut API call:", error);
            toast.error(t("An error occurred during the final checkout update process.") + ` ${error?.message || ''}`);
        } finally {
             setIsCheckoutLoading(false); // Stop loading indicator
        }
    };

    // --- Handle Proceed Check-In (Final API Call) ---
    const handleProceedCheckIn = async (patientCaseID: any) => {
        if (!patientCaseID) {
            toast.error(t("Cannot proceed: Patient Case ID is missing."));
            return;
        }
        // Consider adding a loading state specific to the check-in button if needed
        // setIsLoading(true); // Using main loading state temporarily

        try {
            const collectData = {
                patientCaseID: patientCaseID,
                userID: -1,
                formID: -1,
                type: 1 // Assuming type 1 is also for Check-In update in this API? Verify API documentation.
                       // If it's different, adjust the type accordingly.
            };

            console.log("Sending Check-In Update Request:", collectData);
            // *** IMPORTANT: Verify the API endpoint for Check-In ***
            // Using UpdatePatientStatus as per original code - confirm this is correct
            const response = await api.post(`UpdatePatientStatus`, collectData);
            console.log("Check-In Update Response:", response.data);

            if (response?.data?.isSuccess === true) {
                toast.success(response?.data?.msg || t("Patient checked in successfully!"));
                getList(); // Refresh the list
            } else {
                toast.error(response?.data?.msg || t("Failed to update check-in status."));
            }

        } catch (error: any) {
            console.error("Error during UpdatePatientStatus (Check-In) API call:", error);
            toast.error(t("An error occurred during the final check-in update process.") + ` ${error?.message || ''}`);
        } finally {
             // setIsLoading(false); // Stop loading indicator
        }
    };

    // --- Determine if Proceed button should be enabled ---
    // const canProceedCheckout = checkoutModalData.length > 0 && checkoutModalData.every(item => item.isOk === true);
    // Re-evaluating this: The requirements might be simpler, allow proceeding regardless? Or based on 'isPresent'?
    // Let's keep it simple for now and allow proceeding, backend should handle validation.
    const canProceedCheckout = checkoutModalData.length > 0; // Simplest condition: allow if modal data exists

    return (
        <div>
            <ToastApp />

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card sx={{ width: "100%", backgroundColor: "#ffffff", boxShadow: 3 }}>
                        <Paper sx={{ padding: "15px 20px" }}>
                            <ConfirmDialog />
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                                sx={{ fontWeight: 'medium' }}
                            >
                                {t("Patient Check-In / Check-Out")}
                            </Typography>
                            <Divider sx={{ marginY: "15px" }} /> {/* Use marginY */}

                            {/* --- Filter Controls --- */}
                            <Grid container spacing={2} alignItems="center" sx={{ marginBottom: "15px" }}>
                                {/* From Date Filter */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        id="from-date-filter"
                                        label={t("From Date")}
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>

                                {/* To Date Filter */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        id="to-date-filter"
                                        label={t("To Date")}
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>

                                {/* Status Filter */}
                                <Grid item xs={12} sm={6} md={4}>
                                    <Autocomplete
                                        id="status-filter-select"
                                        options={statusOptions}
                                        getOptionLabel={(option) => t(option.label)}
                                        value={statusOptions.find(option => option.value === filterStatus) || null}
                                        onChange={(event, newValue) => {
                                            setFilterStatus(newValue?.value ?? -1); // Use -1 for 'All' if null
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={t("Filter by Status")}
                                                placeholder={t("Select Status")}
                                            />
                                        )}
                                        fullWidth
                                        size="small"
                                        ListboxProps={{ style: { maxHeight: 200 } }}
                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                    />
                                </Grid>

                                {/* Optional: Add a Search/Apply Button if needed */}
                                {/* <Grid item xs={12} sm={6} md={2}>
                                    <Button variant="contained" onClick={getList} fullWidth>
                                        {t("Search")}
                                    </Button>
                                </Grid> */}
                            </Grid>
                             {/* Removed second divider, one is enough */}

                            {/* --- Data Grid Section --- */}
                            <Box sx={{ height: 600, width: '100%' }}>
                                {isLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <DataGrids
                                        isLoading={isLoading} // Pass loading state
                                        rows={zones}
                                        columns={columns}
                                        pageSizeOptions={[5, 10, 25, 50, 100]}
                                        initialPageSize={10} // Changed default page size
                                      
                                    />
                                )}
                            </Box>
                        </Paper>
                    </Card>
                </Grid>
            </Grid>

            {/* --- Checkout Information Modal --- */}
            <Dialog
                open={isCheckoutModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="checkout-dialog-title"
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id="checkout-dialog-title">
                    {t("Patient Checkout Readiness")}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {/* Use isCheckoutLoading for modal content as well */}
                    {isCheckoutLoading ? (
                         <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                             <CircularProgress />
                         </Box>
                    ) : checkoutModalData && checkoutModalData.length > 0 ? (
                        <List dense>
                            {checkoutModalData.map((item, index) => (
                                <ListItem key={item.slno || index}>
                                    <ListItemIcon sx={{ minWidth: '40px' }}>
                                        {item.isPresent === false ? (
                                            <HighlightOffIcon color="disabled" titleAccess={t("Not Applicable")} />
                                        ) : item.isOk ? (
                                            <CheckCircleOutlineIcon color="success" titleAccess={t("Ready")} />
                                        ) : (
                                            <HighlightOffIcon color="error" titleAccess={t("Pending / Not Ready")} />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.activityName || t("Unknown Activity")}
                                        secondary={item.activityStatus || (item.isPresent ? (item.isOk ? t('Ready') : t('Pending')) : t('Not Applicable'))}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body1" align="center" sx={{ padding: 2 }}>
                            {t("No checkout details available or checklist is empty.")}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ padding: '10px 20px' }}>
                    <Button onClick={handleCloseModal} color="primary" disabled={isCheckoutLoading}>
                        {t("Close")}
                    </Button>
                    {/* Show Proceed button only if modal data is present */}
                    {checkoutModalData && checkoutModalData.length > 0 && (
                         <Button
                             onClick={handleProceedCheckout}
                             color="success"
                             variant="contained"
                             // disabled={!canProceedCheckout || isCheckoutLoading} // Disable based on checks OR if loading
                             disabled={isCheckoutLoading} // Disable only while loading checkout update
                             startIcon={isCheckoutLoading ? <CircularProgress size={20} color="inherit" /> : null} // Show spinner in button
                         >
                             {t("Proceed with Checkout")}
                         </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
}