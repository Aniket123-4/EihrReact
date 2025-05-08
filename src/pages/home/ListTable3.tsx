// import {
//   Box,
//   Card,
//   styled,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Grid,
//   Typography,
// } from "@mui/material";
// // import { H5, Small } from "components/Typography";
// import { FC } from "react";
// import ScrollBar from "simplebar-react";
// import { H5, Small } from "./Typography";
// import React from "react";

// const commonCSS = {
//   minWidth: 120,
//   "&:nth-of-type(2)": { minWidth: 170 },
//   "&:nth-of-type(3)": { minWidth: 80 },
// };

// // Styled components
// const HeadTableCell = styled(TableCell)(() => ({
//   fontSize: 12,
//   fontWeight: 600,
//   "&:first-of-type": { paddingLeft: 0 },
//   "&:last-of-type": { paddingRight: 0 },
// }));

// const BodyTableCell = styled(TableCell)(({ theme }) => ({
//   fontSize: 12,
//   fontWeight: 500,
//   padding: 0,
//   paddingLeft: "1rem",
//   paddingTop: "0.7rem",
//   "&:first-of-type": { paddingLeft: 0 },
//   "&:last-of-type": { paddingRight: 0 },
//   [theme.breakpoints.down("sm")]: { ...commonCSS },
//   [theme.breakpoints.between(960, 1270)]: { ...commonCSS },
// }));

// const ListTable3: FC = () => {
//   return (
//     <>
//     <Card sx={{ padding: "2rem" }} 
//     // style={{height:"450px"}}
//     >
//       <Typography
//       gutterBottom
//       variant="h5"
//       component="div"
//       sx={{ backgroundColor: "#03B03E", padding: "10px" }}
//       >
//         Total Active Vehicle
//       </Typography>
//       {/* <H5>Recent Orders</H5> */}
//       <Grid
//       style={{
//         width:"100%",
//         height:200,
//         overflowY:"scroll",
//       }}
//       >
//       <ScrollBar>
//         <Table>
//           <TableHead
//             sx={{ borderBottom: "1.5px solid", borderColor: "divider" }}
//           >
//             <TableRow>
//               <HeadTableCell>Vehicle</HeadTableCell>
//               <HeadTableCell>Driver Name</HeadTableCell>
//               <HeadTableCell>Total Trip</HeadTableCell>
//               <HeadTableCell>Total Weight</HeadTableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {orderList.map((item, index) => (
//               <TableRow key={index}>
//                 <BodyTableCell>{item.vehicle}</BodyTableCell>
//                 <BodyTableCell>
//                   <Box display="flex" alignItems="center">
//                     {/* <img src={item.Driver_name} alt="product title" width="40px" /> */}
//                     <Small ml="1rem">{item.Driver_name}</Small>
//                   </Box>
//                 </BodyTableCell>
//                 <BodyTableCell>{item.total_weight}</BodyTableCell>
//                 <BodyTableCell>
//                   <Box
//                     sx={{
//                       backgroundColor: "secondary.200",
//                       borderRadius: 11,
//                       maxWidth: 55,
//                       padding: "0.3rem",
//                       textAlign: "center",
//                       color: "secondary.400",
//                     }}
//                   >
//                     {item.total_trip}
//                   </Box>
//                 </BodyTableCell>
//                 {/* <BodyTableCell>{item.totalAmount}</BodyTableCell> */}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </ScrollBar>
//       </Grid>
//     </Card>
//     </>
//   );
// };

// const orderList = [
//   {
//     vehicle: "UP78BG/8050",
//     Driver_name: "Anil",
//     total_trip: "xyz",
//     total_weight: 654,
//   },
//   {
//     vehicle: "UP77AN/0069",
//     Driver_name: "Abhishek",
//     total_trip: "xyz",
//     total_weight: 548,
//   },
//   {
//     vehicle: "UP78BG/8070",
//     Driver_name: "Saurabh Gupta",
//     total_trip: "xyz",
//     total_weight: 874,
//   },
//   {
//     vehicle: "UP78GN/4992",
//     Driver_name: "Harsh",
//     total_trip: "xyz",
//     total_weight: 458,
//   },
  
// ];

// export default ListTable3;
