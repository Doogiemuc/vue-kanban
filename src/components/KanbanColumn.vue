<template>
	<div class="col	kanban-col">
		<draggable
			tag="div"
			v-model="sortedCards"
			class="draggableContainer"
			v-bind="dragOptions"
			@change="listChanged"
			@end="dragEnd">
			<card
				v-for="card	in sortedCards"
				:initCard="card"
				:key="card.id">
			</card>
			<div v-if="sortedCards.length	===	0" key="99999" style="height:	100px">&nbsp;</div>
		</draggable>
	</div>
</template>

<script>
import Card	from './Card.vue'
import Draggable from	'vuedraggable'

export default {
	components:	{
		draggable: Draggable,
		card:	Card,
	},
	props: {
		'column':  { type: Object, required: true	},
		'row':     { type: Object, required: true	}
	},
	/*
	computed: {
		sortedCards: {
			get: function() {
				console.log("KanbanCol.sortedCards")
				return this.$root.eventBus.cardsArray.filter(card => cardFilterFunc(card, this.row, this.column)).sort(cardSortFunc)
			},
			set: function(newlySorteCards) {

			}
		}

	},
	*/
	data:	function() { return	{
		sortedCards: this.$root.eventBus.getCardsForRowAndCol(this.row, this.column),
		dragging:	false,
		dragOptions: {
			animation: 200,
			group: "cardGroup",
			disabled:	false,
			ghostClass:	"ghost",
			dragClass: "dragClass"
		},
	}},

	methods: {
		listChanged(evt) {
			console.log("listChanged "+this.row.displayName+","+this.column.displayName, evt)
			if (evt.moved && evt.moved.newIndex !== evt.moved.oldIndex) {
				var card = evt.moved.element
				var above = this.sortedCards[evt.moved.newIndex-1].rank
				var below = this.sortedCards[evt.moved.newIndex+1].rank
				card.rank = (above-below)/2 + below
				console.log(card.title+" has new rank ", card.rank)
				//this.$root.eventBus.storeCard(card)
			}
		},

		dragEnd(var1, var2) {
			console.log("dragEnd", var1, var2)
		}
	}

}
</script>

<style>
.kanban-col	{
	background:	#E9EEF2;
	padding: 5pt;
	margin-left: 5px;
	margin-right:	5px;
}
.draggableContainer	{
	/*border:	1px	solid	green;*/
	height:	100%;	 /*	This is	a	hack.	It mackes	the	container	the	SAME height	as its parent. But there is	the	title	in the parant	column div.	So the draggableContainer	is shifted down. */
}
.ghost {
	opacity: 0.1;
	/*background:	#c8ebfb;*/
}
.dragClass {
	opacity: 1;
	background:	white;
}
</style>

