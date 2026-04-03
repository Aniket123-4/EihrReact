import * as React from "react";
import { useEffect, useState } from "react";
import {
    Box,
    Grid,
    IconButton,
    SwipeableDrawer,
    Typography,
    CircularProgress,
    Divider,
    Button,
    TextField,
    Autocomplete,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { toast } from "react-toastify";

// Utils & Icons
import api from "../../utils/Url";
import { getISTDate } from "../../utils/Constant";
import DataGrids from "../../utils/Datagrids";
import ToastApp from "../../ToastApp";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface Props {
    open: boolean;
    onClose: () => void;
    PateintNo: string | number; // Required prop for filtering
}

const statusOptions = [
    { label: "Check-Out", value: 1 },
    { label: "Check-In", value: 2 },
];

export default function PatientCheckInOutDrawer({ open, onClose, PateintNo }: Props) {
    const theme = useTheme();
    const { t } = useTranslation();
    const { defaultValuestime } = getISTDate();

    const [zones, setZones] = useState<any[]>([]);
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [filterStatus, setFilterStatus] = useState<number | null>(2); 
    const [fromDate, setFromDate] = useState<string>("1900-01-01");
    const [toDate, setToDate] = useState<string>(defaultValuestime || new Date().toISOString().split('T')[0]);

    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
    const [checkoutModalData, setCheckoutModalData] = useState<any[]>([]);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);
    const [currentRowParams, setCurrentRowParams] = useState<any>({});

    // --- Core Logic: Fetch and Strict Frontend Filter ---
    const getList = async () => {
        if (!open || !PateintNo) return; // Don't fetch if no Patient Number provided
        
        setIsLoading(true);
        try {
            const collectData = {
                searchBy: "-1",// Send to API
                fromDate: fromDate,
                toDate: toDate,
                type: 2,
                mainType: filterStatus ?? -1,
                userID: -1,
                formID: -1,
            };
            
            const response = await api.post(`GetCheckOutPatient`, collectData);

            if (response.data?.isSuccess && response.data.result) {
                const rawData = response.data.result;

                // --- STRICT FRONTEND FILTERING ---
                // We ensure that only the row matching PateintNo is kept
                const filteredData = rawData.filter((item: any) => 
                    item.patientNo?.toString().trim() === PateintNo.toString().trim()
                );

                const mappedData = filteredData.map((item: any, index: number) => ({
                    ...item,
                    id: item.patientCaseID || `row-${index}`,
                    serialNo: index + 1,
                }));

                setZones(mappedData);
                defineColumns();
            } else {
                setZones([]);
            }
        } catch (error) {
            console.error(error);
            setZones([]);
        } finally {
            setIsLoading(false);
        }
    };

    const defineColumns = () => {
        const cols: GridColDef[] = [
            { field: "patientNo", headerName: t("Patient No."), flex: 0.8 },
            { field: "patName", headerName: t("Patient Name"), flex: 1.2 },
            { field: "consultantDocName", headerName: t("Doctor"), flex: 1 },
            { field: "patientCaseNo", headerName: t("Case No"), flex: 0.8 },
            { field: "statusName", headerName: t("Status"), flex: 0.7 },
            {
                field: "Action",
                headerName: t("Action"),
                flex: 1,
                sortable: false,
                renderCell: (params: any) => {
                    const isCheckIn = params.row.statusName === "CHECK-IN";
                    return (
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ backgroundColor: isCheckIn ? "#f44336" : "#4caf50", color: "#fff" }}
                            onClick={() => handleStatusChange(params.row)}
                        >
                            {isCheckIn ? t("Check Out") : t("Check In")}
                        </Button>
                    );
                },
            }
        ];
        setColumns(cols);
    };

    const handleStatusChange = async (rowData: any) => {
        const { statusName, patientCaseID } = rowData;
        setCurrentRowParams(rowData);

        if (statusName === "CHECK-IN") {
            setIsCheckoutLoading(true);
            try {
                const response = await api.post("GetPatientCheckOutInfo", {
                    patientCaseID, admNo: -1, userID: -1, formID: -1, type: 1
                });
                if (response.data?.isSuccess) {
                    setCheckoutModalData(response.data.result);
                    setIsCheckoutModalOpen(true);
                }
            } finally {
                setIsCheckoutLoading(false);
            }
        } else {
            confirmDialog({
                message: t("Are you sure you want to check this patient back in?"),
                header: t("Confirmation"),
                accept: () => handleProceedCheckIn(patientCaseID),
            });
        }
    };

    const handleProceedCheckout = async () => {
        setIsCheckoutLoading(true);
        try {
            const response = await api.post(`UpdateCaseCheckOut`, {
                patientCaseID: currentRowParams.patientCaseID, userID: -1, formID: -1, type: 1
            });
            if (response?.data?.isSuccess) {
                toast.success(t("Success"));
                setIsCheckoutModalOpen(false);
                getList(); // Refresh list
            }
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    const handleProceedCheckIn = async (id: any) => {
        const response = await api.post(`UpdatePatientStatus`, {
            patientCaseID: id, userID: -1, formID: -1, type: 1
        });
        if (response?.data?.isSuccess) {
            toast.success(t("Success"));
            getList();
        }
    };

    useEffect(() => {
        if (open) getList();
    }, [open, filterStatus, fromDate, toDate, PateintNo]);

    return (
        <SwipeableDrawer
            anchor="right"
            open={open}
            onClose={onClose}
            onOpen={() => {}}
            PaperProps={{ sx: { width: { xs: '100%', md: '80%' }, p: 3 } }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">{t("Patient History for")}: {PateintNo}</Typography>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <TextField label={t("From")} type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField label={t("To")} type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Autocomplete
                        options={statusOptions}
                        size="small"
                        getOptionLabel={(opt) => t(opt.label)}
                        value={statusOptions.find(o => o.value === filterStatus) || null}
                        onChange={(_, val) => setFilterStatus(val ? val.value : -1)}
                        renderInput={(params) => <TextField {...params} label={t("Status")} />}
                    />
                </Grid>
            </Grid>

            <Box sx={{ height: '65vh', width: '100%' }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
                ) : (
                    <DataGrids
                    isLoading={isLoading}
                        rows={zones}
                        columns={columns}
                        pageSizeOptions={[5, 10]}
                        initialPageSize={5}
                    />
                )}
            </Box>

            {/* Checklist Dialog */}
            <Dialog open={isCheckoutModalOpen} onClose={() => setIsCheckoutModalOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{t("Readiness Checklist")}</DialogTitle>
                <DialogContent dividers>
                    <List dense>
                        {checkoutModalData.map((item, idx) => (
                            <ListItem key={idx}>
                                <ListItemIcon>
                                    {item.isPresent === false ? <HighlightOffIcon color="disabled" /> : 
                                     item.isOk ? <CheckCircleOutlineIcon color="success" /> : <HighlightOffIcon color="error" />}
                                </ListItemIcon>
                                <ListItemText primary={item.activityName} secondary={item.activityStatus} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCheckoutModalOpen(false)}>{t("Close")}</Button>
                    <Button variant="contained" color="success" onClick={handleProceedCheckout} disabled={isCheckoutLoading}>
                        {t("Proceed Checkout")}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog />
            <ToastApp />
        </SwipeableDrawer>
    );
}
