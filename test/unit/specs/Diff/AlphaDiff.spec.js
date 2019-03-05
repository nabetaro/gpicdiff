import Vue from 'vue'
import AlphaDiff from '@/components/Diff/AlphaDiff'

function getInstance (Component, propsData) {
  const Ctor = Vue.extend(Component)
  const vm = new Ctor({ propsData }).$mount()
  return vm
}

describe('AlphaDiff.vue', () => {
  it('should render correct contents', () => {
    const instance = getInstance(AlphaDiff, {});

    expect(instance.$el.querySelector('#image-content').innerHtml).to.contain('<div id="file1"></div>')
//    expect(instance.$el.querySelector('#image-content').innerHtml).to.contain('<div id="file2"></div>')
//    expect(instance.$el.querySelector('.alpha-range').innerHtml).to.contain(' <input type="range"/>')
  })
})
