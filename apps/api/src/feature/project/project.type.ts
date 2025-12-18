export class Address {
  street?: string;
  city?: string;
  region?: string;
  zip?: string;
  country?: string;
}

export class SocialLinks {
  telegram?: string;
  whatsapp?: string;
  instagram?: string;
  vk?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
}

export class Contacts {
  companyName?: string;
  inn?: string;
  phone?: string;
  email?: string;
}

// export class Contacts {
//   main?: MainContacts;
//   address?: Address;
//   socials?: SocialLinks;
// }

export class EntityField {
  name: string;
  type: string;
  required?: boolean;
  options?: Record<string, any>;
}

export class EntitySchema {
  name: string;
  slug: string;
  fields: EntityField[];
  options?: Record<string, any>;
}

export class ProjectFeatures {
  topLevel: string[];
  cmsFeatures: string[];
  entityFeatures: string[];
  modulesFeatures: string[];
}
