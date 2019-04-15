<template>
  <b-form-group>
    <b-form-radio-group
      v-model="selectedButton"
      :options="buttonOptions"
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
		'options': { type: Array,	required:	true },
		value:     { type: String }
	},
	computed: {
	  buttonOptions: function() {
	    return this.options.map(opt => ({ text: opt.displayName, value: opt.value }))
	  }
	},
	data:	function() { return	{
		selectedButton: this.value,		
	}},
	watch: {
	  value: function(newValue) {
	    this.selectedButton = newValue
	  },
	  selectedButton: function() {
	    this.$emit('input',	this.selectedButton)
	  }
	},
}
</script>

<style>
</style>

