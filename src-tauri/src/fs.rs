use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::prelude::*;
use std::io::BufReader;
use std::io::Error;
use std::path::Path;
use std::{fs, io};

#[derive(Debug, Serialize, Deserialize)]
pub struct FileOrDir {
    name: String,
    path: String,
    is_directory: bool,
    children: Vec<FileOrDir>,
}

#[tauri::command]
pub fn read_text_file(filepath: &str) -> Result<String, String> {
    read_text_file_internal(filepath).map_err(|e| e.to_string())
}

pub fn read_text_file_internal(filepath: &str) -> Result<String, Error> {
    let f = File::open(filepath)?;
    let mut reader = BufReader::new(f);
    let mut buffer = String::new();

    // Read the entire file into buffer
    reader.read_to_string(&mut buffer)?;

    Ok(buffer)
}

/// 递归地列出目录下的所有文件和子目录，并返回一个包含文件和目录信息的向量
pub fn list_files_and_directories_internal<P: AsRef<Path>>(dir: P) -> io::Result<FileOrDir> {
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
            let entry_path = entry.path();
            children.push(list_files_and_directories_internal(entry_path)?);
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
pub fn list_files_and_directories(dir_path: &str) -> Result<FileOrDir, String> {
    list_files_and_directories_internal(dir_path).map_err(|e| e.to_string())
}
