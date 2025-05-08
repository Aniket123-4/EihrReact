// import React, { useEffect } from 'react';
// declare var google: any;
// interface Location {
//   areaName: string;
//   latitude: number;
//   longitude: number;
// }

//   const GoogleMapDetails = ({ locations }: { locations: Location[] }) => {
//       useEffect(() => {
//         const initMap = () => {
//           const center = { lat: 26.4499, lng: 80.3319 };
//           const mapDiv = document.getElementById('map');

//           var infowindow = new google.maps.InfoWindow();

//           if (mapDiv) {
//             const map = new google.maps.Map(mapDiv, {
//               zoom: 12,
//               center: center,
//             });
    
//             locations.forEach((location:any) => {
//               if (!isNaN(location.latitude) && !isNaN(location.longitude)) {
//                 var marker = new google.maps.Marker({
//                   position: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) },
//                   map: map,
//                   title: (location.areaName)
                  
//                 });

                
//                 marker.addListener('click', function() {
//                   // Example: You can show a popup with location details
//                   alert("Location Name: " + location.areaName + "\nLatitude: " + location.latitude + "\nLongitude: " + location.longitude);
//               });
      
//               // Add mouseover event listener to show location name
//               marker.addListener('mouseover', function() {
//                   // Example: You can display location name on hover
//                   var infowindow = new google.maps.InfoWindow({
//                       content: location.areaName
//                   });
//                   infowindow.open(map, marker);
//               });
      
//               // Add mouseout event listener to close location name display
//               marker.addListener('mouseout', function() {
//                   // Close the infowindow
//                   infowindow.close();
//               });
//               }
//             });
//           } else {
//             console.error("Map div not found in the DOM");
//           }
//         };
    
//         if (google && google.maps) {
//           initMap();
//         } else {
//           console.error("Google Maps API not loaded");
//         }
//       }, [locations]);
    
//       return (
//         <div id="map" style={{ height: '100%', width: '100%' }}></div>
//       );
//     }
  




// export default GoogleMapDetails;

// // const GoogleMapDetails = ({ locations }) => {
// //     useEffect(() => {
// //       let initMap = () => {
// //         const center = { lat: 26.4499, lng: 80.3319 }; 
// //         const map = new google.maps.Map(document.getElementById('map'), {
// //           zoom: 10,
// //           center: center,
// //         });
  
// //         locations.forEach(location => {
// //           if (!isNaN(location.latitude) && !isNaN(location.longitude)) {
// //             new google.maps.Marker({
// //               position: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) },
// //               map: map
// //             });
// //           }
// //         });
// //       };
  
// //       if (google && google.maps) {
// //         initMap();
// //       } else {
// //         initMap = initMap;
// //       }
// //     }, [locations]);
  
// //     return (
// //       <div id="map" style={{ height: '400px', width: '100%' }}></div>
// //     );
// //   }

// // const GoogleMapDetails = ({ locations }) => {
// //     useEffect(() => {
// //       let initMap = () => {
// //         const center = { lat: 26.4499, lng: 80.3319 }; 
// //         const map = new google.maps.Map(document.getElementById('map'), {
// //           zoom: 10,
// //           center: center,
// //         });
  
// //         locations.forEach((location:any) => {
// //           new google.maps.Marker({
// //             position: { lat: location.latitude, lng: location.longitude },
// //             map: map
// //           });
// //         });
// //       };
  
// //       if (google && google.maps) {
// //         initMap();
// //       } else {
// //         // Handle the case when the Google Maps API is not loaded
// //       }
// //     }, [locations]); // Run useEffect when locations change
  
// //     return (
// //       <div id="map" style={{ height: '400px', width: '100%' }}></div>
// //     );
// //   }
  


  
// // const GoogleMapDetails = () => {

// //     useEffect(() => {
// //         let initMap = () => {
// //             const center = { lat: 26.4499, lng: 80.3319 }; 
// //             const map = new google.maps.Map(document.getElementById('map'), {
// //                 zoom: 10,
// //                 center: center,
// //             });

// //             var locations = [
// //                 { lat: 26.492607, lng: 80.301811 }, 
// //                 { lat: 26.4562, lng: 80.3494 }, 
// //                 { lat: 26.4687, lng: 80.3656 }, 
// //                 { lat: 26.4018, lng: 80.3145 }, 
// //                 { lat: 26.4746, lng: 80.3262 }, 
// //             ];

// //             locations.forEach(location => {
// //                 new google.maps.Marker({
// //                     position: location,
// //                     map: map
// //                 });
// //             });
// //         };
// //         if (google && google.maps) {
// //             initMap();
// //         } else {
// //             initMap = initMap;
// //         }
// //     }, []);
// //     return (
// //         <div id="map" style={{ height: '400px', width: '100%' }}></div>
// //     );
// // }
