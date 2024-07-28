import { FSDB } from 'file-system-db';
export const db = new FSDB('./db.json', true);
