/**
 * @typedef {Object} SQLFieldSchema
 * @property {string} name Name of the field
 * @property {string} type Data type of the field
 * Contains a type definition for a field in the query response
 */
type SQLFieldSchema = {
  name: string;
  type: string;
};
/**
 * @typedef {Object} SQLQueryMeta
 * @property {boolean} cachehit Whether the provided query response was a cached response or not
 * @property {number} totalBytesProcessed Number of bytes of the query string (best guess)
 * @property {string} location Location of the server that performed the query (best guess)
 * Contains metadata related to the performed query
 */
type SQLQueryMeta = {
  cachehit: boolean;
  totalBytesProcessed: number;
  location: string;
};
/**
 * @typedef {Object} SQLQueryParams
 * @property {T[]} rows Data rows received from the query
 * @property {SQLFieldSchema[]} schema Query response field types
 * @property {SQLQueryMeta} meta Metadata related to the performed query
 * Models the query response, it is created with a generic type T that allows the information (rows) to be typed per request type
 */
export type SQLQueryResponse<T> = {
  rows: T[];
  schema: SQLFieldSchema[];
  meta: SQLQueryMeta;
};
