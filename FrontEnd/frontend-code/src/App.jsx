import React, { useState } from 'react';
import LoginComponent from "./components/loginComponent/login";
import Register from "./components/registerComponent/register";
import SuperAdmin from "./components/superAdmin/SuperAdmin";
import BlogViewer from "./components/BlogViewer/BlogViewer";
import BlogPost from "./components/BlogPost/BlogPost";
import UserProfile from "./components/UserProfile/UserProfile";
import NavBar from "./components/NavBar/NavBar";

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'login':
        return <LoginComponent onNavigate={handleNavigate} />;
      case 'register':
        return <Register onNavigate={handleNavigate} />;
      case 'superadmin':
        return <SuperAdmin onNavigate={handleNavigate} />;
      case 'blog':
        return <BlogViewer onNavigate={handleNavigate} />;
      case 'create-post':
        return <BlogPost onNavigate={handleNavigate} />;
      case 'profile':
        return <UserProfile showStats={true} />;
      default:
        return <LoginComponent onNavigate={handleNavigate} />;
    }
  };

  return (
    <div>
      <NavBar currentPage={currentPage} onNavigate={handleNavigate} />
      <div style={{ marginTop: '76px' }}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;