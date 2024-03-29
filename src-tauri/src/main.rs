#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

mod env;
mod host;

use tauri::{App, Manager, Wry};
use std::fs;
#[cfg(debug_assertions)]
use log4rs::append::console::ConsoleAppender;
#[cfg(debug_assertions)]
use log4rs::config::{Appender, Root, Config};
#[cfg(debug_assertions)]
use log4rs::encode::pattern::PatternEncoder;
#[cfg(debug_assertions)]
use log::LevelFilter;
use rusqlite::Connection;
use env::{env_list_envs, env_set_env, env_delete_env, env_insert_env, env_update_env};
use host::{host_list_hosts, host_delete_host, host_insert_host, host_set_host, host_update_host};

pub struct MyState {
    connection: Connection,
}

unsafe impl Sync for MyState {}

unsafe impl Send for MyState {}

#[cfg(debug_assertions)]
fn debug_setup(app: &mut App<Wry>) {
    let console_appender = ConsoleAppender::builder()
        .encoder(Box::new(PatternEncoder::new("{d(%H:%M:%S)} {l} {T} - {m}{n}")))
        .build();
    let config = Config::builder()
        .appender(Appender::builder().build("stdout", Box::new(console_appender)))
        .build(Root::builder().appender("stdout").build(LevelFilter::Debug)).unwrap();
    log4rs::init_config(config).unwrap();

    let mut app_dir = app.path_resolver().resource_dir().unwrap();
    app_dir.pop();
    app_dir.push("EnvOptions2DebugRoaming");
    if !app_dir.exists() {
        fs::create_dir(app_dir.as_path()).unwrap();
    }

    app_dir.push("base.db3");
    if !app_dir.exists() {
        let mut resource_dir = app.path_resolver().resource_dir().unwrap();
        resource_dir.push("resources");
        resource_dir.push("base.db3");
        fs::copy(resource_dir.as_path(), app_dir.as_path()).unwrap();
    }

    let connection = Connection::open(app_dir.as_path()).unwrap();

    app.manage(MyState {
        connection
    });
}

#[cfg(not(debug_assertions))]
fn setup(app: &mut App<Wry>) {
    let mut app_dir = app.path_resolver().app_dir().unwrap();
    if !app_dir.exists() {
        fs::create_dir(app_dir.as_path()).unwrap();
    }

    app_dir.push("base.db3");
    if !app_dir.exists() {
        let mut resource_dir = app.path_resolver().resource_dir().unwrap();
        resource_dir.push("resources");
        resource_dir.push("base.db3");
        fs::copy(resource_dir.as_path(), app_dir.as_path()).unwrap();
    }

    let connection = Connection::open(app_dir.as_path()).unwrap();

    app.manage(MyState {
        connection
    });
}

/*#[command]
async fn close_splashscreen(window: Window<Wry>) {
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    window.get_window("main").unwrap().show().unwrap();
}*/

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            debug_setup(app);
            #[cfg(not(debug_assertions))]
            setup(app);
            Ok(())
        })
        // .menu(tauri::Menu::os_default(&context.package_info().name))
        .invoke_handler(tauri::generate_handler![
            env_list_envs,
            env_update_env,
            env_set_env,
            env_delete_env,
            env_insert_env,
            host_list_hosts,
            host_delete_host,
            host_insert_host,
            host_set_host,
            host_update_host
        ])
        .run(context)
        .expect("error while running tauri application");
}
