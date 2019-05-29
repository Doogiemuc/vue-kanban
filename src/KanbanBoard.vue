<template>
	<div class="container-fluid">
		<div class="row top-row">
			<div class="col	kanban-col-title"	v-for="col in	columns" :key="col._id">
				<div class="float-right	kanban-col-handle"><i	class="fas fa-ellipsis-v"></i></div>
				<h3>{{col.displayName}}</h3>
			</div>
		</div>
		<div class="row" v-if="releases.length === 0"><div class="col">KanbanBoard: No releases	to show.</div></div>

		<release-row
			v-for="rel in	releases"
			:key="rel._id"
			:release="rel">
		</release-row>

		<edit-card ref="editCardModal"></edit-card>
	</div>
</template>

<script>
import ReleaseRow	from './components/ReleaseRow.vue'
import EditCard	from './components/EditCard.vue'

export default {
	components:	{
		ReleaseRow:	ReleaseRow,
		EditCard:	EditCard,
	},
	computed:	{
	  columns() {
	    return this.$root.eventBus.columns
	  },
	  releases() {
	    return this.$root.eventBus.releases
	  },
	  /*
	  kanbanData() {
	    console.log("releases", this.releases)
	    return this.releases.map(rel => ({
        '_id': rel._id,
        'title': rel.title,
        'columns': this.columns.map(col => ({
          '_id':   col._id,
          'cards': this.$store.getters.getCardsForRowAndCol(rel, col)
        }))
      }))
	  },
	  */
	},
	mounted()	{
		//console.log("KanbanBoard.releases",	this.release)
		//console.log("KanbanBoard.columns", this.columns)
		//this.globalStore.$on('editCard', this.editCard())
	},
}
</script>

<style>
.top-row {
  margin-top: 5px;
}
.kanban-col-title	{
  background: #ced2d6;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin-left: 5px;
  margin-right: 5px;
  text-align: center;
}
.kanban-col-title h3 {
  margin-bottom: 3px;
}
.kanban-col-handle {
	color: #666;
	visibility:	hidden;
	padding-top: 5px;
	padding-right: 10px;
}
.kanban-col:hover	.kanban-col-handle {
	visibility:	visible;
}

</style>

