import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface MenuPermission {
  isAdd: boolean;
  isEdit: boolean;
  isPrint: boolean;
  isDel: boolean;
}
export const usePermissionData = () => {
  const location = useLocation();
  const [permissionData, setPermissionData] = useState<MenuPermission>({
    isAdd: false,
    isEdit: false,
    isPrint: false,
    isDel: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataString = localStorage.getItem("userdata");
        if (dataString) {
          const data = JSON.parse(dataString);
          if (data && data.length > 0) {
            const userPermissionData = data[0]?.userPermission;
            if (userPermissionData && userPermissionData.length > 0) {
              const menudata = userPermissionData[0]?.parentMenu;
              for (let index = 0; index < menudata.length; index++) {
                const childMenudata = menudata[index]?.childMenu;
                const pathrow = childMenudata.find(
                  (x: any) => x.path === location.pathname
                );
                if (pathrow) {
                  // console.log("Setting permission data:", pathrow);
                  setPermissionData(pathrow);
                  break;
                }
              }
            }
          }
        }
      } catch (error) {
        // console.error("Error fetching permission data:", error);
      }
    };

    fetchData();
  }, [location]);

  // console.log("Permission Data (usePermissionData):", permissionData);

  return permissionData;
};
