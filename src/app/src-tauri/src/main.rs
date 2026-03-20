// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use csa_lib::fs;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            fs::join_path,
            fs::get_absolute_path,
            fs::path_exists,
            fs::split_path,
            fs::create,
            fs::delete,
            fs::rename,
            fs::is_type,
            fs::copy,
            fs::read_file_content,
            fs::read_file_by_line,
            fs::list_dir,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
