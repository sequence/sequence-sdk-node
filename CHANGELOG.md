# Sequence Node SDK changelog

## 1.0.4 (20180119)

- New interface `ledger.actions.list` and `ledger.actions.sum` available.
    See https://dashboard.seq.com/docs/actions for more information.
- Improve retry logic for network errors.
- Codebase converted to TypeScript. TypeScript types are exported and available
  to SDK users who import the `sequence` module.
- Prettier linting applied to source code.

## 1.0.3 (20171021)

- Fixed a bug that affected refresh tokens and consequently all requests.

## 1.0.2 (20171020)

- Added support for new access control permissions. When creating a client, you
    now provide `ledger` and `credential` options to connect to a
    specific ledger.

    Authentication with the previous style of access tokens has been removed.

    See https://dashboard.seq.com/docs/5-minute-guide#instantiate-sdk-client for
    more information.

## 1.0.1 (20170921)

- Removed the `ttl` property from the `TransactionBuilder` class.