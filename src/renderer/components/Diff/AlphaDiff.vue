<template>
  <div id="alpha-diff">
    <div id="image-content">
      <div id="file1" class="diff-image" v-bind:style="{opacity:file1_opacity}">
        <img :src="filedata1" alt=""/>
      </div>
      <div id="file2" class="diff-image" v-bind:style="{opacity:file2_opacity}">
        <img :src="filedata2" alt=""/>
      </div>
    </div>
    <div class="alpha-range">
      <input type="range" v-model="opacity" @change="setOpacity" @input="setOpacity">
      <div class="filename1">
        <input type="text" v-model="filelabel1" readonly>
      </div>
      <div class="filename2">
        <input type="text" v-model="filelabel2" readonly>
      </div>
    </div>
  </div>
</template>

<script>
 export default {
   data () {
     return {
       filedata1: '',
       filedata2: '',
       filelabel1: '',
       filelabel2: '',
       opacity: 50,
       file1_opacity: 0.5,
       file2_opacity: 0.5
     }
   },
   mounted () {
     this.$electron.ipcRenderer.on('file1', (event, data) => {
       this.filedata1 = data.data
       this.filelabel1 = data.label
     })
     this.$electron.ipcRenderer.on('file2', (event, data) => {
       this.filedata2 = data.data
       this.filelabel2 = data.label
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
     position: absolute;
     overflow: scroll;
     width: 100vw;
     height: calc(100vh - 6em);
     background-color: #bbb;
   }
   .diff-image{
     position: absolute;
     opacity: 0.5;
   }
   .alpha-range {
     position: absolute;
     background-image: url("/assets/images/bg-image.png");
     bottom: 0;
     left: 0;
     padding: 0 5vw;
     width: 100vw;
     height: 5em;
     input[type=range] {
       position: relative;
       width: 90vw;
       line-height: 10vh;
     }
     .filename1 {
       white-space: nowrap;
       width: 100%;
       text-align: left;
       input[type=text] {
         width: calc(90vw - 2.5em);
       }
     }
     .filename1:before {
       content: "▲";
       display: inline-block;
       width: 1em;
     }
     .filename2 {
       white-space: nowrap;
       width: 100%;
       text-align: right;
       input[type=text] {
         width: calc(90vw - 2.5em);
       }
       padding-left: 1em;
     }
     .filename2:after {
       content: "▲";
       display: inline-block;
       width: 1em;
     }
   }
 }
</style>
