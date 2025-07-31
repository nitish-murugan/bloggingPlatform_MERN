import React, { useState } from 'react';
import LoginComponent from "./components/loginComponent/login";
import Register from "./components/registerComponent/register";
import NavBar from "./components/NavBar/NavBar";

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <NavBar currentPage={currentPage} onNavigate={handleNavigate} />
      {currentPage === 'login' ? (
        <LoginComponent onNavigate={handleNavigate} />
      ) : (
        <Register onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;