<template>
  <div class="home">
     <v-container>
         <!-- snackbar pop-up for delete -->
         <v-snackbar v-model="snackbar1" :timeout="3000" top>
            {{ text1 }}
            <template v-slot:action="{ attrs }">
            <v-btn text color="pink" @click="snackbar1=false" v-bind="{attrs}">Close</v-btn>
            </template>
         </v-snackbar>
         <div v-if="user">
            <v-row class="card-container">
               <v-col v-if="blogs.length">
                   <div v-for="blog in blogs" :key="blog.id">
                     <BlogsList :blog="blog" @blogDeleted="snackbar1 = true"/>
                   </div>
               </v-col>
               <v-col v-else>
                  <Spinner />
               </v-col>
               <v-col class="mt-5 tag-cloud">
                  <h3>Topics</h3>
                  <div v-for="tag in filteredTags" :key="tag">
                     <router-link :to="{ name: 'Tags', params: { tag: tag } }" >
                        #{{ tag }}
                     </router-link>
                  </div>
               </v-col>
            </v-row>
         </div>
     </v-container>
  </div>
</template>

<script>
import BlogsList from '../components/BlogsList'
import TagCloud from '../components/TagCloud.vue'
import Spinner from '../components/Spinner.vue'
import {projectFirestore, projectAuth} from '../firebase/config'

export default {
  components: {
      BlogsList,
      TagCloud,
      Spinner
  },
  data(){
     return{
        blogs: [],
        user: projectAuth.currentUser,
        coverUrl: null,
        snackbar1: false,
        text1: 'Post has been deleted',
     }
  },
  computed: {
     filteredTags(){
        let tagSet = new Set
        this.blogs.forEach(blog => {
           blog.tags.forEach(tag => {
              tagSet.add(tag)
           })
        })
        return [...tagSet]
     }
  },
  mounted(){
     projectFirestore.collection('blogs').orderBy('createdAt','desc').onSnapshot(snap => {
         let results = []
         snap.docs.forEach(doc => {
            doc.data().createdAt && results.push({ ...doc.data(), id:doc.id })
         })
         this.blogs = results
     })
     projectAuth.onAuthStateChanged(_user => {
        this.user = _user
     })
  },
}
</script>

<style>
   .card-container{
      display:grid;
      grid-template-columns: 70% 30%;
   }
   .tag-cloud {
      padding: 10px;
   }
   .tag-cloud div {
      display: inline-block;
      padding: 7px;
   }
   .tag-cloud a {
      background-color: rgb(223, 223, 223);
      text-decoration: none;
      padding: 0.3rem 0.5rem;
      border-radius: 20px;
      font-size: 0.9rem;
   }
   .tag-cloud a.router-link-active {
      background-color: rgb(134, 134, 134);
      color: #ffffff;
      font-weight: bold;
   }
   
   @media (max-width: 500px){
      .card-container{
         grid-template-columns: 100% 0% !important;
      }
      .tag-cloud {
         display: none;
      }
   }
</style>