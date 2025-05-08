import * as React from "react";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import {
    // Autocomplete, // Keep if needed later, removed for now based on current code
    Box,
    Divider,
    TextField,
    Typography,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    CircularProgress,
    TablePagination, // Import TablePagination
    Tabs,           // Import Tabs
    Tab             // Import Tab
} from "@mui/material";

// Assuming primereact ConfirmDialog is needed elsewhere or can be removed if unused here
// import { ConfirmDialog } from "primereact/confirmdialog";

import ToastApp from "../../ToastApp";
import api from "../../utils/Url";
// Assuming getISTDate is only used for default values elsewhere, removed if not needed here
// import { getISTDate } from "../../utils/Constant";

// Define a type for the patient data for better type safety (Optional but recommended)
interface PatientData {
    patientID: string;
    patientNo: string;
    patientCaseID: string;
    patientCaseNo: string;
    patientName: string;
    patientNameML?: string; // Optional fields marked with ?
    dob?: string;
    age?: string;
    genderName?: string;
    civilStatusName?: string;
    bloodGroup?: string;
    curAddress?: string;
    curMobileNo?: string;
    curPhoneNo?: string;
    email?: string;
    barCode?: string;
    priorityName?: string;
    statusName?: string;
    isPaid: boolean;
    isDocSeen: boolean; // This is the key field for filtering
    admNo?: string;
    tokenNo: string; // Assuming tokenNo is always present based on example
    priority?: string;
    insAppStatusID?: string;
    isInsPatient?: boolean;
    insAppStatus?: string;
    admissionDate: string; // Assuming admissionDate is the "Visit Date"
    admissionType?: string;
    isNursingDone?: string; // Could be boolean or number based on "0"/"1"
    nextVisitDate?: string;
    admissionTypeID?: string;
    isIquamaPreEmp?: boolean;
    slno?: string;
    doctorID?: string;
    referalDocID?: string;
    invParameterID?: string;
    referalInvParameterID?: string;
    isReferal?: boolean;
}

// Define type for the filter value
type ViewFilter = 'notSeen' | 'seen';

export default function DoctorPatient() {
    // Removed defaultValuestime if getISTDate is not used here anymore
    // const { defaultValuestime } = getISTDate();

    const [fromDate, setFromDate] = useState<string>(""); // Use string for date input type
    const [toDate, setToDate] = useState<string>("");     // Use string for date input type
    const [isName, setName] = useState<string>("");       // Use string for name input

    // Removed doctor state as it's not used in the current UI/logic
    // const [doctor, setDoctor] = useState<number | string>(-1);
    // const [doctorOptions, setDoctorOptions] = useState<any[]>([]);

    const [patientData, setPatientData] = useState<PatientData[]>([]); // Holds ALL fetched data
    const [loading, setLoading] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState<boolean>(false); // Track if a search has been performed

    // Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // State for the Seen/Not Seen filter tab
    const [viewFilter, setViewFilter] = useState<ViewFilter>('notSeen'); // Default to 'Not Seen'

    // Removed isDoctorListLoaded as doctor list fetch is removed
    // const [isDoctorListLoaded, setIsDoctorListLoaded] = useState<boolean>(false);

    const useRID = JSON.parse(localStorage.getItem('useR_ID') as string || "-2"); // Provide default directly

    // --- Effects ---

    // Fetch Patient Data Function (remains the same, fetches all matching patients)
    const fetchData = async () => {
        if (!fromDate && !toDate && !isName) {
             setPatientData([]);
             setHasSearched(false);
             setLoading(false);
             return;
        }

        console.log("Fetching data with:", { fromDate, toDate, isName });
        setLoading(true);
        setHasSearched(true);
        setPatientData([]); // Clear previous data on new fetch
        setPage(0); // Reset to first page on new fetch

        const collectData = {
            "patientCaseID": -1,
            "patientCaseNo": "",
            "patientID": -1,
            "patientNo": "",
            "caseTypeID": 1,
            "patientName": isName || "",
            "fromDate": fromDate || "",
            "toDate": toDate || "",
            "userID": useRID,
            "formID": 1,
            "type": 1
        };

        try {
            const resp = await api.post(`GetPatientForDoctorOPIP`, collectData);
            const data = resp?.data?.result;

            if (data && Array.isArray(data)) {
                setPatientData(data as PatientData[]);
            } else {
                console.warn("Received non-array or unexpected data:", data);
                setPatientData([]);
            }
        } catch (error) {
            console.error("Error fetching patient data:", error);
            setPatientData([]);
            // Consider showing a toast message here for the error
           
        } finally {
            setLoading(false);
        }
    };

    // Fetch Patient Data when fromDate, toDate, or isName changes
    useEffect(() => {
        if (fromDate || toDate || isName) {
            fetchData();
        } else {
            setPatientData([]);
            setHasSearched(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromDate, toDate, isName]);

    // --- Handlers ---
    const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFromDate(event.target.value);
    };

    const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToDate(event.target.value);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    // Handler for changing the Seen/Not Seen Tab
    const handleViewFilterChange = (event: React.SyntheticEvent, newValue: ViewFilter) => {
        setViewFilter(newValue);
        setPage(0); // Reset pagination to the first page when filter changes
    };

    // Pagination Handlers
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when rows per page changes
    };


    // --- Data Filtering and Pagination ---

    // 1. Filter the raw patientData based on the selected viewFilter tab
    const filteredPatientData = patientData.filter(patient => {
        if (viewFilter === 'seen') {
            return patient.isDocSeen === true;
        } else { // viewFilter === 'notSeen'
            return patient.isDocSeen === false;
        }
    });

    // 2. Calculate rows for the current page *from the filtered data*
    const currentTableData = filteredPatientData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <React.Fragment>
            <ToastApp />
            {/* <ConfirmDialog /> */}

            <Card sx={{ width: "100%", m: 0, p: 0, boxShadow: 3, overflow: "visible" }}>
                <Paper sx={{ padding: "20px", backgroundColor: "#fafafa" }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 500, mb: 2 }}>
                        Patient List
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    {/* --- Filter Controls --- */}
                    <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="From Date"
                                type="date"
                                value={fromDate}
                                onChange={handleFromDateChange}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="To Date"
                                type="date"
                                value={toDate}
                                onChange={handleToDateChange}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}> {/* Make name take full width on small screens */}
                            <TextField
                                fullWidth
                                label="Patient Name"
                                value={isName}
                                onChange={handleNameChange}
                                size="small"
                                placeholder="Search by name..."
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* --- Data Table Area --- */}
                <Paper sx={{ padding: "0px 20px 20px 20px" }}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: 200, py: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : !hasSearched ? (
                         <Typography variant="body1" sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
                             Please select filters to view patient data.
                         </Typography>
                    ) : patientData && patientData.length > 0 ? ( // Check if ANY data was fetched initially
                        <>
                            {/* --- Filter Tabs --- */}
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                                <Tabs value={viewFilter} onChange={handleViewFilterChange} aria-label="patient view filter tabs">
                                    <Tab label={`Not Seen Patients (${patientData.filter(p => !p.isDocSeen).length})`} value="notSeen" />
                                    <Tab label={`Seen Patients (${patientData.filter(p => p.isDocSeen).length})`} value="seen" />
                                </Tabs>
                            </Box>

                            {/* --- Table and Pagination --- */}
                            {filteredPatientData.length > 0 ? ( // Check if there's data *after* filtering
                                <>
                                    <TableContainer component={Paper} elevation={0} variant="outlined">
                                        <Table sx={{ minWidth: 650 }} aria-label="doctor patient status table" size="small">
                                            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Visit Date</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Patient Name</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Patient No.</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Case No</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Token No.</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Doctor Seen</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Paid Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {currentTableData.map((row, index) => ( // Map over currentTableData (filtered and paginated)
                                                    <TableRow
                                                        key={row.patientCaseID || index}
                                                        hover
                                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">{row.admissionDate}</TableCell>
                                                        <TableCell>{row.patientName}</TableCell>
                                                        <TableCell>{row.patientNo}</TableCell>
                                                        <TableCell>{row.patientCaseNo}</TableCell>
                                                        <TableCell>{row.tokenNo}</TableCell>
                                                        <TableCell align="center">{row.isDocSeen ? "Yes" : "No"}</TableCell>
                                                        <TableCell align="center">{row.isPaid ? "Yes" : "No"}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 50, 100]}
                                        component="div"
                                        count={filteredPatientData.length} // Count based on filtered data
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        sx={{mt: 1, mr: 1}}
                                    />
                                </>
                             ) : ( // No data matching the *current tab filter*
                                <Typography variant="body1" sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
                                    No patients found for the '{viewFilter === 'seen' ? 'Seen' : 'Not Seen'}' filter.
                                </Typography>
                            )}
                        </>
                    ) : ( // State after searching but finding no data *at all*
                        <Typography variant="body1" sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
                            No data available for the selected criteria.
                        </Typography>
                    )}
                </Paper>
            </Card>
        </React.Fragment>
    );
}