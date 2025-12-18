import 'reflect-metadata';

export const UI_METADATA_KEY = 'ui:meta';

export type UiMeta = {
  label?: string;
  widget?: string; // string | textarea | color | select и т.д.
  placeholder?: string;
  hidden?: boolean;
  options?: any[];
  group?: string;
  order?: number;
  dto?: any;
  entity?: 'user' | string; // пока достаточно 'user', дальше расширим
  valueKey?: string; // по умолчанию 'id' | '_id'
  labelKey?: string; // по умолчанию 'name' | 'email'
};

export function UiSchema(meta: UiMeta): PropertyDecorator {
  return (target, propertyKey) => {
    const existingMeta =
      Reflect.getMetadata(UI_METADATA_KEY, target.constructor) || {};
    Reflect.defineMetadata(
      UI_METADATA_KEY,
      { ...existingMeta, [propertyKey]: meta },
      target.constructor,
    );
  };
}

export function getUiMeta(target: any): Record<string, UiMeta> {
  return Reflect.getMetadata(UI_METADATA_KEY, target) || {};
}
