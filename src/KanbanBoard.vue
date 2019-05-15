<template>
	<div class="container-fluid">
		<div class="row top-row">
			<div class="col	kanban-col-title"	v-for="col in	columns" :key="col._id">
				<div class="float-right	kanban-col-handle"><i	class="fas fa-ellipsis-v"></i></div>
				<h3>{{col.title}}</h3>
			</div>
		</div>
		<div class="row" v-if="noReleases"><div	class="col">No releases	to show.</div></div>
		
		<release-row
			v-for="rel in	kanbanData"
			:key="rel._id"
			:releaseTitle="rel.title"
			:columns="rel.columns">
		</release-row>		
		
		<edit-card ref="editCardModal" v-model="currentlyEditedCard"></edit-card>
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
	/*
	props: {
		kanbanData:	{	type:	Array, required: true	},
		columns:		{	type:	Array, required: true	},
	},
	*/
	data:	function() { return	{
		currentlyEditedCard: {}
	}},
	computed:	{
	  columns() {
	    return this.$store.state.columns
	  },
	  releases() {
	    return this.$store.state.releases
	  },
	  kanbanData() { 
	    //console.log(this.$store)
	    return this.releases.map(rel => ({
        '_id': rel._id,
        'title': rel.title,
        'columns': this.columns.map(col => ({
          '_id':   col._id,
          'cards': this.$store.getters.getCardsForRowAndCol(rel, col)
        }))
      }))
	  },
		noReleases() { 
			return this.kanbanData.length	===	0
		}
	},
	mounted()	{
		//console.log("KanbanBoard.releases",	this.release)
		//console.log("KanbanBoard.columns", this.columns)
		//this.globalStore.$on('editCard', this.editCard())
	},
	methods: {


	}
		
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

