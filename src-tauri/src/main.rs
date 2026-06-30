// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use clap::Parser;
use tauri::Emitter;
use tauri::Listener;

#[derive(Parser, Debug, Clone)]
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
}

#[derive(Clone, serde::Serialize)]
struct FileInfo {
    data: String,
    label: String,
}

fn main() {
    let args = Args::parse();

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(move |app| {
            if let (Some(file1), Some(file2)) = (args.file1.clone(), args.file2.clone()) {
                let payload = FileSetPayload {
                    file1: FileInfo {
                        data: file1.clone(),
                        label: args.label1.unwrap_or(file1),
                    },
                    file2: FileInfo {
                        data: file2.clone(),
                        label: args.label2.unwrap_or(file2),
                    },
                };

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
