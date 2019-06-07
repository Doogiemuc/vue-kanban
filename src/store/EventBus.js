/**
 Global event bus. Publish subcribe pattern.
 This is not a UI component.
 This EventBus publishes events that components can subscribe and listen to.

 https://medium.com/@andrejsabrickis/https-medium-com-andrejsabrickis-create-simple-eventbus-to-communicate-between-vue-js-components-cdc11cd59860
 */
import Vue from 'vue';
import LinkedList from 'linked-list'

//====================================
// PouchDB in browser DB
import PouchDB from 'pouchdb-browser'
var kanbanDb
var cardsDb

/** An item of the linked list, that has a prev and next item and holds a card */
class CardItem extends LinkedList.Item {
	card = {}
	constructor(card) {
		super()
		this.card = card
	}
}

/** Linked list of cardItems */
class CardList extends LinkedList {
	appendCard(card) {
		let cardItem = new CardItem(card)
		this.append(cardItem)
	}
}


/**
 Should that card be shown in this row and column?
 @param card {Object} one cardItem that holds a card
 @param row {Object} the swimmlane, eg. a release
 @param col {Object} a column. You can for example show cards with a given status in each column.
 */
var cardFilterFunc = function(cardItem, row, col) {
	return row.value === cardItem.card.release &&
				 col.status.includes(cardItem.card.status)
}

/** The event bus is a vue component */
const EventBus = new Vue({
	data: function() { return {
		cardList: undefined,    // sorted linked list of cardItems
		cardItemsById: {},      // cardItems by _id
		settings: {},
	}},
	computed: {
		cardListAsArray() { return this.cardList.toArray() },
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

		/** 
		 Load cards from PouchDB.
		 1. Fill this.cardsById
		 2. Rebuild linkded-list of cards
		*/
		loadCards() {
			this.cardList = new CardList()
			return cardsDb.allDocs({include_docs: true}).then(res => {
				// Fill cardItemsById
				res.rows.forEach(row => {
					this.cardItemsById[row.doc.card._id] = new CardItem(row.doc.card)
				})
				// Restore all the next and prev relations
				res.rows.forEach(row => {
					var cardItem = this.cardItemsById[row.doc.card._id]
					if (row.doc.nextId) {
						cardItem.next = this.cardItemsById[row.doc.nextId]  
					} else {
						this.cardList.tail = cardItem
					}
					if (row.doc.prevId) {
						cardItem.prev = this.cardItemsById[row.doc.prevId]  
					} else {
						this.cardList.head = cardItem
					}
				})
				
				if (this.cardList.head === undefined) throw new Error("CardList has no head. Need CardItem with no prev.")
				if (this.cardList.tail === undefined) throw new Error("CardList has no tail. Need CardItem with no next.")
				
				return this.cardItemsById
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
		
		getCard(id) {
	    return this.cardItemsById[id].card
		},
		
		/** reload one card from the PouchDB */
		reloadCard(id) {
			return cardsDb.get(id).then(res => {
			  this.cardItemsById[res.doc._id].card = res.doc
				this.$emit('card-loaded', res.doc)
				return res.doc
			})
		},

		/** store card to DB and emit 'card-stored' event */
		storeCard(card) {
			return cardsDb.put(card).then(res => {
				if (!res.ok) console.error("Cannot store card._id="+card._id, res)
				this.$set(this.cardsById, card._id, card)
				this.$emit('card-stored', card)
			})
		},

		/* get all cardItems for this row and col by using the configurable cardFilterFunc */
		getCardItemsForRowAndCol(row, col) {
			//TODO: load cardFilterFunc from DB and eval()
			var cardItem = this.cardList.head
      var result = []
      while (cardItem) {
        if (cardFilterFunc(cardItem, row,col)) result.push(cardItem)
        cardItem = cardItem.next
      }
			return result  // result is already sorted 
		},

		getDisplayName(field, value) {
			if (!this.settings.fieldValues[field]) throw new Error("Unknown field "+field)
			let fieldValue = this.settings.fieldValues[field].find(field => field.value === value)
			return fieldValue ? fieldValue.displayName : "<n.a.>"
		},


	}
})

export default EventBus;
