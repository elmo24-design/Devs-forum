<template>
  <v-dialog max-width="600px" v-model="dialog">
    <template v-slot:activator="{ on }">
        <v-btn class="indigo white--text btn-upload" v-on="on">
            <v-icon class="mr-2">upload</v-icon>
            <p class="upload">Upload</p>
         </v-btn>
    </template>

    <!-- Form goes here | The content of the pop up -->
    <v-card>
      <v-card-title>
        <h3>Share Something...</h3>
      </v-card-title>

      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-textarea
            label="Say something about this project"
            v-model="description"
            :rules="descRules"
            prepend-icon="mdi-pencil"
          ></v-textarea>

         <!-- upload list image -->
         <v-file-input
            :rules="imgRules"
            v-model="file"
            accept="image/png, image/jpeg"
            label="Insert Image"
         ></v-file-input>

         <!-- image preview -->
         <v-responsive v-if="imageUrl">
            <v-img
               :src="imageUrl"
               aspect-ratio="1.7"
               contain
            ></v-img>
         </v-responsive>
         
         <!-- tags input -->
         <v-text-field
            label="Tags (hit enter to add a tag)"
            v-model="tag"
            @keydown.enter.prevent="handleKeyDown"
            prepend-icon="sell"
         ></v-text-field>
   
         <div v-for="tag in tags" :key="tag" class="pill"> 
           <v-chip v-if="chip2" close color="indigo white--text mb-3 ml-1" class="chip" @click:close="deleteTag(tag)"> #{{ tag }}</v-chip>
         </div>
         <v-btn small class="mb-4 ml-1" @click="handleKeyDown">
            Add tag
         </v-btn>
          
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
      description: "",
      file: null,
      filePath:null,
      url: null,
      tag: '',
      tags: [],
      user: projectAuth.currentUser,
      currentUser: null,
      likes: [],
      comments: [],
      descRules: [(v) => !!v || "Description is required"],
      imgRules: [(v) => !!v || "Image is required"],
      loading: false,
      dialog: false,
      error: null,
      isPending: false,
      chip2: true,
    };
  },
  methods: {
    submit() {
       if(this.$refs.form.validate()){
         const uploadDocuments = async() => {
            this.isPending = true
            this.filePath = `covers/blogs/${this.file.name}`
            const storageRef = projectStorage.ref(this.filePath)
            try{
               const res = await storageRef.put(this.file)
               this.url = await res.ref.getDownloadURL()
               
               projectFirestore.collection('blogs').add({
                  description: this.description,
                  filePath: this.filePath,
                  coverUrl: this.url,
                  tags: this.tags,
                  comments: [],
                  likes: [],
                  userId: this.user.uid,
                  userCoverImg: this.currentUser.coverUrl,
                  username: this.currentUser.username,
                  createdAt: timestamp()
               })
               .then(() => {
                   this.isPending = false
                   this.dialog =false
                   this.$emit('blogUploaded')
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
    handleKeyDown(){
         if(!this.tags.includes(this.tag)){ //avoids redundancy
            this.tag = this.tag.replace(/\s/ , '') //removes all whitespace
            this.tags.push(this.tag)
         }
         this.tag = ''
    }, 
    closeModal(){
       this.dialog = false
    },
    deleteTag(tag){
       this.tags = this.tags.filter(val => {
          return tag !== val
       })
    }
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
     projectFirestore.collection('users').doc(this.user.uid).get().then(doc =>{
        this.currentUser = doc.data()
     })
  }
};
</script>

<style scoped>
   .btn-upload{
      width: 80%;
      padding:1.5rem !important;
      border-radius:25px;
      margin-bottom:1rem;
   }
   .upload{
      margin-right:1rem;
      margin-top:1rem;
   }
   .pill{
      display: inline-block;
   }
   .chip{
      cursor: pointer;
   }
</style>