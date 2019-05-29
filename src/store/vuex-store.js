//====================================
// Vuex store for cards

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

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
var getCardsForRowAndColFunc = function(cards, row, col) {
  // map card status to columns
  const status2Col = {
    "New": "Todo",
    "Ready": "Todo",
    "InProgress": "In Progress",
    "Done": "Done",
  }
  return cards.filter(card => {
      return card.release._id === row._id && status2Col[card.status.value] === col.displayName
    })
    .sort(cardSortFunc)
}


//====================================
// PouchDB in browser DB
import PouchDB from 'pouchdb-browser'
var kanbanDb = new PouchDB('kanban_board');
var cardsDb  = new PouchDB('kanban_cards');

var getAllCardsFromDb = function() {
  return cardsDb.allDocs({include_docs: true}).then(res => {
    var cardsById = {}
    res.rows.forEach(row => {
      cardsById[row.id] = row.doc   // here its really .id  not ._id   *sic*
    })
    return cardsById
  })
}

var loadSettingsFromDb = function() {
  return kanbanDb.allDocs({include_docs: true}).then(res => {
    console.log("loaded settings", res)
    var settings = {}
    res.rows.forEach(row => {
      settings[row.id] = row.doc
    })
    console.log("settings", settings)
    return settings
  })
}


//====================================
// vuex-store instance
export default new Vuex.Store({
  state: {
    cards: {},      // cards by Id
		settings: {},   // kanban board settings, such as columns, editable fields etc.
  },
  mutations: {
    setAllCards(state, newCardsById) {
      state.cards = newCardsById
    },
    setSettings(state, newSettings) {
      state.settings = newSettings
    },
    setCard(state, newCard) {
      state.cards[newCard._id] = newCard
    }
  },
  actions: {
    initStore({commit}) {
      loadSettingsFromDb().then(settings => {
        commit('setSettings', settings)
      })
      getAllCardsFromDb().then(cardsById => {
        //console.log("vuex-store loaded cards from DB", cardsById)
        commit('setAllCards', cardsById)
        return cardsById
      })
    },
    startEditCard(context, cardId) {
      console.log("vuex-store.startEditCard", cardId)
      this.$emit("START_EDIT_CARD")
    }
  },
  getters: {
    //===== attribue style getters, result will be cached =====

    /** Fetch all cards as one (unsorted!) array */
    cardsArray: (state) => {
      return Object.values(state.cards)
    },

    columns: (state) => {
      return state.settings['settings/columns'].columns
    },

    //===== method style getters, not cached =====

    /** Fetch one card by its ID from the store */
    getCardById: (state) => (id) => {
      return state.cards[id]
    },

    /** Fetch all cards for the given row and col */
    getCardsForRowAndCol: (state, getters) => (row,col) => {
      return getCardsForRowAndColFunc(getters.cardsArray, row, col)
    }
  }
})