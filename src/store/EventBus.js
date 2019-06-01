/**
 Global event bus. Publish subcribe pattern.
 This is not a UI component.
 This EventBus publishes events that components can subscribe and listen to.

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

var cardSortFunc = function(card1, card2) {
	return card1.rank - card2.rank
}

/** The event bus is a vue component */
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
		    return this.settings
		  })
		},

		/** load one card from the PouchDB */
		loadCard(id) {
			return cardsDb.get(id).then(res => {
				this.$emit('card-loaded', res)
				return res
			})
		},

    /** store card to DB and emit 'card-stored' event */
		storeCard(card) {
			return cardsDb.put(card).then(res => {
				if (!res.ok) console.error("Cannot store card._id="+card._id, res)
				this.$set(this.cards, card._id, card)
				this.$emit('card-stored', card)
			})
		},

		/* get all cards for this row and col by using the configurable cardFilterFunc */
		getCardsForRowAndCol(row, col) {
			//console.log("getCardsForRowAndCol", row.displayName, col.displayName)
			//TODO: load cardFilterFunc from DB and eval()
			return this.cardsArray.filter(card => cardFilterFunc(card, row, col)).sort(cardSortFunc)		// filter() created a new array!
		},

		getDisplayName(field, value) {
			if (!this.settings.fieldValues[field]) throw new Error("Unknown field "+field)
			let fieldValue = this.settings.fieldValues[field].find(field => field.value === value)
			return fieldValue ? fieldValue.displayName : "<n.a.>"
		},


	}
})

export default EventBus;
