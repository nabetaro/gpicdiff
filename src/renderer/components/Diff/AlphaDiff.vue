<template>
  <div id="alpha-diff">
    <div id="image-content">
      <div id="file1" class="diff-image" v-bind:style="{opacity:file1_opacity}">
        <img :src="file1.data" alt=""/>
      </div>
      <div id="file2" class="diff-image" v-bind:style="{opacity:file2_opacity}">
        <img :src="file2.data" alt=""/>
      </div>
    </div>
    <div class="alpha-range">
      <input type="range" v-model="opacity">
      <div class="filename1">
        <input type="text" v-model="file1.label" readonly>
      </div>
      <div class="filename2">
        <input type="text" v-model="file2.label" readonly>
      </div>
    </div>
  </div>
</template>

<script>
 export default {
   data () {
     return {
       file1: { 'data': '', 'label': '' },
       file2: { 'data': '', 'label': '' },
       opacity: 50
     }
   },
   mounted () {
     this.$electron.ipcRenderer.on('fileSet', (event, data) => {
       this.file1 = data.file1
       this.file2 = data.file2
     })
   },
   computed: {
     file1_opacity: function () {
       return 1 - (this.opacity / 100)
     },
     file2_opacity: function () {
       return this.opacity / 100
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
     background-image: url('~@/assets/image/bg-image.png');
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
