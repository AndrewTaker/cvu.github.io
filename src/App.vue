<script setup>
import { ref, onMounted } from 'vue';

const apiKey = ref(localStorage.getItem('dadata_api_key') || '');
const query = ref('');
const results = ref(null);
const endpoint = ref('suggest/address'); // Default endpoint

const saveApiKey = () => {
  localStorage.setItem('dadata_api_key', apiKey.value);
};

const fetchData = async () => {
  if (!apiKey.value) {
    alert('Please enter your API key!');
    return;
  }

  const url = `https://suggestions.dadata.ru/suggestions/api/4_1/rs/${endpoint.value}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${apiKey.value}`
    },
    body: JSON.stringify({ query: query.value })
  });

  results.value = await response.json();
};
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-xl font-bold mb-4">DaData API Explorer</h1>

    <label class="block mb-2">API Key:</label>
    <input v-model="apiKey" @input="saveApiKey" class="border p-2 w-full mb-4" placeholder="Enter your API key" />

    <label class="block mb-2">Endpoint:</label>
    <select v-model="endpoint" class="border p-2 w-full mb-4">
      <option value="suggest/address">Address Suggestion</option>
      <option value="suggest/name">Name Suggestion</option>
      <option value="suggest/email">Email Suggestion</option>
    </select>

    <label class="block mb-2">Query:</label>
    <input v-model="query" class="border p-2 w-full mb-4" placeholder="Enter query" />

    <button @click="fetchData" class="bg-blue-500 text-white px-4 py-2">Fetch</button>

    <pre v-if="results" class="mt-4 p-4">{{ results }}</pre>
  </div>
</template>

<style>
/* Optional styles */
body {
  font-family: Arial, sans-serif;
}
</style>
