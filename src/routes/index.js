import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Route from './Route';
import Header from '../components/Header';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import Consulta from '../pages/Consulta';
// import Footer from '../components/Footer'
import history from '../services/history';

const Routes = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/cadastro" component={Cadastro} isPrivate />
        <Route exact path="/consulta" component={Consulta} isPrivate />
        <Router history={history} />
      </Switch>
      {/* <Footer /> */}
    </Router>
  );
};

export default Routes;
