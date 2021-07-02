<template>
  <form>
    <v-textarea
         v-model="message"
         @keypress.enter.prevent="handleSubmit"
         ref="messageForm"
         :rules="messageRules"
         append-outer-icon="mdi-comment"
         class="mx-2"
         label="Type your message here..."
         rows="1"
      ></v-textarea>
     <v-btn disabled v-if="isPending" class="ml-2">Loading...</v-btn>
     <v-btn v-if="!isPending" class="primary ml-2" @click.prevent="handleSubmit">Send</v-btn>
     <div class="error">
        {{ error }}
     </div>
  </form>
</template>

<script>
import { projectAuth, projectFirestore, timestamp } from '../firebase/config'

export default {
   data(){
      return{
         user: projectAuth.currentUser,
         message: '',
         error: null,
         currentUser: null,
         isPending: false,
         messageRules: [(v) => !!v || "Message should not be empty"],
      }
   },
   methods: {
      handleSubmit(){
         if(this.$refs.messageForm.validate()){
            this.isPending = true
            projectFirestore.collection('messages').add({
               name: this.currentUser.username,
               message: this.message,
               createdAt: timestamp(),
               userId: this.user.uid,
               coverUrl: this.currentUser.coverUrl
            })
            .then(() => {
               console.log('Message Sent!')
               this.isPending = false
               this.message = ''
            })
            .catch((err) => {
               this.error = 'Message field is required'
               console.log(err.message)
               this.isPending = false
               this.message = ''
            })
         }
      }
   },
   mounted(){
      projectAuth.onAuthStateChanged(_user => {
         this.user = _user
      })
      projectFirestore.collection('users').doc(this.user.uid).get().then(doc =>{
         this.currentUser = doc.data()
      })
   }
}
</script>

<style scoped>
   form{
      margin: 10px;
   }
   textarea{
      width: 100%;
      max-width: 100%;
      margin-bottom: 6px;
      padding: 10px;
      box-sizing: border-box;
      border: 0;
      font-family: inherit;
      outline: none;
      background: rgb(233, 233, 233);
   }
</style>