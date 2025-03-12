<script setup lang="ts">
import { ref, computed } from 'vue';
import type Suggestion from 'composable/useDadata';
const props = defineProps({
	data: {
		type: Array as () => Suggestion[],
		required: true,
	},
});

const availableTags = [
	{ tag: 'полное наименование', label: 'data.name.full_with_opf' },
	{ tag: 'краткое наименование', label: 'data.name.short_with_opf' },
	{ tag: 'окато', label: 'data.okato' },
	{ tag: 'октмо', label: 'data.oktmo' },
	{ tag: 'окпо', label: 'data.okpo' },
	{ tag: 'окогу', label: 'data.okogu' },
	{ tag: 'окфс', label: 'data.okfs' },
	{ tag: 'оквэд', label: 'data.okved' },
	{ tag: 'количество филиалов', label: 'data.branch_count' },
	{ tag: 'тип подразделения', label: 'data.branch_type' },
	{ tag: 'инн', label: 'data.inn' },
	{ tag: 'кпп', label: 'data.kpp' },
	{ tag: 'адрес', label: 'data.address.unrestricted_value' },
];

const selectedTags = ref<string[]>(['полное наименование', 'инн']);

const selectedColumns = computed(() =>
	availableTags
		.filter(tag => selectedTags.value.includes(tag.tag))
		.map(tag => tag.label)
);

const toggleTag = (tag: string) => {
	selectedTags.value.includes(tag)
		? selectedTags.value.splice(selectedTags.value.indexOf(tag), 1)
		: selectedTags.value.push(tag);
};


const getColumnValue = (row, column) => {
	return column.split('.').reduce((acc, key) => acc?.[key] ?? '', row);
};

const getTagLabel = (columnPath: string) => {
	const tag = availableTags.find(tag => tag.label === columnPath);
	return tag ? tag.tag : columnPath;
};
const escapeCsvValue = (value: string) => {
	if (typeof value !== 'string') value = String(value);
	return `"${value.replace(/"/g, '""')}"`;
};

const csvContent = computed(() => {
	const header = selectedColumns.value.map(escapeCsvValue).join(',');
	const rows = props.data.map(row =>
		selectedColumns.value
			.map(column => escapeCsvValue(getColumnValue(row, column)))
			.join(',')
	);
	return `data:text/csv;charset=utf-8,${header}\n${rows.join('\n')}`;
});

const downloadCSV = () => {
	const encodedUri = encodeURI(csvContent.value);
	const link = document.createElement('a');
	link.setAttribute('href', encodedUri);
	link.setAttribute('download', 'data.csv');
	link.click();
};
</script>

<template>
	<div class="container mx-3 p-4">

		<div class="flex justify-between mb-4">
			<div class="space-x-2 border">
				<span v-for="tag in availableTags" :key="tag"
					class="bg-gray-200 px-2 py-1 rounded-full text-sm hover:bg-sky-700" :class="{
						'bg-gray-200': !selectedTags.includes(tag.tag),
						'bg-sky-700': selectedTags.includes(tag.tag)
					}">
					<button @click="toggleTag(tag.tag)" class="text-red-500 ml-1">{{ tag.tag }}</button>
				</span>
			</div>

			<div class="mb-4">
				<button @click="downloadCSV" class="px-4 py-2 bg-blue-500 text-white rounded-md right">
					Download CSV
				</button>
			</div>
		</div>

		<table class="min-w-full border-collapse table-auto">
			<thead class="sticky top-0">
				<tr>
					<th v-for="column, index in selectedColumns" :key="index" class="border p-2">
						{{ getTagLabel(column) }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr class="hover:bg-sky-700 transition" v-for="(row, rowIndex) in props.data" :key="rowIndex">
					<td v-for="column in selectedColumns" :key="column" class="border p-2">
						{{ getColumnValue(row, column) }}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
