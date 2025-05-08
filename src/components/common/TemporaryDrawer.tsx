import React from 'react';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import Divider from "@mui/material/Divider";
import dayjs from 'dayjs';
import MenuItem from "@mui/material/MenuItem";

interface TemporaryDrawerProps {
  handleDrawerClose: () => void;
}


const drawerWidth = "40vh";

const TemporaryDrawer = (isopen:any) => {
  console.log(isopen["isopen"]);
  var asd= isopen["isopen"];
  console.log(asd);
  const [open, setOpen] = React.useState(asd);

  // const handleToggleDrawer = (event: React.MouseEvent) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  // //  setAnchorEl(null); 
  //   setOpen((prevOpen) => !prevOpen);
  // };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  //   handleDrawerClose();
  // };

  // const handleCloseIconClick = (event: React.MouseEvent) => {
  //   event.stopPropagation();
  // };

  // const [open, setOpen] = React.useState(false);

  const handleToggleDrawer = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
   /// setOpen((prevOpen) => !prevOpen);
  };

  const handleCloseIconClick = (event: React.MouseEvent) => {
    event.stopPropagation();

   //setOpen(false);
   // handleDrawerClose(); 
  };

  const userData = JSON.parse(localStorage.getItem("userdata")!) || {};
  const userDetail = userData[0]?.userdetail || [];
  console.log(userDetail);

const getGenderText = (genderId:any) => {
  switch (genderId) {
    case 1:
      return 'Male';
    case 2:
      return 'Female';
    case 3:
      return 'Other';
    default:
      return 'Unknown';
  }
};

const formatDate = (dob:any) => {
  const formattedDate = dayjs(dob).format('MMMM DD, YYYY');
  return formattedDate;
};

  return (
    <div style={{ zIndex: 10 }}>
      <MenuItem onClick={handleToggleDrawer}>
  <Avatar /> My account
</MenuItem>
     
    </div>
  );
};

export default TemporaryDrawer;
