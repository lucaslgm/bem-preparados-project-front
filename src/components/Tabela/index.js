import './tabela.css';
import React from 'react'
import Proposta from '../Proposta'


const Index = (props) => {
  let propostas = props.dados;
  const linhas = [];
  console.log(propostas);
  propostas.forEach((proposta) => {
    linhas.push(
      <Proposta proposta={proposta}
        key={proposta.proposta} />
    )
  });

  return (
    <table className="table-alter">
      <thead>
        <tr>
          <th>Nº</th>
          <th>CPF</th>
          <th>CLIENTE</th>
          <th>CONVENIADA</th>
          <th>V. SOLICITADO</th>
          <th>PRAZO</th>
          <th>V. FINANCIADO</th>
          <th>STATUS</th>
          <th>DATA</th>
          <th>USUARIO</th>
          {/* <th>VISUALIZAR</th> */}
        </tr>
      </thead>
      <tbody>{linhas}</tbody>
    </table>
  )
}

export default Index
