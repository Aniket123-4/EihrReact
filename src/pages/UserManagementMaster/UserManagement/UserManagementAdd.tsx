import {
  Button,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { Divider } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ToastApp from "../../../ToastApp";
import api from "../../../utils/Url";
import React from "react";

type Props = {};

const UserManagementAdd = (props: Props) => {
  const { t } = useTranslation();

  const [option, setOption] = useState([{
    value: "-1", label:
      t("text.SelectGender")
  }]);
  const [option1, setOption1] = useState([{ value: "-1", label: t("text.SelectRole"), user_ID: "-1" }]);
  const [option2, setOption2] = useState([{ value: "-1", label: t("text.SelectUserType") }]);

  const [option3, setOption3] = useState([{ value: "-1", label: t("text.SelectDesignation") }]);

  const [option4, setOption4] = useState([{ value: "-1", label: t("text.SelectSection") }]);


  const [isPackage, setPackage] = useState([{
    value: "-1", label:
      t("text.SelectPackage")
  }]);

  let navigate = useNavigate();

  const back = useNavigate();

  const getGender = () => {

    api
      .get(`Common/Getgender`)
      .then((res) => {
        const arr: any = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["genderName"],
            value: res.data.data[index]["genderID"],
          });
        }
        setOption(arr);
      });
  };


  const getPackage = () => {
    const collectData = {
      "collegeID": "1",
      "packageID": "-1",
      "type": "1"
    }

    api
      .post(`Login/GetPackage`, collectData)
      .then((res) => {
        const arr: any = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["packageName"],
            value: res.data.data[index]["packageID"],
          });
        }
        setPackage(arr);
      });
  };


  const getRole = () => {

    api
      .get(`Login/GetRole?RoleID=-1`)
      .then((res) => {
        const arr: any = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["rowValue"],
            value: res.data.data[index]["rowID"],
            user_ID: " "
          });
        }
        setOption1(arr);
      });
  };


  const getDesignation = () => {

    api
      .get(`Login/GetDesignation?DesigID=-1`)
      .then((res) => {
        const arr: any = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res?.data?.data[index]["desigName"],
            value: res?.data?.data[index]["desigID"]

          });
        }
        setOption3(arr);
      });
  };



  const getSection = () => {
    const collectData = {
      "sectionID": "-1",
      "type": "1"
    }

    api
      .post(`Login/GetSectionTree`, collectData)
      .then((res) => {
        const arr: any = [];
        console.log("result" + JSON.stringify(res?.data));
        for (let index = 0; index < res?.data?.length; index++) {
          arr.push({
            label: res?.data[index]["sectionName"],
            value: res?.data[index]["sectionID"]

          });
        }
        setOption4(arr);
      });
  };

  const getUserType = () => {

    api
      .get(`Login/GetUserType`)
      .then((res) => {
        const arr: any = [];
        console.log("result" + JSON.stringify(res.data.data));
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["userTypeName"],
            value: res.data.data[index]["userTypeID"],
          });
        }
        setOption2(arr);
      });
  };
  const [toaster, setToaster] = useState(false);

  useEffect(() => {
    getRole();
    getGender();
    getUserType();
    getPackage();
    getDesignation();
    getSection();
  }, []);

  const validationSchema = Yup.object({
    firstName: Yup.string().test(
      "required",
      t("text.reqFirst"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    surName: Yup.string().test(
      "required",
      t("text.reqLast"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    loginName: Yup.string().test(
      "required",
      t("text.reqLogin"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    loginPassword: Yup.string().test(
      "required",
      t("text.reqPassword"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    curMobile: Yup.string()
      .required(t("text.reqMobile"))
      .test(
        t("text.validMobile"),
        t("text.InvalidMobile"),
        function (value: any) {
          const trimmedValue = value.trim();
          if (trimmedValue && trimmedValue.length === 10) {
            if (trimmedValue.charAt(0) === '0') {
              return false;
            }
            return true;
          }
          return false;
        }
      ),
    eMail: Yup.string()
      .required(t("text.reqEmail"))
      .test(
        t("text.validEmai"),
        t("text.InvalidEmail"),
        function (value: any) {
          const trimmedValue = value.trim();
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue);
        }
      ),
    dob: Yup.string().test(
      "required",
      t("text.reqDate"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    genderID: Yup.string().test(
      "required",
      t("text.reqGender"),
      function (value: any) {
        return value && value.trim() !== "";
      }
    ),
    userTypeID: Yup.string().test(
      "required",
      t("text.reqUser"),

      function (value: any) {
        return value && value.trim() !== "";
      }
    ),


  });

  const handleRoleTypeChange = (event: any, newValue: any) => {


    if (!newValue || !Array.isArray(newValue)) {
      setOption1([]);
      formik.setFieldValue("roleT", []);
      return;
    }

    const newRoles = newValue?.map((item: any) => ({
      roleID: item.value.toString(),
      "type": 1
    }));
    //console.log("check new role", newRoles);
    formik.setFieldValue("roleT", newRoles);
  };


  const handlePackage = (event: any, newValue: any) => {


    if (!newValue || !Array.isArray(newValue)) {
      setPackage([]);
      formik.setFieldValue("packageT", []);
      return;
    }

    const newRoles = newValue?.map((item: any) => ({
      packageID: item.value,
      packageName: item.label,
      "orgID": "1",
      "packageURL": ""
    }));
    // console.log("check new role", newRoles);
    formik.setFieldValue("packageT", newRoles);
  };


  const handleDesignation = (event: any, newValue: any) => {

    if (!newValue || !Array.isArray(newValue)) {
      setOption3([]);
      formik.setFieldValue("desigT", []);
      return;
    }

    const newRoles = newValue?.map((item: any) => ({
      "desigID": item?.value || "",
      "desigName": item?.label || "",
      "desigCode": "1",
      "isActive": true,
      "priority": "1",
      "desigType": "1"
    }));
    // console.log("check new role", newRoles);
    formik.setFieldValue("desigT", newRoles);
  };




  const handleSection = (event: any, newValue: any) => {

    if (!newValue || !Array.isArray(newValue)) {
      setOption4([]);
      formik.setFieldValue("sectionT", []);
      return;
    }

    const newRoles = newValue?.map((item: any) => ({
      "sectionID": item?.value,
      "sectionName": item?.label || "",
      "sectionCode": "",
      "parentSectionID": -1,
      "mainSectionID": item?.value.toString(),
      "parentMainSectionID": -1,
      "depthLevel": "0"
    }));
    // console.log("check new role", newRoles);
    formik.setFieldValue("sectionT", newRoles);
  };







  const formik = useFormik({
    initialValues: {
      "firstName": "",
      "middleName": "",
      "surName": "",
      "loginName": "",
      "loginPassword": "",
      "userCode": "",
      "curMobile": "",
      "eMail": "",
      "dob": "",
      "genderID": "1",
      "packageT": [],
      "roleT": [],
      "desigT": [

      ],
      "sectionT": [],
      "userTypeID": "",
      "userID": "-1",
      "rankID": "-1",
      "ShortName": "",
      "UserTypeID": "-1",
      "stringName": "",
      "formID": "-1",
      "type": "1",
      "otp": ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {


      const response = await api.post(
        `Login/SaveUserInfo`,
        values
      );
      if (response?.data?.isSuccess) {
        setToaster(false);
        toast.success(response.data.msg);
        navigate("/User/UserManagement");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const requiredFields = [
    "firstName",
    "surName",
    "loginName",
    "loginPassword",
    "curMobile",
    "eMail",
    "dob",
    "genderID",
    "userTypeID",

  ];

  return (
    <div style={{ backgroundColor: 'white' }}>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "white", //Ensuring white background
          borderRadius: "5px",
          border: ".5px solid #ff7722",
          marginTop: "3vh"
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ marginTop: "10px", fontSize: "18px", fontWeight: 500 }}
          >
            {t("text.CreateUserManegment")}
          </Typography>
          <Grid xs={4} sm={12} item>
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
              <Grid xs={12} sm={4} item>
                <TextField
                  type="text"
                  label={
                    <span>
                      {t("text.EnterFirstName")} {" "}
                      {requiredFields.includes("firstName") && (
                        <span
                          style={{
                            color: formik.values.firstName ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  value={formik.values.firstName}
                  name="firstName"
                  id="firstName"
                  placeholder={t("text.EnterFirstName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.firstName}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="text"
                  label={t("text.EnterMiddleName")}
                  value={formik.values.middleName}
                  name="middleName"
                  id="middleName"
                  placeholder={t("text.EnterMiddleName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="text"
                  label={
                    <span>
                      {t("text.EnterLastName")} {" "}
                      {requiredFields.includes("surName") && (
                        <span
                          style={{
                            color: formik.values.surName ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  name="surName"
                  id="surName"
                  value={formik.values.surName}
                  placeholder={t("text.EnterLastName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.surName && formik.errors.surName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.surName}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="text"
                  label={
                    <span>
                      {t("text.EnterLoginName")}{" "}
                      {requiredFields.includes("loginName") && (
                        <span
                          style={{
                            color: formik.values.loginName ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  name="loginName"
                  id="loginName"
                  value={formik.values.loginName}
                  placeholder={t("text.EnterLoginName")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.loginName && formik.errors.loginName ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.loginName}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="password"
                  label={
                    <span>
                      {t("text.EnterPassword")} {" "}
                      {requiredFields.includes("loginPassword") && (
                        <span
                          style={{
                            color: formik.values.loginPassword ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  value={formik.values.loginPassword}
                  name="loginPassword"
                  id="loginPassword"
                  placeholder={t("text.EnterPassword")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.loginPassword && formik.errors.loginPassword ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.loginPassword}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="text"
                  label={t("text.EnterUserCode")}
                  name="userCode"
                  id="userCode"
                  value={formik.values.userCode}
                  placeholder={t("text.EnterUserCode")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="text"
                  label={
                    <span>
                      {t("text.EnterMobileNo")}{" "}
                      {requiredFields.includes("curMobile") && (
                        <span
                          style={{
                            color: formik.values.curMobile ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  inputProps={{ maxLength: 10 }}
                  name="curMobile"
                  id="curMobile"
                  value={formik.values.curMobile}
                  placeholder={t("text.EnterMobileNo")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.curMobile && formik.errors.curMobile ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.curMobile}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="email"
                  label={
                    <span>
                      {t("text.EnterEmailId")}{" "}
                      {requiredFields.includes("eMail") && (
                        <span
                          style={{
                            color: formik.values.eMail ? "green" : "red",
                          }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  name="eMail"
                  id="eMail"
                  value={formik.values.eMail}
                  placeholder={t("text.EnterEmailId")}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.eMail && formik.errors.eMail ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.eMail}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <TextField
                  type="Date"
                  InputLabelProps={{ shrink: true }}
                  label={
                    <span>
                      {t("text.EnterDateOfBirth")} {" "}
                      {requiredFields.includes("dob") && (
                        <span
                          style={{ color: formik.values.dob ? "green" : "red" }}
                        >
                          *
                        </span>
                      )}
                    </span>
                  }
                  name="dob"
                  id="dob"
                  placeholder={t("text.EnterDateOfBirth")}
                  value={formik.values.dob}
                  size="small"
                  fullWidth
                  style={{ backgroundColor: "white" }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.dob && formik.errors.dob ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.dob}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option}
                  fullWidth
                  size="small"

                  onChange={(event, newValue) => {
                    formik.setFieldValue("genderID", String(newValue?.value));
                    formik.setFieldTouched("genderID", true);
                    formik.setFieldTouched("genderID", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectGender")} {""}
                          {requiredFields.includes("genderID") && (
                            <span
                              style={{
                                color: formik.values.genderID
                                  ? "green"
                                  : "red",
                              }}
                            >
                              *
                            </span>
                          )}
                        </span>
                      }
                    />
                  )}
                />
                {formik.touched.genderID && formik.errors.genderID ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.genderID}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} sm={4} item>
                <Autocomplete
                  multiple
                  disablePortal
                  id="combo-box-demo"
                  options={option1}
                  fullWidth
                  size="small"
                  onChange={handleRoleTypeChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectRole")}

                        </span>
                      }
                    />
                  )}
                />

              </Grid>


              <Grid xs={12} sm={4} item>
                <Autocomplete
                  multiple
                  disablePortal
                  id="combo-box-demo"
                  options={isPackage}
                  fullWidth
                  size="small"
                  onChange={handlePackage}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectPackage")}

                        </span>
                      }
                    />
                  )}
                />

              </Grid>

              <Grid xs={12} sm={4} item>
                <Autocomplete
                  multiple
                  disablePortal
                  id="combo-box-demo"
                  options={option3}
                  fullWidth
                  size="small"
                  onChange={handleDesignation}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectDesignation")}

                        </span>
                      }
                    />
                  )}
                />

              </Grid>






              <Grid xs={12} sm={4} item>
                <Autocomplete
                  multiple
                  disablePortal
                  id="combo-box-demo"
                  options={option4}
                  fullWidth
                  size="small"
                  onChange={handleSection}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectSection")}

                        </span>
                      }
                    />
                  )}
                />

              </Grid>

              <Grid xs={12} sm={4} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={option2}
                  fullWidth
                  size="small"
                  onChange={(event, newValue) => {
                    formik.setFieldValue("userTypeID", String(newValue?.value));
                    formik.setFieldTouched("userTypeID", true);
                    formik.setFieldTouched("userTypeID", false);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          {t("text.SelectUserType")} {""}
                          {requiredFields.includes("userTypeID") && (
                            <span
                              style={{
                                color: formik.values.userTypeID
                                  ? "green"
                                  : "red",
                              }}
                            >
                              *
                            </span>
                          )}
                        </span>
                      }
                    />
                  )}
                />
                {formik.touched.userTypeID && formik.errors.userTypeID ? (
                  <div style={{ color: "red", margin: "5px" }}>
                    {formik.errors.userTypeID}
                  </div>
                ) : null}
              </Grid>

              <Grid xs={12} item>
                <div style={{ justifyContent: "space-between", flex: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: `var(--header-background)`,
                      margin: "1%",
                    }}
                  >
                    {t("text.save")}
                  </Button>

                  <Button
                    type="reset"
                    variant="contained"
                    style={{
                      width: "48%",
                      backgroundColor: "#F43F5E",
                      margin: "1%",
                    }}
                    onClick={() => formik.resetForm()}
                  >
                    {t("text.reset")}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </div>
    </div>
  );
};
export default UserManagementAdd;
