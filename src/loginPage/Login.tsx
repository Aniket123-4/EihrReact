import React, { useState } from 'react';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Card } from "@mui/material";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="http://www.multifacet-software.com/">
        MSSPL
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login() {


  const[userID,setUserID]=useState("");
  const[password,setPassword]=useState("");

  let navigate=useNavigate();
  const userIDHandler=(event:any)=>{
    setUserID(event.target.value);
  }
  const passwordHandler=(event:any)=>{
    setPassword(event.target.value)
  }

  const handleSubmit=(event:{preventDefault:()=>void;})=>{
    event.preventDefault();

    const collectData={
      userName:userID,
      password:password,
      collageID:"1",
      packageID:"1",
    }
    console.log(collectData)
    axios.post(`https://localhost:59928/api/Login/authentication`,collectData)
    .then(res=>{
      console.log(res.data)
      if(res.data.isSuccess){
        alert(res.data.msg)
        setUserID('');
        setPassword('');

        let path=`/components/layout/MainLayout`;
        navigate(path);
      }else{
        alert(res.data.msg)
      }

    })
  }



  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     email: data.get("email"),
  //     password: data.get("password"),
  //   });
  // };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={12}
            sx={{
              backgroundImage:
                "url(https://source.unsplash.com/random?wallpapers)",
              // backgroundImage: `url(${image1.jpg})`,
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* <Grid

              item
              height="85%"
              xs={12}
              sm={8}
              md={4}
              component={Paper}
              elevation={6}
              square
              style={{
                marginTop: "3%",
                marginLeft: "400px",

                // backgroundColor: "#E9FDEE",
                opacity:0.8,

                border: ".5px solid green",
              }}
            > */}
            <Card
              style={{
                width: "40%",
                // height: "70%",
                marginTop: "4%",
                marginLeft: "30%",
                padding: 25,
                // backgroundColor:'#E9FDEE',
                opacity:0.8,

                border: ".5px solid green",
              }}
              // component={Paper}
            >
              <Box
                sx={{
                  my: 4,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="#" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                  <Copyright sx={{ mt: 5 }} />
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
        {/* </Grid> */}
      </ThemeProvider>
    </>
  );
}
