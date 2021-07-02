<template>
  <v-dialog max-width="600px" v-model="dialog">
    <template v-slot:activator="{ on }">
         <v-btn
            class="add-btn"
            fab
            small
            dark
            color="cyan"
            v-on="on"
            >
            <v-icon>add</v-icon>
        </v-btn>
    </template>

    <!-- Form goes here | The content of the pop up -->
    <v-card>
      <v-card-title>
        <h3>Upload Image...</h3>
      </v-card-title>

      <v-card-text>
        <v-form class="px-3" ref="form">
         <!-- upload list image -->
         <v-file-input
            type="file"
            :rules="imgRules"
            v-model="file"
            accept="image/png, image/jpeg"
            label="Insert Image"
         ></v-file-input>

         <v-responsive v-if="imageUrl">
            <v-img
               :src="imageUrl"
               height="150px"
               aspect-ratio="1.7"
               contain
            ></v-img>
         </v-responsive>
          
         <div v-if="!isPending">
             <v-btn
               class="success mx-0 mt-3"
               @click="submit"
               >Upload</v-btn
             >
              <v-btn
               text
               class="mx-0 mt-3 ml-2"
               @click="closeModal"
               >Cancel</v-btn
             >
          </div>
          <div v-if="isPending">
             <v-btn
               class="mx-0 mt-3"
               disabled
             >Uploading...</v-btn
          >
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import{projectFirestore, projectStorage, projectAuth, timestamp} from '../firebase/config'

export default {
  data() {
    return {
      file: null,
      filePath:null,
      url: null,
      blogs: [],
      messages: [],
      comments: [],
      user: projectAuth.currentUser,
      imgRules: [(v) => !!v || "Image is required"],
      loading: false,
      dialog: false,
      error: null,
      isPending: false,
    };
  },
  methods: {
    submit() {
       if(this.$refs.form.validate()){
         const uploadDocuments = async() => {
            this.isPending = true
            this.filePath = `covers/profile/${this.file.name}`
            const storageRef = projectStorage.ref(this.filePath)
            try{
               const res = await storageRef.put(this.file)
               this.url = await res.ref.getDownloadURL()

               projectFirestore.collection('users').doc(this.user.uid).update({
                  coverUrl: this.url,
               })
               .then(() => {
                  this.blogs.forEach(blog => {
                      if(blog.userId === this.user.uid){
                         projectFirestore.collection('blogs').doc(blog.id).update({
                             userCoverImg: this.url
                         })
                      }
                   })
               })
               .then(() => {
                  this.messages.forEach(message => {
                     if(message.userId === this.user.uid){
                        projectFirestore.collection('messages').doc(message.id).update({
                           coverUrl: this.url
                        })
                     }
                  })
               })
               .then(() => {
                  this.comments.forEach(comment => {
                     if(comment.userId === this.user.uid){
                        projectFirestore.collection('comments').doc(comment.id).update({
                           coverUrl: this.url
                        })
                     }
                  })
               })
               .then(() => {
                   this.isPending = false
                   this.dialog =false
                   this.$emit('imageUpdated')
               })
               .catch((err) => {
                  console.log(err.message)
               })   
            }catch(err){
               console.log(err.message)
               this.error= err.message
            }
         }
         uploadDocuments()
      }
    },
    closeModal(){
       this.dialog = false
    },
  },
  computed: {
     imageUrl(){
        if (!this.file) return;
            return URL.createObjectURL(this.file);
     }
  },
  mounted(){
     projectAuth.onAuthStateChanged(_user => {
        this.user = _user
     })
     projectFirestore.collection('blogs').orderBy('createdAt','desc').onSnapshot(res => {
         const changes = res.docChanges()
         changes.forEach(change => {
            if(change.type == "added"){
               this.blogs.push({ ...change.doc.data(), id: change.doc.id })  
            }
         })
     })
     projectFirestore.collection('messages').orderBy('createdAt').onSnapshot(res => {
         const changes = res.docChanges()
         changes.forEach(change => {
            if(change.type == "added"){
               this.messages.push({ ...change.doc.data(), id: change.doc.id })  
            }
         })
     })
     projectFirestore.collection('comments').orderBy('createdAt').onSnapshot(res => {
         const changes = res.docChanges()
         changes.forEach(change => {
            if(change.type == "added"){
               this.comments.push({ ...change.doc.data(), id: change.doc.id })  
            }
         })
     })
  }
};
</script>

<style scoped>
   .btn-upload{
      width: 80%;
      padding:1.5rem !important;
      border-radius:50px;
   }
   .pill{
      display: inline-block;
   }
   .chip{
      cursor: pointer;
   }
</style>