<template>
	<div id="app">
		<router-view name="main">
		</router-view>
	</div>
</template>

<script>
import Vue from 'vue';

export default {
	name: 'app',
	data () {return {

	};},
	methods: {

	},
	mounted () {
		
	}
}
</script>

<style lang="scss">
	@import './static/css/main.scss';
	#words-book-container {
		width: 94%;
		margin: 0 auto;
	}
</style>