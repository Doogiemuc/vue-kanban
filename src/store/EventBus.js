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
var kanbanDb
var cardsDb

/**
 Should that card be shown in this row and column?
 @param card {Object} one card
 @param row {Object} the swimmlane, eg. a release
 @param col {Object} a column. You can for example show cards with a given status in each column.
 */
var cardFilterFunc = function(card, row, col) {
	return row.value === card.release &&
	       col.status.includes(card.status)
}


const EventBus = new Vue({
	data: function() { return {
		cards: {},			// cards by _Id
		settings: {},
	}},
	computed: {
		cardsArray() { return Object.values(this.cards) },
		columns()  { return this.settings.columns },
		releases() { return this.settings.fieldValues.releases },
		editableFields() { return this.settings.editableFields },
	},
	methods: {
		init() {
			kanbanDb = new PouchDB('kanban_board');
			cardsDb  = new PouchDB('kanban_cards');
			return Promise.all([this.loadCards(), this.loadKanbanData()])
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
		loadKanbanData() {
			return kanbanDb.allDocs({include_docs: true}).then(res => {
		    res.rows.forEach(row => {
		    	this.$set(this.settings, row.id, row.doc[row.id])
		    })
		    console.log(this.settings)
		    return this.settings
		  })
		},
		/* get all cards for this row and col by using the configurable cardFilterFunc */
		getCardsForRowAndCol(row, col) {
			//TODO: load cardFilterFunc from DB and eval()
			return this.cardsArray.filter(card => cardFilterFunc(card, row, col))   //.sort(cardSortFunc)
		},

		getDisplayName(field, value) {
			if (!this.settings.fieldValues[field]) throw new Error("Unknown field "+field)
			let fieldValue = this.settings.fieldValues[field].find(field => field.value === value)
			return fieldValue ? fieldValue.displayName : "<n.a.>"
		},


	}
})

export default EventBus;
