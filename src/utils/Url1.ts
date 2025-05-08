export default {

    //HOST_URL: `https://localhost:59928/api/`,
   // HOST_URL: `http://103.12.1.132:8044/api/`,
HOST_URL: `http://103.12.1.132:8155/api/`,
   HOST_URL2: `https://escrapreactapi.mssplonline.in:8099/api/`,
//    HOST_URL: `https://amsapi.mssplonline.in:8101/api/`,
    //: 'https://amsapi.mssplonline.in:8101/api/',
  
    SIDE_MENU: `CategorySubCategory/CategorySubCategory`,
    LIST_DATA: `CategorySubCategory/GetCatCompList`, //?categoryID=6&subCategoryID=-1&pageID=1&userID=-1&formID=-1&type=1
    GET_DETAIL: `CategorySubCategory/GetCatCompDetail`,
    ADD_FEEDBACK: `CategorySubCategory/AddCompRating`, 
    REGISTRATION: `CategorySubCategory/AddUser`,
    LOGIN:'CategorySubCategory/VerifyUser',
    ADD_USER: `CategorySubCategory/AddUser`,
    ADD_COMPLAINT:`CategorySubCategory/AddAppComplaint`,
    CHANGE_PASSWORD:`CategorySubCategory/ChangePwd`,
    DASHBOARD_MENU: `CategorySubCategory/CategorySubCategoryDashboard`,


    WEB_REGISTRATION:"http://smartcityappkanpur.mssplonline.in/register",
    WEB_ADD_COMPLAINT:"http://smartcityappkanpur.mssplonline.in",
    
    REVIEW_LIST:"Company/GetCompRating"
}

