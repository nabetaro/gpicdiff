// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use clap::Parser;
use tauri::Emitter;
use tauri::Listener;
use tauri::Manager;
use std::path::PathBuf;

#[derive(Parser, Debug, Clone, Default)]
#[command(name = "gpicdiff", about = "Image diff viewer", ignore_errors = true)]
struct Args {
    /// 1st pic path
    file1: Option<String>,

    /// 2nd pic path
    file2: Option<String>,

    /// label for 1st pic
    #[arg(long)]
    label1: Option<String>,

    /// label for 2nd pic
    #[arg(long)]
    label2: Option<String>,
}

#[derive(Clone, serde::Serialize)]
struct FileSetPayload {
    file1: FileInfo,
    file2: FileInfo,
    title: String,
}

#[derive(Clone, serde::Serialize)]
struct FileInfo {
    data: String,
    label: String,
}

fn copy_to_temp(src: &str) -> Result<String, std::io::Error> {
    let src_path = PathBuf::from(src);
    let ext = src_path.extension()
        .and_then(|e| e.to_str())
        .unwrap_or("png");

    let tmp_dir = std::env::temp_dir().join("gpicdiff");
    std::fs::create_dir_all(&tmp_dir)?;

    // generate unique filepath
    let uuid = uuid::Uuid::new_v4().to_string();
    let tmp_path = tmp_dir.join(format!("{}.{}", uuid, ext));

    std::fs::copy(src, &tmp_path)?;
    Ok(tmp_path.to_string_lossy().to_string())
}

#[tauri::command]
fn remove_temp_files(paths: Vec<String>) {
    for path in paths {
        if path.contains("gpicdiff") {
            let _ = std::fs::remove_file(&path);
        }
    }
}

fn build_payload(args: &Args) -> Option<FileSetPayload> {
    if let (Some(file1), Some(file2)) = (args.file1.clone(), args.file2.clone()) {
        let label1 = args.label1.clone().unwrap_or(file1.clone());
        let label2 = args.label2.clone().unwrap_or(file2.clone());
        let title = format!("{} <=> {}", label1, label2);

        // copy tmp file
        let tmp1 = copy_to_temp(&file1).unwrap_or(file1);
        let tmp2 = copy_to_temp(&file2).unwrap_or(file2);

        Some(FileSetPayload {
            file1: FileInfo {
                data: tmp1,
                label: label1,
            },
            file2: FileInfo {
                data: tmp2,
                label: label2,
            },
            title,
        })
    } else {
        None
    }
}

fn main() {
    let args = Args::parse();

    tauri::Builder::default()
        .plugin(
            tauri_plugin_single_instance::init(|app, args, _cwd| {
                // 2回目以降の起動時にここが呼ばれる
                // argv を再パースして fileset を送信
                let new_args = Args::try_parse_from(&args)
                    .unwrap_or_default();
                if let Some(payload) = build_payload(&new_args) {
                    app.emit("fileSet", payload).unwrap();
                }
                // ウィンドウを前面に出す
                if let Some(window) = app.get_webview_window("main") {
                    window.set_focus().unwrap();
                }
            })
        )
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![remove_temp_files])
        .setup(move |app| {
            if let Some(payload) = build_payload(&args) {
                let app_handle = app.handle().clone();
                app.listen("frontend-ready", move |_| {
                    app_handle.emit("fileSet", payload.clone()).unwrap();
                });
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
