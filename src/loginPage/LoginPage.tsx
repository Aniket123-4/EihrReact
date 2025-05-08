import "./index.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
// import { faGoogle, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HOST_URL from "../utils/Url";
import useLocalStorage from "use-local-storage";
import Typewriter from "../components/common/TypeWriter";
// import Typewriter from "./LoginTypeWriter";
import Divider from "@mui/material/Divider";
import advPics from "../assets/images/headDoc.png";
import logo from "../assets/images/Login.png";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { green } from "@mui/material/colors";
import api from "../utils/Url";

function LoginPage() {
  const [isSignUpMode, setIsSignUpMode] = useState<boolean>(false);
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);



  
  useEffect(() => {
   
    dynamicData();
   
  }, []);

  const dynamicData =()=>{

    const collectData = {
      id:-1
    }
   
    api.post(`Institute_Master/GetInstitute_Master`,collectData)
    .then((res:any) => {
      
      // console.log("🚀 ~ dynamicData ~ res:", res.data.data)
      if(res.data.data.length >0){
        localStorage.setItem("sidelogo", res.data.data[0]["instLogo"]);
        localStorage.setItem("applogo", res.data.data[0]["reportheaderimg"]);
        localStorage.setItem("name", res.data.data[0]["insname"]);
        localStorage.setItem("mclr", res.data.data[0]["mBackColor"]);
        localStorage.setItem("oclr", res.data.data[0]["mOverColor"]);
      
      }
    })
  }


  

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };
  const [tokenKey, setTokenKey] = useLocalStorage("name", "");
  let navigate = useNavigate();
  // const handleSubmit = (event: { preventDefault: () => void }) => {
  //   event.preventDefault();

  //   const collectData = {
  //     useR_ID: userID,
  //     password: password,
  //     collageID: "1",
  //     packageID: "1",
  //   };
  //   console.log(collectData);
  //   axios
  //     .post(HOST_URL.HOST_URL + `USER/USERLOGIN`, collectData)
  //     .then((res) => {
  //       console.log(res.data.data);
  //       if (res.data.isSuccess) {
  //         localStorage.setItem("userdata", JSON.stringify(res.data.data));

  //         setUserID("");
  //         setPassword("");
  //         let path = `/home`;
  //         navigate(path);
  //       } else {
  //         setTokenKey("");
  //         alert("Login Faild");
  //       }
  //     });
  // };

  const handleButtonClick = async () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      try {
        const response = await formik.submitForm();
        if (response.isSuccess) {
          if (response.data[0]["userPermission"] == null) {
            toast.error("User Permission is null");
          } else {
            localStorage.setItem("userdata", JSON.stringify(response.data));
            localStorage.setItem(
              "useR_ID",
              JSON.stringify(response.data[0]["userdetail"][0]["useR_ID"])
            );
            sessionStorage.setItem(
              "token",
              JSON.stringify(response.data[0]["token"])
            );
            navigate(`/home`);
            toast.success(response.data.mesg);
            formik.resetForm();
          }
          timer.current = setTimeout(() => {
            setSuccess(true);
            setLoading(false);
          }, 1000);
        } else {
          toast.error(response.data.mesg);
          setLoading(false);
        }
      } catch (error) {
        toast.error("Login Failed");
        setLoading(false);
      }
    }
  };

  const validationSchema = Yup.object({
    useR_ID: Yup.string().required("Username Required"),
    password: Yup.string().required("Password Required"),
  });

  const formik = useFormik({
    initialValues: {
      useR_ID: "",
      password: "",
      collageID: "1",
      packageID: "1",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await api.post(
        `Auth/USERLOGIN`,
        values
      );
      return response.data;
    },
  });

  return (
    <div className={`loginContainer`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form
            action="#"
            onSubmit={formik.handleSubmit}
            className="sign-in-form loginForm"
          >
            <img
              className="knpimg"
              alt="Active"
              src={logo}
              style={{ height: "15vh", width: "15vh", margin: "10px" }}
            />
            <div>
              <h3 className="loginh3">Ecsc Library</h3>
            </div>
            <br />
            <i className="title">"Illuminating Pathways, Ensuring Safety!"</i>
            {/* <h2 className="title">Sign in</h2> */}
            <div className="input-field">
              <FontAwesomeIcon
                icon={faUser}
                className="my-auto mx-auto"
                style={{
                  alignSelf: "center",
                  paddingLeft: "1%",
                  color: "blue",
                }}
              />

              <input
                className="LoginInput"
                type="text"
                name="useR_ID"
                id="useR_ID"
                value={formik.values.useR_ID}
                required
                placeholder="username"
                onChange={formik.handleChange}
              />
            </div>

            <div className="input-field">
              <FontAwesomeIcon
                icon={faLock}
                className="my-auto mx-auto"
                style={{
                  alignSelf: "center",
                  paddingLeft: "1%",
                  color: "blue",
                }}
              />
              <input
                className="LoginInput"
                type="password"
                required
                name="password"
                id="password"
                value={formik.values.password}
                placeholder="password"
                onChange={formik.handleChange}
              />
            </div>
            <Button
              variant="contained"
              color="success"
              disabled={loading}
              style={{ width: "60%", margin: "2%" }}
              onClick={handleButtonClick}
            >
              {loading ? (
                <CircularProgress size={24} style={{ color: "green" }} />
              ) : (
                "Sign In"
              )}
            </Button>

            {/* <button className="btn transparent" onClick={handleSignUpClick}>
              Sign up
            </button>
           */}
            <br />
            {/* <Divider/>
           <br/> */}
            {/* <hr/> */}
          </form>
        </div>
      </div>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <img className="logoimg" alt="Active" src={advPics} />
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>

    
  );
}

export default LoginPage;
function dispatch(arg0: { payload: any; type: "permissions/setPermissions" }) {
  throw new Error("Function not implemented.");
}
