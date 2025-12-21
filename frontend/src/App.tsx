import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AIAssistantPage from './pages/AIAssistantPage';

const App = () => {
  const [showAddRecipeForm, setShowAddRecipeForm] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar onAddRecipe={() => setShowAddRecipeForm(true)} />
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                showAddForm={showAddRecipeForm}
                setShowAddForm={setShowAddRecipeForm}
              />
            } 
          />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
