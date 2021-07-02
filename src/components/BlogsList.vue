<template>
  <v-container>
      <!-- snackbar pop-up for comment deleted -->
      <v-snackbar v-model="snackbar2" :timeout="3000" top>
         {{ text2 }}
         <template v-slot:action="{ attrs }">
         <v-btn text color="pink" @click="snackbar2=false" v-bind="{attrs}">Close</v-btn>
         </template>
      </v-snackbar>
      <!-- snackbar pop-up for update -->
      <v-snackbar v-model="snackbar1" :timeout="3000" top>
         {{ text1 }}
         <template v-slot:action="{ attrs }">
         <v-btn text color="pink" @click="snackbar1=false" v-bind="{attrs}">Close</v-btn>
         </template>
      </v-snackbar>
      <div class="d-flex mb-4 align-center">
         <v-avatar>
            <v-img
            v-if="blog.userCoverImg"
            :src="blog.userCoverImg"
            >
            </v-img>
            <v-img
            v-else
            src="@/assets/dummy.png"
            >
            </v-img>
         </v-avatar>
         <div class="desc ml-2">
            <p class="user-name">{{ blog.username }}</p>
            <p></p>
            <small class="grey--text posted-on">Posted on: {{ formattedDate }}</small>
         </div>
      </div>
    
      <p>{{ blog.description }}</p>
      <v-responsive>
         <v-img :src="blog.coverUrl"
          contain>
         </v-img>
      </v-responsive>
      <div>
         <div v-for="tag in blog.tags" :key="tag" class="pills mt-2">
            <v-chip class="mr-1"> #{{ tag }}</v-chip>
         </div>
      </div>
      <v-card-actions>
         <div class="buttons">
            <div class="social-btn-container">
               <div class="likes-container">
                  <div>
                     <v-btn class="social-icon" depressed @click="likePost" v-if="!liked">
                        <v-icon>thumb_up_off_alt</v-icon>
                        <small class="like">Like</small>
                        <div class="likes-numbers">
                           {{ blog.likes.length }}
                        </div>
                     </v-btn>
                     <v-btn class="social-icon liked" depressed @click="unlikePost" v-if="liked">
                        <v-icon>thumb_up</v-icon>
                        <small class="like">Like</small>
                        <div class="likes-numbers">
                           {{ blog.likes.length }}
                        </div>
                     </v-btn>
                  </div>
               </div>
               <div class="comments-container">
                  <v-btn class="social-icon" depressed @click="show=true">
                     <v-icon>forum</v-icon>
                     <small class="like">Comments</small>
                     <div class="likes-numbers">
                        {{ blog.comments.length }}
                     </div>
                  </v-btn>
                  <div v-if="show" @click="show=false">
                     <v-btn small depressed class="hide-btn">Hide Comments</v-btn>
                  </div>
               </div>
            </div>
            <div v-if="ownership" class="mt-3">
               <BlogsEditModal :editBlog="blog" @blogUpdated="snackbar1 = true"/>
               <v-icon class="btn-icon ml-4" @click="handleDelete">delete</v-icon>
            </div>
         </div>
      </v-card-actions>
      <div class="comment-form">
         <CommentForm :blog="blog" v-if="show" @commentDeleted="snackbar2=true"/>
      </div>
      <v-divider></v-divider>
  </v-container>
</template>

<script>
import BlogsEditModal from './BlogsEditModal.vue'
import CommentForm from './CommentForm.vue'
import { projectAuth, projectFirestore, projectStorage } from '../firebase/config'
import moment from 'moment'

export default {
  props: ['blog'],
  components : {
     BlogsEditModal,
     CommentForm
  },
  data(){
     return{
        user: projectAuth.currentUser,
        username2: null,
        snackbar1: false,
        text1: 'Post has been updated',
        show: false,
        snackbar2: false,
        text2: 'Your comment has been deleted'
     }
  },
  methods: {
     handleDelete(){
        confirm('Are you sure you want to delete this blog? ') &&
        projectFirestore.collection('blogs').doc(this.blog.id).delete()
        .then(() => {
           projectStorage.ref(this.blog.filePath).delete()
        })
        .then(() => {
           this.$emit('blogDeleted')
           console.log("blog deleted")
        })
        .catch(err => {
           console.log(err.message)
        })
     },
     likePost(){
        const newLike = this.user.uid 
        projectFirestore.collection('blogs').doc(this.blog.id).update({
           likes: [...this.blog.likes, newLike]
        })
     },
     unlikePost(){
        const newLikes = this.blog.likes.filter(like => {
           return like !== this.user.uid
        })
        projectFirestore.collection('blogs').doc(this.blog.id).update({
           likes: [...newLikes]
        })
     }
  },
  computed: {
     formattedDate(){
        return moment(this.blog.createdAt.toDate()).format('MMMM Do YYYY, h:mm:ss a')
     },
     ownership(){
        return this.blog.userId === this.user.uid
     },
     liked(){
        return this.blog.likes.includes(this.user.uid)
     }
  },
  mounted(){
     projectAuth.onAuthStateChanged(_user => {
        this.user = _user
     })
     projectFirestore.collection('users').doc(this.user.uid).onSnapshot(doc => {
        this.username2 = doc.data().username
     })
  }
}
</script>

<style scoped>
   .pills{
      display: inline-block;
   }
   .desc{
      line-height: 0.2;
   }
   .btn-icon{
      cursor: pointer;
   }
   .buttons{
      display: flex;
   }
   .social-icon{
      font-size:1.8rem;
      margin-right:1rem;
      cursor: pointer;
   }
   .like{
      font-size:0.9rem;
      margin-left:0.5rem;
   }
   .liked{
      color: rgb(0, 153, 255);
   }
   .social-btn-container{
      display: flex;
      margin: 10px 0;
   }
   .likes-container{
      display: flex;
      align-items: center;
      margin-right:30px;
      margin-left:-10px;
   }
   .comments-container{
      margin-left: -40px;
      display: flex;
   }
   .likes-numbers{
      font-size:0.9rem;
      margin-left: 10px;
   }
   .hide-btn{
      color: rgb(0, 153, 255);
      margin-top: 7px;
      
   }
   @media(max-width: 690px){
      .social-btn-container, .comments-container {
         display: block;
      } 
      .comments-container{
         margin-left: -10px;
         margin-top: 5px;
      }
   }

   @media(max-width: 482px){
      .posted-on{
         line-height: 15px;
      }
      .user-name{
         margin-bottom: -5px;
         margin-top:20px;
         line-height: 15px;
      }
   }
   
</style>