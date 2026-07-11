// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 KURASAWA Nozomu (nabetaro) <nabetaro@caldron.jp>

use std::path::{Path, PathBuf};

fn temp_dir() -> PathBuf {
    std::env::temp_dir().join("gpicdiff")
}

pub fn copy_to_temp(src: &str) -> Result<String, std::io::Error> {
    let src_path = Path::new(src);
    let ext = src_path.extension()
        .and_then(|e| e.to_str())
        .unwrap_or("png");

    let tmp_dir = temp_dir();
    std::fs::create_dir_all(&tmp_dir)?;

    let uuid = uuid::Uuid::new_v4().to_string();
    let tmp_path = tmp_dir.join(format!("{}.{}", uuid, ext));

    std::fs::copy(src, &tmp_path)?;
    Ok(tmp_path.to_string_lossy().to_string())
}

pub fn remove_files(paths: Vec<String>) {
    let tmp_dir = temp_dir();
    for path in paths {
        let p = Path::new(&path);
        if p.starts_with(&tmp_dir) {
            let _ = std::fs::remove_file(p);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn copy_to_temp_preserves_extension() {
        let tmp = std::env::temp_dir().join("gpicdiff_test_src.png");
        std::fs::write(&tmp, b"dummy").unwrap();

        let result = copy_to_temp(tmp.to_str().unwrap()).unwrap();
        assert!(result.ends_with(".png"));

        std::fs::remove_file(&tmp).ok();
        std::fs::remove_file(&result).ok();
    }

    #[test]
    fn remove_files_skips_paths_outside_temp_dir() {
        let tmp = std::env::temp_dir().join("not_related.png");
        std::fs::write(&tmp, b"dummy").unwrap();

        remove_files(vec![tmp.to_string_lossy().to_string()]);

        assert!(tmp.exists());
        std::fs::remove_file(&tmp).ok();
    }

    #[test]
    fn remove_files_deletes_files_in_temp_dir() {
        let tmp_dir = temp_dir();
        std::fs::create_dir_all(&tmp_dir).unwrap();
        let tmp = tmp_dir.join("test_remove.png");
        std::fs::write(&tmp, b"dummy").unwrap();

        remove_files(vec![tmp.to_string_lossy().to_string()]);

        assert!(!tmp.exists());
    }
}
