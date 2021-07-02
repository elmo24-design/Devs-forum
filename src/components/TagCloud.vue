<template>
  <v-container>
     <div v-for="tag in tags" :key="tag">
        <v-chip>
           {{ tag }}
        </v-chip>
     </div>
  </v-container>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
   props: ['blogs'],
   data(){
      return{
         tagValues: []
      }
   },
   computed: {
      ...mapGetters(['tags'])
   },
   mounted(){
     if(this.$store.state.tags.length === 0){
        return this.$store.dispatch('getTags',this.blogs, this.tagValues)
     }else{
        return this.$store.dispatch('getTags',this.blogs, this.tagValues)
     }
   },
}
</script>

<style>

</style>