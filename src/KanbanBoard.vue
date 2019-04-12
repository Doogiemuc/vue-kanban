<template>
	<div class="container-fluid">
		<h1>Kanban Board</h1>
		<div class="row">
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
	props: {
		kanbanData:	{	type:	Array, required: true	},
		columns:		{	type:	Array, required: true	},
	},
	data:	function() { return	{
		currentlyEditedCard: {}
	}},
	computed:	{
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
.kanban-col-title	{
  background: #E9EEF2;
  border-radius: 5px;
  margin-left: 5px;
  margin-right: 5px;
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

