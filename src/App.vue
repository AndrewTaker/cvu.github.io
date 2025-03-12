<script setup lang="ts">
import { ref } from 'vue';
import { useDadata } from './composables/useDadata';
import DataTable from './components/DataTable.vue'

const { apiKey, data, saveApiKey, fetchData } = useDadata();
const queries = ref<string>('5104909791, 5104004224, 5104909784');
const loading = ref(false);
const counter = ref<string>('');

const fetchMultipleData = async () => {
	if (!queries.value) return;

	loading.value = true;

	const queryList = queries.value
		.split(/[\n,]/)
		.map(q => q.trim())
		.filter(q => q.length > 0);

	const allSuggestions: Suggestion[] = [];
	try {
		for (const [i, query] of queryList.entries()) {
			counter.value = `${i}/${queryList.length}`
			const response = await fetchData(query);
			if (response?.suggestions) {
				allSuggestions.push(...response.suggestions);
			}
		}
		data.value = { suggestions: allSuggestions };
	} catch (error) {
		console.error('fetchMultiple err:', error);
	} finally {
		loading.value = false;
		counter.value = '';
	}
};
</script>

<template>
	<div class="container mx-auto p-4">
		<h1 class="text-xl font-bold mb-4">DaData API Explorer</h1>

		<label class="block mb-2">API Key:</label>
		<input v-model="apiKey" @input="saveApiKey" class="border w-96 p-2 mb-4" placeholder="Enter your API key" />

		<label class="block mb-2">Query:</label>
		<textarea v-model="queries" class="border p-2 w-96 mb-4" placeholder="Enter query"></textarea>
		<br>
		<button @click="fetchMultipleData" class="bg-blue-500 text-white px-4 py-2">Fetch</button>

		<div v-if="loading" class="flex justify-center items-center h-64">
			<p>{{ counter }}</p>
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
		</div>

		<div v-else-if="data" class="container mx-auto p-4">
			<DataTable :data="data.suggestions" />
		</div>

		<p v-else>no data x(</p>
	</div>
</template>

<style>
@import "tailwindcss";
</style>
