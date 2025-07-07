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
    id: "hero-with-image",
    name: "Hero with Image",
    description: "Hero section with background image",
    category: "hero",
    html: `
			<section class="relative py-32 text-center text-white">
				<div class="hero-image-container absolute inset-0 z-0 overflow-hidden" data-editable="image">
					<img class="hero-bg-image w-full h-full object-cover" src="" alt="Hero background" />
					<div class="hero-image-placeholder absolute inset-0 bg-stone-800 flex items-center justify-center">
						<svg class="w-24 h-24 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					</div>
					<div class="absolute inset-0 bg-black bg-opacity-50"></div>
				</div>
				<div class="relative z-10 max-w-4xl mx-auto px-8">
					<h1 class="hero-title text-4xl md:text-6xl font-bold mb-6 leading-tight">Welcome to Our Platform</h1>
					<p class="hero-description text-xl max-w-2xl mx-auto mb-8 opacity-90">Build amazing experiences with our powerful tools and services</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<button class="hero-primary-cta px-8 py-4 bg-white text-stone-900 font-medium hover:bg-stone-100 transition-colors">
							Get Started Free
						</button>
						<button class="hero-secondary-cta px-8 py-4 border-2 border-white text-white font-medium hover:bg-white hover:text-stone-900 transition-colors">
							Watch Demo
						</button>
					</div>
				</div>
			</section>
		`,
    editableElements: [
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
        selector: ".hero-title",
        type: "text",
        defaultValue: "Welcome to Our Platform",
        constraints: { maxLength: 60 },
      },
      {
        selector: ".hero-description",
        type: "text",
        defaultValue: "Build amazing experiences with our powerful tools and services",
        constraints: { maxLength: 150 },
      },
      {
        selector: ".hero-primary-cta",
        type: "text",
        defaultValue: "Get Started Free",
        constraints: { maxLength: 30 },
      },
      {
        selector: ".hero-secondary-cta",
        type: "text",
        defaultValue: "Watch Demo",
        constraints: { maxLength: 30 },
      },
    ],
  },
  {
    id: "hero-split",
    name: "Split Hero",
    description: "Two-column hero with image",
    category: "hero",
    html: `
			<section class="py-24">
				<div class="max-w-6xl mx-auto px-8">
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div class="text-left">
							<div class="hero-badge inline-block px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-6">
								New Release
							</div>
							<h1 class="hero-title text-4xl md:text-5xl font-bold mb-6 text-stone-900 leading-tight">
								The Future of Digital Innovation
							</h1>
							<p class="hero-description text-xl text-stone-600 mb-8">
								Transform your business with cutting-edge technology solutions designed for tomorrow's challenges.
							</p>
							<div class="flex flex-col sm:flex-row gap-4">
								<button class="hero-cta px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
									Start Free Trial
								</button>
								<a href="#" class="hero-link inline-flex items-center text-blue-600 hover:text-blue-700 font-medium py-3" data-editable="link">
									Learn More
									<svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
									</svg>
								</a>
							</div>
						</div>
						<div class="hero-image-wrapper relative aspect-square overflow-hidden rounded-lg shadow-2xl" data-editable="image">
							<img class="hero-image w-full h-full object-cover" src="" alt="Hero image" />
							<div class="hero-image-placeholder absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
								<svg class="w-24 h-24 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        selector: ".hero-badge",
        type: "text",
        defaultValue: "New Release",
        constraints: { maxLength: 20 },
      },
      {
        selector: ".hero-title",
        type: "text",
        defaultValue: "The Future of Digital Innovation",
        constraints: { maxLength: 60 },
      },
      {
        selector: ".hero-description",
        type: "text",
        defaultValue:
          "Transform your business with cutting-edge technology solutions designed for tomorrow's challenges.",
        constraints: { maxLength: 200 },
      },
      {
        selector: ".hero-cta",
        type: "text",
        defaultValue: "Start Free Trial",
        constraints: { maxLength: 30 },
      },
      {
        selector: '[data-editable="link"]',
        type: "link",
        defaultValue: "#",
        constraints: {
          allowedProtocols: ["http", "https", "mailto", "tel"],
        },
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
							  
								<span>자세히 보기</span>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon lucide lucide-settings h-4 w-4"><!----><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><!----><circle cx="12" cy="12" r="3"></circle><!----><!----><!----></svg>
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
        selector: '[data-repeatable="feature"]:nth-of-type(1) [data-editable="icon"]',
        type: "icon",
        defaultValue: "lightning-icon",
        constraints: {
          allowedIcons: ["lightning", "lock", "heart", "star", "check", "arrow-right"],
        },
      },
      {
        selector: '[data-repeatable="feature"]:nth-of-type(2) [data-editable="icon"]',
        type: "icon",
        defaultValue: "lock-icon",
        constraints: {
          allowedIcons: ["lightning", "lock", "heart", "star", "check", "arrow-right"],
        },
      },
      {
        selector: '[data-repeatable="feature"]:nth-of-type(3) [data-editable="icon"]',
        type: "icon",
        defaultValue: "heart-icon",
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
    id: "features-with-images",
    name: "Features with Images",
    description: "Feature cards with images",
    category: "features",
    html: `
			<section class="py-24 bg-stone-50">
				<div class="max-w-6xl mx-auto px-8">
					<div class="text-center mb-16">
						<h2 class="section-title text-3xl font-bold text-stone-900 mb-4">Our Services</h2>
						<p class="section-subtitle text-xl text-stone-600">Comprehensive solutions for your business needs</p>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow" data-repeatable="feature">
							<div class="feature-image-container aspect-video relative overflow-hidden" data-editable="image">
								<img class="feature-image w-full h-full object-cover" src="" alt="Feature image" />
								<div class="feature-image-placeholder absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
									<svg class="w-16 h-16 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
							</div>
							<div class="p-6">
								<div class="feature-icon w-12 h-12 mb-4 text-blue-600" data-editable="icon">
									<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
									</svg>
								</div>
								<h3 class="feature-title text-xl font-semibold text-stone-900 mb-3" data-editable="text">Innovation</h3>
								<p class="feature-description text-stone-600 mb-4" data-editable="text">Cutting-edge solutions that drive business growth and transformation</p>
								<a href="#" class="feature-link inline-flex items-center text-blue-600 hover:text-blue-700 font-medium" data-editable="link">
									Learn more
									<svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
									</svg>
								</a>
							</div>
						</div>
						<div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow" data-repeatable="feature">
							<div class="feature-image-container aspect-video relative overflow-hidden" data-editable="image">
								<img class="feature-image w-full h-full object-cover" src="" alt="Feature image" />
								<div class="feature-image-placeholder absolute inset-0 bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
									<svg class="w-16 h-16 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
							</div>
							<div class="p-6">
								<div class="feature-icon w-12 h-12 mb-4 text-green-600" data-editable="icon">
									<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
									</svg>
								</div>
								<h3 class="feature-title text-xl font-semibold text-stone-900 mb-3" data-editable="text">Security</h3>
								<p class="feature-description text-stone-600 mb-4" data-editable="text">Enterprise-grade security to protect your data and maintain compliance</p>
								<a href="#" class="feature-link inline-flex items-center text-blue-600 hover:text-blue-700 font-medium" data-editable="link">
									<span>Learn more</span>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon lucide lucide-settings h-4 w-4"><!----><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><!----><circle cx="12" cy="12" r="3"></circle><!----><!----><!----></svg>

									<svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
									</svg>
								</a>
							</div>
						</div>
						<div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow" data-repeatable="feature">
							<div class="feature-image-container aspect-video relative overflow-hidden" data-editable="image">
								<img class="feature-image w-full h-full object-cover" src="" alt="Feature image" />
								<div class="feature-image-placeholder absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
									<svg class="w-16 h-16 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
							</div>
							<div class="p-6">
								<div class="feature-icon w-12 h-12 mb-4 text-purple-600" data-editable="icon">
									<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
									</svg>
								</div>
								<h3 class="feature-title text-xl font-semibold text-stone-900 mb-3" data-editable="text">Performance</h3>
								<p class="feature-description text-stone-600 mb-4" data-editable="text">Lightning-fast performance optimized for modern applications</p>
								<a href="#" class="feature-link inline-flex items-center text-blue-600 hover:text-blue-700 font-medium" data-editable="link">
									Learn more
									<svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
									</svg>
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>
		`,
    editableElements: [
      {
        selector: ".section-title",
        type: "text",
        defaultValue: "Our Services",
        constraints: { maxLength: 50 },
      },
      {
        selector: ".section-subtitle",
        type: "text",
        defaultValue: "Comprehensive solutions for your business needs",
        constraints: { maxLength: 100 },
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
        constraints: { maxLength: 150 },
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
        selector: '[data-editable="icon"]',
        type: "icon",
        defaultValue: "icon",
        constraints: {
          allowedIcons: ["lightning", "lock", "heart", "star", "check", "arrow-right"],
        },
      },
      {
        selector: '[data-editable="link"]',
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
  {
    id: "svg-showcase",
    name: "SVG Showcase",
    description: "Beautiful SVG illustrations and icons",
    category: "features",
    html: `
      <section class="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div class="max-w-6xl mx-auto px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4" data-editable="text">Beautiful SVG Graphics</h2>
            <p class="text-lg text-gray-600" data-editable="text">Scalable vector graphics for modern web</p>
          </div>
          
          <!-- SVG Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <!-- Geometric Pattern -->
            <div class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div class="h-32 flex items-center justify-center mb-4" data-editable="icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="35" stroke="url(#grad1)" stroke-width="2" fill="none" />
                  <polygon points="40,10 65,30 55,60 25,60 15,30" fill="url(#grad1)" opacity="0.3" />
                  <polygon points="40,25 50,35 45,50 35,50 30,35" fill="url(#grad1)" opacity="0.6" />
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#8B5CF6" />
                      <stop offset="100%" stop-color="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 class="text-center font-semibold text-gray-800" data-editable="text">Geometric</h3>
            </div>
            
            <!-- Wave Pattern -->
            <div class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div class="h-32 flex items-center justify-center mb-4" data-editable="icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 40 Q 20 20, 30 40 T 50 40 T 70 40" stroke="#3B82F6" stroke-width="3" fill="none" />
                  <path d="M10 50 Q 20 30, 30 50 T 50 50 T 70 50" stroke="#60A5FA" stroke-width="2" fill="none" />
                  <path d="M10 30 Q 20 10, 30 30 T 50 30 T 70 30" stroke="#93C5FD" stroke-width="2" fill="none" />
                  <circle cx="30" cy="40" r="4" fill="#3B82F6" />
                  <circle cx="50" cy="40" r="4" fill="#3B82F6" />
                </svg>
              </div>
              <h3 class="text-center font-semibold text-gray-800" data-editable="text">Waves</h3>
            </div>
            
            <!-- Heart Icon -->
            <div class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div class="h-32 flex items-center justify-center mb-4" data-editable="icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 65 C30 55, 10 40, 10 25 C10 15, 18 7, 28 7 C34 7, 38 10, 40 14 C42 10, 46 7, 52 7 C62 7, 70 15, 70 25 C70 40, 50 55, 40 65 Z" fill="#EF4444" stroke="#DC2626" stroke-width="2" />
                  <path d="M25 20 L30 25 L35 20" stroke="white" stroke-width="2" stroke-linecap="round" />
                </svg>
              </div>
              <h3 class="text-center font-semibold text-gray-800" data-editable="text">Love</h3>
            </div>
            
            <!-- Star Burst -->
            <div class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div class="h-32 flex items-center justify-center mb-4" data-editable="icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 10 L45 30 L65 30 L48 42 L53 62 L40 50 L27 62 L32 42 L15 30 L35 30 Z" fill="#FCD34D" stroke="#F59E0B" stroke-width="2" />
                  <circle cx="40" cy="40" r="8" fill="#F59E0B" />
                </svg>
              </div>
              <h3 class="text-center font-semibold text-gray-800" data-editable="text">Star</h3>
            </div>
            
            <!-- Rocket -->
            <div class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div class="h-32 flex items-center justify-center mb-4" data-editable="icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 10 C45 10, 50 15, 50 25 L50 45 C50 50, 45 55, 40 55 C35 55, 30 50, 30 45 L30 25 C30 15, 35 10, 40 10 Z" fill="#6366F1" />
                  <path d="M30 40 L20 50 L25 45 L30 45 Z" fill="#EF4444" />
                  <path d="M50 40 L60 50 L55 45 L50 45 Z" fill="#EF4444" />
                  <circle cx="40" cy="25" r="5" fill="#E0E7FF" />
                  <path d="M35 55 L35 65 L40 60 L45 65 L45 55" stroke="#F59E0B" stroke-width="3" fill="none" />
                </svg>
              </div>
              <h3 class="text-center font-semibold text-gray-800" data-editable="text">Launch</h3>
            </div>
            
            <!-- Plant -->
            <div class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div class="h-32 flex items-center justify-center mb-4" data-editable="icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 60 L40 30" stroke="#84CC16" stroke-width="3" />
                  <path d="M40 40 C30 40, 25 35, 25 30 C25 25, 30 20, 35 20 C38 20, 40 22, 40 25" fill="#22C55E" />
                  <path d="M40 40 C50 40, 55 35, 55 30 C55 25, 50 20, 45 20 C42 20, 40 22, 40 25" fill="#10B981" />
                  <path d="M40 50 C32 50, 28 46, 28 42 C28 38, 32 34, 36 34 C38 34, 40 36, 40 38" fill="#34D399" />
                  <circle cx="40" cy="60" r="8" fill="#92400E" />
                </svg>
              </div>
              <h3 class="text-center font-semibold text-gray-800" data-editable="text">Growth</h3>
            </div>
            
            <!-- Diamond -->
            <div class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div class="h-32 flex items-center justify-center mb-4" data-editable="icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 15 L55 30 L40 65 L25 30 Z" fill="url(#diamond)" stroke="#1E40AF" stroke-width="2" />
                  <path d="M25 30 L55 30" stroke="#60A5FA" stroke-width="1" />
                  <path d="M40 15 L25 30 L32 30 Z" fill="#60A5FA" opacity="0.5" />
                  <path d="M40 15 L55 30 L48 30 Z" fill="#3B82F6" opacity="0.5" />
                  <defs>
                    <linearGradient id="diamond" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#60A5FA" />
                      <stop offset="100%" stop-color="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 class="text-center font-semibold text-gray-800" data-editable="text">Premium</h3>
            </div>
            
            <!-- Lightning -->
            <div class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div class="h-32 flex items-center justify-center mb-4" data-editable="icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M45 10 L30 40 L38 40 L35 70 L50 40 L42 40 Z" fill="#FCD34D" stroke="#F59E0B" stroke-width="2" stroke-linejoin="round" />
                  <circle cx="25" cy="25" r="3" fill="#FDE047" opacity="0.6" />
                  <circle cx="55" cy="55" r="3" fill="#FDE047" opacity="0.6" />
                  <circle cx="60" cy="20" r="2" fill="#FDE047" opacity="0.4" />
                  <circle cx="20" cy="60" r="2" fill="#FDE047" opacity="0.4" />
                </svg>
              </div>
              <h3 class="text-center font-semibold text-gray-800" data-editable="text">Power</h3>
            </div>
          </div>
          
          <!-- Decorative SVG Background -->
          <div class="mt-16 relative">
            <svg class="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 400 100" preserveAspectRatio="none">
              <path d="M0,50 C100,20 200,80 400,50 L400,100 L0,100 Z" fill="currentColor" />
            </svg>
            <div class="relative text-center py-8">
              <p class="text-lg text-gray-700" data-editable="text">SVG graphics scale perfectly on any device</p>
            </div>
          </div>
        </div>
      </section>
    `,
    editableElements: [
      {
        selector: '[data-editable="text"]',
        type: "text",
        defaultValue: "Text content",
        constraints: { maxLength: 100 },
      },
      {
        selector: '[data-editable="icon"]',
        type: "icon",
        defaultValue: "star",
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
