import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Signin from '../views/Signin.vue'
import Profile from '../views/Profile.vue'
import Tags from '../views/Tags.vue'
import MyBlogs from '../views/MyBlogs.vue'
import Events from '../views/Events.vue'
import Chatroom from '../views/Chatroom.vue'
import Developers from '../views/Developers.vue'
import {projectAuth} from '../firebase/config'

Vue.use(VueRouter)

const requireAuth = (to, from, next) => {
   let user = projectAuth.currentUser
   if(!user){
      next({ name: 'Signin'})
   }else{
      next()
   }
}
const requireNoAuth = (to, from, next) => {
   let user = projectAuth.currentUser
   if(user){
      next({ name: 'Home'})
   }else{
      next()
   }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: requireAuth
  },
  {
    path: '/Signup',
    name: 'Signup',
    component: Signup,
    beforeEnter: requireNoAuth
  },
  {
    path: '/Signin',
    name: 'Signin',
    component: Signin,
    beforeEnter: requireNoAuth
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: requireAuth
  },
  {
    path: '/tags/:tag',
    name: 'Tags',
    component: Tags,
    beforeEnter: requireAuth
  },
  {
    path: '/lists/user',
    name: 'UserList',
    component: MyBlogs,
    beforeEnter: requireAuth
  },
  {
    path: '/events',
    name: 'Events',
    component: Events,
    beforeEnter: requireAuth
  },
  {
    path: '/chatroom',
    name: 'Chatroom',
    component: Chatroom,
    beforeEnter: requireAuth
  },
  {
    path: '/developers',
    name: 'Developers',
    component: Developers,
    beforeEnter: requireAuth
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
