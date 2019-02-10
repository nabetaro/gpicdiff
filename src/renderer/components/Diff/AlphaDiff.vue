<template>
  <div>
  <div id="file1">
    <img :src="filepath1" alt="file1"/>
  </div>
  <div id="file2">
    <img :src="filepath2" alt="file2"/>
  </div>
  <input type="range" name="alpha">
  </div>
</template>

<script>
 const fs = require('fs')
 export default {
   data () {
     return {
       filepath1: 'hoge',
       filepath2: 'hoge'
     }
   },
   mounted () {
     this.$electron.ipcRenderer.on('file1', (event, path) => {
       console.log('filepath1:' + path)
       readDataURL(path, (data) => { this.filepath1 = data })
     })
     this.$electron.ipcRenderer.on('file2', (event, path) => {
       readDataURL(path, (data) => { this.filepath2 = data })
     })
   }
 }
 function readDataURL (path, handler) {
   console.log(path)
   fs.readFile(path, (err, data) => {
     if (err) throw err
     const blob = new Blob([data])

     const reader = new FileReader()
     reader.onload = (e) => {
       console.log('filedata:' + e.target.result)
       handler(e.target.result)
     }
     reader.readAsDataURL(blob)
   })
 }
</script>

<style>
</style>
