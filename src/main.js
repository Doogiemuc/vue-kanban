/*eslint no-unused-vars: 0*/

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import KanbanBoard from './KanbanBoard.vue'

//console.clear()
console.log("=============================")
console.log("===== Welcome to KANBAN =====")
console.log("=============================")


//====================================
// Test Fixtures
//TODO: read all this from a DB

// one column for each status
const columns = [
  { 
    _id: 0,
    title: "Todo",
  },
  { 
    _id: 1,
    title: "In Progress",
  },
  { 
    _id: 2,
    title: "Done",
  },
]

const releases = [
  {
    _id: 0,
    title: "Bluefish Release"
  },
  {
    _id: 1,
    title: "Carnivore Release"
  },
]



//====================================
// PuchDB
// eslint-disable-next-line no-undef
var db = new PouchDB('kanban_board_db');

function getAllCardsFromDb()  {
  return db.allDocs({
    include_docs: true
  })
}


var deleteAllDocsInDb = function() {
  console.log("Removing all data from the DB! ")
  return db.allDocs({
    //include_docs: true,
  }).then(function (result) {
    //console.log("result", result)
    result.rows.forEach(doc => db.remove(doc.id, doc.value.rev))
  }).catch(function (err) {
    console.log("Cannot get allDocs", err);
  });
  
}


//====================================
// Create Test Data
function createTestData() {
  console.log("===== Creating new testdata")
  var cards = []
  // at least one card in every release and col
  for (let i = 0; i < columns.length; i++) {
    for (let j = 0; j < releases.length; j++) {
      cards.push({
        _id: "CardInCol"+i+"Rel"+j, 
        title: "Card Col"+i+" Rel"+j,
        status: columns[i].title,
        release: releases[j],
        description: "One first card in col "+i+" and release "+releases[j].title,
        labels: ["eins", "zwei", "drei"]
      })
    }
  }
  for (let i = 0; i < 10; i++) {
    cards.push({
      _id: "Card"+i, 
      title: "Card  "+i,
      status: columns[getRandomInt(columns.length)].title,
      release: releases[getRandomInt(releases.length)],
      description: "Some dummy content for card "+i+" with <b>HTML</b>. asdflkjawe kltnlasdg klaj glkj ag lk adlkgjaergelkgj. laskjfasd lkjasd lkweklwejnwefkasdhf vsdf wenwef asdlkfjw eflknf aslkenff enfweo pivuicvioen.",
    })
  }
  db.bulkDocs(cards)
    .then(() => console.log("DONE. Created "+cards.length+" cards."))
    .catch(err => console.error("ERROR. Could not createTestData", err))
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}



//===========================================================================
// Utility methods for mapping PuchDB results intodata for VueJS components
function getAllCards(dbResult) {
  return dbResult.rows.map(row => row.doc)
}

function getCardsForRelAndCol(allCards, rel, col) {
  return allCards.filter(card =>  {
    return card.release._id === rel._id && card.status === col.title    // TODO: make this configurable
  })
}

/** 
 map dbResult to releases with columns  and cards 
 releases -> columns -> cards
 Columns are **inside** releases mostly because of HTML layout reasons.
 @return array of releases with columns and cards inside 
*/
function getKanbanData(releases, dbResult) {
  var allCards = getAllCards(dbResult)
  return releases.map(rel => ({
    '_id': rel._id,
    'title': rel.title,
    'columns': columns.map(col => ({
      '_id':   col._id,
      'cards': getCardsForRelAndCol(allCards, rel, col)
    }))
  }))
}


//====================================
// Configure VueJS
Vue.config.devtools=false    //suppress some Vue warnings
Vue.config.productionTip = false
Vue.use(BootstrapVue)


//====================================
// Global data store
// https://forum.vuejs.org/t/how-set-global-state-available-to-all-components/5947
export const globalStore = new Vue({
  data: {
    cards: [],
  },
  methods: {
    //getDbResult
    //getAllCards
  }
})



//====================================
// Start Vue.js root app
Promise.resolve()
//  .then(deleteAllDocsInDb)
//  .then(createTestData)
  .then(getAllCardsFromDb)
  .then(dbResult => {
    globalStore.cards = getAllCards(dbResult)
    let kanbanData = getKanbanData(releases, dbResult)
    
    new Vue({
      // Pass property data down to Vue root app  KanbanBoard.vue  
      // All this data is available via  this.$root...  in every child component
      // https://vuejs.org/v2/api/#propsData
      render: h => h(KanbanBoard, { 
        props: {
          kanbanData: kanbanData,
          columns: columns,
        }       
      }),
      data: {
        globalStore: globalStore,     // this is available to all child components as  this.$root.globalStore
        //api: apiService,
      },
      created() {
        //console.log("Vue app created.", kanbanData)
      },
      mounted() {
        console.log("Vue app mounted successfully", kanbanData)
        //console.log("dbResult", dbResult)
        //console.log("cards", getAllCards(dbResult))
        //console.log("kanban", getKanbanData(releases, dbResult))
        //console.log("columns", columns)
      },
    }).$mount('#app')
    
  })


