use std::ptr::null_mut;
use tauri::{command, State};
use serde_json::{json, Value};
use registry::{Hive, Security, RegKey};
use registry::value::Data;
use rusqlite::{Batch, Connection, params};
use crate::MyState;
use serde_json::Value::Null;
use utfx::U16CString;
use winapi::um::winuser::{HWND_BROADCAST, SendMessageTimeoutA, SMTO_ABORTIFHUNG, WM_SETTINGCHANGE};

fn list_system_envs() -> Value {
    let reg_key: RegKey = Hive::LocalMachine.open("SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment", Security::Read).unwrap();

    let v: Vec<Value> = reg_key.values().map(|value_result| {
        let value = value_result.unwrap();
        let value_data = value.data();
        let type1 = match value_data {
            Data::ExpandString(_) => "REG_EXPAND_SZ",
            _ => "REG_SZ"
        };
        json!({
            "name": value.name().to_string().unwrap(),
            "type": type1,
            "value": value_data.to_string()
        })
    }).collect();

    json!({
        "code": 200000,
        "data": v
    })
}

fn list_database_envs(connection: &Connection) -> Value {
    let mut statement = connection.prepare("SELECT id, name, type, value FROM env").unwrap();

    let database_envs = statement.query_map([], |row| {
        let id: u32 = row.get(0).unwrap();
        let name: String = row.get(1).unwrap();
        let type1: String = row.get(2).unwrap();
        let value: String = row.get(3).unwrap();
        Ok(json!({
            "id": id,
            "name": name,
            "type": type1,
            "value": value
        }))
    }).unwrap();

    let mut v: Vec<Value> = Vec::new();
    for r in database_envs {
        v.push(r.unwrap());
    };

    json!({
        "code": 200000,
        "data": v
    })
}

#[command]
pub fn env_list_envs(state: State<MyState>) -> Value {
    let connection: &Connection = &state.connection;

    let result1 = list_system_envs();
    if result1.get("code").unwrap().as_u64().unwrap() != 200000 {
        return result1;
    }

    let result2 = list_database_envs(&state.connection);
    if result2.get("code").unwrap().as_u64().unwrap() != 200000 {
        return result2;
    }

    let system_envs: &Vec<Value> = result1.get("data").unwrap().as_array().unwrap();
    let database_envs: &Vec<Value> = result2.get("data").unwrap().as_array().unwrap();

    let mut sql = String::new();

    for system_env in system_envs {
        let mut temp = &Null;

        for database_env in database_envs {
            if system_env.get("name").unwrap().to_string().to_uppercase() == database_env.get("name").unwrap().to_string().to_uppercase()
                && system_env.get("value").unwrap() == database_env.get("value").unwrap() {
                temp = database_env;
                break;
            }
        }

        if temp == &Null {
            sql.push_str(format!("INSERT INTO env (name, type, value) VALUES ('{}', '{}', '{}');",
                                 system_env.get("name").unwrap().as_str().unwrap(),
                                 system_env.get("type").unwrap().as_str().unwrap(),
                                 system_env.get("value").unwrap().as_str().unwrap()).as_str());
        } else {
            if system_env.get("name").unwrap() != temp.get("name").unwrap() {
                sql.push_str(format!("UPDATE env SET name = '{}' WHERE id = {}",
                                     system_env.get("name").unwrap().as_str().unwrap(),
                                     temp.get("id").unwrap().as_u64().unwrap()).as_str());
            }
        }
    }

    let mut batch = Batch::new(connection, sql.as_str());
    while let Some(mut stmt) = batch.next().unwrap() {
        stmt.execute([]).unwrap();
    }

    let result3 = list_database_envs(&state.connection);
    if result3.get("code").unwrap().as_u64().unwrap() != 200000 {
        return result3;
    }

    let database_envs2: &Vec<Value> = result3.get("data").unwrap().as_array().unwrap();
    let envs: Vec<Value> = database_envs2.iter().map(|database_env| {
        let mut selected = false;
        for system_env in system_envs {
            if system_env.get("name").unwrap() == database_env.get("name").unwrap()
                && system_env.get("value").unwrap() == database_env.get("value").unwrap() {
                selected = true;
                break;
            }
        }
        json!({
            "id": database_env.get("id").unwrap().as_u64().unwrap(),
            "name": database_env.get("name").unwrap().as_str().unwrap(),
            "type": database_env.get("type").unwrap().as_str().unwrap(),
            "value": database_env.get("value").unwrap().as_str().unwrap(),
            "selected": selected
        })
    }).collect();

    json!({
        "code": 200000,
        "data": envs
    })
}

#[command]
pub fn env_set_env(selected: bool, name: String, value: String) -> Value {
    let open_result = Hive::LocalMachine.open("SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment", Security::Write);
    if open_result.is_err() {
        return json!({
            "code": 300000,
            "message": "failed"
        });
    }
    let reg_key: RegKey = open_result.unwrap();

    if selected {
        let set_result = reg_key.set_value(name, &Data::String(U16CString::from_str(value).unwrap()));
        if set_result.is_err() {
            return json!({
                "code": 300000,
                "message": "failed"
            });
        }
    } else {
        let delete_result = reg_key.delete_value(name);
        if delete_result.is_err() {
            return json!({
                "code": 300000,
                "message": "failed"
            });
        }
    }

    unsafe {
        SendMessageTimeoutA(HWND_BROADCAST, WM_SETTINGCHANGE, 0, "Environment".as_ptr() as isize, SMTO_ABORTIFHUNG, 1, null_mut());
    }

    return json!({
        "code": 200000
    });
}

#[command]
pub fn env_insert_env(name: String, value: String, state: State<MyState>) -> Value {
    let execute_result = state.connection.execute("INSERT INTO env (name, type, value) VALUES (?1, ?2, ?3)", params![name, "REG_SZ", value]);
    if execute_result.is_err() {
        return json!({
            "code": 300000,
            "message": execute_result.unwrap_err().to_string()
        });
    }
    json!({
        "code": 200000
    })
}

#[command]
pub fn env_delete_env(id: u32, state: State<MyState>) -> Value {
    let execute_result = state.connection.execute("DELETE FROM env WHERE id = ?1", params![id]);
    if execute_result.is_err() {
        return json!({
            "code": 300000,
            "message": execute_result.unwrap_err().to_string()
        });
    }
    json!({
        "code": 200000
    })
}