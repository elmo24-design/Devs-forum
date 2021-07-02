import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueTextAreaAutosize from 'vue-textarea-autosize';
import { projectAuth } from './firebase/config'

Vue.use(VueTextAreaAutosize);
Vue.config.productionTip = false

let app 

projectAuth.onAuthStateChanged(() => {
   if(!app){
      app = 
      new Vue({
         router,
         store,
         vuetify,
         render: h => h(App)
       }).$mount('#app')
   }
})

