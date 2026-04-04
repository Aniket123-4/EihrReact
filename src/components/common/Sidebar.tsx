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

import sideLogo from "../../assets/images/logologin.jpg";
import trans from "../../assets/images/translation.png";
import { useTranslation } from "react-i18next";

// Import the theme CSS
import "./ThemeStyle.css"; // Make sure this file exists and potentially contains base font variable usage
import GlobalSearch from "./GlobalSearch";

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

                     <GlobalSearch />
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












// import * as React from "react";
// import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
// import {
//   Box,
//   Drawer as MuiDrawer,
//   AppBar as MuiAppBar,
//   Toolbar,
//   List,
//   Typography,
//   Divider,
//   IconButton,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Avatar,
//   Menu,
//   MenuItem,
//   Collapse,
//   SwipeableDrawer,
//   Breadcrumbs,
//   Link,
//   Autocomplete,
//   InputAdornment,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   FormControl,
//   InputLabel,
//   Select,
//   FormLabel,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   alpha,
//   Stack,
//   Tooltip,
//   Badge,
//   useMediaQuery,
// } from "@mui/material";
// import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
// import {
//   Menu as MenuIcon,
//   ChevronLeft as ChevronLeftIcon,
//   ChevronRight as ChevronRightIcon,
//   Home as HomeIcon,
//   ExpandMore as ExpandMoreIcon,
//   ExpandLess as ExpandLessIcon,
//   Folder as FolderIcon,
//   SubdirectoryArrowRight,
//   Search as SearchIcon,
//   Close as CloseIcon,
//   Brightness5,
//   Brightness4,
//   LocalHospital,
//   Spa,
//   AccountCircle,
//   ExitToApp,
//   Settings,
//   Palette,
//   TextFields as FontIcon,
//   Dashboard as DashboardIcon,
//   KeyboardArrowRight as KeyboardArrowRightIcon,
//   NotificationsNone as NotificationsIcon,
//   SupportAgent as SupportIcon,
// } from "@mui/icons-material";
// import { useNavigate, useLocation } from "react-router-dom";
// import dayjs from "dayjs";

// import sideLogo from "../../assets/images/logologin.jpg";
// import trans from "../../assets/images/translation.png";
// import { useTranslation } from "react-i18next";

// // Import the theme CSS
// import "./ThemeStyle.css";
// import GlobalSearch from "./GlobalSearch";

// const drawerWidth = 280;
// const miniDrawerWidth = 80;

// // --- Premium Styled Components ---
// const openedMixin = (theme: Theme): CSSObject => ({
//   width: drawerWidth,
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.easeOut,
//     duration: theme.transitions.duration.enteringScreen,
//   }),
//   overflowX: "hidden",
//   background: "linear-gradient(180deg, var(--drawer-background) 0%, rgba(var(--drawer-color-rgb), 0.02) 100%)",
//   borderRight: "1px solid rgba(var(--drawer-color-rgb), 0.08)",
//   boxShadow: "none",
// });

// const closedMixin = (theme: Theme): CSSObject => ({
//   transition: theme.transitions.create("width", {
//     easing: theme.transitions.easing.easeOut,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   overflowX: "hidden",
//   borderRight: "1px solid rgba(var(--drawer-color-rgb), 0.08)",
//   width: miniDrawerWidth,
//   background: "linear-gradient(180deg, var(--drawer-background) 0%, rgba(var(--drawer-color-rgb), 0.02) 100%)",
// });

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   padding: theme.spacing(2, 2),
//   minHeight: "72px !important",
//   borderBottom: "1px solid rgba(var(--drawer-color-rgb), 0.08)",
//   marginBottom: theme.spacing(1),
// }));

// interface AppBarProps extends MuiAppBarProps {
//   open?: boolean;
// }

// const AppBarStyled = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })<AppBarProps>(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(["width", "margin"], {
//     easing: theme.transitions.easing.easeOut,
//     duration: theme.transitions.duration.enteringScreen,
//   }),
//   background: "var(--header-background)",
//   color: "var(--header-color)",
//   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
//   backdropFilter: "blur(0px)",
//   borderBottom: "1px solid rgba(var(--header-color-rgb), 0.1)",
//   ...(open && {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
//   ...(!open && {
//     marginLeft: miniDrawerWidth,
//     width: `calc(100% - ${miniDrawerWidth}px)`,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//   }),
// }));

// const DrawerStyled = styled(MuiDrawer, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   width: open ? drawerWidth : miniDrawerWidth,
//   flexShrink: 0,
//   whiteSpace: "nowrap",
//   boxSizing: "border-box",
//   "& .MuiDrawer-paper": {
//     background: "linear-gradient(180deg, var(--drawer-background) 0%, rgba(var(--drawer-color-rgb), 0.02) 100%)",
//     color: "var(--drawer-color)",
//     borderRight: "1px solid rgba(var(--drawer-color-rgb), 0.08)",
//     overflowX: "hidden",
//     ...(open ? openedMixin(theme) : closedMixin(theme)),
//   },
// }));

// // Premium List Item Button
// const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
//   minHeight: 44,
//   borderRadius: "12px",
//   margin: "4px 12px",
//   padding: "8px 16px",
//   justifyContent: "flex-start",
//   gap: "14px",
//   transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
//   position: "relative",
  
//   "&::before": {
//     content: '""',
//     position: "absolute",
//     left: 0,
//     top: "50%",
//     transform: "translateY(-50%)",
//     width: "3px",
//     height: "0px",
//     backgroundColor: "var(--primary-color)",
//     borderRadius: "0 4px 4px 0",
//     transition: "height 0.2s ease",
//   },
  
//   "&:hover": {
//     backgroundColor: alpha(theme.palette.common.white, 0.08),
//     transform: "translateX(4px)",
//   },
  
//   "&.Mui-selected": {
//     backgroundColor: alpha(theme.palette.common.white, 0.12),
//     color: "var(--primary-color)",
//     "&::before": {
//       height: "24px",
//     },
//     "& .MuiListItemIcon-root": {
//       color: "var(--primary-color)",
//     },
//     "&:hover": {
//       backgroundColor: alpha(theme.palette.common.white, 0.16),
//     },
//   },
// }));

// const StyledListItemIcon = styled(ListItemIcon)({
//   minWidth: 0,
//   justifyContent: "center",
//   marginRight: "16px",
//   color: "inherit",
//   opacity: 0.7,
//   transition: "all 0.2s ease",
// });

// const StyledListItemText = styled(ListItemText)({
//   opacity: 1,
//   transition: "opacity 0.2s ease",
//   "& .MuiTypography-root": {
//     fontWeight: 500,
//     fontSize: "0.875rem",
//     letterSpacing: "0.2px",
//   },
// });

// // Logo Container
// const LogoContainer = styled(Box)({
//   display: "flex",
//   alignItems: "center",
//   gap: "12px",
//   "& img": {
//     transition: "transform 0.2s ease",
//     borderRadius: "12px",
//   },
//   "&:hover img": {
//     transform: "scale(1.05)",
//   },
// });

// // --- Helper Functions ---
// function getGreeting() {
//   const hour = new Date().getHours();
//   if (hour < 12) return { text: "Good Morning", icon: "🌅" };
//   if (hour < 17) return { text: "Good Afternoon", icon: "🌞" };
//   return { text: "Good Evening", icon: "🌜" };
// }

// function getInitials(name: string = ""): string {
//   if (!name) return "U";
//   return name
//     .split(" ")
//     .map(word => word.charAt(0))
//     .filter(char => /[a-zA-Z]/.test(char))
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();
// }

// interface UserDetails {
//   userName: string;
//   userID: string;
//   loginName: string;
//   isVerify: boolean;
//   initials: string;
// }

// const defaultUserDetails: UserDetails = {
//   userName: "User",
//   userID: "N/A",
//   loginName: "N/A",
//   isVerify: false,
//   initials: "U",
// };

// // --- Font Settings Configuration ---
// const availableFontFamilies = [
//   "System Default",
//   "Roboto",
//   "Open Sans",
//   "Lato",
//   "Montserrat",
//   "Nunito",
// ];

// const fontSizes = [
//   { label: "Small", value: "0.875rem" },
//   { label: "Medium", value: "1rem" },
//   { label: "Large", value: "1.125rem" },
// ];

// const defaultFontFamily = "System Default";
// const defaultFontSize = "1rem";

// // Premium Theme Colors
// const themes = [
//   { name: "light-theme", icon: <Brightness5 />, label: "Light", primary: "#10b981" },
//   { name: "dark-theme", icon: <Brightness4 />, label: "Dark", primary: "#34d399" },
//   { name: "medical-blue-theme", icon: <LocalHospital />, label: "Medical Blue", primary: "#3b82f6" },
//   { name: "calm-green-theme", icon: <Spa />, label: "Calm Green", primary: "#059669" },
// ];

// // --- Main Component ---
// export default function MiniDrawer({ items = [] }: { items: any[] }) {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { i18n } = useTranslation();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

//   // --- State ---
//   const [open, setOpen] = React.useState(!isMobile);
//   const [profileDrawerOpen, setProfileDrawerOpen] = React.useState(false);
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const [notifAnchorEl, setNotifAnchorEl] = React.useState<null | HTMLElement>(null);
//   const [openSubMenus, setOpenSubMenus] = React.useState<Record<number, boolean>>({});
//   const [searchValue, setSearchValue] = React.useState("");
//   const [isThemeDialogOpen, setIsThemeDialogOpen] = React.useState(false);
//   const [isFontDialogOpen, setIsFontDialogOpen] = React.useState(false);
//   const [userDetails, setUserDetails] = React.useState<UserDetails>(defaultUserDetails);
//   const [currentDate, setCurrentDate] = React.useState(new Date());

//   // Theme State
//   const [selectedTheme, setSelectedTheme] = React.useState(() => {
//     return localStorage.getItem("theme") || themes[0].name;
//   });

//   // Font State
//   const [selectedFontFamily, setSelectedFontFamily] = React.useState(() => {
//     return localStorage.getItem("fontFamily") || defaultFontFamily;
//   });
//   const [selectedFontSize, setSelectedFontSize] = React.useState(() => {
//     return localStorage.getItem("fontSize") || defaultFontSize;
//   });

//   // --- Language ---
//   const changeLanguage = (language: any) => {
//     i18n.changeLanguage(language);
//     localStorage.setItem("preferredLanguage", language);
//   };
//   const currentLanguage = localStorage.getItem("preferredLanguage");
//   const newLanguage = currentLanguage === "hi" ? "English" : "हिंदी";

//   // --- Effects ---

//   // Handle mobile responsiveness
//   React.useEffect(() => {
//     if (isMobile) {
//       setOpen(false);
//     } else if (isTablet) {
//       setOpen(false);
//     } else {
//       setOpen(true);
//     }
//   }, [isMobile, isTablet]);

//   // Apply Theme
//   React.useEffect(() => {
//     document.body.className = selectedTheme;
//     localStorage.setItem("theme", selectedTheme);
    
//     // Set primary color based on theme
//     const selected = themes.find(t => t.name === selectedTheme);
//     if (selected) {
//       document.documentElement.style.setProperty("--primary-color", selected.primary);
//     }
    
//     const bodyStyles = window.getComputedStyle(document.body);
//     const drawerColor = bodyStyles.getPropertyValue("--drawer-color").trim();
//     let drawerColorRgb = "0, 0, 0";
//     if (drawerColor.startsWith("#")) {
//       const bigint = parseInt(drawerColor.substring(1), 16);
//       drawerColorRgb = `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
//     } else if (drawerColor.startsWith("rgb")) {
//       const match = drawerColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
//       if (match) drawerColorRgb = `${match[1]}, ${match[2]}, ${match[3]}`;
//     }
//     document.documentElement.style.setProperty("--drawer-color-rgb", drawerColorRgb);

//     const headerColor = bodyStyles.getPropertyValue("--header-color").trim();
//     let headerColorRgb = "255, 255, 255";
//     if (headerColor.startsWith("#")) {
//       const bigint = parseInt(headerColor.substring(1), 16);
//       headerColorRgb = `${(bigint >> 16) & 255}, ${(bigint >> 8) & 255}, ${bigint & 255}`;
//     } else if (headerColor.startsWith("rgb")) {
//       const match = headerColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
//       if (match) headerColorRgb = `${match[1]}, ${match[2]}, ${match[3]}`;
//     }
//     document.documentElement.style.setProperty("--header-color-rgb", headerColorRgb);
//   }, [selectedTheme]);

//   // Apply Font Settings
//   React.useEffect(() => {
//     document.documentElement.style.setProperty("--app-font-family", selectedFontFamily === "System Default" ? "inherit" : selectedFontFamily);
//     document.documentElement.style.setProperty("--app-font-size", selectedFontSize);
//     localStorage.setItem("fontFamily", selectedFontFamily);
//     localStorage.setItem("fontSize", selectedFontSize);
//   }, [selectedFontFamily, selectedFontSize]);

//   // Date/Time ticker
//   React.useEffect(() => {
//     const timer = setInterval(() => setCurrentDate(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // User Details Load
//   React.useEffect(() => {
//     const storedUserData = localStorage.getItem("user");
//     if (storedUserData) {
//       try {
//         const userData = JSON.parse(storedUserData);
//         const user = userData?.verifiedUser
//           || (Array.isArray(userData) && userData[0]?.userdetail && userData[0]?.userdetail[0])
//           || userData?.user
//           || {};

//         const firstName = user.firsT_NAME || user.firstName || user.givenName || user.userName || "";
//         const middleName = user.middlE_NAME || user.middleName || "";
//         const surname = user.suR_NAME || user.surname || user.lastName || "";
//         const fullName = [firstName, middleName, surname].filter(Boolean).join(" ");

//         setUserDetails({
//           userName: fullName || user.userName || "User",
//           userID: user.userID || user.userId || user.id || "N/A",
//           loginName: user.loginName || user.email || user.username || "N/A",
//           isVerify: user.isVerify === "Y" || user.isVerify === true,
//           initials: getInitials(firstName || fullName || user.userName)
//         });
//       } catch (error) {
//         console.error("Failed to parse user data:", error);
//         setUserDetails(defaultUserDetails);
//       }
//     } else {
//       setUserDetails(defaultUserDetails);
//     }
//   }, []);

//   // --- Handlers ---
//   const handleDrawerOpen = () => setOpen(true);
//   const handleDrawerClose = () => setOpen(false);
//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);
//   const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => setNotifAnchorEl(event.currentTarget);
//   const handleNotifClose = () => setNotifAnchorEl(null);
//   const handleProfileDrawerToggle = () => setProfileDrawerOpen(!profileDrawerOpen);

//   const handleSubMenuToggle = (index: number) => {
//     setOpenSubMenus(prev => {
//       const isCurrentlyOpen = !!prev[index];
//       return isCurrentlyOpen ? {} : { [index]: true };
//     });
//     if (!open) {
//       setOpen(true);
//     }
//   };

//   const handleNavigation = (path: string) => {
//     if (path && path !== "#") {
//       navigate(path);
//       handleMenuClose();
//       if (isMobile) {
//         setOpen(false);
//       }
//     } else {
//       console.warn("Navigation attempt with invalid path:", path);
//     }
//   };

//   const handleMyProfileClick = () => {
//     handleProfileDrawerToggle();
//     handleMenuClose();
//   };

//   const handleUpdateProfileClick = () => {
//     navigate("/Candidate/CandidateEdit");
//     handleMenuClose();
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("theme");
//     localStorage.removeItem("fontFamily");
//     localStorage.removeItem("fontSize");
//     sessionStorage.clear();
//     navigate("/");
//     window.location.reload();
//   };

//   // Theme Dialog Handlers
//   const handleThemeDialogOpen = () => {
//     setIsThemeDialogOpen(true);
//     handleMenuClose();
//   };
//   const handleThemeDialogClose = () => setIsThemeDialogOpen(false);
//   const handleThemeChange = (themeName: string) => {
//     setSelectedTheme(themeName);
//     handleThemeDialogClose();
//   };

//   // Font Dialog Handlers
//   const handleFontDialogOpen = () => {
//     setIsFontDialogOpen(true);
//     handleMenuClose();
//   };
//   const handleFontDialogClose = () => setIsFontDialogOpen(false);

//   const handleAutocompleteChange = (event: any, value: string | null) => {
//     if (!value) return;
//     const foundItem = allMenuItems.find(item => item.label === value);
//     if (foundItem?.path) {
//       handleNavigation(foundItem.path);
//       setSearchValue("");
//     } else {
//       console.log("No path found for:", value);
//     }
//   };

//   // --- Data Preparation ---
//   const greeting = getGreeting();
//   const formattedDate = dayjs(currentDate).format("dddd, MMMM D, YYYY");
//   const formattedTime = dayjs(currentDate).format("hh:mm:ss A");
//   const shortDate = dayjs(currentDate).format("MMM D");

//   const allMenuItems = React.useMemo(() => {
//     const menuList: { label: string; path: string }[] = [];
//     const processItem = (item: any) => {
//       if (item.name && item.path && item.path !== "#") {
//         menuList.push({ label: item.name, path: item.path });
//       }
//       if (item.items) {
//         item.items.forEach(processItem);
//       }
//     };
//     items.forEach(processItem);
//     return menuList;
//   }, [items]);

//   const filteredDrawerItems = React.useMemo(() => {
//     if (!searchValue) return items;
//     const lowerSearch = searchValue.toLowerCase();
//     const filterItems = (itemList: any[]): any[] => {
//       return itemList.map(item => {
//         const itemMatches = item.name?.toLowerCase().includes(lowerSearch);
//         if (itemMatches) return item;
//         if (item.items) {
//           const filteredChildren = filterItems(item.items);
//           if (filteredChildren.length > 0) {
//             return { ...item, items: filteredChildren };
//           }
//         }
//         return null;
//       }).filter(item => item !== null);
//     };
//     return filterItems(items);
//   }, [items, searchValue]);

//   const pathnames = location.pathname.split("/").filter((x) => x);
//   const breadcrumbLinks = pathnames.map((value, index) => {
//     const to = `/${pathnames.slice(0, index + 1).join("/")}`;
//     const displayValue = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");
//     return { name: displayValue, path: to };
//   });

//   // --- Render Logic ---
//   const isMenuActive = (path: string) => location.pathname === path;
//   const isSubMenuActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

//   return (
//     <Box sx={{ 
//       display: "flex", 
//       height: "100vh", 
//       backgroundColor: "var(--main-background)",
//       fontFamily: "var(--app-font-family)",
//       fontSize: "var(--app-font-size)",
//     }}>
//       {/* === Premium AppBar === */}
//       <AppBarStyled position="fixed" open={open}>
//         <Toolbar sx={{ minHeight: "64px !important", px: { xs: 2, sm: 3 } }}>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             onClick={handleDrawerOpen}
            
//             edge="start"
//             sx={{ 
//               mr: 2, 
//               ...(open && { display: "none" }),
//               "&:hover": { transform: "scale(1.1)" },
//               transition: "transform 0.2s ease",
//             }}
//           >
//             {/* <MenuIcon /> */}
//           </IconButton>
          
//           {!open && (
//             <img 
//               src={sideLogo} 
//               width={36} 
//               height={36} 
//               alt="Logo" 
//               style={{ marginRight: "10px", borderRadius: "10px" }} 
//             />
//           )}
          
//           <Typography 
//             variant="h6" 
//             noWrap 
//             component="div" 
//             sx={{ 
//               flexGrow: 1, 
//               fontWeight: 700, 
//               display: { xs: "none", sm: "block" },
//               background: "linear-gradient(135deg, var(--header-color) 0%, rgba(var(--header-color-rgb), 0.8) 100%)",
//               backgroundClip: "text",
//               WebkitBackgroundClip: "text",
//               color: "transparent",
//             }}
//           >
//             Hospital Portal
//           </Typography>

//           <GlobalSearch />
          
//           <Stack direction="row" spacing={1} alignItems="center">
//             <Tooltip title="Notifications" arrow>
//               <IconButton onClick={handleNotifOpen} sx={{ color: "inherit" }}>
//                 <Badge badgeContent={3} color="error" sx={{ "& .MuiBadge-badge": { backgroundColor: "#f44336" } }}>
//                   <NotificationsIcon />
//                 </Badge>
//               </IconButton>
//             </Tooltip>

//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               <Typography sx={{ display: { xs: "none", md: "block" }, mr: 1.5, fontSize: "0.875rem", fontWeight: 500 }}>
//                 {userDetails.userName}
//               </Typography>
//               <IconButton
//                 onClick={handleMenuOpen}
//                 size="small"
//                 sx={{ 
//                   ml: 1,
//                   "&:hover": { transform: "scale(1.05)" },
//                   transition: "transform 0.2s ease",
//                 }}
//               >
//                 <Avatar 
//                   sx={{ 
//                     width: 40, 
//                     height: 40, 
//                     bgcolor: "var(--primary-color)", 
//                     color: "#fff", 
//                     fontWeight: "bold",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//                   }}
//                 >
//                   {userDetails.initials}
//                 </Avatar>
//               </IconButton>
//             </Box>
//           </Stack>
//         </Toolbar>

//         {/* Premium Secondary Bar */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             py: 0.8,
//             px: { xs: 2, sm: 3 },
//             background: "rgba(var(--header-color-rgb), 0.05)",
//             borderTop: "1px solid rgba(var(--header-color-rgb), 0.1)",
//           }}
//         >
//           <Breadcrumbs 
//             aria-label="breadcrumb" 
//             separator={<KeyboardArrowRightIcon fontSize="small" sx={{ opacity: 0.5 }} />}
//             sx={{
//               fontSize: "0.8125rem",
//               "& .MuiBreadcrumbs-separator": { mx: 0.5 },
//               "& a, & p": { 
//                 color: "var(--header-color)", 
//                 textDecoration: "none", 
//                 display: "flex", 
//                 alignItems: "center",
//                 opacity: 0.8,
//                 transition: "opacity 0.2s ease",
//               },
//               "& a:hover": { opacity: 1, cursor: "pointer" },
//             }}
//           >
//             <Link onClick={() => handleNavigation("/home")} sx={{ display: "flex", alignItems: "center" }}>
//               <HomeIcon sx={{ mr: 0.5, fontSize: "0.9rem" }} />
//               Home
//             </Link>
//             {breadcrumbLinks.map((link, index) => {
//               const isLast = index === breadcrumbLinks.length - 1;
//               return isLast ? (
//                 <Typography key={link.path} sx={{ opacity: 1, fontWeight: 600 }}>
//                   {link.name}
//                 </Typography>
//               ) : (
//                 <Link key={link.path} onClick={() => handleNavigation(link.path)}>
//                   {link.name}
//                 </Link>
//               );
//             })}
//           </Breadcrumbs>

//           <Stack direction="row" spacing={2} alignItems="center">
//             <Typography variant="caption" sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5, opacity: 0.8 }}>
//               <span style={{ fontSize: "1rem" }}>{greeting.icon}</span> {greeting.text}
//             </Typography>
//             <Typography variant="caption" sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 0.5, opacity: 0.8 }}>
//               📅 {shortDate}
//             </Typography>
//             <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5, opacity: 0.8, fontFamily: "monospace" }}>
//               🕐 {formattedTime}
//             </Typography>
//           </Stack>
//         </Box>

//         {/* Notifications Menu */}
//         <Menu
//           anchorEl={notifAnchorEl}
//           open={Boolean(notifAnchorEl)}
//           onClose={handleNotifClose}
//           PaperProps={{
//             sx: {
//               mt: 1.5,
//               width: 320,
//               borderRadius: "16px",
//               bgcolor: "var(--menu-background)",
//               border: "1px solid rgba(var(--drawer-color-rgb), 0.1)",
//               "& .MuiMenuItem-root": { borderRadius: "10px", mx: 1, my: 0.5 },
//             },
//           }}
//         >
//           <Box sx={{ p: 2, borderBottom: "1px solid var(--divider-background)" }}>
//             <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Notifications</Typography>
//           </Box>
//           <MenuItem sx={{ flexDirection: "column", alignItems: "flex-start", py: 1.5 }}>
//             <Typography variant="body2" sx={{ fontWeight: 600 }}>New patient assigned</Typography>
//             <Typography variant="caption" sx={{ opacity: 0.6 }}>Dr. Smith assigned a new patient</Typography>
//             <Typography variant="caption" sx={{ opacity: 0.4, mt: 0.5 }}>5 minutes ago</Typography>
//           </MenuItem>
//           <MenuItem sx={{ flexDirection: "column", alignItems: "flex-start", py: 1.5 }}>
//             <Typography variant="body2" sx={{ fontWeight: 600 }}>Lab results ready</Typography>
//             <Typography variant="caption" sx={{ opacity: 0.6 }}>Results for Room 304 available</Typography>
//             <Typography variant="caption" sx={{ opacity: 0.4, mt: 0.5 }}>1 hour ago</Typography>
//           </MenuItem>
//         </Menu>

//         {/* User Profile Menu */}
//         <Menu
//           anchorEl={anchorEl}
//           id="account-menu"
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//           PaperProps={{
//             elevation: 0,
//             sx: {
//               overflow: "visible",
//               filter: "drop-shadow(0px 4px 20px rgba(0,0,0,0.15))",
//               mt: 1.5,
//               bgcolor: "var(--menu-background)",
//               color: "var(--menu-color)",
//               borderRadius: "16px",
//               minWidth: "220px",
//               border: "1px solid rgba(var(--drawer-color-rgb), 0.1)",
//               "& .MuiMenuItem-root": {
//                 fontSize: "0.875rem",
//                 padding: "10px 16px",
//                 borderRadius: "10px",
//                 mx: 1,
//                 my: 0.5,
//                 "& .MuiListItemIcon-root": { minWidth: "36px", color: "inherit" },
//                 "&:hover": { backgroundColor: "rgba(var(--drawer-color-rgb), 0.06)" }
//               },
//               "&::before": {
//                 content: '""',
//                 display: "block",
//                 position: "absolute",
//                 top: 0,
//                 right: 14,
//                 width: 10,
//                 height: 10,
//                 bgcolor: "var(--menu-background)",
//                 transform: "translateY(-50%) rotate(45deg)",
//                 zIndex: 0,
//                 borderLeft: "1px solid rgba(var(--drawer-color-rgb), 0.1)",
//                 borderTop: "1px solid rgba(var(--drawer-color-rgb), 0.1)",
//               },
//             },
//           }}
//           transformOrigin={{ horizontal: "right", vertical: "top" }}
//           anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//         >
//           <MenuItem onClick={handleMyProfileClick}>
//             <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
//             Profile
//           </MenuItem>
//           <MenuItem onClick={handleUpdateProfileClick}>
//             <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
//             Update Profile
//           </MenuItem>
//           <MenuItem onClick={handleThemeDialogOpen}>
//             <ListItemIcon><Palette fontSize="small" /></ListItemIcon>
//             Change Theme
//           </MenuItem>
//           <MenuItem onClick={handleFontDialogOpen}>
//             <ListItemIcon><FontIcon fontSize="small" /></ListItemIcon>
//             Font Settings
//           </MenuItem>
//           <Divider sx={{ my: 0.5, bgcolor: "var(--divider-background)" }} />
//           <MenuItem
//             onClick={(e) => {
//               e.stopPropagation();
//               localStorage.getItem("preferredLanguage") == "hi" ? changeLanguage("en") : changeLanguage("hi");
//               handleMenuClose();
//             }}
//           >
//             <ListItemIcon>
//               <img src={trans} width={24} height={24} alt="Translate" style={{ borderRadius: "6px" }} />
//             </ListItemIcon>
//             Translate — {newLanguage}
//           </MenuItem>
//           <MenuItem onClick={handleLogout} sx={{ color: "#f44336" }}>
//             <ListItemIcon><ExitToApp fontSize="small" sx={{ color: "#f44336" }} /></ListItemIcon>
//             Logout
//           </MenuItem>
//         </Menu>
//       </AppBarStyled>

//       {/* === Premium Drawer === */}
//       <DrawerStyled variant={isMobile ? "temporary" : "permanent"} open={open} onClose={() => setOpen(false)}>
//       <DrawerHeader
//   sx={{
//     justifyContent: open ? "space-between" : "center",
//   }}
// >
//   {/* LEFT SIDE LOGO */}
//   {open && (
//     <LogoContainer>
//       <img src={sideLogo} alt="Logo" style={{ height: "44px" }} />
//       <Box>
//         <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
//           Hospital
//         </Typography>
      
//       </Box>
//     </LogoContainer>
//   )}

//   {/* CHEVRON BUTTON (ALWAYS VISIBLE) */}
//   {!isMobile && (
//     <IconButton
//       onClick={() => setOpen(!open)}
//       sx={{
//         color: "var(--drawer-color)",
//         transition: "all 0.3s ease",
//         ...(open
//           ? {}
//           : {
//               position: "absolute",
//               left: "50%",
//               transform: "translateX(-50%)",
//             }),
//         "&:hover": {
//           transform: open
//             ? "rotate(180deg)"
//             : "translateX(-50%) scale(1.1)",
//         },
//       }}
//     >
//       {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
//     </IconButton>
//   )}
// </DrawerHeader>

//         <Divider sx={{ bgcolor: "rgba(var(--drawer-color-rgb), 0.08)", my: 1 }} />

//         {/* Search Section */}
//         {open && (
//           <Box sx={{ px: 2, mb: 2 }}>
//             <Autocomplete
//               freeSolo
//               fullWidth
//               size="small"
//               options={allMenuItems.map((option) => option.label)}
//               value={searchValue}
//               onInputChange={(event, newInputValue) => setSearchValue(newInputValue || "")}
//               onChange={handleAutocompleteChange}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   placeholder="Search Menu..."
//                   variant="outlined"
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       borderRadius: "12px",
//                       backgroundColor: "rgba(var(--drawer-color-rgb), 0.05)",
//                       "& fieldset": { borderColor: "transparent" },
//                       "&:hover fieldset": { borderColor: "rgba(var(--drawer-color-rgb), 0.2)" },
//                       "&.Mui-focused fieldset": { borderColor: "var(--primary-color)" },
//                     },
//                     "& .MuiInputBase-input": { 
//                       color: "var(--drawer-color)", 
//                       fontSize: "0.875rem",
//                       py: 1,
//                     },
//                   }}
//                   InputProps={{
//                     ...params.InputProps,
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <SearchIcon fontSize="small" sx={{ opacity: 0.6 }} />
//                       </InputAdornment>
//                     ),
//                     endAdornment: (
//                       <>
//                         {searchValue && (
//                           <IconButton 
//                             aria-label="clear search" 
//                             onClick={() => setSearchValue("")} 
//                             edge="end" 
//                             size="small" 
//                             sx={{ opacity: 0.6 }}
//                           >
//                             <CloseIcon fontSize="small" />
//                           </IconButton>
//                         )}
//                         {params.InputProps.endAdornment}
//                       </>
//                     )
//                   }}
//                 />
//               )}
//             />
//           </Box>
//         )}

//         {/* Navigation List */}
//         <List sx={{ padding: 0, overflowY: "auto", overflowX: "hidden", flexGrow: 1 }}>
//           {/* Home Item */}
//           <StyledListItemButton
//             key="home"
//             selected={isMenuActive("/home")}
//             onClick={() => handleNavigation("/home")}
//             sx={{ ...(open ? {} : { justifyContent: "center", px: 0 }) }}
//             title={open ? "" : "Home"}
//           >
//             <StyledListItemIcon sx={{ ...(open ? {} : { mr: 0 }) }}>
//               <DashboardIcon />
//             </StyledListItemIcon>
//             <StyledListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
//           </StyledListItemButton>

//           {/* Dynamic Menu Items */}
//           {filteredDrawerItems.map((item: any, index: number) => {
//             const itemKey = item.id || item.name || `item-${index}`;
//             const hasSubItems = item.items && item.items.length > 0;

//             return (
//               <React.Fragment key={itemKey}>
//                 {hasSubItems ? (
//                   <>
//                     <StyledListItemButton
//                       onClick={() => handleSubMenuToggle(index)}
//                       sx={{ ...(open ? {} : { justifyContent: "center", px: 0 }) }}
//                       selected={!!openSubMenus[index] || (!Object.keys(openSubMenus).length && item.items.some((subItem: any) => isSubMenuActive(subItem.path)))}
//                       title={open ? "" : item.name}
//                     >
//                       <StyledListItemIcon sx={{ ...(open ? {} : { mr: 0 }) }}>
//                         <FolderIcon />
//                       </StyledListItemIcon>
//                       <StyledListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
//                       {open && (openSubMenus[index] ? <ExpandLessIcon sx={{ ml: 1, opacity: 0.6 }} /> : <ExpandMoreIcon sx={{ ml: 1, opacity: 0.6 }} />)}
//                     </StyledListItemButton>

//                     <Collapse in={open && !!openSubMenus[index]} timeout="auto" unmountOnExit>
//                       <List component="div" disablePadding sx={{ pl: open ? 2 : 0 }}>
//                         {item.items.map((subItem: any, subIndex: number) => {
//                           const subItemKey = subItem.id || subItem.name || `subitem-${itemKey}-${subIndex}`;
//                           return (
//                             <StyledListItemButton
//                               key={subItemKey}
//                               selected={isSubMenuActive(subItem.path)}
//                               onClick={() => handleNavigation(subItem.path)}
//                               sx={{ pl: open ? 4 : 0, justifyContent: open ? "flex-start" : "center" }}
//                               title={open ? "" : subItem.name}
//                             >
//                               <StyledListItemIcon sx={{ minWidth: "20px", mr: open ? 1.5 : 0, opacity: 0.6 }}>
//                                 <SubdirectoryArrowRight sx={{ fontSize: "1rem" }} />
//                               </StyledListItemIcon>
//                               <StyledListItemText
//                                 primary={subItem.name}
//                                 sx={{
//                                   opacity: open ? 1 : 0,
//                                   "& .MuiTypography-root": { fontSize: "0.8125rem", fontWeight: 400 }
//                                 }}
//                               />
//                             </StyledListItemButton>
//                           );
//                         })}
//                       </List>
//                     </Collapse>
//                   </>
//                 ) : (
//                   <StyledListItemButton
//                     key={itemKey}
//                     selected={isMenuActive(item.path)}
//                     onClick={() => handleNavigation(item.path)}
//                     sx={{ ...(open ? {} : { justifyContent: "center", px: 0 }) }}
//                     title={open ? "" : item.name}
//                   >
//                     <StyledListItemIcon sx={{ ...(open ? {} : { mr: 0 }) }}>
//                       <FolderIcon />
//                     </StyledListItemIcon>
//                     <StyledListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
//                   </StyledListItemButton>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </List>

//         {/* Premium Footer */}
//         {open && (
//           <Box sx={{ p: 2, borderTop: "1px solid rgba(var(--drawer-color-rgb), 0.08)", mt: "auto" }}>
//             <Stack spacing={0.5}>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1, opacity: 0.5 }}>
//                 <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#10b981", boxShadow: "0 0 4px #10b981" }} />
//                 <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>System Online</Typography>
//               </Box>
//               <Typography variant="caption" sx={{ fontSize: "0.65rem", opacity: 0.4 }}>v3.0.0 | HIPAA Compliant</Typography>
//             </Stack>
//           </Box>
//         )}
//       </DrawerStyled>

//       {/* === Theme Selection Dialog === */}
//       <Dialog 
//         open={isThemeDialogOpen} 
//         onClose={handleThemeDialogClose} 
//         PaperProps={{ 
//           sx: { 
//             borderRadius: "20px", 
//             bgcolor: "var(--menu-background)", 
//             color: "var(--menu-color)",
//             minWidth: 320,
//           } 
//         }}
//       >
//         <DialogTitle sx={{ borderBottom: "1px solid var(--divider-background)", fontWeight: 700 }}>
//           <Stack direction="row" alignItems="center" gap={1}>
//             <Palette /> Select Theme
//           </Stack>
//         </DialogTitle>
//         <DialogContent sx={{ pt: "20px !important" }}>
//           <List>
//             {themes.map((themeOption) => (
//               <ListItem disablePadding key={themeOption.name}>
//                 <ListItemButton
//                   onClick={() => handleThemeChange(themeOption.name)}
//                   selected={selectedTheme === themeOption.name}
//                   sx={{ 
//                     borderRadius: "12px", 
//                     mb: 0.5,
//                     "&.Mui-selected": { 
//                       backgroundColor: alpha(themeOption.primary, 0.1),
//                       "& .MuiListItemIcon-root": { color: themeOption.primary }
//                     },
//                     "&:hover": { backgroundColor: "rgba(var(--drawer-color-rgb), 0.05)" }
//                   }}
//                 >
//                   <ListItemIcon sx={{ color: "inherit", minWidth: "40px" }}>
//                     {themeOption.icon}
//                   </ListItemIcon>
//                   <ListItemText primary={themeOption.label} />
//                   {selectedTheme === themeOption.name && (
//                     <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: themeOption.primary, boxShadow: `0 0 8px ${themeOption.primary}` }} />
//                   )}
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//         </DialogContent>
//         <DialogActions sx={{ borderTop: "1px solid var(--divider-background)", p: 2 }}>
//           <Button onClick={handleThemeDialogClose} sx={{ borderRadius: "10px" }}>Close</Button>
//         </DialogActions>
//       </Dialog>

//       {/* === Font Settings Dialog === */}
//       <Dialog
//         open={isFontDialogOpen}
//         onClose={handleFontDialogClose}
//         PaperProps={{
//           sx: {
//             borderRadius: "20px",
//             bgcolor: "var(--menu-background)",
//             color: "var(--menu-color)",
//             minWidth: 320,
//           }
//         }}
//       >
//         <DialogTitle sx={{ borderBottom: "1px solid var(--divider-background)", fontWeight: 700 }}>
//           <Stack direction="row" alignItems="center" gap={1}>
//             <FontIcon /> Font Settings
//           </Stack>
//         </DialogTitle>
//         <DialogContent sx={{ pt: "20px !important" }}>
//           <Stack spacing={3}>
//             <Box>
//               <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, opacity: 0.7 }}>
//                 Font Family
//               </Typography>
//               <Stack spacing={1}>
//                 {availableFontFamilies.map((family) => (
//                   <Button
//                     key={family}
//                     onClick={() => setSelectedFontFamily(family)}
//                     sx={{
//                       justifyContent: "flex-start",
//                       py: 1,
//                       px: 2,
//                       borderRadius: "10px",
//                       backgroundColor: selectedFontFamily === family ? "rgba(var(--drawer-color-rgb), 0.1)" : "transparent",
//                       color: "inherit",
//                       fontFamily: family === "System Default" ? "inherit" : family,
//                       "&:hover": { backgroundColor: "rgba(var(--drawer-color-rgb), 0.05)" }
//                     }}
//                   >
//                     {family}
//                   </Button>
//                 ))}
//               </Stack>
//             </Box>

//             <Box>
//               <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, opacity: 0.7 }}>
//                 Font Size
//               </Typography>
//               <Stack direction="row" spacing={1}>
//                 {fontSizes.map((size) => (
//                   <Button
//                     key={size.value}
//                     onClick={() => setSelectedFontSize(size.value)}
//                     sx={{
//                       flex: 1,
//                       py: 1.2,
//                       borderRadius: "10px",
//                       backgroundColor: selectedFontSize === size.value ? "rgba(var(--drawer-color-rgb), 0.1)" : "transparent",
//                       color: "inherit",
//                       fontSize: size.value,
//                       fontWeight: selectedFontSize === size.value ? 700 : 400,
//                       "&:hover": { backgroundColor: "rgba(var(--drawer-color-rgb), 0.05)" }
//                     }}
//                   >
//                     {size.label}
//                   </Button>
//                 ))}
//               </Stack>
//             </Box>

//             <Box sx={{ p: 2, borderRadius: "12px", backgroundColor: "rgba(var(--drawer-color-rgb), 0.03)", textAlign: "center" }}>
//               <Typography variant="caption" sx={{ opacity: 0.5 }}>Preview</Typography>
//               <Typography sx={{ fontSize: selectedFontSize, mt: 1 }}>
//                 The quick brown fox jumps over the lazy dog
//               </Typography>
//             </Box>
//           </Stack>
//         </DialogContent>
//         <DialogActions sx={{ borderTop: "1px solid var(--divider-background)", p: 2 }}>
//           <Button onClick={handleFontDialogClose} sx={{ borderRadius: "10px" }}>Apply</Button>
//         </DialogActions>
//       </Dialog>

//       {/* === Profile Drawer === */}
//       <SwipeableDrawer
//         anchor="right"
//         open={profileDrawerOpen}
//         onClose={handleProfileDrawerToggle}
//         onOpen={handleProfileDrawerToggle}
//         PaperProps={{ 
//           sx: { 
//             width: { xs: "85%", sm: drawerWidth + 60 }, 
//             bgcolor: "var(--drawer-background)", 
//             color: "var(--drawer-color)", 
//             borderRadius: "20px 0 0 20px",
//             borderLeft: "1px solid rgba(var(--drawer-color-rgb), 0.1)",
//           } 
//         }}
//         ModalProps={{ keepMounted: true }}
//         sx={{ zIndex: theme.zIndex.drawer + 2 }}
//       >
//         <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
//           <Box sx={{ 
//             display: "flex", 
//             justifyContent: "space-between", 
//             alignItems: "center", 
//             p: 2,
//             bgcolor: "var(--header-background)", 
//             color: "var(--header-color)",
//             borderRadius: "20px 0 0 0",
//           }}>
//             <Typography variant="h6" sx={{ fontWeight: 700 }}>User Profile</Typography>
//             <IconButton onClick={handleProfileDrawerToggle} sx={{ color: "inherit" }}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
          
//           <Box sx={{ 
//             display: "flex", 
//             flexDirection: "column", 
//             alignItems: "center", 
//             p: 3, 
//             bgcolor: "var(--header-background1)",
//           }}>
//             <Avatar 
//               sx={{ 
//                 width: 90, 
//                 height: 90, 
//                 mb: 2, 
//                 fontSize: "2.5rem", 
//                 bgcolor: "var(--primary-color)",
//                 boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//               }}
//             >
//               {userDetails.initials}
//             </Avatar>
//             <Typography variant="h6" textAlign="center" sx={{ fontWeight: 600 }}>{userDetails.userName}</Typography>
//             <Typography variant="body2" sx={{ opacity: 0.7 }} textAlign="center">{userDetails.loginName}</Typography>
//           </Box>
          
//           <Card 
//             variant="outlined" 
//             sx={{ 
//               margin: 2, 
//               backgroundColor: "rgba(var(--drawer-color-rgb), 0.03)", 
//               color: "var(--menu-color)", 
//               border: "1px solid rgba(var(--drawer-color-rgb), 0.08)",
//               borderRadius: "16px",
//             }}
//           >
//             <CardHeader 
//               title="Account Details" 
//               sx={{ 
//                 pb: 0, 
//                 "& .MuiTypography-root": { fontWeight: 700, fontSize: "1rem" } 
//               }} 
//             />
//             <CardContent>
//               <Box sx={{ mb: 2 }}>
//                 <Typography variant="body2" component="div" sx={{ fontWeight: 600, mb: 0.5, opacity: 0.7 }}>User ID</Typography>
//                 <Typography variant="body2" component="div" sx={{ fontFamily: "monospace" }}>{userDetails.userID}</Typography>
//               </Box>
//               <Divider sx={{ my: 1.5, bgcolor: "rgba(var(--drawer-color-rgb), 0.08)" }} />
//               <Box>
//                 <Typography variant="body2" component="div" sx={{ fontWeight: 600, mb: 0.5, opacity: 0.7 }}>Verified Status</Typography>
//                 <Typography variant="body2" component="div" sx={{ color: userDetails.isVerify ? "#10b981" : "#f44336" }}>
//                   {userDetails.isVerify ? "Verified ✓" : "Not Verified ✗"}
//                 </Typography>
//               </Box>
//             </CardContent>
//           </Card>
//         </Box>
//       </SwipeableDrawer>
//     </Box>
//   );
// }