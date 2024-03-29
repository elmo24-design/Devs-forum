<template>
  <v-container>
      <v-row class="fill-height">
         <v-col>
            <v-sheet height="64">
               <v-toolbar
                  flat
               >
                  <v-btn
                     color="primary"
                     class="mr-4"
                     @click="dialog = true"
                     dark
                  >
                     New Event
                  </v-btn>
                  <v-btn
                     outlined
                     class="mr-4"
                     color="grey darken-2"
                     @click="setToday"
                  >
                     Today
                  </v-btn>
                  <v-btn
                     fab
                     text
                     small
                     color="grey darken-2"
                     @click="prev"
                  >
                     <v-icon small>
                     mdi-chevron-left
                     </v-icon>
                  </v-btn>
                  <v-btn
                     fab
                     text
                     small
                     color="grey darken-2"
                     @click="next"
                  >
                     <v-icon small>
                     mdi-chevron-right
                     </v-icon>
                  </v-btn>
                  <v-toolbar-title v-if="$refs.calendar">
                     {{ $refs.calendar.title }}
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-menu
                     bottom
                     right
                  >
                     <template v-slot:activator="{ on, attrs }">
                     <v-btn
                        outlined
                        color="grey darken-2"
                        v-bind="attrs"
                        v-on="on"
                     >
                        <span>{{ typeToLabel[type] }}</span>
                        <v-icon right>
                           mdi-menu-down
                        </v-icon>
                     </v-btn>
                     </template>
                     <v-list>
                     <v-list-item @click="type = 'day'">
                        <v-list-item-title>Day</v-list-item-title>
                     </v-list-item>
                     <v-list-item @click="type = 'week'">
                        <v-list-item-title>Week</v-list-item-title>
                     </v-list-item>
                     <v-list-item @click="type = 'month'">
                        <v-list-item-title>Month</v-list-item-title>
                     </v-list-item>
                     <v-list-item @click="type = '4day'">
                        <v-list-item-title>4 days</v-list-item-title>
                     </v-list-item>
                     </v-list>
                  </v-menu>
               </v-toolbar>
            </v-sheet>

            <!-- add event dialog -->
            <v-dialog v-model="dialog" max-width="500">
               <v-card>
                  <v-container>
                     <v-form @submit.prevent="addEvent" ref="form">
                        <v-text-field v-model="name" type="text" label="event name (required)" :rules="textRules">
                        </v-text-field>
                        <v-text-field v-model="details" type="text" label="details"
                        :rules="textRules"
                        >
                        </v-text-field>
                        <v-text-field v-model="start" type="date" label="start(required)" :rules="textRules">
                        </v-text-field>
                        <v-text-field v-model="end" type="date" label="end(required)"
                        :rules="textRules"
                        >
                        </v-text-field>
                        <v-text-field v-model="color" type="color" label="color(click to open color menu)"
                        :rules="textRules"
                        >
                        </v-text-field>
                        <v-btn 
                        type="submit" 
                        color="primary" 
                        class="mr-4"
                        >
                        Create Event
                        </v-btn>
                        <v-btn @click="dialog=false">
                           Close
                        </v-btn>
                     </v-form>
                  </v-container>
               </v-card>
            </v-dialog>

            <v-sheet height="600">
               <v-calendar
                  ref="calendar"
                  v-model="focus"
                  color="primary"
                  :events="events"
                  :event-color="getEventColor"
                  :type="type"
                  @click:event="showEvent"
                  @click:more="viewDay"
                  @click:date="viewDay"
                  @change="updateRange"
               ></v-calendar>
               <v-menu
                  v-model="selectedOpen"
                  :close-on-content-click="false"
                  :activator="selectedElement"
                  offset-x
               >
                  <v-card
                     color="grey lighten-4"
                     min-width="350px"
                     flat
                  >
                     <v-toolbar
                     :color="selectedEvent.color"
                     dark
                     >
                     <v-btn icon @click="deleteEvent(selectedEvent.id)" v-if="selectedEvent.userId === user.uid">
                        <v-icon>mdi-delete</v-icon>
                     </v-btn>
                     <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                     <v-spacer></v-spacer>
                     </v-toolbar>
                     <v-card-text>
                        <form v-if="currentlyEditing !== selectedEvent.id">
                           {{ selectedEvent.details }}
                        </form>
                        <form v-else>
                           <textarea-autosize
                              v-model="selectedEvent.details"
                              type="text"
                              style="width: 100%"
                              :min-height="100"
                              placeholder="add note"
                           >
                           </textarea-autosize>
                        </form>
                     </v-card-text>
                     <v-card-actions>
                     <v-btn
                        text
                        color="secondary"
                        @click="selectedOpen = false"
                     >
                        Cancel
                     </v-btn>
                     <div v-if="selectedEvent.userId === user.uid">
                         <v-btn
                           class="edit-btn"
                           text
                           v-if="currentlyEditing !== selectedEvent.id"
                           @click.prevent="editEvent(selectedEvent)"
                           >
                           Edit
                           </v-btn>
                           <v-btn
                              class="edit-btn"
                              text
                              v-else 
                              @click.prevent="updateEvent(selectedEvent)"
                           >
                           Save
                        </v-btn>
                     </div>
                     </v-card-actions>
                  </v-card>
               </v-menu>
            </v-sheet>
         </v-col>
      </v-row>
  </v-container>
</template>

<script>
import {projectFirestore,projectAuth} from '../firebase/config'

export default {
   data(){
      return{
         user: projectAuth.currentUser,
         today: new Date().toISOString().substr(0,10),
         focus: new Date().toISOString().substr(0, 10),
         type: 'month',
         typeToLabel: {
            month: 'Month',
            week: 'Week',
            day: 'Day',
            '4day': '4 Days'
         },
         name: null,
         details: null,
         start: null,
         end: null,
         color: '#1976D2',
         currentlyEditing: null,
         selectedEvent: {},
         selectedElement: null,
         selectedOpen: false,
         events: [],
         dialog: false,
         textRules: [(v) => !!v || "This field is required"],
      }
   },
   mounted(){
      this.getEvents()
      projectAuth.onAuthStateChanged(_user => {
         this.user = _user
      })
   },
   computed: {
      title () {
         const { start, end } = this
         if (!start || !end) {
          return ''
         }
         const startMonth = this.monthFormatter(start)
         const endMonth = this.monthFormatter(end)
         const suffixMonth = startMonth === endMonth ? '' : endMonth
         const startYear = start.year
         const endYear = end.year
         const suffixYear = startYear === endYear ? '' : endYear
         const startDay = start.day + this.nth(start.day)
         const endDay = end.day + this.nth(end.day)
         switch (this.type) {
         case 'month':
         return `${startMonth} ${startYear}`
         case 'week':
         case '4day':
         return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
         case 'day':
         return `${startMonth} ${startDay} ${startYear}`
         }
         return ''
      },
      monthFormatter () {
         return this.$refs.calendar.getFormatter({
            timeZone: 'UTC', month: 'long',
         })
      },
      ownership(){
        return this.events.filter(event => {
           return event.userId === this.user.uid
        })
      }
   },
   methods: {
      async getEvents(){
         let snapshot = await projectFirestore.collection('calEvent').get()
         let events = []
         snapshot.forEach(doc => {
            let appData = doc.data();
            appData.id = doc.id;
            events.push(appData)
         })
         this.events = events
      },
      async addEvent(){
         if(this.$refs.form.validate()){
            await projectFirestore
            .collection('calEvent')
            .add({
               name: this.name,
               details: this.details,
               start: this.start,
               end: this.end,
               color: this.color,
               userId: this.user.uid
            }).then(() => {
               this.getEvents()
               this.name=""
               this.details=""
               this.start=""
               this.end=""
               this.color="#1976D2"
               this.dialog= false
            })
         }
      },
      async updateEvent(ev){
         await projectFirestore
         .collection('calEvent')
         .doc(this.currentlyEditing)
         .update({
            details: ev.details
         })
         .then(() => {
            this.selectedOpen = false
            this.currentlyEditing = null
         })
      },
      async deleteEvent(ev){
         await projectFirestore
         .collection('calEvent')
         .doc(ev)
         .delete()
         .then(() => {
            this.selectedOpen = false
            this.getEvents()
         })
      },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      editEvent(ev){
         this.currentlyEditing = ev.id
      },
      updateRange ({ start, end }) {
         this.start = start
         this.end = end
      },
      nth (d) {
         return d > 3 && d < 21
         ? 'th'
         : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
      }
   }
}
</script>

<style scoped>
.theme--dark.v-card > .v-card__text, .theme--dark.v-card {
    color: rgba(0, 0, 0, 0.7);
}
.theme--dark.edit-btn {
    color: #000000;
}
</style>