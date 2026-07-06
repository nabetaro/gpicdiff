// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2024 KURASAWA Nozomu (nabetaro) <nabetaro@caldron.jp>

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFileSetsStore = defineStore('fileSets', () => {
  const fileSets = ref([])
  const currentIndex = ref(0)

  const currentFileSet = computed(() => fileSets.value[currentIndex.value] ?? null)
  const title = computed(() => currentFileSet.value?.title ?? '')

  function addDiffFileset(payload) {
    fileSets.value.push(payload)
    currentIndex.value = fileSets.value.length - 1
  }

  function switchTo(index) {
    if (index >= 0 && index < fileSets.value.length) {
      currentIndex.value = index
    }
  }

  return { fileSets, currentIndex, currentFileSet, title, addDiffFileset, switchTo }
})
