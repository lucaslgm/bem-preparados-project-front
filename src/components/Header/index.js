import React from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import logobem2 from '../../images/logobem2.png';
import { UserContext } from '../../contexts/UserContext';
import { FiHome, FiLogOut, FiClipboard } from "react-icons/fi";
import { AiOutlineFileSearch } from "react-icons/ai";



const Header = () => {
  const { logout, authenticated } = React.useContext(UserContext)

  return (
    <header>
      <div >
        <img className='logo' src={logobem2} alt="Logo" />
      </div>
      <div className=''>
        <Link to={'/'} className='links'>
          <FiHome color="#FFF" size={30} />
        </Link>
        <Link to={'/cadastro'} className='links' >
          <FiClipboard color="#FFF" size={30} />
        </Link>
        {authenticated && <Link to={'/consulta'} className='links'>
          <AiOutlineFileSearch color="#FFF" size={30} />
        </Link>}
        {authenticated && <Link to={'/'} className='links' onClick={() => logout()}>
          <FiLogOut color="#FFF" size={30} />
        </Link>}
      </div>
    </header>
  );
};

export default Header;
