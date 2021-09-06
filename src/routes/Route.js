import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

export default function RoutWrapper({
  component: Component,
  isPrivate,
  ...rest
}) {
  const { authenticated, loading } = React.useContext(UserContext)

  if (loading) {
    return (
      <div>carregando...</div>
    )
  }
  if (!authenticated && isPrivate) {
    return (
      <Redirect to='/' />
    )
  }

  return (
    <Route
      {...rest}
      render={props => (
        <Component {...props} />
      )}
    />
  )
}
