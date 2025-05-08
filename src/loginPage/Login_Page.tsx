import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, Box, CircularProgress, Dialog, DialogTitle, DialogContent, Autocomplete, DialogActions } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from "../utils/Url";
import logo from '../assets/images/logologin.jpg';
import "./index.css";
import LoginImg2 from "./loginImg3.jpg";
import { CandidateRegisterDrawer } from './CandidateRegisterDrawer';
import { CandidateActivateDrawer } from './CandidateActivateDrawer';
import { AddInstUser } from '../utils/AddInstUser';
import { InstActivateDrawer } from './InstActivateDrawer';
import { InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Particles from 'react-particles';
import { loadFull } from 'tsparticles';
import { useCallback } from 'react';
import { AccountCircle, Lock } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import '@fontsource/poppins'; // Add this import if not already
import {
    Typography, useTheme,
    Fade, styled, alpha
} from '@mui/material';

import "./index.css";

const StyledLoginContainer = styled(Grid)(({ theme }) => ({
    height: '100vh',
    display: 'flex',
    overflow: 'auto',
   // flexDirection: 'column',
    position: 'relative',
    background: `linear-gradient(
        146deg,
        ${theme.palette.common.white} 0%,
        ${theme.palette.grey[100]} 30%,
        ${theme.palette.grey[300]} 70%,
        ${theme.palette.primary.dark} 100%
    )`,
    '& > .MuiGrid-item': {
        height: '100%',
        minHeight: '100vh'
    }
}));

const FormContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: 440,
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        margin: theme.spacing(1),
        maxWidth: '95%'
    },
    background: `linear-gradient(
        145deg,
        rgba(129, 171, 199, 0.96) 0%,
        rgba(232, 240, 241, 0.92) 100%
    )`,
    borderRadius: theme.shape.borderRadius * 4,
    boxShadow: `
        0 8px 32px rgba(0, 0, 0, 0.1),
        inset 0 2px 4px rgba(255, 255, 255, 0.2)
    `,
    backdropFilter: 'blur(12px)',
    border: `1px solid ${theme.palette.grey[100]}`,
    position: 'relative',
    zIndex: 2,
    margin: theme.spacing(2),
    transition: theme.transitions.create(['transform', 'box-shadow'], {
        duration: theme.transitions.duration.standard
    }),
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `
            0 12px 40px rgba(0, 0, 0, 0.15),
            inset 0 2px 6px rgba(255, 255, 255, 0.3)
        `
    }
}));


const LoginButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    fontSize: '1rem',
    fontWeight: 600,
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: theme.shadows[2]
    }
}));

const Login_Page = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPackageDialog, setShowPackageDialog] = useState(false); // Renamed state for clarity
    const navigate = useNavigate();
    const [showInstRegister, setShowInstRegister] = useState(false); // Renamed state
    const [showInstActivate, setShowInstActivate] = useState(false); // Renamed state
    const [showCandidateRegister, setShowCandidateRegister] = useState(false); // Renamed state
    const [showCandidateActivate, setShowCandidateActivate] = useState(false); // Renamed state
    const [packageOptions, setPackageOptions] = useState<any>([]); // Use interface
    const [selectedPackage, setSelectedPackage] = useState<any>(null);

    const getUserPermission = async (userId: string, userTypeId: string, packageId: string) => {

        const orgID = "1";

        const collectData = {
            "userID": userId || "-2", // Default to "-2" if somehow null/undefined
            "orgID": orgID,
            "roleID": -1,
            "packageID": parseInt(packageId) || 1,
            "userTypeID": userTypeId,
            "portalTypeID": -1,
            "ipAddres": "",
            "type": 1
        };

        console.log("Fetching permissions with data:", collectData); // Debug log

        try {
            const res = await api.post(`Login/GetUserPermission`, collectData);
            if (res?.data?.data) {

                localStorage.setItem("userPermissions", JSON.stringify(res.data.data));

                return true;
            } else {
                console.error("Failed to get permissions:", res?.data?.mesg || "No permission data returned");
                toast.error(res?.data?.mesg || "Failed to load user permissions.");
                localStorage.removeItem("userPermissions");
                return false; // Indicate failure
            }
        } catch (error) {
            console.error("Error fetching permissions:", error);
            toast.error("An error occurred while fetching user permissions.");
            localStorage.removeItem("userPermissions");
            return false; // Indicate failure
        }
    };

    // --- Function to fetch available packages ---
    const getPackage = () => {
        // Assuming collegeID is fixed or retrieved from somewhere
        const collectData = {
            "collegeID": "1",
            "packageID": "-1",
            "type": "1"
        };

        api.post(`Login/GetPackage`, collectData)
            .then((res) => {
                if (res.data?.data) {
                    const arr: any = res.data.data.map((pkg: any) => ({
                        label: pkg["packageName"],
                        value: pkg["packageID"].toString(), // Ensure value is string
                    }));

                    setPackageOptions(arr);
                } else {
                    toast.error("Could not load package options.");
                    setPackageOptions([]);
                }
            })
            .catch(error => {
                console.error("Failed to fetch packages:", error);
                toast.error("Failed to load package options.");
                setPackageOptions([]);
            });
    };
    // --- Formik Setup ---
    const validationSchema = Yup.object({
        loginName: Yup.string().required("Username Required"),
        password: Yup.string().required("Password Required"),
    });

    const formik = useFormik({
        initialValues: {
            loginName: "",
            password: "",
            orgID: "-1", // These might not be needed if handled directly in API call
            packageID: "-1",
            token: "",
            type: "account" // This might be a fixed value for this login type
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            // Clear previous session/permission data before attempting login
            localStorage.removeItem("userPermissions");
            localStorage.removeItem("package");

            try {
                const loginPayload = {
                    loginName: values.loginName,
                    password: values.password,
                    orgID: "-1", // Or determine dynamically if needed
                    packageID: "-1", // Default for login request itself
                    token: "", // Token is usually received, not sent for login
                    type: "account"
                };
                const response = await api.post('Login/Login', loginPayload);

                if (response?.data?.verifiedUser) {
                    const userData = response.data.verifiedUser;
                    const listPackages = response.data.listPackages; // Available packages info (if needed)

                    // Store essential login data
                    localStorage.setItem("user", JSON.stringify(response.data)); // Store the whole login response
                    localStorage.setItem("userdata", JSON.stringify(listPackages)); // Maybe rename this later?
                    localStorage.setItem("useR_ID", JSON.stringify(userData.userID));
                    sessionStorage.setItem("token", JSON.stringify(userData.token)); // Use sessionStorage for token

                    const userId = userData.userID.toString();
                    const userTypeId = userData.userTypeID.toString();

                    if (userTypeId === '1') {
                        // UserType 1: Show package selection dialog
                        getPackage(); // Fetch packages for the dialog
                        setSelectedPackage(null); // Reset selection
                        setShowPackageDialog(true);
                        // Permissions will be fetched after package selection in handlePackageConfirmation
                    } else if (userTypeId === '11' || userTypeId === '21') {
                        // Other UserTypes: Fetch permissions with default packageID 1 and navigate
                        localStorage.setItem("package", JSON.stringify("1")); // Store default package
                        const permissionsFetched = await getUserPermission(userId, userTypeId, '1');
                        if (permissionsFetched) {
                            navigate("/home");
                        } else {

                            localStorage.removeItem("user");
                            sessionStorage.removeItem("token");
                            alert("Login aborted due to permission loading failure.");
                        }
                    }
                } else {
                    alert("Login failed: Invalid username or password.");
                }
            } catch (error: any) {
                console.error("Login failed:", error);

                if (error.response) {

                    alert(`Login Error: ${error.response.data?.mesg || 'Server error'}`);
                } else if (error.request) {

                    alert("Login Error: No response from server.");
                } else {

                    alert("Login Error: Could not send request.");
                }
            } finally {
                setLoading(false);
            }
        },
    });


    // --- Handler for Package Selection ---
    const handlePackageSelect = (event: any, newValue: any) => {
        setSelectedPackage(newValue);
    };

    // --- Handler for Package Confirmation ---
    const handlePackageConfirmation = async () => {
        if (selectedPackage) {
            setShowPackageDialog(false); // Close dialog first
            const storedUserId = localStorage.getItem("useR_ID");
            const storedUserResponse = localStorage.getItem("user");
            if (storedUserId && storedUserResponse) {
                try {
                    const userId = JSON.parse(storedUserId);
                    const userResponse = JSON.parse(storedUserResponse);
                    const userTypeId = userResponse?.verifiedUser?.userTypeID?.toString();

                    if (userId && userTypeId === '1') {
                        const packageId = selectedPackage.value;
                        localStorage.setItem("package", JSON.stringify(packageId)); // Store selected package ID

                        // Fetch permissions with the selected package ID
                        const permissionsFetched = await getUserPermission(userId, userTypeId, packageId);

                        if (permissionsFetched) {
                            // Navigate based on package *after* getting permissions
                            if (packageId === '2') {
                                navigate("/User/UserManagement");
                            } else {
                                navigate("/home");
                            }
                        } else {
                            // Handle permission fetch failure
                            toast.error("Could not load permissions for the selected package. Please try again.");

                            localStorage.removeItem("user");
                            sessionStorage.removeItem("token");
                            localStorage.removeItem("package");
                            localStorage.removeItem("useR_ID");
                        }
                    } else {
                        console.error("Error: User ID or Type mismatch during package confirmation.");
                        toast.error("Session error. Please log in again.");
                        // Clear potentially corrupted session
                        localStorage.clear();
                        sessionStorage.clear();
                        navigate("/"); // Redirect to login
                    }

                } catch (e) {
                    console.error("Error parsing user data from localStorage during package confirmation", e);
                    toast.error("Session data corrupted. Please log in again.");
                    localStorage.clear(); // Clear corrupted data
                    sessionStorage.clear();
                    navigate("/");
                }

            } else {
                toast.error("User session expired or not found. Please log in again.");
                localStorage.clear(); // Clear potentially partial session
                sessionStorage.clear();
                navigate("/"); // Redirect to login
            }

        } else {
            toast.warn("Please select a package."); // Should be handled by button disable state too
        }
    };

    return (
        <Box sx={{ height: '100vh', overflow: 'auto' }}>
        <StyledLoginContainer container>
            {/* Left Side - Image with Overlay */}
            <Grid item xs={false} md={7} sx={{
                position: 'relative',
                height: '100vh', // Ensure full viewport height
                background: `
        linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.05)),
        url(${LoginImg2})
    `,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                [useTheme().breakpoints.down('md')]: {
                    display: 'none'
                }
            }}>
                <Fade in timeout={1000}>
                    <Box sx={{
                        textAlign: 'center',
                        color: 'common.white',
                        p: 4
                    }}>
                        <Typography variant="h2" sx={{
                            mb: 2,
                            fontWeight: 700,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            Welcome to EHR
                        </Typography>
                        <Typography variant="h5" sx={{
                            opacity: 0.9,
                            fontWeight: 400
                        }}>
                            Illuminating Pathways, Ensuring Safety
                        </Typography>
                    </Box>
                </Fade>
            </Grid>

            {/* Right Side - Form */}
            <Grid item xs={12} md={5} sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: { xs: 1, md: 3 },
            minHeight: '100vh'
            }}>
                <FormContainer>
                    {/* import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles'; */}

                    <Box
                        sx={{
                            textAlign: 'center',
                            mb: { xs: 3, md: 5 },
                            animation: 'fadeIn 1s ease-in-out',
                            '@keyframes fadeIn': {
                                from: { opacity: 0, transform: 'translateY(-20px)' },
                                to: { opacity: 1, transform: 'translateY(0)' }
                            }
                        }}
                    >
                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                width: 'clamp(80px, 25vw, 120px)',
                                marginBottom: useTheme().spacing(2),
                                filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))',
                                transition: 'transform 0.5s ease',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.07)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />

                        <Typography
                            variant="h4"
                            sx={{
                                fontFamily: '"Space Grotesk", sans-serif',
                                fontWeight: 800,
                                mb: 1,
                                letterSpacing: '2px',
                                color: useTheme().palette.text.primary,
                                display: 'flex',

                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 1.5, // <-- added gap between letters and "Portal"
                                fontSize: { xs: '1.75rem', md: '2rem' },
                                transition: 'color 0.3s, transform 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.03)'
                                }
                            }}
                        >

                            <Box component="span" sx={{ color: useTheme().palette.text.primary, ml: 1.5 }}>
                                EHR Portal
                            </Box>
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                fontFamily: '"Rubik", sans-serif',
                                color: useTheme().palette.text.secondary,
                                fontWeight: 500,
                                fontSize: '1.1rem',
                                opacity: 0.85,
                                mt: 1,
                                transition: 'all 0.3s',
                                '&:hover': {
                                    color: 'primary.main',
                                    transform: 'scale(1.02)',
                                }
                            }}
                        >
                            Secure Access to Medical Records
                        </Typography>
                    </Box>


                    <form onSubmit={formik.handleSubmit}>


                        <TextField
                            fullWidth
                            id="loginName"
                            name="loginName"
                            placeholder="Username" // Show inside the box
                           // label="Username" // Optional for accessibility
                            value={formik.values.loginName}
                            onChange={(e) => {
                                formik.handleChange(e);
                                setLoginError('');
                            }}
                            onBlur={formik.handleBlur}
                            error={formik.touched.loginName && Boolean(formik.errors.loginName)}
                            helperText={formik.touched.loginName && formik.errors.loginName}
                            sx={{ mb: 3, background: "white", borderRadius: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                )
                            }}
                        />


                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            placeholder="Password" 
                           // label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={formik.values.password}
                            onChange={(e) => {
                                formik.handleChange(e);
                                setLoginError('');
                            }}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password) || !!loginError}
                            helperText={(formik.touched.password && formik.errors.password) || loginError}
                            sx={{ mb: 3, background: "white", borderRadius: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />


                        <LoginButton
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                            sx={{
                                mb: 2,
                                py: 1.5,
                                fontWeight: 'bold',
                                letterSpacing: '1px',
                                fontSize: '1rem',
                                backgroundColor: '#007bff',
                                boxShadow: '0 4px 20px rgba(0,123,255,0.3)',
                                transition: 'all 0.4s ease',
                                '&:hover': {
                                    backgroundColor: '#0056b3',
                                    boxShadow: '0 6px 24px rgba(0,123,255,0.5)',
                                    transform: 'scale(1.03)'
                                }
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <>
                                    Sign In
                                    <LoginIcon sx={{ transition: 'transform 0.3s ease' }} />
                                </>
                            )}
                        </LoginButton>


                        <Grid container spacing={1} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} sm={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => setShowCandidateRegister(true)}
                                    sx={{
                                        textTransform: 'none',
                                        py: { xs: 0.8, md: 1 },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1,
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover svg': {
                                            transform: 'scale(1.1)',
                                        }
                                    }}
                                >
                                    <PersonAddAltIcon sx={{ transition: 'transform 0.3s ease' }} />
                                    Register Patient
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="success"
                                    onClick={() => setShowInstRegister(true)}
                                    sx={{
                                        textTransform: 'none',
                                        py: { xs: 0.8, md: 1 },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1,
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover svg': {
                                            transform: 'scale(1.1)',
                                        }
                                    }}
                                >
                                    <VerifiedUserIcon sx={{ transition: 'transform 0.3s ease' }} />
                                    Patient Activation
                                </Button>
                            </Grid>
                        </Grid>

                    </form>
                </FormContainer>
            </Grid>

            {/* Package Selection Dialog */}
            <Dialog
                open={showPackageDialog}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        setShowPackageDialog(false);
                    }
                }}
                disableEscapeKeyDown
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        p: 3,
                        backdropFilter: 'blur(8px)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.4s ease-in-out',
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        color: useTheme().palette.primary.main,
                        mb: 1,
                    }}
                >
                    Select Your Package
                </DialogTitle>

                <DialogContent>
                    <Autocomplete
                        value={selectedPackage}
                        options={packageOptions}
                        fullWidth
                        size="small"
                        onChange={handlePackageSelect}
                        getOptionLabel={(option) => option.label || ''}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Available Packages"
                                variant="outlined"
                                sx={{
                                    mt: 1,
                                    '& .MuiInputBase-root': {
                                        borderRadius: 2,
                                    },
                                }}
                            />
                        )}
                        renderOption={(props, option) => (
                            <li
                                {...props}
                                style={{
                                    padding: '12px 16px',
                                    transition: 'all 0.3s ease',
                                    borderRadius: '8px',
                                    margin: '4px 0',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <Typography variant="body1" fontWeight={500}>
                                    {option.label}
                                </Typography>
                            </li>
                        )}
                    />
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={handlePackageConfirmation}
                        color="primary"
                        variant="contained"
                        fullWidth
                        disabled={!selectedPackage || selectedPackage.value === "-1"}
                        sx={{
                            borderRadius: 3,
                            fontWeight: 600,
                            py: 1.2,
                            transition: 'all 0.3s ease',
                            backgroundColor: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                                boxShadow: '0 0 12px rgba(33, 150, 243, 0.6)',
                                transform: 'scale(1.02)',
                            },
                        }}
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Other Drawers */}
            <CandidateRegisterDrawer
                open={showCandidateRegister}
                onClose={() => setShowCandidateRegister(false)}
            />
            <CandidateActivateDrawer
                open={showCandidateActivate}
                onClose={() => setShowCandidateActivate(false)}
            />
            <AddInstUser
                open={showInstRegister}
                onClose={() => setShowInstRegister(false)}
            />
            <InstActivateDrawer
                open={showInstActivate}
                onClose={() => setShowInstActivate(false)}
            />
        </StyledLoginContainer>
        </Box>

    );
};

export default Login_Page;