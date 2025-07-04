import type { EditablePlugin, EditableAction } from '../interfaces';
import { selectionManager } from '$lib/core/selection/SelectionManager';

export const imagePlugin: EditablePlugin = {
	config: {
		type: 'image',
		name: 'Image Editor',
		description: 'Editable image content with upload and management',
		defaultConstraints: {
			allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
			maxSize: 5242880, // 5MB
			minWidth: 100,
			minHeight: 100
		}
	},

	init(element: HTMLElement): void {
		element.setAttribute('data-image-plugin', 'true');
		this.setupImageContainer(element);
	},

	destroy(element: HTMLElement): void {
		element.removeAttribute('data-image-plugin');
	},

	onClick(element: HTMLElement): void {
		// Check if element is already selected by looking for selection manager styles
		const isSelected = this.isElementSelected(element);

		if (isSelected) {
			// If already selected, open file dialog for upload/replace
			this.openFileDialog(element);
		}
		// If not selected, let the selection manager handle selection first
		// File dialog will be triggered on next click when selected
	},

	onDoubleClick(element: HTMLElement): void {
		// Open file dialog on double click
		this.openFileDialog(element);
	},

	getValue(element: HTMLElement): string {
		// Now element is the container, find the img inside
		const img = element.querySelector('.content-image') as HTMLImageElement;
		return img?.src || '';
	},

	setValue(element: HTMLElement, value: string): void {
		// Now element is the container, find the img and placeholder inside
		const img = element.querySelector('.content-image') as HTMLImageElement;
		const placeholder = element.querySelector('.image-placeholder') as HTMLElement;

		if (img) {
			if (value) {
				img.src = value;
				img.style.display = 'block';
				if (placeholder) {
					placeholder.style.display = 'none';
				}
			} else {
				img.src = '';
				img.style.display = 'none';
				if (placeholder) {
					placeholder.style.display = 'flex';
				}
			}
		}
	},

	isEmpty(element: HTMLElement): boolean {
		// Now element is the container, find the img inside
		const img = element.querySelector('.content-image') as HTMLImageElement;
		return !img?.src || img.src === '';
	},

	clear(element: HTMLElement): void {
		this.setValue(element, '');
	},

	validate(element: HTMLElement, file: File): { valid: boolean; message?: string } {
		const constraints = this.getConstraints(element);

		// Check file size
		if (constraints.maxSize && file.size > constraints.maxSize) {
			return {
				valid: false,
				message: `File size exceeds maximum of ${this.formatFileSize(constraints.maxSize)}`
			};
		}

		// Check file format
		if (constraints.allowedFormats) {
			const fileExtension = file.name.split('.').pop()?.toLowerCase();
			if (fileExtension && !constraints.allowedFormats.includes(fileExtension)) {
				return {
					valid: false,
					message: `File format not allowed. Allowed formats: ${constraints.allowedFormats.join(', ')}`
				};
			}
		}

		return { valid: true };
	},

	getActions(element: HTMLElement): EditableAction[] {
		return [
			{
				id: 'upload',
				label: 'Upload Image',
				icon: 'upload',
				handler: () => this.openFileDialog(element)
			},
			{
				id: 'replace',
				label: 'Replace Image',
				icon: 'refresh',
				handler: () => this.openFileDialog(element),
				isAvailable: () => !this.isEmpty(element)
			},
			{
				id: 'copy',
				label: 'Copy Image',
				icon: 'copy',
				handler: () => this.copyImage(element),
				isAvailable: () => !this.isEmpty(element)
			},
			{
				id: 'cut',
				label: 'Cut Image',
				icon: 'scissors',
				handler: () => this.cutImage(element),
				isAvailable: () => !this.isEmpty(element)
			},
			{
				id: 'paste',
				label: 'Paste Image',
				icon: 'clipboard',
				handler: () => this.pasteImage(element),
				isAvailable: () => this.hasImageInClipboard()
			},
			{
				id: 'delete',
				label: 'Remove Image',
				icon: 'trash',
				handler: () => this.deleteImage(element),
				isDestructive: true,
				isAvailable: () => !this.isEmpty(element)
			}
		];
	},

	applyStyles(element: HTMLElement, selected: boolean): void {
		if (selected) {
			// Now element is the container itself
			element.style.outline = '2px solid rgb(251, 146, 60)';
			element.style.outlineOffset = '2px';
			element.style.backgroundColor = 'rgba(251, 146, 60, 0.1)';
		}
	},

	removeStyles(element: HTMLElement): void {
		// Now element is the container itself
		element.style.outline = '';
		element.style.outlineOffset = '';
		element.style.backgroundColor = '';
	},

	// Private methods
	isElementSelected(element: HTMLElement): boolean {
		// Check if element is currently selected in the selection manager
		return selectionManager.isSelected(element, 'image', 'canvas');
	},

	setupImageContainer(element: HTMLElement): void {
		// Now element is the container itself, no need to find parent
		// The container click is handled by the main click handler in the selection system
	},

	getPlaceholder(element: HTMLElement): HTMLElement | null {
		// Now element is the container, find placeholder inside
		return (element.querySelector('.image-placeholder') as HTMLElement) || null;
	},

	openFileDialog(element: HTMLElement): void {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';

		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				const validation = this.validate(element, file);
				if (!validation.valid) {
					alert(validation.message);
					return;
				}

				try {
					const dataUrl = await this.fileToDataUrl(file);
					this.setValue(element, dataUrl);

					// Trigger change event for history tracking
					element.dispatchEvent(
						new CustomEvent('imageChanged', {
							detail: { src: dataUrl, file }
						})
					);
				} catch (error) {
					console.error('Error loading image:', error);
					alert('Failed to load image');
				}
			}
		};

		input.click();
	},

	fileToDataUrl(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	},

	getConstraints(element: HTMLElement): Record<string, any> {
		const constraintsAttr = element.getAttribute('data-constraints');
		if (constraintsAttr) {
			try {
				return JSON.parse(constraintsAttr);
			} catch {
				// Ignore invalid JSON
			}
		}
		return this.config.defaultConstraints || {};
	},

	formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	},

	// Image clipboard storage
	imageClipboard: null as string | null,

	copyImage(element: HTMLElement): void {
		const imageUrl = this.getValue(element);
		if (imageUrl) {
			this.imageClipboard = imageUrl;

			// Visual feedback
			element.animate(
				[
					{ transform: 'scale(1)', opacity: 1 },
					{ transform: 'scale(1.05)', opacity: 0.8 },
					{ transform: 'scale(1)', opacity: 1 }
				],
				{
					duration: 300,
					easing: 'ease-out'
				}
			);

			// Also copy to system clipboard as data URL
			try {
				navigator.clipboard.writeText(imageUrl);
			} catch (error) {
				console.warn('Failed to copy image URL to clipboard:', error);
			}
		}
	},

	cutImage(element: HTMLElement): void {
		const imageUrl = this.getValue(element);
		if (imageUrl) {
			// First copy the image
			this.imageClipboard = imageUrl;

			// Also copy to system clipboard as data URL
			try {
				navigator.clipboard.writeText(imageUrl);
			} catch (error) {
				console.warn('Failed to copy image URL to clipboard:', error);
			}

			// Then clear the image
			this.setValue(element, '');

			// Trigger change event for history tracking
			element.dispatchEvent(
				new CustomEvent('imageChanged', {
					detail: { src: '', action: 'cut' }
				})
			);

			// Visual feedback
			element.animate(
				[
					{ transform: 'scale(1)', opacity: 1 },
					{ transform: 'scale(0.95)', opacity: 0.5 },
					{ transform: 'scale(1)', opacity: 1 }
				],
				{
					duration: 300,
					easing: 'ease-out'
				}
			);
		}
	},

	pasteImage(element: HTMLElement): void {
		if (this.imageClipboard) {
			this.setValue(element, this.imageClipboard);

			// Trigger change event for history tracking
			element.dispatchEvent(
				new CustomEvent('imageChanged', {
					detail: { src: this.imageClipboard, action: 'paste' }
				})
			);

			// Visual feedback
			element.animate(
				[
					{ transform: 'scale(0.9)', opacity: 0.5 },
					{ transform: 'scale(1)', opacity: 1 }
				],
				{
					duration: 300,
					easing: 'ease-out'
				}
			);
		}
	},

	deleteImage(element: HTMLElement): void {
		if (!this.isEmpty(element)) {
			// Visual feedback before deletion
			element.animate(
				[
					{ transform: 'scale(1)', opacity: 1 },
					{ transform: 'scale(0.9)', opacity: 0.3 },
					{ transform: 'scale(1)', opacity: 1 }
				],
				{
					duration: 300,
					easing: 'ease-out'
				}
			);

			// Clear the image
			this.setValue(element, '');

			// Trigger change event for history tracking
			element.dispatchEvent(
				new CustomEvent('imageChanged', {
					detail: { src: '', action: 'delete' }
				})
			);
		}
	},

	hasImageInClipboard(): boolean {
		return this.imageClipboard !== null;
	}
};
