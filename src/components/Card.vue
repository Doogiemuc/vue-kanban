<template>
	<b-card	:title="card.title"	class="kanban-card"	:style="computedStyle">
		<div class="card-avatar" :style="avatarBackgroundStyle">AB</div>
		<div v-html="card.description"></div>
		<div v-if="card.links.length > 0" class="clearfix">
		  <a class="kanbancard-link" v-for="link in card.links" :key="link.target" href="#">{{getLinkTarget(link.targetId)}}</a>
		</div>
		<div v-if="card.labels.length > 0" class="clearfix">
		  <span	v-for="label in	card.labels" :key="label.value"	class="card-label">{{label.displayName}}</span>
		</div>
    <a href="#"	class="card-edit-icon" @click="startEditCard"><i class="far fa-edit"></i></a>
    <pre>{{card.rank}}</pre>
	</b-card>
</template>

<script>
import EventBus from '../store/EventBus.js'

export default {
	props: {
		'initCard':	{	type:	Object,	required:	true },
	},
	data:	function() { return	{
		card: this.initCard
	}},
	computed:	{
		avatarBackgroundStyle: function()	{
			return "background-color:	#4a6785;"	 //TODO: pick	different	background for each	username
		},
		computedStyle: function()	{
			switch(this.card.status) {
			  case "Done":
			    return {	"border-left": "3px	solid	green" }
			  case "Ready":
			    return {	"border-left": "3px	solid	#00A" }
			  case "InProgress":
			    return {	"border-left": "3px	solid	#ecec10" }
			  default:
			    return {}
			}
		},
	},
	methods: {
		startEditCard() {
		  //this.$store.dispatch('startEditCard', this.card._id)
		  EventBus.$emit('start-edit-card', this.card._id)    // MUST use kebap-case for events!
		},
		getActiveClass(index)	{
			return { active: index === 0 }
		},
		getLinkTarget(targetId) {
			return this.$root.eventBus.cards[targetId] ? this.$root.eventBus.cards[targetId]._id : "<deleted>"
		},
		getDisplayName(field, value) {
			return this.$root.eventBus.getDisplayName(field, value)
		},
	},
	created() {
		this.$root.eventBus.$on('card-stored', storedCard => {
			if (storedCard._id === this.card._id) {
				this.card = storedCard
			}
		})
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

.kanbancard-link {
  float: left;
}
.kanbancard-link+.kanbancard-link::before {
  content: ", "
}

.card-label	{
	float: left;
	background:	#EEE;
	border:	1px	solid	#DDD;
	border-radius: 5px;
	padding: 0px 3px;
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

.card-edit-icon {
  position: absolute;
  bottom: 5px;
  right: 5px;
}
.kanban-card .card-edit-icon	{
	visibility:	hidden;
}
.kanban-card:hover .card-edit-icon	{
	visibility:	visible;
}

</style>

