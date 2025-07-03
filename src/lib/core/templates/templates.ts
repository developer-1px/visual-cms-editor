import type { Template } from './types';

export const defaultTemplates: Template[] = [
	{
		id: 'hero-simple',
		name: '심플 히어로',
		description: '제목과 설명이 있는 간단한 히어로 섹션',
		category: 'hero',
		html: `
			<section class="hero-section py-20 text-center">
				<div class="container mx-auto px-4">
					<h1 class="hero-title text-5xl font-bold mb-6">놀라운 제품을 만나보세요</h1>
					<p class="hero-description text-xl text-gray-600 max-w-2xl mx-auto mb-8">우리의 혁신적인 솔루션으로 비즈니스를 한 단계 더 성장시키세요</p>
					<button class="hero-cta bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">지금 시작하기</button>
				</div>
			</section>
		`,
		editableElements: [
			{
				selector: '.hero-title',
				type: 'text',
				defaultValue: '놀라운 제품을 만나보세요',
				constraints: { maxLength: 60 }
			},
			{
				selector: '.hero-description',
				type: 'text',
				defaultValue: '우리의 혁신적인 솔루션으로 비즈니스를 한 단계 더 성장시키세요',
				constraints: { maxLength: 150 }
			},
			{
				selector: '.hero-cta',
				type: 'text',
				defaultValue: '지금 시작하기',
				constraints: { maxLength: 30 }
			}
		]
	},
	{
		id: 'features-grid',
		name: '기능 그리드',
		description: '3열 그리드 레이아웃의 기능 소개',
		category: 'features',
		html: `
			<section class="features-section py-16 bg-gray-50">
				<div class="container mx-auto px-4">
					<h2 class="section-title text-3xl font-bold text-center mb-12">주요 기능</h2>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div class="feature-item bg-white p-6 rounded-lg shadow-sm">
							<div class="feature-icon w-12 h-12 bg-blue-100 rounded-lg mb-4"></div>
							<h3 class="feature-title text-xl font-semibold mb-2">빠른 속도</h3>
							<p class="feature-description text-gray-600">초고속 처리로 작업 효율을 극대화합니다</p>
						</div>
						<div class="feature-item bg-white p-6 rounded-lg shadow-sm">
							<div class="feature-icon w-12 h-12 bg-green-100 rounded-lg mb-4"></div>
							<h3 class="feature-title text-xl font-semibold mb-2">안전한 보안</h3>
							<p class="feature-description text-gray-600">엔터프라이즈급 보안으로 데이터를 보호합니다</p>
						</div>
						<div class="feature-item bg-white p-6 rounded-lg shadow-sm">
							<div class="feature-icon w-12 h-12 bg-purple-100 rounded-lg mb-4"></div>
							<h3 class="feature-title text-xl font-semibold mb-2">쉬운 사용</h3>
							<p class="feature-description text-gray-600">직관적인 인터페이스로 누구나 쉽게 사용할 수 있습니다</p>
						</div>
					</div>
				</div>
			</section>
		`,
		editableElements: [
			{
				selector: '.section-title',
				type: 'text',
				defaultValue: '주요 기능',
				constraints: { maxLength: 50 }
			},
			{
				selector: '.feature-title',
				type: 'text',
				defaultValue: '기능 제목',
				constraints: { maxLength: 30 }
			},
			{
				selector: '.feature-description',
				type: 'text',
				defaultValue: '기능 설명',
				constraints: { maxLength: 100 }
			}
		]
	},
	{
		id: 'cta-centered',
		name: '중앙 정렬 CTA',
		description: '중앙에 배치된 Call-to-Action 섹션',
		category: 'cta',
		html: `
			<section class="cta-section py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
				<div class="container mx-auto px-4 text-center">
					<h2 class="cta-title text-4xl font-bold mb-4">지금 시작할 준비가 되셨나요?</h2>
					<p class="cta-description text-xl mb-8 opacity-90">14일 무료 체험으로 모든 기능을 경험해보세요</p>
					<div class="flex gap-4 justify-center">
						<button class="cta-primary bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">무료 체험 시작</button>
						<button class="cta-secondary border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">자세히 알아보기</button>
					</div>
				</div>
			</section>
		`,
		editableElements: [
			{
				selector: '.cta-title',
				type: 'text',
				defaultValue: '지금 시작할 준비가 되셨나요?',
				constraints: { maxLength: 60 }
			},
			{
				selector: '.cta-description',
				type: 'text',
				defaultValue: '14일 무료 체험으로 모든 기능을 경험해보세요',
				constraints: { maxLength: 100 }
			},
			{
				selector: '.cta-primary',
				type: 'text',
				defaultValue: '무료 체험 시작',
				constraints: { maxLength: 30 }
			},
			{
				selector: '.cta-secondary',
				type: 'text',
				defaultValue: '자세히 알아보기',
				constraints: { maxLength: 30 }
			}
		]
	}
];

export function getTemplateById(id: string): Template | undefined {
	return defaultTemplates.find(template => template.id === id);
}

export function getTemplatesByCategory(category: Template['category']): Template[] {
	return defaultTemplates.filter(template => template.category === category);
}