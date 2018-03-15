/* eslint-env mocha */

import * as assert from 'assert'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import 'mocha'
import * as uuid from 'uuid'

chai.use(chaiAsPromised)
const expect = chai.expect

import { testHelpers } from './testHelpers'

const { client, createAccount, createFlavor } = testHelpers

describe('Feed', () => {
  it('creates action feed', async () => {
    const feed = await client.feeds.create({
      type: 'action',
      id: `actionFeed-${uuid.v4()}`,
      filter: 'tags.type=$1',
      filterParams: ['test'],
    })
    expect(feed.type).to.equal('action')
  })

  it('creates transaction feed', async () => {
    const feed = await client.feeds.create({
      type: 'transaction',
      id: `transactionFeed-${uuid.v4()}`,
      filter: "actions(type='issue')",
    })
    expect(feed.type).to.equal('transaction')
  })

  it('retrieves feed by id', async () => {
    const feedId = `actionFeed-${uuid.v4()}`
    await client.feeds.create({
      type: 'action',
      id: feedId,
      filter: 'tags.type=$1',
      filterParams: ['test'],
    })

    const feed = await client.feeds.get({ id: feedId })
    expect(feed.type).to.equal('action')
    expect(feed.id).to.equal(feedId)
  })

  it('deletes feed by id', async () => {
    const feedId = `actionFeed-${uuid.v4()}`
    await client.feeds.create({
      type: 'action',
      id: feedId,
      filter: 'tags.type=$1',
      filterParams: ['test'],
    })

    const resp = await client.feeds.delete({ id: feedId })
    expect(resp.message).to.equal('ok')
    expect(client.feeds.get({ id: feedId } as any)).to.be.rejectedWith('SEQ002')
  })

  it('lists feeds', async () => {
    const actionFeed = await client.feeds.create({
      type: 'action',
      id: `actionFeed-${uuid.v4()}`,
    })

    const transactionFeed = await client.feeds.create({
      type: 'transaction',
      id: `transactionFeed-${uuid.v4()}`,
    })

    const items: any[] = []
    await client.feeds.list().all(item => items.push(item.id))
    expect(items).to.include(actionFeed.id, transactionFeed.id)
  })

  it('consumes an action/transaction feed', async () => {
    const goldId: any = (await createFlavor('gold')).id
    const bobId: any = (await createAccount('bob')).id
    const tag: string = uuid.v4()
    const actionFeed = await client.feeds.create({
      type: 'action',
      id: `actionFeed-${uuid.v4()}`,
      filter: 'tags.type=$1',
      filterParams: [tag],
    })
    const transactionFeed = await client.feeds.create({
      type: 'transaction',
      id: `transactionFeed-${uuid.v4()}`,
      filter: 'actions(tags.type=$1)',
      filterParams: [tag],
    })

    const actionFeedItems: any[] = []
    actionFeed.consume((action: any, next: any, stop: any) => {
      actionFeedItems.push(action.id)
      actionFeedItems.length === 2 ? stop(true) : next(true)
    })

    const transactionFeedItems: any[] = []
    transactionFeed.consume((transaction: any, next: any, stop: any) => {
      transactionFeedItems.push(transaction.id)
      transactionFeedItems.length === 2 ? stop(true) : next(true)
    })

    const tx1 = await client.transactions.transact(builder => {
      builder.issue({
        flavorId: goldId,
        amount: 400,
        destinationAccountId: bobId,
        actionTags: { type: tag },
      })
    })
    const tx2 = await client.transactions.transact(builder => {
      builder.issue({
        flavorId: goldId,
        amount: 100,
        destinationAccountId: bobId,
        actionTags: { type: tag },
      })
    })

    // TODO we can't await a Promise returned by consume,
    // but would like to
    while (actionFeedItems.length <= 2) {
      return true
    }
    while (transactionFeedItems.length <= 2) {
      return true
    }

    expect(actionFeedItems).to.deep.equal([
      tx1.actions[0].id,
      tx2.actions[0].id,
    ])
    expect(transactionFeedItems).to.deep.equal([tx1.id, tx2.id])
  })
})
