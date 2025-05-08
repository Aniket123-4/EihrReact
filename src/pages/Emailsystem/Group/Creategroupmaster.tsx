import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  MenuItem,
  TextField,
  Typography,
  TextareaAutosize,
  Table,
  Radio,
  FormControl,
  RadioGroup,
} from "@mui/material";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import HOST_URL from "../../../utils/Url";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import CustomLabel from "../../../CustomLable";
import api2 from "../../../utils/Url";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { getISTDate } from "../../../utils/Constant";
import { url } from "inspector";
import api from "../../../utils/Url";
import Languages from "../../../Languages";
import { Language } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../../TranslateTextField";
type Props = {};
const Creategroupmaster = (props: Props) => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const { defaultValuestime } = getISTDate();
  const [toaster, setToaster] = useState(false);
  const initialRowData = {

    "groupId": 0,
    "name": "",
    "description": "",
    "type": "",
    "isActive": "true",
    createdBy: "",
    updatedBy: "",
    createdOn: defaultValuestime,
    updatedOn: defaultValuestime
  };
  useEffect(() => {
  }, []);
  const [lang, setLang] = useState<Language>("en");
  const location = useLocation();

  const formik = useFormik({
    initialValues: {
      "groupId": 0,
      "name": "",
      "description": "",
      "type": "",
      "isActive": true,
      createdBy: "",
      updatedBy: "",
      createdOn: defaultValuestime,
      updatedOn: defaultValuestime
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .required("Group Name is required")
        .min(2, "Group Name must be at least 2 characters")
        .max(50, "Group Name cannot exceed 50 characters"),
    }),
    onSubmit: async (values) => {
      const response = await api.post(`Comm/UpsertCommGroup`, values);
      if (response.data.status === 1) {
        setToaster(false);
        toast.success(response.data.message);
        navigate("/emailsystem/Groupmaster");
      } else {
        setToaster(true);
        toast.error(response.data.message);
      }
    },
  });
  const back = useNavigate();
  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          border: ".5px solid #FF7722",
          marginTop: "3vh",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.Creategroupmaster")}
          </Typography>
          <Grid container justifyContent="flex-end">
            <Grid item lg={2} md={2} xs={12} marginTop={2}>
              <select
                className="language-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                {Languages.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
          <Grid item sm={4} xs={12}>
            <Typography style={{ marginTop: "-75px" }}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  marginBottom: 15,
                  marginTop: "45px",
                  backgroundColor: `var(--header-background)`,
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Typography>
          </Grid>
          <Divider />
          <br />
          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12} sm={4} lg={4}>
                <TextField
                  label={t("text.name1")}
                  value={formik.values.name}
                  onChange={(e) => formik.setFieldValue("name", e.target.value)}
                  required={true}
                  fullWidth
                  size="small"
                />
                {formik.touched.name && formik.errors.name ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.name}
                  </div>
                ) : null}
              </Grid>

              <Grid item xs={12} sm={6} lg={8}>
                <TextField
                  label={t("text.description1")}
                  value={formik.values.description}
                  onChange={(e) => formik.setFieldValue("description", e.target.value)}
                  required={false}
                  fullWidth
                  size="small"
                />
                {formik.touched.description && formik.errors.description ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.description}
                  </div>
                ) : null}
              </Grid>


              <Grid item lg={3} md={6} xs={12}>
                <FormControlLabel
                  id="isActive"
                  name="isActive"
                  value={formik.values.isActive}
                  control={<Checkbox />} label={t("text.isActive")} />
              </Grid>
              <Grid item lg={8} xs={12}>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    aria-label="type"
                    name="type"
                    value={formik.values.type}
                    onChange={(event) => formik.setFieldValue("type", event.target.value)}
                  >
                    <FormControlLabel
                      value="SMSGroup"
                      control={<Radio color="primary" />}
                      label={t("text.SMSGroup")}
                      sx={{ marginLeft: 6 }}
                    />
                    <FormControlLabel
                      value="EMAILGroup"
                      control={<Radio color="primary" />}
                      label={t("text.EMAILGroup")}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  style={{
                    backgroundColor: `var(--header-background)`,
                    color: "white",
                    marginTop: "10px",
                  }}
                >
                  {t("text.save")}
                </Button>
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={(e: any) => formik.resetForm()}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};
export default Creategroupmaster;