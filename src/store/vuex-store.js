/* global PouchDB */
//====================================
// Vuex store for cards

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


//====================================
// Test Fixtures
//TODO: read all this from a DB

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

const linkTypes = [
	{	_id: 0, displayName: "related",	value: "related" },
	{	_id: 1, displayName: "depends	on", value:	"dependsOn"	},
	{	_id: 2, displayName: "child	of", value:	"childOf"	},
]


/**
 compare two cards on the board and return sort order
 */ 
var cardSortFunc = function(card1, card2) {
  return card1._id - card2._id  // TODO: just some arbitrary sorting.  Make this configurable via UI and store in DB.
}


/**
 Get the list of cards for the given row and col on the board.
 @param allCards {Array} List of all cards
 @param row {Object} the swimmlane, eg. a release
 @param col {Object} a column, eg. mapped to the status of a card
 */
var getCardsForRowAndColFunc = function(cardsById, row, col) {
  return Object.values(cardsById)
    .filter(card => {
      return card.release._id === row._id && card.status === col.title    
    })
    .sort(cardSortFunc)
}


//====================================
// PuchDB in browser DB
const db = new PouchDB('kanban_board_db');

var getAllCardsFromDb = function() {
    return db.allDocs({include_docs: true
  }).then(res => {
    console.log("loaded", res)
    var cardsById = {}
    res.rows.forEach(row => {
      cardsById[row.id] = row.doc   // here its really .id  not ._id   *sic*
    })
    return cardsById
  })
}

//====================================
// vuex-store instance
export default new Vuex.Store({
  state: {
    cards: {},
		releases:  releases,
		columns:   columns,
		linkTypes: linkTypes,
  },
  mutations: {
    setAllCards(state, newCardsById) {
      state.cards = newCardsById
    },
    setCard(state, newCard) {
      state.cards[newCard._id] = newCard
    }
  },
  actions: {
    loadCardsFromDB({commit}) {
      return getAllCardsFromDb().then(cardsById => {
        console.log("vuex-store loaded cards from DB", cardsById)
        commit('setAllCards', cardsById)
        return cardsById
      })
    }
  },
  getters: {
    //===== attribue style getters, result will be cached =====
    
    /** Fetch all cards as one (unsorted!) array */
    cardsArray: (state) => {
      return Object.values(state.cards)
    },
    
    //===== method style getters, not cached =====
    
    /** Fetch one card by its ID from the store */
    getCardById: (state) => (id) => {
      return state.cards[id]
    },
    
    /** Fetch all cards for the given row and col */
    getCardsForRowAndCol: (state) => (row,col) => {
      return getCardsForRowAndColFunc(state.cards, row, col)
    }
  }
})