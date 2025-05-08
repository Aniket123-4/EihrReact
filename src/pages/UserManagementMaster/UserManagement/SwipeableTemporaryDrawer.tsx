// SwipeableTemporaryDrawer.js
import React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import call from "../../../assets/images/phone-call.png";
import roles from "../../../assets/images/role-model.png";
import tick from "../../../assets/images/check-mark.png";
import crs from "../../../assets/images/cross.png";
import log from "../../../assets/images/profile.png";
import emails from "../../../assets/images/gmail.png";
import genders from "../../../assets/images/symbol.png";
import dobs from "../../../assets/images/timetable.png";
import names from "../../../assets/images/id-card (2).png";
import id from "../../../assets/images/id-card (1).png";

import dayjs from "dayjs";

interface Props {
  open: boolean;
  onClose: () => void;
  userData: any;
}

function SwipeableTemporaryDrawer({ open, onClose, userData }: Props) {
  //   console.log("data", userData[0]);
  const getImageForFirstName = (
    firsT_NAME: any,
    middlE_NAME: any,
    suR_NAME: any
  ) => {
    const firstLetter = firsT_NAME ? firsT_NAME.charAt(0).toUpperCase() : "";
    const secondLetter = middlE_NAME ? middlE_NAME.charAt(0).toUpperCase() : "";
    const thirdLetter = suR_NAME ? suR_NAME.charAt(0).toUpperCase() : "";
    // console.log("fisrtlett", firstLetter);
    return `${firstLetter}${secondLetter}${thirdLetter}`;
  };

  const getGenderText = (gendeR_ID: any) => {
    switch (gendeR_ID) {
      case 1:
        return "Male";
      case 2:
        return "Female";
      case 3:
        return "Other";
      default:
        return null;
    }
  };

  return (
    <div>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={onClose}
        onOpen={() => {}}
        slotProps={{
          backdrop: {
            style: { backgroundColor: "rgba(0, 0, 0, 0)" },
          },
        }}
        PaperProps={{
          style: {
            boxShadow: "0px 0px 8px 0px rgba(0,0,0,0.2)",
            backgroundColor: "whitesmoke",
            // backgroundImage: `url(${require("../../../assets/images/id-card (1).png")})`
          },
        }}
        // style={{ boxShadow: "none",  }}
        style={{
          zIndex: 1300,
        }}
      >
        <Box sx={{ width: 260 }}>
          <p
            style={{
              paddingTop: "5vh",
              paddingBottom: "5vh",
              textAlign: "center",
              // textDecoration: "underline",
              backgroundImage:
                "linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)",
              color: "whitesmoke",
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
              fontSize: "20px",
            }}
          >
            User Profile
          </p>

          <div
            style={{
              backgroundImage: `url(${require("../../../assets/images/id-card (1).png")})`,
              height: "90%",
              width: "100%",
            }}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                  backgroundImage: `url(${require("../../../assets/images/id-card (1).png")})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div style={{ position: "relative" }}>
                  {userData.map((user: any, index: any) => (
                    <div key={index}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          style={{
                            textAlign: "center",
                            borderRadius: "50%",
                            height: "90px",
                            width: "90px",
                            borderColor:
                              "linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d)",
                            backgroundColor: "red",
                            padding: "13px",
                            paddingTop: "30px",
                            paddingLeft: "13px",
                            color: "whitesmoke",
                            fontSize: "20px",
                          }}
                        >
                          {getImageForFirstName(
                            user.firsT_NAME,
                            user.middlE_NAME,
                            user.suR_NAME
                          )}
                        </div>
                      </div>

                      <div style={{ marginLeft: "15px" }}>
                        {/* {user.logiN_NAME === null || user.logiN_NAME !== " "?" ":(<>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <img src={log} width={25} />{" "}
                  {user.logiN_NAME}
                </div>
                </>)} */}

                        {user.logiN_NAME && user.logiN_NAME.trim() !== "" && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 20,
                            }}
                          >
                            <img src={log} width={25} />
                            {user.logiN_NAME}
                          </div>
                        )}
                        <br />

                        {user.rolename !== null || user.rolename !== " " ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <img src={roles} width={25} />
                            {user.rolename}
                          </div>
                        ) : (
                          ""
                        )}

                        <br />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 20,
                          }}
                        >
                          <img src={names} width={25} />
                          {user.firsT_NAME} {user.middlE_NAME} {user.suR_NAME}
                        </div>

                        {/* {user.middlE_NAME !== " " && (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    Middle Name:{" "}
                    {user.middlE_NAME === "" ? "N/A" : user.middlE_NAME}
                  </div>
                )}
                 {user.suR_NAME !== " " && (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    Last Name:{" "}
                    {user.suR_NAME === "" ? "N/A" : user.suR_NAME}
                  </div>
                )} */}
                        <br />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          {" "}
                          <img src={dobs} width={22} />{" "}
                          {dayjs(user.dob).format("YYYY-MM-DD")}
                        </div>
                        <br />
                        {user.gendeR_ID !== 0 ? (
                          <>
                            {user.gendeR_ID &&
                              getGenderText(user.gendeR_ID) && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                  }}
                                >
                                  {" "}
                                  <img src={genders} width={22} />{" "}
                                  {getGenderText(user.gendeR_ID)}
                                </div>
                              )}
                          </>
                        ) : (
                          " "
                        )}

                        <br />
                        {/* <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {" "}
                  <img src={call} width={22} />{" "}
                  {user.cuR_MOBILE == "" ? " N/A" : `${user.cuR_MOBILE}`}
                </div> */}

                        {user.cuR_MOBILE && user.cuR_MOBILE.trim() !== "" && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 20,
                            }}
                          >
                            <img src={call} width={25} />
                            {user.cuR_MOBILE}
                          </div>
                        )}
                        <br />
                        {/* <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {" "}
                  <img src={emails} width={22} />{" "}
                  {user.email == "" ? " N/A" : `${user.email}`}
                </div> */}

                        {user.email && user.email.trim() !== "" && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 20,
                            }}
                          >
                            <img src={emails} width={25} />
                            {user.email}
                          </div>
                        )}
                        <br />

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          Account Status :{" "}
                          {user.iS_ACTIVE === true ? (
                            <img src={tick} width={25} />
                          ) : (
                            <img src={crs} width={25} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Box>
      </SwipeableDrawer>
    </div>
  );
}

export default SwipeableTemporaryDrawer;
