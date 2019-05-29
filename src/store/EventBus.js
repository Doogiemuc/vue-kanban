/**
 Global event bus. Publish subcribe pattern.
 This is not a UI component. See also vuex-store.js
 The vuex-store is responsible for storing global application state (e.g. all cards)
 This EventBus only publishes events that components can subscribe and listen to.
 This EventBus does not store any data.

 https://medium.com/@andrejsabrickis/https-medium-com-andrejsabrickis-create-simple-eventbus-to-communicate-between-vue-js-components-cdc11cd59860
 */
import Vue from 'vue';

//====================================
// PouchDB in browser DB
import PouchDB from 'pouchdb-browser'
var kanbanDb = new PouchDB('kanban_board');
var cardsDb  = new PouchDB('kanban_cards');

/**
 Should that card be shown in this row and column?
 @param card {Object} one card
 @param row {Object} the swimmlane, eg. a release
 @param col {Object} a column. You can for example show cards with a given status in each column.
 */
var cardFilterFunc = function(card, row, col) {
	return row.value === card.release.value &&
	       col.status.includes(card.status.value)
}


const EventBus = new Vue({
	data: function() { return {
		cards: {},			// cards by _Id
		settings: {}
	}},
	computed: {
		cardsArray() { return Object.values(this.cards) },
		columns()  { return this.settings['settings/columns'].columns },
		releases() { return this.settings['field/release'].options },      //TODO: This feels wrong. List of releases should not be loaded from the UI field.
	},
	methods: {
		init() {
			return Promise.all([this.loadCards(), this.loadSettings()])
		},
		/* load cards from PouchDb. Need to map pouchDB result to cards {map} */
		loadCards() {
			return cardsDb.allDocs({include_docs: true}).then(res => {
		    res.rows.forEach(row => {
		      this.cards[row.id] = row.doc   // here its really .id  not ._id   *sic*
		    })
		    return this.cards
		  })
		},
		/* load application settins from PouchDB */
		loadSettings() {
			return kanbanDb.allDocs({include_docs: true}).then(res => {
		    res.rows.forEach(row => {
		      this.settings[row.id] = row.doc   // here its really .id  not ._id   *sic*
		    })
		    return this.settings
		  })
		},
		/* get all cards for this row and col by using the configurable cardFilterFunc */
		getCardsForRowAndCol(row, col) {
			//TODO: load cardFilterFunc from DB and eval()
			return this.cardsArray.filter(card => cardFilterFunc(card, row, col))   //.sort(cardSortFunc)
		}
	}
})

export default EventBus;
