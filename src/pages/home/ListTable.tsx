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
// } from "@mui/material";
// // import { H5, Small } from "components/Typography";
// import { FC, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
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

// const ListTable = (props: { data: any }) => {
//   return (
//     <>
//     <Card sx={{ padding: "2rem" }} 
//     // style={{height:"450px"}}
//     >
//       {/* <H5>Recent Orders</H5> */}
//       <Grid
//       style={{
//         width:"100%",
//         height:350,
//         overflowY:"hidden",
//       }}
//       >
//       <ScrollBar>
//         <Table>
//           <TableHead
//             sx={{ borderBottom: "1.5px solid", borderColor: "divider" }}
//           >
//             <TableRow>
//               <HeadTableCell>Vehicle</HeadTableCell>
              
//               <HeadTableCell>Total Trip</HeadTableCell>
//               <HeadTableCell>Total Weight </HeadTableCell>
//               {/* <HeadTableCell>From Date</HeadTableCell>
//               <HeadTableCell>To Date</HeadTableCell> */}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {props.data.map((item: { vehicleNo: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; totalNoOfTrip: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; totalWeight: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;  }, index: Key | null | undefined) => (
//               <TableRow key={index}>
//                 <BodyTableCell>{item.vehicleNo}</BodyTableCell>
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
//                     {item.totalNoOfTrip}
//                   </Box>
//                 </BodyTableCell>
//                 <BodyTableCell>{item.totalWeight}</BodyTableCell>
//                 {/* <BodyTableCell>
//                   <Box display="flex" alignItems="center">
                 
//                     <Small ml="1rem">{item.fromDate}</Small>
//                   </Box>
//                 </BodyTableCell>
//                  <BodyTableCell>{item.toDate}</BodyTableCell>  */}
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
//    {
//     vehicle: "UP78GN/4991",
//     Driver_name: "Harsh",
//     total_trip: "xyz",
//     total_weight: 458,
//   },
//    {
//     vehicle: "UP78GN/4993",
//     Driver_name: "Harsh",
//     total_trip: "xyz",
//     total_weight: 458,
//   },
//    {
//     vehicle: "UP78GN/4994",
//     Driver_name: "Harsh",
//     total_trip: "xyz",
//     total_weight: 458,
//   },
//    {
//     vehicle: "UP78GN/4995",
//     Driver_name: "Harsh",
//     total_trip: "xyz",
//     total_weight: 458,
//   },
  
// ];

// export default ListTable;
