// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 KURASAWA Nozomu (nabetaro) <nabetaro@caldron.jp>

use crate::tempfile::copy_to_temp;

#[derive(Clone, serde::Serialize)]
pub struct FileSetPayload {
    pub file1: FileInfo,
    pub file2: FileInfo,
    pub title: String,
}

#[derive(Clone, serde::Serialize)]
pub struct FileInfo {
    pub data: String,
    pub label: String,
}

pub fn build_payload(args: &crate::cli::Args) -> Option<FileSetPayload> {
    if let (Some(file1), Some(file2)) = (args.file1.clone(), args.file2.clone()) {
        let label1 = args.label1.clone().unwrap_or(file1.clone());
        let label2 = args.label2.clone().unwrap_or(file2.clone());
        let title = format!("{} <=> {}", label1, label2);

        let tmp1 = copy_to_temp(&file1).unwrap_or_else(|e| {
            eprintln!("Failed to copy temp file: {}", e);
            file1
        });
        let tmp2 = copy_to_temp(&file2).unwrap_or_else(|e| {
            eprintln!("Failed to copy temp file: {}", e);
            file2
        });

        Some(FileSetPayload {
            file1: FileInfo { data: tmp1, label: label1 },
            file2: FileInfo { data: tmp2, label: label2 },
            title,
        })
    } else {
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::cli::Args;

    #[test]
    fn build_payload_returns_none_when_files_missing() {
        let args = Args::default();
        assert!(build_payload(&args).is_none());
    }

    #[test]
    fn build_payload_uses_path_as_label_when_label_omitted() {
        let args = Args {
            file1: Some("/tmp/a.png".into()),
            file2: Some("/tmp/b.png".into()),
            label1: None,
            label2: None,
        };
        let payload = build_payload(&args).unwrap();
        assert_eq!(payload.file1.label, "/tmp/a.png");
        assert_eq!(payload.title, "/tmp/a.png <=> /tmp/b.png");
    }
}
