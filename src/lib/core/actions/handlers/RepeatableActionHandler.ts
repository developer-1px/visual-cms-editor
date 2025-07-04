import type { ActionHandler } from '../interfaces';

/**
 * Repeatable 요소를 위한 Action Handler
 * 기존 repeatable 관련 함수들의 로직을 통합하여 구현
 */
export class RepeatableActionHandler implements ActionHandler {
    readonly type = 'repeatable';
    
    // 복사된 요소를 저장하는 클립보드
    private copiedElement: HTMLElement | null = null;

    /**
     * Repeatable 타입 요소를 처리할 수 있는지 확인
     */
    canHandle(element: HTMLElement, selectionType: string): boolean {
        return selectionType === 'repeatable' && element.hasAttribute('data-repeatable');
    }

    /**
     * Repeatable 요소 복사
     */
    async copy(element: HTMLElement): Promise<void> {
        console.log('[RepeatableActionHandler] Copying repeatable element');
        
        if (!this.canHandle(element, 'repeatable')) {
            throw new Error('Element is not a valid repeatable element');
        }

        try {
            // 요소를 깊은 복사로 클론
            this.copiedElement = element.cloneNode(true) as HTMLElement;
            
            // 시각적 피드백
            this.animateElement(element, [
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(1.05)', opacity: 0.8 },
                { transform: 'scale(1)', opacity: 1 }
            ]);
            
            console.log('[RepeatableActionHandler] Element copied successfully');
        } catch (error) {
            console.error('[RepeatableActionHandler] Copy failed:', error);
            throw error;
        }
    }

    /**
     * Repeatable 요소 잘라내기
     */
    async cut(element: HTMLElement): Promise<void> {
        console.log('[RepeatableActionHandler] Cutting repeatable element');
        
        if (!this.canHandle(element, 'repeatable')) {
            throw new Error('Element is not a valid repeatable element');
        }

        try {
            // 먼저 복사
            this.copiedElement = element.cloneNode(true) as HTMLElement;
            
            // 히스토리 상태 저장
            this.saveHistoryState();
            
            // 애니메이션과 함께 삭제
            const animation = element.animate([
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(0.95)', opacity: 0.5 }
            ], {
                duration: 200,
                easing: 'ease-out'
            });
            
            animation.onfinish = () => {
                element.remove();
                this.updateHistoryState();
            };
            
            console.log('[RepeatableActionHandler] Element cut successfully');
        } catch (error) {
            console.error('[RepeatableActionHandler] Cut failed:', error);
            throw error;
        }
    }

    /**
     * Repeatable 요소 붙여넣기
     */
    async paste(element: HTMLElement): Promise<void> {
        console.log('[RepeatableActionHandler] Pasting repeatable element');
        
        if (!this.canHandle(element, 'repeatable')) {
            throw new Error('Element is not a valid repeatable element');
        }

        if (!this.copiedElement) {
            throw new Error('No element in clipboard to paste');
        }

        try {
            const parentElement = element.parentElement;
            if (!parentElement) {
                throw new Error('Cannot paste: element has no parent');
            }

            // 히스토리 상태 저장
            this.saveHistoryState();
            
            // 복사된 요소를 클론
            const newElement = this.copiedElement.cloneNode(true) as HTMLElement;
            
            // 선택된 요소 다음에 삽입
            parentElement.insertBefore(newElement, element.nextSibling);
            
            // 새 요소에 이벤트 리스너 추가
            this.hydrateNewElement(newElement);
            
            // 히스토리 상태 업데이트
            this.updateHistoryState();
            
            // 새 요소를 선택 (이는 상위 컴포넌트에서 처리해야 함)
            // 여기서는 커스텀 이벤트로 알림
            newElement.dispatchEvent(new CustomEvent('elementPasted', {
                bubbles: true,
                detail: { newElement }
            }));
            
            // 애니메이션
            newElement.animate([
                { transform: 'scale(0.9)', opacity: 0 },
                { transform: 'scale(1)', opacity: 1 }
            ], {
                duration: 300,
                easing: 'ease-out'
            });
            
            console.log('[RepeatableActionHandler] Element pasted successfully');
        } catch (error) {
            console.error('[RepeatableActionHandler] Paste failed:', error);
            throw error;
        }
    }

    /**
     * Repeatable 요소 삭제
     */
    async delete(element: HTMLElement): Promise<void> {
        console.log('[RepeatableActionHandler] Deleting repeatable element');
        
        if (!this.canHandle(element, 'repeatable')) {
            throw new Error('Element is not a valid repeatable element');
        }

        try {
            // 히스토리 상태 저장
            this.saveHistoryState();
            
            // 애니메이션과 함께 삭제
            const animation = element.animate([
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(0.9)', opacity: 0 }
            ], {
                duration: 200,
                easing: 'ease-out'
            });
            
            animation.onfinish = () => {
                element.remove();
                this.updateHistoryState();
            };
            
            console.log('[RepeatableActionHandler] Element deletion started');
        } catch (error) {
            console.error('[RepeatableActionHandler] Delete failed:', error);
            throw error;
        }
    }

    /**
     * 새로운 요소에 이벤트 리스너 추가 (하이드레이션)
     */
    private hydrateNewElement(element: HTMLElement): void {
        // 이는 상위 컴포넌트의 hydrateNewElement 함수를 호출해야 함
        // 여기서는 커스텀 이벤트로 알림
        element.dispatchEvent(new CustomEvent('needsHydration', {
            bubbles: true,
            detail: { element }
        }));
    }

    /**
     * 히스토리 상태 저장
     */
    private saveHistoryState(): void {
        // 이는 상위 컴포넌트의 historyManager를 사용해야 함
        // 여기서는 커스텀 이벤트로 알림
        document.dispatchEvent(new CustomEvent('saveHistoryState', {
            detail: { source: 'RepeatableActionHandler' }
        }));
    }

    /**
     * 히스토리 상태 업데이트
     */
    private updateHistoryState(): void {
        // 이는 상위 컴포넌트의 updateHistoryState 함수를 호출해야 함
        // 여기서는 커스텀 이벤트로 알림
        document.dispatchEvent(new CustomEvent('updateHistoryState', {
            detail: { source: 'RepeatableActionHandler' }
        }));
    }

    /**
     * 요소에 애니메이션 적용
     */
    private animateElement(element: HTMLElement, keyframes: Keyframe[]): void {
        element.animate(keyframes, {
            duration: 300,
            easing: 'ease-out'
        });
    }

    /**
     * 클립보드에 요소가 있는지 확인
     */
    hasClipboardContent(): boolean {
        return this.copiedElement !== null;
    }

    /**
     * 클립보드 내용 초기화
     */
    clearClipboard(): void {
        this.copiedElement = null;
    }
}