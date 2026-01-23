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

/**
 * @description 复制目录
 * @param from 源路径
 * @param to 目标路径
 * @param recursive 是否递归复制目录，默认true
 * @returns Result<(), String> Ok:复制成功，Err:复制失败及错误信息
 * @throws Error
 */
#[tauri::command]
pub fn copy_file_or_directory(from: &str, to: &str, recursive: Option<bool>) -> Result<(), String> {
    let source = Path::new(from);
    let target = Path::new(to);
    let recursive = recursive.unwrap_or(true);

    if !source.exists() {
        return Err(format!("Source path does not exist: {}", from));
    }
    // 创建目标目录
    if !target.exists() {
        fs::create_dir_all(target).map_err(|e| e.to_string())?;
    }

    if recursive {
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
    } else {
        // 非递归复制，只复制顶层目录
        if !target.exists() {
            fs::create_dir(target).map_err(|e| e.to_string())?;
        }

        for entry in fs::read_dir(source).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            let entry_path = entry.path();
            let dest_path = target.join(entry.file_name());

            // 只复制文件，不处理子目录
            if entry_path.is_file() {
                fs::copy(&entry_path, &dest_path).map_err(|e| e.to_string())?;
            }
        }
        Ok(())
    }
}

/**
 * @description 删除文件或目录
 * @param path 要删除的文件或目录路径
 * @param recursive 是否递归删除目录，默认true
 * @returns Result<(), String> Ok:删除成功，Err:删除失败及错误信息
 * @throws Error
 */
#[tauri::command]
pub fn remove_file_or_directory(path: &str, recursive: Option<bool>) -> Result<(), String> {
    let target_path = Path::new(path);
    let recursive = recursive.unwrap_or(true);

    if !target_path.exists() {
        return Err(format!("Path does not exist: {}", path));
    }

    if target_path.is_file() {
        // 如果是文件，直接删除
        fs::remove_file(target_path).map_err(|e| e.to_string())
    } else if target_path.is_dir() {
        // 如果是目录
        if recursive {
            // 递归删除整个目录
            fs::remove_dir_all(target_path).map_err(|e| e.to_string())
        } else {
            // 只删除空目录
            fs::remove_dir(target_path).map_err(|e| e.to_string())
        }
    } else {
        Err(format!("Path is neither a file nor a directory: {}", path))
    }
}
