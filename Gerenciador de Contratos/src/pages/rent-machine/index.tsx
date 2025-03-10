import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Machine, MachineRentValue } from "@/interfaces/machine";
import { Renter } from "@/interfaces/renter";
import { User } from "@/interfaces/user";
import Layout from "@/layouts/default";
import { loadMachineImage, loadMachinePublicId, loadMachineRentValue } from "@/services/api/machine/machine";
import { createRenter, loadRenterByUserId } from "@/services/api/renter/renter";
import { loadUserById } from "@/services/api/user/user";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../components/rent-machine/rent-machine.css";
import { Address } from "@/interfaces/address";
import { loadAddressUserId } from "@/services/api/address/address";
import { Input } from "@/layouts";
import { Label } from "@radix-ui/react-dropdown-menu";
import { formatCurrency } from "@/services/api/format/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RentMachine = () => {
  const { publicid } = useParams();
  const [machine, setMachine] = useState<Machine>();
  const [machineImage, setMachineImage] = useState<string>();
  const [step, setStep] = useState("carregando");
  const [user, setUser] = useState<User>();
  const [renter, setRenter] = useState<Renter>();
  const [address, setAddress] = useState<Address>();
  const [renterId, setRenterId] = useState<string>();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>();

  const [medidaPrazo, setMedidaPrazo] = useState<string>("Selecione um Prazo");
  const [prazo, setPrazo] = useState<string>('0');
  const [totalAluguel, setTotalAluguel] = useState<number>(0);

  const navigate = useNavigate();

  const handleValorAluguel = async () => {
    if (!machine || !medidaPrazo || !prazo){
      return;
    }
    try{
      const obj: MachineRentValue = {
        idmaquina: machine?.idmaquina,
        medida_prazo: medidaPrazo,
        prazo: parseFloat(prazo)
      };
      const valor = await loadMachineRentValue(obj);
      setTotalAluguel(valor);
    } catch(error){
      console.error(error);
      // alert(`Erro ao calcular o valor do aluguel da máquina: ${error.message}`)
    }
  }

  useEffect(() => {
    handleValorAluguel();
  }, [medidaPrazo, prazo]);
  

  useEffect(() => {
    const listMachines = async () => {
      if (publicid) {
        try{
          const machine = await loadMachinePublicId(publicid);
          console.log(machine);
          setMachine(machine);
          const imageUrl = await loadMachineImage(machine.idmaquina);
          setMachineImage(imageUrl);
          if(machine.disponivelaluguel !== "Sim"){
            alert("Essa máquina não está disponível para aluguel no momento.");
            navigate("/");
          }
        } catch(error){
          console.error(error);
          setError(true);
          setErrorMessage("Houve um erro ao carregar a máquina.");
        }
      }
    };
    listMachines();
  }, [publicid]);

  useEffect(() => {
    const loadUser = async () => {
      const id = localStorage.getItem("USER_ID");
      if(!id){
        setError(true);
        setErrorMessage("Você precisa estar logado pra prosseguir.");
        return;
       }
      try{
        const user = await loadUserById(id);
        console.log(user);
        setUser(user);
      } catch(err){
        setError(true);
        setErrorMessage("Houve um erro ao carregar suas informações.");
        console.error(err);
        setStep("");
      }
    };
    loadUser();    
  }, []);
  
  useEffect(() => {
    if(machine && user && !renter){
      setStep("cadastro-locatario");
    }
  }, [machine, user, renter]);

  useEffect(() => {
    const loadRenter = async (id: string) => {
      try {
        const loadedRenter = await loadRenterByUserId(id);
        setStep("revisão-solicitação");
        setRenter(loadedRenter);
        console.log(loadedRenter);
      } catch (err) {
        console.error(err);
        setStep("cadastro-locatario");
      }
    };
    if (user) {
      loadRenter(user.idusuario);
    }
    if (renterId && user){
      loadRenter(user.idusuario);
    }
  }, [renterId, user]);

  useEffect(() => {
    const loadAddress = async (id: string) => {
      try {
        const loadedAddress = await loadAddressUserId(id);
        setAddress(loadedAddress);
      } catch (err) {
        console.error(err);
        setError(true);
        setErrorMessage("Houve um erro ao carregar seu endereço. Acesse seu perfil para verificar.");
        setStep("cadastro-locatario");
      }
    };
    if (user) {
      loadAddress(user.idusuario);
    }
  }, [user]);

  const tryCreateRenter = async () => {
    if (!user || !address){
      return;
    }
    try{
      const createdRenterId = await createRenter(user.idusuario, address.idendereco);
      setRenterId(createdRenterId);
      setStep("revisão-solicitação");
    } catch(error){
      console.error(error);
    }
  }

  if (error){
    return (
      <Layout>
        <main>
          <Card className="m-4 p-4 mr-10 ml-10">
            <CardHeader>
              <p className="text-[black]">{errorMessage}</p>
            </CardHeader>
            {errorMessage !== "Houve um erro ao carregar seu endereço. Acesse seu perfil para verificar." ? (
              <div>
                <p className="text-[black]">Houve um erro ao carregar as informações. Reporte o problema aqui:</p>
                <Button>Relatar problema</Button>
              </div>
            ) : (
              <div>
                <Button onClick={() => {navigate('/user-profile')}}>Ver meu perfil</Button>
              </div>
            )}
          </Card>
        </main>
      </Layout>
    )
  }

  return (
    <Layout>
      <main>
        {step === "cadastro-locatario" ? (
          <div className="rent-machine-container">
            <Card className="bg-[hsl(var(--machine-card-bg))] w-[60vw] m-4 border-[hsl(var(--primary))]">
              <CardHeader>
              <CardTitle className="text-[1.5rem] text-[hsl(var(--primary))]">Minhas Informações</CardTitle>
              </CardHeader>
              <CardDescription>
                <p>Confirme seus dados antes de alugar a máquina. Só é necessário realizar esse processo uma vez.</p>
                <p>Se precisar atualizar alguma informação, acesse o seu perfil.</p>
              </CardDescription>
                <CardContent className="flex flex-col items-center w-full">
                <Card className="w-[60%] mt-2 bg-[hsl(var(--machine-card-bg))] pb-4 border-[hsl(var(--primary))]">
                  <Label className="text-[hsl(var(--text))] mt-2 block  text-left">Nome</Label>
                  <Input
                  value={user?.nome}
                  disabled={true}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>

                  <Label className="text-[hsl(var(--text))] mt-2">E-mail</Label>
                  <Input
                  value={user?.email}
                  disabled={true}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>

                  <Label className="text-[hsl(var(--text))] mt-2">Documento</Label>
                  <Input
                  value={user?.documento}
                  disabled={true}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>
                </Card>
                {address ? (
                  <Card className="mt-2 w-[60%] bg-[hsl(var(--machine-card-bg))] pb-10 border-[hsl(var(--primary))]">
                  <Label className="text-[hsl(var(--text))] mt-2">CEP</Label>
                  <Input
                  value={address?.cep}
                  disabled={true}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>

                  
                  <Label className="text-[hsl(var(--text))] mt-2">País</Label>
                  <Input
                  value={address?.pais}
                  disabled={true}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>

                  <Label className="text-[hsl(var(--text))]  mt-2">Estado</Label>
                  <Input
                  value={address?.estado}
                  disabled={true}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>

                  <Label className="text-[hsl(var(--text))]  mt-2">Cidade</Label>
                  <Input
                  value={address?.cidade}
                  disabled={true}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>

                  <Label className="text-[hsl(var(--text))]  mt-2">Bairro</Label>
                  <Input
                  value={address?.bairro}
                  disabled={true}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>

                  <Label className="text-[hsl(var(--text))]  mt-2">Rua</Label>
                  <Input
                  value={address?.logradouro}
                  disabled={true}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>

                  <Label className="text-[hsl(var(--text))]  mt-2">Número</Label>
                  <Input
                  value={address?.numero}
                  disabled={true}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>

                  <Label className="text-[hsl(var(--text))]  mt-2">Complemento</Label>
                  <Input
                  value={address?.complemento}
                  disabled={true}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>
                </Card>
                ) : (
                  <Card className="w-[60%] mt-2 border-[hsl(var(--primary))] bg-white">
                    <CardContent className="pt-2 pb-2">
                      <p>Atualize seu endereço para prosseguir.</p>
                    </CardContent>
                    <CardContent>
                      <Button onClick={() => {navigate('/user-profile')}}>Atualizar endereço</Button>
                    </CardContent>
                  </Card>
                )}
                </CardContent>
                <CardFooter className="flex justify-center">
                {
                  (address && user) && 
                  (<Button onClick={tryCreateRenter}>Confirmar informações</Button>)
                }
                </CardFooter>
            </Card>            
          </div>
        ) : step === "revisão-solicitação" ? (
          <div className="rent-machine-container">
            <Card className="bg-[hsl(var(--machine-card-bg))] w-[60vw] m-4 border-[hsl(var(--primary))]">
              <CardHeader>
              <CardTitle className="text-[1.5rem] text-[hsl(var(--primary))]">Revisão da Solicitação</CardTitle>
              </CardHeader>
              <CardDescription>
                <p>Revises essas informações antes de alugar a máquina. Role para baixo para ver mais e leia com atenção.</p>
                <p>Se precisar atualizar alguma informação, acesse o seu perfil.</p>
              </CardDescription>
                <CardContent className="flex flex-col items-center w-full">
                <Card className="w-[60%] mt-2 bg-[hsl(var(--machine-card-bg))] pb-4 border-[hsl(var(--primary))]">
                <CardHeader className="text-[hsl(var(--text))]  text-[1.25rem]"><strong>Máquina </strong>
                  <img
                    src={machineImage}
                  />
                </CardHeader>
                {machine && (
                  <CardContent>
                  <Label className="text-[hsl(var(--text))] mt-2 mb-2">Nome da Máquina</Label>
                  <Input
                  value={machine?.nome}
                  disabled={true}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>

                  <Label className="text-[hsl(var(--text))] mt-2 mb-2">Categoria da Máquina</Label>
                  <Input
                  value={machine.categoria}
                  disabled={true}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>


                  <Label className="text-[hsl(var(--text))] mt-2 mb-2">Número de Série da Máquina</Label>
                  <Input
                  value={machine?.numeroserie}
                  disabled={true}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>

                  <Label className="text-[hsl(var(--text))] mt-2 mb-2">Valor do Aluguel (Mensal)</Label>
                  <Input
                  value={formatCurrency(machine.valoraluguel)}
                  disabled={true}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>

                </CardContent>
                )}
                </Card>

                <Card className="w-[60%] mt-2 bg-[hsl(var(--machine-card-bg))] pb-4 border-[hsl(var(--primary))]">
                <CardHeader className="text-[hsl(var(--text))] text-[1.25rem]"><strong>Aluguel</strong>
                 </CardHeader>
                 <CardContent>
                 <Label className="text-[hsl(var(--text))] mt-2 mb-2">Medida do Prazo</Label>

                <div className="flex flex-col items-center w-full gap-4">
                  <div className="flex flex-col w-[50%]">
                <Select onValueChange={(e) => {
                  setMedidaPrazo(e);
                  }}>
                  <SelectTrigger className="p-2 bg-white text-black border-[1px] border-[hsl(var(--primary))] rounded-md">                    
                    <SelectValue placeholder="Selecione um Prazo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Horas">Horas</SelectItem>
                    <SelectItem  value="Dias">Dias</SelectItem>
                    <SelectItem  value="Semanas">Semanas</SelectItem>
                    <SelectItem  value="Meses">Meses</SelectItem>
                  </SelectContent>
                </Select>
                </div></div>

                <Label className="text-[hsl(var(--text))] mt-2 mb-2">Prazo do Aluguel (em {medidaPrazo})</Label>
                <Input
                  value={prazo}
                  type="number"
                  step={0.5}
                  onChange={(e) => {
                    setPrazo(e.target.value)
                  }}
                  onBlur={handleValorAluguel}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>

                <Label className="text-[hsl(var(--text))] mt-2 mb-2">Valor do Aluguel 
                  {medidaPrazo !== "Selecione um Prazo" && (
                    <p>(total calculado em {medidaPrazo})</p>
                  )}
                  </Label>
                <Input
                  value={formatCurrency(totalAluguel)}
                  disabled={true}
                  className="p-2 text-black bg-white rounded-md border-[1px] border-[hsl(var(--primary))] w-[50%]"/>
                  <p className="mt-2">Foi adicionada uma taxa de 5% do valor mensal da máquina
                    para cobrir parte dos custos de manutenção após o uso.
                  </p>

                 </CardContent>
                 </Card>
              </CardContent> 
            </Card>
          </div>
        ) : step === "carregando" ? 
        (<div>
          <h1>Carregando...</h1>
        </div>) 
        : step === "informações-contrato" ? (
          <div>
            <h1>Informações do Contrato</h1>
          </div>
        ) 
        : step === "status-solicitação" ? (
          <div>
            <h1>Status da Solicitação</h1>
          </div>
        ) : 
        <div>
          <p className="text-[black]">
            Houve um erro ao carregar as informações. Reporte o problema aqui:
          </p>
          <Button>Relatar problema</Button>
        </div>}
      </main>
    </Layout>
  );
};

export default RentMachine;
