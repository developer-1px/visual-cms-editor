import type { ActionHandler, SelectionActionManager as ISelectionActionManager, ActionType } from './interfaces';

/**
 * 중앙 집중식 Selection Action Manager
 * 전략 패턴을 사용하여 다양한 타입의 액션 핸들러를 관리
 */
export class SelectionActionManager implements ISelectionActionManager {
    private handlers = new Map<string, ActionHandler>();

    /**
     * 액션 핸들러 등록
     */
    registerHandler(handler: ActionHandler): void {
        if (this.handlers.has(handler.type)) {
            console.warn(`Handler for type '${handler.type}' already exists. Replacing...`);
        }
        
        this.handlers.set(handler.type, handler);
        console.log(`[SelectionActionManager] Registered handler: ${handler.type}`);
    }

    /**
     * 액션 핸들러 제거
     */
    unregisterHandler(type: string): void {
        if (this.handlers.has(type)) {
            this.handlers.delete(type);
            console.log(`[SelectionActionManager] Unregistered handler: ${type}`);
        } else {
            console.warn(`[SelectionActionManager] No handler found for type: ${type}`);
        }
    }

    /**
     * 주어진 요소와 선택 타입에 대한 적절한 핸들러 찾기
     */
    private findHandler(element: HTMLElement, selectionType: string): ActionHandler | null {
        for (const handler of this.handlers.values()) {
            if (handler.canHandle(element, selectionType)) {
                return handler;
            }
        }
        return null;
    }

    /**
     * 액션 실행
     */
    async executeAction(action: ActionType, element: HTMLElement, selectionType: string): Promise<void> {
        console.log(`[SelectionActionManager] Executing ${action} for ${selectionType}`);
        
        const handler = this.findHandler(element, selectionType);
        
        if (!handler) {
            const errorMsg = `No handler found for selection type: ${selectionType}`;
            console.error(`[SelectionActionManager] ${errorMsg}`);
            throw new Error(errorMsg);
        }

        try {
            switch (action) {
                case 'copy':
                    await handler.copy(element);
                    break;
                case 'cut':
                    await handler.cut(element);
                    break;
                case 'paste':
                    await handler.paste(element);
                    break;
                case 'delete':
                    await handler.delete(element);
                    break;
                default:
                    throw new Error(`Unknown action: ${action}`);
            }
            
            console.log(`[SelectionActionManager] Successfully executed ${action} for ${selectionType}`);
        } catch (error) {
            console.error(`[SelectionActionManager] Action failed: ${action} for ${selectionType}`, error);
            throw error;
        }
    }

    /**
     * 특정 타입에 대한 핸들러 존재 여부 확인
     */
    hasHandler(selectionType: string): boolean {
        return Array.from(this.handlers.values()).some(handler => 
            handler.canHandle(document.createElement('div'), selectionType)
        );
    }

    /**
     * 등록된 모든 핸들러 타입 반환
     */
    getRegisteredTypes(): string[] {
        return Array.from(this.handlers.keys());
    }

    /**
     * 디버깅을 위한 상태 정보 출력
     */
    debugInfo(): void {
        console.log('[SelectionActionManager] Debug Info:');
        console.log('Registered handlers:', this.getRegisteredTypes());
        
        for (const [type, handler] of this.handlers) {
            console.log(`- ${type}: ${handler.constructor.name}`);
        }
    }
}

// 싱글톤 인스턴스 생성
export const selectionActionManager = new SelectionActionManager();