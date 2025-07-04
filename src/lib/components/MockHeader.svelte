<script lang="ts">
	export let devicePreview: 'mobile' | 'tablet' | 'desktop' | 'full' = 'full';
</script>

<header class="sticky top-0 z-10 border-b border-stone-200 bg-white">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="h-8 w-8 rounded bg-stone-900"></div>
				</div>
				<div class="ml-3">
					<span class="text-lg font-semibold text-stone-900">Brand</span>
				</div>
			</div>

			<!-- Desktop Navigation -->
			{#if devicePreview === 'desktop' || devicePreview === 'full'}
				<nav class="hidden items-center space-x-8 md:flex">
					<a href="#" class="text-sm font-medium text-stone-600 hover:text-stone-900">Home</a>
					<a href="#" class="text-sm font-medium text-stone-600 hover:text-stone-900">Products</a>
					<a href="#" class="text-sm font-medium text-stone-600 hover:text-stone-900">About</a>
					<a href="#" class="text-sm font-medium text-stone-600 hover:text-stone-900">Contact</a>
				</nav>

				<!-- Desktop Actions -->
				<div class="hidden items-center space-x-4 md:flex">
					<button class="text-sm font-medium text-stone-600 hover:text-stone-900"> Sign in </button>
					<button
						class="rounded bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
					>
						Get Started
					</button>
				</div>
			{/if}

			<!-- Mobile/Tablet Menu Button -->
			{#if devicePreview === 'mobile' || devicePreview === 'tablet'}
				<button
					class="rounded p-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			{/if}
		</div>
	</div>
</header>
