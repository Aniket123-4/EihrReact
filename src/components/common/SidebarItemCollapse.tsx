import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import colorConfigs from "../../configs/colorConfigs";
import { RouteType } from "../../routes/config";
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import SidebarItem from "./SidebarItem";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useLocation } from "react-router-dom";
import React from "react";

type Props = {
  item: RouteType;
  collapsed?: boolean;
};

const SidebarItemCollapse = ({ item, collapsed = false }: Props) => {
  const [open, setOpen] = useState(false);
  const { appState } = useSelector((state: RootState) => state.appState);
  const location = useLocation();
  
  // Check if any child is active
  const isChildActive = (routes: RouteType[] | undefined): boolean => {
    if (!routes) return false;
    return routes.some(route => {
      if (location.pathname === route.path) return true;
      if (route.child) return isChildActive(route.child);
      return false;
    });
  };
  
  const hasActiveChild = isChildActive(item.child);
  
  useEffect(() => {
    if (hasActiveChild || appState.includes(item.state)) {
      setOpen(true);
    }
  }, [appState, item, hasActiveChild]);

  return (
    item.sidebarProps ? (
      <>
        <Tooltip title={collapsed ? item.sidebarProps.displayText : ""} placement="right" arrow>
          <ListItemButton
            onClick={() => !collapsed && setOpen(!open)}
            className={`sidebar-list-item ${hasActiveChild || open ? 'active' : ''}`}
            sx={{
              "&: hover": {
                backgroundColor: colorConfigs.sidebar.hoverBg
              },
              backgroundColor: hasActiveChild ? colorConfigs.sidebar.activeBg : "unset",
              paddingY: "10px",
              paddingX: collapsed ? "12px" : "16px",
              justifyContent: collapsed ? "center" : "space-between",
              borderRadius: "12px",
              margin: "4px 12px",
              transition: "all 0.2s ease",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <ListItemIcon sx={{
                color: hasActiveChild ? "var(--primary-color)" : colorConfigs.sidebar.color,
                minWidth: collapsed ? "auto" : "36px",
                justifyContent: "center",
              }}>
                {item.sidebarProps.icon && item.sidebarProps.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  disableTypography
                  primary={
                    <Typography sx={{ 
                      fontSize: "0.875rem", 
                      fontWeight: hasActiveChild ? 600 : 500,
                      color: hasActiveChild ? "var(--primary-color)" : "inherit"
                    }}>
                      {item.sidebarProps.displayText}
                    </Typography>
                  }
                />
              )}
            </Box>
            {!collapsed && (open ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />)}
          </ListItemButton>
        </Tooltip>
        {!collapsed && (
          <Collapse in={open} timeout="auto">
            <List component="div" disablePadding sx={{ pl: 2 }}>
              {item.child?.map((route, index) => (
                route.sidebarProps ? (
                  route.child ? (
                    <SidebarItemCollapse item={route} collapsed={collapsed} key={index} />
                  ) : (
                    <SidebarItem item={route} collapsed={collapsed} key={index} />
                  )
                ) : null
              ))}
            </List>
          </Collapse>
        )}
      </>
    ) : null
  );
};

// Import Box
import { Box } from "@mui/material";

export default SidebarItemCollapse;