import { useEffect, useContext } from 'react';
import './consulta.css';
import { UserContext } from '../../contexts/UserContext';
import BarraPesquisa from '../../components/BarraPesquisa';
import Tabela from '../../components/Tabela';
import api from '../../services/api';
import { PropostasContext } from '../../contexts/PropostasContext';


const Index = () => {
  const { user } = useContext(UserContext);
  const { dados, getByUser } = useContext(PropostasContext);

  useEffect(() => {
    const storageUser = sessionStorage.getItem('user');
    function loadStorage() {
      if (storageUser) {
        const Token = JSON.parse(storageUser).token.toString();
        api.defaults.headers.Authorization = `Bearer ${Token}`;
      }
    }
    loadStorage();
    getByUser(user.username)

  }, [])

  useEffect(() => { console.log(dados) }, [dados])

  return (
    <div className="flex-column-container paddin-20">
      <BarraPesquisa />
      <Tabela dados={dados} />
    </div>
  )
}

export default Index
