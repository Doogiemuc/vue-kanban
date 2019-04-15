/*eslint no-unused-vars: 0*/

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import CardStore from './components/CardStore.vue'
import KanbanBoard from './KanbanBoard.vue'

//console.clear()
console.log("=============================")
console.log("===== Welcome to KANBAN =====")
console.log("=============================")


//====================================
// Configure VueJS
Vue.config.devtools=false    //suppress some Vue warnings
Vue.config.productionTip = false
Vue.use(BootstrapVue)

var cardStore = new Vue(CardStore)

//====================================
// Start Vue.js root app
Promise.resolve()
//  .then(CardStore.deleteAllDocsInDb)
//  .then(CardStore.createTestData)
  .then(cardStore.getAllCardsFromDb)
  .then(allCards => {

    let kanbanData = cardStore.getKanbanData()

    new Vue({
      // Pass property data down to Vue root app  KanbanBoard.vue  
      // All this data is available via  this.$root...  in every child component
      // https://vuejs.org/v2/api/#propsData
      render: h => h(KanbanBoard, { 
        props: {
          kanbanData: kanbanData,
// eslint-disable-next-line no-undef          
          columns: columns,
        }       
      }),
      data: {
        cardStore: cardStore,     // this is available to all child components as  this.$root.cardStore and I love this pattern
      },
      created() {
        //console.log("Vue app created.", kanbanData)
      },
      mounted() {
        console.log("Vue app mounted successfully", kanbanData)
      },
    }).$mount('#app')
    
  })


