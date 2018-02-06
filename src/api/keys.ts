import * as uuid from 'uuid'
import { Client } from '../client'
import { Consumer, ObjectCallback, PageCallback, sharedAPI } from '../shared'

/**
 * Cryptographic private keys are the primary authorization mechanism on a
 * blockchain.
 *
 * More info: {@link https://dashboard.seq.com/docs/keys}
 *
 * @typedef {Object} Key
 * @global
 *
 * @property {String} alias
 * **Deprecated. Use id instead.**
 * User specified, unique identifier of the key.
 *
 * @property {String} id
 * Unique identifier of the key.
 */

/**
 * API for interacting with {@link Key keys}.
 *
 * More info: {@link https://dashboard.seq.com/docs/keys}
 * @module KeysApi
 */

export const keysAPI = (client: Client) => {
  return {
    /**
     * Create a new key.
     *
     * @param {Object} params - Parameters for key creation.
     * @param {String} params.id - Unique identifier. Will be auto-generated if
     *   not provided.
     * @param {String} params.alias - **Deprecated. Use id instead.** User
     *   specified, unique identifier.
     * @param {objectCallback} [callback] - Optional callback. Use instead of Promise return value as desired.
     * @returns {Promise<Key>} Newly created key.
     */
    create: (params?: { id?: string; alias?: string }, cb?: ObjectCallback) => {
      return sharedAPI.tryCallback(client.request('/create-key', params), cb)
    },

    /**
     * Get one page of keys, optionally filtered to specified ids.
     *
     * <b>NOTE</b>: The <code>filter</code> parameter of {@link Query} is unavailable for keys.
     *
     * @param {Object} params - Filter and pagination information.
     * @param {Array.<string>} params.ids - List of requested ids, max 200.
     * @param {Array.<string>} params.aliases - **Deprecated. Use ids instead.**
     *   List of requested aliases, max 200.
     * @param {Number} params.pageSize - Number of items to return in result set.
     * @param {pageCallback} [callback] - Optional callback. Use instead of Promise return value as desired.
     * @returns {Promise<Page<Key>>} Requested page of results.
     */
    queryPage: (
      params: { ids?: string[]; aliases?: string[]; pageSize?: number },
      cb?: PageCallback
    ) => {
      if (Array.isArray(params.aliases) && params.aliases.length > 0) {
        params.pageSize = params.aliases.length
      }
      if (Array.isArray(params.ids) && params.ids.length > 0) {
        params.pageSize = params.ids.length
      }

      return sharedAPI.queryPage(
        client,
        'keys',
        'queryPage',
        '/list-keys',
        params,
        { cb }
      )
    },

    /**
     * Iterate over all keys matching the specified query, calling the
     * supplied consume callback once per item.
     *
     * @param {Object} params= - Filter and pagination information.
     * @param {Array.<string>} params.ids - List of requested ids, max 200.
     * @param {Array.<string>} params.aliases - **Deprecated. Use ids instead.**
     *   List of requested aliases, max 200.
     * @param {QueryProcessor<Account>} consumer - Processing callback.
     * @param {objectCallback} [callback] - Optional callback. Use instead of Promise return value as desired.
     * @returns {Promise} A promise resolved upon processing of all items, or
     *                   rejected on error.
     */
    queryEach: (
      params: { ids?: string[]; aliases?: string[] },
      consumer: Consumer,
      cb?: ObjectCallback
    ) => sharedAPI.queryEach(client, 'keys', params, consumer, { cb }),

    /**
     * Request all keys matching the specified query.
     *
     * <b>NOTE</b>: The <code>filter</code> parameter of {@link Query} is unavailable for keys.
     *
     * @param {Object} params - Filter and pagination information.
     * @param {Array.<string>} params.ids - List of requested ids, max 200.
     * @param {Array.<string>} params.aliases - **Deprecated. Use ids instead.**
     *   List of requested aliases, max 200.
     * @param {objectCallback} [callback] - Optional callback. Use instead of Promise return value as desired.
     * @returns {Promise} A promise resolved upon processing of all items, or
     *                   rejected on error.
     */
    queryAll: (
      params?: { ids?: string[]; aliases?: string[] },
      cb?: ObjectCallback
    ) => sharedAPI.queryAll(client, 'keys', params, { cb }),
  }
}