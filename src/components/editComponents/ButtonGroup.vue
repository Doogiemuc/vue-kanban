<template>
  <b-form-group>
    <b-form-radio-group
      v-model="selectedButton"
      :options="options"
      buttons
      button-variant="outline-secondary"
      size="sm"
      name="radio-btn-outline"
    ></b-form-radio-group>
  </b-form-group>
</template>

<script>
/**
 Thin wrapper component for a bootstrap form group <b-form-group>
 This wrapper just simply styles a button group and
 it proxies the v-model value upwards and downwards.
 */
export default {
	props: {
		'options': { type: Array,	required:	true },    // { text: "Button 1 Text", value: "radio1" }
		'value':   { type: String, required: false }
	},
	data:	function() {
		console.log("ButtonGroup this.value", this.value)
		return	{
		selectedButton: this.value,
	}},
	watch: {
		/*
	  value: function(newValue) {
	    this.selectedButton = newValue
	  },
	  selectedButton: function() {
	    this.$emit('input',	this.selectedButton)
	  }
	  */
	},
	mounted() {
		console.log("ButtonGroup", this.options, this.value)
	}
}
</script>

<style>
</style>

