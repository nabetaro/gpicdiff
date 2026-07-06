<!-- SPDX-License-Identifier: GPL-3.0-only -->
<!-- Copyright (C) 2024 KURASAWA Nozomu (nabetaro) <nabetaro@caldron.jp> -->

<template>
  <div id="alpha-diff">
    <div id="image-content">
      <div id="file1" class="diff-image" :style="{ opacity: file1Opacity }">
        <img :src="file1Src" alt=""/>
      </div>
      <div id="file2" class="diff-image" :style="{ opacity: file2Opacity }">
        <img :src="file2Src" alt=""/>
      </div>
    </div>
    <div class="alpha-range">
      <input type="range" v-model="opacity">
      <div class="filename1">
        <input type="text" :value="file1.label" readonly>
      </div>
      <div class="filename2">
        <input type="text" :value="file2.label" readonly>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { convertFileSrc } from '@tauri-apps/api/core'
import { useFileSetsStore } from '../../store/fileSets'

const fileSetsStore = useFileSetsStore()
const { currentFileSet } = storeToRefs(fileSetsStore)

const opacity = ref(50)

const file1 = computed(() => {
  return currentFileSet.value?.file1 ?? { data: '', label: '' }
})

const file2 = computed(() => {
  return currentFileSet.value?.file2 ?? { data: '', label: '' }
})

const file1Src = computed(() => file1.value.data ? convertFileSrc(file1.value.data) : '')
const file2Src = computed(() => file2.value.data ? convertFileSrc(file2.value.data) : '')

const file1Opacity = computed(() => 1 - (opacity.value / 100))
const file2Opacity = computed(() => opacity.value / 100)
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
    background-image: url('/src/assets/image/bg-image.png');
  }

  .diff-image {
    position: absolute;
    opacity: 0.5;
  }

  .alpha-range {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0 5vw;
    width: 100vw;
    height: 6.5em;

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
