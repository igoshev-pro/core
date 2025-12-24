export type OptionType = {
	key: string;
	label: string;
};

export enum Currency {
	RUB = "RUB",
	USD = "USD",
	EUR = "EUR",
}

export type Field = {
	name: string;
	label?: string;
	placeholder?: string;
	description?: string;
	group?: string;
	widget:
		| "input"
		| "textarea"
		| "select"
		| "checkbox"
		| "radio"
		| "image"
		| "object"
		| "array"
		| "entity";
	required?: boolean;
	options?: string[];
	fields?: Record<string, Field[]>;
	itemFields?: Field[];
	// entity-виджет
	entity?: string; // например 'user'
	valueKey?: string; // по умолчанию 'id' | '_id'
	labelKey?: string; // по умолчанию 'name' | 'email'
	avatarKey?: string; // для отображения аватара
};

export type Schema = {
	title: string; // <- обязательный по твоей сигнатуре
	groups: Record<string, Field[]>;
};