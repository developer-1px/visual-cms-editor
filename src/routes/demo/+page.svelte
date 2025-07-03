<script lang="ts">
    import { onMount } from 'svelte';
    import { Selection } from '$lib/core/selection';
    
    let selection: Selection;
    
    onMount(() => {
        // Selection 시스템 초기화
        selection = new Selection();
        console.log('Visual CMS Editor initialized');
    });
</script>

<svelte:head>
    <title>Visual CMS Editor Demo</title>
</svelte:head>

<div class="container">
    <!-- Hero Section -->
    <section class="hero">
        <h1 data-editable="text" data-max-length="50">Visual CMS Editor</h1>
        <p data-editable="text" data-max-length="200">디자인을 보호하면서 컨텐츠만 안전하게 편집할 수 있는 차세대 CMS 에디터</p>
    </section>

    <!-- Features Grid - Repeatable -->
    <div class="features" data-repeatable="feature" data-min="1" data-max="6">
        <div class="feature-card">
            <h3 data-editable="text" data-max-length="30">안전한 편집</h3>
            <p data-editable="text" data-max-length="150">디자인 구조를 망칠 걱정 없이 텍스트와 이미지만 수정할 수 있습니다.</p>
        </div>
        <div class="feature-card">
            <h3 data-editable="text" data-max-length="30">키보드 중심</h3>
            <p data-editable="text" data-max-length="150">마우스 없이도 빠르게 편집할 수 있는 단축키를 제공합니다.</p>
        </div>
        <div class="feature-card">
            <h3 data-editable="text" data-max-length="30">실시간 협업</h3>
            <p data-editable="text" data-max-length="150">여러 사람이 동시에 편집해도 충돌 없이 작업할 수 있습니다.</p>
        </div>
    </div>

    <!-- Instructions -->
    <div class="instructions">
        <h3>사용 방법</h3>
        <ul>
            <li>• 클릭: 요소 선택</li>
            <li>• <kbd>Enter</kbd>: 편집 시작</li>
            <li>• <kbd>Esc</kbd>: 편집 종료</li>
            <li>• <kbd>Tab</kbd>: 다음 요소로 이동</li>
            <li>• <kbd>Cmd+C/V</kbd>: 복사/붙여넣기</li>
            <li>• <kbd>Shift+클릭</kbd>: 다중 선택</li>
        </ul>
    </div>
</div>

<style>
    :global(*) {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    :global(body) {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
        background: #f5f5f5;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    /* Demo Content Styles */
    .hero {
        background: white;
        padding: 60px 40px;
        margin-bottom: 40px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .hero :global(h1) {
        font-size: 48px;
        margin-bottom: 20px;
        color: #1a1a1a;
    }

    .hero :global(p) {
        font-size: 20px;
        color: #666;
    }

    .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
    }

    .feature-card {
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .feature-card :global(h3) {
        font-size: 24px;
        margin-bottom: 10px;
        color: #2563eb;
    }

    .feature-card :global(p) {
        color: #666;
    }

    /* Selection Styles */
    :global([data-editable]) {
        position: relative;
        cursor: pointer;
        transition: outline 0.2s ease;
    }

    :global([data-editable]:hover) {
        outline: 2px dashed #ddd;
        outline-offset: 4px;
    }

    :global([data-editable].selected) {
        outline: 2px solid #2563eb !important;
        outline-offset: 4px;
    }

    :global([data-editable].editing) {
        outline: 2px solid #10b981 !important;
        outline-offset: 4px;
    }

    /* Overlay UI */
    :global(.selection-overlay) {
        position: fixed;
        background: #1a1a1a;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        display: flex;
        gap: 8px;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    :global(.selection-overlay button) {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 2px;
        font-size: 12px;
    }

    :global(.selection-overlay button:hover) {
        background: rgba(255,255,255,0.2);
    }

    /* Instructions */
    .instructions {
        background: white;
        padding: 20px;
        border-radius: 8px;
        margin-top: 40px;
    }

    .instructions h3 {
        margin-bottom: 10px;
    }

    .instructions ul {
        list-style: none;
        padding: 0;
    }

    :global(kbd) {
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 3px;
        padding: 2px 6px;
        font-size: 11px;
        font-family: monospace;
    }
</style>