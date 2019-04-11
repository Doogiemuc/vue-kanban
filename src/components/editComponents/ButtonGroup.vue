<template>
	<b-button-group	size="sm"	class="mt-1">
		<b-button	v-for="button	in buttons"	
			:key="button.value"	
			:pressed="currentValue === button.value"
			@click="buttonClicked">
			{{button.displayName}}
		</b-button>
	</b-button-group>	 
</template>


<script>
export default {
	props: {
		'buttons': { type: Array,	required:	true },
		'value': { type: Object	}
	},
	data:	function() { return	{
		currentValue:	this.value
	}},
	methods: {
		buttonClicked(evt) {
			console.log("buttonClicked", evt)
			this.currentValue	=	evt.target.value
			this.$emit('input',	evt.target.value)
		}
	}
}
</script>

<style>
</style>

