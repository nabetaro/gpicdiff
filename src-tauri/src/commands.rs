// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 KURASAWA Nozomu (nabetaro) <nabetaro@caldron.jp>

use crate::tempfile::remove_files;

#[tauri::command]
pub fn remove_temp_files(paths: Vec<String>) {
    remove_files(paths);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn remove_temp_files_skips_paths_without_gpicdiff() {
        let tmp = std::env::temp_dir().join("not_related.png");
        std::fs::write(&tmp, b"dummy").unwrap();

        remove_temp_files(vec![tmp.to_string_lossy().to_string()]);

        assert!(tmp.exists());
        std::fs::remove_file(&tmp).ok();
    }
}
