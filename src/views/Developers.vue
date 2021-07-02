<template>
  <div class="team">
    <v-container class="my-5">
      <h1 class="heading grey--text ml-2">Developers</h1>
      <v-row no-gutters class="card-devs" v-if="developers.length">
        <v-col
          v-for="devs in developers"
          :key="devs.id"
        >
          <v-card text class="text-center ma-3">
            <v-responsive class="pt-4">
               <v-avatar size="100" v-if="devs.coverUrl">
                  <v-img :src="devs.coverUrl"></v-img>
               </v-avatar>
               <v-avatar size="100" v-if="!devs.coverUrl">
                  <v-img src="@/assets/dummy.png"></v-img>
               </v-avatar>
            </v-responsive>
            <v-card-text>
              <div class="subheading">{{ devs.username }}</div>
              <div class="grey--text">{{ devs.bio }}</div>
            </v-card-text>
            <!-- <v-card-actions>
              <v-btn text color="grey">
                <v-icon small left>mdi-message</v-icon>
                <span>message</span>
              </v-btn>
            </v-card-actions> -->
          </v-card>
        </v-col>
      </v-row>
      <div v-else>
         <Spinner />
      </div>
    </v-container>
  </div>
</template>

<script>
import { projectFirestore } from '../firebase/config'
import Spinner from '../components/Spinner.vue'

export default {
   components: {
      Spinner
   },
   data(){
      return{
         developers: []
      }
   },
   mounted(){
      const load = async() => {
         try{
            const res = await projectFirestore.collection('users')
            .get()
            this.developers = res.docs.map(doc => {
               return { ...doc.data(), id: doc.id } 
            })
         }
         catch (err){
            console.log(err)
         }
      }
      load()
   }
}
</script>

<style scoped>
   .card-devs{
      display: grid;
      grid-template-columns: repeat(4,1fr);
   }
   @media (max-width: 950px){
     .card-devs{
        grid-template-columns: repeat(3, 1fr);
     }
   }
   @media (max-width: 700px){
     .card-devs{
        grid-template-columns: repeat(2, 1fr);
     }
   }
   @media (max-width: 500px){
     .card-devs{
        grid-template-columns: 1fr;
     }
   }
</style>