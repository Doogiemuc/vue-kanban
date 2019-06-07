<template>
	<div class="col	kanban-col">
		<draggable
			tag="div"
			v-model="cardItemsForRowAndCol"
			class="draggableContainer"
			v-bind="dragOptions"
			@change="listChanged"
			@end="dragEnd">
			<card
				v-for="card	in cardList"
				:initCard="card"
				:key="card._id">
			</card>
			<div v-if="cardList.length	===	0" key="99999" style="height:	100px">&nbsp;</div>
		</draggable>
	</div>
</template>

<script>
import Card	from './Card.vue'
import Draggable from	'vuedraggable'

//BUGFIX: cards must have a :key above. Otherwise vuedraggable doesn't work!!!

export default {
	components:	{
		draggable: Draggable,
		card:	Card,
	},
	
	props: {
		'column':  { type: Object, required: true	},
		'row':     { type: Object, required: true	}
	},
	
	data:	function() { return	{
		cardItemsForRowAndCol: this.$root.eventBus.getCardItemsForRowAndCol(this.row, this.column),
		dragging:	false,
		dragOptions: {
			animation: 200,
			group: "cardGroup",
			disabled:	false,
			ghostClass:	"ghost",
			dragClass: "dragClass"
		},
	}},
	
	computed: {
	  cardList: function() { return this.cardItemsForRowAndCol.map(cardItem => cardItem.card) }
	},
		
	watch: {
	  sortedCards: function(newValue) {
	    console.log("sortedCards changed to", newValue)
	  }
	},

	methods: {
		listChanged(evt) {
			console.log("listChanged "+this.row.displayName+","+this.column.displayName, evt)
			if (evt.moved && evt.moved.newIndex !== evt.moved.oldIndex) {
			  /*
			  // evt.moved.element === CardItem
			  
			  if (evt.moved.newIndex === this.sortedCards.length) {
			    // IF card was sored to the bottom end of the list, then insert it just right below the element above it.
			    var prevCardItem = this.sortedCards[evt.moved.newIndex-1]
			    prevCardItem.append(evt.moved.element)
			  } else {
			    // OTHERWISE prepend the card to the element right below it.
			    var nextCardItem = this.sortedCards[evt.moved.newIndex+1]
			    nextCardItem.prepend(evt.moved.element)
			  }
			  
				//this.$root.eventBus.storeCard(card)
				
				*/
			}

		},
    
    /*
		dragEnd(elem) {
			//This recevies the dragged HTML element
		}
		*/
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

