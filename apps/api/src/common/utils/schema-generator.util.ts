import 'reflect-metadata';
import { getMetadataStorage as getValidationMetadataStorage } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { getUiMeta } from '../decorators/ui-schema.decorator';

export function generateSchemaFromDto(dtoClass: any): any {
  const instance = plainToInstance(dtoClass, {});
  const validationStorage = getValidationMetadataStorage();
  const schema: any = { title: dtoClass.name, groups: {} };
  const uiMeta = getUiMeta(dtoClass);

  const validationMetas = validationStorage.getTargetValidationMetadatas(
    dtoClass,
    '',
    false,
    false,
  );

  const groupedByField = new Map<string, any[]>();
  for (const meta of validationMetas) {
    const metas = groupedByField.get(meta.propertyName) || [];
    metas.push(meta);
    groupedByField.set(meta.propertyName, metas);
  }

  for (const [fieldName, metas] of groupedByField) {
    const fieldMeta = uiMeta[fieldName] || {};

    const groupName = fieldMeta.group || 'Без группы';
    if (!schema.groups[groupName]) schema.groups[groupName] = [];

    const alreadyExists = schema.groups[groupName].some(
      (f: any) => f.name === fieldName,
    );
    if (alreadyExists) continue;

    const field: any = {
      name: fieldName,
      label: fieldMeta.label || fieldName,
      widget: fieldMeta.widget || 'input',
      placeholder: fieldMeta.placeholder,
      options: fieldMeta.options,
      required: false,
      order: fieldMeta.order ?? 0,
      entity: fieldMeta.entity,
    };

    const enumMeta = metas.find((m) => m.type === 'isEnum');
    if (enumMeta) {
      field.widget = 'select';
      field.options = Object.values(enumMeta.constraints[0]);
    }

    const isRequired = metas.some((m) =>
      ['isNotEmpty', 'isDefined'].includes(m.type),
    );
    if (isRequired) field.required = true;

    // Тип поля
    const reflectedType = Reflect.getMetadata(
      'design:type',
      //@ts-ignore
      instance,
      fieldName,
    );

    // @Type(() => SomeDto)
    const nestedMeta = metas.find((m) => m.type === 'validateNested');
    const isArray = metas.some((m) => m.type === 'isArray');

    let nestedType: any;

    if (nestedMeta) {
      const typeFn = (nestedMeta as any)?.constraints?.[0]?.reflectedType;
      nestedType = typeFn || reflectedType;
    }

    if (nestedMeta && nestedType) {
      if (isArray) {
        field.widget = 'array';
        field.itemFields = generateSchemaFromDto(nestedType).groups;
      } else {
        field.widget = 'object';
        field.fields = generateSchemaFromDto(nestedType).groups;
      }
    }

    // Добавленное: ручное указание вложенного DTO через `@UiSchema({ dto: ... })`
    if (fieldMeta.dto) {
      field.fields = generateSchemaFromDto(fieldMeta.dto).groups;
    }

    schema.groups[groupName].push(field);
  }

  for (const group of Object.keys(schema.groups)) {
    schema.groups[group].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  return schema;
}
