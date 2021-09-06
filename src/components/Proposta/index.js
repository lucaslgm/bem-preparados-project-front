import React from 'react'
// import { BiSearchAlt2 } from "react-icons/bi";


const Index = (props) => {
  const item = props.proposta;
  const proposta = item.proposta;
  const cpf = item.cpf;
  const cliente = item.nome;
  const conveniada = item.conveniada;
  const vlr_solicitado = `R$ ${item.vlr_solicitado}`;
  const prazo = item.prazo;
  const financiado = `R$ ${item.vlr_financiado}`;
  const situacao = item.situacao;
  const dt_situacao = item.dt_situacao.substr(0, 10);
  const usuario = item.usuario;

  return (
    <tr>
      <td>{proposta}</td>
      <td>{cpf}</td>
      <td>{cliente}</td>
      <td>{conveniada}</td>
      <td>{vlr_solicitado}</td>
      <td>{prazo}</td>
      <td>{financiado}</td>
      <td>{situacao}</td>
      <td>{dt_situacao}</td>
      <td>{usuario}</td>
      {/* <td><BiSearchAlt2 size={20} /></td> */}
    </tr>
  )
}

export default Index
