<template>
  <v-container>
     <div class="ml-3">
        <h1 class="grey--text">My Blogs</h1>
     </div>
     <div class="mt-5 ml-3">
       
     </div>
     <div class="mt-3">
        <v-text-field
         class="mx-3 mb-3"
         v-model="search"
         append-icon="mdi-magnify"
         label="Search"
         single-line
         hide-details
       ></v-text-field>
        <small v-if="!blogs.length" class="grey--text ml-3">No Works to show here yet</small>
        <div class="cards" v-if="blogs.length">
            <div v-for="blog in filteredBlogProjects" :key="blog.id">
               <MyBlogsList :blog="blog"/> 
            </div>
        </div>
        <div v-else>
           <Spinner />
        </div>
     </div>
  </v-container>
</template>

<script>
import {projectAuth, projectFirestore} from '../firebase/config'
import MyBlogsList from '../components/MyBlogsList'
import Spinner from '../components/Spinner.vue'

export default {
   components: {
      MyBlogsList,
      Spinner
   },
   data(){
      return{
         user: projectAuth.currentUser,
         blogs: [],
         search: '',
      }
   },
   mounted(){
      projectAuth.onAuthStateChanged(_user => {
         this.user = _user
      })
      projectFirestore.collection('blogs').orderBy('createdAt','desc').onSnapshot(snap => {
         let results = []
         snap.docs.forEach(doc => {
            if(doc.data().userId === this.user.uid){
               doc.data().createdAt && results.push({ ...doc.data(), id:doc.id })
            }
         })
         this.blogs = results
      })
   },
   computed: {
      filteredBlogProjects(){
         return this.blogs.filter(blog => {
            return blog.description.toLowerCase().match(this.search.toLowerCase())
         })
      }
   }
}
</script>

<style>

</style>