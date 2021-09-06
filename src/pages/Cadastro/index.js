import React from 'react';
import './cadastro.css';
import { UserContext } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import api from '../../services/api';

const Index = () => {
  const [form, setForm] = React.useState({
    cpf: '',
    nome: '',
    dt_nascimento: '',
    genero: '',
    vlr_salario: '',
    cep: '',
    logradouro: '',
    numero_residencia: '',
    bairro: '',
    cidade: '',
    proposta: '',
    conveniada: '',
    vlr_solicitado: '',
    prazo: '',
    vlr_financiado: '',
    situacao: '',
    dtSituacao: '',
    observacao: '',
    usuario: ''
  })

  const { user, logout } = React.useContext(UserContext);
  const [update, setUpdate] = React.useState(false);
  const [listaConveniadas, setListaConveniadas] = React.useState([]);
  const [listaSituacao, setListaSituacao] = React.useState([]);
  const [aux, setAux] = React.useState();

  React.useEffect(() => {
    async function loadData() {
      const storageUser = sessionStorage.getItem('user');
      function loadStorage() {
        if (storageUser) {
          const Token = JSON.parse(storageUser).token.toString();
          api.defaults.headers.Authorization = `Bearer ${Token}`;
        }
      }
      loadStorage();

      // GET LISTA CONVENIADAS
      api.get('affiliated/get-all')
        .then((response) => {
          console.log(response)
          let lista = [];
          response.data.forEach((item) => {
            lista.push({
              id: item.conveniada,
              nome: item.descricao
            })
          })

          if (lista.length === 0) {
            console.log('Nenhuma conveniada');
            setListaConveniadas([{ id: '1', nome: 'Sem dados' }]);
            return;
          }
          setListaConveniadas(lista);

        })
        .catch((error) => {
          console.log(error)
          setListaConveniadas([{ id: '1', nome: 'Erro ao carregar' }])
        })
        .finally();

      // GET LISTA SITUAÇÃO
      await api.get('states/get-all')
        .then((response) => {
          let lista = [];
          response.data.forEach((item) => {
            lista.push({
              id: item.situacao,
              nome: item.descricao
            })
          })

          if (lista.length === 0) {
            console.log('Nenhuma situação');
            setListaSituacao([{ id: '1', nome: 'Sem dados' }]);
            return;
          }
          setListaSituacao(lista);
        })
        .catch((error) => {
          console.log(error)
          setListaSituacao([{ id: '1', nome: 'Erro ao carregar' }])
        })
        .finally();
    }
    loadData();
  }, []);

  React.useEffect(() => {
    if (update) {
      document.getElementById('cpf').disabled = true;
    }
  }, [update]);

  React.useEffect(() => { console.log(form) }, [aux])

  function removedots() {
    setForm((form) => ({ ...form, cpf: form.cpf.replaceAll(/[^\d]/g, '') }));
    setForm((form) => ({ ...form, cep: form.cep.replaceAll(/[^\d]/g, '') }));
    setForm((form) => ({ ...form, vlr_solicitado: form.vlr_solicitado.replace(',', '.') }));
    setForm((form) => ({ ...form, vlr_salario: form.vlr_salario.replace(',', '.') }));
    setAux('x');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setForm((form) => ({ ...form, usuario: user.username }));
    removedots();
    console.log(form);

    api.post('form/insert', form)
      .then((response) => {
        if (response.status === 200) {
          toast.success('Proposta cadastrada com sucesso.', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally()
  };

  async function handleUpdate() {
    setForm((form) => ({ ...form, usuario: user.username }));
    removedots();

    console.log(form);

    await api.put('form/update/1', form)
      .then((response) => {
        if (response.status === 200) {
          toast.success('Dados atualizados com sucesso.', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally()
  };

  function handleChange({ target }) {
    const { id, value } = target;
    setForm((form) => ({ ...form, [id]: value }));
  };

  async function buscarCep(e) {
    await e.preventDefault()

    await api.get(`viacep/get/${e.target.value}`)
      .then((response) => {
        if (response.status === 200) {
          let data = response.data;
          setForm((form) => ({ ...form, logradouro: data.logradouro }));
          setForm((form) => ({ ...form, bairro: data.bairro }));
          setForm((form) => ({ ...form, cidade: data.localidade }));
          console.log(form)

          document.getElementById('numero_residencia').focus();
          toast('Insira o número do endereço', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((error) => {
        // document.getElementById('cep').focus();
        console.log(error)
        setForm((form) => ({ ...form, logradouro: '' }));
        setForm((form) => ({ ...form, bairro: '' }));
        setForm((form) => ({ ...form, cidade: '' }));
        setForm((form) => ({ ...form, numero_residencia: '' }));
        toast.warn('CEP não encontrado.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
  };

  async function buscarCliente(e) {
    await e.preventDefault();
    // resetForm();
    console.log(e.target.value)

    await api.get(`form/get-by-client?cpf=${e.target.value}`)
      .then((response) => {
        if (response) {
          let cliente = response.data.cliente;
          let proposta = response.data.proposta;

          setForm((form) => ({ ...form, nome: cliente.nome.trim() }));

          let ano = cliente.dt_nascimento.substring(0, 4);
          let mes = cliente.dt_nascimento.substring(5, 7)
          let dia = cliente.dt_nascimento.substring(8, 10)

          setForm((form) => ({ ...form, dt_nascimento: `${ano}-${mes}-${dia}` }));

          setForm((form) => ({ ...form, genero: cliente.genero.toString() }));

          setForm((form) => ({ ...form, vlr_salario: cliente.vlr_salario.toString() }));

          setForm((form) => ({ ...form, cep: cliente.cep.toString() }));

          setForm((form) => ({ ...form, numero_residencia: cliente.numero_residencia.trim() }));

          setForm((form) => ({ ...form, logradouro: cliente.logradouro.toString() }));

          setForm((form) => ({ ...form, bairro: cliente.bairro.toString() }));

          setForm((form) => ({ ...form, cidade: cliente.cidade.toString() }));

          setForm((form) => ({ ...form, cep: cliente.cep.toString() }));

          setForm((form) => ({ ...form, proposta: proposta.proposta.toString() }));

          setForm((form) => ({ ...form, conveniada: proposta.conveniada.toString() }));

          setForm((form) => ({ ...form, vlr_solicitado: proposta.vlr_solicitado.toString() }));

          setForm((form) => ({ ...form, prazo: proposta.prazo.toString() }));

          setForm((form) => ({ ...form, vlr_financiado: proposta.vlr_financiado.toString() }));

          setForm((form) => ({ ...form, situacao: proposta.situacao.toString() }));

          ano = proposta.dt_situacao.substring(0, 4);
          mes = proposta.dt_situacao.substring(5, 7)
          dia = proposta.dt_situacao.substring(8, 10)
          setForm((form) => ({ ...form, dtSituacao: `${ano}-${mes}-${dia}` }));

          setForm((form) => ({ ...form, usuario: proposta.usuario }));

          setForm((form) => ({ ...form, observacao: proposta.observacao != null ? proposta.observacao : '' }));

          setUpdate(true);
          console.log(update)
        }
      })
      .catch((error) => {
        let ano = new Date().getFullYear();
        let mes = (new Date().getMonth() + 1).toString().padStart(2, '0');
        let dia = new Date().getDate().toString().padStart(2, '0');
        console.log(`${ano}-${mes}-${dia}`)
        setForm((form) => ({ ...form, dtSituacao: `${ano}-${mes}-${dia}` }));

        setForm((form) => ({ ...form, situacao: 'AG' }));

        setForm((form) => ({ ...form, usuario: user.username }));

        console.log(error);
      })
      .finally()

  };

  async function retValorFinanciado() {
    await api.get(`form/get-financed-amount?vlrSolicitado=${form.vlr_solicitado.replace(',', '.')}&prazo=${form.prazo}`)
      .then((response) => {
        if (response) {
          let result = response.data.result;
          let valor = result.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          console.log(result)
          valor = valor.replaceAll('.', '').replace(',', '.');
          setForm((form) => ({ ...form, vlr_financiado: valor }));
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally()
  };

  function mascaraMoeda(mascaraInput) {
    let valor = document.getElementById(`${mascaraInput}`).value;
    valor = valor + '';
    valor = parseInt(valor.replace(/[\D]+/g, ''));
    valor = valor + '';
    valor = valor.replace(/([0-9]{2})$/g, ".$1");

    document.getElementById(`${mascaraInput}`).value = valor;
  };

  function mascaraNumero(mascaraInput) {
    let valor = document.getElementById(`${mascaraInput}`).value.replace(/([^0-9])+/g, "");
    document.getElementById(`${mascaraInput}`).value = valor;
  };
  function mascaraPrazo(mascaraInput) {
    let valor = document.getElementById(`${mascaraInput}`).value.replace(/([^0-9])+/g, "");
    document.getElementById(`${mascaraInput}`).value = valor;
  };

  function criarMascara(mascaraInput) {
    const maximoInput = document.getElementById(`${mascaraInput}`).maxLength;
    let valorInput = document.getElementById(`${mascaraInput}`).value;
    let valorSemPonto = document.getElementById(`${mascaraInput}`).value.replace(/([^0-9])+/g, "");

    const mascaras = {
      CPF: valorInput.replace(/[^\d]/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
      CEP: valorInput.replace(/[^\d]/g, "").replace(/(\d{5})(\d{3})/, "$1-$2"),
    };

    valorInput.length === maximoInput ? document.getElementById(`${mascaraInput}`).value = mascaras[mascaraInput.toUpperCase()] : document.getElementById(`${mascaraInput}`).value = valorSemPonto;
  };

  return (
    <div className="flex-container-column align-center">
      <div className='flex-container-column align-center cad-area'>
        <form id='formCadastro' onSubmit={handleSubmit}>
          <h1 className='cad-titulo'> Cadastro Proposta</h1>
          <div id='divDadosPessoais' className='campos-cadastro'>
            <h2 className='cad-sub-titulo'>Dados Pessoais</h2>
            <div className='flex-container-row padding-bottom-30'>
              <div id='divNome' className='flex-container-column padding-right-30'>
                <label htmlFor="nome">Nome </label>
                <input required type="text" id="nome" placeholder='Nome Sobrenome' value={form.nome} onChange={handleChange} />
              </div>
              <div id='divCpf' className='flex-container-column'>
                <label htmlFor="cpf">CPF </label>
                <input required type="text" id="cpf"
                  placeholder='999.999.999-99'
                  maxLength="11"
                  value={form.cpf} onChange={handleChange}
                  onBlur={(e) => buscarCliente(e)}
                  onInput={() => { mascaraNumero("cpf") }} />
              </div>
            </div>
            <div className='flex-container-row padding-bottom-30'>
              <div id='divDdtNascimento' className='flex-container-column padding-right-30'>
                <label htmlFor="dt_nascimento">Nascimento </label>
                <input required type="date" id="dt_nascimento" min="1920-01-01" max="2021-12-31" value={form.dt_nascimento} onChange={handleChange} />
              </div>
              <div id='divGenero' className='flex-container-column'>
                <label htmlFor="genero">Gênero </label>
                <div className='flex-container-column genero-field'>
                  <div id='masc' className='genero-field'>
                    <input
                      required
                      type="radio"
                      id="genero"
                      value="M"
                      onChange={handleChange}
                      checked={form.genero === 'M'} />
                    <span>Masculino</span>
                  </div>
                  <div id='fem' className='genero-field'>
                    <input
                      required
                      type="radio"
                      id="genero"
                      value="F"
                      onChange={handleChange}
                      checked={form.genero === 'F'} />
                    <span>Feminino</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex-container-row padding-bottom-30'>
              <div id='divSalario' className='flex-container-column padding-right-30'>
                <label htmlFor="vlr_salario">Salário (R$) </label>
                <input required
                  type="text"
                  maxLength="13"
                  id="vlr_salario"
                  placeholder='99999,99'
                  value={form.vlr_salario}
                  onChange={handleChange}
                  onInput={() => { mascaraMoeda("vlr_salario") }} />
              </div>
            </div>
          </div>
          <div id='divEndereco' className='campos-cadastro' >
            <h2 className='cad-sub-titulo'>Endereço</h2>
            <div className='flex-container-row padding-bottom-30'>
              <div id='divCep' className='flex-container-column padding-right-30'>
                <label htmlFor="cep">CEP </label>
                <input required type="text" id="cep"
                  maxLength="8"
                  placeholder='99.999-999'
                  value={form.cep}
                  onChange={handleChange}
                  onBlur={(e) => buscarCep(e)}
                  onInput={() => { mascaraNumero("cep") }} />
              </div>
              <div id='divLogradouro' className='flex-container-column'>
                <label htmlFor="logradouro">Logradouro </label>
                <input required type="text" id="logradouro" placeholder='Rua dos Andradas' value={form.logradouro} onChange={handleChange} />
              </div>
            </div>
            <div className='flex-container-row padding-bottom-30'>
              <div id='divNumero' className='flex-container-column padding-right-30'>
                <label htmlFor="numero_residencia">Nº </label>
                <input required type="text" maxLength="10" id="numero_residencia"
                  placeholder='1234'
                  value={form.numero_residencia}
                  onChange={handleChange} />
              </div>
              <div id='divBairro' className='flex-container-column padding-right-30'>
                <label htmlFor="bairro">Bairro </label>
                <input required type="text" id="bairro" placeholder='Centro' value={form.bairro} onChange={handleChange} />
              </div>
              <div id='divCidade' className='flex-container-column'>
                <label htmlFor="cidade">Cidade </label>
                <input required type="text" id="cidade" placeholder='Porto Alegre' value={form.cidade} onChange={handleChange} />
              </div>
            </div>
          </div>
          <div id='divProposta' className='campos-cadastro' >
            <h2 className='cad-sub-titulo'>Proposta</h2>
            <div className='flex-container-row padding-bottom-30'>
              <div id='divConveniada' className='flex-container-column padding-right-30'>
                <label htmlFor="conveniada">Conveniada</label>
                <select id='conveniada'
                  value={form.conveniada}
                  onChange={handleChange}>
                  <option value=''>SELECIONE</option>
                  {listaConveniadas.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>{item.nome}</option>
                    )
                  })}
                </select>
              </div>
              <div id='divVSolicitado' className='flex-container-column'>
                <label htmlFor="vlr_solicitado">Valor (R$) </label>
                <input required type="text" id="vlr_solicitado"
                  placeholder='99999,99'
                  maxLength="13"
                  value={form.vlr_solicitado}
                  onChange={handleChange}
                  onInput={() => { mascaraMoeda("vlr_solicitado") }} />
              </div>
            </div>
            <div className='flex-container-row padding-bottom-30'>
              <div id='divPrazo' className='flex-container-column padding-right-30'>
                <label htmlFor="prazo">Prazo </label>
                <input required type="text" id="prazo" placeholder='100'
                  value={form.prazo}
                  onChange={handleChange}
                  maxLength="3"
                  onInput={() => { mascaraNumero("prazo") }} />
              </div>
              <div id='divVFinanciado' className='flex-container-row'>
                <div className='flex-container-column'>
                  <label htmlFor="vlr_financiado">Valor Financiado (R$) </label>
                  <input required disabled type="text" id="vlr_financiado"
                    placeholder='99999,99'
                    maxLength="13"
                    value={form.vlr_financiado.replace('.', ',')}
                    onChange={handleChange}
                    onInput={() => { mascaraMoeda("vlr_financiado") }} />
                </div>
                <div id='divBtnFin' className='div-cadastro-btn'>
                  <button className='calc-btn' type='button' onClick={() => retValorFinanciado()} >Calcular</button>
                </div>
              </div>
            </div>
            <div className='flex-container-row padding-bottom-30'>
              <div id='divSituacao' className='flex-container-column padding-right-30'>
                <label htmlFor="situacao">Situação</label>
                <select
                  disabled
                  id='situacao'
                  value={form.situacao}
                  onChange={handleChange}>
                  <option value=''>SELECIONE</option>
                  {listaSituacao.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>{item.nome}</option>
                    )
                  })}
                </select>
              </div>
              <div id='divDtSituacao' className='flex-container-column'>
                <label htmlFor="dtSituacao">Data </label>
                <input disabled required type="date" id="dtSituacao" value={form.dtSituacao} onChange={handleChange} />
              </div>
            </div>
            <div className='flex-container-row padding-bottom-30'>
              <div id='divUsuario' className='flex-container-column padding-right-30'>
                <label htmlFor="usuario">Usuário </label>
                <input required type="text" id="usuario" placeholder='usuário' disabled value={form.usuario} onChange={handleChange} />
              </div>
              <div id='divObservacao' className='flex-container-column'>
                <label htmlFor="observacao">Observação </label>
                <textarea disabled id="observacao" cols="30" rows="5" wrap className='observacao-field' value={form.observacao} onChange={handleChange}></textarea>
              </div>
            </div>
          </div>
          <div id='divBtns'>
            {!update && <div id='divBtnCadastrar' className='div-cadastro-btn'>
              <button className='cadastro-btn' type='submit' >Cadastrar</button>
            </div>}
            {update && <div id='divBtnAtualizar' className='div-cadastro-btn'>
              <button className='cadastro-btn' type='button' onClick={() => handleUpdate()} >Atualizar</button>
            </div>}
            <div id='divBtnSair' className='div-cadastro-btn'>
              <button className='cadastro-btn' onClick={() => logout()} >Sair</button>
            </div>
          </div>
        </form>
      </div>
    </div >
  );
};

export default Index;
