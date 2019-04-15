<template>
	<b-modal id="edit-card-modal"	ref="edit-card-modal"	size="lg"	no-fade	scrollable no-close-on-esc no-close-on-backdrop	hide-header-close	:title="'Edit: '+card.title" dialog-class="shadow-lg">
			<div v-for="field	in editableFields" :key="field._id"	class="form-group	row">
				<div class="col-sm-2">
				  <label :for="field.key"	class="col-sm-2	col-form-label">{{field.displayName}}</label>
				</div>
				<div class="col-sm-10">
					<input v-if="field.type	===	'TextInput'" type="text" class="form-control"	:id="field.field"	:name="field.field"	v-model="card[field.key]"	:placeholder="field.placeholder" />
					<select	v-else-if="field.type	===	'SingleSelect'"	v-model="card[field.key]"	class="form-control" :id="field.field">
						<option	v-for="opt in	field.options" :key="opt.value"	:value="opt.value">{{opt.displayName}}</option>
					</select>
					<button-group	v-else-if="field.type	===	'ButtonGroup'"
						v-model="card[field.key]"
						:options="field.buttons">
					</button-group>
					<VueMultiSelect	v-else-if="field.type	===	'MultiSelect'"
						v-model="selectedTags"
						:options="field.tagOptions"
						:multiple="true"
						:taggable="false"
						placeholder="Search for tags"
						label="displayName"
						track-by="value">
					</VueMultiSelect>
					<card-links	v-else-if="field.type	===	'CardLinks'"
						:initLinks="[]"
						:linkTypes="field.linkTypes"
						:cards="[]"
						:description="field.description">
					</card-links>
					<p v-else	class="mt-2">Unknown field.type	{{field.type}}</p>
					<b-form-text v-if="field.description">{{field.description}}</b-form-text>
				</div>
			</div>
	</b-modal>
</template>


<script>

var	editableFields = [
	{
		_id: 0,
		key: "title",
		displayName: "Title",
		type:	"TextInput",
		//TODO:	validator	etc.
	},
	{
		_id: 1,
		key: "project",
		displayName: "Product",
		type:	"SingleSelect",
		placeholder: "Select Project",
		options: [
			{	displayName: "DummyProduct 1", value:	"Product1" },
			{	displayName: "DummyProduct 2", value:	"Product2" },
			{	displayName: "DummyProduct 3", value:	"Product3" },
		],
	},
	{
		_id: 2,
		key: "tags",
		displayName: "Tags",
		type:	"MultiSelect",
		description: "You	can	select multiple	tags.",
		tagOptions:	[
			{	displayName: "Tag	A",	value: "TagA"	},
			{	displayName: "Tag	B",	value: "TagB"	},
			{	displayName: "Tag	C",	value: "TagC"	},
		]
	},
	{
		_id: 3,
		key: "status",
		displayName: "Status",
		type:	"ButtonGroup",
		buttons: [
			{	displayName: "Todo", value:	"Todo" },
			{	displayName: "In Progress",	value:	"InProgress" },
			{	displayName: "Done", value:	"Done" },
		]
	},
	{
		_id: 4,
		key: "links",
		displayName: "Links",
		type:	"CardLinks",
		linkTypes: [
			{	displayName: "[Select	link type]", value:	null },
			{	displayName: "related",	value: "related" },
			{	displayName: "depends	on", value:	"dependsOn"	},
			{	displayName: "child	of", value:	"childOf"	},
		]
	},
]

import ButtonGroup from	'./editComponents/ButtonGroup.vue'
import CardLinks from	'./editComponents/CardLinks.vue'

export default {
	components:	{
		ButtonGroup: ButtonGroup,
		CardLinks: CardLinks,
		VueMultiSelect:	window.VueMultiselect.default,
	},
	data:	function() { return	{
	  card: {},
		editableFields:	editableFields,
		selectedTags:	undefined,		//TODO:	move to	child	component
	}},
	computed:	{
		avatarBackgroundStyle: function()	{
			return "background-color:	#4a6785;"
		},
	},
	created() {
	  editableFields.forEach(field => {
	   	this.$set(this.card, field.key, undefined)
	  })
	},
  mounted() {
	  this.$root.cardStore.$on('editCard', this.startEditCard)
	  this.$refs['edit-card-modal'].$on('ok', this.saveEditedCard)
	},
	methods: {
	  startEditCard(cardToEdit) {
	    // by default keep all attributes of cardToEdit
	    this.card = cardToEdit
	    // then make the editable attributes reactive
	    editableFields.forEach(field => {
	    	this.$set(this.card, field.key, cardToEdit[field.key])
	    })
	    this.$refs['edit-card-modal'].show()
	  },
	  saveEditedCard() {
	    this.$root.cardStore.saveCard(this.card)
	  }
	}
}
</script>

<style>
</style>

