<template>
   <div>
       <!-- snackbar pop-up for update -->
      <v-snackbar v-model="snackbar1" :timeout="3000" top>
         {{ text1 }}
         <template v-slot:action="{ attrs }">
         <v-btn text color="pink" @click="snackbar1=false" v-bind="{attrs}">Close</v-btn>
         </template>
      </v-snackbar>
      <v-card text class="ma-3 card">
         <v-img class="grey-lighten-2 imgContainer">
            <img
            class="images"
            :src="blog.coverUrl"
            :alt="blog.cover"
            contain
            />
            <img />
         </v-img>

         <v-card-subtitle>
            <h4>{{ blog.description }}</h4>
         </v-card-subtitle>

         <v-card-actions>
            <BlogsShowModal :showBlog="blog"/>
            <v-spacer></v-spacer>

            <BlogsEditModal :editBlog="blog" @blogUpdated="snackbar1=true"/>
            <v-btn depressed icon @click="handleDelete">
               <v-icon>delete</v-icon>
            </v-btn>
         </v-card-actions>
      </v-card>
   </div>
</template>

<script>
import {projectFirestore} from '../firebase/config'
import BlogsShowModal from '../components/BlogsShowModal'
import BlogsEditModal from '../components/BlogsEditModal'

export default {
   props: ['blog'],
   components: {
      BlogsShowModal,
      BlogsEditModal
   },
   data(){
      return{
         search: '',
         snackbar1: false,
         text1: 'Post has been updated'
      }
   },
   methods: {
      handleDelete(){
         console.log('Something')
      }
   }
}
</script>

<style>
   .card{
      transition: 0.5s ease;
   }
   .cards{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
   }
  .images{
     /* height:130px; */
     width: 100%;
     height: 135px;
     object-fit: cover;
  }

  @media (max-width: 950px){
     .cards{
        grid-template-columns: repeat(3, 1fr);
     }
  }
  @media (max-width: 700px){
     .cards{
        grid-template-columns: repeat(2, 1fr);
     }
  }
  @media (max-width: 500px){
     .cards{
        grid-template-columns: 1fr;
     }
     .images{
        height:auto;
     }
  }
</style>