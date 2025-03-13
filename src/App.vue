<script setup lang="ts">
import { ref } from 'vue';
import DataTable from './components/DataTable.vue';
import type { Suggestion } from './composables/useDadata';
import { useDadata } from './composables/useDadata';

const { apiKey, data, saveApiKey, fetchData } = useDadata();
const queries = ref<string>('');
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
	<div class="max-w-screen mx-auto p-6 space-y-6">
		<h1 class="text-2xl font-bold text-center text-gray-800">DaData API Explorer</h1>

		<p class="mx-auto w-96 text-center">Работает только по <a href="https://dadata.ru/api/find-party/"
				class="text-blue-600 underline dark:text-blue-500 hover:no-underline">этому</a>
			эндпоинту.
			Ключ
			можно
			взять в личном
			кабинете. Ограничение по запросам - 10000 в день. Чтобы проверить текущий остаток по запросам можно
			воспользоваться <a href="https://dadata.ru/api/stat/"
				class="text-blue-600 underline dark:text-blue-500 hover:no-underline">этим </a>эндпоинтом. Сейчас не
			реализован весь вывод
			данных, только самые важные. ПРы приветствуются. <a href="https://github.com/AndrewTaker/cvu.github.io"
				class="text-blue-600 underline dark:text-blue-500 hover:no-underline">Репозиторий</a>.</p>
		<div class="w-96 mx-auto bg-white shadow-sm rounded-lg border p-4">
			<section class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-600 mb-1">API ключ:</label>
					<input v-model="apiKey" @input="saveApiKey"
						class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
						placeholder="API ключ из личного кабинета dadata.ru" />
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-600 mb-1">Список ИНН:</label>
					<textarea v-model="queries"
						class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
						placeholder="Можно ввести через запятую или каждый новый ИНН с новой строки"
						rows="3"></textarea>
				</div>

				<button @click="fetchMultipleData"
					class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
					Отправить запрос
				</button>
			</section>
		</div>

		<div v-if="loading" class="flex flex-col items-center justify-center h-40 space-y-4">
			<p class="text-gray-500">{{ counter }}</p>
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
		</div>

		<div v-else-if="data" class="bg-white shadow-sm rounded-lg border p-4 mx-auto w-full">
			<DataTable :data="data.suggestions" />
		</div>

		<p v-else class="text-center text-gray-400">Пока нет данных</p>
	</div>
</template>

<style>
@import "tailwindcss";
</style>
