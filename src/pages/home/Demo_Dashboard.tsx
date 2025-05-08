// import * as React from "react";
// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import ListItemText from "@mui/material/ListItemText";
// import ListItem from "@mui/material/ListItem";
// import List from "@mui/material/List";
// import Divider from "@mui/material/Divider";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import CloseIcon from "@mui/icons-material/Close";
// import axios from "axios";
// import HOST_URL from "../../utils/Url";

// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// import api from "../../utils/Url";

// export interface CategoryDataDetailProps {
//   open: boolean;
//   handleClose: () => void;
// }

// interface Category {
//   categoryID: number;
//   categoryName: string;
//   dashboardSubCategory: SubCategory[];
// }

// interface SubCategory {
//   subCategoryID: number;
//   subCategoryName: string;
// }

// export default function CategoryDataDetail({
//   open,
//   handleClose,
// }: CategoryDataDetailProps) {
//   const [data, setData] = React.useState<Category[]>([]);

//   React.useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const collectData = {
//       categoryID: -1,
//     };

//     const response = await api.post(
//      "Dashboard/GetDashboardCategoryMaster",
//       collectData
//     );
//     setData(response.data.data as Category[]);
//     console.log("check", response.data.data);
//   };

//   const [expandedCategories, setExpandedCategories] = React.useState<
//     Set<number>
//   >(new Set());

//   // const handleCategoryToggle = (categoryID: number) => {
//   //   setExpandedCategories((prevExpanded) => {
//   //     const newExpanded = new Set(prevExpanded);
//   //     if (newExpanded.has(categoryID)) {
//   //       newExpanded.delete(categoryID);
//   //     } else {
//   //       newExpanded.add(categoryID);
//   //     }
//   //     return newExpanded;
//   //   });
//   // };
//   const handleCategoryToggle = (categoryID: number) => {
//     setExpandedCategories((prevExpanded) => {
//       if (prevExpanded.has(categoryID)) {
//         return new Set();
//       }
//       return new Set([categoryID]);
//     });
//   };
//   return (
//     <div style={{borderRadius:"15px"}}>
//       <Dialog maxWidth="md" open={open} onClose={handleClose}>
//         <AppBar sx={{ position: "relative" }}>
//           <Toolbar
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "flex-end",
//               gap: 20,
//             }}
//           >
//             <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
//               Category List/Details
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
//         <div>
//           <List>
//             {data.map((category, index) => (
//               <div key={category.categoryID}>
//                 <ListItem
//                   onClick={() => handleCategoryToggle(category.categoryID)}
//                 >
//                   {expandedCategories.has(category.categoryID) ? (
//                     <KeyboardArrowUpIcon />
//                   ) : (
//                     <KeyboardArrowDownIcon />
//                   )}
//                   {/* <ListItemText primary={category.categoryName}  /> */}
//                   <p style={{ cursor: "pointer", fontSize: "22px" }}>
//                     {" "}
//                     {category.categoryName}{" "}
//                   </p>
//                 </ListItem>

//                 {expandedCategories.has(category.categoryID) && (
//                   <List>
//                     {category.dashboardSubCategory.length > 0 ? (
//                       category.dashboardSubCategory.map(
//                         (subCategory, subIndex) => (
//                           <ListItem key={subCategory.subCategoryID}>
//                             <p
//                               style={{
//                                 cursor: "pointer",
//                                 fontSize: "17px",
//                                 // paddingRight: "10px",
//                                 marginLeft: "20px",
//                               }}
//                             >
//                               {`${subIndex + 1}. ${
//                                 subCategory.subCategoryName
//                               }`}{" "}
//                             </p>
//                           </ListItem>
//                         )
//                       )
//                     ) : (
//                       <ListItem>
//                         <i>"No subcategory available"</i>
//                       </ListItem>
//                     )}
//                   </List>
//                 )}
//               </div>
//             ))}
//           </List>
//         </div>
//       </Dialog>
//     </div>
//   );
// }






// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import Box from '@mui/material/Box';
// // import Collapse from '@mui/material/Collapse';
// // import IconButton from '@mui/material/IconButton';
// // import Table from '@mui/material/Table';
// // import TableBody from '@mui/material/TableBody';
// // import TableCell from '@mui/material/TableCell';
// // import TableContainer from '@mui/material/TableContainer';
// // import TableHead from '@mui/material/TableHead';
// // import TableRow from '@mui/material/TableRow';
// // import Typography from '@mui/material/Typography';
// // import Paper from '@mui/material/Paper';
// // import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// // import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// // import Dialog from '@mui/material/Dialog';
// // import AppBar from '@mui/material/AppBar';
// // import Toolbar from '@mui/material/Toolbar';
// // import CloseIcon from '@mui/icons-material/Close';

// // const HOST_URL = 'your_host_url_here'; // Replace with your actual host URL

// // function CollapsibleTable() {
// //   const [categories, setCategories] = useState([]);
// //   const [openDialog, setOpenDialog] = useState(false);
// //   const [selectedCategory, setSelectedCategory] = useState(null);

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   const fetchData = async () => {
// //     try {
// //       const collectData = {
// //         categoryID: -1,
// //       };

// //       const response = await axios.post(
// //         HOST_URL + 'Dashboard/GetDashboardCategoryMaster',
// //         collectData
// //       );

// //       setCategories(response.data.data);
// //       console.log("check", response.data.data);
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //     }
// //   };

// //   const handleDialogOpen = (category) => {
// //     setSelectedCategory(category);
// //     setOpenDialog(true);
// //   };

// //   const handleDialogClose = () => {
// //     setOpenDialog(false);
// //   };

// //   return (
// //     <React.Fragment>
// //       <TableContainer component={Paper}>
// //         <Table aria-label="collapsible table">
// //           <TableHead>
// //             <TableRow>
// //               <TableCell />
// //               <TableCell>Category Name</TableCell>
// //               <TableCell>Subcategories</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {categories.map((category) => (
// //               <CategoryRow key={category.categoryID} category={category} onDialogOpen={handleDialogOpen} />
// //             ))}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>

// //       <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md">
// //         <AppBar sx={{ position: 'relative' }}>
// //           <Toolbar>
// //             <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
// //               Category Details
// //             </Typography>
// //             <IconButton edge="start" color="inherit" onClick={handleDialogClose} aria-label="close">
// //               <CloseIcon />
// //             </IconButton>
// //           </Toolbar>
// //         </AppBar>
// //         <TableContainer>
// //           <Table>
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>Category Name</TableCell>
// //                 <TableCell>Subcategory Name</TableCell>
// //                 <TableCell>Remark</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {selectedCategory && (
// //                 <TableRow key={selectedCategory.categoryID}>
// //                   <TableCell>{selectedCategory.categoryName}</TableCell>
// //                   <TableCell colSpan={2}>
// //                     <TableContainer>
// //                       <Table>
// //                         <TableBody>
// //                           {selectedCategory.dashboardSubCategory.map((subCategory) => (
// //                             <TableRow key={subCategory.subCategoryID}>
// //                               <TableCell>{subCategory.subCategoryName}</TableCell>
// //                               <TableCell>{subCategory.remark}</TableCell>
// //                             </TableRow>
// //                           ))}
// //                         </TableBody>
// //                       </Table>
// //                     </TableContainer>
// //                   </TableCell>
// //                 </TableRow>
// //               )}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       </Dialog>
// //     </React.Fragment>
// //   );
// // }

// // function CategoryRow(props) {
// //   const { category, onDialogOpen } = props;
// //   const [open, setOpen] = React.useState(false);

// //   return (
// //     <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
// //       <TableCell>
// //         <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
// //           {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
// //         </IconButton>
// //       </TableCell>
// //       <TableCell>{category.categoryName}</TableCell>
// //       <TableCell>
// //         <Collapse in={open} timeout="auto" unmountOnExit>
// //           <Box sx={{ margin: 1 }}>
// //             <Typography variant="h6" gutterBottom component="div">
// //               Subcategories
// //             </Typography>
// //             <Table size="small" aria-label="subcategories">
// //               <TableBody>
// //                 {category.dashboardSubCategory.map((subCategory) => (
// //                   <TableRow key={subCategory.subCategoryID}>
// //                     <TableCell>{subCategory.subCategoryName}</TableCell>
// //                     <TableCell>{subCategory.remark}</TableCell>
// //                   </TableRow>
// //                 ))}
// //               </TableBody>
// //             </Table>
// //             <IconButton onClick={() => onDialogOpen(category)}>View Details</IconButton>
// //           </Box>
// //         </Collapse>
// //       </TableCell>
// //     </TableRow>
// //   );
// // }

// // export default CollapsibleTable;
