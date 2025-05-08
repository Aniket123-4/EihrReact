import React from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Box, Divider, IconButton, Typography, Avatar, Paper, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { keyframes } from "@mui/system";

const slideIn = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(0); }
`;

const Header = styled(Box)(({ theme }) => ({
  padding: "16px",
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: "#007FFF",
  color: "white",
  borderRadius: "10px 10px 0 0",
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
  animation: `${slideIn} 0.5s ease-out`,
  position: "sticky",  // Added sticky positioning
  top: 0,              // Ensuring it sticks to the top
  zIndex: 1301,        // To ensure the header stays above other elements
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "18px",  
  fontWeight: "600",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 40, // Reduced avatar size
  height: 40,
  backgroundColor: theme.palette.secondary.main,
  fontSize: "16px", // Reduced font size in avatar
  fontWeight: "bold",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const EmployeeCard = styled(Paper)(({ theme }) => ({
  padding: "8px",  // Reduced padding for a more compact look
  borderRadius: "10px",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#F5F5F5",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",  // Reduced margin
  transition: "box-shadow 0.3s ease, transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.2)",
  },
}));

const EmployeeInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px", // Reduced gap
}));

const EmployeeName = styled(Typography)(({ theme }) => ({
  fontWeight: "500",  // Reduced font weight for a more professional look
  fontSize: "14px",   // Reduced font size for employee names
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: "white",
  fontSize: "24px",
  backgroundColor: theme.palette.primary.main,
  borderRadius: "50%",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const TableContainer = styled(Box)(({ theme }) => ({
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
}));

const NoEmployeesMessage = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  color: theme.palette.text.secondary,
  textAlign: "center",
  marginTop: "20px",
}));

interface Props {
  open: boolean;
  onClose: () => void;
  rostData: any;
}

function RosterComponent({ open, onClose, rostData }: Props) {
  const { t } = useTranslation();

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={handleClose}
        onOpen={() => {}}
        PaperProps={{
          style: {
            borderRadius: "20px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            width: "30%",
            animation: `${slideIn} 0.5s ease-out`,
          },
        }}
        sx={{ zIndex: 1300 }}
      >
        <Header>
          <Title>{t("text.RosterGroup")}</Title>
          <StyledIconButton onClick={handleClose}>
            <CloseIcon />
          </StyledIconButton>
        </Header>

        <TableContainer>
          {rostData[0]?.rosterGroupChild && Array.isArray(rostData[0]?.rosterGroupChild) && rostData[0]?.rosterGroupChild.length > 0 ? (
            rostData[0]?.rosterGroupChild.map((row: any, index: any) => (
              <EmployeeCard key={index}>
                <EmployeeInfo>
                  <StyledAvatar>{row.empName?.charAt(0)}</StyledAvatar>
                  <EmployeeName>{row.empName || "No Name"}</EmployeeName>
                </EmployeeInfo>
              </EmployeeCard>
            ))
          ) : (
            <NoEmployeesMessage>{"No Employees Available"}</NoEmployeesMessage>
          )}
        </TableContainer>
      </SwipeableDrawer>
    </div>
  );
}

export default RosterComponent;
