<template>
	<b-modal id="edit-card-modal"	ref="edit-card-modal"	size="lg"	no-fade	scrollable no-close-on-esc no-close-on-backdrop	hide-header-close	:title="'Edit: '+card.title" dialog-class="shadow-lg">
		<div v-for="field	in editableFields" :key="field._id"	class="form-group	row">
			<div class="col-sm-2">
			  <label :for="field.key"	class="col-sm-2	col-form-label">{{field.displayName}}</label>
			</div>
			<div class="col-sm-10">
				<input v-if="field.type	===	'TextInput'" type="text" class="form-control"	:id="field.field"	:name="field.field"	v-model="card[field.key]"	:placeholder="field.placeholder" />
				<select	v-else-if="field.type	===	'SingleSelect'"	v-model="card[field.key]"	class="form-control">
					<option	v-for="opt in	field.options" :key="opt.value"	:value="opt.value">{{opt.displayName}}</option>
				</select>
				<!--button-group	v-else-if="field.type	===	'ButtonGroup'"
					v-model="card[field.key]"
					:options="field.buttons">
				</button-group -->

				<b-form-group v-else-if="field.type === 'ButtonGroup'">
			    <b-form-radio-group
			      v-model="card['status']"
			      :options="field.buttons"
			      buttons
			      button-variant="outline-secondary"
			      size="sm"
			      name="radio-btn-outline"
			    ></b-form-radio-group>
			  </b-form-group>

				<multiselect	v-else-if="field.type	===	'MultiSelect'"
					v-model="card[field.key]"
					:options="field.labels"
					:option-height="10"
					:multiple="true"
					:taggable="false"
					:showLabels="false"
					placeholder="Search for labels"
					label="displayName"
					track-by="value">
				</multiselect>
				<card-links	v-else-if="field.type	===	'CardLinks'"
				  :card="card"
					:description="field.description">
				</card-links>
				<p v-else	class="mt-2">Unknown field.type	{{field.type}}</p>
				<b-form-text v-if="field.description">{{field.description}}</b-form-text>
			</div>
		</div>

		<pre>{{card['status']}}</pre>

		<template slot="modal-footer" slot-scope="{ ok, cancel }">
      <b-button variant="success" @click="ok()">
        OKKK
      </b-button>
      <b-button variant="scondary" @click="cancel()">
        CancelLLL
      </b-button>
    </template>
	</b-modal>
</template>


<script>
import EventBus from '../store/EventBus.js'
//import ButtonGroup from	'./editComponents/ButtonGroup.vue'
import CardLinks from	'./editComponents/CardLinks.vue'
import Multiselect from 'vue-multiselect'

export default {
	components:	{
		//ButtonGroup: ButtonGroup,
		CardLinks: CardLinks,
		Multiselect: Multiselect
	},
	data:	function() { return	{
	  card: {},
	}},
	computed:	{
		editableFields() { return this.$root.eventBus.editableFields },
		avatarBackgroundStyle: function()	{
			return "background-color:	#4a6785;"
		},
	},
	created() {
	},
  mounted() {
    EventBus.$on('start-edit-card', this.startEditCard)  // param 'cardId' is passed here
	  this.$refs['edit-card-modal'].$on('ok', this.saveEditedCard)
	},
	methods: {
	  startEditCard(cardId) {
	    this.card = this.$root.eventBus.cards[cardId]  //TODO: make a deep copy of this card  => user may press cancel
	    if (!this.card) { console.log("WARN: cannot find card._id="+cardId+" to edit!"); return }
	    console.log("Edit card", this.card)
	    this.$refs['edit-card-modal'].show()
	  },
	  saveEditedCard() {
	    this.$store.commit('setCard', this.card)
	  }
	}
}
</script>

<style>
.multiselect {
  z-index: 1060;
}
.multiselect__placeholder {
  padding: 0;
  margin: 0;
}
.multiselect__content-wrapper {
  width: calc(100% - 10px);
  margin-left: 5px;
  border-color: #007bff;
}
.multiselect--active:not(.multiselect--above) .multiselect__tags {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  border-radius: 5px;
}
.multiselect__option {
  padding: 0 5px;
  min-height: inherit;
  line-height: inherit;
}
.multiselect__option--highlight {
  background: #007bff;
}
.multiselect__tag {
  background: #007bff;
}
</style>

