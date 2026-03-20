use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io;
use std::io::prelude::*;
use std::path::{Path, PathBuf};
use std::time::UNIX_EPOCH;

/// 表示目录中的实体（文件或目录）
#[derive(Debug, Serialize, Deserialize)]
pub struct DirEntity {
    pub name: String,
    pub path: String,
    pub is_directory: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub child: Option<Vec<DirEntity>>,
}

/// 表示文件的统计信息
#[derive(Serialize, Deserialize)]
pub struct FileStat {
    pub create_time: u64,
    pub modify_time: u64,
    pub size: u64,
    pub is_file: bool,
    pub is_dir: bool,
    pub mode: u32,
}

/// 将多个路径片段连接成一个路径
#[tauri::command]
pub async fn join_path(paths: Vec<String>) -> Result<String, String> {
    use std::path::MAIN_SEPARATOR;
    let joined = paths.join(&MAIN_SEPARATOR.to_string());
    Ok(joined)
}

/// 获取路径的绝对路径
#[tauri::command]
pub async fn get_absolute_path(path: String) -> Result<String, String> {
    std::fs::canonicalize(&path)
        .map(|p| p.to_string_lossy().to_string())
        .map_err(|e| e.to_string())
}

/// 检查路径是否存在
#[tauri::command]
pub async fn path_exists(path: String) -> Result<bool, String> {
    Ok(Path::new(&path).exists())
}

/// 分割路径为目录和文件名部分
#[tauri::command]
pub async fn split_path(path: String) -> Result<(String, String), String> {
    let path_obj = Path::new(&path);
    let dir = path_obj
        .parent()
        .map(|p| p.to_string_lossy().to_string())
        .unwrap_or_default();
    let base = path_obj
        .file_name()
        .map(|p| p.to_string_lossy().to_string())
        .unwrap_or_default();
    Ok((dir, base))
}

/// 创建文件或目录
///
/// # 参数
/// * `path` - 要创建的文件或目录的路径
/// * `fs_type` - 类型 ("file" 或 "dir")
/// * `recursive` - 是否递归创建目录 (默认为 true)
/// * `overwrite` - 如果文件存在是否覆盖 (仅适用于文件，默认为 false)
#[tauri::command]
pub async fn create(
    path: String,
    fs_type: String,
    recursive: Option<bool>,
    overwrite: Option<bool>,
) -> Result<i32, String> {
    let recursive = recursive.unwrap_or(true);
    let overwrite = overwrite.unwrap_or(false);

    match fs_type.as_str() {
        "file" => {
            let path_buf = PathBuf::from(&path);
            if let Some(parent) = path_buf.parent() {
                if !parent.exists() && recursive {
                    std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
                }
            }

            if path_buf.exists() && !overwrite {
                return Err("File already exists and overwrite is false".to_string());
            }

            File::create(&path_buf).map_err(|e| e.to_string())?;
        }
        "dir" => {
            if recursive {
                std::fs::create_dir_all(&path).map_err(|e| e.to_string())?;
            } else {
                std::fs::create_dir(&path).map_err(|e| e.to_string())?;
            }
        }
        _ => return Err("Invalid fs_type. Must be 'file' or 'dir'".to_string()),
    }

    Ok(0)
}

/// 删除文件或目录
///
/// # 参数
/// * `path` - 要删除的文件或目录的路径
/// * `fs_type` - 类型 ("file" 或 "dir")
/// * `recursive` - 是否递归删除目录内容 (仅适用于目录，默认为 false)
#[tauri::command]
pub async fn delete(path: String, fs_type: String, recursive: Option<bool>) -> Result<i32, String> {
    let recursive = recursive.unwrap_or(false);

    match fs_type.as_str() {
        "file" => {
            std::fs::remove_file(&path).map_err(|e| e.to_string())?;
        }
        "dir" => {
            if recursive {
                std::fs::remove_dir_all(&path).map_err(|e| e.to_string())?;
            } else {
                std::fs::remove_dir(&path).map_err(|e| e.to_string())?;
            }
        }
        _ => return Err("Invalid fs_type. Must be 'file' or 'dir'".to_string()),
    }

    Ok(0)
}

/// 重命名或移动文件或目录
///
/// # 参数
/// * `old_path` - 原始路径
/// * `new_path` - 新路径
#[tauri::command]
pub async fn rename(old_path: String, new_path: String) -> Result<i32, String> {
    
    std::fs::rename(&old_path, &new_path).map_err(|e| e.to_string())?;
    // 成功时返回 0
    Ok(0)
}

/// 检查路径是否为特定类型
///
/// # 参数
/// * `path` - 要检查的路径
/// * `fs_type` - 类型 ("file" 或 "dir")
#[tauri::command]
pub async fn is_type(path: String, fs_type: String) -> Result<bool, String> {
    let metadata = std::fs::metadata(&path).map_err(|e| e.to_string())?;

    match fs_type.as_str() {
        "file" => Ok(metadata.is_file()),
        "dir" => Ok(metadata.is_dir()),
        _ => Err("Invalid fs_type. Must be 'file' or 'dir'".to_string()),
    }
}

/// 复制文件或目录
///
/// # 参数
/// * `src_path` - 源路径
/// * `dst_path` - 目标路径
/// * `fs_type` - 类型 ("file" 或 "dir")
/// * `overwrite` - 如果目标已存在是否覆盖 (默认为 false)
#[tauri::command]
pub async fn copy(
    src_path: String,
    dst_path: String,
    fs_type: String,
    overwrite: Option<bool>,
) -> Result<i32, String> {
    let overwrite = overwrite.unwrap_or(false);

    if !overwrite && Path::new(&dst_path).exists() {
        return Err("Destination already exists and overwrite is false".to_string());
    }

    match fs_type.as_str() {
        "file" => {
            std::fs::copy(&src_path, &dst_path)
                .map(|_| ())
                .map_err(|e| e.to_string())?;
        }
        "dir" => {
            copy_dir_recursive(&src_path, &dst_path).map_err(|e| e.to_string())?;
        }
        _ => return Err("Invalid fs_type. Must be 'file' or 'dir'".to_string()),
    }

    Ok(0)
}

/// 递归复制目录内容
fn copy_dir_recursive(src: &str, dst: &str) -> io::Result<()> {
    if !Path::new(dst).exists() {
        std::fs::create_dir(dst)?;
    }

    for entry in std::fs::read_dir(src)? {
        let entry = entry?;
        let entry_path = entry.path();
        let dest_path = Path::new(dst).join(entry.file_name());

        if entry_path.is_dir() {
            copy_dir_recursive(&entry_path.to_string_lossy(), &dest_path.to_string_lossy())?;
        } else {
            std::fs::copy(&entry_path, &dest_path)?;
        }
    }

    Ok(())
}

/// 读取文件内容
///
/// # 参数
/// * `file_path` - 文件路径
/// * `encoding` - 文件编码 (默认为 "utf-8")
#[tauri::command]
pub async fn read_file_content(
    file_path: String,
    encoding: Option<String>,
) -> Result<String, String> {
    let _encoding = encoding.unwrap_or_else(|| "utf-8".to_string());

    std::fs::read_to_string(&file_path).map_err(|e| e.to_string())
}

/// 按行读取文件内容
///
/// # 参数
/// * `file_path` - 文件路径
/// * `encoding` - 文件编码 (默认为 "utf-8")
#[tauri::command]
pub async fn read_file_by_line(
    file_path: String,
    encoding: Option<String>,
) -> Result<Vec<String>, String> {
    let _encoding = encoding.unwrap_or_else(|| "utf-8".to_string());
    let content = std::fs::read_to_string(&file_path).map_err(|e| e.to_string())?;
    Ok(content.lines().map(|s| s.to_string()).collect())
}

/// 写入内容到文件
///
/// # 参数
/// * `file_path` - 文件路径
/// * `content` - 要写入的内容
/// * `append` - 是否追加到文件末尾 (默认为 false)
/// * `encoding` - 文件编码 (默认为 "utf-8")
#[tauri::command]
pub async fn write_file_content(
    file_path: String,
    content: String,
    append: Option<bool>,
    encoding: Option<String>,
) -> Result<i32, String> {
    let append = append.unwrap_or(false);
    let _encoding = encoding.unwrap_or_else(|| "utf-8".to_string());

    let path_buf = PathBuf::from(&file_path);
    if let Some(parent) = path_buf.parent() {
        if !parent.exists() {
            std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
    }

    if append {
        std::fs::OpenOptions::new()
            .append(true)
            .create(true)
            .open(&file_path)
            .map_err(|e| e.to_string())?
            .write_all(content.as_bytes())
            .map_err(|e| e.to_string())?;
    } else {
        std::fs::write(&file_path, content).map_err(|e| e.to_string())?;
    }

    Ok(0)
}

/// 获取文件大小
///
/// # 参数
/// * `file_path` - 文件路径
#[tauri::command]
pub async fn get_file_size(file_path: String) -> Result<u64, String> {
    std::fs::metadata(&file_path)
        .map(|meta| meta.len())
        .map_err(|e| e.to_string())
}

/// 列出目录内容
///
/// # 参数
/// * `dir_path` - 目录路径
/// * `recursive` - 是否递归列出子目录内容 (默认为 false)
#[tauri::command]
pub async fn list_dir(dir_path: String, recursive: Option<bool>) -> Result<Vec<DirEntity>, String> {
    let recursive = recursive.unwrap_or(false);
    list_directory_internal(&dir_path, recursive).map_err(|e| e.to_string())
}

/// 递归列出目录内容的内部实现
fn list_directory_internal(dir_path: &str, recursive: bool) -> io::Result<Vec<DirEntity>> {
    let mut entities = Vec::new();

    for entry in std::fs::read_dir(dir_path)? {
        let entry = entry?;
        let file_type = entry.file_type()?;

        let entity = DirEntity {
            name: entry.file_name().to_string_lossy().to_string(),
            path: entry.path().to_string_lossy().to_string(),
            is_directory: file_type.is_dir(),
            child: if file_type.is_dir() && recursive {
                Some(list_directory_internal(
                    &entry.path().to_string_lossy(),
                    true,
                )?)
            } else {
                None
            },
        };

        entities.push(entity);
    }

    Ok(entities)
}

/// 获取文件统计信息
///
/// # 参数
/// * `path` - 文件或目录路径
#[tauri::command]
pub async fn get_file_stat(path: String) -> Result<FileStat, String> {
    let metadata = std::fs::metadata(&path).map_err(|e| e.to_string())?;

    let create_time = metadata
        .created()
        .unwrap_or(UNIX_EPOCH)
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_secs();

    let modify_time = metadata
        .modified()
        .unwrap_or(UNIX_EPOCH)
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_secs();

    // 根据操作系统平台设置权限模式
    #[cfg(unix)]
    let mode = metadata.permissions().mode();
    #[cfg(not(unix))]
    let mode = 0o644; // 在 Windows 上默认使用 0o644 模式

    Ok(FileStat {
        create_time,
        modify_time,
        size: metadata.len(),
        is_file: metadata.is_file(),
        is_dir: metadata.is_dir(),
        mode,
    })
}
