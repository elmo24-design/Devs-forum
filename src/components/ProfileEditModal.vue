<template>
  <v-dialog max-width="600px" v-model="dialog">
    <template v-slot:activator="{ on }">
      <v-btn class="flex justify-center" v-on="on">
         <v-icon left>create</v-icon>
         <span>Edit Profile</span>
      </v-btn>
    </template>

    <!-- Form goes here | The content of the pop up -->
    <v-card>
      <v-card-title>
        <h3>Edit profile</h3>
      </v-card-title>

      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field
            v-if="currentUser.username"
            v-model="currentUser.username"
            type="text"
            label="Username"
            :rules="textRule"
            required
          ></v-text-field>
           <v-text-field
            v-if="!currentUser.username"
            v-model="displayName"
            type="text"
            label="Username"
            :rules="textRule"
            required
          ></v-text-field>
           <v-text-field
            v-model="currentUser.bio"
            type="text"
            label="Bio"
            :rules="textRule"
            required
          ></v-text-field>
         <div v-if="!isPending">
             <v-btn
               class="success mx-0 mt-3"
               @click="submit"
               >Upate</v-btn
             >
              <v-btn
               text
               class="mx-0 mt-3 ml-2"
               @click="closeModal"
               >Cancel</v-btn
             >
          </div>
          <div v-if="isPending">
             <v-btn
               class="mx-0 mt-3"
               disabled
             >Saving...</v-btn
          >
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import{projectFirestore, projectAuth} from '../firebase/config'
import 'firebase/auth'

export default {
  props: ["currentUser"],
  data() {
    return {
      user: projectAuth.currentUser,
      email: projectAuth.currentUser.email,
      displayName: projectAuth.currentUser.displayName,
      textRule: [(v) => !!v || "This field is required"],
      blogs: [],
      messages: [],
      comments: [],
      loading: false,
      dialog: false,
      error: null,
      isPending: false,
    };
  },
  methods: {
    submit() {
       if(this.$refs.form.validate()){
         const uploadDocuments = async() => {
            this.isPending = true
            try{
               projectFirestore.collection('users').doc(this.user.uid).update({
                  username: this.currentUser.username,
                  bio: this.currentUser.bio
               })
               .then(() => {
                  this.blogs.forEach(blog => {
                     if(blog.userId === this.user.uid){
                        projectFirestore.collection('blogs').doc(blog.id).update({
                           username: this.currentUser.username
                        })
                     }
                  })
               })
               .then(() => {
                  this.messages.forEach(message => {
                     if(message.userId === this.user.uid){
                        projectFirestore.collection('messages').doc(message.id).update({
                           name: this.currentUser.username
                        })
                     }
                  })
               })
               .then(() => {
                  this.comments.forEach(comment => {
                     if(comment.userId === this.user.uid){
                        projectFirestore.collection('comments').doc(comment.id).update({
                           name: this.currentUser.username
                        })
                     }
                  })
               })
               .then(() => {
                   this.isPending = false
                   this.dialog =false
                   this.$emit('profileUpdated')
               })
               .catch((err) => {
                  console.log(err.message)
               })   
            }catch(err){
               console.log(err.message)
               this.error= err.message
            }
         }
         uploadDocuments()
      }
    },
    closeModal(){
       this.dialog = false
    },
  },
  mounted(){
     projectAuth.onAuthStateChanged(_user => {
        this.user = _user
     })
     projectFirestore.collection('blogs').orderBy('createdAt','desc').onSnapshot(res => {
         const changes = res.docChanges()
         changes.forEach(change => {
            if(change.type == "added"){
               this.blogs.push({ ...change.doc.data(), id: change.doc.id })  
            }
         })
     })
     projectFirestore.collection('messages').orderBy('createdAt').onSnapshot(res => {
         const changes = res.docChanges()
         changes.forEach(change => {
            if(change.type == "added"){
               this.messages.push({ ...change.doc.data(), id: change.doc.id })  
            }
         })
     })
     projectFirestore.collection('comments').orderBy('createdAt').onSnapshot(res => {
         const changes = res.docChanges()
         changes.forEach(change => {
            if(change.type == "added"){
               this.comments.push({ ...change.doc.data(), id: change.doc.id })  
            }
         })
     })
  }
};
</script>

<style scoped>
   
</style>