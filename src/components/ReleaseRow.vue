<template>
	<div>
		<div class="row">
			 <div	class="col release-title">
				 <h5><i	class="fas fa-angle-down"></i>&nbsp;{{releaseTitle}}</h5>
			 </div>	 
		</div>
		<div class="row">
			<kanban-column
				v-for="col in	columns"
				:key="col._id"
				:cards="col.cards">
			</kanban-column>
		</div>
	</div>
</template>

<script>
import KanbanColumn	from './KanbanColumn.vue'

export default {
	components:	{
		KanbanColumn:	KanbanColumn
	},
	props: {
		'releaseTitle':	{	type:	String,	required:	true },
		'columns':			{	type:	Array,	required:	true,	validator: function(cols)	{
			return cols[0].cards !== undefined;
		}	}
	},
}
</script>

<style>
.release-title {
	color: #666;
	background-color:	white;
	/*border-top:	1px	dashed #999;*/
	margin-top:	5px;
	margin-bottom: 5px;
}
.release-title h5	{
	margin-bottom: 0;
	padding-bottom:	0;
}
</style>
