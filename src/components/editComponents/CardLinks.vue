<template>
	<div>
		<a v-for="link in	links" :key="link.targetCard._id"	href="#">{{link.targetCard.title}}</a>
		<b-form	inline>
			<b-form-select v-model="newLinkType" :options="linkTypes"	placeholder="Link	type"	size="sm"	class="mr-3"></b-form-select>
			<multiselect 
				v-model="newLinkTarget"
				:options="cards"
				:multiple="false"
				:taggable="false"
				placeholder="Link	target"
				label="title"
				track-by="key">
			</multiselect>		
			<!-- b-form-input	v-model="linkTarget" placeholder="Link Target" size="sm" class="mr-3"></b-form-input -->
			<b-button	size="sm"	variant="outline-secondary">Add	Link</b-button>
		</b-form>
	</div>
</template>

<script>

export default {
	components:	{
		multiselect: window.VueMultiselect.default
	},
	props: {
		initLinks: { type: Array,	required:	true },
		linkTypes: { type: Array,	required:	true },
		cards:		 { type: Array,	required:	true },
	},
	data:	function() { return	{
		links: this.initLinks,
		newLinkType: null,
		newLinkTarget: undefined,
	}},
	computed:	{
		selectOptions: function()	{
			return this.linkTypes.map(l	=> ({text: l.displayName,	value: l.value}))
		}
	},
	methods: {
		addLink()	{
			console.log("CardLinks.addLink")
		}
	}
	
}
</script>

<style>
</style>

