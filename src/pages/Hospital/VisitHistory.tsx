import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import api from "../../utils/Url";
import { useTranslation } from "react-i18next";

const VisitHistory = () => {
  const { t } = useTranslation();

  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [visitInfo, setVisitInfo] = useState<any>(null);

  useEffect(() => {
    fetchPatientList();
  }, []);

  const fetchPatientList = async () => {
    try {
      const res = await api.post("/FnGetPatientSearch", {
        patientNo: "",
        patientName: "",
        userID: -1,
        formID: -1,
        type: 1,
      });
      if (res.data.isSuccess) {
        setPatients(res.data.result);
      }
    } catch (error) {
      console.error("Fetch patient error:", error);
    }
  };

  const handlePatientSelect = async (patient: any) => {
    setSelectedPatient(patient);
    try {
      const headerRes = await api.post("/GetPatientHeader", {
        patientNo: patient.patientNo,
        patientID: -1,
        userID: -2,
        formID: 1,
        type: 1,
      });

      if (headerRes.data.isSuccess) {
        const patientData = headerRes.data.result1?.[0];
        const photoData = headerRes.data.result2?.[0];
        const caseData = headerRes.data.result3?.[0];

        setPatientInfo({
          ...patientData,
          photo: photoData?.photo,
          caseNo: caseData?.patientCaseNo,
          patientCaseID: caseData?.patientCaseID,
        });

        // Get Visit Number
        const visitRes = await api.post("/GetPatientVisitNo", {
          patientCaseID: caseData?.patientCaseID,
          patientCaseNo: 1,
          userID: -1,
          formID: -1,
          type: 1,
        });

        if (visitRes.data.isSuccess) {
          setVisitInfo(visitRes.data.result?.[0]);
        }
      }
    } catch (error) {
      console.error("Fetch header/visit info error:", error);
    }
  };

  return (
    <Box p={3}>
      <Paper elevation={4} sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
        {t("text.SearchPatient")}
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={4}>
            <Autocomplete
              disablePortal
              options={patients}
              getOptionLabel={(option) =>
                `${option.patientName || ""} (${option.patientNo || ""})`
              }
              value={selectedPatient}
              onChange={(e, newValue) => {
                if (newValue) {
                  handlePatientSelect(newValue);
                } else {
                  setSelectedPatient(null);
                  setPatientInfo(null);
                  setVisitInfo(null);
                }
              }}
              isOptionEqualToValue={(option, value) =>
                option.patientNo === value.patientNo
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("text.SearchPatient")}
                  size="small"
                  required // Makes it mandatory
                  error={!selectedPatient}
                //helperText={!selectedPatient ? "Patient is required" : ""}
                />
              )}
            />


          </Grid>
          <Grid item xs={12} sm={2.5}>
            <TextField
            label={t("text.PatientNo")} 
              value={selectedPatient?.patientNo || ""}
              fullWidth
              disabled
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={2.5}>
            <TextField
             label={t("text.CaseNo")}
              value={patientInfo?.caseNo || ""}
              fullWidth
              disabled
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={2.5}>
            <TextField
             label={t("text.AdmissionNo")}
              value={visitInfo?.admNo || ""}
              fullWidth
              disabled
              size="small"
            />
          </Grid>
        </Grid>

        {patientInfo && (
          <Grid container spacing={2} mt={3}>
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Info label={t("text.Name")} value={patientInfo.candName} />
                <Info label={t("text.DOB")} value={patientInfo.dob} />
                <Info label={t("text.Gender")} value={patientInfo.genderName} />
                <Info label={t("text.Mobile")} value={patientInfo.curMobileNo} />
                <Info label={t("text.Phone")} value={patientInfo.curPhoneNo} />
                <Info label={t("text.Email")} value={patientInfo.email} />
                <Info label={t("text.Address")} value={patientInfo.curAddress} />
                <Info label={t("text.MaritalStatus")} value={patientInfo.civilStatusName} />
              </Grid>
            </Grid>
            <Grid item xs={12} md={3} display="flex" justifyContent="center" alignItems="center">
              <Box
                component="img"
                src={`data:image/jpeg;base64,${patientInfo.photo}`}
                alt="Patient"
                sx={{
                  width: 150,
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "2px solid #ccc",
                }}
              />
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

const Info = ({ label, value }: { label: string; value: any }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography fontWeight={500}>{value || "-"}</Typography>
  </Grid>
);

export default VisitHistory;
