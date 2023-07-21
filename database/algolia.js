import algoliasearch from 'algoliasearch';

const client = algoliasearch(
  "TGYB99491G",
  "f913efb4d374cd449127ca56572c0a9f"
);

const index = client.initIndex('kronikea-search');
const charactersIndex = client.initIndex('kronikea-search-characters')
const usersIndex = client.initIndex('kronikea-search-users')
export { index, charactersIndex, usersIndex };