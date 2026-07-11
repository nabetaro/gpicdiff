// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 KURASAWA Nozomu (nabetaro) <nabetaro@caldron.jp>

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod cli;
mod fileset;
mod commands;
mod tempfile;
mod app;

use clap::Parser;
use cli::Args;

fn main() {
    let args = Args::parse();
    app::run(args);
}
