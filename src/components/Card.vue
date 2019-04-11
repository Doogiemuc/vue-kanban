<template>
	<b-card	:title="card.title"	class="kanban-card"	:style="computedStyle">
		<div class="card-avatar" :style="avatarBackgroundStyle">AB</div>
		<div v-html="card.description"></div>
		<span	v-for="label in	card.labels" :key="label"	class="card-label">{{label}}</span>
		<!-- b-button	href="#" variant="primary">Primary</b-button -->
		<a href="#"	class="float-right"	@click="editCard"><i class="far	fa-edit"></i></a>
	</b-card>	
</template>

<script>
export default {
	props: {
		'card':	{	type:	Object,	required:	true },
	},
	data:	function() { return	{} },
	computed:	{
		avatarBackgroundStyle: function()	{
			return "background-color:	#4a6785;"	 //TODO: pick	different	background for each	username
		},
		computedStyle: function()	{
			return this.card.status	===	"Done" 
				?	{	"border-left": "3px	solid	green" }
				:	{	}
		},		
	},
	methods: {
		editCard() {
			console.log("edit	card", this.card)	// this.$root.$children[2].$refs['edit-card-modal'])
			this.$root.EventBus.$emit('editCard',	this.card);
		},
		getActiveClass(index)	{
			return { active: index === 0 }
		}
	}
}
</script>

<style>
.kanban-card {
	cursor:	default;
	margin-bottom: 10px;
	border-radius: 10px;
	/*box-shadow:	0	4px	8px	0	rgba(0,	0, 0,	0.1),	0	6px	20px 0 rgba(0, 0,	0, 0.05);*/
}
.card-title	{
	cursor:	grab;
	/*border-bottom: 1px solid #EEE;*/
}
.card-body {
	padding: 0.5rem;
	position:	relative;
}
.card-label	{
	float: left;
	background:	#EEE;
	border:	1px	solid	#DDD;
	border-radius: 5px;
	padding-left:	3px;
	padding-right: 3px;
	line-height: 1.2;
	margin-top:	5px;
	margin-right:	3px;
}
.card-avatar {
	position:	absolute;
	top: 5px;
	right: 5px;
	color: white;
	font-family: Arial;
	border-radius: 5px;
	font-size: 18px;
	line-height: 32px;
	width: 32px;
	height:	32px;
	text-align:	center;
	text-transform:	uppercase;
	vertical-align:	middle;
}

.kanban-card .fa-edit	{
	visibility:	hidden;
}

.kanban-card:hover .fa-edit	{
	visibility:	visible;
}

</style>

