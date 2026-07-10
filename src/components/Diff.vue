<!-- SPDX-License-Identifier: GPL-3.0-only -->
<!-- Copyright (C) 2024 KURASAWA Nozomu (nabetaro) <nabetaro@caldron.jp> -->

<template>
  <div id="wrapper">
    <div id="tabs" v-if="fileSets.length > 0">
      <span class="tab"
        v-for="(fs, i) in fileSets"
        :key="i"
        :class="{ active: i === currentIndex }"
        @click="switchTo(i)"
      >
        {{ fs.title ?? `diff ${i + 1}` }}
        <button class="close-btn" @click.stop="removeFileset(i)">✕</button>
      </span>
    </div>
    <alpha-diff></alpha-diff>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { listen, emit } from '@tauri-apps/api/event'
import { storeToRefs } from 'pinia'
import { invoke } from '@tauri-apps/api/core'
import AlphaDiff from './Diff/AlphaDiff.vue'
import { useFileSetsStore } from '../store/fileSets'

const fileSetsStore = useFileSetsStore()
const { fileSets, currentIndex } = storeToRefs(fileSetsStore)
const { addDiffFileset, removeFileset, switchTo } = fileSetsStore

let unlisten = null

onMounted(async () => {
  unlisten = await listen('fileSet', (event) => {
    addDiffFileset(event.payload)
  })
  // リスナー登録完了後にRust側へ通知
  await emit('frontend-ready')
})

onUnmounted(async () => {
  if (unlisten) unlisten()

  const allPaths = fileSets.value.flatMap(fs => [fs.file1.data, fs.file2.data])
  if (allPaths.length > 0) {
    await invoke('remove_temp_files', { paths: allPaths })
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body { font-family: 'Source Sans Pro', sans-serif; }

main {
  display: flex;
  justify-content: space-between;
}

main > div { flex-basis: 50%; }

#wrapper {
  height: 99vh;
  width: 99vw;
}

#tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  padding-bottom: 0;
  background: #1a1a2e;
}

#tabs .tab {
  padding: 4px 12px;
  border: none;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  background: #2e3a6e;
  color: #fff;
}

#tabs .tab.active {
  background: #4a90d9;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 0.75em;
  padding: 0 2px;
  opacity: 0.7;
  line-height: 1;
}

.close-btn:hover {
  opacity: 1;
}
</style>
