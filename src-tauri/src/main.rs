// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use clap::Parser;
use tauri::Emitter;
use tauri::Listener;
use tauri::Manager;

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

fn build_payload(args: &Args) -> Option<FileSetPayload> {
    if let (Some(file1), Some(file2)) = (args.file1.clone(), args.file2.clone()) {
        let label1 = args.label1.clone().unwrap_or(file1.clone());
        let label2 = args.label2.clone().unwrap_or(file2.clone());
        let title = format!("{} <=> {}", label1, label2);

        Some(FileSetPayload {
            file1: FileInfo {
                data: file1.clone(),
                label: label1,
            },
            file2: FileInfo {
                data: file2.clone(),
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
