<template>
  <v-container class="d-flex justify-center">
      <v-card class="signup mt-5">
         <v-card-title class="justify-center capitalize" >
            <span>Sign up to DevsForum</span>
         </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn class="primary googleBtn d-flex justify-center" depressed @click="socialLogin()">
               <i class="fab fa-google mr-2" id="google-icon"></i>
               <span class="btn-text">Sign up with Google</span>
            </v-btn>
         </v-card-actions>
         <v-card-text>
            <v-form ref="form">
                <v-text-field
                  v-model="user.username"
                  type="text"
                  label="Username"
                  :rules="textRule"
                   v-on:keyup.enter="submit"
                  required
               ></v-text-field>
               <v-text-field
                  v-model="user.email"
                  type="email"
                  label="E-mail"
                  :rules="emailRule"
                   v-on:keyup.enter="submit"
                  required
               ></v-text-field>
                <v-text-field
                  v-model="user.bio"
                  type="text"
                  label="Add a short bio that describes you"
                  :rules="textRule"
                   v-on:keyup.enter="submit"
                  required
               ></v-text-field>
               <v-text-field
                  v-model="user.password"
                  label="Password"
                  type="password"
                  :rules="passwordRule"
                   v-on:keyup.enter="submit"
                  required
               ></v-text-field>
                <v-text-field
                  v-model="user.cPassword"
                  label="Confirm Password"
                  type="password"
                  :rules="passwordRule"
                   v-on:keyup.enter="submit"
                  required
               ></v-text-field>
                 <div class="red--text mb-3" v-if="signupError">
                  {{ signupError }}
                  </div>
                  <v-btn v-if="!isPending"
                  class="mr-4"
                  color="primary"
                  @click="submit"
                  >
                  <v-icon class="mr-2">login</v-icon>
                  Sign up
                  </v-btn>
                  <v-btn v-if="isPending"
                  class="mr-4"
                  color="primary"
                  disabled
                  >
                  Loading...
                  </v-btn>
                  <v-spacer class="mb-5"></v-spacer>
                  Already have an account?
                  <router-link :to="{ name: 'Signin'}">
                  <span right>Sign in</span>
                  </router-link>
                  <span class="ml-1">Instead</span>
            </v-form>
         </v-card-text>
      </v-card>
   </v-container>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {projectAuth, projectFirestore} from '../firebase/config'
import firebase from 'firebase/app'

export default {
   data(){
      return{
         user: {
            username: '',
            bio: '',
            email: '',
            password: '',
            cPassword: '',
            coverUrl: '',
            error: null
         },
         isPending: false,
         textRule: [(v) => !!v || "This field is required"], 
         emailRule: [(v) => !!v || "E-mail is required", 
         v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
         ],
         passwordRule: [(v) => !!v || "Password is required"],
      }
   },
   computed: {
      ...mapGetters(['currentUser', 'signupError']),
   },
   methods: {
      ...mapActions(['signup']),
      submit(){
         if(this.$refs.form.validate()){
            this.isPending = true
            if(this.signup(this.user)){
               this.isPending = true
            }
            setTimeout(() => {
               this.isPending = false
            }, 3000)
         }
      },
      updateRoute(){
          if(this.currentUser){
            this.$router.push({ name: 'Home' })
         }
      },
      socialLogin(){
         const provider = new firebase.auth.GoogleAuthProvider()

         projectAuth.signInWithPopup(provider).then(cred => {
            projectFirestore.collection('users').doc(cred.user.uid).set({
               username: projectAuth.currentUser.displayName,
               bio: this.user.bio,
               coverUrl: ''
            })
            this.$router.push({ name: 'Home'})
         }).catch((err) => {
            console.log(err.message)
         })
      }
   },
   mounted(){
      this.$store.dispatch('currentUser')
   },
   watch: {
      currentUser: 'updateRoute'
   }
}
</script>

<style scoped>
.signup{
   width: 500px;
}
.googleBtn{
   border-radius: 3px;
   width: 97%;
   padding: 1.5rem !important;
   background-color:#3278FF;
}
.btn-text{
   font-weight: normal;
   text-transform: none;
}
</style>