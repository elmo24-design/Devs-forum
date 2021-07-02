<template>
  <div class="home">
     <v-container>
         <div v-if="user">
            <v-row class="card-container">
               <v-col>
                   <div v-for="blog in filteredBlogs" :key="blog.id">
                     <BlogsList :blog="blog" @blogDeleted="handleDelete" />
                   </div>
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
import {projectFirestore, projectAuth} from '../firebase/config'

export default {
  components: {
      BlogsList,
      TagCloud,
  },
  data(){
     return{
        blogs: [],
        user: projectAuth.currentUser,
        coverUrl: null
     }
  },
  methods: {
     handleDelete(id){
        return this.blogs.filter(blog => {
           return blog.id !== id
        })
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
     },
     filteredBlogs(){
        return this.blogs.filter(blog => blog.tags.includes(this.$route.params.tag))
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
</style>