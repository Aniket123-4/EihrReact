import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
    Autocomplete,
    Box,
    Button, // Kept for potential future use
    Divider,
    // Stack, // Removed as not directly used now
    TextField,
    Typography,
    // Dialog, // Removed as not used
    // DialogTitle, // Removed as not used
    // DialogContent, // Removed as not used
    // DialogActions, // Removed as not used
    // List, // Removed as not used
    // ListItem, // Removed as not used
    // ListItemIcon, // Removed as not used
    // ListItemText, // Removed as not used
    // IconButton, // Removed as not used
    // CloseIcon, // Removed as not used
    // CheckCircleOutlineIcon, // Removed as not used
    // HighlightOffIcon, // Removed as not used
} from "@mui/material";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid"; // Using Grid for layout

// Removed unused imports: useNavigate, useLocation, PatientFile
// Removed unused icons

import { ConfirmDialog } from "primereact/confirmdialog"; // Kept confirm dialog
// import axios from "axios"; // Use configured api instance
import api from "../../utils/Url"; // Your configured axios instance
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import {
    DataGrid, // Kept for type reference if needed
    GridColDef,
    // GridToolbar, // Removed - using custom DataGrids component
    // GridRowId, // Removed as not directly used
} from "@mui/x-data-grid";

import DataGrids from "../../utils/Datagrids"; // Your custom DataGrid component
import { toast } from "react-toastify";
import { getISTDate } from "../../utils/Constant"; // Date utility
import ToastApp from "../../ToastApp";

// Helper function to format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export default function AgeWiseSummary() {

    const [zones, setZones] = useState<any[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { i18n, t } = useTranslation();
    const { defaultValuestime } = getISTDate(); // Today's date in YYYY-MM-DD format

    // --- Filter State ---
    const [filterStatus, setFilterStatus] = useState<any[]>([]); // Initialize as empty array
    const [fromDate, setFromDate] = useState<string>("1900-01-01");
    const [toDate, setToDate] = useState<string>(defaultValuestime || formatDate(new Date())); // Default to today
    const [Option, setOption] = useState<any[]>([]); // Initialize as empty array
    // --- New Age Range Filter State ---
    const [ageFromFilter, setAgeFromFilter] = useState<number>(20); // Default From Age
    const [ageToFilter, setAgeToFilter] = useState<number>(50);   // Default To Age

    // Fetch Disease Options on mount
    useEffect(() => {
        getDesis();
    }, []);

    // Fetch list data when filters change
    useEffect(() => {
       
        if (fromDate && toDate && ageFromFilter >= 0 && ageToFilter >= ageFromFilter) {
            getList();
        } else if (ageToFilter < ageFromFilter) {
             
             console.warn("Invalid Age Range: 'Age From' cannot be greater than 'Age To'.");
             
             setZones([]);
             setColumns([]);
        }
    }, [filterStatus, fromDate, toDate, ageFromFilter, ageToFilter, i18n.language]); // Add age filters and language to dependency array

    // Fetch Disease Options for Autocomplete
    const getDesis = async () => {
        setIsLoading(true); // Show loading indicator while fetching options
        try {
            const collectData = {
                "diseaseID": "-1",
                "diseaseTypeID": "-1",
                "specialTypeID": "-1",
                "isActive": "-1",
                "type": 1
            };
            const resp = await api.post(`MasterForm/api/GetDisease`, collectData);
            const data = resp?.data?.result;

            if (data && Array.isArray(data)) {
                const desisOptions = data.map((item: any) => ({
                    label: item?.diseaseName || "Unnamed Disease", // Provide default label
                    value: item?.diseaseID
                }));
                setOption(desisOptions);
            } else {
                setOption([]); // Set empty array if no data or invalid format
                
            }
        } catch (error: any) {
            console.error("Error fetching disease options:", error);
            toast.error(t("Error fetching disease options:") + ` ${error?.message || ''}`);
            setOption([]); // Set empty on error
        } finally {
            // Don't set isLoading to false here if getList is called immediately after in useEffect
            // setIsLoading(false); // Set loading false after options are fetched
        }
    };

   
    const getList = async () => {
        setIsLoading(true);
        setZones([]); // Clear previous data
        setColumns([]); // Clear previous columns

        // Validate age range before API call (redundant with useEffect check, but safe)
        if (ageFromFilter < 0 || ageToFilter < ageFromFilter) {
            toast.warn(t("Invalid age range specified."));
            setIsLoading(false);
            return;
        }

        try {
            const collectData = {
                "ageRange": [ageFromFilter, ageToFilter], // Use state values for age range
                "lstType_rows": filterStatus.length > 0 ? filterStatus : [], // Ensure it's an array
                "ageFrom": ageFromFilter,             // Use state value
                "ageTo": ageToFilter,               // Use state value
                "patientID": "-1",
                "userID": -1,
                "formID": -1,
                "type": 1
            };

           
            const response = await api.post(`Reports/AgeWisePatientDisease`, collectData);

            if (response.data?.isSuccess && response.data.result && Array.isArray(response.data.result)) {
                const data = response.data.result;
                // Ensure unique ID for each row for DataGrid
                const zonesWithIds = data.map((zone: any, index: any) => ({
                    ...zone,
                    id: zone.patientID !== undefined && zone.patientID !== null ? `${zone.patientID}-${index}` : `generated-${index}`, // Create a robust unique ID
                    dob: zone.dob ? zone.dob.split('T')[0] : '-', // Format DOB if present
                }));
                setZones(zonesWithIds);

                // Define Columns (only if data exists)
                if (zonesWithIds.length > 0) {
                    const definedColumns: GridColDef[] = [
                        {
                            field: "patientNo",
                            headerName: t("Patient No."),
                            flex: 0.8,
                            minWidth: 100,
                            headerClassName: "MuiDataGrid-colCell",
                            // align: 'center',
                            // headerAlign: 'center',
                        },
                         {
                            field: "candName",
                            headerName: t("Patient Name"),
                            flex: 1.2,
                            minWidth: 150,
                            headerClassName: "MuiDataGrid-colCell",
                        },
                        {
                            field: "age",
                            headerName: t("Age"),
                            type: 'number', // Important for sorting
                            flex: 0.5,
                            minWidth: 80,
                            headerClassName: "MuiDataGrid-colCell",
                            align: 'center',
                            headerAlign: 'center',
                        },
                        {
                            field: "dob",
                            headerName: t("text.DOB"),
                            flex: 0.8,
                            minWidth: 100,
                            headerClassName: "MuiDataGrid-colCell",
                            // align: 'center',
                            // headerAlign: 'center',
                        },
                        {
                            field: "curMobileNo",
                            headerName: t("text.MobileNumber"),
                            flex: 1,
                            minWidth: 120,
                            headerClassName: "MuiDataGrid-colCell",
                            // align: 'center',
                            // headerAlign: 'center',
                        },
                        
                    ];
                    setColumns(definedColumns);
                } else {
                     toast.info(t("No patient data found for the selected criteria."));
                }
            } else if (response.data?.isSuccess === false) {
                 toast.error(t("Failed to fetch data:") + ` ${response.data.message || 'Unknown error'}`);
            } else {
                toast.info(t("No patient data found for the selected criteria.")); // Handle cases where result might be null or not an array
                setZones([]);
                setColumns([]);
            }

        } catch (error: any) {
            console.error("Error fetching patient list:", error);
            toast.error(t("An error occurred while fetching data:") + ` ${error?.message || ''}`);
            setZones([]); // Clear data on error
            setColumns([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handler for Autocomplete change
    const handleDiseaseChange = (event: any, newValue: any[]) => { // Explicitly type newValue
        const formattedFilters = newValue.map((item: any, index: number) => ({
            rowID: index + 1,
            rowValue: item?.value, // Ensure value exists
        }));
        setFilterStatus(formattedFilters);
    };

     // Handler for age input changes with validation
    const handleAgeChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow empty input temporarily, default to 0 if blurred empty, or parse the number
        const numValue = value === '' ? '' : parseInt(value, 10);

        if (numValue === '' || (!isNaN(numValue) && numValue >= 0 && numValue <= 120)) { // Allow empty or valid numbers (0-120 range)
             setter(numValue === '' ? 0 : numValue); // Store 0 if empty, otherwise the number
        } else if (isNaN(numValue)){
             // Handle non-numeric input if necessary (e.g., show error, revert)
             // For now, just don't update state if invalid character typed
             console.warn("Invalid age input:", value);
        }
         // Max check (optional here, InputProps preferred)
        // else if (numValue > 120) {
        //     setter(120);
        // }
    };


    return (
        <React.Fragment> {/* Use Fragment instead of div */}
            <ToastApp />
            <ConfirmDialog /> {/* Keep PrimeReact ConfirmDialog if used elsewhere */}

            <Card sx={{ width: "100%", M:0, p:0, boxShadow: 3, overflow: 'hidden' }}> {/* Added overflow hidden */}
                <Paper sx={{ padding: "15px 20px" }}> {/* Use padding shorthand */}
                    <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{ fontWeight: 500, mb: 2 }} // Use theme spacing and font weight number
                    >
                        {t("text.AgeWiseDiseaseSummary")} {/* More descriptive title */}
                    </Typography>
                    <Divider sx={{ mb: 2 }} /> {/* Use margin bottom */}

                    {/* --- Filter Controls --- */}
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}> {/* Reduced bottom margin */}

                        {/* From Date Filter */}
                        <Grid item xs={12} sm={6} md={3} lg={2}>
                            <TextField
                                id="from-date-filter"
                                label={t("From Date")}
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        {/* To Date Filter */}
                        <Grid item xs={12} sm={6} md={3} lg={2}>
                            <TextField
                                id="to-date-filter"
                                label={t("To Date")}
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: fromDate }} // Prevent selecting toDate before fromDate
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        {/* --- Age Range Filters --- */}
                        <Grid item xs={6} sm={3} md={2} lg={1.5}>
                           <TextField
                                id="age-from-filter"
                                label={t("Age From")}
                                type="number"
                                value={ageFromFilter === 0 && !document.getElementById('age-from-filter')?.matches(':focus') ? '' : ageFromFilter} // Show empty if 0 and not focused
                                onChange={handleAgeChange(setAgeFromFilter)}
                                onBlur={(e) => { if (e.target.value === '') setAgeFromFilter(0); }} // Set to 0 on blur if empty
                                InputProps={{ inputProps: { min: 0, max: 120, step: 1 } }} // Set min/max/step
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6} sm={3} md={2} lg={1.5}>
                           <TextField
                                id="age-to-filter"
                                label={t("Age To")}
                                type="number"
                                value={ageToFilter === 0 && !document.getElementById('age-to-filter')?.matches(':focus') ? '' : ageToFilter} // Show empty if 0 and not focused
                                onChange={handleAgeChange(setAgeToFilter)}
                                onBlur={(e) => { if (e.target.value === '') setAgeToFilter(0); }} // Set to 0 on blur if empty
                                InputProps={{ inputProps: { min: ageFromFilter, max: 120, step: 1 } }} // Set min based on fromAge
                                fullWidth
                                size="small"
                            />
                        </Grid>

                        {/* Status Filter (Disease) */}
                        <Grid item xs={12} sm={6} md={4} lg={5}>
                            <Autocomplete
                                id="status-filter-select"
                                multiple  // Allow multiple selections
                                options={Option} // Use fetched options
                                getOptionLabel={(option) => option.label || ""} // Ensure label exists
                                isOptionEqualToValue={(option, value) => option.value === value.value} // Compare options correctly
                                value={Option.filter(opt => filterStatus.some(filt => filt.rowValue === opt.value))} // Control the selected value(s)
                                onChange={handleDiseaseChange} // Use refined handler
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t("Select Disease(s)")}
                                        placeholder={t("Select Disease(s)")}
                                        size="small" // Consistent size
                                    />
                                )}
                                fullWidth
                                size="small"
                                ListboxProps={{ style: { maxHeight: 200 } }}
                                // Removed disableCloseOnSelect as multiple is true
                            />
                        </Grid>

                    </Grid>
                    {/* Removed second divider */}

                    {/* --- Data Grid Section --- */}
                    <Box sx={{ height: 600, width: '100%' }}>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                             <DataGrids
                                key={i18n.language} // Add key to force re-render on language change if headers depend on it
                                isLoading={isLoading} // Pass loading state
                                rows={zones}
                                columns={columns.map(col => ({ ...col, headerName: t(col.headerName || '') }))} // Translate headers dynamically if needed
                                pageSizeOptions={[10, 25, 50, 100]} // Standard page size options
                                initialPageSize={10}
                                
                            />
                        )}
                    </Box>
                </Paper>
            </Card>
        </React.Fragment>
    );
}