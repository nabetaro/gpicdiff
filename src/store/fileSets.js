// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2024 KURASAWA Nozomu (nabetaro) <nabetaro@caldron.jp>

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFileSetsStore = defineStore('fileSets', () => {
  const fileSets = ref([])
  const mode = ref('alpha')
  const title = ref(null)

  function addDiffFileset(payload) {
    fileSets.value.push(payload)
  }

  return { fileSets, mode, title, addDiffFileset }
})
