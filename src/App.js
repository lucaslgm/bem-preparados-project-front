import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import Routes from './routes';
import PropostasProvider from './contexts/PropostasContext';
import UserProvider from './contexts/UserContext';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';


const App = () => {
  return (
    <UserProvider>
      <PropostasProvider>
        <BrowserRouter>
          <ToastContainer autoClose={3000} />
          <Routes />
        </BrowserRouter>
      </PropostasProvider>
    </UserProvider>

  );
};

export default App;
