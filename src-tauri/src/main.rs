#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

mod env;
mod scan;
mod host;

use tauri::{App, Manager, Wry};
use std::fs;
use log4rs::append::console::ConsoleAppender;
use log4rs::encode::pattern::PatternEncoder;
use log4rs::config::{Root, Config, Appender};
use log::{LevelFilter};
use rusqlite::Connection;
use scan::{scan_key_press};
use host::{host_list_hosts};

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
    app_dir.push("EnvOptions2DebugData");
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
fn setup(app: &mut App<Wry>) {}

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
        .invoke_handler(tauri::generate_handler![scan_key_press, host_list_hosts])
        .run(context)
        .expect("error while running tauri application");
}
