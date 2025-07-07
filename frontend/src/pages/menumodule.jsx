import React, { useState } from 'react';
import CategoryViewer from '../components/CategoryViewer';
import TierViewer from '../components/TierViewer';

const MenuModule = () => {
  const [draggedCategory, setDraggedCategory] = useState(null);

  return (
    <div style={{ display: 'flex', gap: '40px', padding: '20px' }}>
      <CategoryViewer onCategoryDragStart={setDraggedCategory} />
      <TierViewer draggedCategory={draggedCategory} />
    </div>
  );
};

export default MenuModule;
