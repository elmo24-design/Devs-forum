<template>
  <v-container>
    <h1 class="heading grey--text">Chat Room</h1>
     <ChatWindow />
     <ChatForm />
  </v-container>
</template>

<script>
import ChatWindow from '../components/ChatWindow'
import ChatForm from '../components/ChatForm'

export default {
   components: {
      ChatWindow,
      ChatForm
   }
}
</script>

<style>

</style>