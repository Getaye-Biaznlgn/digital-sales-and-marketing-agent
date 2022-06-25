import { createStore } from 'vuex'
import auth from './auth/index';
import ApiClient from '../resources/baseUrl'

export default createStore({
  state: {
    isLoading:false,
  },
  getters: {
    isLoading(state){
      return state.isLoading
    }
  },
  mutations: {
    setIsLoading(state, payload){
      state.isLoading=payload
    }
  },
  actions: {
    async getAllRoles({commit}){

      try {
            const res=await ApiClient.get('api/roles');

            if (res.status === 200) {
               commit('setRole',res.data);
               console.log('allroles=='+res.data)
            }

      } catch (error) {
         console.log('jj')
      }finally{
         console.log('jj')

      }
    }
  },
  modules: {
    auth
  }
})
