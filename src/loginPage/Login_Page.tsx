import React, { useState } from 'react';
import { 
    Button, Box, Typography, styled, CircularProgress, 
    TextField, InputAdornment, IconButton, Divider
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AccountCircle, Lock, Visibility, VisibilityOff, 
    CheckCircle, ArrowForwardIos, PersonAddAlt1, VerifiedUser 
} from '@mui/icons-material';

import api from "../utils/Url";
import logo from '../assets/images/logologin.jpg';

// Import Drawers (As per your original file)
import { CandidateRegisterDrawer } from './CandidateRegisterDrawer';
import { AddInstUser } from '../utils/AddInstUser';

// --- Styled Components (Premium Mesh & Glass) ---

const MainContainer = styled(Box)({
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `radial-gradient(at 0% 0%, hsla(210,100%,93%,1) 0, transparent 50%), 
                radial-gradient(at 50% 0%, hsla(225,100%,85%,1) 0, transparent 50%), 
                radial-gradient(at 100% 0%, hsla(339,100%,85%,1) 0, transparent 50%), 
                radial-gradient(at 50% 100%, hsla(208,100%,90%,1) 0, transparent 50%)`,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
    position: 'relative'
});

const GlassCard = styled(motion.div)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(30px)',
    borderRadius: '40px',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.12)',
    padding: '50px 40px',
    width: '100%',
    maxWidth: '480px',
    textAlign: 'center',
    zIndex: 10
}));

const PackageGrid = styled(Box)({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '25px',
    width: '100%',
    maxWidth: '750px',
    marginTop: '40px'
});

const PackageOption = styled(motion.div)(({ selected }) => ({
    padding: '35px 25px',
    borderRadius: '30px',
    cursor: 'pointer',
    background: selected 
        ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' 
        : 'rgba(255, 255, 255, 0.7)',
    color: selected ? '#ffffff' : '#1e293b',
    border: selected ? '2px solid #2563eb' : '2px solid transparent',
    boxShadow: selected ? '0 20px 35px -5px rgba(37, 99, 235, 0.3)' : '0 8px 15px -3px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.4s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px'
}));

const PrimaryButton = styled(Button)({
    borderRadius: '20px',
    padding: '16px',
    fontSize: '1.1rem',
    fontWeight: 700,
    textTransform: 'none',
    background: 'linear-gradient(90deg, #1e293b 0%, #334155 100%)',
    color: '#fff',
    '&:hover': { transform: 'translateY(-2px)', background: '#0f172a' }
});

const SecondaryAction = styled(Button)({
    borderRadius: '15px',
    padding: '12px',
    fontSize: '0.9rem',
    fontWeight: 600,
    textTransform: 'none',
    color: '#475569',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    '&:hover': { backgroundColor: '#fff', transform: 'translateY(-1px)' }
});

const Login_Page = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('login'); // 'login' or 'package'
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // Package & Drawers State
    const [packageOptions, setPackageOptions] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showCandidateRegister, setShowCandidateRegister] = useState(false);
    const [showInstRegister, setShowInstRegister] = useState(false);

    // --- LOGIC: Restore Original getUserPermission ---
    const getUserPermission = async (userId, userTypeId, packageId) => {
        const collectData = {
            "userID": userId || "-2",
            "orgID": "1",
            "roleID": -1,
            "packageID": parseInt(packageId) || 1,
            "userTypeID": userTypeId,
            "portalTypeID": -1,
            "ipAddres": "",
            "type": 1
        };
        try {
            const res = await api.post(`Login/GetUserPermission`, collectData);
            if (res?.data?.data) {
                localStorage.setItem("userPermissions", JSON.stringify(res.data.data));
                return true;
            }
            return false;
        } catch (error) {
            toast.error("Failed to fetch permissions.");
            return false;
        }
    };

    const getPackage = () => {
        api.post(`Login/GetPackage`, { "collegeID": "1", "packageID": "-1", "type": "1" })
            .then((res) => {
                if (res.data?.data) {
                    setPackageOptions(res.data.data.map(p => ({ label: p.packageName, value: p.packageID.toString() })));
                }
            });
    };

    const formik = useFormik({
        initialValues: { loginName: "", password: "" },
        validationSchema: Yup.object({
            loginName: Yup.string().required("Username required"),
            password: Yup.string().required("Password required"),
        }),
   onSubmit: async (values) => {
    setLoading(true);
    try {
        const response = await api.post('Login/Login', { 
            ...values, 
            orgID: "-1", 
            packageID: "-1", 
            type: "account" 
        });

        const data = response?.data;

        // ✅ SUCCESS CASE
        if (data?.verifiedUser?.isVerify === true) {

            const userData = data.verifiedUser;

            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("useR_ID", userData.userID.toString());
            sessionStorage.setItem("token", JSON.stringify(userData.token));

            if (userData.userTypeID.toString() === '1') {
                getPackage();
                setView('package');
            } else {
                const ok = await getUserPermission(
                    userData.userID.toString(), 
                    userData.userTypeID.toString(), 
                    '1'
                );
                if (ok) navigate("/home");
            }

        } 
        // ❌ INVALID LOGIN CASE
        else {
            toast.error(data?.msg || "Invalid credentials");
        }

    } catch (e) {
        toast.error("Something went wrong. Please try again.");
    } finally {
        setLoading(false);
    }
}
    });

    const handlePackageConfirm = async () => {
        if (!selectedPackage) return;
        setLoading(true);
        const userId = localStorage.getItem("useR_ID");
        const user = JSON.parse(localStorage.getItem("user"));
        const ok = await getUserPermission(userId, user.verifiedUser.userTypeID.toString(), selectedPackage.value);
        if (ok) {
            localStorage.setItem("package", JSON.stringify(selectedPackage.value));
            navigate(selectedPackage.value === '2' ? "/User/UserManagement" : "/home");
        }
        setLoading(false);
    };

    return (
        <MainContainer>
            <ToastContainer/>
            <AnimatePresence mode="wait">
                {view === 'login' ? (
                    <GlassCard
                        key="login"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <Box sx={{ mb: 4 }}>
                            <img src={logo} alt="Logo" style={{ width: '80px', borderRadius: '15px', marginBottom: '15px' }} />
                            <Typography variant="h4" fontWeight={900} color="#0f172a">EHR Portal</Typography>
                            <Typography variant="body2" color="#64748b">Welcome back! Please enter your details.</Typography>
                        </Box>

                        <form onSubmit={formik.handleSubmit}>
                           <TextField
    fullWidth
    name="loginName"
    placeholder="Username"
    value={formik.values.loginName}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={formik.touched.loginName && Boolean(formik.errors.loginName)}
    helperText={formik.touched.loginName && formik.errors.loginName}
    sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '18px', bgcolor: '#fff' } }}
    InputProps={{ startAdornment: <AccountCircle sx={{ mr: 1, color: '#94a3b8' }} /> }}
/>
                           <TextField
    fullWidth
    name="password"
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={formik.values.password}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={formik.touched.password && Boolean(formik.errors.password)}
    helperText={formik.touched.password && formik.errors.password}
    sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '18px', bgcolor: '#fff' } }}
    InputProps={{
        startAdornment: <Lock sx={{ mr: 1, color: '#94a3b8' }} />,
        endAdornment: (
            <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        )
    }}
/>
                            <PrimaryButton fullWidth type="submit" disabled={loading}>
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                            </PrimaryButton>
                        </form>

                        <Divider sx={{ my: 4, color: '#cbd5e1', fontSize: '0.8rem' }}>QUICK ACTIONS</Divider>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <SecondaryAction fullWidth onClick={() => setShowCandidateRegister(true)}>
                                <PersonAddAlt1 sx={{ mr: 1, fontSize: 20 }} /> Register
                            </SecondaryAction>
                            <SecondaryAction fullWidth onClick={() => setShowInstRegister(true)}>
                                <VerifiedUser sx={{ mr: 1, fontSize: 20 }} /> Activation
                            </SecondaryAction>
                        </Box>
                    </GlassCard>
                ) : (
                    <Box
                        key="package"
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20 }}
                    >
                        <Typography variant="h2" fontWeight={900} color="#0f172a" textAlign="center">
                            Select Workspace
                        </Typography>
                        <Typography variant="h6" color="#64748b" sx={{ mb: 4 }}>
                            Which environment would you like to access today?
                        </Typography>

                        <PackageGrid>
                            {packageOptions.map((pkg) => (
                                <PackageOption
                                    key={pkg.value}
                                    selected={selectedPackage?.value === pkg.value}
                                    onClick={() => setSelectedPackage(pkg)}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Typography variant="h4" fontWeight={800}>{pkg.label}</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Click to select this suite</Typography>
                                    {selectedPackage?.value === pkg.value && <CheckCircle sx={{ mt: 1 }} />}
                                </PackageOption>
                            ))}
                        </PackageGrid>

                        <PrimaryButton 
                            onClick={handlePackageConfirm} 
                            disabled={!selectedPackage || loading}
                            sx={{ mt: 6, minWidth: '350px', background: 'linear-gradient(90deg, #2563eb, #7c3aed)' }}
                        >
                            {loading ? <CircularProgress size={26} color="inherit" /> : "Continue to Dashboard"}
                        </PrimaryButton>
                    </Box>
                )}
            </AnimatePresence>

            {/* Registration & Activation Drawers */}
            <CandidateRegisterDrawer open={showCandidateRegister} onClose={() => setShowCandidateRegister(false)} />
            <AddInstUser open={showInstRegister} onClose={() => setShowInstRegister(false)} />
        </MainContainer>
    );
};

export default Login_Page;
