<template>
   <div class="mb-3">
      <h4 class="grey--text">Comments</h4>
      <div v-for="singleComments in commentCollection" :key="singleComments.id">
         <div class="head mt-5 mb-5">
            <small class="created">{{ moment(singleComments.createdAt.toDate()) }}</small>
            <div class="comment-heading">
               <div>
                  <v-avatar size="40" v-if="singleComments.coverUrl">
                     <v-img :src="singleComments.coverUrl"></v-img>
                  </v-avatar>
                  <v-avatar size="40" v-if="!singleComments.coverUrl">
                     <v-img src="@/assets/dummy.png"></v-img>
                  </v-avatar>
               </div>
               <div class="ml-2">
                  <p class="font-weight-bold comment-name">{{ singleComments.name }}</p>
               </div>
            </div>  
            <div class="comment-message">
               {{ singleComments.comment }}
            </div>
            <div class="actions" v-if="singleComments.userId === user.uid">
               <div></div>
               <v-icon @click="handleDelete(singleComments.id, singleComments.commentId, blog.id)">delete</v-icon>
            </div>
         </div>
         <!-- <small class="grey--text posted-on">{{ formattedDate }}</small> -->
      </div>
      <v-textarea
         label="Enter your comment here"
         v-model="commentMessage"
         @keydown.enter.prevent="comment"
         :rules="fieldRules"
         ref="form"
      >
      </v-textarea>
      <v-btn @click="comment">
         <v-icon class="mr-2">comment</v-icon>
         Comment
      </v-btn>
   </div>
</template>

<script>
import {projectFirestore, projectAuth, timestamp} from '../firebase/config'
import moment from 'moment'

export default {
   props: ['blog'],
   data(){
      return{
         user: projectAuth.currentUser,
         currentUser: null,
         commentMessage: '',
         commentCollection: [],
         commentId: Math.floor(Math.random() * 1000000),
         fieldRules: [(v) => !!v || "Comment is required"],
      }
   },
   methods: {
      comment(){
         if(this.$refs.form.validate()){
            projectFirestore.collection('comments').add({
               name: this.currentUser.username,
               comment: this.commentMessage,
               createdAt: timestamp(),
               userId: this.user.uid,
               commentId: this.commentId,
               coverUrl: this.currentUser.coverUrl
            })
            .then(() => {
               const newComment = this.commentId   
               projectFirestore.collection('blogs').doc(this.blog.id).update({
                  comments: [ ...this.blog.comments, newComment ]
               })
            })
            .catch((err) => console.log(err))
         }
      },
      handleDelete(docId, commentId, blogId){
         confirm("Are you sure you want to delete this comment?") &&
         projectFirestore.collection('comments').doc(docId).delete()
         .then(() => {
            const newComment = this.blog.comments.filter(comment => {
               return comment !== commentId
            })
            projectFirestore.collection('blogs').doc(blogId).update({
               comments: [ ...newComment ]
            })
         })
         .then(() => {
            this.$emit('commentDeleted')
         })
         .catch((err) => console.log(err))
      },
      moment(time){
         return moment(time).format('MMMM Do YYYY, h:mm:ss a') 
      }
   },
   mounted(){
      projectAuth.onAuthStateChanged(_user => {
         this.user = _user
      })
      projectFirestore.collection('users').doc(this.user.uid).get().then(doc =>{
         this.currentUser = doc.data()
      })
      projectFirestore.collection('comments').orderBy('createdAt','desc').onSnapshot(snap =>{
         let results = []
         snap.docs.forEach(doc => {
            if(this.blog.comments.includes(doc.data().commentId)){
               doc.data().createdAt && results.push({ ...doc.data(), id:doc.id })
            }
         })
         this.commentCollection = results
      })
   },
   computed: {
   }
}
</script>

<style scoped>
   .comment-heading{
       display: flex;
       align-items: center;
       margin-top:10px;
   }
   .head{
      line-height:0px;
      display:block;
      background-color: rgb(228, 228, 228);
      padding: 0.5rem 1rem;
      border-radius: 5px;
   }
   .comment-message{
      padding: 0.5rem;
      margin-left: 2.5rem;
      margin-top: 1rem;
      margin-bottom:1rem;
      line-height: 15px;
   }
   .actions{
      display:flex;
      justify-content: space-between;
   }
   .created{
      line-height: 1rem;
   }
   .comment-name{
      margin-top: 1rem;
   }
   @media(max-width: 690px){
      .comment-name{
         margin-top: 10px;
         font-size:0.9rem;
         line-height: 15px;
      }
      .created{
         font-size: 0.7rem;
      }
   }
   @media(max-width: 482px){
      .created{
         line-height: 15px;
      }
   }
</style>