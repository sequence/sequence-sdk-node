import * as uuid from 'uuid'
import { Client } from '../client'
import { Consumer, ObjectCallback, PageCallback, QueryParams } from '../shared'
import { CreateRequest, sharedAPI, UpdateTagsRequest } from '../shared'

/**
 * An account is an object in Chain Core that tracks ownership of assets on a
 * blockchain by creating and tracking control programs.
 *
 * More info: {@link https://dashboard.seq.com/docs/accounts}
 * @typedef {Object} Account
 * @global
 *
 * @property {String} id
 * Unique identifier of the account.
 *
 * @property {String} alias
 * **Deprecated. Use id instead.**
 * User specified, unique identifier.
 *
 * @property {Key[]} keys
 * The list of keys used to create control programs under the account.
 * Signatures from these keys are required for spending funds held in the account.
 *
 * @property {Number} quorum
 * The number of keys required to sign transactions for the account.
 *
 * @property {Object} tags
 * User-specified tag structure for the account.
 */

/**
 * API for interacting with {@link Account accounts}.
 *
 * More info: {@link https://dashboard.seq.com/docs/accounts}
 * @module AccountsApi
 */
export const accountsAPI = (client: Client) => {
  /**
   * @typedef {Object} createRequest
   *
   * @property {String} [id]
   * Unique identifier. Will be auto-generated if not provided.
   *
   * @property {String} [alias]
   * **Deprecated. Use id instead.**
   * User specified, unique identifier.
   *
   * @property {Key[]} keys
   * The list of keys used to create control programs under the account. Keys
   * are objects with either an `id` or `alias` field.
   *
   * @property {Number} [quorum]
   * The number of keys required to sign transactions for the account. Defaults
   * to the size of rootXpubs.
   *
   * @property {Object} [tags]
   * User-specified tag structure for the account.
   */

  /**
   * @typedef {Object} updateTagsRequest
   *
   * @property {String} [id]
   * The account ID. Either the ID or alias must be specified, but not both.
   *
   * @property {String} [alias]
   * **Deprecated. Use id instead.**
   * The account alias. Either the ID or alias must be specified, but not both.
   *
   * @property {Object} tags
   * A new set of tags, which will replace the existing tags.
   */

  return {
    /**
     * Create a new account.
     *
     * @param {module:AccountsApi~createRequest} params - Parameters for account creation.
     * @param {objectCallback} [callback] - Optional callback. Use instead of Promise return value as desired.
     * @returns {Promise<Account>} Newly created account.
     */
    create: (params: CreateRequest, cb?: ObjectCallback) =>
      sharedAPI.tryCallback(client.request('/create-account', params), cb),

    /**
     * Update account tags.
     *
     * @param {module:AccountsApi~updateTagsRequest} params - Parameters for updating account tags.
     * @param {objectCallback} [cb] - Optional callback. Use instead of Promise return value as desired.
     * @returns {Promise<Object>} Success message.
     */
    updateTags: (params: UpdateTagsRequest, cb?: ObjectCallback) =>
      sharedAPI.tryCallback(client.request('/update-account-tags', params), cb),

    /**
     * Get one page of accounts matching the specified query.
     *
     * @param {Object} params={} - Filter and pagination information.
     * @param {String} params.filter - Filter string, see {@link https://dashboard.seq.com/docs/queries}.
     * @param {Array<String|Number>} params.filterParams - Parameter values for filter string (if needed).
     * @param {Number} params.pageSize - Number of items to return in result set.
     * @param {pageCallback} [callback] - Optional callback. Use instead of Promise return value as desired.
     * @returns {Promise<Page<Account>>} Requested page of results.
     */
    queryPage: (params?: QueryParams, cb?: PageCallback) =>
      sharedAPI.queryPage(
        client,
        'accounts',
        'queryPage',
        '/list-accounts',
        params,
        { cb }
      ),

    /**
     * Iterate over all accounts matching the specified query, calling the
     * supplied consume callback once per item.
     *
     * @param {Object} params={} - Filter and pagination information.
     * @param {String} params.filter - Filter string, see {@link https://dashboard.seq.com/docs/queries}.
     * @param {Array<String|Number>} params.filterParams - Parameter values for filter string (if needed).
     * @param {Number} params.pageSize - Number of items to return in result set.
     * @param {QueryProcessor<Account>} processor - Processing callback.
     * @param {objectCallback} [callback] - Optional callback. Use instead of Promise return value as desired.
     * @returns {Promise} A promise resolved upon processing of all items, or
     *                   rejected on error.
     */
    queryEach: (params: object, consumer: Consumer, cb?: ObjectCallback) =>
      sharedAPI.queryEach(client, 'accounts', params, consumer, { cb }),

    /**
     * Fetch all accounts matching the specified query.
     *
     * @param {Object} params={} - Filter and pagination information.
     * @param {String} params.filter - Filter string, see {@link https://dashboard.seq.com/docs/queries}.
     * @param {Array<String|Number>} params.filterParams - Parameter values for filter string (if needed).
     * @param {Number} params.pageSize - Number of items to return in result set.
     * @param {objectCallback} [callback] - Optional callback. Use instead of Promise return value as desired.
     * @returns {Promise<Account[]>} A promise resolved upon processing of all items, or
     *                   rejected on error.
     */
    queryAll: (params?: QueryParams, cb?: ObjectCallback) =>
      sharedAPI.queryAll(client, 'accounts', params, { cb }),
  }
}