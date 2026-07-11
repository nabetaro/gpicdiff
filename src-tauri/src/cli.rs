// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 KURASAWA Nozomu (nabetaro) <nabetaro@caldron.jp>

use clap::Parser;

#[derive(Parser, Debug, Clone, Default)]
#[command(name = "gpicdiff", about = "Image diff viewer", ignore_errors = true)]
pub struct Args {
    /// 1st pic path
    pub file1: Option<String>,

    /// 2nd pic path
    pub file2: Option<String>,

    /// label for 1st pic
    #[arg(long)]
    pub label1: Option<String>,

    /// label for 2nd pic
    #[arg(long)]
    pub label2: Option<String>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_file_paths_and_labels() {
        let args = Args::try_parse_from([
            "gpicdiff", "a.png", "b.png", "--label1", "old", "--label2", "new"
        ]).unwrap();
        assert_eq!(args.file1, Some("a.png".to_string()));
        assert_eq!(args.label1, Some("old".to_string()));
    }
}
