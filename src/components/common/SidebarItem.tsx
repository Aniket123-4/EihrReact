import { ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import colorConfigs from "../../configs/colorConfigs";
import { RootState } from "../../redux/store";
import { RouteType } from "../../routes/config";
import React from "react";

type Props = {
  item: RouteType;
  collapsed?: boolean;
};

const SidebarItem = ({ item, collapsed = false }: Props) => {
  const { appState } = useSelector((state: RootState) => state.appState);
  const location = useLocation();
  
  const isActive = location.pathname === item.path || appState === item.state;

  return (
    item.sidebarProps && item.path ? (
      <Tooltip title={collapsed ? item.sidebarProps.displayText : ""} placement="right" arrow>
        <ListItemButton
          component={Link}
          to={item.path}
          className={`sidebar-list-item ${isActive ? 'active' : ''}`}
          sx={{
            "&: hover": {
              backgroundColor: colorConfigs.sidebar.hoverBg
            },
            backgroundColor: isActive ? colorConfigs.sidebar.activeBg : "unset",
            paddingY: "10px",
            paddingX: collapsed ? "12px" : "16px",
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: "12px",
            margin: "4px 12px",
            transition: "all 0.2s ease",
          }}
        >
          <ListItemIcon sx={{
            color: isActive ? "var(--primary-color)" : colorConfigs.sidebar.color,
            minWidth: collapsed ? "auto" : "36px",
            justifyContent: "center",
          }}>
            {item.sidebarProps.icon && item.sidebarProps.icon}
          </ListItemIcon>
          {!collapsed && (
            <ListItemText 
              primary={item.sidebarProps.displayText}
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: isActive ? 600 : 500,
              }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    ) : null
  );
};

export default SidebarItem;