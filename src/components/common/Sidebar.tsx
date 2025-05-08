import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Collapse,
  SwipeableDrawer,
  Breadcrumbs,
  Link,
  Autocomplete,
  InputAdornment,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl, // Added
  InputLabel, // Added
  Select,     // Added
  FormLabel,  // Added
  RadioGroup, // Added
  FormControlLabel, // Added
  Radio,      // Added
} from "@mui/material";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Folder as FolderIcon,
  SubdirectoryArrowRight,
  Search as SearchIcon,
  Close as CloseIcon,
  Brightness5,
  Brightness4,
  LocalHospital,
  Spa,
  AccountCircle,
  ExitToApp,
  Settings,
  Palette,
  TextFields as FontIcon, // Added icon for Font Settings
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";

import sideLogo from "../../assets/images/qq.png";
import trans from "../../assets/images/translation.png";
import { useTranslation } from "react-i18next";

// Import the theme CSS
import "./ThemeStyle.css"; // Make sure this file exists and potentially contains base font variable usage

const drawerWidth = 240;

// --- Styled Components (Keep existing ones) ---
const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    borderRight: "none",
    boxShadow: theme.shadows[2],
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    borderRight: "none",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`, // Slightly adjusted closed width
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    minHeight: '70px !important',
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBarStyled = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    background: 'var(--header-background)',
    color: 'var(--header-color)',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1), 0px 4px 5px 0px rgba(0,0,0,0.08), 0px 1px 10px 0px rgba(0,0,0,0.06)',
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerStyled = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    "& .MuiDrawer-paper": {
        backgroundColor: 'var(--drawer-background)',
        color: 'var(--drawer-color)',
        borderRight: 'none',
        ...(open ? openedMixin(theme) : closedMixin(theme)),
    },
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    minHeight: 48,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    justifyContent: "initial",
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    marginBottom: theme.spacing(0.5),
    borderRadius: '8px',
    margin: theme.spacing(0.5, 1.5),
    transition: 'background-color 0.3s ease, color 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(var(--drawer-color-rgb), 0.08)',
    },
    '&.Mui-selected': {
        backgroundColor: 'var(--header-background)',
        color: 'var(--header-color)',
        '& .MuiListItemIcon-root': {
            color: 'var(--header-color)',
        },
        '&:hover': {
            backgroundColor: 'var(--header-background)',
            opacity: 0.9,
        },
    },
}));

const StyledListItemIcon = styled(ListItemIcon)({
    minWidth: 0,
    justifyContent: "center",
    marginRight: '16px',
    color: 'inherit',
    transition: 'color 0.3s ease',
});

const StyledListItemText = styled(ListItemText)({
    opacity: 1,
    transition: 'opacity 0.3s ease',
    '& .MuiTypography-root': {
        fontWeight: 500,
        fontSize: '0.9rem',
    },
});

// --- Helper Functions (Keep existing ones) ---
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", icon: "🌅" };
    if (hour < 17) return { text: "Good Afternoon", icon: "🌞" };
    return { text: "Good Evening", icon: "🌜" };
}

function getInitials(name: string = ""): string {
    if (!name) return "U";
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .filter(char => /[a-zA-Z]/.test(char))
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

interface UserDetails {
    userName: string;
    userID: string;
    loginName: string;
    isVerify: boolean;
    initials: string;
}

const defaultUserDetails: UserDetails = {
    userName: "User",
    userID: "N/A",
    loginName: "N/A",
    isVerify: false,
    initials: "U"
};

// --- Font Settings Configuration ---
const availableFontFamilies = [
    'System Default', // Special case
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Nunito',
];

const fontSizes = [
    { label: 'Small', value: '0.875rem' }, // 14px if base is 16px
    { label: 'Medium', value: '1rem' },    // 16px
    { label: 'Large', value: '1.125rem' }, // 18px
];

const defaultFontFamily = 'System Default';
const defaultFontSize = '1rem'; // Medium

// --- Main Component ---
export default function MiniDrawer({ items = [] }: { items: any[] }) {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { i18n } = useTranslation();

    // --- State ---
    const [open, setOpen] = React.useState(true);
    const [profileDrawerOpen, setProfileDrawerOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openSubMenus, setOpenSubMenus] = React.useState<Record<number, boolean>>({});
    const [searchValue, setSearchValue] = React.useState("");
    const [isThemeDialogOpen, setIsThemeDialogOpen] = React.useState(false);
   
    const [userDetails, setUserDetails] = React.useState<UserDetails>(defaultUserDetails);
    const [currentDate, setCurrentDate] = React.useState(new Date());

    // Theme State
    const themes = React.useMemo(() => [
        { name: "light-theme", icon: <Brightness5 />, label: "Light" },
        { name: "dark-theme", icon: <Brightness4 />, label: "Dark" },
        { name: "medical-blue-theme", icon: <LocalHospital />, label: "Medical Blue" },
        { name: "calm-green-theme", icon: <Spa />, label: "Calm Green" },
    ], []);
    const [selectedTheme, setSelectedTheme] = React.useState(() => {
        return localStorage.getItem("theme") || themes[0].name;
    });

    // Font State
   

    // --- Language ---
    const changeLanguage = (language: any) => {
        i18n.changeLanguage(language);
        localStorage.setItem("preferredLanguage", language);
    };
    var currentLanguage = localStorage.getItem("preferredLanguage");
    var newLanguage = currentLanguage === "hi" ? "English" : "हिंदी";


    // --- Effects ---

    // Apply Theme
    React.useEffect(() => {
        document.body.className = selectedTheme;
        localStorage.setItem("theme", selectedTheme);
        // Set CSS variables for RGBA conversion (keep existing logic)
        const bodyStyles = window.getComputedStyle(document.body);
        const drawerColor = bodyStyles.getPropertyValue('--drawer-color').trim();
        let drawerColorRgb = '0, 0, 0';
        // ... (keep the existing RGBA conversion logic for drawerColor)
        if (drawerColor.startsWith('#')) { // Simplified example
            const bigint = parseInt(drawerColor.substring(1), 16);
            drawerColorRgb = `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
        } else if (drawerColor.startsWith('rgb')) {
            const match = drawerColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
            if (match) drawerColorRgb = `${match[1]}, ${match[2]}, ${match[3]}`;
        }
        document.documentElement.style.setProperty('--drawer-color-rgb', drawerColorRgb);

        const headerColor = bodyStyles.getPropertyValue('--header-color').trim();
        let headerColorRgb = '255, 255, 255';
        // ... (keep the existing RGBA conversion logic for headerColor)
        if (headerColor.startsWith('#')) { // Simplified example
            const bigint = parseInt(headerColor.substring(1), 16);
            headerColorRgb = `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
        } else if (headerColor.startsWith('rgb')) {
            const match = headerColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
            if (match) headerColorRgb = `${match[1]}, ${match[2]}, ${match[3]}`;
        }
        document.documentElement.style.setProperty('--header-color-rgb', headerColorRgb);

    }, [selectedTheme]);

   
    // Date/Time ticker
    React.useEffect(() => {
        const timer = setInterval(() => setCurrentDate(new Date()), 1000 * 60);
        return () => clearInterval(timer);
    }, []);

    // User Details Load
    React.useEffect(() => {
        const storedUserData = localStorage.getItem("user");
        if (storedUserData) {
            try {
                const userData = JSON.parse(storedUserData);
                const user = userData?.verifiedUser
                    || (Array.isArray(userData) && userData[0]?.userdetail && userData[0]?.userdetail[0])
                    || userData?.user
                    || {};

                const firstName = user.firsT_NAME || user.firstName || user.givenName || user.userName || "";
                const middleName = user.middlE_NAME || user.middleName || "";
                const surname = user.suR_NAME || user.surname || user.lastName || "";
                const fullName = [firstName, middleName, surname].filter(Boolean).join(' ');

                setUserDetails({
                    userName: fullName || user.userName || "User",
                    userID: user.userID || user.userId || user.id || "N/A",
                    loginName: user.loginName || user.email || user.username || "N/A",
                    isVerify: user.isVerify === "Y" || user.isVerify === true,
                    initials: getInitials(firstName || fullName || user.userName)
                });
            } catch (error) {
                console.error("Failed to parse user data:", error);
                setUserDetails(defaultUserDetails);
            }
        } else {
            setUserDetails(defaultUserDetails);
        }
    }, []);

    // --- Handlers ---

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleProfileDrawerToggle = () => setProfileDrawerOpen(!profileDrawerOpen);

    const handleSubMenuToggle = (index: number) => {
        setOpenSubMenus(prev => {
            const isCurrentlyOpen = !!prev[index];
            return isCurrentlyOpen ? {} : { [index]: true };
        });
        if (!open) {
            setOpen(true);
        }
    };

    const handleNavigation = (path: string) => {
        if (path && path !== "#") {
            navigate(path);
            handleMenuClose();
        } else {
            console.warn("Navigation attempt with invalid path:", path);
        }
    };

    const handleMyProfileClick = () => {
        handleProfileDrawerToggle();
        handleMenuClose();
    };

    const handleUpdateProfileClick = () => {
        navigate('/Candidate/CandidateEdit'); // *** Replace with your actual edit profile route ***
        handleMenuClose();
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("theme");
        localStorage.removeItem("fontFamily"); // <-- Clear font settings on logout
        localStorage.removeItem("fontSize");   // <-- Clear font settings on logout
        sessionStorage.clear();
        navigate("/");
        window.location.reload(); // Force reload to reset styles completely if needed
    };

    // Theme Dialog Handlers
    const handleThemeDialogOpen = () => {
        setIsThemeDialogOpen(true);
        handleMenuClose();
    };
    const handleThemeDialogClose = () => setIsThemeDialogOpen(false);
    const handleThemeChange = (themeName: string) => {
        setSelectedTheme(themeName);
        handleThemeDialogClose();
    };

    // Font Dialog Handlers <-- New Handlers
  


    const handleAutocompleteChange = (event: any, value: string | null) => {
        if (!value) return;
        const foundItem = allMenuItems.find(item => item.label === value);
        if (foundItem?.path) {
            handleNavigation(foundItem.path);
            setSearchValue("");
        } else {
            console.log("No path found for:", value);
        }
    };

    // --- Data Preparation (Keep existing) ---
    const greeting = getGreeting();
    const formattedDate = dayjs(currentDate).format("ddd, D MMM YYYY");
    const formattedTime = dayjs(currentDate).format("h:mm A");

    const allMenuItems = React.useMemo(() => {
        const menuList: { label: string; path: string }[] = [];
        const processItem = (item: any) => {
            if (item.name && item.path && item.path !== "#") {
                menuList.push({ label: item.name, path: item.path });
            }
            if (item.items) {
                item.items.forEach(processItem);
            }
        };
        items.forEach(processItem);
        return menuList;
    }, [items]);

    const filteredDrawerItems = React.useMemo(() => {
        if (!searchValue) return items;
        const lowerSearch = searchValue.toLowerCase();
        const filterItems = (itemList: any[]): any[] => {
            return itemList.map(item => {
                const itemMatches = item.name?.toLowerCase().includes(lowerSearch);
                if (itemMatches) return item;
                if (item.items) {
                    const filteredChildren = filterItems(item.items);
                    if (filteredChildren.length > 0) {
                        return { ...item, items: filteredChildren };
                    }
                }
                return null;
            }).filter(item => item !== null);
        };
        return filterItems(items);
    }, [items, searchValue]);

    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbLinks = pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const displayValue = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
        return { name: displayValue, path: to };
    });

    // --- Render Logic ---
    const isMenuActive = (path: string) => location.pathname === path;
    const isSubMenuActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <Box sx={{ display: "flex", height: '100vh', backgroundColor: 'var(--main-background)' }}>
            {/* === AppBar === */}
            <AppBarStyled position="fixed" open={open}>
                <Toolbar sx={{ minHeight: '64px !important' }}>
                    {/* ... (AppBar content remains the same) */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: "none" }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {!open && (
                        <img src={sideLogo} width={40} height={40} alt="Logo Small" style={{ marginLeft: '5px', marginRight: '10px' }} />
                    )}
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
                        Hospital Portal {/* <--- CHANGE TITLE HERE */}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ display: { xs: 'none', md: 'block' }, mr: 1.5, fontSize: '0.9rem' }}>
                            {userDetails.userName}
                        </Typography>
                        <IconButton
                            onClick={handleMenuOpen}
                            size="small"
                            sx={{ ml: 1 }}
                            aria-controls={anchorEl ? "account-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={anchorEl ? "true" : undefined}
                        >
                            <Avatar sx={{ width: 40, height: 40, bgcolor: 'var(--header-background1)', color: 'var(--header-color)', fontWeight: 'bold' }}>
                                {userDetails.initials}
                            </Avatar>
                        </IconButton>
                    </Box>
                </Toolbar>

                {/* Secondary Bar (remains the same) */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 0.5,
                        px: { xs: 1.5, sm: 2.5 },
                        background: 'var(--header-background1)',
                        color: 'var(--header-color)',
                        minHeight: '36px',
                        borderBottomLeftRadius: open ? 0 : '12px',
                        borderBottomRightRadius: '12px',
                        transition: 'border-radius 0.3s ease',
                        boxShadow: 'inset 0px 1px 3px rgba(0,0,0,0.1)',
                    }}
                >
                     <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{
                        fontSize: '0.85rem',
                        '& .MuiBreadcrumbs-separator': { mx: 0.5, color: 'rgba(var(--header-color-rgb, 255, 255, 255), 0.7)' },
                        '& a, & p': { color: 'var(--header-color)', textDecoration: 'none', display: 'flex', alignItems: 'center' },
                        '& a:hover': { opacity: 0.8 },
                        '& a': { cursor: 'pointer' }
                    }}>
                        <Link onClick={() => handleNavigation('/home')} sx={{ display: 'flex', alignItems: 'center' }}>
                            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                            Home
                        </Link>
                        {breadcrumbLinks.map((link, index) => {
                            const isLast = index === breadcrumbLinks.length - 1;
                            return isLast ? (
                                <Typography key={link.path} sx={{ color: 'inherit', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                                    {link.name}
                                </Typography>
                            ) : (
                                <Link key={link.path} onClick={() => handleNavigation(link.path)} sx={{ display: 'flex', alignItems: 'center' }}>
                                    {link.name}
                                </Link>
                            );
                        })}
                    </Breadcrumbs>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        <Typography variant="caption" sx={{ display: { xs: 'none', md: 'inline' }, color: 'inherit', fontWeight: 'bold' }}>
                            {greeting.icon} {greeting.text}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'inherit' }}>{formattedTime}</Typography>
                        <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'inline' }, color: 'inherit' }}>{formattedDate}</Typography>
                    </Box>
                </Box>

                {/* User Profile Menu - Updated */}
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose} // Keep this to close on item click if needed, or remove specific item onClickstopPropagation
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: "visible", filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.2))", mt: 1.5,
                            bgcolor: 'var(--menu-background)', color: 'var(--menu-color)', borderRadius: '8px', minWidth: '200px',
                            '& .MuiMenuItem-root': {
                                fontSize: '0.9rem', padding: '8px 16px',
                                '& .MuiListItemIcon-root': { minWidth: '36px', color: 'inherit' },
                                '&:hover': { backgroundColor: 'rgba(var(--drawer-color-rgb), 0.06)' }
                            },
                            "&::before": { content: '""', display: "block", position: "absolute", top: 0, right: 14, width: 10, height: 10, bgcolor: "var(--menu-background)", transform: "translateY(-50%) rotate(45deg)", zIndex: 0 },
                        },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                    <MenuItem onClick={handleMyProfileClick}>
                        <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
                        Profile
                    </MenuItem>
                    <MenuItem onClick={handleUpdateProfileClick}>
                        <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                        Update Profile
                    </MenuItem>
                    <MenuItem onClick={handleThemeDialogOpen}>
                        <ListItemIcon><Palette fontSize="small" /></ListItemIcon>
                        Change Theme
                    </MenuItem>
                  
                     {/* --- End New Font Settings Menu Item --- */}
                     <MenuItem
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent menu close if needed
                            localStorage.getItem("preferredLanguage") == "hi"
                                ? changeLanguage("en")
                                : changeLanguage("hi");
                            handleMenuClose(); // Explicitly close after action
                        }}
                    >
                        <ListItemIcon>
                            <img src={trans} width={30} height={30} alt="Translate" />
                        </ListItemIcon>
                        Translate -- {newLanguage}
                    </MenuItem>
                    <Divider sx={{ my: 0.5, bgcolor: 'var(--divider-background)' }} />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.dark' }}>
                        <ListItemIcon><ExitToApp fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </AppBarStyled>

            {/* === Drawer (remains the same) === */}
            <DrawerStyled variant="permanent" open={open}>
                <DrawerHeader>
                    {open && (
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
                            <img src={sideLogo} alt="Logo Large" style={{ maxHeight: '50px', objectFit: 'contain' }} />
                        </Box>
                    )}
                    <IconButton onClick={handleDrawerClose} sx={{ color: 'var(--drawer-color)', '&:hover': { opacity: 0.8 } }}>
                        {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>

                <Divider sx={{ bgcolor: 'var(--divider-background)', opacity: 0.5 }} />

                {/* Search (only when open) */}
                {open && (
                    <Box sx={{ p: 1.5 }}>
                        <Autocomplete
                            freeSolo
                            fullWidth
                            size="small"
                            options={allMenuItems.map((option) => option.label)}
                            value={searchValue}
                            onInputChange={(event, newInputValue) => setSearchValue(newInputValue || "")}
                            onChange={handleAutocompleteChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Search Menu..."
                                    variant="outlined"
                                     sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px', backgroundColor: 'rgba(var(--drawer-color-rgb), 0.05)',
                                            '& fieldset': { borderColor: 'rgba(var(--drawer-color-rgb), 0.1)' },
                                            '&:hover fieldset': { borderColor: 'rgba(var(--drawer-color-rgb), 0.3)' },
                                            '&.Mui-focused fieldset': { borderColor: 'var(--header-background)' },
                                        },
                                        '& .MuiInputBase-input': { color: 'var(--drawer-color)', fontSize: '0.9rem' },
                                        '& .MuiInputAdornment-root': { color: 'var(--drawer-color)', opacity: 0.7 }
                                    }}
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (<InputAdornment position="start"> <SearchIcon fontSize="small" /> </InputAdornment>),
                                        endAdornment: (
                                            <>
                                                {searchValue && (<IconButton aria-label="clear search" onClick={() => setSearchValue("")} edge="end" size="small" sx={{ color: 'var(--drawer-color)', opacity: 0.7 }}> <CloseIcon fontSize="small" /> </IconButton>)}
                                                {params.InputProps.endAdornment}
                                            </>
                                        )
                                    }}
                                />
                            )}
                        />
                    </Box>
                )}

                {/* Navigation List (remains the same) */}
                <List sx={{ padding: 0, overflowY: 'auto', overflowX: 'hidden', flexGrow: 1 }}>
                     {/* Home Item */}
                    <StyledListItemButton
                        key="home"
                        selected={isMenuActive('/home')}
                        onClick={() => handleNavigation('/home')}
                        sx={{ ...(open ? {} : { px: 2.5, justifyContent: 'center' }) }}
                        title={open ? "" : "Home"}
                    >
                        <StyledListItemIcon sx={{ ...(open ? {} : { mr: 'auto' }) }}>
                            <HomeIcon />
                        </StyledListItemIcon>
                        <StyledListItemText primary="Home" sx={{ opacity: open ? 1 : 0 }} />
                    </StyledListItemButton>

                    {/* Dynamic Menu Items */}
                    {filteredDrawerItems.map((item: any, index: number) => {
                         const itemKey = item.id || item.name || `item-${index}`;
                         const hasSubItems = item.items && item.items.length > 0;

                         return (
                            <React.Fragment key={itemKey}>
                                {hasSubItems ? (
                                    <>
                                        <StyledListItemButton
                                            onClick={() => handleSubMenuToggle(index)}
                                            sx={{ ...(open ? {} : { px: 2.5, justifyContent: 'center' }) }}
                                            selected={!!openSubMenus[index] || (!Object.keys(openSubMenus).length && item.items.some((subItem: any) => isSubMenuActive(subItem.path)))}
                                            title={open ? "" : item.name}
                                        >
                                            <StyledListItemIcon sx={{ ...(open ? {} : { mr: 'auto' }) }}>
                                                <FolderIcon />
                                            </StyledListItemIcon>
                                            <StyledListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
                                            {open && (openSubMenus[index] ? <ExpandLessIcon sx={{ ml: 1, opacity: 0.7 }} /> : <ExpandMoreIcon sx={{ ml: 1, opacity: 0.7 }} />)}
                                        </StyledListItemButton>

                                        <Collapse in={open && !!openSubMenus[index]} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding sx={{ pl: open ? 2 : 0 }}>
                                                {item.items.map((subItem: any, subIndex: number) => {
                                                    const subItemKey = subItem.id || subItem.name || `subitem-${itemKey}-${subIndex}`;
                                                    return (
                                                        <StyledListItemButton
                                                            key={subItemKey}
                                                            selected={isSubMenuActive(subItem.path)}
                                                            onClick={() => handleNavigation(subItem.path)}
                                                            sx={{ pl: open ? 4 : 2.5 }} // Indent submenu
                                                            title={open ? "" : subItem.name}
                                                        >
                                                            <StyledListItemIcon sx={{ minWidth: '20px', mr: open ? 1.5 : 'auto', opacity: 0.8 }}>
                                                                <SubdirectoryArrowRight sx={{ fontSize: '1.1rem' }} />
                                                            </StyledListItemIcon>
                                                            <StyledListItemText
                                                                primary={subItem.name}
                                                                sx={{
                                                                    opacity: open ? 1 : 0,
                                                                    '& .MuiTypography-root': { fontSize: '0.85rem', fontWeight: 400 }
                                                                }}
                                                            />
                                                        </StyledListItemButton>
                                                    )
                                                })}
                                            </List>
                                        </Collapse>
                                    </>
                                ) : (
                                    <StyledListItemButton
                                        key={itemKey}
                                        selected={isMenuActive(item.path)}
                                        onClick={() => handleNavigation(item.path)}
                                        sx={{ ...(open ? {} : { px: 2.5, justifyContent: 'center' }) }}
                                        title={open ? "" : item.name}
                                    >
                                        <StyledListItemIcon sx={{ ...(open ? {} : { mr: 'auto' }) }}>
                                            <FolderIcon />
                                        </StyledListItemIcon>
                                        <StyledListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
                                    </StyledListItemButton>
                                )}
                            </React.Fragment>
                        )
                    })}
                </List>
            </DrawerStyled>

            {/* === Theme Selection Dialog (remains the same) === */}
            <Dialog open={isThemeDialogOpen} onClose={handleThemeDialogClose} PaperProps={{ sx: { bgcolor: 'var(--menu-background)', color: 'var(--menu-color)' } }}>
                <DialogTitle sx={{ borderBottom: '1px solid var(--divider-background)' }}>Select Theme</DialogTitle>
                <DialogContent sx={{ pt: '20px !important', minWidth: '300px' }}>
                    <List>
                        {themes.map((themeOption) => (
                            <ListItem disablePadding key={themeOption.name}>
                                <ListItemButton
                                    onClick={() => handleThemeChange(themeOption.name)}
                                    selected={selectedTheme === themeOption.name}
                                    sx={{ borderRadius: '6px', mb: 0.5, '&.Mui-selected': { backgroundColor: 'rgba(var(--drawer-color-rgb), 0.1)' }, '&:hover': { backgroundColor: 'rgba(var(--drawer-color-rgb), 0.05)' } }}
                                >
                                    <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}>{themeOption.icon}</ListItemIcon>
                                    <ListItemText primary={themeOption.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions sx={{ borderTop: '1px solid var(--divider-background)', p: '12px 24px' }}>
                    <Button onClick={handleThemeDialogClose} sx={{ color: 'inherit' }}>Cancel</Button>
                </DialogActions>
            </Dialog>

        

            {/* === Profile Drawer (remains the same) === */}
            <SwipeableDrawer
                anchor="left"
                open={profileDrawerOpen}
                onClose={handleProfileDrawerToggle}
                onOpen={handleProfileDrawerToggle}
                PaperProps={{ sx: { width: { xs: '80%', sm: drawerWidth + 60 }, bgcolor: 'var(--drawer-background)', color: 'var(--drawer-color)', boxShadow: theme.shadows[5], borderLeft: 'none' } }}
                ModalProps={{ keepMounted: true }}
                sx={{ zIndex: theme.zIndex.drawer + 2 }}
            >
               <Box sx={{ width: '100%' }} role="presentation">
                    <Toolbar sx={{ justifyContent: 'space-between', bgcolor: 'var(--header-background)', color: 'var(--header-color)' }}>
                        <Typography variant="h6">User Profile</Typography>
                        <IconButton onClick={handleProfileDrawerToggle} sx={{ color: 'inherit' }}> <CloseIcon /> </IconButton>
                    </Toolbar>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, bgcolor: 'var(--header-background1)', color: 'var(--header-color)' }}>
                        <Avatar sx={{ width: 80, height: 80, mb: 2, fontSize: '2.5rem', bgcolor: 'var(--header-background)' }}> {userDetails.initials} </Avatar>
                        <Typography variant="h6" textAlign="center">{userDetails.userName}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }} textAlign="center">{userDetails.loginName}</Typography>
                    </Box>
                    <Card variant="outlined" sx={{ margin: 2, backgroundColor: 'var(--menu-background)', color: 'var(--menu-color)', border: '1px solid var(--divider-background)' }}>
                        <CardHeader title="Details" sx={{ pb: 0, '& .MuiTypography-root': { fontWeight: 'bold', fontSize: '1rem' } }} />
                        <CardContent>
                            <Box sx={{ mb: 1.5 }}>
                                <Typography variant="body2" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>User ID:</Typography>
                                <Typography variant="body2" component="div">{userDetails.userID}</Typography>
                            </Box>
                            <Divider sx={{ my: 1, bgcolor: 'var(--divider-background)' }} />
                            <Box>
                                <Typography variant="body2" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>Verified:</Typography>
                                <Typography variant="body2" component="div">{userDetails.isVerify ? 'Yes ✅' : 'No ❌'}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </SwipeableDrawer>

        </Box>
    );
}