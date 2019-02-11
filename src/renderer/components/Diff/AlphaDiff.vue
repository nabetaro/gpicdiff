<template>
  <div>
  <div id="file1">
    <img :src="file1" alt="file1"/>
  </div>
  <div id="file2">
    <img :src="file2" alt="file2"/>
  </div>
  <input type="range" name="alpha">
  </div>
</template>

<script>
 export default {
   data () {
     return {
       file1: 'hoge',
       file2: 'hoge'
     }
   },
   mounted () {
     this.$electron.ipcRenderer.on('file1', (event, data) => {
       this.file1 = data
     })
     this.$electron.ipcRenderer.on('file2', (event, data) => {
       this.file2 = data
     })
   }
 }
</script>

<style>
</style>
