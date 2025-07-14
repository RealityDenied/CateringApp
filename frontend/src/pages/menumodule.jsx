import React, { useEffect, useState } from 'react';
import CategoryViewer from '../components/CategoryViewer';
import TierViewer from '../components/TierViewer';
import { API } from '../utils/api';

const MenuModule = () => {
  const [draggedCategory, setDraggedCategory] = useState(null);

  useEffect(() => {
    const ensureAddOnsExists = async () => {
      const res = await API.get('/categories');
      const exists = res.data.find(c => c.name === 'Add-ons');
      if (!exists) {
        await API.post('/categories', { name: 'Add-ons', isFlexible: true });
      }
    };
    ensureAddOnsExists();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '40px', padding: '20px' }}>
      <CategoryViewer onCategoryDragStart={setDraggedCategory} />
      <TierViewer draggedCategory={draggedCategory} />
    </div>
  );
};

export default MenuModule;
