use mysql_async::{Pool, prelude::*};
use dotenv::dotenv;
use std::env;
use crate::controller;

/// Estrutura que representa um usuário.
///
/// A estrutura contém os seguintes campos:
/// - nome: Nome completo do usuário.
/// - email: Endereço de email do usuário.
/// - senha: Senha do usuário.
pub struct Usuario{ // Objeto de usuário para unificar dados
    nome:String, email:String, senha:String,
}


impl Usuario{
    /// Cria uma nova instância de um usuário.
    ///
    /// # Parâmetros
    /// - nome: Nome completo do usuário.
    /// - email: Endereço de email do usuário.
    /// - senha: Senha do usuário.
    ///
    /// # Retornos
    /// - Usuario: Retorna uma nova instância de `Usuario`.
    pub fn novo_usuario(nome: String, email: String, senha: String) -> Self{
        Usuario {nome, email, senha}
    }

    /// Obtém o nome do usuário.
    ///
    /// # Retornos
    /// - &str: Retorna uma referência para o nome do usuário.
    pub fn get_nome(&mut self) -> &str{
        return &self.nome;
    }

    /// Obtém o email do usuário.
    ///
    /// # Retornos
    /// - &str: Retorna uma referência para o email do usuário.
    pub fn get_email(&mut self) -> &str{
        return &self.email;
    }

    /// Obtém a senha (hash) do usuário.
    ///
    /// # Retornos
    /// - &str: Retorna uma referência para a senha (hash) do usuário.
    pub fn get_hash(&mut self) -> &str{
        return &self.senha;
    }
    
}

/// Cria uma pool de conexões com o banco de dados usando as credenciais do arquivo .env.
///
/// # Retornos
/// - Result<Pool, mysql_async::Error>: Retorna Ok(pool) se a pool for criada com sucesso, 
///   ou Err(mysql_async::Error) se houver um erro na criação da pool.
pub async fn create_pool() -> Result<Pool, mysql_async::Error> {
    dotenv().ok();
    let db_host = env::var("DB_HOST")
        .expect("DB_HOST não definido no arquivo .env");
    let db_user = env::var("DB_USER")
        .expect("DB_USER não definido no arquivo .env");
    let db_password = env::var("DB_PASSWORD")
        .expect("DB_PASSWORD não definido no arquivo .env");
    let db_name = env::var("DB_NAME")
        .expect("DB_NAME não definido no arquivo .env");
    
    let url = format!("mysql://{}:{}@{}/{}", db_user, db_password, db_host, db_name);
    let pool = Pool::from_url(url);
    pool
}

/// Insere um novo usuário no banco de dados.
///
/// # Parâmetros
/// - pool: Pool de conexões com o banco de dados.
/// - nome: Nome completo do usuário.
/// - email: Endereço de email do usuário.
/// - senha: Senha do usuário.
/// - email_rep: Referência mutável para um contador de emails repetidos.
///
/// # Retornos
/// - Result<(), mysql_async::Error>: Retorna Ok(()) se o usuário for inserido com sucesso,
///   ou Err(mysql_async::Error) se houver um erro na inserção dos dados.
pub async fn save_data(pool: &Pool, nome:&str, email: &str, senha: &str, email_rep: &mut u32) -> Result<(), mysql_async::Error> {
    let mut conn = pool.get_conn().await?;
    
    let mut qtd_users = conn.exec_map( // exec_map retorna um vetor do tipo definido no parâmetro f:
        "SELECT COUNT(UUID) FROM usuarios",
        (),
        |qtd_usuarios:u32| qtd_usuarios , // Um vetor com um único elemento (aqui, ele contém um inteiro)
    ).await?;
    let qtd; // Variável que vai armazenar o retorno do vetor qtd_users
    qtd = qtd_users.pop(); // qtd agora é um inteiro, e é utilizado para atribuir o UUID do usuário
    

    let mut repetido = 0; // Um iterador que aumenta quando um email repetido é encontrado (Tive problemas pra usar bool)
    email_repetido(pool, email, &mut repetido).await?; // Entra na função que faz a busca nos emails
    *email_rep = repetido; // Atribuindo ao parâmetro email_rep o valor do inteiro passado para a função email_repetido
    if repetido != 0{ // Se o email for repetido, não faça nada (Uma mensagem de erro é exibida no front)
       return Ok(())
    }
    else { // Se o email não for repetido, crie uma conta nova
        conn.exec_drop(
            "INSERT INTO usuarios (email, nome_completo, senha, UUID) VALUES (?, ?, ?, ?)", // Interrogações são substituídas pelos parâmetros
            (email, nome, senha, qtd) // Parâmetros a serem substituídos na query
        ).await?;
     
        Ok(())
    }
    
}

/// Verifica se um email já está cadastrado no banco de dados.
///
/// # Parâmetros
/// - pool: Pool de conexões com o banco de dados.
/// - email: Endereço de email a ser verificado.
/// - repetido: Referência mutável para um contador que será incrementado se o email já estiver cadastrado.
///
/// # Retornos
/// - Result<String, mysql_async::Error>: Retorna Ok("Encontrado") se o email for encontrado,
///   ou Err(mysql_async::Error) se houver um erro na verificação.

pub async fn email_repetido(pool: &Pool, email:&str, repetido:&mut u32) -> Result<String, mysql_async::Error>{
    let mut conn = pool.get_conn().await?; // Conectando no banco
    let mut emails_db = conn.exec_map( // emails_db é um vetor de emails que é adquirido do banco de dados
        "SELECT email FROM usuarios",
        (), |email:String| email ,
    ).await?;
    for u in emails_db.iter_mut(){ // u  será a variável referente a cada elemento do vetor
        let email_db = u.as_mut(); // agora, email_db será a variável referente a cada elemento (sim, esse passo é necessário)
        if email_db == email{ 
            *repetido += 1; // Aumenta em 1 o iterador responsável por sinalizar emails repetidos
            return Ok(email.to_string())
        }
    }
    Ok("Encontrado".to_string())
}

/// Verifica a senha de um usuário.
///
/// # Parâmetros
/// - pool: Pool de conexões com o banco de dados.
/// - email: Endereço de email do usuário.
/// - senha: Senha digitada pelo usuário.
/// - senha_correta: Referência mutável para um contador que será incrementado se a senha estiver correta.
///
/// # Retornos
/// - Result<(), mysql_async::Error>: Retorna Ok(()) se a senha for verificada com sucesso,
///   ou Err(mysql_async::Error) se houver um erro na verificação.
pub async fn verifica_senha(pool: &Pool, email:&str, senha:&str, senha_correta:&mut u32) -> Result<(), mysql_async::Error>{
    // Esse trecho de código vai virar uma função separada posteriormente 
    ///////////
    let mut conn = pool.get_conn().await?; 
    let mut emails_db = conn.exec_map( 
        "SELECT email FROM usuarios", 
        (), |email:String| email ,
    ).await?;
    let mut email_encontrado:&str = Default::default();
    for u in emails_db.iter_mut(){
        let email_db = u.as_mut();
        if email_db == email{
            email_encontrado = email_db;
            break;
        }
    } 
    ///////////
    

    let mut senhas_db = conn.exec_map( // senhas_db é um vetor que armazena as senhas dos usuários
        "SELECT senha FROM usuarios WHERE email = (?)", // Carrega a senha atual do email selecionado
        (email_encontrado,), |senha:String| senha , // Parâmetro email_encontrado é utilizado para selecionar o email
    ).await?;
    for u in senhas_db.iter_mut(){ // Percorrendo o vetor de senhas
        let senha_db = u.as_mut();
        let hash_dec = controller::dec_senha(senha, senha_db.to_string()); // Verificando o hash da senha
        if hash_dec{ // Se o hash estiver correto, valida o login
            *senha_correta += 1; // Quando a senha é encontrada, aumenta em 1 a variável referente ao sucesso da busca
            break;
        }
    }

    // Seção de teste
    if *senha_correta != 0 as u32{ 
        println!("CONTA ENCONTRADA");
    } else{
        *senha_correta = 0;
        println!("Conta não encontrada?");
    }
    Ok(())
}