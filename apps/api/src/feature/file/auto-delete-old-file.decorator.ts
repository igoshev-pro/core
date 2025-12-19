import { SetMetadata } from '@nestjs/common';

export const AUTO_DELETE_OLD_FILE = 'autoDeleteOldFile';

/**
 * @param fields - список полей, которые нужно отслеживать (строки или массивы)
 */
export const AutoDeleteOldFile = (...fields: string[]) =>
  SetMetadata(AUTO_DELETE_OLD_FILE, fields);
