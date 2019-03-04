import Vue from 'vue'
import Diff from '@/components/Diff'

describe('Diff.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(Diff)
    }).$mount()

  })
})
