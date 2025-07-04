import type { ActionHandler } from '../interfaces';

/**
 * 텍스트 요소를 위한 Action Handler
 * 기본적인 텍스트 복사/붙여넣기 기능을 제공
 */
export class TextActionHandler implements ActionHandler {
	readonly type = 'text';

	// 텍스트 클립보드
	private copiedText: string | null = null;

	/**
	 * 텍스트 타입 요소를 처리할 수 있는지 확인
	 */
	canHandle(element: HTMLElement, selectionType: string): boolean {
		return selectionType === 'text' && element.dataset.editable === 'text';
	}

	/**
	 * 텍스트 복사
	 */
	async copy(element: HTMLElement): Promise<void> {
		console.log('[TextActionHandler] Copying text element');

		if (!this.canHandle(element, 'text')) {
			throw new Error('Element is not a valid text element');
		}

		try {
			const textContent = element.textContent || element.innerText || '';

			if (!textContent.trim()) {
				throw new Error('No text content to copy');
			}

			// 내부 클립보드에 저장
			this.copiedText = textContent;

			// 시스템 클립보드에도 복사
			try {
				await navigator.clipboard.writeText(textContent);
			} catch (error) {
				console.warn('Failed to copy text to system clipboard:', error);
				// 폴백: execCommand 사용
				this.fallbackCopy(textContent);
			}

			// 시각적 피드백
			this.animateElement(element, 'copy');

			console.log(
				'[TextActionHandler] Text copied successfully:',
				textContent.substring(0, 50) + '...'
			);
		} catch (error) {
			console.error('[TextActionHandler] Copy failed:', error);
			throw error;
		}
	}

	/**
	 * 텍스트 잘라내기
	 */
	async cut(element: HTMLElement): Promise<void> {
		console.log('[TextActionHandler] Cutting text element');

		if (!this.canHandle(element, 'text')) {
			throw new Error('Element is not a valid text element');
		}

		try {
			const textContent = element.textContent || element.innerText || '';

			if (!textContent.trim()) {
				throw new Error('No text content to cut');
			}

			// 먼저 복사
			this.copiedText = textContent;

			try {
				await navigator.clipboard.writeText(textContent);
			} catch (error) {
				console.warn('Failed to copy text to system clipboard:', error);
				this.fallbackCopy(textContent);
			}

			// 텍스트 내용 제거
			element.textContent = '';

			// 변경 이벤트 발생
			element.dispatchEvent(new Event('input', { bubbles: true }));

			// 시각적 피드백
			this.animateElement(element, 'cut');

			console.log('[TextActionHandler] Text cut successfully');
		} catch (error) {
			console.error('[TextActionHandler] Cut failed:', error);
			throw error;
		}
	}

	/**
	 * 텍스트 붙여넣기
	 */
	async paste(element: HTMLElement): Promise<void> {
		console.log('[TextActionHandler] Pasting text element');

		if (!this.canHandle(element, 'text')) {
			throw new Error('Element is not a valid text element');
		}

		try {
			let textToPaste: string | null = null;

			// 1. 먼저 시스템 클립보드에서 텍스트 가져오기 시도
			try {
				const clipboardText = await navigator.clipboard.readText();
				if (clipboardText) {
					textToPaste = clipboardText;
					console.log('[TextActionHandler] Got text from system clipboard');
				}
			} catch (error) {
				console.log('[TextActionHandler] Could not read from system clipboard:', error);

				// 2. 시스템 클립보드 접근 실패시 HTML 읽기 시도
				try {
					const clipboardItems = await navigator.clipboard.read();
					for (const item of clipboardItems) {
						// HTML 형식 확인
						if (item.types.includes('text/html')) {
							const blob = await item.getType('text/html');
							const html = await blob.text();
							// HTML을 텍스트로 변환
							textToPaste = this.htmlToText(html);
							console.log('[TextActionHandler] Converted HTML to text from clipboard');
							break;
						}
						// 일반 텍스트 형식 확인
						else if (item.types.includes('text/plain')) {
							const blob = await item.getType('text/plain');
							textToPaste = await blob.text();
							console.log('[TextActionHandler] Got plain text from clipboard');
							break;
						}
					}
				} catch (readError) {
					console.log('[TextActionHandler] Could not read clipboard items:', readError);
				}
			}

			// 3. 시스템 클립보드 접근이 전부 실패하면 내부 클립보드 사용
			if (!textToPaste && this.copiedText) {
				textToPaste = this.copiedText;
				console.log('[TextActionHandler] Using internal clipboard');
			}

			if (!textToPaste) {
				throw new Error('No text in clipboard to paste');
			}

			// 새 텍스트 설정
			element.textContent = textToPaste;

			// 변경 이벤트 발생
			element.dispatchEvent(new Event('input', { bubbles: true }));

			// 시각적 피드백
			this.animateElement(element, 'paste');

			console.log(
				'[TextActionHandler] Text pasted successfully:',
				textToPaste.substring(0, 50) + '...'
			);
		} catch (error) {
			console.error('[TextActionHandler] Paste failed:', error);
			throw error;
		}
	}

	/**
	 * 텍스트 삭제
	 */
	async delete(element: HTMLElement): Promise<void> {
		console.log('[TextActionHandler] Deleting text element content');

		if (!this.canHandle(element, 'text')) {
			throw new Error('Element is not a valid text element');
		}

		try {
			const hasContent = (element.textContent || '').trim().length > 0;

			if (!hasContent) {
				console.warn('[TextActionHandler] No text content to delete');
				return;
			}

			// 시각적 피드백 먼저
			this.animateElement(element, 'delete');

			// 텍스트 내용 제거
			element.textContent = '';

			// 변경 이벤트 발생
			element.dispatchEvent(new Event('input', { bubbles: true }));

			console.log('[TextActionHandler] Text content deleted successfully');
		} catch (error) {
			console.error('[TextActionHandler] Delete failed:', error);
			throw error;
		}
	}

	/**
	 * 클립보드 API가 지원되지 않을 때의 폴백 복사 함수
	 */
	private fallbackCopy(text: string): void {
		try {
			const textArea = document.createElement('textarea');
			textArea.value = text;
			// Use sr-only pattern for hidden textarea
			textArea.setAttribute('style', 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;');
			textArea.setAttribute('aria-hidden', 'true');
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);
		} catch (error) {
			console.warn('Fallback copy also failed:', error);
		}
	}

	/**
	 * 액션에 따른 시각적 피드백 애니메이션
	 */
	private animateElement(element: HTMLElement, action: string): void {
		const animations = {
			copy: [
				{ backgroundColor: 'transparent' },
				{ backgroundColor: 'rgba(34, 197, 94, 0.2)' },
				{ backgroundColor: 'transparent' }
			],
			cut: [
				{ backgroundColor: 'transparent' },
				{ backgroundColor: 'rgba(239, 68, 68, 0.2)' },
				{ backgroundColor: 'transparent' }
			],
			paste: [
				{ backgroundColor: 'transparent' },
				{ backgroundColor: 'rgba(59, 130, 246, 0.2)' },
				{ backgroundColor: 'transparent' }
			],
			delete: [
				{ backgroundColor: 'transparent' },
				{ backgroundColor: 'rgba(239, 68, 68, 0.3)' },
				{ backgroundColor: 'transparent' }
			]
		};

		const keyframes = animations[action as keyof typeof animations];
		if (keyframes) {
			element.animate(keyframes, {
				duration: 400,
				easing: 'ease-out'
			});
		}
	}

	/**
	 * 클립보드에 텍스트가 있는지 확인
	 */
	hasClipboardContent(): boolean {
		return this.copiedText !== null;
	}

	/**
	 * 클립보드 내용 초기화
	 */
	clearClipboard(): void {
		this.copiedText = null;
	}

	/**
	 * 클립보드 내용 반환 (디버깅용)
	 */
	getClipboardContent(): string | null {
		return this.copiedText;
	}

	/**
	 * HTML을 일반 텍스트로 변환
	 */
	private htmlToText(html: string): string {
		// DOMParser를 사용하여 HTML 파싱
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');

		// 스크립트와 스타일 태그 제거
		const scripts = doc.querySelectorAll('script, style');
		scripts.forEach((el) => el.remove());

		// 줄바꿈을 유지하기 위해 블록 요소들에 줄바꿈 추가
		const blockElements = doc.querySelectorAll('p, div, br, li, h1, h2, h3, h4, h5, h6');
		blockElements.forEach((el) => {
			if (el.textContent && !el.textContent.endsWith('\n')) {
				el.textContent = el.textContent + '\n';
			}
		});

		// 전체 텍스트 추출
		let text = doc.body.textContent || '';

		// 연속된 공백과 줄바꿈 정리
		text = text.replace(/\n\s*\n/g, '\n\n'); // 여러 줄바꿈을 최대 2개로
		text = text.replace(/[ \t]+/g, ' '); // 여러 공백을 하나로
		text = text.trim(); // 앞뒤 공백 제거

		return text;
	}
}
