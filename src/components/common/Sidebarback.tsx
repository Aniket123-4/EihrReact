import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar, Stack } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import call from "../../assets/images/phone-call.png";
import roles from "../../assets/images/role-model.png";
import tick from "../../assets/images/check-mark.png";
import crs from "../../assets/images/cross.png";
import log from "../../assets/images/profile.png";
import emails from "../../assets/images/gmail.png";
import genders from "../../assets/images/symbol.png";
import dobs from "../../assets/images/timetable.png";
import id from "../../assets/images/profile1.png";
import settings from "../../assets/images/settings.png";
import trans from "../../assets/images/translation.png";
import logout from "../../assets/images/logout.png";
import logged from "../../assets/images/permission.png";
import logo from "../../assets/images/recyclebinLogo.png";
import loged from "../../assets/images/DrawerLogo.png";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { Home } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Collapse from "@mui/material/Collapse";
import Typewriter from "./TypeWriter";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import FolderIcon from "@mui/icons-material/Folder";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import "./Shine.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import names from "../../assets/images/id-card (2).png";
import backgrd from '../../assets/images/backgroundimage.jpg'
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from '@mui/material/InputAdornment';
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  // Typography,
} from "@mui/material";


const drawerWidth = 225;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(12)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer({ items }: any) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [collapseIndex, setCollapseIndex] = React.useState<any>(-1);
  const [openlogo, setOpenlogo] = React.useState(true);
  const [homeColor, setHomeColor] = React.useState("inherit");

  const [selectedSubMenu, setSelectedSubMenu] = React.useState(null);

  const [searchValue, setSearchValue] = React.useState('');
  // const [filteredItems, setFilteredItems] = React.useState([]); 
  const [filteredItems, setFilteredItems] = React.useState<MenuItem[]>([]);



  let navigate = useNavigate();


  function searchMenuItems(items: any, query: string) {

    const results:any = [];

    for (const menuItem of items) {
      if (menuItem.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(menuItem);
      } else if (menuItem.items && menuItem.items.length > 0) {
        const matchingSubItems = menuItem.items.filter((subItem: { name: string; }) =>
          subItem.name.toLowerCase().includes(query.toLowerCase())
        );
        if (matchingSubItems.length > 0) {
          results.push({ ...menuItem, items: matchingSubItems });
        }
      }
    }
    return results;
  }


  interface MenuItem {
    Icon: any;
    displayNo: number;
    id: number;
    items: MenuItem[];
    label: string;
    name: string;
    path: string;
  }

  const handleSearchIconClick = () => {
    console.log("value", searchValue);
    const filtered = searchMenuItems(items, searchValue);
    setFilteredItems(filtered);
    console.log("filtered", filtered);
  };


  const handleNavigation = (path: any) => {

    console.log("Navigating to:", path);
    navigate(path);
  };

  const handleAutocompleteChange = (event: any, value: any) => {
    const selectedItem = items.find((item: any) => item.items.some((subItem: any) => subItem.name === value));
    if (selectedItem) {
      const selectedSubItem = selectedItem.items.find((subItem: any) => subItem.name === value);
      if (selectedSubItem) {
        handleNavigation(selectedSubItem.path);
      }
    }
  };

  const allMenuNames = items.reduce((acc: any, item: { items: any[]; }) => {
    if (item.items) {
      return [...acc, ...item.items.map((subItem: { name: any; }) => subItem.name)];
    }
    return acc;
  }, []);


  const filteredItemed = allMenuNames.filter((item: string) =>
    item.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearchInputChange = (e: any) => {
    console.log("first 1", e.target.value)
    const value = e.target.value;
    setSearchValue(value);


    const filtered = searchMenuItems(items, value);
    setFilteredItems(filtered);
  };


  var [date, setDate] = React.useState(new Date());

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .split(" ")
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");

  React.useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });


  const handleSubMenuClick = (index: any) => {
    console.log(index);
    setSelectedSubMenu(index);
  };
  const resetHomeColor = () => {
    // setHomeColor("inherit");
    setHomeColor("#FF0000");
    // setHomeColor("");
  };

  const backgroundStyle = {
    background: "linear-gradient(45deg, #fff, #f0f)",
    backgroundSize: "400% 400%",
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
    setHomeColor("inherit");
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const routeChangeHome = () => {
    let path = `/home`;
    navigate(path);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
    setOpenlogo(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setOpenlogo(false);
  };

  const Logout = () => {
    localStorage.removeItem("userdata");
    navigate("/");
  };

  function onClick(e: any, item: any) {
    // console.log("Main " + item);

    let path = item.path;
    if (path == "" || path == null || path == "undefind") {
      window.alert("Path Not Found ????");
    } else {
      navigate(path);
    }
  }

  var data = JSON.parse(localStorage.getItem("userdata")!);
  var menudata = data[0]["userdetail"];
  var username =
    menudata[0]["firsT_NAME"] +
    " " +
    menudata[0]["middlE_NAME"] +
    " " +
    menudata[0]["suR_NAME"];
  const { i18n } = useTranslation();

  const changeLanguage = (language: any) => {
    // console.log("check", language);

    i18n.changeLanguage(language);
    localStorage.setItem("preferredLanguage", language);
  };
  var currentLanguage = localStorage.getItem("preferredLanguage");
  var newLanguage = currentLanguage === "hi" ? "English" : "हिंदी";

  const userData = JSON.parse(localStorage.getItem("userdata")!) || {};
  const userDetail = userData[0]?.userdetail || [];
  // console.log(userDetail);

  const collapsehamndle = (index: any) => {
    // console.log(index);
    if (index == collapseIndex) {
      setCollapseIndex(-1);
    } else {
      setCollapseIndex(index);
    }
  };
  // console.log("items", items);

  const getImageForFirstName = (
    firsT_NAME: any,
    middlE_NAME: any,
    suR_NAME: any
  ) => {
    const firstLetter = firsT_NAME ? firsT_NAME.charAt(0).toUpperCase() : "";
    const secondLetter = middlE_NAME ? middlE_NAME.charAt(0).toUpperCase() : "";
    const thirdLetter = suR_NAME ? suR_NAME.charAt(0).toUpperCase() : "";
    return `${firstLetter}${secondLetter}${thirdLetter}`;
  };

  const getGenderText = (gendeR_ID: any) => {
    switch (gendeR_ID) {
      case 1:
        return "Male";
      case 2:
        return "Female";
      case 3:
        return "Other";
      default:
        return "Unknown";
    }
  };

  const handleMyProfileClick = () => {
    // console.log("My Profile clicked" + profileDrawerOpen);
    setProfileDrawerOpen(!profileDrawerOpen);
  };

  const currentPathname = window.location.pathname;
  const segments = currentPathname.split("/").filter(Boolean);
  const isHomePage = segments.length === 0;

  function handleClicked(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    // console.info("You clicked a breadcrumb.");
  }

  const handleClickhome = () => {
    let path = `/home`;
    navigate(path);
  };

  function FirstLetters(props: any) {
    const { text } = props;

    const words = text.split(" ");

    // Extract the first letter from each word
    const firstLetters = words.map((word: any) => word.charAt(0));

    // Join the first letters back into a string
    const result = firstLetters.join("");

    return <div>{result}</div>;
  }


  const handleRightClick = (path: any) => (e: any) => {
    e.preventDefault();
    window.open(path, '_blank');
  };


  return (
    <Box sx={{ display: "flex" }}>
      {/* <CssBaseline /> */}
      <AppBar position="fixed" open={open} style={{}}>
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#42AEEE",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              // paddingTop: "10px",
              // paddingBottom: "10px",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                // marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>

            {!openlogo && <img src={logo} width={60} height={60} />}
          </div>

          <div style={{ fontSize: "25px" }}>
          Document Management System
          </div>

          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 40, height: 40 }}>
              {username[0].toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={menuOpen}
            // onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                paddingRight: "10px",
                paddingLeft: "10px",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <img src={logged} width={40} height={40} />
              </ListItemIcon>{" "}
              {username}
            </MenuItem>
            {/* <MenuItem > */}
            <MenuItem onClick={handleMyProfileClick}>
              <ListItemIcon>
                <img src={id} width={30} height={30} />
              </ListItemIcon>
              My Profile
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                localStorage.getItem("preferredLanguage") == "hi"
                  ? changeLanguage("en")
                  : changeLanguage("hi");
              }}
            >
              <ListItemIcon>
                <img src={trans} width={30} height={30} />
              </ListItemIcon>
              Translate -- {newLanguage}
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <img src={settings} width={30} height={30} />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={Logout}>
              <ListItemIcon>
                <img src={logout} width={30} height={30} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // backgroundColor: "rgba(245,245,245,0.7)",
            borderBottomRightRadius: "15px",
          }}
        >
          <div
            role="presentation"
            onClick={handleClicked}
          // style={{  borderBottomRightRadius: "15px" }}
          >
            <Breadcrumbs aria-label="breadcrumb" sx={{ color: "#fff" }}>
              {/* <Link
                underline="hover"
                sx={{ display: "flex", alignItems: "center" }}
                color="inherit"
                href="/"
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Home
              </Link> */}
              <Typography
                sx={{
                  display: "flex",
                  color: "#fff",
                  alignItems: "center",
                }}
              >
                <Link
                  underline="hover"
                  sx={{
                    display: "flex",
                    color: "#fff",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  color="inherit"
                  onClick={handleClickhome}
                >
                  <HomeIcon sx={{ ml: 1, mr: 1 }} fontSize="inherit" />
                  Home
                </Link>
              </Typography>

              {/* Render the rest of the breadcrumb path */}
              {segments.slice(1).map((segment, index) => (
                <Typography
                  key={index}
                  sx={{
                    display: "flex",
                    color: "#fff",
                    alignItems: "center",
                  }}
                >
                  {/* {" / "} */}
                  {index > 0 && " / "}
                  {index === segments.length - 2 ? (
                    <span>
                      {" "}
                      {/* <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" /> */}
                      {segment}
                    </span>
                  ) : (
                    <Link
                      underline="hover"
                      sx={{
                        display: "flex",
                        color: "#fff",
                        alignItems: "center",
                      }}
                      color="inherit"
                      href={`/${segments.slice(0, index + 1).join("/")}`}
                    >
                      {/* <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" /> */}
                      {segment}
                    </Link>
                  )}
                </Typography>
              ))}
            </Breadcrumbs>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 15,
              paddingRight: "15px",
            }}
          >
            <p> Time : {date.toLocaleTimeString()}</p>
            <p> Date : {formattedDate}</p>
          </div>
        </div>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{
          sx: {
            backgroundColor: "#f5f5f5",
          }
        }}
      >
        <DrawerHeader>
          <>
            <Stack
              sx={{ width: "100%", height: "16vh" }}
              direction="row"
              justifyContent="center"
            >
              {openlogo ? (
                <div
                  style={{
                    paddingTop: "25px",
                    paddingBottom: "25px",
                  }}
                >
                  <img src={loged} width={100} height={100} />
                </div>
              ) : <div style={{ padding: 0 }}></div>}
            </Stack>



            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
            <br />
            <br />
          </>
        </DrawerHeader>

        <br />
        <br />
        <Divider />
        {openlogo && <Paper
          component="form"
          sx={{ m: "5px 5px", p: "0px 2px", display: 'flex', alignItems: 'center' }}
        >

          <Autocomplete
            freeSolo
            fullWidth
            size="small"
            options={items.reduce((acc: any, item: any) => {
              if (item.items) {
                acc.push(...item.items.map((subItem: any) => subItem.name));
              }
              return acc;
            }, [])}
            onChange={handleAutocompleteChange}
            renderInput={(params) => (
              <TextField
                {...params}
                //label="Search Menu"
                placeholder="Search Menu"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={handleSearchInputChange}
              />
            )}
          />

        </Paper>}
        <Divider />

        <React.Fragment>
          <List sx={{ padding: 0 }}>
            {["Home"].map((text, index) => (
              <ListItem
                key={text}
                disablePadding
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 0,
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "lightgray",
                  },
                }}
              >
                <ListItemButton
                  sx={{
                    // minHeight: 30,
                    justifyContent: open ? "initial" : "center",
                    px: 4.5,
                  }}
                  // onClick={routeChangeHome}
                  onClick={() => {
                    routeChangeHome();
                    resetHomeColor();
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1 : "auto",
                      justifyContent: "center",
                      color: homeColor,
                    }}
                  >
                    <Home />
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>

              </ListItem>
            ))}
          </List>

          <List sx={{ padding: 0 }}>
            {items.map((text: any, index: any) => (
              <React.Fragment key={index}>
                <Divider />

                <ListItem
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => collapsehamndle(index)}
                >
                  <ListItem
                    sx={{
                      // minHeight: 35,
                      justifyContent: open ? "initial" : "center",
                      paddingLeft: 2,
                      paddingRight: 0,
                      paddingTop: 0,
                      paddingBottom: 0,
                      cursor: "pointer",
                    }}
                  // key={text.id} component={Link} to={text.path}
                  >
                    {/* <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1 : "auto",
                      justifyContent: "center",
                      color: index === collapseIndex ? "#FF0000" : "inherit",
                    }}
                  >
                    <FolderIcon />
                  </ListItemIcon> */}
                    {open ? (
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                          color: index === collapseIndex ? "#FF0000" : "inherit",
                          fontWeight: 600
                        }}
                        title={text.name}
                      >
                        {/* <FolderIcon /> */}
                      </ListItemIcon>
                    ) : (
                      <div
                        style={{
                          minWidth: 24,
                          minHeight: 24,
                          borderRadius: "50%",
                          backgroundColor: "lightgray",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 8,
                          // color: "Black",
                          color: index === collapseIndex ? "#FF0000" : "inherit",
                        }}
                        title={text.name}
                      >
                        {text.name.charAt(0)}
                      </div>
                    )}
                    <ListItemText
                      primary={text.name}
                      sx={{ opacity: open ? 1 : 0 }}
                    />{" "}
                    {/* <span style={{fontWeight:600,paddingTop:"3px", paddingBottom:"3px",  opacity: open ? 1 : 0}}>
                      
                    {text.name}
                      </span> */}
                  </ListItem>
                  <ListItemIcon
                    sx={{ opacity: open ? 1 : 0, justifyContent: "end" }}
                  >
                    {collapseIndex == index ? (
                      <ExpandLessIcon
                        className={
                          "sidebar-item-expand-arrow" +
                          " sidebar-item-expand-arrow-expanded"
                        }
                      />
                    ) : (
                      <ExpandMoreIcon className="sidebar-item-expand-arrow" />
                    )}
                  </ListItemIcon>
                </ListItem>
                <Divider />

                {collapseIndex === index && (
                  <List sx={{ paddingLeft: open ? 2 : 0 }}>
                    {items[index].items.map((text: any, index2: any) => (
                      <List sx={{ pl: 2 }}>
                        <ListItem
                          key={index2}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingLeft: 2,
                            paddingRight: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                            backgroundColor:
                              selectedSubMenu == index2 ? "#FF7722" : "inherit",
                            color: selectedSubMenu == index2 ? "white" : "black",
                            borderRadius: "10px",
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "lightgray",
                              color: "black",
                            },
                            // title={text.name}
                          }}
                          onClick={(e) => {
                            onClick(e, text);
                            handleSubMenuClick(index2);
                          }}
                          onContextMenu={handleRightClick(text.path)}
                        >
                          {open ? (
                            <p
                              style={{
                                fontWeight: 500,
                                paddingTop: "3px",
                                paddingBottom: "3px",
                                opacity: open ? 1 : 0,
                              }}
                            >
                              {/* <ListItemText
                        primary={text.name}
                        sx={{
                          
                          opacity: open ? 1 : 0,
                          "&:hover": {
                            color: "blue",
                          },
                        }}
                      /> */}
                              {text.name}
                            </p>
                          ) : (
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 3 : "auto",
                                justifyContent: "center",
                                color: open ? "#FF0000" : "inherit",
                                backgroundColor:
                                  selectedSubMenu == index2
                                    ? "#FF7722"
                                    : "inherit",
                                Color:
                                  selectedSubMenu == index2 ? "white" : "black",
                                borderRadius: "25px",
                                padding: "5px 10px",
                              }}
                              title={text.name}
                            >
                              {/* <TouchAppIcon />  {text.name.charAt(0)} */}
                              <FirstLetters text={text.name} />
                            </ListItemIcon>
                          )}
                        </ListItem>
                      </List>
                    ))}
                  </List>
                )}
              </React.Fragment>
            ))}
          </List>
        </React.Fragment>

      </Drawer>
      {/* <Box  sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
      </Box> */}
      <SwipeableDrawer
        anchor="left"
        open={profileDrawerOpen}
        onClose={() => {
          setProfileDrawerOpen(false);
        }}
        onOpen={() => { }}
        style={{
          zIndex: 1300,
        }}
      >
        <Box sx={{ width: drawerWidth }} role="presentation">
          <IconButton
            edge="end"
            onClick={() => setProfileDrawerOpen(false)}
            aria-label="close"
            sx={{ color: "white", position: "absolute", right: 15, top: 2 }}
          >
            <CloseIcon />
          </IconButton>
          <p
            style={{
              paddingTop: "5vh",
              paddingBottom: "5vh",
              textAlign: "center",
              backgroundImage:
                "linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)",
              color: "whitesmoke",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
              fontSize: "20px",
            }}
          >
            User Details
          </p>
          {userDetail.map((user: any, index: any) => (
            <div key={index}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    borderRadius: "50%",
                    height: "90px",
                    width: "90px",
                    borderColor:
                      "linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)",
                    backgroundColor: "red",
                    padding: "13px",
                    paddingTop: "30px",
                    paddingLeft: "13px",
                    color: "whitesmoke",
                    fontSize: "20px",
                  }}
                >
                  {getImageForFirstName(
                    user.firsT_NAME,
                    user.middlE_NAME,
                    user.suR_NAME
                  )}
                </div>
              </div>
              <div style={{ marginLeft: "15px" }}>
                {user.logiN_NAME && user.logiN_NAME.trim() !== "" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <img src={log} width={25} />
                    {user.logiN_NAME}
                  </div>
                )}
                <br />
                {user.rolename && user.rolename.trim() !== "" ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <img src={roles} width={25} />
                    {user.rolename}
                  </div>
                ) : (
                  ""
                )}
                <br />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <img src={names} width={25} />
                  {user.firsT_NAME} {user.middlE_NAME} {user.suR_NAME}
                </div>
                <br />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {" "}
                  <img src={dobs} width={22} />{" "}
                  {dayjs(user.dob).format("YYYY-MM-DD")}
                </div>
                <br />
                {user.gendeR_ID !== 0 ? (
                  <>
                    {user.gendeR_ID && getGenderText(user.gendeR_ID) && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        {" "}
                        <img src={genders} width={22} />{" "}
                        {getGenderText(user.gendeR_ID)}
                      </div>
                    )}
                  </>
                ) : (
                  " "
                )}

                <br />

                {user.cuR_MOBILE && user.cuR_MOBILE.trim() !== "" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <img src={call} width={25} />
                    {user.cuR_MOBILE}
                  </div>
                )}
                <br />

                {user.email && user.email.trim() !== "" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <img src={emails} width={25} />
                    {user.email}
                  </div>
                )}
                <br />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  Account Status :{" "}
                  {user.iS_ACTIVE === true ? (
                    <img src={tick} width={25} />
                  ) : (
                    <img src={crs} width={25} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </Box>
      </SwipeableDrawer>
    </Box>
  );
}

////////////

// import React from "react";
// import { useState, useEffect } from "react";
// import ListItem from "@mui/material/ListItem";
// import Divider from "@mui/material/Divider";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import Collapse from "@mui/material/Collapse";
// import MenuIcon from "@mui/icons-material/Menu";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import LogoutIcon from "@mui/icons-material/Logout";
// import "./Sidebar.css";
// import {
//   AppBar,
//   Avatar,
//   Box,
//   Container,
//   CssBaseline,
//   Drawer,
//   IconButton,
//   List,
//   Stack,
//   Toolbar,
//   Typography,
// } from "@mui/material";
// import assets from "../../assets";
// import colorConfigs from "../../configs/colorConfigs";
// import sizeConfigs from "../../configs/sizeConfigs";
// import { useNavigate } from "react-router-dom";
// import { Home } from "@mui/icons-material";
// import PersonPinIcon from '@mui/icons-material/PersonPin';
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import Settings from "@mui/icons-material/Settings";
// import TranslateIcon from '@mui/icons-material/Translate';
// import { useTranslation } from 'react-i18next';
// import call from "../../assets/images/phone-call.png";
// import roles from "../../assets/images/role-model.png";
// import tick from "../../assets/images/check-mark.png";
// import crs from "../../assets/images/cross.png";
// import log from "../../assets/images/profile.png";
// import emails from "../../assets/images/gmail.png";
// import genders from "../../assets/images/symbol.png";
// import dobs from "../../assets/images/timetable.png";
// import id from "../../assets/images/profile1.png";
// import settings from "../../assets/images/settings.png";
// import trans from "../../assets/images/translation.png";
// import logout from "../../assets/images/logout.png";
// import logged from "../../assets/images/permission.png";

// import CloseIcon from '@mui/icons-material/Close';
// import dayjs from 'dayjs';

// const drawerWidth = 250;
// function SidebarItem({
//   depthStep = 10,
//   depth = 0,
//   expanded,
//   item,
//   ...rest
// }: any) {
//   const [collapsed, setCollapsed] = React.useState(true);
//   const { label, items, Icon, onClick: onClickProp } = item;
//   let navigate = useNavigate();

//   const Logout = () => {
//     localStorage.removeItem("userdata");
//     navigate("/");
//   };
//   function toggleCollapse() {
//     setCollapsed((prevValue) => !prevValue);
//   }
//   function onClick(e: any) {
//     if (Array.isArray(items)) {
//       toggleCollapse();
//     }
//     if (onClickProp) {
//       onClickProp(e, item);
//     }
//   }
//   let expandIcon;

//   if (Array.isArray(items) && items.length) {
//     expandIcon = !collapsed ? (
//       <ExpandLessIcon
//         className={
//           "sidebar-item-expand-arrow" + " sidebar-item-expand-arrow-expanded"
//         }
//       />
//     ) : (
//       <ExpandMoreIcon className="sidebar-item-expand-arrow" />
//     );
//   }

//   return (
//     <>
//       <ListItem
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//         // className="sidebar-item"
//         onClick={onClick}
//         button
//         dense
//         {...rest}
//       >
//         <div
//           style={{
//             paddingLeft: depth * depthStep,
//             whiteSpace: "nowrap",
//             //textOverflow:'ellipsis',
//             //overflow:'hidden',
//             display: "flex",
//             alignItems: "center",
//             width: "100%",
//             fontSize: "16px",
//             paddingBottom: "3px",
//             fontFamily: "unset",
//             overflowY: "revert-layer",
//           }}
//           className="sidebar-item-content"
//         >
//           {Icon && <Icon className="sidebar-item-icon" fontSize="small" />}
//           <div className="sidebar-item-text">{label}</div>
//         </div>
//         {expandIcon}
//       </ListItem>
//       <Collapse in={!collapsed} timeout="auto" unmountOnExit>
//         {Array.isArray(items) ? (
//           <List disablePadding dense>
//             {items.map((subItem, index) => (
//               <React.Fragment key={`${subItem.name}${index}`}>
//                 {subItem === "divider" ? (
//                   <Divider style={{ margin: "6px 0" }} />
//                 ) : (
//                   <SidebarItem
//                     depth={depth + 1}
//                     depthStep={depthStep}
//                     item={subItem}
//                     expanded={undefined}
//                   />
//                 )}
//               </React.Fragment>
//             ))}
//           </List>
//         ) : null}
//       </Collapse>
//     </>
//   );
// }

// const Sidebar = ({ items, depthStep, depth, expanded }: any) => {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [userdrawerOpen, setUserdrawerOpen] = useState(false);

//   const temporaryDrawerRef = React.useRef<HTMLDivElement>(null);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };
//   const Logout = () => {
//     localStorage.removeItem("userdata");
//     navigate("/");
//   };
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

//   const open = Boolean(anchorEl);

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   function onClick(e: any) {
//     if (Array.isArray(items)) {
//     }
//   }
//   let navigate = useNavigate();
//   const routeChangeHome = () => {
//     let path = `/home`;
//     navigate(path);
//   };
//   var data = JSON.parse(localStorage.getItem("userdata")!);
//   var menudata = data[0]["userdetail"];
//   var username =
//     menudata[0]["firsT_NAME"] +
//     " " +
//     menudata[0]["middlE_NAME"] +
//     " " +
//     menudata[0]["suR_NAME"];

//   const { i18n } = useTranslation();

//   const changeLanguage = (language:any) => {
//     // console.log("check", language);

//     i18n.changeLanguage(language);
//     localStorage.setItem('preferredLanguage', language);
//   };
//   var currentLanguage = localStorage.getItem('preferredLanguage');
//   var newLanguage = currentLanguage === 'hi' ? 'English' : 'हिंदी';

//   const userData = JSON.parse(localStorage.getItem("userdata")!) || {};
//   const userDetail = userData[0]?.userdetail || [];
//   // console.log(userDetail);

//   const getImageForFirstName = (
//     firsT_NAME: any,
//     middlE_NAME: any,
//     suR_NAME: any
//   ) => {
//     const firstLetter = firsT_NAME ? firsT_NAME.charAt(0).toUpperCase() : "";
//     const secondLetter = middlE_NAME ? middlE_NAME.charAt(0).toUpperCase() : "";
//     const thirdLetter = suR_NAME ? suR_NAME.charAt(0).toUpperCase() : "";
//     // console.log("fisrtlett", firstLetter);
//     return `${firstLetter}${secondLetter}${thirdLetter}`;
//   };

//   const getGenderText = (gendeR_ID: any) => {
//     switch (gendeR_ID) {
//       case 1:
//         return "Male";
//       case 2:
//         return "Female";
//       case 3:
//         return "Other";
//       default:
//         return "Unknown";
//     }
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       <AppBar
//         style={{ background: "#FF7722", height: "12vh" }}
//         position="fixed"
//         sx={{
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           ml: { sm: `${drawerWidth}px` },
//         }}
//       >
//         <Toolbar style={{ justifyContent: "space-between" }}>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ mr: 2, display: { sm: "none" } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ mr: 2, display: { sm: "none" } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h5" noWrap component="div">
//             Advertisement Management System
//           </Typography>

//           <IconButton
//             onClick={handleClick}
//             size="small"
//             sx={{ ml: 2 }}
//             aria-controls={open ? "account-menu" : undefined}
//             aria-haspopup="true"
//             aria-expanded={open ? "true" : undefined}
//           >
//             <Avatar sx={{ width: 32, height: 32 }}>
//               {username[0].toUpperCase()}
//             </Avatar>
//           </IconButton>

//           <Menu
//             anchorEl={anchorEl}
//             id="account-menu"
//             open={open}
//             // onClose={handleClose}
//             onClick={handleClose}
//             PaperProps={{
//               elevation: 0,
//               sx: {
//                 overflow: "visible",
//                 filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
//                 paddingRight:"10px",
//                 paddingLeft:"10px",
//                 mt: 1.5,
//                 "& .MuiAvatar-root": {
//                   width: 32,
//                   height: 32,
//                   ml: -0.5,
//                   mr: 1,
//                 },
//                 "&::before": {
//                   content: '""',
//                   display: "block",
//                   position: "absolute",
//                   top: 0,
//                   right: 14,
//                   width: 10,
//                   height: 10,
//                   bgcolor: "background.paper",
//                   transform: "translateY(-50%) rotate(45deg)",
//                   zIndex: 0,
//                 },
//               },
//             }}
//             transformOrigin={{ horizontal: "right", vertical: "top" }}
//             anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//           >
//             <MenuItem onClick={handleClose}>
//             <ListItemIcon><img src={logged} width={30} height={30} /></ListItemIcon> {username}
//             </MenuItem>
//             <MenuItem onClick={()=>setUserdrawerOpen(!userdrawerOpen)}>
//             <ListItemIcon><img src={id} width={30} height={30} /></ListItemIcon>
//               My Profile
//             </MenuItem>

//             <Divider />

//             <MenuItem onClick={()=>{localStorage.getItem('preferredLanguage')=="hi"?changeLanguage("en"):changeLanguage("hi")}}>
//               <ListItemIcon>
//               <img src={trans} width={30} height={30} />
//               </ListItemIcon>
//               Translate -- {newLanguage}
//             </MenuItem>
//             <MenuItem onClick={handleClose}>
//               <ListItemIcon>
//               <img src={settings} width={30} height={30} />
//               </ListItemIcon>
//               Settings
//             </MenuItem>
//             <Divider/>
//             <MenuItem onClick={Logout}>
//               <ListItemIcon>
//               <img src={logout} width={30} height={30} />
//               </ListItemIcon>
//               Logout
//             </MenuItem>
//           </Menu>
//         </Toolbar>

//       </AppBar>
//       <Drawer
//         variant="temporary"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         ModalProps={{
//           keepMounted: true,
//         }}

//         sx={{
//           display: { xs: "block", sm: "none" },
//           width: sizeConfigs.sidebar.width,
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: sizeConfigs.sidebar.width,
//             boxSizing: "border-box",
//             borderRight: "0px",
//             backgroundColor: colorConfigs.sidebar.bg,
//             color: colorConfigs.sidebar.color,
//           },
//         }}
//       >
//         <List disablePadding>
//           <List disablePadding dense style={{ marginTop: "2vh" }}>
//             {items.map((sidebarItem: any, index: any) => (
//               <React.Fragment key={`${sidebarItem.name}${index}`}>
//                 {sidebarItem === "divider" ? (
//                   <Divider style={{ margin: "6px 0" }} />
//                 ) : (
//                   <SidebarItem
//                     depthStep={depthStep}
//                     depth={depth}
//                     expanded={expanded}
//                     item={sidebarItem}
//                   />
//                 )}
//               </React.Fragment>
//             ))}
//           </List>
//         </List>
//       </Drawer>
//       <Drawer
//         variant="permanent"
//         open

//         sx={{
//           display: { xs: "none", sm: "block" },
//           width: sizeConfigs.sidebar.width,
//           flexShrink: 0,
//           "& .MuiDrawer-paper": {
//             width: sizeConfigs.sidebar.width,
//             boxSizing: "border-box",
//             borderRight: "0px",
//             backgroundColor: "#331a00",
//             color: colorConfigs.sidebar.color,
//           },
//         }}
//       >
//         <Toolbar >
//           <Stack sx={{ width: "100%" }} direction="row" justifyContent="center">
//             <Avatar
//               src={assets.images.logo}
//               style={{ height: 80, width: 80, marginTop: "25px", marginBottom: "25px" }}
//             />
//           </Stack>
//         </Toolbar>
//         {/* <br/> */}
//               <Divider style={{backgroundColor:"white"}}/>
//               {/* <br/> */}
//         <List disablePadding dense style={{ marginTop: "1vh" }}>
//           <ListItem
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//             // className="sidebar-item"
//             onClick={onClick}
//             button
//             dense
//           >
//             <div
//               style={{
//                 paddingLeft: depth * depthStep,
//                 // whiteSpace:'nowrap',
//                 // textOverflow:'ellipsis',
//                 // overflow:'hidden',
//                 // display:'flex',
//                 // alignItems:'center',
//                 // width:'100%'
//               }}
//               className="sidebar-item-content"
//             >

//               {<Home style={{ marginRight: "3px" }} />}
//               {/* // <Icon className="sidebar-item-icon" fontSize="small" /> */}
//               <div
//                 className="sidebar-item-text"
//                 style={{ fontSize: "16px", fontFamily: "unset" }}
//                 onClick={routeChangeHome}
//               >
//                 Home
//               </div>
//             </div>
//           </ListItem>
//           {items.map((sidebarItem: any, index: any) => (
//             <React.Fragment key={`${sidebarItem.name}${index}`}>
//               {sidebarItem === "divider" ? (
//                 <Divider style={{ margin: "6px 0", color: "white" }} />
//               ) : (
//                 <SidebarItem
//                   depthStep={depthStep}
//                   depth={depth}
//                   expanded={expanded}
//                   item={sidebarItem}
//                 />
//               )}
//             </React.Fragment>
//           ))}
//         </List>
//       </Drawer>
//       <Drawer
//         anchor="left"
//         open={userdrawerOpen}
//         onClose={() => {
//            setUserdrawerOpen(false);
//           // handleDrawerClose();
//         }}
//         // sx={{
//         //   '& .MuiDrawer-paper': {
//         //     background: 'linear-gradient(to bottom, #ff7e5f, #feb47b)',
//         //   },
//         // }}
//       >
//         <Box
//           sx={{ width: drawerWidth,}}
//           role="presentation"
//         >
//           <IconButton
//             edge="end"
//             onClick={()=> setUserdrawerOpen(false)}
//             aria-label="close"
//             sx={{ color:"white", position: 'absolute', right: 15, top: 2 }}
//           >
//             <CloseIcon />
//           </IconButton>
//        <p
//             style={{
//               paddingTop: "5vh",
//               paddingBottom: "5vh",
//               textAlign: "center",
//               // textDecoration: "underline",
//               backgroundImage:
//                 "linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)",
//               color: "whitesmoke",
//               borderBottomLeftRadius: "10px",
//               borderBottomRightRadius: "10px",
//               fontSize:"20px"
//             }}
//           >
//            User Details
//           </p>
//           {userDetail.map((user: any, index: any) => (
//             <div key={index}>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   marginTop: "10px",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <div
//                   style={{
//                     textAlign: "center",
//                     borderRadius: "50%",
//                     height: "90px",
//                     width: "90px",
//                     borderColor:
//                       "linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)",
//                     backgroundColor: "red",
//                     padding: "13px",
//                     paddingTop: "30px",
//                     paddingLeft: "13px",
//                     color: "whitesmoke",
//                     fontSize: "20px",
//                   }}
//                 >
//                   {getImageForFirstName(
//                     user.firsT_NAME,
//                     user.middlE_NAME,
//                     user.suR_NAME
//                   )}
//                 </div>
//               </div>
//               <div style={{ marginLeft: "15px" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                   <img src={log} width={25} />{" "}
//                   {user.logiN_NAME == "" ? "N/A" : `${user.logiN_NAME}`}
//                 </div>
//                 <br />
//                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                   {" "}
//                   <img src={roles} width={25} />{" "}
//                   {user.rolename == "" ? "N/A" : `${user.rolename}`}
//                 </div>
//                 {/* <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                   <img src={id} width={25} />{" "}
//                   {user.useR_ID == "" ? "N/A" : `${user.useR_ID}`}
//                 </div>*/}
//                 <br />
//                 <div>First Name : {user.firsT_NAME}</div>
//                 <div style={{ marginTop: "10px", marginBottom: "10px" }}>
//                   Middle Name :{" "}
//                   {user.middlE_NAME == "" ? "N/A" : `${user.middlE_NAME}`}
//                 </div>
//                 <div>Last Name : {user.suR_NAME}</div>
//                 <br />
//                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                   {" "}
//                   <img src={dobs} width={22} />{" "}
//                   {dayjs(user.dob).format("YYYY-MM-DD")}
//                 </div>
//                 <br />
//                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                   {" "}
//                   <img src={genders} width={22} />{" "}
//                   {getGenderText(user.gendeR_ID)}
//                 </div>
//                 <br />
//                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                   {" "}
//                   <img src={call} width={22} />{" "}
//                   {user.cuR_MOBILE == "" ? " N/A" : `${user.cuR_MOBILE}`}
//                 </div>
//                 <br />
//                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                   {" "}
//                   <img src={emails} width={22} />{" "}
//                   {user.email == "" ? " N/A" : `${user.email}`}
//                 </div>
//                 <br />
//                 {/* <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                   {" "}
//                   <img src={roles} width={25} />{" "}
//                   {user.rolename == "" ? "N/A" : `${user.rolename}`}
//                 </div>
//                 <br /> */}
//                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                   Account Status :{" "}
//                   {user.iS_ACTIVE === true ? (
//                     <img src={tick} width={25} />
//                   ) : (
//                     <img src={crs} width={25} />
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </Box>

//       </Drawer>
//       {/* <TemporaryDrawer isopen={userdrawerOpen} /> */}
//       {/* </div> */}
//     </Box>
//   );
// };

// export default Sidebar;
