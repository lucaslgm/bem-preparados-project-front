import './BarraPesquisa.css';
import { useContext } from 'react'
import { PropostasContext } from '../../contexts/PropostasContext';
import { UserContext } from '../../contexts/UserContext';

const Index = () => {
  const { user } = useContext(UserContext);
  const { getByClient, getByUser } = useContext(PropostasContext);


  async function handleSearch() {
    let cpf = document.getElementById('cpf').value;
    let usuario = user.username;

    await getByClient(usuario, cpf);
  }

  async function handleReturn() {
    let usuario = user.username;
    await getByUser(usuario);
    document.getElementById('cpf').value = ''
  }


  return (
    <form className="form-search">
      <div className="title paddin-bottom-20">
        <label htmlFor="cpf">BUSCAR CLIENTE:</label>
        <input id='cpf' type="text" maxLength="11" placeholder='pesquisar...' />
      </div>
      <div className="div-button paddin-bottom-20">
        <button type="button" className="submit-btn btn-width margin-right-15" onClick={() => { handleSearch() }}>BUSCAR</button>
        <button type="button" className="submit-btn btn-width" onClick={() => { handleReturn() }}>VOLTAR</button>
      </div>
    </form>
  )
}

export default Index
