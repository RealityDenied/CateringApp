import React, { useState } from "react";
import MenuForm from "../components/MenuForm";
import MenuList from "../components/MenuList";

function MenuManager() {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh((prev) => !prev);

  return (
    <div>
      <h2>Create New Menu</h2>
      <MenuForm onMenuCreated={triggerRefresh} />
      <MenuList key={refresh} />
    </div>
  );
}

export default MenuManager;
