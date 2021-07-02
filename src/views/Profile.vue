<template>
<v-container class="contain">
  <!-- snackbar pop-up for image update -->
  <v-snackbar v-model="snackbar1" :timeout="3000" top>
      {{ text1 }}
      <template v-slot:action="{ attrs }">
      <v-btn text color="pink" @click="snackbar1=false" v-bind="{attrs}">Close</v-btn>
      </template>
  </v-snackbar>
  <!-- snackbar pop-up for profile update -->
  <v-snackbar v-model="snackbar2" :timeout="3000" top>
      {{ text2 }}
      <template v-slot:action="{ attrs }">
      <v-btn text color="pink" @click="snackbar2=false" v-bind="{attrs}">Close</v-btn>
      </template>
  </v-snackbar>
  <h1 class="heading grey--text">My Profile</h1>
  <v-row class="profile-container">
      <!-- //First grid -->      
      <v-col class="mt-5">
         <v-card height="450px">
            <div class="img-container">
               <v-responsive class="img-inner">
               <v-avatar size="170" class="mt-5 ml-3" v-if="coverUrl">
                  <v-img
                  :src="coverUrl"
                  ></v-img>
               </v-avatar>
               <v-avatar size="170" class="mt-5 ml-3" v-else>
                  <v-img
                  src="@/assets/dummy.png"
               ></v-img>
               </v-avatar>
               <UploadImageModal @imageUpdated="snackbar1 = true"/>
               </v-responsive>
            </div>
            <v-card-title v-if="currentUser.username" class="flex justify-center">
               {{ currentUser.username }}
            </v-card-title>
            <v-card-title v-else class="flex justify-center">
               {{ user.displayName }}
            </v-card-title>
            <v-card-actions>
            <!-- Edit button goes here -->
            <ProfileEditModal :currentUser="currentUser" @profileUpdated="snackbar2=true"/>
            </v-card-actions>
            <v-card-text>
               <div v-if="currentUser.username" class="subheading">
               <span class="mr-1">Username:</span>{{ currentUser.username }}
               </div>
               <div v-else class="subheading">
               <span class="mr-1">Username:</span>
               {{ user.displayName }}
               </div>
               <div class="subheading">
               <span class="mr-1">Bio:</span>
               {{ currentUser.bio }}
               </div>
            </v-card-text>
         </v-card>
      </v-col>
      <!-- Second grid -->
      <v-col> 
          <h2 class="heading grey--text mt-2 mb-2">Recent Works</h2>
          <small v-if="!blogs.length" class="grey--text">No Works to show here yet</small>
          <v-row class="cards-container" v-if="blogs.length">
            <v-col
                  v-for="blog in filteredBlogs" :key="blog.id"
               >
               <v-card>
                  <v-img 
                  max-height="120px"
                  :src="blog.coverUrl"
                  contain
                  >
                  </v-img>
                  <v-card-text>
                     <h3>{{blog.description}}</h3>
                     <small>{{ blog.createdAt }}</small>
                  </v-card-text>
               </v-card>
            </v-col>
          </v-row>
      </v-col>
  </v-row>
 </v-container>
</template>

<script>
import UploadImageModal from "../components/UploadImageModal.vue";
import ProfileEditModal from "../components/ProfileEditModal.vue";
import { projectFirestore, projectAuth } from "../firebase/config";
import moment from 'moment';

export default {
 components: {
  UploadImageModal,
  ProfileEditModal,
 },
 data() {
  return {
      user: projectAuth.currentUser,
      currentUser :{
         username: "",
         bio: "",
      },
      blogs: [],
      coverUrl: null,
      snackbar1: false,
      snackbar2: false,
      text1: 'Image has been updated',
      text2: 'Profile has been updated'
  };
 },
 computed: {
    filteredBlogs(){
       let newBlogs =  this.blogs.slice(0,4)
       return newBlogs.map(document => {
          let time = moment(document.createdAt.toDate()).format('MMMM Do YYYY, h:mm:ss a')
          return { ...document, createdAt: time }
       })
    },
 },
 mounted() {
   projectAuth.onAuthStateChanged((_user) => {
      this.user = _user;
   });
   projectFirestore
      .collection("users")
      .doc(this.user.uid)
      .onSnapshot((doc) => {
      (this.currentUser.username = doc.data().username),
      (this.currentUser.bio = doc.data().bio),
      (this.coverUrl = doc.data().coverUrl);
   });
   projectFirestore.collection('blogs').onSnapshot(snap =>{
      let results = []
      snap.docs.forEach(doc => {
         if(doc.data().userId == this.user.uid){
            doc.data().createdAt && results.push({...doc.data(), id: doc.id })
         }
         this.blogs = results
      })
   })
 },
};
</script>

<style>
.contain {
 margin-top: 1rem;
}
.profile-container{
   display:grid;
   grid-template-columns: 50% 50%;
}
.cards-container{
   display:grid;
   grid-template-columns: 50% 50%;
}
.subheading {
 font-size: 1rem;
 margin-top: 1rem;
}
.img-container {
 display: grid;
 place-items: center;
}
.add-btn {
 position: absolute;
 top: 9rem;
 right: 1.2rem;
}
span {
 font-weight: bold;
}
@media(max-width: 879px){
.profile-container{
   grid-template-columns: 100%;
}
}
</style>
