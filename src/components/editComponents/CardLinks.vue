<template>
	<div>
		<a v-for="link in	card.links" :key="link.targetId" class="kanbancard-link" href="#">{{getTargetDisplayName(link.targetId)}}</a>
		<div class="clearfix"></div>
		<b-form	inline>
			<b-form-select v-model="newLinkType" :options="linkTypeOptions"	placeholder="Link	type"	size="sm"	class="mr-3">
			  <template slot="first">
          <option :value="undefined" disabled>[Link Type]</option>
        </template>
			</b-form-select>
			<b-form-select v-model="newLinkTarget" :options="linkTargetOptions" placeholder="Link taget" size="sm" class="mr-3">
  			<template slot="first">
          <option :value="undefined" disabled>[Link Target]</option>
        </template>
			</b-form-select>
			<!-- multiselect
				v-model="newLinkTarget"
				:options="cards"
				:multiple="false"
				:taggable="false"
				placeholder="Link	target"
				label="title"
				track-by="_id"
				class="cardSelector">
			</multiselect -->
			<b-button	size="sm"	variant="outline-secondary">Add	Link</b-button>
		</b-form>
	</div>
</template>

<script>
export default {
	components:	{
		//multiselect: window.VueMultiselect.default
	},
	props: {
	  card: { type: Object, required: true }
	},
	data:	function() { return	{
		newLinkType: undefined,
		newLinkTarget: undefined,
	}},
	computed:	{
		linkTypeOptions: function()	{
			return [] //this.$store.state.linkTypes.map(l	=> ({text: l.displayName,	value: l.value}))
		},
		linkTargetOptions: function() {
		  return [] // this.$store.getters.cardsArray.map(card => ({text: card.title, value: card._id}))
		},
	},
	methods: {
		addLink()	{
			console.log("CardLinks.addLink")
		},
		getTargetDisplayName(targetId) {
			return this.$root.eventBus.cards[targetId]._id
		},
	},

}
</script>

<style>
.cardSelector {
  width: auto;
}
.kanbancard-link+.kanbancard-link::before {
  content: ", "
}
</style>

