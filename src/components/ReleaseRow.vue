<template>
	<div>
		<div class="row">
			 <div	class="col release-title">
				 <h5><i	class="fas fa-angle-down"></i>&nbsp;{{release.displayName}}</h5>
			 </div>

		</div>
		<div class="row">
			<kanban-column
				v-for="col in	columns"
				:key="col._id"
				:row="release"
				:column="col">
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
		'release':	{	type:	Object,	required:	true },
	},
	computed: {
		columns() { return this.$root.eventBus.columns }
	}
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
