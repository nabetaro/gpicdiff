// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2024 KURASAWA Nozomu (nabetaro) <nabetaro@caldron.jp>

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')
