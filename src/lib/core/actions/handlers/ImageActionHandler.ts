import type { ActionHandler } from '../interfaces';
import { imagePlugin } from '../../plugins/editable/plugins/image';

/**
 * 이미지 요소를 위한 Action Handler
 * 기존 이미지 플러그인의 로직을 재사용하여 구현
 */
export class ImageActionHandler implements ActionHandler {
	readonly type = 'image';

	/**
	 * 이미지 타입 요소를 처리할 수 있는지 확인
	 */
	canHandle(element: HTMLElement, selectionType: string): boolean {
		return selectionType === 'image' && element.dataset.editable === 'image';
	}

	/**
	 * 이미지 복사
	 */
	async copy(element: HTMLElement): Promise<void> {
		console.log('[ImageActionHandler] Copying image element');

		if (!this.canHandle(element, 'image')) {
			throw new Error('Element is not a valid image element');
		}

		try {
			// 이미지 플러그인의 copyImage 메서드 사용
			if (imagePlugin.copyImage) {
				imagePlugin.copyImage(element);
			} else {
				// 폴백: 기본 이미지 복사 로직
				const imageUrl = imagePlugin.getValue(element);
				if (imageUrl) {
					// 내부 클립보드에 저장
					(imagePlugin as any).imageClipboard = imageUrl;

					// 시스템 클립보드에도 복사 시도
					try {
						await navigator.clipboard.writeText(imageUrl);
					} catch (error) {
						console.warn('Failed to copy image URL to system clipboard:', error);
					}

					// 시각적 피드백
					this.animateElement(element, 'copy');
				} else {
					throw new Error('No image to copy');
				}
			}
		} catch (error) {
			console.error('[ImageActionHandler] Copy failed:', error);
			throw error;
		}
	}

	/**
	 * 이미지 잘라내기
	 */
	async cut(element: HTMLElement): Promise<void> {
		console.log('[ImageActionHandler] Cutting image element');

		if (!this.canHandle(element, 'image')) {
			throw new Error('Element is not a valid image element');
		}

		try {
			// 이미지 플러그인의 cutImage 메서드 사용
			if (imagePlugin.cutImage) {
				imagePlugin.cutImage(element);
			} else {
				// 폴백: 기본 이미지 잘라내기 로직
				const imageUrl = imagePlugin.getValue(element);
				if (imageUrl) {
					// 먼저 복사
					(imagePlugin as any).imageClipboard = imageUrl;

					try {
						await navigator.clipboard.writeText(imageUrl);
					} catch (error) {
						console.warn('Failed to copy image URL to system clipboard:', error);
					}

					// 그다음 삭제
					imagePlugin.setValue(element, '');

					// 히스토리 이벤트 발생
					element.dispatchEvent(
						new CustomEvent('imageChanged', {
							detail: { src: '', action: 'cut' }
						})
					);

					// 시각적 피드백
					this.animateElement(element, 'cut');
				} else {
					throw new Error('No image to cut');
				}
			}
		} catch (error) {
			console.error('[ImageActionHandler] Cut failed:', error);
			throw error;
		}
	}

	/**
	 * 이미지 붙여넣기
	 */
	async paste(element: HTMLElement): Promise<void> {
		console.log('[ImageActionHandler] Pasting image element');

		if (!this.canHandle(element, 'image')) {
			throw new Error('Element is not a valid image element');
		}

		try {
			// 이미지 플러그인의 pasteImage 메서드 사용
			if (imagePlugin.pasteImage) {
				imagePlugin.pasteImage(element);
			} else {
				// 폴백: 기본 이미지 붙여넣기 로직
				const clipboardImage = (imagePlugin as any).imageClipboard;
				if (clipboardImage) {
					imagePlugin.setValue(element, clipboardImage);

					// 히스토리 이벤트 발생
					element.dispatchEvent(
						new CustomEvent('imageChanged', {
							detail: { src: clipboardImage, action: 'paste' }
						})
					);

					// 시각적 피드백
					this.animateElement(element, 'paste');
				} else {
					throw new Error('No image in clipboard to paste');
				}
			}
		} catch (error) {
			console.error('[ImageActionHandler] Paste failed:', error);
			throw error;
		}
	}

	/**
	 * 이미지 삭제
	 */
	async delete(element: HTMLElement): Promise<void> {
		console.log('[ImageActionHandler] Deleting image element');

		if (!this.canHandle(element, 'image')) {
			throw new Error('Element is not a valid image element');
		}

		try {
			// 이미지 플러그인의 deleteImage 메서드 사용
			if (imagePlugin.deleteImage) {
				imagePlugin.deleteImage(element);
			} else {
				// 폴백: 기본 이미지 삭제 로직
				if (!imagePlugin.isEmpty(element)) {
					// 시각적 피드백 먼저
					this.animateElement(element, 'delete');

					// 이미지 삭제
					imagePlugin.setValue(element, '');

					// 히스토리 이벤트 발생
					element.dispatchEvent(
						new CustomEvent('imageChanged', {
							detail: { src: '', action: 'delete' }
						})
					);
				} else {
					console.warn('[ImageActionHandler] No image to delete');
				}
			}
		} catch (error) {
			console.error('[ImageActionHandler] Delete failed:', error);
			throw error;
		}
	}

	/**
	 * 액션에 따른 시각적 피드백 애니메이션
	 */
	private animateElement(element: HTMLElement, action: string): void {
		const animations = {
			copy: [
				{ transform: 'scale(1)', opacity: 1 },
				{ transform: 'scale(1.05)', opacity: 0.8 },
				{ transform: 'scale(1)', opacity: 1 }
			],
			cut: [
				{ transform: 'scale(1)', opacity: 1 },
				{ transform: 'scale(0.95)', opacity: 0.5 },
				{ transform: 'scale(1)', opacity: 1 }
			],
			paste: [
				{ transform: 'scale(0.9)', opacity: 0.5 },
				{ transform: 'scale(1)', opacity: 1 }
			],
			delete: [
				{ transform: 'scale(1)', opacity: 1 },
				{ transform: 'scale(0.9)', opacity: 0.3 },
				{ transform: 'scale(1)', opacity: 1 }
			]
		};

		const keyframes = animations[action as keyof typeof animations];
		if (keyframes) {
			element.animate(keyframes, {
				duration: 300,
				easing: 'ease-out'
			});
		}
	}
}
