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
pub fn is_file_exists(filepath: &str) -> bool {
    return Path::new(&filepath).exists();
}

#[tauri::command]
// 定义一个函数，用于读取文本文件
pub fn read_text_file(filepath: &str) -> Result<String, String> {
    // 调用内部函数read_text_file_internal，传入文件路径
    read_text_file_internal(filepath).map_err(|e| e.to_string())
    // 如果读取文件成功，则返回文件内容
    // 如果读取文件失败，则返回错误信息
}
#[tauri::command]
// 定义一个函数，用于读取文本文件，返回一个Result类型，包含String或Error
pub fn read_text_file_internal(filepath: &str) -> Result<String, Error> {
    // 打开文件，如果失败则返回Error
    let f = File::open(filepath)?;
    // 创建一个BufReader对象，用于读取文件
    let mut reader = BufReader::new(f);
    // 创建一个String对象，用于存储读取的文件内容
    let mut buffer = String::new();

    // Read the entire file into buffer
    reader.read_to_string(&mut buffer)?;

    Ok(buffer)
}

/// 递归地列出目录下的所有文件和子目录，并返回一个包含文件和目录信息的向量
#[tauri::command]
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

// 定义一个函数，用于列出指定路径下的文件和目录
#[tauri::command]
pub fn list_files_and_directories(dir_path: &str) -> Result<FileOrDir, String> {
    // 调用内部函数list_files_and_directories_internal，传入路径参数
    list_files_and_directories_internal(dir_path).map_err(|e| e.to_string())
    // 将内部函数的返回值转换为Result类型，如果内部函数返回错误，则将错误信息转换为字符串
}

#[tauri::command]
pub fn read_file(path: &str) -> Vec<u8> {
    std::fs::read(path).unwrap()
}

#[tauri::command]
pub fn write_file(path: std::path::PathBuf, data: Vec<u8>) {
    std::fs::write(path, data).unwrap()
}
