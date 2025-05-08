import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { routes } from "./routes";
import LoginPage from "./loginPage/LoginPage";
import { Provider } from "react-redux";
import React from "react";

function App() {


  
  return (
    <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<LoginPage />}></Route> */}
          <Route path="/" element={<MainLayout />}>
            {routes}
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
