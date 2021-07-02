<template>
  <v-container class="d-flex justify-center">
      <v-card class="signup">
         <v-card-title class="justify-center capitalize" >
            <span>Sign in to DevsForum</span>
         </v-card-title>
         <v-card-actions class="justify-center">
            <v-btn class="primary googleBtn d-flex justify-center" depressed @click="socialLogin()">
               <i class="fab fa-google mr-2" id="google-icon"></i>
               <span class="btn-text">Sign in with Google</span>
            </v-btn>
         </v-card-actions>
         <v-card-text>
            <v-form ref="form">
               <v-text-field
                  v-model="email"
                  type="email"
                  label="E-mail"
                  :rules="emailRule"
                  v-on:keyup.enter="submit"
                  required
               ></v-text-field>
               <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  v-on:keyup.enter="submit"
                  :rules="passwordRule"
                  required
               ></v-text-field>
                 <div class="red--text mb-3" v-if="error">
                  {{ error }}
                  </div>
                  <v-btn v-if="!isPending"
                     class="mr-4"
                     color="primary"
                     @click="submit"
                     >
                     <v-icon class="mr-2">login</v-icon>
                     Sign in
                  </v-btn>
                  <v-btn v-if="isPending"
                     class="mr-4"
                     color="primary"
                     disabled
                     >
                     Loading...
                  </v-btn>
                  <v-spacer class="mb-5"></v-spacer>
                   Don't have an account yet?
                  <router-link :to="{ name: 'Signup'}">
                     <span right>Sign up</span>
                  </router-link>
                  <span class="ml-1">Instead</span>
            </v-form>
         </v-card-text>
      </v-card>
   </v-container>
</template>

<script>
import {projectAuth} from '../firebase/config'
import firebase from 'firebase/app'

export default {
   data(){
      return{
         user: projectAuth.currentUser,
         email: '',
         password: '',
         error: null,
         isPending: false,
         emailRule: [(v) => !!v || "E-mail is required", 
         v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
         ],
         passwordRule: [(v) => !!v || "Password is required"],
      }
   },
   methods: {
      submit(){
         if(this.$refs.form.validate()){
            const login = async () => {
               this.isPending = true
               this.error = null
               try{
                  const res = await projectAuth.signInWithEmailAndPassword(this.email, this.password)

                  this.error = null
                  this.isPending = false
                  console.log('User logged in')
                  
                  return res
               }catch(err){
                  console.log(err)
                  this.error = 'Invalid User Credentials'
                  this.isPending = false
               }
            }
            
            login()
         }
      },
      updateRoute(){
         if(this.user){
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
      projectAuth.onAuthStateChanged(_user => {
         this.user = _user
      })
   },
   watch: {
      user: 'updateRoute'
   }
}
</script>

<style scoped>
.signup{
   width: 25rem;
   margin-top: 5rem;
}
.googleBtn{
   border-radius: 3px;
   width: 97%;
   padding: 1.5rem !important;
}
.btn-text{
   font-weight: normal;
   text-transform: none;
}

</style>