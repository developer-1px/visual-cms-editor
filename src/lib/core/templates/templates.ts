import type { Template } from './types';

export const defaultTemplates: Template[] = [
	{
		id: 'hero-minimal',
		name: 'Hero',
		description: 'Simple hero section',
		category: 'hero',
		html: `
			<section class="py-24 text-center border-b border-stone-200">
				<div class="max-w-4xl mx-auto px-8">
					<div class="inline-block px-3 py-1 bg-stone-100 text-stone-600 text-sm mb-8 font-medium">
						Beta
					</div>
					<h1 class="hero-title text-4xl md:text-6xl font-bold mb-6 text-stone-900 leading-tight">Product Name</h1>
					<p class="hero-description text-xl text-stone-600 max-w-2xl mx-auto mb-8">Brief description of what this product does</p>
					<div class="flex flex-col sm:flex-row gap-3 justify-center">
						<button class="hero-cta px-6 py-3 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors">
							Get Started
						</button>
						<button class="px-6 py-3 border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition-colors">
							Learn More
						</button>
					</div>
				</div>
			</section>
		`,
		editableElements: [
			{
				selector: '.hero-title',
				type: 'text',
				defaultValue: 'Product Name',
				constraints: { maxLength: 60 }
			},
			{
				selector: '.hero-description',
				type: 'text',
				defaultValue: 'Brief description of what this product does',
				constraints: { maxLength: 150 }
			},
			{
				selector: '.hero-cta',
				type: 'text',
				defaultValue: 'Get Started',
				constraints: { maxLength: 30 }
			}
		]
	},
	{
		id: 'hero-centered',
		name: 'Centered Hero',
		description: 'Centered hero with subtitle',
		category: 'hero',
		html: `
			<section class="py-32 text-center">
				<div class="max-w-3xl mx-auto px-8">
					<h1 class="hero-title text-5xl md:text-7xl font-bold mb-6 text-stone-900 tracking-tight">Simple. Powerful.</h1>
					<p class="hero-subtitle text-2xl text-stone-500 mb-8 font-light">Focus on what matters</p>
					<button class="hero-cta px-8 py-4 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors">
						Start Building
					</button>
				</div>
			</section>
		`,
		editableElements: [
			{
				selector: '.hero-title',
				type: 'text',
				defaultValue: 'Simple. Powerful.',
				constraints: { maxLength: 50 }
			},
			{
				selector: '.hero-subtitle',
				type: 'text',
				defaultValue: 'Focus on what matters',
				constraints: { maxLength: 100 }
			},
			{
				selector: '.hero-cta',
				type: 'text',
				defaultValue: 'Start Building',
				constraints: { maxLength: 30 }
			}
		]
	},
	{
		id: 'features-grid',
		name: 'Features',
		description: '3-column feature grid',
		category: 'features',
		html: `
			<section class="py-24 border-b border-stone-200">
				<div class="max-w-6xl mx-auto px-8">
					<div class="text-center mb-16">
						<h2 class="section-title text-3xl font-bold text-stone-900 mb-4">Features</h2>
						<p class="text-stone-600">Everything you need to get started</p>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-12">
						<div class="text-center">
							<div class="w-12 h-12 bg-stone-900 mx-auto mb-6"></div>
							<h3 class="feature-title text-xl font-semibold text-stone-900 mb-3">Fast</h3>
							<p class="feature-description text-stone-600">Built for speed and performance</p>
						</div>
						<div class="text-center">
							<div class="w-12 h-12 bg-stone-900 mx-auto mb-6"></div>
							<h3 class="feature-title text-xl font-semibold text-stone-900 mb-3">Secure</h3>
							<p class="feature-description text-stone-600">Enterprise-grade security</p>
						</div>
						<div class="text-center">
							<div class="w-12 h-12 bg-stone-900 mx-auto mb-6"></div>
							<h3 class="feature-title text-xl font-semibold text-stone-900 mb-3">Simple</h3>
							<p class="feature-description text-stone-600">Easy to use and understand</p>
						</div>
					</div>
				</div>
			</section>
		`,
		editableElements: [
			{
				selector: '.section-title',
				type: 'text',
				defaultValue: 'Features',
				constraints: { maxLength: 50 }
			},
			{
				selector: '.feature-title',
				type: 'text',
				defaultValue: 'Feature Name',
				constraints: { maxLength: 30 }
			},
			{
				selector: '.feature-description',
				type: 'text',
				defaultValue: 'Feature description',
				constraints: { maxLength: 100 }
			}
		]
	},
	{
		id: 'cta-simple',
		name: 'CTA',
		description: 'Simple call-to-action',
		category: 'cta',
		html: `
			<section class="py-24 bg-stone-900 text-white text-center">
				<div class="max-w-3xl mx-auto px-8">
					<h2 class="cta-title text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
					<p class="cta-description text-xl text-stone-300 mb-8">Join thousands of users today</p>
					<button class="cta-button px-8 py-4 bg-white text-stone-900 font-medium hover:bg-stone-100 transition-colors">
						Get Started
					</button>
				</div>
			</section>
		`,
		editableElements: [
			{
				selector: '.cta-title',
				type: 'text',
				defaultValue: 'Ready to get started?',
				constraints: { maxLength: 60 }
			},
			{
				selector: '.cta-description',
				type: 'text',
				defaultValue: 'Join thousands of users today',
				constraints: { maxLength: 100 }
			},
			{
				selector: '.cta-button',
				type: 'text',
				defaultValue: 'Get Started',
				constraints: { maxLength: 30 }
			}
		]
	},
	{
		id: 'content-two-column',
		name: 'Two Column',
		description: 'Two-column content layout',
		category: 'content',
		html: `
			<section class="py-24 border-b border-stone-200">
				<div class="max-w-6xl mx-auto px-8">
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div>
							<h2 class="content-title text-3xl font-bold text-stone-900 mb-6">Why choose us</h2>
							<p class="content-text text-stone-600 text-lg leading-relaxed mb-6">We provide the tools and infrastructure you need to build amazing products.</p>
							<ul class="space-y-3">
								<li class="list-item flex items-center text-stone-700">
									<div class="w-2 h-2 bg-stone-900 mr-3"></div>
									Built for developers
								</li>
								<li class="list-item flex items-center text-stone-700">
									<div class="w-2 h-2 bg-stone-900 mr-3"></div>
									Production ready
								</li>
								<li class="list-item flex items-center text-stone-700">
									<div class="w-2 h-2 bg-stone-900 mr-3"></div>
									24/7 support
								</li>
							</ul>
						</div>
						<div class="aspect-video bg-stone-100 border border-stone-200"></div>
					</div>
				</div>
			</section>
		`,
		editableElements: [
			{
				selector: '.content-title',
				type: 'text',
				defaultValue: 'Why choose us',
				constraints: { maxLength: 50 }
			},
			{
				selector: '.content-text',
				type: 'text',
				defaultValue: 'We provide the tools and infrastructure you need to build amazing products.',
				constraints: { maxLength: 200 }
			},
			{
				selector: '.list-item',
				type: 'text',
				defaultValue: 'List item',
				constraints: { maxLength: 50 }
			}
		]
	},
	{
		id: 'testimonial-single',
		name: 'Testimonial',
		description: 'Single testimonial',
		category: 'testimonial',
		html: `
			<section class="py-24 text-center border-b border-stone-200">
				<div class="max-w-4xl mx-auto px-8">
					<blockquote class="testimonial-quote text-2xl md:text-3xl font-light text-stone-900 mb-8 leading-relaxed">
						"This product has transformed how we work. Highly recommended."
					</blockquote>
					<div class="testimonial-author">
						<div class="author-name text-stone-900 font-semibold">John Smith</div>
						<div class="author-role text-stone-600">CEO, Company</div>
					</div>
				</div>
			</section>
		`,
		editableElements: [
			{
				selector: '.testimonial-quote',
				type: 'text',
				defaultValue: '"This product has transformed how we work. Highly recommended."',
				constraints: { maxLength: 200 }
			},
			{
				selector: '.author-name',
				type: 'text',
				defaultValue: 'John Smith',
				constraints: { maxLength: 50 }
			},
			{
				selector: '.author-role',
				type: 'text',
				defaultValue: 'CEO, Company',
				constraints: { maxLength: 50 }
			}
		]
	},
	{
		id: 'pricing-simple',
		name: 'Pricing',
		description: 'Simple pricing table',
		category: 'pricing',
		html: `
			<section class="py-24 text-center border-b border-stone-200">
				<div class="max-w-4xl mx-auto px-8">
					<h2 class="section-title text-3xl font-bold text-stone-900 mb-4">Pricing</h2>
					<p class="text-stone-600 mb-12">Simple, transparent pricing</p>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
						<div class="border border-stone-200 p-8 text-left">
							<h3 class="price-plan text-xl font-semibold text-stone-900 mb-2">Starter</h3>
							<div class="price-amount text-3xl font-bold text-stone-900 mb-4">$29</div>
							<p class="price-description text-stone-600 mb-6">Perfect for getting started</p>
							<button class="price-button w-full px-6 py-3 border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 transition-colors">
								Choose Plan
							</button>
						</div>
						<div class="border border-stone-900 p-8 text-left bg-stone-900 text-white">
							<h3 class="price-plan text-xl font-semibold mb-2">Pro</h3>
							<div class="price-amount text-3xl font-bold mb-4">$99</div>
							<p class="price-description text-stone-300 mb-6">For growing teams</p>
							<button class="price-button w-full px-6 py-3 bg-white text-stone-900 font-medium hover:bg-stone-100 transition-colors">
								Choose Plan
							</button>
						</div>
					</div>
				</div>
			</section>
		`,
		editableElements: [
			{
				selector: '.section-title',
				type: 'text',
				defaultValue: 'Pricing',
				constraints: { maxLength: 50 }
			},
			{
				selector: '.price-plan',
				type: 'text',
				defaultValue: 'Plan Name',
				constraints: { maxLength: 30 }
			},
			{
				selector: '.price-amount',
				type: 'text',
				defaultValue: '$99',
				constraints: { maxLength: 20 }
			},
			{
				selector: '.price-description',
				type: 'text',
				defaultValue: 'Plan description',
				constraints: { maxLength: 100 }
			},
			{
				selector: '.price-button',
				type: 'text',
				defaultValue: 'Choose Plan',
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