import Vue from 'vue'
import Vuex from 'vuex'
import {projectAuth} from '@/firebase/config'
import {projectFirestore} from '@/firebase/config'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
     users: [],
   //   tags: [],
     currentUser: projectAuth.currentUser,
     signupError: null,
     signinError: null,
  },
  getters: {
    signupError(state){
       return state.signupError
    },
    signinError(state){
        return state.signinError
    },
    currentUser(state){
       return state.currentUser
    },
   //  tags(state){
   //     return state.tags
   //  }
  },
  mutations: {
      signUser: (state, error) => {
         if(error){
            state.signupError = error
         }
      },
      signinUser: (state, error) => {
         if(error){
            state.signinError = error
         }
      },
      getCurrentUser: (state, user) => {
         state.currentUser = user
      },
      // getTagSet: (state, tagValues) => {
      //    state.tags = tagValues
      // }
  },
  actions: {
      async signup({commit}, user){
         user.error = null
         try{
            if(user.password !== user.cPassword){
               throw new Error('Password does not match')
            }
            await projectAuth.createUserWithEmailAndPassword(user.email, user.password).then(cred => {
               projectFirestore.collection('users').doc(cred.user.uid).set({
                  username: user.username,
                  bio: user.bio,
                  coverUrl: ''
               })
            })
            user.error= null
         }catch(err){
            console.log(err.message)
            user.error = err.message
         }
         commit('signUser', user.error) 
      },
      async signin({commit}, user){
         user.error = null
         try{
            const res = await projectAuth.signInWithEmailAndPassword(user.email, user.password)
            user.error = null
         }
         catch(err){
            user.error= 'Invalid User Credentials'
         }
         commit('signinUser', user.error) 
      },
      async currentUser({commit}){
         projectAuth.onAuthStateChanged(_user => {
            commit('getCurrentUser', _user)
         })
      },
      // async getTags({commit}, blogs, tagValues){
      //    let tagSet = new Set()
      //    await blogs.forEach(blog=> {
      //       blog.tags.forEach(tag => {
      //          tagSet.add(tag)
      //       })
      //    })

      //    tagValues = [...tagSet]
      //    commit('getTagSet', tagValues)
      // }
  },
  modules: {
  }
})
