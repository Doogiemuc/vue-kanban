<template>
	<div class="col	kanban-col">
		<draggable
			tag="div"
			v-model="sortedCards"
			class="draggableContainer"
			v-bind="dragOptions"
			@start="dragging = true"
			@end="dragging = false">
			<card
				v-for="card	in sortedCards"
				:card="card"
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
	data:	function() { return	{
		sortedCards: this.$root.eventBus.getCardsForRowAndCol(this.row, this.column), //    //.slice(),	// MUST	make a copy
		dragging:	false,
		dragOptions: {
			animation: 200,
			group: "cardGroup",
			disabled:	false,
			ghostClass:	"ghost",
			dragClass: "dragClass"
		},
	}},

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

