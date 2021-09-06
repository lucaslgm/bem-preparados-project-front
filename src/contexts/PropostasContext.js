import React from 'react';
import api from '../services/api';


export const PropostasContext = React.createContext({});

function PropostasProvider({ children }) {

  const [dados, setDados] = React.useState([]);

  async function getByUser(user) {
    const usuario = user
    console.log(usuario);

    await api.get(`proposal/get-full-by-user?user=${usuario}`)
      .then(
        (response) => {
          setDados(response.data);
        })
      .catch(
        (error) => { console.log(error); })
      .finally(
        () => { });
  }

  async function getByClient(user, cliente) {
    let usuario = user
    let cpf = cliente;
    await api.get(`proposal/get-full-by-client?user=${usuario}&cpf=${cpf}`)
      .then(
        (response) => {
          if (response.data != null) {
            let aux = [];
            aux.push(response.data.data)
            setDados(aux);
          }
        })
      .catch(
        (error) => { console.log(error); })
      .finally(
        () => { });
  }


  return (
    <PropostasContext.Provider value={{
      dados,
      setDados,
      getByClient,
      getByUser
    }}>
      {children}
    </PropostasContext.Provider>
  )
}

export default PropostasProvider

/*
Como usar em outros componetes

import { useContext } from 'react'
import { UserContext } from './userContext';
const{user, password, outros_estados} = useContext(UserContext);
*/
