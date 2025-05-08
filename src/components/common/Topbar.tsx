// import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
// import colorConfigs from "../../configs/colorConfigs";
// import sizeConfigs from "../../configs/sizeConfigs";
// import LogoutIcon from '@mui/icons-material/Logout';
// import useLocalStorage from "use-local-storage";
// import { useNavigate } from 'react-router-dom';

// const Topbar = () => {
//   const [tokenKey, setTokenKey] = useLocalStorage("name", "");
//   let navigate=useNavigate();
// const Logout=()=>{
//   setTokenKey("");
//   navigate('/');
// }

//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         width: `calc(100% - ${sizeConfigs.sidebar.width})`,
//         ml: sizeConfigs.sidebar.width,
//         boxShadow: "unset",
//         backgroundColor: colorConfigs.topbar.bg,
//         color: colorConfigs.topbar.color
//       }}
//     >
//       <Toolbar style={{backgroundColor:'green'}}>
//         <Typography variant="h5" style={{backgroundColor:'green',width:'100%',height:70, color:'white', paddingTop:'18px'}}>
//           {'Solid Waste Management System'}
//         </Typography>
//         <IconButton aria-label="delete" onClick={Logout} >
//           <LogoutIcon sx={{ color: "white" }}/>
//         </IconButton>
        

//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Topbar;

import React from 'react';

const Topbar = () => {
  return (
    <div>
      
    </div>
  );
}

export default Topbar;
