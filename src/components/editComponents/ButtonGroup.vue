<template>
  <b-form-group>
    <b-form-radio-group
      v-model="selected"
      :options="buttonOptions"
      buttons
      button-variant="outline-secondary"
      size="sm"
      name="radio-btn-outline"
    ></b-form-radio-group>
  </b-form-group>
</template>

<script>
export default {
	props: {
		'options': { type: Array,	required:	true },
		'initialValue': { type: Object, required: false }
	},
	computed: {
	  buttonOptions: function() {
	    return this.options.map(opt => ({ text: opt.displayName, value: opt.value }))
	  }
	},
	data:	function() { return	{
		selected: this.initialValue,
	}},
	methods: {
		buttonClicked(evt) {
			console.log("buttonClicked", evt)
			this.$emit('input',	evt.target.value)
		}
	}
}
</script>

<style>
</style>

