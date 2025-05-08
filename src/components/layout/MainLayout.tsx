import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Toolbar, Typography } from '@mui/material';
import sizeConfigs from '../../configs/sizeConfigs';
import Sidebar from '../common/Sidebar';
import FolderIcon from '@mui/icons-material/Folder';
import TouchAppIcon from '@mui/icons-material/TouchApp'; // Or your preferred icon
import backgroundimage from '../../assets/images/backgroundimage.jpg'; // Ensure path is correct
import CookieConsent from '../../utils/CookieConsent';
import ChatBot from '../../pages/ChatBot/ChatBot';
import ChatBotIcon from '../../assets/images/chatbot2.png'; // Ensure path is correct
import Draggable from 'react-draggable';

// --- Color Configs --- (Keep as is)
const colorConfigs = {
    sidebar: {
        bg: "#233044",
        color: "#eeeeee",
        hoverBg: "#1e293a",
        activeBg: "#1e253a",
    },
    topbar: {
        bg: "#fff",
        color: "#000",
    },
    mainBg: `url(${backgroundimage})`,
};

// --- Interface Definitions --- (Keep as is)
interface FormRight {
    formID: string;
    formName: string;
    displayName: string;
    displayOrder: string;
    mModuleID: string;
    sectionID: string;
    isMenu: boolean;
    remark: string;
    isPortal: boolean;
    formImage: string;
    readPerm: boolean;
    modifyPerm: boolean;
    deletePerm: boolean;
}

interface ModuleRight {
    moduleID: string;
    packageID: string;
    mModuleName: string;
    uS11_MModuleID: string; // Check if this property is actually used
    displayOrder: string;
    menuClass: string;
    menuIcon: string; // Check if this property is actually used for icons
}

interface UserPermission {
    formApp: any | null;
    buttonRight: any | null;
    formRight: FormRight[] | null;
    moduleRight: ModuleRight[] | null;
    userRole: any[] | null; // Define more specific type if possible
    userSection: any[] | null; // Define more specific type if possible
    userDesig: any[] | null; // Define more specific type if possible
    roleForm: any | null;
}

interface MenuItem {
    id: string | number;
    name: string; // Used internally or for tooltips?
    label: string; // Displayed text
    path: string; // Navigation path
    Icon: React.ComponentType; // Icon component
    displayNo: string; // For sorting
    items?: MenuItem[]; // Child items for nested menus
    onClick?(event: React.MouseEvent<HTMLElement>, item: MenuItem): void; // onClick handler type
}

// --- MainLayout Component ---
const MainLayout: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isChatBotOpen, setIsChatBotOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    // State to hold the parsed permissions from localStorage
    const [userPermission, setUserPermission] = useState<UserPermission | null>(null);

    const location = useLocation();
    const navigate = useNavigate();

    // Effect 1: Load user permissions from localStorage on component mount
    useEffect(() => {
        const storedPermissions = localStorage.getItem("userPermissions");
        const userSession = localStorage.getItem("user"); // Also check if user is logged in

        if (!userSession) {
             console.log("MainLayout: No user session found. Redirecting to login.");
             navigate("/");
             return; // Stop further execution in this effect
        }

        if (storedPermissions) {
            try {
                const parsedPermissions: UserPermission = JSON.parse(storedPermissions);
                
                if (parsedPermissions && parsedPermissions.moduleRight && parsedPermissions.formRight) {
                     console.log("MainLayout: Permissions loaded from localStorage.");
                    setUserPermission(parsedPermissions);
                } else {
                    console.error("MainLayout: Parsed permissions lack expected structure (moduleRight or formRight).");
                 
                    localStorage.removeItem("userPermissions");
                    
                }
            } catch (error) {
                console.error("MainLayout: Failed to parse permissions from localStorage:", error);
               
                localStorage.removeItem("userPermissions");
                
            }
        } else {
             
             console.warn("MainLayout: User session exists, but no permissions found in localStorage. Waiting for potential update or check login flow.");
            
             setUserPermission(null);
             setMenuItems([]); // Clear existing menu items
        }
    }, [navigate]); 

    
    useEffect(() => {
       
        createMenuItems();
    }, [userPermission]);


    const createMenuItems = () => {
        if (!userPermission || !userPermission.moduleRight || !userPermission.formRight) {
          console.log("MainLayout: Cannot create menu items - permissions data missing or incomplete.");
          setMenuItems([]);
          return;
        }
      
        const moduleRight = userPermission.moduleRight;
        const formRight = userPermission.formRight;
      
        const menuarray: MenuItem[] = [];
      
        // Utility to format path as kebab-case (lowercase + hyphens)
        const formatPath = (str: string) =>
          str.trim().toLowerCase().replace(/\s+/g, '');
      
        for (const module of moduleRight) {
          const childmenuarray: MenuItem[] = [];
      
          for (const form of formRight) {
            if (form.mModuleID === module.moduleID && form.isMenu === true) {
              childmenuarray.push({
                id: form.formID,
                name: form.displayName,
                label: form.displayName,
                path: `/${formatPath(module.mModuleName)}/${formatPath(form.formName)}`,
                displayNo: form.displayOrder,
                Icon: TouchAppIcon,
                onClick: handleMenuClick,
              });
            }
          }
      
          if (childmenuarray.length > 0) {
            menuarray.push({
              id: module.moduleID,
              name: module.mModuleName,
              label: module.mModuleName,
              displayNo: module.displayOrder,
              path: "",
              Icon: FolderIcon,
              items: childmenuarray.sort((a, b) => Number(a.displayNo) - Number(b.displayNo)),
            });
          }
        }
      
        setMenuItems(menuarray.sort((a, b) => Number(a.displayNo) - Number(b.displayNo)));
        console.log("MainLayout: Menu items created successfully:", menuarray);
      };
      


   
    function handleMenuClick(event: React.MouseEvent<HTMLElement>, item: MenuItem) {
        console.log("Menu item clicked:", item);
       
    }


   


    return (
        <div>
            
            {location.pathname === "/" ? (
                <Outlet />
            ) : (
                <div>
                    {/* Main application layout */}
                    <Box sx={{ display: "flex" }}>
                        {/* Render Sidebar only if menu items are available */}
                        {menuItems.length > 0 && <Sidebar items={menuItems} />}

                        <Box
                            component="main" // Use semantic element
                            sx={{
                                flexGrow: 1,
                                px: { xs: 2, sm: 3, md: 5 }, // Responsive padding
                                py: 3,
                                // Adjust width calculation if sidebar width changes
                                width: menuItems.length > 0 ? `calc(100% - ${sizeConfigs.sidebar.width})` : '100%',
                                minHeight: "100vh",
                                // Use CSS variables or theme for background consistency
                                 backgroundColor: `var(--main-background)`, // Example if using CSS vars
                                 backgroundImage: `var(--background-image)`,
                             
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundAttachment: 'fixed', // Keep background fixed
                            }}
                        >
                            <Toolbar /> {/* Ensures content is below the potential Topbar */}
                            <Outlet /> {/* Renders the matched child route component */}

                            {/* --- Draggable ChatBot --- */}
                            <Draggable>
                                <Box
                                    sx={{
                                        position: "fixed",
                                        bottom: 20,
                                        right: 20, // Adjusted position slightly
                                        zIndex: 1300, // Ensure it's above most content
                                        display: 'flex', // Keep items in a row for potential label
                                        alignItems: 'center', // Center items vertically
                                    }}
                                >
                                    {/* Tooltip text */}
                                     {isHovered && (
                                        <Typography
                                            variant="caption" // Smaller text
                                            sx={{
                                                position: 'absolute',
                                                bottom: '100%', // Position above the icon
                                                right: '50%', // Center horizontally relative to icon container
                                                transform: 'translateX(50%)', // Adjust horizontal centering
                                                marginBottom: '5px', // Space between text and icon
                                                bgcolor: 'rgba(0, 0, 0, 0.7)',
                                                color: 'white',
                                                padding: '3px 8px',
                                                borderRadius: '4px',
                                                whiteSpace: 'nowrap', // Prevent wrapping
                                                fontSize: '0.7rem'
                                            }}
                                        >
                                            Ask Me...
                                        </Typography>
                                    )}
                                    {/* Chatbot Icon */}
                                    <Box
                                        component="img"
                                        src={ChatBotIcon}
                                        alt="Chatbot"
                                        sx={{
                                            width: { xs: 40, sm: 50 }, // Responsive size
                                            height: { xs: 40, sm: 50 },
                                            cursor: "pointer",
                                            borderRadius: '50%', // Make it round
                                            boxShadow: 3, // Add shadow
                                            transition: 'opacity 0.3s ease', // Smooth transition
                                            '&:hover': {
                                                opacity: 0.85,
                                            },
                                        }}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        onClick={() => setIsChatBotOpen(true)}
                                    />
                                </Box>
                            </Draggable>
                        </Box>
                    </Box>
                    <CookieConsent />
                    <ChatBot
                        open={isChatBotOpen}
                        onClose={() => setIsChatBotOpen(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default MainLayout;