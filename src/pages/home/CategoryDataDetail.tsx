// import React, { useState, useEffect } from "react";
// import Chip from "@mui/material/Chip";
// import axios from "axios";
// import TableContainer from "@mui/material/TableContainer";
// import Table from "@mui/material/Table";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import TableCell from "@mui/material/TableCell";
// import TableBody from "@mui/material/TableBody";
// import { useTranslation } from "react-i18next";
// import HOST_URL from "../../utils/Url";
// import Dialog from "@mui/material/Dialog";
// import ListItemText from "@mui/material/ListItemText";
// import List from "@mui/material/List";
// import Divider from "@mui/material/Divider";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import CloseIcon from "@mui/icons-material/Close";
// import Slide from "@mui/material/Slide";
// import { TransitionProps } from "@mui/material/transitions";
// import GoogleMapDetails from "./GoogleMapDetails";
// import api from "../../utils/Url";

// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & {
//     children: React.ReactElement;
//   },
//   ref: React.Ref<unknown>
// ) {
//   return <Slide direction="right" ref={ref} {...props} />;
// });

// const Transitions = React.forwardRef(function Transition(
//   props: TransitionProps & {
//     children: React.ReactElement;
//   },
//   ref: React.Ref<unknown>
// ) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// interface Category {
//   [x: string]: any;
//   categoryName: string;
// }

// interface FullScreenDialogProps {
//   open: boolean;
//   onClose: () => void;
// }

// export default function FullScreenDialog({
//   open,
//   onClose
// }: FullScreenDialogProps) {
//   // const [open, setOpen] = React.useState(false);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [lastHoveredIndex, setLastHoveredIndex] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(
//     null
//   );
//   const [openDialog, setOpenDialog] = useState(false);
//   const [locations, setLocations] = useState<any[]>([]);
//   const [openMapDialog, setOpenMapDialog] = React.useState(false);

//   const { t } = useTranslation();

//   const handleMouseEnter = (index: any) => {
//     setLastHoveredIndex(index);
//   };

//   const handleMouseLeave = () => {
//     setLastHoveredIndex(null);
//   };

//   // const handleClickOpen = () => {
//   //   setOpen(true);
//   // };

//   const handleClose = () => {
//     // setOpen(false);
//     onClose(); 
//   };

//   const handleMapClose = () => {
//     setOpenMapDialog(false);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   useEffect(() => {
//     fetchData();
//     // handleClickOpen();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const collectData = {
//         categoryID: -1,
//       };

//       const response = await api.post(
//         "Dashboard/GetDashboardCategoryMaster",
//         collectData
//       );

//       console.log("data", response.data.data);
//       setCategories(response.data.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const handleDialogClose = (event: any, reason: string) => {
//     if (reason === "backdropClick") {
//       return;
//     }
//     handleClose();
//   };

//   const handleCategoryClick = (categoryName: any) => {
//     const selectedCategory = categories.find(
//       (category) => category.categoryName === categoryName
//     );
//     setSelectedCategory(selectedCategory || null);
//     setOpenDialog(true);
//   };

//   const handleSubcategoryClick = async (
//     categoryId: any,
//     subcategoryId: any
//   ) => {
//     console.log("Category ID:", categoryId);
//     console.log("Subcategory ID:", subcategoryId);
//     try {
//       const locationData = await fetchGeoLocationData(
//         categoryId,
//         subcategoryId
//       );
//       console.log("Location data:", locationData);
//       setLocations(locationData);
//       setOpenMapDialog(true);
//     } catch (error) {
//       console.error("Error fetching geolocation data:", error);
//     }
//   };

//   const fetchGeoLocationData = async (id1: any, id2: any) => {
//     try {
//       const collectData = {
//         adLocationID: -1,
//         zoneID: 0,
//         wardID: 0,
//         categoryID: id1,
//         subCategoryID: id2,
//         user_ID: 0,
//         isActive: true,
//       };

//       const response = await api.post(
//        "AdvertiseLocation/GetAdvertiseLocation",
//         collectData
//       );
//       console.log("location", response.data.data);

//       const locationData = response.data.data.map((item: any) => ({
//         areaName: item.areaName,
//         latitude: item.latitute,
//         longitude: item.longitude,
//       }));
//       console.log("Location data:", locationData);

//       return locationData;
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   return (
//     <React.Fragment>
//       <Dialog
//         fullScreen
//         open={open}
//         onClose={handleDialogClose}
//         TransitionComponent={Transition}
//         sx={{ width: "20%" }}
//       >
//         <AppBar
//           sx={{
//             position: "relative",
//             // "background-image": "linear-gradient(to right, #00395d, #8f8f8c)",
//             background: "#FF7722"
//           }}
//         >
//           <Toolbar>
//             <Typography sx={{ ml: 1, flex: 1 }} variant="h6" component="div">
//               Category Details
//             </Typography>
//             <IconButton
//               edge="start"
//               color="inherit"
//               onClick={handleClose}
//               aria-label="close"
//             >
//               <CloseIcon />
//             </IconButton>
//           </Toolbar>
//         </AppBar>
//         <div style={{ padding: "15px 12px" }}>
//           {categories?.map((category: any, index: any) => (
//             <List key={category.categoryID}>
//               <div
//                 onMouseEnter={() => handleMouseEnter(index)}
//                 onMouseLeave={handleMouseLeave}
//                 style={{
//                   backgroundColor:
//                     lastHoveredIndex === index ? "#f0f0f0" : "inherit",
//                   color: lastHoveredIndex === index ? "red" : "black",
//                   cursor: "pointer",
//                 }}
//               >
//                 <ListItemText
//                   primary={category.categoryName}
//                   sx={{ fontSize: "25px" }}
//                   onClick={() => handleCategoryClick(category.categoryName)}
//                 />
//               </div>
//               <Divider />
//             </List>
//           ))}
//         </div>
//       </Dialog>

//       {openDialog && selectedCategory && (
//         <Dialog
//           open={openDialog}
//           onClose={handleCloseDialog}
//           TransitionComponent={Transitions}
//           // sx={{ width: "100%" }}
//           maxWidth="md"
//         >
//           <AppBar
//             sx={{
//               position: "relative",
//               // "background-image": "linear-gradient(to right, #00395d, #8f8f8c)",
//               background: "#FF7722"
//             }}
            
//           >
//             <Toolbar>
//               <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
//                 {selectedCategory &&
//                   `${selectedCategory?.categoryName} Details`}
//               </Typography>
//             </Toolbar>
//           </AppBar>

//           <TableContainer sx={{ width: "100%" }}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell align="center" style={{fontSize:"18px", fontWeight:600, width: "10%" }}>Sr. No.</TableCell>
//                   <TableCell align="center" style={{fontSize:"18px", fontWeight:600}}>Subcategory Name</TableCell>
//                   {/* <TableCell align="center">Remark</TableCell> */}
//                   {/* <TableCell align="center">Status</TableCell> */}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {selectedCategory?.dashboardSubCategory?.map(
//                   (subcategory: any, index: any) => (
//                     <TableRow
//                       key={index}
//                       onClick={() =>
//                         handleSubcategoryClick(
//                           selectedCategory.categoryID,
//                           subcategory.subCategoryID
//                         )
//                       }
//                       style={{cursor:"pointer"}}
//                     >
//                       <TableCell align="center">{index + 1}</TableCell>
//                       <TableCell style={{fontSize:"17px"}}>{subcategory.subCategoryName}</TableCell>
//                       {/* <TableCell>{subcategory.remark}</TableCell> */}
//                       {/* <TableCell>
//                         {subcategory.isActive === true ? (
//                           <Chip
//                             label={t("text.Active")}
//                             color="success"
//                             style={{ fontSize: "14px" }}
//                           />
//                         ) : (
//                           <Chip
//                             label={t("text.InActive")}
//                             color="error"
//                             style={{ fontSize: "14px" }}
//                           />
//                         )}
//                       </TableCell> */}
//                     </TableRow>
//                   )
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Dialog>
//       )}

//       <Dialog
//         fullScreen
//         open={openMapDialog}
//         onClose={handleCloseDialog}
//         TransitionComponent={Transition}
//       >
//         <AppBar
//           sx={{
//             position: "relative",
//             // "background-image": "linear-gradient(to right, #00395d, #8f8f8c)",
//             background: "#FF7722"
//           }}
//         >
//           <Toolbar>
//             <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
//               {selectedCategory &&
//                 `${selectedCategory?.categoryName} Map Locations`}
//             </Typography>
//           <IconButton
//             edge="start"
//             color="inherit"
//             onClick={handleMapClose}
//             aria-label="close"
//             >
//             <CloseIcon />
//           </IconButton>
//             </Toolbar>
//         </AppBar>

//         {/* {locations.length > 0 && <GoogleMapDetails locations={locations} />} */}
//         {locations.length > 0 ? (
//     <GoogleMapDetails locations={locations} />
//   ) : (
//     <div  style={{ display:"flex",alignItems:"center",justifyContent:"center", backgroundColor:"whitesmoke", height:"100%" }}>
//       <i  style={{fontSize:"20px", opacity: 1, transition: "opacity 1s ease-in-out"}}>Location data currently unavailable or Advertisement Location Deactivated.</i>
//       {/* <GoogleMapDetails locations={[{ areaName: "Kanpur", latitude: 26.4499, longitude: 80.3319 }]}/> */}
//     </div>
//   )}
//       </Dialog>
//     </React.Fragment>
//   );
// }
