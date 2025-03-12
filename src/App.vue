<script setup lang="ts">
import { ref } from 'vue';
import { useDadata } from './composables/useDadata';
import DataTable from './components/DataTable.vue'

const { apiKey, apiSecret, data, saveApiKey, fetchData } = useDadata();
const queries = ref<string>('');

const fetchMultipleData = async () => {
	if (!queries.value) return;

	const queryList = queries.value
		.split(/[\n,]/)
		.map(q => q.trim())
		.filter(q => q.length > 0);

	const allSuggestions: Suggestion[] = [];
	for (const query of queryList) {
		const response = await fetchData(query);
		if (response?.suggestions) {
			allSuggestions.push(...response.suggestions);
		}
	}

	data.value = { suggestions: allSuggestions };
};
</script>

<template>
	<div class="container mx-auto p-4">
		<h1 class="text-xl font-bold mb-4">DaData API Explorer</h1>


		<label class="block mb-2">API Key:</label>
		<input v-model="apiKey" @input="saveApiKey" class="border w-1/2 p-2 mb-4" placeholder="Enter your API key" />

		<label class="block mb-2">Query:</label>
		<textarea v-model="queries" class="border p-2 w-1/2 mb-4" placeholder="Enter query"></textarea>
		<button @click="fetchMultipleData" class="bg-blue-500 text-white px-4 py-2">Fetch</button>

		<div v-if="data" class="container mx-auto p-4">
			<DataTable :data="data.suggestions" />
		</div>
		<p v-else>no data x(</p>
	</div>
</template>

<style>
@import "tailwindcss";
</style>
