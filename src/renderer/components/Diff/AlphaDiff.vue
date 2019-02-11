<template>
  <div id="alpha-diff">
    <div id="image-content">
      <div id="file1" class="diff-image" v-bind:style="{opacity:file1_opacity}">
        <img :src="file1" alt="file1"/>
      </div>
      <div id="file2" class="diff-image" v-bind:style="{opacity:file2_opacity}">
        <img :src="file2" alt="file2"/>
      </div>
    </div>
    <div class="alpha-range">
      <input type="range" v-model="opacity" @change="setOpacity" @input="setOpacity">
    </div>
  </div>
</template>

<script>
 export default {
   data () {
     return {
       file1: 'hoge',
       file2: 'hoge',
       opacity: 50,
       file1_opacity: 0.5,
       file2_opacity: 0.5
     }
   },
   mounted () {
     this.$electron.ipcRenderer.on('file1', (event, data) => {
       this.file1 = data
     })
     this.$electron.ipcRenderer.on('file2', (event, data) => {
       this.file2 = data
     })
   },
   methods: {
     setOpacity (e) {
       this.file1_opacity = 1 - (this.opacity / 100)
       this.file2_opacity = this.opacity / 100
     }
   }
 }
</script>

<style lang="scss">
 #alpha-diff {
   width: 100vw;
   height: 100vh;
   position: relative;
   #image-content {
     overflow: scroll;
     width: 100vw;
     height: 90vh;
     background-color: #bbb;
   }
   .diff-image{
     position: absolute;
     opacity: 0.5;
   }
   .alpha-range {
     position: absolute;
     bottom: 0;
     left: 0;
     padding: 0 5vw;
     width: 100vw;
     height: 10vh;
     input {
       position: relative;
       width: 90vw;
       line-height: 10vh;
     }
   }
 }
</style>
