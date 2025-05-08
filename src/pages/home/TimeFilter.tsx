// import React from "react";
// import { useState, useEffect } from "react";
// import dayjs, { Dayjs } from "dayjs";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import Button from "@mui/material/Button";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { Box, Stack, Checkbox, FormControlLabel, Grid, Card } from "@mui/material";
// import axios from "axios";
// import { VehicleRfid } from "../../type";
// import HOST_URL from '../../utils/Url';
// import api from "../../utils/Url";


// export default function TimeFilter() {
//   const [value, setValue] = useState<Dayjs | null>(dayjs("2022-04-17"));
//   const [vehicleList, setVehicleList] = useState<VehicleRfid[]>([]);
//   var [vehicleIds, setVehicleIds] = useState<any[]>([0]);
//   const [data2, setData2] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [visible, setVisble] = useState(false);
//   const [data1, setData] = useState<any[]>([
//     ["Element", "Trip", { role: "style" }],
//     ["23/06/2023", 8.94, "blue"],
//   ]);

//   const [checkedState, setCheckedState] = useState<any>(
//     new Array(vehicleList.length).fill(false)
//   );
//   const handleChange = (vehicleId: number, index: number) => {
//     let isChecked =
//       // if(checkedState[index]==false)

//       // vehicleList.map(vl => vehicleIds.push(vl.vehileID))
//       console.log(checkedState[0]);
//     setCheckedState(!checkedState[index]);

//     if (checkedState == false) {
//       const tempIndex = vehicleIds.indexOf(index);
//       if (index > -1) {
//         // only splice array when item is found
//         vehicleIds.splice(tempIndex, 1); // 2nd parameter means remove one item only
//       }
//     }
//     if (checkedState == true) {
//       vehicleIds.push(vehicleId);
//       // checkedState.map(i => console.log(checkedState[0]));
//       setVehicleIds(vehicleIds);
//       getVehicleWeightSummary(vehicleIds);
//     }
//   };

//   useEffect(() => {
//     getVehicleList();
//     // getVehicleWeightSummary();
//   }, []);
//   const getVehicleList = () => {
//     api
//       .post(
//         `eScrapSolidWasteReport/GetVehicleRfid`
//       )
//       .then((res) => {
//         //http://103.20.213.26:48950 --(dummy api)
//         //http://103.20.213.26:7080
//         // console.log(res.data.result[0].vehicleNo)
//         // console.log(res.data.result)
//         setVehicleList(res.data.result);
//       });
//   };

//   const getVehicleWeightSummary = (vehicleID: Array<any> = []) => {
//     setLoading(false);
//     let vehArr = "";
//     vehArr = `[${vehicleID}]`;
//     let param = {
//       fromDate: "2023-06-24T05:17:37.241Z",
//       toDate: "2023-07-01T05:17:37.241Z",
//       vehileID: vehArr,
//       allVehicles: true,
//     };
//     console.log(param);
//     api
//       .post(`Vehicle/VehicleWasteSummay`, param)
//       .then((res) => {
//         // console.log(res.data.serializeData)
//         setData2(JSON.parse(res.data.serializeData));
//         console.log("data22222222" + data2);
//         const arr: any = [];
//         for (var i of data2) {
//           arr.push(Object.values(i));
//         }
//         arr.unshift(["Element", "Trip", { role: "style" }]);
//         setData(arr);
//         setLoading(true);
//       });
//   };

//   return (
//     <>
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <DemoContainer components={[]}>
//           <DatePicker label="From Date" defaultValue={dayjs("2022-04-17")} />
//           <DatePicker
//             label="To Date"
//             value={value}
//             // sx={{left:"50px"}}
//             onChange={(newValue) => setValue(newValue)}
//           />
//         </DemoContainer>
//       </LocalizationProvider>
//       <Box height={"10px"} />
//       <Stack direction="row" spacing={2}>
//         <Button variant="contained" id="download">
//           Show
//         </Button>
//         <Button variant="contained" id="download">
//           Download
//         </Button>
//         <Button
//           variant="contained"
//           // content="contained"
//           endIcon={<ExpandMoreIcon />}
//           onClick={() => setVisble(!visible)}
//         >
//           {visible ? "Show Table" : "Show Table"}
//         </Button>
//       </Stack>




//       {/* CheckBox */}

//       <Card
//         elevation={4}
//         style={{
//           //   width: "90%",
//           //   height: "100%",
//           marginTop: "3%",
//           marginLeft: "2%",
//           // backgroundColor: "#E9FDEE",
//           border: ".5px Solid green",
//         }}
//         sx={{
//           px: 1,
//         }}
//       >
//         <Grid
//           style={{
//             display: visible ? "block" : "none",
//             width: "100%",
//             height: 200,
//             backgroundColor: "white",
//             overflowY: "scroll",
//             margin: 10,
//           }}
//         >
//           {vehicleList.map((item, index: number) => (
//             <FormControlLabel
//               style={{ marginLeft: 10, width: 160 }}
//               control={
//                 <Checkbox
//                   checked={checkedState[index]}
//                   onChange={() => handleChange(item.vehileID, index)}
//                 />
//               }
//               label={item.vehicleNo}
//             />
//           ))}
//         </Grid>
//       </Card>


//     </>
//   );
// }
