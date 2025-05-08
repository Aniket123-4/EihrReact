import {
  Button,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
  Autocomplete,
  Modal,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  InputAdornment,
  FormControl,
  FormLabel,
  Checkbox,
  ListItemText,
  Popover,
} from "@mui/material";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../utils/Url";
import { toast } from "react-toastify";
import ToastApp from "../../ToastApp";
import { ColorLens as ColorLensIcon } from "@mui/icons-material";
import { SketchPicker } from "react-color";
import CustomLabel from "../../CustomLable";
import nopdf from "../../assets/images/imagepreview.jpg";
import { getId, getdivisionId, getinstId } from "../../utils/Constant";
import Languages from "../../Languages";
import { Language, ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import TranslateTextField from "../../TranslateTextField";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "180vh",
  height: "85vh",
  bgcolor: "#f5f5f5",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};

const Options = [
  { label: "Yes", value: "1" },
  { label: "No", value: "2" },
];

const MenuOptions = [
  { label: "Amimation", value: "1" },
  { label: "Normal", value: "2" },
];

type Props = {};

const InstituteAdd = (props: Props) => {
  const { t } = useTranslation();
  const userid = getId();
  const divid = getdivisionId();
  const instid = getinstId();

  const [panOpens, setPanOpen] = React.useState(false);
  const [Opens, setOpen] = React.useState(false);
  const [OpenImg, setOpenImg] = React.useState(false);
  const [OpenFooter, setOpenFooter] = React.useState(false);
  const [OpenHeader, setOpenHeader] = React.useState(false);
  const [modalImg, setModalImg] = useState("");
  const [Img, setImg] = useState("");
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
  const [colorPickerOver, setColorPickerOver] = useState(null);
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    getCountry();
    // getState();
    // getCity();
    getStRoles();
    getEmpRoles();
    getParentInst();
  }, []);

  const open = Boolean(colorPickerAnchor);
  const open1 = Boolean(colorPickerOver);
  const id = open ? "color-popover" : undefined;
  const id1 = open1 ? "color-popover" : undefined;

  const [CountryOps, setCountryOps] = useState<any>([
    { value: "-1", label: t("text.SelectCountry") },
  ]);

  const [StateOps, setStateOps] = useState<any>([
    { value: "-1", label: t("text.SelectState") },
  ]);

  const [CityOps, setCityOps] = useState<any>([
    { value: "-1", label: t("text.SelectCity") },
  ]);

  const [StRole, setStRole] = useState<any>([
    { value: "-1", label: t("text.SelectStudentRoles") },
  ]);

  const [EmpRole, setEmpRole] = useState<any>([
    { value: "-1", label: t("text.SelectEmployeeRoles") },
  ]);

  const [ParentInst, setParentInst] = useState<any>([
    { value: "-1", label: t("text.SelectParentInstitute") },
  ]);

  const handleIconClick = (event: any) => {
    setColorPickerAnchor(event.currentTarget);
  };

  const handleIconClick1 = (event: any) => {
    setColorPickerOver(event.currentTarget);
  };

  const handleColorChange = (color: any) => {
    formik.setFieldValue("mBackColor", color.hex);
  };

  const handleColorChange1 = (color: any) => {
    formik.setFieldValue("mOverColor", color.hex);
  };

  const handlePopoverClose = () => {
    setColorPickerAnchor(null);
  };

  const handlePopoverClose1 = () => {
    setColorPickerOver(null);
  };

  const handlePanClose = () => {
    setPanOpen(false);
  };

  const modalOpenHandle = (event: any) => {
    setPanOpen(true);
    if (event === "instLogo") {
      setModalImg(formik.values.instLogo);
    }
  };

  const handlePanClose1 = () => {
    setOpen(false);
  };

  const modalOpenHandle1 = (event: any) => {
    setOpen(true);
    if (event === "instImage") {
      setImg(formik.values.instImage);
    }
  };

  const handlePanClose2 = () => {
    setOpenImg(false);
  };

  const modalOpenHandle2 = (event: any) => {
    setOpenImg(true);
    if (event === "reportheaderimg") {
      setImg(formik.values.reportheaderimg);
    }
  };

  const handlePanClose3 = () => {
    setOpenFooter(false);
  };

  const modalOpenHandle3 = (event: any) => {
    setOpenFooter(true);
    if (event === "reportfooterimg") {
      setImg(formik.values.reportfooterimg);
    }
  };

  const handlePanClose4 = () => {
    setOpenHeader(false);
  };

  const modalOpenHandle4 = (event: any) => {
    setOpenHeader(true);
    if (event === "reportHeader") {
      setImg(formik.values.reportHeader);
    }
  };

  const ConvertBase64 = (file: Blob) => {
    console.log(file);
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const otherDocChangeHandler = async (event: any, params: any) => {
    console.log("check");

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileNameParts = file.name.split(".");
      const fileExtension = fileNameParts[fileNameParts.length - 1];
      if (!fileExtension.toLowerCase().match(/(jpg|jpeg)$/)) {
        alert("Only image files (jpg, jpeg) are allowed to be uploaded.");
        event.target.value = null;
        return;
      }

      const base64 = await ConvertBase64(file);
      formik.setFieldValue(params, base64);
      console.log(base64);
    }
  };

  const getCountry = () => {
    const collectData = {
      countryId: -1,
    };
    api.post(`Country/GetCountryMaster`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.countryName,
        value: item.countryId,
      }));
      setCountryOps(arr);
    });
  };

  const getState = (countryID:any) => {
    const collectData = {
      stateId: -1,
      countryId:countryID,
    };
    api.post(`State/GetStateMaster`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.stateName,
        value: item.stateId,
      }));
      setStateOps(arr);
    });
  };

  const getCity = (stateID:any) => {
    const collectData = {
      cityId: -1,
      stateId:stateID,
    };
    api.post(`M10_District/GetDistrictMaster`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.cityName,
        value: item.cityId,
      }));
      setCityOps(arr);
    });
  };

  const getStRoles = () => {
    const collectData = {
      roleId: "-1",
    };
    api.post(`Auth/GetRoleMaster`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.roleName,
        value: item.roleId,
      }));
      setStRole(arr);
    });
  };

  const getEmpRoles = () => {
    const collectData = {
      roleId: "-1",
    };
    api.post(`Auth/GetRoleMaster`, collectData).then((res) => {
      const arr = res.data.data.map((item: any) => ({
        label: item.roleName,
        value: item.roleId,
      }));
      setEmpRole(arr);
    });
  };

  const getParentInst = () => {
    const collectData = {
      id: -1,
    };
    api
      .post(`Institute_Master/GetInstitute_Master`, collectData)
      .then((res) => {
        const arr = res.data.data.map((item: any) => ({
          label: item.insname,
          value: item.id,
        }));
        setParentInst(arr);
      });
  };

  let navigate = useNavigate();

  const validationSchema = Yup.object({
    esYear: Yup.string().matches(/^[0-9]+$/, t("text.EnterNoOnly")),

    phone: Yup.string()
      .test("required", t("text.reqMobNo"), function (value: any) {
        return value && value.trim() !== "";
      })
      .matches(/^[0-9]+$/, t("text.EnterNoOnly"))
      .min(10, t("text.reqMinTenDigits")),

    noOfTeachers: Yup.string().matches(/^[0-9]+$/, t("text.EnterNoOnly")),

    session_year: Yup.string()
      .test("required", t("text.reqSessionYear"), function (value: any) {
        return value && value.trim() !== "";
      })
      .matches(/^[0-9]+$/, t("text.EnterNoOnly")),

    reAttenDuration: Yup.string().matches(/^[0-9]+$/, t("text.EnterNoOnly")),

    pincode: Yup.string().matches(/^[0-9]+$/, t("text.EnterNoOnly")),

    email: Yup.string().matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Enter a valid email address"
    ),
  });

  const [toaster, setToaster] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: -1,
      insname: "",
      shortName: "",
      country: "",
      state: "",
      city: "",
      district: "",
      esYear: 0,
      collegeCategory: "",
      principal: "",
      collegeStatus: "",
      resiAddress: "",
      phone: "",
      officeNo: "",
      resiNo: "",
      pincode: "",
      email: "",
      fax: "",
      website: "",
      districtArea: "",
      statusPG: "",
      facultiesName: "",
      noOfTeachers: 0,
      datefrom: "",
      grade: "",
      yearfrom: 0,
      fb: "",
      user_id: userid,
      inst_ID: 0,
      session_year: "",
      date_R: "",
      rememberInst: true,
      inst_type: "",
      registrar: "",
      address: "",
      reAttenDuration: 0,
      parent_inst: 0,
      enableAutoStuCredentials: "",
      defaultStuRoles: "",
      enableAutoEmpCredentials: "",
      defaultEmpRoles: "",
      enableBiometric: "",
      enableDualBiometric: "",
      menuType: "",
      mBackColor: "",
      mOverColor: "",
      repoHeader: "",
      projNm: "",
      shoAcadSess: "",
      shoFincYr: "",
      editAcadSess: "",
      editFincYr: "",
      jurisdictionDefault: "",
      instLogobyte: "",
      instImagebyte: "",
      reportheaderimgbyte: "",
      reportfooterimgbyte: "",
      reportHeaderbyte: "",
      instLogo: "",
      instImage: "",
      reportheaderimg: "",
      reportfooterimg: "",
      reportHeader: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post(
        `Institute_Master/AddUpdateInstitute_Master`,
        values
      );
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate("/Organisation/Organisation");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = [
    "esYear,phone,noOfTeachers,session_year,reAttenDuration,pincode,email",
  ];

  const handleConversionChange = (params: any, text: string) => {
    formik.setFieldValue(params, text);
  };

  const back = useNavigate();

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          marginTop: "5px",
          border: ".5px solid #2B4593",
        }}
      >
        <CardContent>
          <Grid item xs={12} container spacing={2}>
            <Grid item lg={2} md={2} xs={2} marginTop={2}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  backgroundColor: `var(--grid-headerBackground)`,
                  color: `var(--grid-headerColor)`,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Grid>
            <Grid
              item
              lg={7}
              md={7}
              xs={7}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ padding: "20px" }}
                align="center"
              >
                {t("text.CreateInstitute")}
              </Typography>
            </Grid>

            <Grid item lg={3} md={3} xs={3} marginTop={3}>
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

          <Divider />
          <br />
          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={2}>
              <Grid
                item
                md={12}
                style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
              >
                <FormControl
                  component="fieldset"
                  style={{
                    padding: "1%",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    flex: "1",
                  }}
                >
                  <FormLabel component="legend">
                    {<CustomLabel text={t("text.ShowAcademicSession")} />}
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-label="academicSession"
                    name="shoAcadSess"
                    id="shoAcadSess"
                    defaultValue="N"
                    // value={formik.values.shoAcadSess}
                    onChange={(e: any) => {
                      console.log(
                        "🚀 ~ InstituteAdd ~ e.target.value:",
                        e.target.value
                      );
                      formik.setFieldValue("shoAcadSess", e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="Y"
                      control={<Radio />}
                      label={t("text.Yes")}
                    />
                    <FormControlLabel
                      value="N"
                      control={<Radio />}
                      label={t("text.No")}
                    />
                  </RadioGroup>
                </FormControl>

                <FormControl
                  component="fieldset"
                  style={{
                    padding: "1%",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    flex: "1",
                  }}
                >
                  <FormLabel component="legend">
                    {<CustomLabel text={t("text.ShowFinancialYear")} />}
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-label="shoFincYr"
                    name="shoFincYr"
                    id="shoFincYr"
                    // value={formik.values.shoFincYr}
                    defaultValue="N"
                    onChange={(e: any) => {
                      console.log(
                        "🚀 ~ shoFincYr ~ e.target.value:",
                        e.target.value
                      );
                      formik.setFieldValue("shoFincYr", e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="Y"
                      control={<Radio />}
                      label={t("text.Yes")}
                    />
                    <FormControlLabel
                      value="N"
                      control={<Radio />}
                      label={t("text.No")}
                    />
                  </RadioGroup>
                </FormControl>

                <FormControl
                  component="fieldset"
                  style={{
                    padding: "1%",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    flex: "1",
                  }}
                >
                  <FormLabel component="legend">
                    {<CustomLabel text={t("text.EditAcademicSession")} />}
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-label="editAcadSess"
                    name="editAcadSess"
                    id="editAcadSess"
                    // value={formik.values.editAcadSess}
                    defaultValue="N"
                    onChange={(e: any) => {
                      console.log(
                        "🚀 ~ editAcadSess ~ e.target.value:",
                        e.target.value
                      );
                      formik.setFieldValue("editAcadSess", e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="Y"
                      control={<Radio />}
                      label={t("text.Yes")}
                    />
                    <FormControlLabel
                      value="N"
                      control={<Radio />}
                      label={t("text.No")}
                    />
                  </RadioGroup>
                </FormControl>

                <FormControl
                  component="fieldset"
                  style={{
                    padding: "1%",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    flex: "1",
                  }}
                >
                  <FormLabel component="legend">
                    {<CustomLabel text={t("text.EditableFinancialYear")} />}
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-label="editFincYr"
                    name="editFincYr"
                    id="editFincYr"
                    // value={formik.values.editFincYr}
                    defaultValue="N"
                    onChange={(e: any) => {
                      console.log(
                        "🚀 ~ editFincYr ~ e.target.value:",
                        e.target.value
                      );
                      formik.setFieldValue("editFincYr", e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="Y"
                      control={<Radio />}
                      label={t("text.Yes")}
                    />
                    <FormControlLabel
                      value="N"
                      control={<Radio />}
                      label={t("text.No")}
                    />
                  </RadioGroup>
                </FormControl>

                <FormControl
                  component="fieldset"
                  style={{
                    padding: "1%",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    flex: "1",
                  }}
                >
                  <FormLabel component="legend">
                    {<CustomLabel text={t("text.DefaultJurisdiction")} />}
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-label="jurisdictionDefault"
                    name="jurisdictionDefault"
                    id="jurisdictionDefault"
                    // value={formik.values.jurisdictionDefault}
                    defaultValue="N"
                    onChange={(e: any) => {
                      console.log(
                        "🚀 ~ jurisdictionDefault ~ e.target.value:",
                        e.target.value
                      );
                      formik.setFieldValue(
                        "jurisdictionDefault",
                        e.target.value
                      );
                    }}
                  >
                    <FormControlLabel
                      value="Y"
                      control={<Radio />}
                      label={t("text.Yes")}
                    />
                    <FormControlLabel
                      value="N"
                      control={<Radio />}
                      label={t("text.No")}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item md={12}>
                <FormControl
                  component="fieldset"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 20,
                    // marginTop: "13px",
                    // marginLeft: "12px",
                  }}
                >
                  <Grid>
                    <FormLabel component="legend">
                      {<CustomLabel text={t("text.OrgType")} />}
                    </FormLabel>
                  </Grid>
                  <Grid>
                    <RadioGroup
                      row
                      aria-label="inst_type"
                      name="inst_type"
                      id="inst_type"
                      // value={formik.values.inst_type}
                      defaultValue="S"
                      onChange={(e: any) => {
                        console.log(
                          "🚀 ~ inst_type ~ e.target.value:",
                          e.target.value
                        );
                        formik.setFieldValue("inst_type", e.target.value);
                      }}
                    >
                      <FormControlLabel
                        value="S"
                        control={<Radio />}
                        label={t("text.School")}
                      />
                      <FormControlLabel
                        value="C"
                        control={<Radio />}
                        label={t("text.College")}
                      />
                      <FormControlLabel
                        value="U"
                        control={<Radio />}
                        label={t("text.University")}
                      />
                      <FormControlLabel
                        value="I"
                        control={<Radio />}
                        label={t("text.Institute")}
                      />
                    </RadioGroup>
                  </Grid>
                </FormControl>
              </Grid>

              <Grid md={4} item>
                <TranslateTextField
                  label={t("text.InstituteName")}
                  value={formik.values.insname}
                  onChangeText={(text: string) =>
                    handleConversionChange("insname", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Grid md={4} item>
                <TranslateTextField
                  label={t("text.ShortName")}
                  value={formik.values.shortName}
                  onChangeText={(text: string) =>
                    handleConversionChange("shortName", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={CountryOps}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("country", newValue?.value + "");


                    getState(newValue?.value)

                    formik.setFieldTouched("country", true);
                    formik.setFieldTouched("country", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectCountry")} />}
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={StateOps}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("state", newValue?.value + "");

                    getCity(newValue?.value)

                    formik.setFieldTouched("state", true);
                    formik.setFieldTouched("state", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectState")} />}
                    />
                  )}
                />
              </Grid>

              <Grid item lg={4} xs={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={CityOps}
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("city", newValue?.value + "");

                    formik.setFieldTouched("city", true);
                    formik.setFieldTouched("city", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.SelectCity")} />}
                    />
                  )}
                />
              </Grid>

              <Grid md={4} item>
                <TranslateTextField
                  label={t("text.Address")}
                  value={formik.values.address}
                  onChangeText={(text: string) =>
                    handleConversionChange("address", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              {/* <Grid md={4} item>
                <TranslateTextField
                  label={t("text.District")}
                  value={formik.values.district}
                  onChangeText={(text: string) =>
                    handleConversionChange("district", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid> */}

              <Grid md={4} item>
                <TextField
                  id="esYear"
                  name="esYear"
                  label={
                    <CustomLabel
                      text={t("text.YearOfEstablishment")}
                      required={requiredFields.includes("esYear")}
                    />
                  }
                  value={formik.values.esYear}
                  placeholder={t("text.YearOfEstablishment")}
                  size="small"
                  fullWidth
                  type="number"
                  inputProps={{ min: "0", step: "1" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid md={4} item>
                <TranslateTextField
                  label={t("text.Category")}
                  value={formik.values.collegeCategory}
                  onChangeText={(text: string) =>
                    handleConversionChange("collegeCategory", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>
              <Grid md={4} item>
                <TranslateTextField
                  label={t("text.Principal")}
                  value={formik.values.principal}
                  onChangeText={(text: string) =>
                    handleConversionChange("principal", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>
              <Grid md={4} item>
                <TranslateTextField
                  label={t("text.collegeStatus")}
                  value={formik.values.collegeStatus}
                  onChangeText={(text: string) =>
                    handleConversionChange("collegeStatus", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>
              <Grid md={4} item>
                <TranslateTextField
                  label={t("text.ResidencialAddress")}
                  value={formik.values.resiAddress}
                  onChangeText={(text: string) =>
                    handleConversionChange("resiAddress", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Grid md={4} item>
                <TextField
                  id="phone"
                  name="phone"
                  label={
                    <CustomLabel
                      text={t("text.MobNo")}
                      required={requiredFields.includes("phone")}
                    />
                  }
                  value={formik.values.phone}
                  placeholder={t("text.MobNo")}
                  type="number"
                  inputProps={{ min: "0", step: "1" }}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.phone && formik.errors.phone
                        ? "red"
                        : "initial",
                  }}
                  //onChange={formik.handleChange}
                  onChange={(e) => {
                    let phone_number = e.target.value;
                    console.log("phone", String(phone_number));
                    formik.setFieldValue("phone", String(phone_number));
                  }}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phone && formik.errors.phone ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.phone}
                  </div>
                ) : null}
              </Grid>

              <Grid md={4} item>
                <TranslateTextField
                  label={t("text.OficeNO")}
                  value={formik.values.officeNo}
                  onChangeText={(text: string) =>
                    handleConversionChange("officeNo", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              

              <Grid md={4} item>
                <TranslateTextField
                  label={t("text.ResiNO")}
                  value={formik.values.resiNo}
                  onChangeText={(text: string) =>
                    handleConversionChange("resiNo", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Grid md={4} item>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.PinCode")}
                      required={requiredFields.includes("pincode")}
                    />
                  }
                  value={formik.values.pincode}
                  placeholder={t("text.PinCode")}
                  size="small"
                  type="number"
                  inputProps={{ min: "0", step: "1" }}
                  fullWidth
                  name="pincode"
                  id="pincode"
                  style={{ backgroundColor: "white" }}
                  // onChange={formik.handleChange}
                  onChange={(e) => {
                    let pincode = e.target.value;
                    console.log("pincode", String(pincode));
                    formik.setFieldValue("pincode", String(pincode));
                  }}
                  onBlur={formik.handleBlur}
                />

                {formik.touched.pincode && formik.errors.pincode ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.pincode}
                  </div>
                ) : null}
              </Grid>
              <Grid md={4} item>
                <TextField
                  label={
                    <CustomLabel
                      text={t("text.Email")}
                      required={requiredFields.includes("email")}
                    />
                  }
                  value={formik.values.email}
                  placeholder={t("text.Email")}
                  size="small"
                  fullWidth
                  name="email"
                  id="email"
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.email}
                  </div>
                ) : null}
              </Grid>

              <Grid md={4} item>
                <TextField
                  label={<CustomLabel text={t("text.Fax")} />}
                  value={formik.values.fax}
                  placeholder={t("text.Fax")}
                  size="small"
                  fullWidth
                  name="fax"
                  id="fax"
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid md={4} item>
                <TextField
                  label={<CustomLabel text={t("text.Website")} />}
                  value={formik.values.website}
                  placeholder={t("text.Website")}
                  size="small"
                  fullWidth
                  name="website"
                  id="website"
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid md={4} item>
                <TranslateTextField
                  label={t("text.DistrictArea")}
                  value={formik.values.districtArea}
                  onChangeText={(text: string) =>
                    handleConversionChange("districtArea", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Grid md={4} item>
                <TranslateTextField
                  label={t("text.StatusPg")}
                  value={formik.values.statusPG}
                  onChangeText={(text: string) =>
                    handleConversionChange("statusPG", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>
              <Grid md={4} item>
                <TranslateTextField
                  label={t("text.Registrar")}
                  value={formik.values.registrar}
                  onChangeText={(text: string) =>
                    handleConversionChange("registrar", text)
                  }
                  required={false}
                  lang={lang}
                />
              </Grid>

              <Grid md={4} item>
                <TextField
                  label={<CustomLabel text={t("text.NameOfFaculties")} />}
                  value={formik.values.facultiesName}
                  placeholder={t("text.NameOfFaculties")}
                  size="small"
                  fullWidth
                  name="facultiesName"
                  id="facultiesName"
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid md={4} item>
                <TextField
                  id="noOfTeachers"
                  name="noOfTeachers"
                  label={
                    <CustomLabel
                      text={t("text.NoOfTeachers")}
                      required={requiredFields.includes("noOfTeachers")}
                    />
                  }
                  value={formik.values.noOfTeachers}
                  placeholder={t("text.NoOfTeachers")}
                  size="small"
                  fullWidth
                  type="number"
                  inputProps={{ min: "0", step: "1" }}
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.noOfTeachers && formik.errors.noOfTeachers
                        ? "red"
                        : "initial",
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.noOfTeachers && formik.errors.noOfTeachers ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.noOfTeachers}
                  </div>
                ) : null}
              </Grid>
              <Grid md={4} item>
                <TextField
                  type="date"
                  label={<CustomLabel text={t("text.DateFrom")} />}
                  value={formik.values.datefrom}
                  placeholder={t("text.DateFrom")}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  name="datefrom"
                  id="datefrom"
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid md={4} item>
                <TextField
                  type="date"
                  label={<CustomLabel text={t("text.AccesedByNaac")} />}
                  value={formik.values.date_R}
                  placeholder={t("text.AccesedByNaac")}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  name="date_R"
                  id="date_R"
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid md={4} item>
                <TextField
                  id="session_year"
                  name="session_year"
                  label={
                    <CustomLabel
                      text={t("text.SessionYear")}
                      required={requiredFields.includes("session_year")}
                    />
                  }
                  value={formik.values.session_year}
                  placeholder={t("text.SessionYear")}
                  type="number"
                  inputProps={{ min: "0", step: "1" }}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.session_year && formik.errors.session_year
                        ? "red"
                        : "initial",
                  }}
                  // onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    let session_year = e.target.value;
                    console.log("session_year", String(session_year));
                    formik.setFieldValue("session_year", String(session_year));
                  }}
                />
                {formik.touched.session_year && formik.errors.session_year ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.session_year}
                  </div>
                ) : null}
              </Grid>

              <Grid md={4} item>
                <TextField
                  id="reAttenDuration"
                  name="reAttenDuration"
                  label={
                    <CustomLabel
                      text={t("text.ReAtendenceDuration")}
                      required={requiredFields.includes("reAttenDuration")}
                    />
                  }
                  value={formik.values.reAttenDuration}
                  placeholder={t("text.ReAtendenceDuration")}
                  type="number"
                  inputProps={{ min: "0", step: "1" }}
                  size="small"
                  fullWidth
                  style={{
                    backgroundColor: "white",
                    borderColor:
                      formik.touched.reAttenDuration &&
                      formik.errors.reAttenDuration
                        ? "red"
                        : "initial",
                  }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.reAttenDuration &&
                formik.errors.reAttenDuration ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.reAttenDuration}
                  </div>
                ) : null}
              </Grid>
            </Grid>

            <br />
            <Divider />
            <br />

            <Grid item xs={12} container spacing={2}>
              <Grid item md={6}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Options}
                  // value={
                  //     ZoneOption.find(
                  //         (option) => option.value === formik.values.fileTypeId
                  //     ) || null
                  // }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue(
                      "enableAutoStuCredentials",
                      newValue?.value + ""
                    );

                    formik.setFieldTouched("enableAutoStuCredentials", true);
                    formik.setFieldTouched("enableAutoStuCredentials", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.EnableAutoStuCredentials")}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item md={6}>
                <Autocomplete
                  multiple
                  disablePortal
                  id="combo-box-demo"
                  options={StRole}
                  //getOptionLabel={(option: any) => option.label}
                  // value={
                  //     ZoneOption.find(
                  //         (option) => option.value === formik.values.fileTypeId
                  //     ) || null
                  // }
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue(
                      "defaultStuRoles",
                      newValue?.value + ""
                    );

                    formik.setFieldTouched("defaultStuRoles", true);
                    formik.setFieldTouched("defaultStuRoles", false);
                  }}
                  fullWidth
                  size="small"
                  disableCloseOnSelect
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox style={{ marginRight: 8 }} checked={selected} />
                      <ListItemText primary={option.label} />
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel text={t("text.SelectStudentRoles")} />
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              container
              spacing={2}
              style={{ marginTop: "2%" }}
            >
              <Grid item md={6}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Options}
                  // value={
                  //     ZoneOption.find(
                  //         (option) => option.value === formik.values.fileTypeId
                  //     ) || null
                  // }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue(
                      "enableAutoEmpCredentials",
                      newValue?.value + ""
                    );

                    formik.setFieldTouched("enableAutoEmpCredentials", true);
                    formik.setFieldTouched("enableAutoEmpCredentials", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel
                          text={t("text.EnableAutoEmpCredentials")}
                        />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item md={6}>
                <Autocomplete
                  multiple
                  disablePortal
                  id="combo-box-demo"
                  options={EmpRole}
                  // getOptionLabel={(option: any) => option.label}
                  // value={
                  //     ZoneOption.find(
                  //         (option) => option.value === formik.values.fileTypeId
                  //     ) || null
                  // }
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue(
                      "defaultEmpRoles",
                      newValue?.value + ""
                    );

                    formik.setFieldTouched("defaultEmpRoles", true);
                    formik.setFieldTouched("defaultEmpRoles", false);
                  }}
                  fullWidth
                  size="small"
                  disableCloseOnSelect
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox style={{ marginRight: 8 }} checked={selected} />
                      <ListItemText primary={option.label} />
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel text={t("text.SelectEmployeeRoles")} />
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>

            <br />
            <Divider />
            <br />

            <Grid
              item
              xs={12}
              container
              spacing={2}
              style={{ marginTop: "2%" }}
            >
              <Grid item md={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Options}
                  // value={
                  //     ZoneOption.find(
                  //         (option) => option.value === formik.values.fileTypeId
                  //     ) || null
                  // }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue(
                      "enableBiometric",
                      newValue?.value + ""
                    );

                    formik.setFieldTouched("enableBiometric", true);
                    formik.setFieldTouched("enableAutoStuCredentials", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.EnableBiometric")} />}
                    />
                  )}
                />
              </Grid>

              <Grid item md={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Options}
                  // value={
                  //     ZoneOption.find(
                  //         (option) => option.value === formik.values.fileTypeId
                  //     ) || null
                  // }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue(
                      "enableDualBiometric",
                      newValue?.value + ""
                    );

                    formik.setFieldTouched("enableDualBiometric", true);
                    formik.setFieldTouched("enableDualBiometric", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel text={t("text.EnableDualBiometric")} />
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item md={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={MenuOptions}
                  // value={
                  //     ZoneOption.find(
                  //         (option) => option.value === formik.values.fileTypeId
                  //     ) || null
                  // }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("menuType", newValue?.value + "");

                    formik.setFieldTouched("menuType", true);
                    formik.setFieldTouched("menuType", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={<CustomLabel text={t("text.MenuType")} />}
                    />
                  )}
                />
              </Grid>

              <Grid item md={4}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={ParentInst}
                  // value={
                  //     ZoneOption.find(
                  //         (option) => option.value === formik.values.fileTypeId
                  //     ) || null
                  // }
                  fullWidth
                  size="small"
                  onChange={(event, newValue: any) => {
                    console.log(newValue?.value);

                    formik.setFieldValue("parent_inst", newValue?.value);

                    formik.setFieldTouched("parent_inst", true);
                    formik.setFieldTouched("parent_inst", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <CustomLabel text={t("text.SelectParentInstitute")} />
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item md={4}>
                <TextField
                  label={<CustomLabel text={t("text.MenuBackColor")} />}
                  value={formik.values.mBackColor}
                  placeholder={t("text.MenuBackColor")}
                  size="small"
                  fullWidth
                  name="mBackColor"
                  id="mBackColor"
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleIconClick}>
                          <ColorLensIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Popover
                  id={id}
                  open={open}
                  anchorEl={colorPickerAnchor}
                  onClose={handlePopoverClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <SketchPicker
                    color={formik.values.mBackColor}
                    onChangeComplete={handleColorChange}
                  />
                </Popover>
              </Grid>

              <Grid item md={4}>
                <TextField
                  label={<CustomLabel text={t("text.MenuOverColor")} />}
                  value={formik.values.mOverColor}
                  placeholder={t("text.MenuOverColor")}
                  size="small"
                  fullWidth
                  name="mOverColor"
                  id="mOverColor"
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleIconClick1}>
                          <ColorLensIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Popover
                  id={id1}
                  open={open1}
                  anchorEl={colorPickerOver}
                  onClose={handlePopoverClose1}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <SketchPicker
                    color={formik.values.mOverColor}
                    onChangeComplete={handleColorChange1}
                  />
                </Popover>
              </Grid>
            </Grid>

            <Grid container spacing={1} item>
              <Grid
                xs={12}
                md={4}
                sm={4}
                item
                style={{ marginBottom: "30px", marginTop: "30px" }}
              >
                <TextField
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  InputLabelProps={{ shrink: true }}
                  label={<CustomLabel text={t("text.Attachedlogo")} />}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={(e) => otherDocChangeHandler(e, "instLogo")}
                />
              </Grid>
              <Grid xs={12} md={4} sm={4} item></Grid>

              <Grid xs={12} md={4} sm={4} item>
                <Grid
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  {formik.values.instLogo == "" ? (
                    <img
                      src={nopdf}
                      style={{
                        width: 150,
                        height: 100,
                        border: "1px solid grey",
                        borderRadius: 10,
                      }}
                    />
                  ) : (
                    <img
                      src={formik.values.instLogo}
                      style={{
                        width: 150,
                        height: 100,
                        border: "1px solid grey",
                        borderRadius: 10,
                        padding: "2px",
                      }}
                    />
                  )}
                  <Typography
                    onClick={() => modalOpenHandle("instLogo")}
                    style={{
                      textDecorationColor: "blue",
                      textDecorationLine: "underline",
                      color: "blue",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                  >
                    {t("text.Preview")}
                  </Typography>
                </Grid>
              </Grid>
              <Modal open={panOpens} onClose={handlePanClose}>
                <Box sx={style}>
                  {modalImg == "" ? (
                    <img
                      src={nopdf}
                      style={{
                        width: "170vh",
                        height: "75vh",
                      }}
                    />
                  ) : (
                    <img
                      alt="preview image"
                      src={modalImg}
                      style={{
                        width: "170vh",
                        height: "75vh",
                        borderRadius: 10,
                      }}
                    />
                  )}
                </Box>
              </Modal>
            </Grid>

            <Grid container spacing={1} item>
              <Grid
                xs={12}
                md={4}
                sm={4}
                item
                style={{ marginBottom: "30px", marginTop: "30px" }}
              >
                <TextField
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  InputLabelProps={{ shrink: true }}
                  label={<CustomLabel text={t("text.UploadImage")} />}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={(e) => otherDocChangeHandler(e, "instImage")}
                />
              </Grid>
              <Grid xs={12} md={4} sm={4} item></Grid>

              <Grid xs={12} md={4} sm={4} item>
                <Grid
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  {formik.values.instImage == "" ? (
                    <img
                      src={nopdf}
                      style={{
                        width: 150,
                        height: 100,
                        border: "1px solid grey",
                        borderRadius: 10,
                      }}
                    />
                  ) : (
                    <img
                      src={formik.values.instImage}
                      style={{
                        width: 150,
                        height: 100,
                        border: "1px solid grey",
                        borderRadius: 10,
                        padding: "2px",
                      }}
                    />
                  )}
                  <Typography
                    onClick={() => modalOpenHandle1("instImage")}
                    style={{
                      textDecorationColor: "blue",
                      textDecorationLine: "underline",
                      color: "blue",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                  >
                    {t("text.Preview")}
                  </Typography>
                </Grid>
              </Grid>

              <Modal open={Opens} onClose={handlePanClose1}>
                <Box sx={style}>
                  {Img == "" ? (
                    <img
                      src={nopdf}
                      style={{
                        width: "170vh",
                        height: "75vh",
                      }}
                    />
                  ) : (
                    <img
                      alt="preview image"
                      src={Img}
                      style={{
                        width: "170vh",
                        height: "75vh",
                        borderRadius: 10,
                      }}
                    />
                  )}
                </Box>
              </Modal>
            </Grid>

            <Grid container spacing={1} item>
              <Grid
                xs={12}
                md={4}
                sm={4}
                item
                style={{ marginBottom: "30px", marginTop: "30px" }}
              >
                <TextField
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  InputLabelProps={{ shrink: true }}
                  label={<CustomLabel text={t("text.ReportHeaderImg")} />}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={(e) => otherDocChangeHandler(e, "reportheaderimg")}
                />
              </Grid>
              <Grid xs={12} md={4} sm={4} item></Grid>

              <Grid xs={12} md={4} sm={4} item>
                <Grid
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  {formik.values.reportheaderimg == "" ? (
                    <img
                      src={nopdf}
                      style={{
                        width: 150,
                        height: 100,
                        border: "1px solid grey",
                        borderRadius: 10,
                      }}
                    />
                  ) : (
                    <img
                      src={formik.values.reportheaderimg}
                      style={{
                        width: 150,
                        height: 100,
                        border: "1px solid grey",
                        borderRadius: 10,
                        padding: "2px",
                      }}
                    />
                  )}
                  <Typography
                    onClick={() => modalOpenHandle2("reportheaderimg")}
                    style={{
                      textDecorationColor: "blue",
                      textDecorationLine: "underline",
                      color: "blue",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                  >
                    {t("text.Preview")}
                  </Typography>
                </Grid>
              </Grid>

              <Modal open={OpenImg} onClose={handlePanClose2}>
                <Box sx={style}>
                  {Img == "" ? (
                    <img
                      src={nopdf}
                      style={{
                        width: "170vh",
                        height: "75vh",
                      }}
                    />
                  ) : (
                    <img
                      alt="preview image"
                      src={Img}
                      style={{
                        width: "170vh",
                        height: "75vh",
                        borderRadius: 10,
                      }}
                    />
                  )}
                </Box>
              </Modal>
            </Grid>

            <Grid container spacing={1} item>
              <Grid
                xs={12}
                md={4}
                sm={4}
                item
                style={{ marginBottom: "30px", marginTop: "30px" }}
              >
                <TextField
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  InputLabelProps={{ shrink: true }}
                  label={<CustomLabel text={t("text.ReportFooterImg")} />}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={(e) => otherDocChangeHandler(e, "reportfooterimg")}
                />
              </Grid>
              <Grid xs={12} md={4} sm={4} item></Grid>

              <Grid xs={12} md={4} sm={4} item>
                <Grid
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  {formik.values.reportfooterimg == "" ? (
                    <img
                      src={nopdf}
                      style={{
                        width: 150,
                        height: 100,
                        border: "1px solid grey",
                        borderRadius: 10,
                      }}
                    />
                  ) : (
                    <img
                      src={formik.values.reportfooterimg}
                      style={{
                        width: 150,
                        height: 100,
                        border: "1px solid grey",
                        borderRadius: 10,
                        padding: "2px",
                      }}
                    />
                  )}
                  <Typography
                    onClick={() => modalOpenHandle3("reportfooterimg")}
                    style={{
                      textDecorationColor: "blue",
                      textDecorationLine: "underline",
                      color: "blue",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                  >
                    {t("text.Preview")}
                  </Typography>
                </Grid>
              </Grid>

              <Modal open={OpenFooter} onClose={handlePanClose3}>
                <Box sx={style}>
                  {Img == "" ? (
                    <img
                      src={nopdf}
                      style={{
                        width: "170vh",
                        height: "75vh",
                      }}
                    />
                  ) : (
                    <img
                      alt="preview image"
                      src={Img}
                      style={{
                        width: "170vh",
                        height: "75vh",
                        borderRadius: 10,
                      }}
                    />
                  )}
                </Box>
              </Modal>
            </Grid>

            <Grid container spacing={1} item>
              <Grid
                xs={12}
                md={4}
                sm={4}
                item
                style={{ marginBottom: "30px", marginTop: "30px" }}
              >
                <TextField
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  InputLabelProps={{ shrink: true }}
                  label={<CustomLabel text={t("text.ReportHeader")} />}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={(e) => otherDocChangeHandler(e, "reportHeader")}
                />
              </Grid>
              <Grid xs={12} md={4} sm={4} item></Grid>

              <Grid xs={12} md={4} sm={4} item>
                <Grid
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: "10px",
                  }}
                >
                  {formik.values.reportHeader == "" ? (
                    <img
                      src={nopdf}
                      style={{
                        width: 150,
                        height: 100,
                        border: "1px solid grey",
                        borderRadius: 10,
                      }}
                    />
                  ) : (
                    <img
                      src={formik.values.reportHeader}
                      style={{
                        width: 150,
                        height: 100,
                        border: "1px solid grey",
                        borderRadius: 10,
                        padding: "2px",
                      }}
                    />
                  )}
                  <Typography
                    onClick={() => modalOpenHandle4("reportHeader")}
                    style={{
                      textDecorationColor: "blue",
                      textDecorationLine: "underline",
                      color: "blue",
                      fontSize: "15px",
                      cursor: "pointer",
                    }}
                  >
                    {t("text.Preview")}
                  </Typography>
                </Grid>
              </Grid>

              <Modal open={OpenHeader} onClose={handlePanClose4}>
                <Box sx={style}>
                  {Img == "" ? (
                    <img
                      src={nopdf}
                      style={{
                        width: "170vh",
                        height: "75vh",
                      }}
                    />
                  ) : (
                    <img
                      alt="preview image"
                      src={Img}
                      style={{
                        width: "170vh",
                        height: "75vh",
                        borderRadius: 10,
                      }}
                    />
                  )}
                </Box>
              </Modal>
            </Grid>

            <Grid
              item
              xs={12}
              spacing={2}
              container
              style={{ display: "flex", marginTop: "5%" }}
            >
              <Grid md={6} item>
                <Button
                  type="submit"
                  fullWidth
                  style={{
                    
                    backgroundColor: `var(--grid-headerBackground)`,
                    color: `var(--grid-headerColor)`,
                    marginTop:"10px"
                  }}
                >
                  {t("text.save")}
                </Button>
              </Grid>

              <Grid md={6} item>
                <Button
                  type="reset"
                  fullWidth
                  style={{
                    backgroundColor: "#F43F5E",
                    color: "white",
                    marginTop: "10px",
                  }}
                  onClick={(e) => formik.resetForm()}
                >
                  {t("text.reset")}
                </Button>
              </Grid>
            </Grid>

            {/* </Card> */}
          </form>
        </CardContent>
      </div>
    </div>
  );
};

export default InstituteAdd;
