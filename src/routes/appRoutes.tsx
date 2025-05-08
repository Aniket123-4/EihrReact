
import DoctorPatient from "../pages/Doctor/DoctorPatient";
import DrPatientStatus from "../pages/Patient/DrPatientStatus";
import AgeWiseSummary from "../pages/Patient/AgeWiseSummary";
import PatientCheckout from "../pages/Patient/PatientCheckout";
import LabServices from "../pages/Labservices/LabServices";

import UserManagement from "../pages/UserManagementMaster/UserManagement/UserManagement";
import UserManagementAdd from "../pages/UserManagementMaster/UserManagement/UserManagementAdd";
import UserManagementEdit from "../pages/UserManagementMaster/UserManagement/UserManagementEdit";


import HomePage from "../pages/home/HomePage";
import LoginPage from "../loginPage/LoginPage";
import { RouteType } from "./config";
import HomeIcon from "@mui/icons-material/Home";
import DashboardPageLayout from "../pages/master/MasterPageLayout";
import DashboardIndex from "../pages/master/MasterPageIndex";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";

import Login_Page from "../loginPage/Login_Page";

import PageNotFound from "../utils/PageNotFound";

import ChangePassword from "../pages/UserManagementMaster/UserManagement/ChangePassword";
import RoleFormPermission from "../pages/UserManagementMaster/UserManagement/RoleFormPermission";
import UserRolePermission from "../pages/UserManagementMaster/UserManagement/UserRolePermission";

import React from "react";
import PatientRegistrationAdd from "../pages/Patient/PatientRegistrationAdd";
import PatientRegistration from "../pages/Patient/PatientRegistration";
import PatientRegistrationEdit from "../pages/Patient/PatientRegistrationEdit";
import Reception from "../pages/Patient/Reception";


// Hospital
import VisitHistory from "../pages/Hospital/VisitHistory";
import ManageAppointment from "../pages/Hospital/ManageAppointment";
import Appointment from "../pages/Hospital/Appointment";
import AppointDoctor from "../pages/Hospital/AppointDoctor";
//medical store
import DirectItemReciept from "../pages/MedicalStore/DirectItemReceipt";
import ItemMaster from "../pages/MedicalStore/ItemMaster";
import SupplierMaster from "../pages/MedicalStore/SupplierMaster";
import ItemStatus from "../pages/MedicalStore/ItemStatus";

//billing 
import PatientBilling from "../pages/Billing/PatientBilling";
import HospitalBillingDetail from "../pages/Billing/HospitalBillingDetail";

//master
import DiseaseMaster from "../pages/Master/DiseaseMaster/DiseaseMaster";
//import ComplaintMaster from "../pages/Master/ComplaintMaster/ComplaintMaster";
import InvestigationParameter from "../pages/Master/InvestigationParameter/InvestigationParameter";
import InfraStructure from "../pages/Master/InfraStructure/InfraStructure";
import InvestigationServices from "../pages/Master/InvestigationServices/InvestigationServices";
import ComplaintMaster from "../pages/master/ComplaintMaster/ComplaintMaster";

const appRoutes: RouteType[] = [
  {
    index: true,
    element: <Login_Page />,
    state: "home",
  },
  {
    element: <HomePage />,
    state: "home",
    path: "/home",
    sidebarProps: {
      displayText: "Home",
      icon: <HomeIcon />,
    },
  },
   
  {
    path: "/Patient",
    element: <DashboardPageLayout />,
    state: "Patient",
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "Patient.index",
      },
      {
        path: "/Patient/PatientRegistrationAdd",
        element: <PatientRegistrationAdd />,
        state: "Patient.PatientRegistrationAdd",
      },
      {
        path: "/Patient/PatientRegistration",
        element: <PatientRegistration />,
        state: "Patient.PatientRegistration",
      },
      {
        path: "/Patient/PatientRegistrationEdit",
        element: <PatientRegistrationEdit />,
        state: "Patient.PatientRegistrationEdit",
      },
      {
        path: "/Patient/Reception",
        element: <Reception />,
        state: "Patient.Reception",
      },
      {
        path: "/Patient/PatientCheckOut",
        element: <PatientCheckout />,
        state: "Patient.PatientCheckOut",
      },
      {
        path: "/Patient/TokenNo",
        element: <AgeWiseSummary />,
        state: "Patient.TokenNo",
      },
      {
        path: "/Patient/DoctorPatientStatus",
        element: <DrPatientStatus />,
        state: "Patient.DoctorPatientStatus",
      },
    ],
  },

  {
    path: "/doctor",
    element: <DashboardPageLayout />,
    state: "doctor",
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "doctor.index",
      },
      {
        path: "/doctor/DoctorPatient",
        element: <DoctorPatient />,
        state: "doctor.DoctorPatient",
      },
    ],
  },

//hospital
  {
    path: "/Hospital",
    element: <DashboardPageLayout />,
    state: "Hospital",
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "Hospital.index",
      },
      {
        path: "/Hospital/ManageAppointment",
        element: <ManageAppointment/>,
        state: "Hospital.ManageAppointment",
      },
      {
        path: "/Hospital/VisitHistory",
        element: <VisitHistory />,
        state: "Hospital.VisitHistory",
      },
      {
        path: "/Hospital/Appointment",
        element: <Appointment />,
        state: "Hospital.Appointment",
      },
      {
        path: "/Hospital/Appointment",
        element: <Appointment />,
        state: "Hospital.Appointment",
      },
      {
        path: "/Hospital/AppointDoctor",
        element: <AppointDoctor />,
        state: "Hospital.AppointDoctor",
      },
    ],
  },
  //lab services 

  {
    path: "/lab",
    element: <DashboardPageLayout />,
    state: "labservices",
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "lab.index",
      },
      {
        path: "/lab/services/labservices",
        element: <LabServices />,
        state: "labservices.index",
      },
    ]
    },

  //MEDICAL STORE
  {
    path: "/medicalStore",
    element: <DashboardPageLayout />,
    state: "MedicalStore",
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "MedicalStore.index",
      },
      {
        path: "/medicalStore/itemMaster",
        element: <ItemMaster/>,
        state: "MedicalStore.itemMaster",
      },

      {
        path: "/medicalStore/directitemlot",
        element: <DirectItemReciept/>,
        state: "medicalStore.directItemReciept",
      },
      {
        path: "/medicalStore/itemStatus",
        element: <ItemStatus />,
        state: "medicalStore.itemStatus",
      },
      {
        path: "/medicalStore/SupplierMaster",
        element: <SupplierMaster />,
        state: "MedicalStore.SupplierMaster",
      },
    





    ],
  },

  //billing 
  {
    path: "/Billing",
    element: <DashboardPageLayout />,
    state: "Billing",
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "help.index",
      },

      {
        path: "/Billing/PatientBilling",
        element: <PatientBilling />,
        state: "Billing.PatientBilling",
      },
      {
        path: "/Billing/HospitalBillingDetail",
        element: <HospitalBillingDetail />,
        state: "Billing.HospitalBillingDetail",
      }
    ],
  },

  //master

  {
    path: "/master",
    element: <DashboardPageLayout />,
    state: "master",
    sidebarProps: {
      displayText: "Master",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "master.index",
      },
      {
        path: "/master/DiseaseMaster",
        element: <DiseaseMaster />,
        state: "master.DiseaseMaster",
        sidebarProps: {
          displayText: "Disease Master",
        },
      },
      {
        path: "/master/ComplaintMaster",
        element: <ComplaintMaster />,
        state: "master.ComplaintMaster",
        sidebarProps: {
          displayText: "Complaint Master",
        },
      },
      {
        path: "/master/investigationparameter",
        element: <InvestigationParameter />,
        state: "master.investigationparameter",
        sidebarProps: {
          displayText: "investigation parameter",
        },
      },
      {
        path: "/master/InfraStructure",
        element: <InfraStructure />,
        state: "master.InfraStructure",
        sidebarProps: {
          displayText: "InfraStructure",
        },
      },
      {
        path: "/master/InvestigationServices",
        element: <InvestigationServices />,
        state: "master.InvestigationServices",
        sidebarProps: {
          displayText: "Investigation Services",
        },
      },



    ],

  },



 

  {
    path: "/User",
    element: <DashboardPageLayout />,
    state: "User",
    sidebarProps: {
      displayText: "User Management",
      icon: <DashboardOutlinedIcon />,
    },
    child: [
      {
        index: true,
        element: <DashboardIndex />,
        state: "User.index",
      },
      {
        path: "/User/UserManagement",
        element: <UserManagement />,
        state: "User.UserManagement",
        sidebarProps: {
          displayText: "User Management",
        }
      },
      {
        path: "/User/UserManagementAdd",
        element: <UserManagementAdd />,
        state: "User.UserManagementAdd",
      },
      {
        path: "/User/UserManagementEdit",
        element: <UserManagementEdit />,
        state: "User.UserManagementEdit",
      },


      


      {
        path: "/User/ChangePassw",
        element: <ChangePassword />,
        state: "UserManagement.ChangePassw",
      },

      {
        path: "/User/ManageRoleForm",
        element: <RoleFormPermission />,
        state: "User.ManageRoleForm",
      },

      {
        path: "/User/UserRolePermission",
        element: <UserRolePermission />,
        state: "User.UserRolePermission",
      },


    

    ],
  },



  
  

  // {
  //   path: "/help",
  //   element: <DashboardPageLayout />,
  //   state: "help",
  //   child: [
  //     {
  //       index: true,
  //       element: <DashboardIndex />,
  //       state: "help.index",
  //     },

  //     {
  //       path: "/help/HelpCreation",
  //       element: <HelpCreation />,
  //       state: "help.HelpCreation",
  //     },


  //     {
  //       path: "/help/HelpDesk",
  //       element: <HelpDesk />,
  //       state: "help.HelpDesk",
  //     },

  //   ],
  // },

  {
    element: <PageNotFound/>,
    state: "pageNotFound",
    path: "*",
    sidebarProps: {
      displayText: "Page Not Found",   
    },
  },


];


export default appRoutes;

