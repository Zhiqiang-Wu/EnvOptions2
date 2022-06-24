use tauri::{command, State};
use serde_json::{json, Value};
use std::fs;
use regex::Regex;
use rusqlite::{Batch, Connection};
use crate::MyState;

fn str_to_host(str: &str) -> (String, String) {
    let (ip, realm) = str.trim().split_once(' ').unwrap();
    return (ip.trim().to_string(), realm.trim().to_string());
}

fn list_system_hosts() -> Value {
    let is_host = Regex::new("^((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}( +)([^ \n\r]+)$").unwrap();

    let read_result = fs::read("C:\\Windows\\System32\\drivers\\etc\\hosts");
    if read_result.is_err() {
        let err = read_result.unwrap_err();
        return json!({
            "code": 300000,
            "message": err.to_string()
        });
    }

    let data = read_result.unwrap();
    let str = String::from_utf8(data).unwrap();
    let system_hosts: Vec<Value> = str.split("\n").filter(|s| {
        is_host.is_match(s.trim())
    }).map(|s| {
        let (ip, realm) = str_to_host(s);
        json!({
            "ip": ip,
            "realm": realm,
        })
    }).collect();

    json!({
        "code": 200000,
        "data": system_hosts
    })
}

fn list_database_hosts(connection: &Connection) -> Value {
    let mut statement = connection.prepare("SELECT id, ip, realm FROM host").unwrap();

    let database_hosts = statement.query_map([], |row| {
        let id: u32 = row.get(0).unwrap();
        let ip: String = row.get(1).unwrap();
        let realm: String = row.get(2).unwrap();
        Ok(json!({
            "id": id,
            "ip": ip,
            "realm": realm
        }))
    }).unwrap();

    let mut v: Vec<Value> = Vec::new();
    for r in database_hosts {
        v.push(r.unwrap());
    };
    json!({
        "code": 200000,
        "data": v
    })
}

#[command]
pub fn host_list_hosts(state: State<MyState>) -> Value {
    let connection: &Connection = &state.connection;

    let result1 = list_system_hosts();
    if result1.get("code").unwrap().as_u64().unwrap() != 200000 {
        return result1;
    }
    let result2 = list_database_hosts(connection);
    if result2.get("code").unwrap().as_u64().unwrap() != 200000 {
        return result2;
    }
    let system_hosts: &Vec<Value> = result1.get("data").unwrap().as_array().unwrap();
    let database_hosts: &Vec<Value> = result2.get("data").unwrap().as_array().unwrap();

    let mut sql = String::new();

    for system_host in system_hosts {
        let mut contains = false;
        for database_host in database_hosts {
            if database_host.get("ip").unwrap() == system_host.get("ip").unwrap()
                && database_host.get("realm").unwrap() == system_host.get("realm").unwrap() {
                contains = true;
                break;
            }
        }
        if !contains {
            sql.push_str(format!("INSERT INTO host (ip, realm) VALUES ('{}', '{}');",
                                 system_host.get("ip").unwrap().as_str().unwrap(),
                                 system_host.get("realm").unwrap().as_str().unwrap()).as_str());
        }
    }

    let mut batch = Batch::new(connection, sql.as_str());
    while let Some(mut stmt) = batch.next().unwrap() {
        stmt.execute([]).unwrap();
    }

    let result3 = list_database_hosts(connection);
    if result3.get("code").unwrap().as_u64().unwrap() != 200000 {
        return result3;
    }

    let database_hosts2 = result3.get("data").unwrap().as_array().unwrap();
    let hosts: Vec<Value> = database_hosts2.iter().map(|host| {
        let mut contains = false;
        for system_host in system_hosts {
            if system_host.get("ip").unwrap() == host.get("ip").unwrap()
                && system_host.get("realm").unwrap() == host.get("realm").unwrap() {
                contains = true;
                break;
            }
        }
        json!({
            "id": host.get("id").unwrap(),
            "ip": host.get("ip").unwrap(),
            "realm": host.get("realm").unwrap(),
            "selected": contains
        })
    }).collect();

    json!({
        "code": 200000,
        "data": hosts
    })
}

#[command]
pub fn host_insert_host(ip: String, realm: String, state: State<MyState>) -> Value {
    let insert_result = state.connection.execute("INSERT INTO host (ip, realm) VALUES (?1, ?2)", [ip, realm]);
    if insert_result.is_err() {
        return json!({
            "code": 300000,
            "message": insert_result.unwrap_err().to_string()
        });
    }

    json!({
        "code": 200000
    })
}

#[command]
pub fn host_delete_host(id: u32, state: State<MyState>) -> Value {
    let delete_result = state.connection.execute("DELETE FROM host WHERE id = ?1", [id]);
    if delete_result.is_err() {
        return json!({
            "code": 300000,
            "message": delete_result.unwrap_err().to_string()
        });
    }

    json!({
        "code": 200000
    })
}

#[command]
pub fn host_set_host(selected: bool, ip: String, realm: String) -> Value {
    let is_host = Regex::new("^((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3}( +)([^ \n\r]+)$").unwrap();

    let read_result = fs::read("C:\\Windows\\System32\\drivers\\etc\\hosts");
    if read_result.is_err() {
        return json!({
            "code": 300000,
            "message": read_result.unwrap_err().to_string()
        });
    }

    let data = read_result.unwrap();
    let new_str: String;

    if selected {
        let mut str = String::from_utf8(data).unwrap();
        str.push_str(format!("\n{} {}\n", ip, realm).as_str());
        new_str = str;
    } else {
        let str = String::from_utf8(data).unwrap();
        let split = str.split("\n");
        let v: Vec<String> = split.filter(|str| {
            if is_host.is_match(str) {
                let (ip2, realm2) = str_to_host(str);
                if ip == ip2 && realm == realm2 {
                    return false;
                }
            }
            return true;
        }).map(|str| {
            return str.to_string();
        }).collect();
        new_str = v.join("\n");
    }

    let write_result = fs::write("C:\\Windows\\System32\\drivers\\etc\\hosts", new_str);
    if write_result.is_err() {
        return json!({
            "code": 300000,
            "message": write_result.unwrap_err().to_string()
        });
    }

    json!({
        "code": 200000
    })
}
