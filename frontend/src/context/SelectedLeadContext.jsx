import { createContext, useContext, useState } from 'react';

const SelectedLeadContext = createContext();

export const SelectedLeadProvider = ({ children }) => {
  const [selectedLead, setSelectedLead] = useState(null);
  return (
    <SelectedLeadContext.Provider value={{ selectedLead, setSelectedLead }}>
      {children}
    </SelectedLeadContext.Provider>
  );
};

export const useSelectedLead = () => useContext(SelectedLeadContext);
