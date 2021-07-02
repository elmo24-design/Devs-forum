<template>
  <nav>
    <!-- Top navigation bar -->
    <v-app-bar app class="indigo white--text">
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="user" class="white--text"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>

      <!-- Darkmode -->
      <!-- <v-switch v-model="$vuetify.theme.dark" inset class="mt-5"></v-switch> -->

      <div v-if="user">
         <v-btn depressed @click="signOut" class="transparent white--text">
            <span class="pr-sm-1">Sign Out</span>
            <v-icon>exit_to_app</v-icon>
         </v-btn>
      </div>

      <div v-else>
         <router-link :to="{ name: 'Signin'}">
            <v-btn depressed class="transparent white--text">
               <span class="pr-sm-1">Sign In</span>
            </v-btn>
         </router-link>
         <router-link :to="{ name: 'Signup'}">
            <v-btn depressed class="transparent white--text">
               <span class="pr-sm-1">Sign Up</span>
            </v-btn>
         </router-link>
      </div>

    </v-app-bar>

    <!-- snackbar pop-up for add -->
    <v-snackbar v-model="snackbar1" :timeout="3000" top>
       {{ text1 }}
       <template v-slot:action="{ attrs }">
       <v-btn text color="pink" @click="snackbar1=false" v-bind="{attrs}">Close</v-btn>
       </template>
    </v-snackbar>

    <!-- Sliding navbar container-->
    <v-navigation-drawer v-model="drawer" app class="white" v-if="user">
      <v-row no-gutters class="mt-5">
        <v-col cols="12" align="center">
            <v-toolbar-title class="text-uppercase nav-title">
               <span class="font-weight-bold">Devs</span>
               <span class="font-weight-light">Forum</span>
               <div>
                  <p class="join">The Dev Community</p>
               </div>
            </v-toolbar-title>
        </v-col>
        <v-col align="center">
           <!-- button trigger for popup here -->
           <BlogsAddModal @blogUploaded="snackbar1 = true"/>
        </v-col>
      </v-row>

      <v-list class="mt-5" rounded>
        <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-item-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
                {{ link.text}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      
    </v-navigation-drawer>
  </nav>
</template>

<script>
import BlogsAddModal from './BlogsAddModal.vue'
import {projectAuth, projectFirestore} from '../firebase/config'

export default {
  components: {
     BlogsAddModal
  },
  data() {
    return {
      bio:null,
      username: null,
      coverUrl: null,
      email: null,
      drawer: true,
      user: projectAuth.currentUser,
      links: [
        { icon: "home", text: "Home", route: "/" },
        { icon: "person", text: "Profile", route: "/profile" },
        { icon: "calendar_today", text: "Events", route: "/events" },
        { icon: "create", text: "My Blogs", route: "/lists/user" },
        { icon: "people", text: "Developers", route: "/developers" },
        { icon: "chat", text: "Chatroom", route: "/chatroom" },
      ],
      snackbar1: false,
      text1: 'New post uploaded',
    };
  },
  methods:{
     signOut(){
        projectAuth.signOut()
     },
     updateRoute(){
        if(!this.user){
           this.$router.push({ name: 'Signin'})
        }
     }
  },
  mounted(){
      projectAuth.onAuthStateChanged(_user => {
         this.user = _user
      })
      projectFirestore.collection('users').doc(this.user.uid).onSnapshot(doc => {
         if(doc.data()){
            this.bio = doc.data().bio,
            this.username = doc.data().username,
            this.coverUrl = doc.data().coverUrl
         }
      })
  },
  created(){
   
  },
  watch:{
     user: 'updateRoute'
  }
};
</script>

<style scoped>
   .join{
      font-size:0.8rem;
      margin-left:-27px;
      margin-top: -5px;
      color: grey;
   }
   .nav-title{
      font-size: 1.7rem;
      margin-bottom:1.5rem;
      margin-top:1rem;
   }
   a{
      text-decoration: none;
   }
   .router-link-active .v-btn{
      background-color: #283891 !important;
   }
   .textsidenav{
      font-size: 1.1rem;
   }
</style>