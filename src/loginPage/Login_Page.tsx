// import React, { useState } from 'react';
// import { 
//     Button, Box, Typography, styled, CircularProgress, 
//     TextField, InputAdornment, IconButton, Divider
// } from '@mui/material';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//     AccountCircle, Lock, Visibility, VisibilityOff, 
//     CheckCircle, ArrowForwardIos, PersonAddAlt1, VerifiedUser 
// } from '@mui/icons-material';

// import api from "../utils/Url";
// import logo from '../assets/images/hospital_LOGO.png';

// // Import Drawers (As per your original file)
// import { CandidateRegisterDrawer } from './CandidateRegisterDrawer';
// import { AddInstUser } from '../utils/AddInstUser';

// // --- Styled Components (Premium Mesh & Glass) ---

// const MainContainer = styled(Box)({
//     height: '100vh',
//     width: '100vw',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     background: `radial-gradient(at 0% 0%, hsla(210,100%,93%,1) 0, transparent 50%), 
//                 radial-gradient(at 50% 0%, hsla(225,100%,85%,1) 0, transparent 50%), 
//                 radial-gradient(at 100% 0%, hsla(339,100%,85%,1) 0, transparent 50%), 
//                 radial-gradient(at 50% 100%, hsla(208,100%,90%,1) 0, transparent 50%)`,
//     backgroundColor: '#f8fafc',
//     overflow: 'hidden',
//     position: 'relative'
// });

// const GlassCard = styled(motion.div)(({ theme }) => ({
//     background: 'rgba(255, 255, 255, 0.8)',
//     backdropFilter: 'blur(30px)',
//     borderRadius: '40px',
//     border: '1px solid rgba(255, 255, 255, 0.6)',
//     boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.12)',
//     padding: '50px 40px',
//     width: '100%',
//     maxWidth: '480px',
//     textAlign: 'center',
//     zIndex: 10
// }));

// const PackageGrid = styled(Box)({
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
//     gap: '25px',
//     width: '100%',
//     maxWidth: '750px',
//     marginTop: '40px'
// });

// const PackageOption = styled(motion.div)(({ selected }) => ({
//     padding: '35px 25px',
//     borderRadius: '30px',
//     cursor: 'pointer',
//     background: selected 
//         ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' 
//         : 'rgba(255, 255, 255, 0.7)',
//     color: selected ? '#ffffff' : '#1e293b',
//     border: selected ? '2px solid #2563eb' : '2px solid transparent',
//     boxShadow: selected ? '0 20px 35px -5px rgba(37, 99, 235, 0.3)' : '0 8px 15px -3px rgba(0, 0, 0, 0.05)',
//     transition: 'all 0.4s ease',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '15px'
// }));

// const PrimaryButton = styled(Button)({
//     borderRadius: '20px',
//     padding: '16px',
//     fontSize: '1.1rem',
//     fontWeight: 700,
//     textTransform: 'none',
//     background: 'linear-gradient(90deg, #1e293b 0%, #334155 100%)',
//     color: '#fff',
//     '&:hover': { transform: 'translateY(-2px)', background: '#0f172a' }
// });

// const SecondaryAction = styled(Button)({
//     borderRadius: '15px',
//     padding: '12px',
//     fontSize: '0.9rem',
//     fontWeight: 600,
//     textTransform: 'none',
//     color: '#475569',
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     border: '1px solid rgba(0, 0, 0, 0.05)',
//     '&:hover': { backgroundColor: '#fff', transform: 'translateY(-1px)' }
// });

// const Login_Page = () => {
//     const navigate = useNavigate();
//     const [view, setView] = useState('login'); // 'login' or 'package'
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
    
//     // Package & Drawers State
//     const [packageOptions, setPackageOptions] = useState([]);
//     const [selectedPackage, setSelectedPackage] = useState(null);
//     const [showCandidateRegister, setShowCandidateRegister] = useState(false);
//     const [showInstRegister, setShowInstRegister] = useState(false);

//     // --- LOGIC: Restore Original getUserPermission ---
//     const getUserPermission = async (userId, userTypeId, packageId) => {
//         const collectData = {
//             "userID": userId || "-2",
//             "orgID": "1",
//             "roleID": -1,
//             "packageID": parseInt(packageId) || 1,
//             "userTypeID": userTypeId,
//             "portalTypeID": -1,
//             "ipAddres": "",
//             "type": 1
//         };
//         try {
//             const res = await api.post(`Login/GetUserPermission`, collectData);
//             if (res?.data?.data) {
//                 localStorage.setItem("userPermissions", JSON.stringify(res.data.data));
//                 return true;
//             }
//             return false;
//         } catch (error) {
//             toast.error("Failed to fetch permissions.");
//             return false;
//         }
//     };

//     const getPackage = () => {
//         api.post(`Login/GetPackage`, { "collegeID": "1", "packageID": "-1", "type": "1" })
//             .then((res) => {
//                 if (res.data?.data) {
//                     setPackageOptions(res.data.data.map(p => ({ label: p.packageName, value: p.packageID.toString() })));
//                 }
//             });
//     };

//     const formik = useFormik({
//         initialValues: { loginName: "", password: "" },
//         validationSchema: Yup.object({
//             loginName: Yup.string().required("Username required"),
//             password: Yup.string().required("Password required"),
//         }),
//    onSubmit: async (values) => {
//     setLoading(true);
//     try {
//         const response = await api.post('Login/Login', { 
//             ...values, 
//             orgID: "-1", 
//             packageID: "-1", 
//             type: "account" ,
//             token:""
//         });

//         const data = response?.data;

//         // ✅ SUCCESS CASE
//         if (data?.verifiedUser?.isVerify === true) {

//              const userData = data.verifiedUser;
//     localStorage.setItem("verifiedUser", JSON.stringify(userData));  // ✅ Add this line            // keep old for compatibility

//             localStorage.setItem("user", JSON.stringify(data));
//             localStorage.setItem("useR_ID", userData.userID.toString());
//             sessionStorage.setItem("token", JSON.stringify(userData.token));

//             if (userData.userTypeID.toString() === '1') {
//                 getPackage();
//                 setView('package');
//             } else {
//                 const ok = await getUserPermission(
//                     userData.userID.toString(), 
//                     userData.userTypeID.toString(), 
//                     '1'
//                 );
//                 if (ok) navigate("/home");
//             }

//         } 
//         // ❌ INVALID LOGIN CASE
//         else {
//             toast.error(data?.msg || "Invalid credentials");
//         }

//     } catch (e) {
//         toast.error("Something went wrong. Please try again.");
//     } finally {
//         setLoading(false);
//     }
// }
//     });

//     const handlePackageConfirm = async () => {
//         if (!selectedPackage) return;
//         setLoading(true);
//         const userId = localStorage.getItem("useR_ID");
//         const user = JSON.parse(localStorage.getItem("user"));
//         const ok = await getUserPermission(userId, user.verifiedUser.userTypeID.toString(), selectedPackage.value);
//         if (ok) {
//             localStorage.setItem("package", JSON.stringify(selectedPackage.value));
//             navigate(selectedPackage.value === '2' ? "/User/UserManagement" : "/home");
//         }
//         setLoading(false);
//     };

//     return (
//         <MainContainer>
//             <ToastContainer/>
//             <AnimatePresence mode="wait">
//                 {view === 'login' ? (
//                     <GlassCard
//                         key="login"
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, scale: 0.95 }}
//                     >
//                         <Box sx={{ mb: 4 }}>
//                             <img src={logo} alt="Logo" style={{ width: '80px', borderRadius: '15px', marginBottom: '15px' }} />
//                             <Typography variant="h4" fontWeight={900} color="#0f172a">वैद्यराज मदन मोहन सिंह's</Typography>
//                             <Typography variant="body2" color="#64748b">Ayuroma Wellness Center
// (Since 1991)</Typography>
//                         </Box>

//                         <form onSubmit={formik.handleSubmit}>
//                            <TextField
//     fullWidth
//     name="loginName"
//     placeholder="Username"
//     value={formik.values.loginName}
//     onChange={formik.handleChange}
//     onBlur={formik.handleBlur}
//     error={formik.touched.loginName && Boolean(formik.errors.loginName)}
//     helperText={formik.touched.loginName && formik.errors.loginName}
//     sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '18px', bgcolor: '#fff' } }}
//     InputProps={{ startAdornment: <AccountCircle sx={{ mr: 1, color: '#94a3b8' }} /> }}
// />
//                            <TextField
//     fullWidth
//     name="password"
//     type={showPassword ? "text" : "password"}
//     placeholder="Password"
//     value={formik.values.password}
//     onChange={formik.handleChange}
//     onBlur={formik.handleBlur}
//     error={formik.touched.password && Boolean(formik.errors.password)}
//     helperText={formik.touched.password && formik.errors.password}
//     sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '18px', bgcolor: '#fff' } }}
//     InputProps={{
//         startAdornment: <Lock sx={{ mr: 1, color: '#94a3b8' }} />,
//         endAdornment: (
//             <IconButton onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <VisibilityOff /> : <Visibility />}
//             </IconButton>
//         )
//     }}
// />
//                             <PrimaryButton fullWidth type="submit" disabled={loading}>
//                                 {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
//                             </PrimaryButton>
//                         </form>

//                         <Divider sx={{ my: 4, color: '#cbd5e1', fontSize: '0.8rem' }}>QUICK ACTIONS</Divider>

//                         <Box sx={{ display: 'flex', gap: 2 }}>
//                             <SecondaryAction fullWidth onClick={() => setShowCandidateRegister(true)}>
//                                 <PersonAddAlt1 sx={{ mr: 1, fontSize: 20 }} /> Register
//                             </SecondaryAction>
//                             <SecondaryAction fullWidth onClick={() => setShowInstRegister(true)}>
//                                 <VerifiedUser sx={{ mr: 1, fontSize: 20 }} /> Activation
//                             </SecondaryAction>
//                         </Box>
//                     </GlassCard>
//                 ) : (
//                     <Box
//                         key="package"
//                         component={motion.div}
//                         initial={{ opacity: 0, scale: 0.8 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20 }}
//                     >
//                         <Typography variant="h2" fontWeight={900} color="#0f172a" textAlign="center">
//                             Select Workspace
//                         </Typography>
//                         <Typography variant="h6" color="#64748b" sx={{ mb: 4 }}>
//                             Which environment would you like to access today?
//                         </Typography>

//                         <PackageGrid>
//                             {packageOptions.map((pkg) => (
//                                 <PackageOption
//                                     key={pkg.value}
//                                     selected={selectedPackage?.value === pkg.value}
//                                     onClick={() => setSelectedPackage(pkg)}
//                                     whileHover={{ scale: 1.05, y: -5 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <Typography variant="h4" fontWeight={800}>{pkg.label}</Typography>
//                                     <Typography variant="body2" sx={{ opacity: 0.8 }}>Click to select this suite</Typography>
//                                     {selectedPackage?.value === pkg.value && <CheckCircle sx={{ mt: 1 }} />}
//                                 </PackageOption>
//                             ))}
//                         </PackageGrid>

//                         <PrimaryButton 
//                             onClick={handlePackageConfirm} 
//                             disabled={!selectedPackage || loading}
//                             sx={{ mt: 6, minWidth: '350px', background: 'linear-gradient(90deg, #2563eb, #7c3aed)' }}
//                         >
//                             {loading ? <CircularProgress size={26} color="inherit" /> : "Continue to Dashboard"}
//                         </PrimaryButton>
//                     </Box>
//                 )}
//             </AnimatePresence>

//             {/* Registration & Activation Drawers */}
//             <CandidateRegisterDrawer open={showCandidateRegister} onClose={() => setShowCandidateRegister(false)} />
//             <AddInstUser open={showInstRegister} onClose={() => setShowInstRegister(false)} />
//         </MainContainer>
//     );
// };

// export default Login_Page;




import React, { useState, useEffect, useRef } from 'react';
import { 
    Button, Box, Typography, styled, CircularProgress, 
    TextField, InputAdornment, IconButton, Divider, Fade
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AccountCircle, Lock, Visibility, VisibilityOff, 
    CheckCircle, PersonAddAlt1, VerifiedUser, 
    Healing, Spa, LocalHospital, Favorite
} from '@mui/icons-material';

import api from "../utils/Url";
import logo from '../assets/images/hospital_LOGO.png';
import { CandidateRegisterDrawer } from './CandidateRegisterDrawer';
import { AddInstUser } from '../utils/AddInstUser';

// ==================== PREMIUM STYLED COMPONENTS ====================

// Animated background with floating particles and moving gradients
const AnimatedBackground = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        width: '200%',
        height: '200%',
        top: '-50%',
        left: '-50%',
        background: `radial-gradient(circle at 20% 40%, rgba(120, 200, 255, 0.15) 0%, transparent 40%),
                    radial-gradient(circle at 80% 70%, rgba(100, 150, 255, 0.12) 0%, transparent 45%),
                    radial-gradient(circle at 40% 80%, rgba(180, 130, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 70% 20%, rgba(50, 180, 200, 0.08) 0%, transparent 55%)`,
        animation: 'floatGradient 20s ease-in-out infinite',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 800 800\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
        opacity: 0.4,
        pointerEvents: 'none',
    },
    '@keyframes floatGradient': {
        '0%': { transform: 'rotate(0deg) scale(1)' },
        '50%': { transform: 'rotate(5deg) scale(1.05)' },
        '100%': { transform: 'rotate(0deg) scale(1)' },
    },
});

// Floating particles (herbs/leaves/healing symbols)
const FloatingParticle = styled(motion.div)({
    position: 'absolute',
    fontSize: '24px',
    opacity: 0.15,
    pointerEvents: 'none',
    zIndex: 0,
});

const MainContainer = styled(Box)({
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #e8f4ff 0%, #f0e6ff 50%, #e6f7f0 100%)',
});

const GlassCard = styled(motion.div)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    borderRadius: '48px',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.3) inset',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center',
    zIndex: 10,
    position: 'relative',
    transition: 'all 0.3s ease',
}));

const PackageGrid = styled(Box)({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '28px',
    width: '100%',
    maxWidth: '800px',
    marginTop: '40px',
});

const PackageOption = styled(motion.div)(({ selected }) => ({
    padding: '40px 28px',
    borderRadius: '36px',
    cursor: 'pointer',
    background: selected 
        ? 'linear-gradient(135deg, #1e4b6e 0%, #2c7da0 50%, #3b9bc7 100%)' 
        : 'rgba(255, 255, 255, 0.75)',
    color: selected ? '#ffffff' : '#1a2c3e',
    border: selected ? '2px solid rgba(255,255,255,0.5)' : '2px solid rgba(255,255,255,0.3)',
    boxShadow: selected ? '0 25px 40px -12px rgba(28, 75, 110, 0.4), 0 0 0 1px rgba(255,255,255,0.2) inset' : '0 10px 20px -8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '18px',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 30px 50px -15px rgba(0, 0, 0, 0.2)',
    },
}));

const PrimaryButton = styled(Button)({
    borderRadius: '28px',
    padding: '14px 28px',
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    background: 'linear-gradient(90deg, #1e4b6e 0%, #2c7da0 100%)',
    color: '#fff',
    boxShadow: '0 8px 20px -6px rgba(28, 75, 110, 0.4)',
    '&:hover': { 
        transform: 'translateY(-2px)', 
        background: 'linear-gradient(90deg, #143d59 0%, #236b8e 100%)',
        boxShadow: '0 12px 25px -8px rgba(28, 75, 110, 0.5)',
    },
});

const SecondaryAction = styled(Button)({
    borderRadius: '20px',
    padding: '10px 16px',
    fontSize: '0.85rem',
    fontWeight: 600,
    textTransform: 'none',
    color: '#2c7da0',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid rgba(44, 125, 160, 0.2)',
    '&:hover': { 
        backgroundColor: '#fff', 
        transform: 'translateY(-2px)',
        borderColor: '#2c7da0',
    },
});

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        borderRadius: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        },
        '&.Mui-focused': {
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(44, 125, 160, 0.15)',
        }
    },
    '& .MuiInputLabel-root': {
        color: '#5a6e7c',
    }
});

// ==================== MAIN COMPONENT ====================

const Login_Page = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('login');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [particles, setParticles] = useState([]);
    
    const [packageOptions, setPackageOptions] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showCandidateRegister, setShowCandidateRegister] = useState(false);
    const [showInstRegister, setShowInstRegister] = useState(false);

    // Floating particles animation - healing symbols
    useEffect(() => {
        const icons = ['🌸', '🌿', '🍃', '💊', '🧘', '🕉️', '✨', '🌱', '🍀', '💚', '🫀', '🧠'];
        const newParticles = Array.from({ length: 24 }, (_, i) => ({
            id: i,
            icon: icons[i % icons.length],
            left: Math.random() * 100,
            top: Math.random() * 100,
            duration: 15 + Math.random() * 20,
            delay: Math.random() * 10,
            size: 20 + Math.random() * 30,
            opacity: 0.08 + Math.random() * 0.12,
        }));
        setParticles(newParticles);
    }, []);

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
                    type: "account",
                    token: ""
                });

                const data = response?.data;

                if (data?.verifiedUser?.isVerify === true) {
                    const userData = data.verifiedUser;
                    localStorage.setItem("verifiedUser", JSON.stringify(userData));
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
                } else {
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
            <AnimatedBackground />
            
            {/* Floating Healing Symbols */}
            {particles.map((part) => (
                <FloatingParticle
                    key={part.id}
                    initial={{ y: 0, x: 0, opacity: part.opacity, rotate: 0 }}
                    animate={{ 
                        y: [0, -30, 0, 30, 0],
                        x: [0, 20, -10, -20, 0],
                        rotate: [0, 15, -10, 20, 0],
                        opacity: [part.opacity, part.opacity * 1.5, part.opacity]
                    }}
                    transition={{
                        duration: part.duration,
                        delay: part.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        left: `${part.left}%`,
                        top: `${part.top}%`,
                        fontSize: `${part.size}px`,
                    }}
                >
                    {part.icon}
                </FloatingParticle>
            ))}

            <ToastContainer 
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            
            <AnimatePresence mode="wait">
                {view === 'login' ? (
                    <GlassCard
                        key="login"
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94, y: -20 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    >
                        {/* Decorative healing line */}
                        <Box sx={{ 
                            position: 'absolute', 
                            top: -15, 
                            left: '50%', 
                            transform: 'translateX(-50%)',
                            width: 80,
                            height: 30,
                            background: 'linear-gradient(90deg, transparent, #2c7da0, #3b9bc7, #2c7da0, transparent)',
                            borderRadius: '20px',
                            opacity: 0.6,
                        }} />
                        
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                        >
                            <Box sx={{ mb: 3, position: 'relative' }}>
                                <img 
                                    src={logo} 
                                    alt="Ayuroma Wellness" 
                                    style={{ 
                                        width: '85px', 
                                        borderRadius: '24px', 
                                        marginBottom: '20px',
                                        boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)',
                                        border: '2px solid rgba(255,255,255,0.8)'
                                    }} 
                                />
                                <Typography variant="h4" fontWeight={800} color="#1a2c3e" sx={{ letterSpacing: '-0.02em' }}>
                                    वैद्यराज मदन मोहन सिंह's
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                                    <Spa sx={{ color: '#2c7da0', fontSize: 18 }} />
                                    <Typography variant="body2" color="#5a6e7c" fontWeight={500}>
                                        Ayuroma Wellness Center • Since 1991
                                    </Typography>
                                    <LocalHospital sx={{ color: '#2c7da0', fontSize: 18 }} />
                                </Box>
                            </Box>
                        </motion.div>

                        <form onSubmit={formik.handleSubmit}>
                            <StyledTextField
                                fullWidth
                                name="loginName"
                                placeholder="Username / Email"
                                value={formik.values.loginName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.loginName && Boolean(formik.errors.loginName)}
                                helperText={formik.touched.loginName && formik.errors.loginName}
                                sx={{ mb: 2.5 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle sx={{ color: '#7a8e9e' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <StyledTextField
                                fullWidth
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                sx={{ mb: 3 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: '#7a8e9e' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff sx={{ color: '#7a8e9e' }} /> : <Visibility sx={{ color: '#7a8e9e' }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <PrimaryButton 
                                fullWidth 
                                type="submit" 
                                disabled={loading}
                                sx={{ py: 1.5 }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Healing /> Sign In to Wellness Portal
                                    </Box>
                                )}
                            </PrimaryButton>
                        </form>

                        <Divider sx={{ my: 4, color: '#b0c4dE', '&::before, &::after': { borderColor: '#cbdbe0' } }}>
                            <Typography variant="caption" sx={{ color: '#7a8e9e', fontWeight: 500 }}>QUICK ACCESS</Typography>
                        </Divider>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <SecondaryAction fullWidth onClick={() => setShowCandidateRegister(true)}>
                                <PersonAddAlt1 sx={{ mr: 1, fontSize: 18 }} /> New Patient
                            </SecondaryAction>
                            <SecondaryAction fullWidth onClick={() => setShowInstRegister(true)}>
                                <VerifiedUser sx={{ mr: 1, fontSize: 18 }} /> Patient Activation
                            </SecondaryAction>
                        </Box>
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Typography variant="caption" sx={{ display: 'block', mt: 3, color: '#8ea0ae' }}>
                                <Favorite sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                                Secure & HIPAA Compliant
                            </Typography>
                        </motion.div>
                    </GlassCard>
                ) : (
                    <Box
                        key="package"
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.92, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.4, type: "spring" }}
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20, px: 3 }}
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Typography variant="h2" fontWeight={800} color="#1a2c3e" textAlign="center" sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}>
                                Select Your Care Suite
                            </Typography>
                            <Typography variant="h6" color="#5a6e7c" sx={{ mb: 4, textAlign: 'center', fontWeight: 400 }}>
                                Choose the healing environment that matches your practice
                            </Typography>
                        </motion.div>

                        <PackageGrid>
                            {packageOptions.map((pkg, idx) => (
                                <PackageOption
                                    key={pkg.value}
                                    selected={selectedPackage?.value === pkg.value}
                                    onClick={() => setSelectedPackage(pkg)}
                                    whileHover={{ scale: 1.03, y: -6 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.08 }}
                                >
                                    <motion.div
                                        animate={{ 
                                            scale: selectedPackage?.value === pkg.value ? [1, 1.1, 1] : 1,
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {selectedPackage?.value === pkg.value ? 
                                            <Healing sx={{ fontSize: 48, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} /> : 
                                            <Spa sx={{ fontSize: 44, opacity: 0.7 }} />
                                        }
                                    </motion.div>
                                    <Typography variant="h4" fontWeight={700}>{pkg.label}</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.85, textAlign: 'center' }}>
                                       {pkg.label === 'eIEHR'
  ? 'Hospital workflow & patient treatment management'
  : pkg.label === 'eIEHRUser'
  ? 'User management, roles & system administration'
  : pkg.label === 'Ayurveda'
  ? 'Traditional healing & wellness'
  : pkg.label === 'Wellness'
  ? 'Holistic health programs'
  : 'Advanced therapeutic care'}
                                    </Typography>
                                    {selectedPackage?.value === pkg.value && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                        >
                                            <CheckCircle sx={{ mt: 1, fontSize: 28 }} />
                                        </motion.div>
                                    )}
                                </PackageOption>
                            ))}
                        </PackageGrid>

                        <PrimaryButton 
                            onClick={handlePackageConfirm} 
                            disabled={!selectedPackage || loading}
                            sx={{ mt: 6, minWidth: '300px', py: 1.5, fontSize: '1.1rem' }}
                        >
                            {loading ? <CircularProgress size={26} color="inherit" /> : (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Enter Dashboard <Healing sx={{ fontSize: 20 }} />
                                </Box>
                            )}
                        </PrimaryButton>
                        
                        <motion.button
                            onClick={() => setView('login')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#2c7da0',
                                marginTop: '24px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                textDecoration: 'underline',
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            ← Back to Login
                        </motion.button>
                    </Box>
                )}
            </AnimatePresence>

            <CandidateRegisterDrawer open={showCandidateRegister} onClose={() => setShowCandidateRegister(false)} />
            <AddInstUser open={showInstRegister} onClose={() => setShowInstRegister(false)} />
        </MainContainer>
    );
};

export default Login_Page;