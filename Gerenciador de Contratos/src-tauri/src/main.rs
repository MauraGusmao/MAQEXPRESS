// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

// Útil para salvar arquivos localmente
/* 
use std::fs::File;
use std::io::{self, Read, Write};
use bincode::serialize;
use serde::{Deserialize, Serialize};
use bincode::deserialize;
*/

// Relacionado ao banco de dados
use std::env;

mod model;
mod controller;

/// Função principal que inicia a aplicação Tauri.
///
/// Esta função configura o manipulador de invocação do Tauri, registrando as funções disponíveis para chamadas do front-end.
fn main() {
    tauri::Builder::default()
       .invoke_handler(tauri::generate_handler![
        controller::locatario::cadastra_locatario,
        controller::locatario::estrutura_locatario,
        controller::usuario::busca_id,
        controller::usuario::verifica_token,
        controller::usuario::atualiza_senha,
        controller::usuario::atualiza_email,
        controller::locadora::cadastra_locadora,
        controller::locadora::busca_id_locadora,
        controller::locadora::estrutura_locadora,
        controller::endereco::estrutura_endereco,
        controller::endereco::_salva_endereco,
        controller::cria_conta,
        controller::realiza_login, 
        controller::checa_email,
        controller::encontra_email_smtp,
        controller::gera_token,
        ]) // Registra funções do Tauri
       .run(tauri::generate_context!())
        .expect("erro ao tentar executar a aplicação Tauri");
}
