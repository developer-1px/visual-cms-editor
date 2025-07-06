import type { Template } from "./types"

export const defaultTemplates: Template[] = [
  {
    id: "hero-minimal",
    name: "Hero",
    description: "Simple hero section",
    category: "hero",
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
        selector: ".hero-title",
        type: "text",
        defaultValue: "Product Name",
        constraints: { maxLength: 60 },
      },
      {
        selector: ".hero-description",
        type: "text",
        defaultValue: "Brief description of what this product does",
        constraints: { maxLength: 150 },
      },
      {
        selector: ".hero-cta",
        type: "text",
        defaultValue: "Get Started",
        constraints: { maxLength: 30 },
      },
    ],
  },
  {
    id: "hero-centered",
    name: "Centered Hero",
    description: "Centered hero with subtitle",
    category: "hero",
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
        selector: ".hero-title",
        type: "text",
        defaultValue: "Simple. Powerful.",
        constraints: { maxLength: 50 },
      },
      {
        selector: ".hero-subtitle",
        type: "text",
        defaultValue: "Focus on what matters",
        constraints: { maxLength: 100 },
      },
      {
        selector: ".hero-cta",
        type: "text",
        defaultValue: "Start Building",
        constraints: { maxLength: 30 },
      },
    ],
  },
  {
    id: "features-grid",
    name: "Features",
    description: "3-column feature grid",
    category: "features",
    html: `
			<section class="py-24 border-b border-stone-200">
				<div class="max-w-6xl mx-auto px-8">
					<div class="text-center mb-16">
						<h2 class="section-title text-3xl font-bold text-stone-900 mb-4">Features</h2>
						<p class="text-stone-600">Everything you need to get started</p>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-12">
						<div class="text-center" data-repeatable="feature">
							<div class="w-12 h-12 mx-auto mb-6 text-stone-700" data-editable="icon">
								<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
								</svg>
							</div>
							<h3 class="feature-title text-xl font-semibold text-stone-900 mb-3" data-editable="text">Fast</h3>
							<p class="feature-description text-stone-600 mb-4" data-editable="text">Built for speed and performance</p>
							<a href="#" class="feature-link inline-flex items-center text-blue-600 hover:text-blue-700 font-medium" data-editable="text">
								자세히 보기
								<svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
								</svg>
							</a>
						</div>
						<div class="text-center" data-repeatable="feature">
							<div class="w-12 h-12 mx-auto mb-6 text-stone-700" data-editable="icon">
								<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
								</svg>
							</div>
							<h3 class="feature-title text-xl font-semibold text-stone-900 mb-3" data-editable="text">Secure</h3>
							<p class="feature-description text-stone-600 mb-4" data-editable="text">Enterprise-grade security</p>
							<a href="#" class="feature-link inline-flex items-center text-blue-600 hover:text-blue-700 font-medium" data-editable="text">
								자세히 보기
								<svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
								</svg>
							</a>
						</div>
						<div class="text-center" data-repeatable="feature">
							<div class="w-12 h-12 mx-auto mb-6 text-stone-700" data-editable="icon">
								<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
								</svg>
							</div>
							<h3 class="feature-title text-xl font-semibold text-stone-900 mb-3" data-editable="text">Simple</h3>
							<p class="feature-description text-stone-600 mb-4" data-editable="text">Easy to use and understand</p>
							<a href="#" class="feature-link inline-flex items-center text-blue-600 hover:text-blue-700 font-medium" data-editable="text">
								자세히 보기
								<svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
								</svg>
							</a>
						</div>
					</div>
				</div>
			</section>
		`,
    editableElements: [
      {
        selector: ".section-title",
        type: "text",
        defaultValue: "Features",
        constraints: { maxLength: 50 },
      },
      {
        selector: ".feature-title",
        type: "text",
        defaultValue: "Feature Title",
        constraints: { maxLength: 30 },
      },
      {
        selector: ".feature-description",
        type: "text",
        defaultValue: "Feature description",
        constraints: { maxLength: 100 },
      },
      {
        selector: '[data-editable="icon"]',
        type: "icon",
        defaultValue: "default-icon",
        constraints: {
          allowedIcons: ["lightning", "lock", "heart", "star", "check", "arrow-right"],
        },
      },
      {
        selector: '.feature-link span[data-editable="text"]',
        type: "text",
        defaultValue: "자세히 보기",
        constraints: { maxLength: 30 },
      },
      {
        selector: ".feature-link",
        type: "link",
        defaultValue: "#",
        constraints: {
          allowedProtocols: ["http", "https", "mailto", "tel"],
        },
      },
    ],
  },
  {
    id: "cta-simple",
    name: "CTA",
    description: "Simple call-to-action",
    category: "cta",
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
        selector: ".cta-title",
        type: "text",
        defaultValue: "Ready to get started?",
        constraints: { maxLength: 60 },
      },
      {
        selector: ".cta-description",
        type: "text",
        defaultValue: "Join thousands of users today",
        constraints: { maxLength: 100 },
      },
      {
        selector: ".cta-button",
        type: "text",
        defaultValue: "Get Started",
        constraints: { maxLength: 30 },
      },
    ],
  },
  {
    id: "content-two-column",
    name: "Two Column",
    description: "Two-column content layout",
    category: "content",
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
						<div class="aspect-video bg-stone-100 border border-stone-200 relative overflow-hidden group cursor-pointer" data-editable="image">
							<img class="content-image w-full h-full object-cover absolute inset-0" src="" alt="Content image" style="display: none;" />
							<div class="image-placeholder flex items-center justify-center h-full text-stone-400 group-hover:text-stone-600 transition-colors absolute inset-0">
								<svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
							</div>
						</div>
					</div>
				</div>
			</section>
		`,
    editableElements: [
      {
        selector: ".content-title",
        type: "text",
        defaultValue: "Why choose us",
        constraints: { maxLength: 50 },
      },
      {
        selector: ".content-text",
        type: "text",
        defaultValue: "We provide the tools and infrastructure you need to build amazing products.",
        constraints: { maxLength: 200 },
      },
      {
        selector: ".list-item",
        type: "text",
        defaultValue: "List item",
        constraints: { maxLength: 50 },
      },
      {
        selector: '[data-editable="image"]',
        type: "image",
        defaultValue: "",
        constraints: {
          allowedFormats: ["jpg", "jpeg", "png", "webp"],
          maxSize: 5242880, // 5MB
        },
      },
    ],
  },
  {
    id: "testimonial-single",
    name: "Testimonial",
    description: "Single testimonial",
    category: "testimonial",
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
        selector: ".testimonial-quote",
        type: "text",
        defaultValue: '"This product has transformed how we work. Highly recommended."',
        constraints: { maxLength: 200 },
      },
      {
        selector: ".author-name",
        type: "text",
        defaultValue: "John Smith",
        constraints: { maxLength: 50 },
      },
      {
        selector: ".author-role",
        type: "text",
        defaultValue: "CEO, Company",
        constraints: { maxLength: 50 },
      },
    ],
  },
  {
    id: "pricing-simple",
    name: "Pricing",
    description: "Simple pricing table",
    category: "pricing",
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
        selector: ".section-title",
        type: "text",
        defaultValue: "Pricing",
        constraints: { maxLength: 50 },
      },
      {
        selector: ".price-plan",
        type: "text",
        defaultValue: "Plan Name",
        constraints: { maxLength: 30 },
      },
      {
        selector: ".price-amount",
        type: "text",
        defaultValue: "$99",
        constraints: { maxLength: 20 },
      },
      {
        selector: ".price-description",
        type: "text",
        defaultValue: "Plan description",
        constraints: { maxLength: 100 },
      },
      {
        selector: ".price-button",
        type: "text",
        defaultValue: "Choose Plan",
        constraints: { maxLength: 30 },
      },
    ],
  },
  {
    id: "content-tabbed-showcase",
    name: "Tabbed Showcase",
    description: "Content showcase with tabs",
    category: "content",
    html: `
			<section class="section-margin py-24 border-b border-stone-200">
				<div class="container max-w-6xl mx-auto px-8">
					<h3 class="showcase-title text-[22px] lg:text-[28px] font-bold leading-[150%] mb-2.5 lg:mb-5 lg:max-w-[800px] text-black m-0" data-editable="text">
						새로운 사용자 경험과 비즈니스 기회를 만들어 보세요.
					</h3>
					<div class="swiper swiper-initialized swiper-horizontal swiper-backface-hidden">
						<div class="swiper-wrapper flex" style="transform: translate3d(0px, 0px, 0px);">
							<div class="swiper-slide w-auto tab-active swiper-slide-active" data-repeatable="tab">
								<div class="tab-name group relative line-clamp-1 h-[50px] max-w-[250px] px-4 leading-[50px] cursor-pointer hover:bg-stone-50 transition-colors" data-editable="text">
									HyperCLOVA X
								</div>
							</div>
							<div class="swiper-slide w-auto" data-repeatable="tab">
								<div class="tab-name group relative line-clamp-1 h-[50px] max-w-[250px] px-4 leading-[50px] cursor-pointer hover:bg-stone-50 transition-colors" data-editable="text">
									CLOVA Studio
								</div>
							</div>
							<div class="swiper-slide w-auto" data-repeatable="tab">
								<div class="tab-name group relative line-clamp-1 h-[50px] max-w-[250px] px-4 leading-[50px] cursor-pointer hover:bg-stone-50 transition-colors" data-editable="text">
									CLOVA X
								</div>
							</div>
							<span class="scroll-tabs-ink-bar absolute bottom-0 h-[2px] bg-black transition-all duration-300" style="width: 143px; left: 0px;"></span>
						</div>
					</div>
					<div class="mt-8">
						<div class="tab-content">
							<div class="md:flex">
								<div class="lg:w-[462px] md:w-[364px] xl:w-[590px] md:h-[205px] lg:h-[260px] xl:h-[332px] rounded-[20px] h-[200px] shrink-0 overflow-hidden border border-solid border-[rgba(34,34,34,0.1)] relative group cursor-pointer" data-editable="image">
									<div class="relative h-full w-full">
										<div class="flex h-full w-full items-center justify-center" style="background-color:rgba(0, 0, 0, 0)">
											<img class="tab-image w-full h-full object-cover absolute inset-0" src="" alt="Showcase image" style="display: none;" />
											<div class="image-placeholder flex items-center justify-center h-full text-stone-400 group-hover:text-stone-600 transition-colors absolute inset-0 bg-stone-50">
												<svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
												</svg>
											</div>
										</div>
									</div>
								</div>
								<div class="md:mt-0 md:flex-1 md:ml-7.5 lg:ml-[50px] mt-5 flex shrink-0 flex-col justify-between">
									<div class="flex-1">
										<h4 class="tab-title lg:text-[20px] m-0 text-[18px] font-bold leading-[150%] line-clamp-3 text-black" data-editable="text">
											HyperCLOVA X
										</h4>
										<p class="tab-description m-0 text-[18px] font-normal leading-[150%] text-gray-700 mt-[10px] line-clamp-5" data-editable="text">
											HyperCLOVA X는 한국의 문화와 맥락을 가장 잘 이해하는 생성형 AI입니다. AI 생태계와의 연결성 및 확장성을 기반으로 새로운 사용자 경험과 비즈니스 기회를 만들어 보세요.
										</p>
									</div>
									<div class="md:block mt-5 hidden">
										<a class="tab-link hover:text-blue-600 flex items-center p-0 text-base font-semibold text-black transition" href="#" data-editable="link">
											<span class="tab-link-text" data-editable="text">자세히 보기</span>
											<svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
											</svg>
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		`,
    editableElements: [
      {
        selector: ".showcase-title",
        type: "text",
        defaultValue: "새로운 사용자 경험과 비즈니스 기회를 만들어 보세요.",
        constraints: { maxLength: 100 },
      },
      {
        selector: ".tab-name",
        type: "text",
        defaultValue: "Tab Name",
        constraints: { maxLength: 50 },
      },
      {
        selector: '[data-editable="image"]',
        type: "image",
        defaultValue: "",
        constraints: {
          allowedFormats: ["jpg", "jpeg", "png", "webp"],
          maxSize: 5242880,
        },
      },
      {
        selector: ".tab-title",
        type: "text",
        defaultValue: "Tab Title",
        constraints: { maxLength: 60 },
      },
      {
        selector: ".tab-description",
        type: "text",
        defaultValue: "Tab description content",
        constraints: { maxLength: 300 },
      },
      {
        selector: ".tab-link-text",
        type: "text",
        defaultValue: "자세히 보기",
        constraints: { maxLength: 30 },
      },
    ],
  },
]

export function getTemplateById(id: string): Template | undefined {
  return defaultTemplates.find((template) => template.id === id)
}

export function getTemplatesByCategory(category: Template["category"]): Template[] {
  return defaultTemplates.filter((template) => template.category === category)
}
