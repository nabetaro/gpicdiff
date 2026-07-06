use std::process::Command;

fn main() {
    // compress changelog
    Command::new("gzip")
        .args(["-9", "-k", "-n", "-f", "../debian/changelog"])
        .current_dir(env!("CARGO_MANIFEST_DIR"))
        .status()
        .expect("compressing changelog: failed.");

    tauri_build::build()
}
