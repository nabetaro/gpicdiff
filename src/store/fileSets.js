// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2024 KURASAWA Nozomu (nabetaro) <nabetaro@caldron.jp>

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { invoke } from '@tauri-apps/api/core'
import { exit } from '@tauri-apps/plugin-process'

export const useFileSetsStore = defineStore('fileSets', () => {
  const fileSets = ref([])
  const currentIndex = ref(0)

  const currentFileSet = computed(() => fileSets.value[currentIndex.value] ?? null)
  const title = computed(() => currentFileSet.value?.title ?? '')

  function addDiffFileset(payload) {
    fileSets.value.push(payload)
    currentIndex.value = fileSets.value.length - 1
  }

  async function removeFileset(index) {
    const target = fileSets.value[index]
    if (!target) return

    // remove tmp files
    await invoke('remove_temp_files', {
      paths: [target.file1.data, target.file2.data]
    })

    fileSets.value.splice(index, 1)

    // exit when empty
    if (fileSets.value.length === 0) {
      await exit(0)
      return
    }

    // rebuild currentIndex
    if (currentIndex.value >= fileSets.value.length) {
      currentIndex.value = fileSets.value.length - 1
    } else if (currentIndex.value > index) {
      currentIndex.value -= 1
    }
  }

  function switchTo(index) {
    if (index >= 0 && index < fileSets.value.length) {
      currentIndex.value = index
    }
  }

  return { fileSets, currentIndex, currentFileSet, title, addDiffFileset, removeFileset, switchTo }
})
