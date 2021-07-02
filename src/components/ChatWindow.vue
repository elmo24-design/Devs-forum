<template>
  <div class="chat-window">
      <div class="messages" ref="messages" >
         <div v-for="document in formattedDocuments" :key="document.id" class="single" :class="( document.userId === user.uid ? 'authUser' : 'none')">
            <div class="d-flex">
               <div>
                  <v-avatar size="45" v-if="document.coverUrl" class="mr-2">
                     <v-img :src="document.coverUrl"></v-img>
                  </v-avatar>
                  <v-avatar size="45" v-if="!document.coverUrl" class="mr-2">
                     <v-img src="@/assets/dummy.png"></v-img>
                  </v-avatar>
               </div>
               <div>
                  <span class="created-at">{{ document.createdAt }} ago</span>
                  <span class="name">{{ document.name }}</span>
               </div>
            </div>
            <span class="message">{{ document.message }}</span>
         </div>
      </div>
  </div>
</template>

<script>
import { formatDistanceToNow } from 'date-fns'
import {projectFirestore, projectAuth} from '../firebase/config'

export default {
   data(){
      return {
         user: projectAuth.currentUser,
         error: null,
         documents: null,
      }
   },
   mounted(){
      projectAuth.onAuthStateChanged(_user => {
         this.user = _user
      })
      projectFirestore.collection('messages').orderBy('createdAt').onSnapshot(snap => {
         let results = []
         snap.docs.forEach(doc => {
             doc.data().createdAt && results.push({ ...doc.data(), id:doc.id })
         })
         this.documents = results
      })
   },
   computed: {
      formattedDocuments(){
         if(this.documents){
            return this.documents.map(document=>{
               let time = formatDistanceToNow(document.createdAt.toDate())
               return { ...document, createdAt: time }
            })
         }
      }
   },
   updated(){
      const messages = this.$refs.messages
      messages.scrollTop = messages.scrollHeight
   }
}
</script>

<style>
   .chat-window {
      background: #fafafa;
      padding: 30px 20px;
   }
   .single{
      margin: 10px 0;
      background: #e7e7e7;
      color: black;
      padding: 10px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      max-width: 50%;
   }
   .created-at{
      display:block;
      color: rgb(136, 136, 136);
      font-size: 12px;
      margin-bottom: 4px;
      line-height: 15px;
   }
   .name{
      font-weight: bold;
      margin-right: 6px;
      line-height: 15px;
   }
   .message{
      margin-left: 20px;
      padding-top: 10px;
      line-height: 15px;
   }
   .messages{
      max-height: 300px;
      overflow: auto;
   }
   .authUser{
      background-color: #0074f8;
      color: white;
      margin-left: 50%;
   }
   .authUser .created-at{
      color:white;
   }
   @media(max-width: 460px){
      .created-at{
         font-size: 9px;
      }
      .name{
         font-size: 12px;
      }
   }
</style>