<!-- SPDX-License-Identifier: GPL-3.0-only -->
<!-- Copyright (C) 2024 KURASAWA Nozomu (nabetaro) <nabetaro@caldron.jp> -->

<template>
  <div id="wrapper">
    <div id="tabs" v-if="fileSets.length > 1">
      <button
        v-for="(fs, i) in fileSets"
        :key="i"
        :class="{ active: i === currentIndex }"
        @click="switchTo(i)"
      >
        {{ fs.title ?? `比較 ${i + 1}` }}
      </button>
    </div>
    <alpha-diff></alpha-diff>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { listen, emit } from '@tauri-apps/api/event'
import { storeToRefs } from 'pinia'
import AlphaDiff from './Diff/AlphaDiff.vue'
import { useFileSetsStore } from '../store/fileSets'

const fileSetsStore = useFileSetsStore()
const { fileSets, currentIndex } = storeToRefs(fileSetsStore)
const { addDiffFileset, switchTo } = fileSetsStore

let unlisten = null

onMounted(async () => {
  unlisten = await listen('fileSet', (event) => {
    addDiffFileset(event.payload)
  })
  // リスナー登録完了後にRust側へ通知
  await emit('frontend-ready')
})

onUnmounted(() => {
  if (unlisten) unlisten()
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

#wrapper {
  height: 99vh;
  width: 99vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div { flex-basis: 50%; }

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: .8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}

#tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: #1a1a2e;
}

#tabs button {
  padding: 4px 12px;
  border: none;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  background: #2e3a6e;
  color: #fff;
}

#tabs button.active {
  background: #4a90d9;
}
</style>
