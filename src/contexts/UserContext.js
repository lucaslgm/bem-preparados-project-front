import React from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

export const UserContext = React.createContext({});

function UserProvider({ children }) {

  const [user, setUser] = React.useState(null);
  const [loadingAuth, setLoadingAuth] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(false)

  React.useEffect(() => {
    const storageUser = sessionStorage.getItem('user');

    function loadStorage() {
      if (storageUser) {
        setUser(JSON.parse(storageUser));
        const Token = JSON.parse(storageUser).token.toString();
        api.defaults.headers.Authorization = `Bearer ${Token}`;
        setAuthenticated(true);
        setLoading(false);
      }
      setLoading(false)
    }
    loadStorage()
    return () => {
    }
  }, []);

  async function login(usuario, senha) {
    setLoadingAuth(true);

    let userLogin = {
      usuario: usuario,
      senha: senha,
    };

    let msg = '';

    await api.post('auth/login', userLogin).then(
      (response) => {
        if (response.data.authenticated) {
          let data = {
            username: userLogin.usuario,
            // password: userLogin.senha,
            name: response.data.name,
            token: response.data.accessToken
          };

          setUser(data);
          setAuthenticated(true);
          sessionStorage.setItem('user', JSON.stringify(data));

          msg = `Bem vindo(a) ${response.data.name}!`;
        }
        else {
          msg = response.data.message;
          setAuthenticated(false);
        }
      }
    ).catch((error) => { msg = error; }
    ).finally(
      () => {
        setLoadingAuth(false)
        toast.info(msg);
      }
    );
  };

  async function logout() {
    setUser(null);
    setAuthenticated(false);
    sessionStorage.removeItem('user');
    api.defaults.headers.Authorization = undefined;

    toast('Até mais! :)', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <UserContext.Provider value={{
      authenticated,
      user,
      loading,
      login,
      logout,
      loadingAuth
    }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider

/*
Como usar em outros componetes

import { useContext } from 'react'
import { UserContext } from './userContext';
const{user, password, outros_estados} = useContext(UserContext);
*/
