module.exports = {
  runtimeCompiler: true,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "gpicdiff",
        appId: "jp.caldron.gpicdiff",
        afterPack: "CompensateFiles.js",
        mac: {
          icon: 'src/assets/icons/app.icns'
        },
        win: {
          icon: 'src/assets/icons/app.ico',
          target: "nsis"
        },
        linux: {
          synopsis: "Graphical Image Diff",
          target: [
            "deb",
            "rpm"
          ],
          icon: "src/assets/icons"
        },
        deb: {
          "packageCategory": "utils"
        }
      }
    }
  }
}
