// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 KURASAWA Nozomu (nabetaro) <nabetaro@caldron.jp>

use tauri::Emitter;
use tauri::Listener;
use tauri::Manager;
use clap::Parser;

use crate::cli::Args;
use crate::fileset::build_payload;

pub fn run(args: Args) {
    let builder = tauri::Builder::default();


    #[cfg(not(any(target_os = "android", target_os = "ios")))]
    let builder =builder.plugin(
        tauri_plugin_single_instance::init(|app, argv, _cwd| {
            let new_args = Args::try_parse_from(&argv).unwrap_or_default();
            if let Some(payload) = build_payload(&new_args) {
                app.emit("fileSet", payload).unwrap();
            }
            if let Some(window) = app.get_webview_window("main") {
                window.set_focus().unwrap();
            }
        })
    );

    builder
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![crate::commands::remove_temp_files])
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
