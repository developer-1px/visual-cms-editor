<script lang="ts">
	export let devicePreview: 'mobile' | 'tablet' | 'desktop' | 'full' = 'full';
</script>

<header class="bg-white border-b border-stone-200 sticky top-0 z-10">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="w-8 h-8 bg-stone-900 rounded"></div>
				</div>
				<div class="ml-3">
					<span class="text-lg font-semibold text-stone-900">Brand</span>
				</div>
			</div>
			
			<!-- Desktop Navigation -->
			{#if devicePreview === 'desktop' || devicePreview === 'full'}
				<nav class="hidden md:flex items-center space-x-8">
					<a href="#" class="text-stone-600 hover:text-stone-900 text-sm font-medium">Home</a>
					<a href="#" class="text-stone-600 hover:text-stone-900 text-sm font-medium">Products</a>
					<a href="#" class="text-stone-600 hover:text-stone-900 text-sm font-medium">About</a>
					<a href="#" class="text-stone-600 hover:text-stone-900 text-sm font-medium">Contact</a>
				</nav>
				
				<!-- Desktop Actions -->
				<div class="hidden md:flex items-center space-x-4">
					<button class="text-stone-600 hover:text-stone-900 text-sm font-medium">
						Sign in
					</button>
					<button class="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded hover:bg-stone-800 transition-colors">
						Get Started
					</button>
				</div>
			{/if}
			
			<!-- Mobile/Tablet Menu Button -->
			{#if devicePreview === 'mobile' || devicePreview === 'tablet'}
				<button class="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
			{/if}
		</div>
	</div>
</header>