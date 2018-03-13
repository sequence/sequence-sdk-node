import * as uuid from 'uuid'
import { Client } from '../client'
import { Query } from '../query'
import { ObjectCallback, QueryParams } from '../shared'
import { CreateRequest, sharedAPI } from '../shared'

/**
 * More info: {@link https://dashboard.seq.com/docs/feeds}
 * @typedef {Object} Feed
 * @global
 *
 * @property {String} id
 * Unique identifier of the feed.
 *
 * @property {String} type
 * Type of feed, "action" or "transaction".
 *
 * @property {String} filter
 * The query filter used to select matching items.
 *
 * @property {Array<string | number>} filterParams
 * A list of values that will be interpolated into the filter expression.
 *
 * @property {String} cursor
 * The position where the next call to consume should begin.
 */

export interface FeedCreateParameters extends QueryParams {
  type?: string
  id?: string
}

/**
 * API for interacting with {@link Feeds feeds}.
 *
 * More info: {@link https://dashboard.seq.com/docs/feeds}
 * @module FeedsApi
 */
export const feedsAPI = (client: Client) => {
  /**
   * @typedef {Object} createRequest
   *
   * @property {String} id
   * Unique identifier of the feed.
   *
   * @property {String} type
   * Type of feed, "action" or "transaction".
   *
   * @property {String} filter
   * The query filter used to select matching items.
   *
   * @property {Array<string | number>} filterParams
   * A list of values that will be interpolated into the filter expression.
   */

  /**
   * @typedef {Object} deleteRequest
   *
   * @property {String} id
   * Unique identifier of the feed.
   */

  /**
   * @typedef {Object} getRequest
   *
   * @property {String} id
   * Unique identifier of the feed.
   */

  return {
    /**
     * Create a new feed.
     *
     * @param {module:FeedsApi~createRequest} params - Parameters for feed creation.
     * @param {objectCallback} [callback] - Optional callback. Use instead of Promise return value as desired.
     * @returns {Promise<Feed>} Newly created feed.
     */
    create: (params: FeedCreateParameters, cb?: ObjectCallback) =>
      sharedAPI.tryCallback(client.request('/create-feed', params), cb),

    /**
     * Deletes a feed.
     *
     * @param {module:FeedsApi~deleteRequest} params - Parameters for feed deletion.
     * @param {objectCallback} [callback] - Optional callback. Use instead of Promise return value as desired.
     * @returns {Promise} Promise resolved on success.
     */
    delete: (params: { id: string }, cb?: ObjectCallback) =>
      sharedAPI.tryCallback(client.request('/delete-feed', params), cb),

    /**
     * Retrieves a single feed.
     *
     * @param {module:FeedsApi~getRequest} params - Parameters for feed retrieval.
     * @param {objectCallback} [callback] - Optional callback. Use instead of Promise return value as desired.
     * @returns {Promise<Feed>} Requested feed.
     */
    get: (params: { id: string }, cb?: ObjectCallback) =>
      sharedAPI.tryCallback(client.request('/get-feed', params), cb),

    /**
     * Query a list of feeds.
     *
     * @returns {Query} Query to retrieve results.
     */
    list: () => new Query(client, 'feeds', 'list'),
  }
}
