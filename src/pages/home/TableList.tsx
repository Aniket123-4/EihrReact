// import {
//     Card,
//     Divider,
//     Grid,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Typography,
//   } from "@mui/material";
//   import React, { useState } from "react";
//   import Table from "@mui/material/Table";
//   import TablePagination from "@mui/material/TablePagination";
  
//   interface Column {
//     id: "vehicle" | "driver" | "total_trip" | "total_weight";
//     label: string;
//     minWidth?: number;
//     format?: (value: number) => string;
//   }
  
//   const columns: readonly Column[] = [
//     { id: "vehicle", label: "Vehicle", minWidth: 100 },
//     { id: "driver", label: "Driver", minWidth: 170 },
//     {
//       id: "total_trip",
//       label: "Total Trip",
//       minWidth: 170,
//       format: (value: number) => value.toLocaleString("en-US"),
//     },
//     {
//       id: "total_weight",
//       label: "Total Weight",
//       minWidth: 170,
//       format: (value: number) => value.toLocaleString("en-US"),
//     },
//   ];
//   interface Data {
//     vehicle: string;
//     driver: string;
//     total_trip: string;
//     total_weight: string;
//   }
  
//   function createData(
//     vehicle: string,
//     driver: string,
//     total_trip: string,
//     total_weight: string
//   ): Data {
//     return { vehicle, driver, total_trip, total_weight };
//   }
  
//   const rows = [
//     createData("xyz", "xyz", "xyz", "xyz"),
//     createData("xyz", "xyz", "xyz", "xyz"),
//     createData("xyz", "xyz", "xyz", "xyz"),
//     createData("xyz", "xyz", "xyz", "xyz"),
//     createData("xyz", "xyz", "xyz", "xyz"),
//     createData("xyz", "xyz", "xyz", "xyz"),
//     createData("xyz", "xyz", "xyz", "xyz"),
//     createData("xyz", "xyz", "xyz", "xyz"),
//     createData("xyz", "xyz", "xyz", "xyz"),
//     createData("xyz", "xyz", "xyz", "xyz"),
//     createData("xyz", "xyz", "xyz", "xyz"),
//     createData("xyz", "xyz", "xyz", "xyz"),
//     createData("xyz", "xyz", "xyz", "xyz"),
//   ];
  
//   export default function TableList() {
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const handleChangePage = (event: unknown, newPage: number) => {
//       setPage(newPage);
//     };
//     const handleChangeRowsPerPage = (
//       event: React.ChangeEvent<HTMLInputElement>
//     ) => {
//       setRowsPerPage(+event.target.value);
//       setPage(0);
//     };
  
//     return (
//       <>
//         {/* <Typography 
//         gutterBottom
//         variant='h5'
//         component='div'
//         sx={{ backgroundColor: "#03B03E" ,padding:'10px'}} 
//         >
//           Top 10 Lightest Vehicle
//         </Typography>
//         <Divider /> */}
  
//         <TableContainer>
//           <Table stickyHeader aria-label="sticky table">
//             <TableHead>
//               <TableRow>
//                 {columns.map((column) => (
//                   <TableCell
//                     key={column.id}
//                     style={{
//                       minWidth: column.minWidth,
//                     }}
//                     sx={{ backgroundColor: "#03B03E" }}
//                   >
//                     {column.label}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {rows
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((row) => {
//                   return (
//                     <TableRow
//                       hover
//                       role="checkbox"
//                       tabIndex={-1}
//                       key={row.driver}
//                     >
//                       {columns.map((column) => {
//                         const value = row[column.id];
//                         return (
//                           <TableCell
//                             key={column.id}
//                             // align={column.align}
//                           >
//                             {column.format && typeof value === "number"
//                               ? column.format(value)
//                               : value}
//                           </TableCell>
//                         );
//                       })}
//                     </TableRow>
//                   );
//                 })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25, 100]}
//           component="div"
//           count={rows.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </>
//     );
//   }
  