<template>
  <v-dialog max-width="600px" v-model="dialog">
    <template v-slot:activator="{ on }">
        <v-icon class="mr-2 edit-btn" v-on="on">create</v-icon>
    </template>

    <!-- Form goes here | The content of the pop up -->
    <v-card>
      <v-card-title>
        <h3>Edit Blog...</h3>
      </v-card-title>

      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-textarea
            label="Description"
            v-model="editBlog.description"
            :rules="descRules"
            prepend-icon="mdi-pencil"
          ></v-textarea>

         <!-- tags input -->
         <v-text-field
            label="Tags (hit enter to add a tag)"
            v-model="editBlog.tag"
            @keydown.enter.prevent="handleKeyDown"
            prepend-icon="sell"
         ></v-text-field>
   
         <div v-for="tag in editBlog.tags" :key="tag" class="pill"> 
           <v-chip v-if="chip2" close color="indigo white--text mb-3 ml-1" class="chip" @click:close="deleteTag(tag)"> #{{ tag }}</v-chip>
         </div>
         <v-btn small class="mb-4 ml-1" @click="handleKeyDown">
            Add tag
         </v-btn>
          
         <div v-if="!isPending">
             <v-btn
               class="success mx-0 mt-3"
               @click="submit"
               >Update</v-btn
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
             >Updating...</v-btn
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
  props: ['editBlog'],
  data() {
    return {
      user: projectAuth.currentUser,
      descRules: [(v) => !!v || "Description is required"],
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
         const updateDocument = async() => {
            this.isPending = true
            try{
               projectFirestore.collection('blogs').doc(this.editBlog.id).update({
                  description: this.editBlog.description,
                  tags: this.editBlog.tags,
               })
               .then(() => {
                   this.isPending = false
                   this.dialog =false
                   this.$emit('blogUpdated')
                   console.log('blog updated')
               })
               .catch((err) => {
                  console.log(err.message)
               })   
            }catch(err){
               console.log(err.message)
               this.error= err.message
            }
         }
         updateDocument()
      }
    },
    handleKeyDown(){
         if(!this.editBlog.tags.includes(this.editBlog.tag)){ //avoids redundancy
            this.editBlog.tag = this.editBlog.tag.replace(/\s/ , '') //removes all whitespace
            this.editBlog.tags.push(this.editBlog.tag)
         }
         this.editBlog.tag = ''
    }, 
    closeModal(){
       this.dialog = false
    },
    deleteTag(tag){
       this.editBlog.tags = this.editBlog.tags.filter(val => {
          return tag !== val
       })
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
   .pill{
      display: inline-block;
   }
   .chip{
      cursor: pointer;
   }
   @media(max-width: 500px){
      .edit-btn{
         margin-left: 18px;
         margin-bottom: 15px;
      }
   }
</style>