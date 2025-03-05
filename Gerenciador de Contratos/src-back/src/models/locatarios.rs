use diesel::{prelude::{Insertable, Queryable}, query_dsl::methods::FilterDsl, ExpressionMethods, PgConnection, RunQueryDsl, Selectable};
use serde::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = crate::schema::locatarios)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Locatario{
    idlocatario: String,
    idusuario: String,
    idendereco: String,
}

pub async fn cadastra_locatario(conn: &mut PgConnection, locatario: Locatario) -> Result<(), diesel::result::Error>{
    diesel::insert_into(crate::schema::locatarios::table)
        .values(&locatario)
        .execute(conn)?;
    Ok(())
}

pub async fn busca_locatario_idusuario(conn: &mut PgConnection, id: String) -> Result<Locatario, diesel::result::Error>{
    let locatario = crate::schema::locatarios::table
        .filter(crate::schema::locatarios::idusuario.eq(id))
        .first(conn)?;
    Ok(locatario)
}

pub async fn busca_locatario_idlocatario(conn: &mut PgConnection, id: String) -> Result<Locatario, diesel::result::Error>{
    let locatario = crate::schema::locatarios::table
        .filter(crate::schema::locatarios::idlocatario.eq(id))
        .first(conn)?;
    Ok(locatario)
}

