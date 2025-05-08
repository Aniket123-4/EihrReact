import * as React from "react";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import {
    Autocomplete,
    Box,
    // Button, // No longer needed
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
} from "@mui/material";

// Assuming primereact ConfirmDialog is needed elsewhere or can be removed if unused here
// import { ConfirmDialog } from "primereact/confirmdialog";

import ToastApp from "../../ToastApp";
import api from "../../utils/Url";
import { getISTDate } from "../../utils/Constant"; // Assuming this returns { defaultDate, defaultValuestime }

// Define a type for the doctor options for better type safety
interface DoctorOption {
    label: string;
    value: number | string; // Allow number for IDs, string maybe for special cases if needed
}

// Define a type for the patient data rows
interface PatientDataRow {
    userID: number;
    userName: string;
    patientAdmitted: number;
    seenByDoc: number;
    patientCheckedOut: number;
    patientNotSeen: number;
}



export default function DrPatientStatus() {
    const { defaultValuestime } = getISTDate(); // Get today's date parts

  
    const [fromDate, setFromDate] = useState<string>( ""); 
    const [doctor, setDoctor] = useState<number | string>(-1); // Default to "All Doctors" value
    const [doctorOptions, setDoctorOptions] = useState<DoctorOption[]>([]);
    const [patientData, setPatientData] = useState<PatientDataRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isDoctorListLoaded, setIsDoctorListLoaded] = useState<boolean>(false); // Flag to track if doctor list is loaded

    // --- Effects ---

    // Fetch Doctor List on Mount
    useEffect(() => {
        const getDr = async () => {
            // Set loading state for doctor list if needed, though not strictly necessary here
            try {
                const resp = await api.get(`Login/GetUserList?CommonID=-1&Type=3`);
                const data = resp?.data?.data;
                const fetchedOptions: DoctorOption[] = data?.map((item: any) => ({
                    label: item?.userName || "Unknown Doctor",
                    value: item?.userID,
                })) || [];

                // Add "All Doctors" option at the beginning
                setDoctorOptions([
                    { label: "All Doctors", value: -1 },
                    ...fetchedOptions,
                ]);
            } catch (error) {
                console.error("Error fetching doctors:", error);
                // Set minimal options even on error
                setDoctorOptions([{ label: "All Doctors", value: -1 }]);
                // Handle error (e.g., show toast)
            } finally {
                 setIsDoctorListLoaded(true); // Mark doctor list as loaded (or attempted)
            }
        };

        getDr();
    }, []); // Empty dependency array: runs only once on mount

    const fetchData = async () => {
      
        if (!fromDate) return; // Basic check

        setLoading(true);
        setPatientData([]); // Clear previous data on new fetch

        const collectData = {
            fromDate: fromDate,
            doctorID: doctor, // Send the selected doctor ID (-1 for all)
            toDate: defaultValuestime || "", // Use current time from util
            userID: -1,
            formID: -1,
            type: 5,
        };

        try {
            console.log("Fetching data with payload:", collectData);
            const resp = await api.post(`Reports/GetDoctorWiseAna`, collectData);
            const data = resp?.data?.result;

            if (data && Array.isArray(data)) {
                setPatientData(data);
            } else {
                console.warn("Received non-array or null data:", data);
                setPatientData([]);
            }
        } catch (error) {
            console.error("Error fetching patient data:", error);
            setPatientData([]);
            // Handle error (e.g., show toast)
        } finally {
            setLoading(false);
        }
    };

  
    // useEffect(() => {
        
    //      if (isDoctorListLoaded) {
    //          fetchData();
    //      }
    // }, [fromDate, doctor, isDoctorListLoaded]); 
    // Dependencies: trigger fetch on change


    // --- Handlers ---
    const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFromDate(event.target.value);
    };

    const handleDoctorChange = (event: React.SyntheticEvent, newValue: DoctorOption | null) => {
        setDoctor(newValue ? newValue.value : -1);
    };

    const selectedDoctorObject = doctorOptions.find(opt => opt.value === doctor) || null;

    return (
        <React.Fragment>
            <ToastApp />
            {/* <ConfirmDialog /> */}

            <Card sx={{ width: "100%", m: 0, p: 0, boxShadow: 3, overflow: "hidden" }}>
                <Paper sx={{ padding: "20px" }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 500, mb: 2 }}>
                        Doctor Patient Status
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    {/* --- Filter Controls --- */}
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
    <Grid item xs={12} sm={6} md={4} lg={3}>
        <TextField
            fullWidth
            label="From Date"
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            InputLabelProps={{
                shrink: true,
            }}
            size="small"
        />
    </Grid>

    <Grid item xs={12} sm={6} md={4} lg={3}>
        <Autocomplete
            id="doctor-filter-select"
            options={doctorOptions}
            value={selectedDoctorObject}
            onChange={handleDoctorChange}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value?.value}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Doctor"
                    placeholder="Select Doctor"
                    size="small"
                />
            )}
            fullWidth
            size="small"
            ListboxProps={{ style: { maxHeight: 250 } }}
        />
    </Grid>

    <Grid item xs={12} sm={12} md={4} lg={3}>
        <Box display="flex" justifyContent="flex-start" alignItems="center" height="100%">
            <button
                onClick={fetchData}
                style={{
                    padding: "8px 20px",
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}
            >
                Search
            </button>
        </Box>
    </Grid>
</Grid>


                    {/* --- Data Table --- */}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            {loading ? ( 
                                <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                                    <CircularProgress />
                                </Box>
                            ) : patientData && patientData.length > 0 ? (
                                <TableContainer component={Paper} elevation={1} variant="outlined">
                                    <Table sx={{ minWidth: 650 }} aria-label="doctor patient status table" size="small">
                                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Doctor Name</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Patient Admitted</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Seen By Doctor</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Patient Checked Out</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Patient Not Seen</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {patientData.map((row) => (
                                                <TableRow
                                                    key={row.userID}
                                                    hover
                                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.userName}
                                                    </TableCell>
                                                    <TableCell align="right">{row.patientAdmitted}</TableCell>
                                                    <TableCell align="right">{row.seenByDoc}</TableCell>
                                                    <TableCell align="right">{row.patientCheckedOut}</TableCell>
                                                    <TableCell align="right">{row.patientNotSeen}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                              
                                !loading && isDoctorListLoaded &&
                                <Typography variant="body1" sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
                                    No data available for the selected criteria.
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </Card>
        </React.Fragment>
    );
}