import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DishManager from './dishmanager';
import ChatPage from './pages/ChatPage';
import Dashboard from './pages/Dashboard';
import { SelectedLeadProvider } from './context/SelectedLeadContext';
import MenuModule from './pages/menumodule';

import QuoteEditor from './pages/QuoteEditor';



function App() {
  return (
    <BrowserRouter>
      <SelectedLeadProvider>
        <Routes>
        <Route path="/dish" element={<DishManager />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menumodule" element={<MenuModule />} />
        <Route path="/quote" element={<QuoteEditor />} />
        </Routes>
      </SelectedLeadProvider>
    </BrowserRouter>
  );
}

export default App;
