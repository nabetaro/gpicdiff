// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2024 KURASAWA Nozomu (nabetaro) <nabetaro@caldron.jp>

import { createRouter, createWebHashHistory } from 'vue-router'
import Diff from '../components/Diff.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'diff',
      component: Diff
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})
