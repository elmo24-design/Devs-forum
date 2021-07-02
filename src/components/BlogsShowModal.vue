<template>
  <v-dialog max-width="800px" v-model="dialog">
    <template v-slot:activator="{ on }">
      <v-btn color="pink lighten-1" v-on="on" text>
         View
      </v-btn>
    </template>

    <!-- Form goes here | The content of the pop up -->
    <v-card>
       <v-img :src="showBlog.coverUrl"></v-img>
       <div class="d-flex align-center">
            <v-card-title class="ml-2 title">
               {{ showBlog.description }}
            </v-card-title>
       </div>
       <div class="d-flex align-center">
           <v-card-text color="grey" class="ml-2">
               Posted on {{ formattedDate }}
           </v-card-text>
           <v-btn @click="dialog=false" class="mr-2">
              Close
           </v-btn>
       </div>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'

export default {
  props: ['showBlog'],
  data() {
    return {
       dialog: false,
    }
  },
  methods: {
    
  },
  computed: {
      formattedDate(){
         return moment(this.showBlog.createdAt.toDate()).format('MMMM Do YYYY, h:mm:ss a')
      }
  }
};
</script>

<style>
   a{
      text-decoration: none;
   }
   .title{
      color: #EC407A;
   }
   .message{
      font-size: 15px;
      margin-top:17px;
   } 
</style>