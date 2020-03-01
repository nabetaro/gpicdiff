const state = {
  fileSets: []
}

const mutations = {
  claer () {
    state.fileSets.clear()
  },
  add_diff_fileset (state, payload) {
    state.fileSets.push(payload.fileset)
  }
}

const actions = {
  clear ({ commit }) {
    commit('clear')
  },
  add_diff_fileset ({ commit }, payload) {
    commit('add_diff_fileset', {fileset: payload.fileset})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
