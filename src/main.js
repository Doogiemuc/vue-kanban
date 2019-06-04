console.clear()
console.log("=============================")
console.log("===== Welcome to KANBAN =====")
console.log("=============================")

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import KanbanBoard from './KanbanBoard.vue'
import EventBus from './store/EventBus.js'
import testdata from './TestData.js'

//====================================
// Configure VueJS
Vue.config.devtools = false         //suppress some Vue warnings
Vue.config.productionTip = false
Vue.use(BootstrapVue)


//====================================
// Start Vue.js root app
Promise.resolve()

  .then(testdata.destroyDbs)
  .then(testdata.createTestData)

  .then(EventBus.init)

  .then(([cards, settings]) => {

    console.log("EventBus.init", cards, settings)

    // Create the Vue RootApp instance
    new Vue({
      el: '#app',
      // Pass property data down to KanbanBoard.vue - https://vuejs.org/v2/api/#propsData
      render: h => h(KanbanBoard, {

        //props: {
        //  someProb: "value"   // This way you can inject properties into the KanbanBoard
        //}

      }),
      data: {
        eventBus: EventBus // global event bus. Usage: this.$root.bus.$emit('eventname')
      },
      created() {
        //console.log("Vue app created.", this.eventBus.cards)
      },
      mounted() {
        console.log("Vue app mounted successfully", this.eventBus.cards)
      },
    }) //.$mount('#app')


  })


