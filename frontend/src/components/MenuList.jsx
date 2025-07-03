import React, { useEffect, useState } from "react";
import { getMenus, deleteMenu } from "../utils/api";

function MenuList() {
  const [menus, setMenus] = useState([]);

  const fetchMenus = async () => {
    const data = await getMenus();
    setMenus(data);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleDelete = async (id) => {
    await deleteMenu(id);
    fetchMenus();
  };

  return (
    <div>
      <h3>All Menus</h3>
      {menus.map((menu) => (
        <div key={menu._id}>
          <h4>{menu.name}</h4>
          <ul>
            {menu.dishes.map((dish) => (
              <li key={dish._id}>{dish.name} - ₹{dish.price}</li>
            ))}
          </ul>
          <button onClick={() => handleDelete(menu._id)}>Delete Menu</button>
        </div>
      ))}
    </div>
  );
}

export default MenuList;
