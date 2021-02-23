function initialState() {
    return {
        all: [],
        total: 0,
        relationships: {
            'role': 'title',
        },
        query: {},
        loading: false
    }
}

const getters = {
    data:          state => state.all,
    total:         state => state.total,
    loading:       state => state.loading,
    relationships: state => state.relationships
};

const actions = {
    fetchData({ commit, state }) {
        commit('setLoading', true);

        axios.get('/users?' + $.param(state.query))
            .then(response => {
                commit('setAll', response.data.data);
                commit('setTotal', response.data.total)
            })
            .catch(error => {
                let message = error.response.data.message || error.message;
                commit('setError', message)
            })
            .finally(() => {
                commit('setLoading', false)
            })
    },
    getById({ commit, state }, id) {
        commit('setLoading', true);
        axios.get('/users/' + id)
            .then(response => {
                commit('setAll', response.data.data)
            })
            .catch(error => {
                let message = error.response.data.message || error.message;
                commit('setError', message)
            })
            .finally(() => {
                commit('setLoading', false)
            })
    },
    destroyData({ commit, state }, id) {
        axios.delete('/users/' + id)
            .then(response => {
                commit('setAll', state.all.filter((item) => {
                    return item.id != id
                }))
            })
            .catch(error => {
                let message = error.response.data.message || error.message;
                commit('setError', message)
            })
    },
    setQuery({ commit, dispatch }, value) {
        commit('setQuery', purify(value));
        dispatch('fetchData');
    },
    resetState({ commit }) {
        commit('resetState')
    }
};

const mutations = {
    setAll(state, items) {
        state.all = items
    },
    setTotal(state, total) {
        state.total = total
    },
    setLoading(state, loading) {
        state.loading = loading
    },
    setQuery(state, query) {
        state.query = query
    },
    resetState(state) {
        state = Object.assign(state, initialState())
    }
};

export default {
    namespaced: true,
    state: initialState,
    getters,
    actions,
    mutations
}