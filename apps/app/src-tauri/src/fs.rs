use serde::{Deserialize, Serialize};
use std::fs;
use std::fs::File;
use std::io;
use std::io::prelude::*;
use std::io::Error;
use std::path::{Path, PathBuf};

// 引入 base64 crate
use base64::engine::general_purpose::STANDARD;
use base64::Engine;

#[derive(Debug, Serialize, Deserialize)]
pub struct FileOrDir {
    name: String,
    path: String,
    is_directory: bool,
    children: Vec<FileOrDir>,
}

#[tauri::command]
pub fn is_file_exists(file_path: &str) -> bool {
    Path::new(file_path).exists()
}

#[tauri::command]
pub fn read_file_as_base64(file_path: &str) -> Result<String, String> {
    let bytes = fs::read(file_path).map_err(|e| e.to_string())?;
    Ok(STANDARD.encode(bytes))
}

#[tauri::command]
pub fn read_text_file(file_path: &str) -> Result<String, String> {
    read_text_file_internal(file_path).map_err(|e| e.to_string())
}

fn read_text_file_internal(file_path: &str) -> Result<String, Error> {
    let mut file = File::open(file_path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

#[tauri::command]
pub fn list_files_and_directories(dir_path: &str) -> Result<FileOrDir, String> {
    list_files_and_directories_internal(dir_path).map_err(|e| e.to_string())
}

fn list_files_and_directories_internal<P: AsRef<Path>>(dir: P) -> io::Result<FileOrDir> {
    let path = dir.as_ref();
    let name = path
        .file_name()
        .unwrap_or_default()
        .to_string_lossy()
        .into_owned();
    let is_directory = path.is_dir();
    let mut children = Vec::new();

    if is_directory {
        for entry in fs::read_dir(path)? {
            let entry = entry?;
            children.push(list_files_and_directories_internal(entry.path())?);
        }
    }

    Ok(FileOrDir {
        name,
        path: path.to_string_lossy().into_owned(),
        is_directory,
        children,
    })
}

#[tauri::command]
pub fn read_file(path: &str) -> Vec<u8> {
    fs::read(path).unwrap_or_default()
}

#[tauri::command]
pub fn write_file(path: PathBuf, data: Vec<u8>) -> Result<(), String> {
    fs::write(&path, data).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn copy_directory(source_path: &str, target_path: &str) -> Result<(), String> {
    let source = Path::new(source_path);
    let target = Path::new(target_path);

    if !source.exists() {
        return Err(format!("Source path does not exist: {}", source_path));
    }

    fn copy_dir_recursive(source: &Path, target: &Path) -> io::Result<()> {
        if !target.exists() {
            fs::create_dir(target)?;
        }

        for entry in fs::read_dir(source)? {
            let entry = entry?;
            let entry_path = entry.path();
            let dest_path = target.join(entry.file_name());

            if entry_path.is_dir() {
                copy_dir_recursive(&entry_path, &dest_path)?;
            } else {
                fs::copy(&entry_path, &dest_path)?;
            }
        }
        Ok(())
    }

    copy_dir_recursive(source, target).map_err(|e| e.to_string())
}