import type { Post, Category, PaginatedData } from '$lib/types';

export const mockCategories: Category[] = [
	{ id: 1, name: { id: 'Cerpen', en: 'Short Story', ja: '短編小説' } },
	{ id: 2, name: { id: 'Opini', en: 'Opinion', ja: '意見' } },
	{ id: 3, name: { id: 'Teknologi', en: 'Technology', ja: '技術' } },
	{ id: 4, name: { id: 'Tutorial', en: 'Tutorial', ja: 'チュートリアル' } },
	{ id: 5, name: { id: 'Personal', en: 'Personal', ja: '個人' } },
	{ id: 6, name: { id: 'Sastra', en: 'Literature', ja: '文学' } }
];

export const mockPosts: Post[] = [
	{
		id: '01',
		chapter: { id: 'Bab 1', en: 'Chapter 1', ja: '第1章' },
		title: { id: "Penemuan Sang Arsiparis", en: "The Archivist's Discovery", ja: '文書管理者の発見' },
		category: 'Cerpen',
		date: '2025-06-01',
		youtubeId: 'dQw4w9WgXcQ',
		contentBlocks: [
			{
				id: 'block-1',
				type: 'paragraph',
				value: {
					id: 'Gedung Arsip Nasional berdiri di tepi Lapangan Banteng seperti pengakuan kolonial...',
					en: 'The National Archives building sat at the edge of Lapangan Banteng like a colonial confession...',
					ja: '国立公文書館の建物はラパンガン・バンテンの端に建っていた...'
				}
			},
			{
				id: 'block-2',
				type: 'code',
				value: { id: 'npm install daisyui', en: 'npm install daisyui', ja: 'npm install daisyui' }
			}
		]
	},
	{
		id: '02',
		chapter: { id: 'Bab 2', en: 'Chapter 2', ja: '第2章' },
		title: { id: 'Nama Sang Kartografer', en: "The Cartographer's Name", ja: '地図製作者の名前' },
		category: 'Cerpen',
		date: '2025-06-08',
		contentBlocks: [
			{
				id: 'block-3',
				type: 'paragraph',
				value: {
					id: 'Surat-surat itu ada di Kotak 7 Kabinet 14-B...',
					en: 'The letters were in Box 7 of Cabinet 14-B...',
					ja: '手紙はキャビネット14-Bの7番ボックスにあった...'
				}
			}
		]
	},
	{
		id: '03',
		chapter: { id: 'Bab 3', en: 'Chapter 3', ja: '第3章' },
		title: { id: 'Mercusuar Sunyi', en: 'The Silent Lighthouse', ja: '静かな灯台' },
		category: 'Cerpen',
		date: '2025-06-15',
		contentBlocks: []
	},
	{
		id: '04',
		chapter: { id: 'Bab 4', en: 'Chapter 4', ja: '第4章' },
		title: { id: 'Surat dari Timur', en: 'Letters from the East', ja: '東からの手紙' },
		category: 'Cerpen',
		date: '2025-06-22',
		contentBlocks: []
	},
	{
		id: '05',
		chapter: { id: 'Bab 5', en: 'Chapter 5', ja: '第5章' },
		title: { id: 'Penjaga Terakhir', en: 'The Last Keeper', ja: '最後の番人' },
		category: 'Cerpen',
		date: '2025-06-29',
		contentBlocks: []
	}
];

export const mockNovels = [
	'Bayangan di Tepi Sungai',
	'Pelita Senja'
];

export const mockUser = {
	id: 'user-1',
	name: 'Rifki Saifullah',
	email: 'admin@example.com',
	avatarUrl: ''
};

export const MOCK_PASSWORD = 'password123';
