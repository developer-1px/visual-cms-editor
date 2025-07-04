export interface Template {
	id: string;
	name: string;
	description: string;
	category: 'hero' | 'features' | 'cta' | 'content' | 'testimonial' | 'pricing';
	html: string;
	thumbnail?: string;
	editableElements: EditableElement[];
}

export interface EditableElement {
	selector: string;
	type: 'text' | 'image' | 'icon' | 'link';
	defaultValue: string;
	constraints?: {
		maxLength?: number;
		minLength?: number;
		allowedFormats?: string[];
	};
}

export interface TemplateToComponentOptions {
	preserveStyles?: boolean;
	addEditableMarkers?: boolean;
	generateProps?: boolean;
}
