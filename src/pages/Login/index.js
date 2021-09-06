import React from 'react';
import './login.css';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { FiUser, FiLock, FiUnlock } from "react-icons/fi";
import Avatar from '../../images/Avatar.png';



const Index = () => {
  const { user, authenticated, login, loadingAuth } = React.useContext(UserContext)
  const [userId, setUserId] = React.useState('')
  const [password, setPassword] = React.useState('')
  const history = useHistory();

  const routeChange = () => {
    let path = '/cadastro';
    history.push(path);
  };
  React.useEffect(() => {
    if (user !== null) {
      setUserId(user.username);
    }
    else {
      setUserId('');
      setPassword('');
    }
  }, [user])

  async function handleSubmit(e) {
    e.preventDefault();

    await login(userId, password);
    routeChange();
  }

  return (
    <div className="flex-container-column align-center">
      <div className='flex-container-column align-center login-area'>
        <form onSubmit={handleSubmit}>
          <div className='flex-container-row align-center'>
            <img className='avatar' src={Avatar} alt="Logo" />
          </div>
          <div className='input-field'>
            <FiUser color="#FFF" size={25} />
            <input required type="text" id="user" placeholder='nome usuário' className='login-input' value={userId} onChange={({ target }) => setUserId(target.value)} />
          </div>
          <div className='input-field'>
            {authenticated && <FiUnlock color="#FFF" size={25} />}
            {!authenticated && <FiLock color="#FFF" size={25} />}
            <input required type="password" id="psswrd" placeholder='*******' className='login-input' value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
          <div className='flex-container-column align-center btn-field'>
            <button className='login-btn' type='submit' >Login</button>
          </div>
          <div>
            {loadingAuth && <div className='loading-login'><p>Validando usuário, aguarde...</p> </div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;
