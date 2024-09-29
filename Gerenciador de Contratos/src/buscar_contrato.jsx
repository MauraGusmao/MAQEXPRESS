import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useNavigate } from "react-router-dom";

function BuscarContrato(){
  const [mensagem, setMensagem] = useState("");
  const [nomeMaquina, setNomeMaquina] = useState("");
  const [vetor, setVetor] = useState([]);
  const idusuario = localStorage.getItem('token');

  const [valorBusca, setValorBusca] = useState("");
  const [filtro, setFiltro] = useState("nome da máquina");

  async function buscaContratoNomeMaquina(){
    try{
        const contrato = await invoke("busca_contrato_nome_maquina", {nomeMaquina, idusuario});
        setVetor(contrato);  
        setMensagem(""); 
    } catch(error){
        setVetor([]);
        console.log("[Buscar_contrato.jsx] : ", error);
        setMensagem(error);
    }
  }

  async function buscaContratoNumserieMaquina(){
    try{
      const numserie = valorBusca;
      const contrato = await invoke("busca_contrato_numserie_maquina", {numserie, idusuario});
      setVetor(contrato);
      setMensagem("");
    }catch(error){
      setVetor([]);
      console.log(error);
      setMensagem(error);
    }
  }

  const navigate = useNavigate();

  const home = () => {
    navigate('/home');
  };

  async function buscaContrato(){
    switch (filtro){
      case "nomemaquina":
        await buscaContratoNomeMaquina();
        break;
      case "numserie":
        await buscaContratoNumserieMaquina();
        console.log("numserie");
        break;
    }
  }

  return (
    <div>      
      <div id="boxBuscaContrato">
      <div>
          Filtro: 
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="nomemaquina">Nome da máquina</option>
            <option value="numserie">Número de série da máquina</option>
            <option value="nomecliente">Nome do cliente</option>
            <option value="cnpjcliente">CNPJ do cliente</option>
            <option value="nomesociocliente">Nome do sócio do cliente</option>
        </select>
        <input
          className="rowReset"
          style={{width: 350}}
          type="text"
          value={valorBusca}
          onChange={(e) => {setValorBusca(e.currentTarget.value)
            }
          }
          placeholder={`Buscar contrato por ${filtro}`}
        />
        <button onClick={async () => {
          await buscaContrato();
        }
        }>Buscar</button>
      </div>
        <button className="botoesHome" type="button" onClick={home}>Voltar</button>
        <p>{mensagem}</p>
        <div>
          <ul className="contract-list">
            {vetor.map((contrato, index) => (
              <li key={index} className="contract-item">
                <div className="contract-header">ID DO CONTRATO: {contrato.idcontrato}</div>
                <div className="contract-fields">
                  <strong>Prazo Locação:</strong> {contrato.prazolocacao} MESES <br />
                  <strong>Data Retirada:</strong> {contrato.dataretirada} <br />
                  <strong>Valor Mensal: </strong> R$ {contrato.valormensal} <br />
                  <strong>Vencimento:</strong> {contrato.vencimento} <br />
                  <strong>Multa Atraso:</strong> {contrato.multaatraso} <br />
                  <strong>Juros Atraso:</strong> {contrato.jurosatraso} <br />
                  <strong>Aviso Transferência:</strong> {contrato.avisotransferencia} <br />
                  <strong>Prazo Devolução:</strong> {contrato.prazodevolucao} <br />
                  <strong>Cidade Foro:</strong> {contrato.cidadeforo} <br />
                  <strong>Data Contrato:</strong> {contrato.datacontrato} <br />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BuscarContrato;
