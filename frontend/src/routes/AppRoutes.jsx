import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DishManager from "../pages/DishManager";
import MenuManager from "../pages/MenuManager";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dishes" />} />
      <Route path="/admin/dishes" element={<DishManager />} />
      <Route path="/menu/edit/:menuId" element={<MenuManager />} />
    </Routes>
  );
};

export default AppRoutes;
