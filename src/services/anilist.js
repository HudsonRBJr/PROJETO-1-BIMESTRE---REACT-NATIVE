import axios from 'axios';

const ANILIST_URL = 'https://graphql.anilist.co';

export async function searchAnime({ page = 1, perPage = 10, search = '' }) {
    const query = `
    query ($page: Int, $perPage: Int, $search: String) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage perPage }
        media(search: $search, type: ANIME) {
          id
          title { romaji english native }
          status
          episodes
          description(asHtml: false)
          coverImage { large medium }
          averageScore
        }
      }
    }
  `;
    const variables = { page, perPage, search };

    const res = await axios.post(ANILIST_URL, { query, variables }, {
        headers: { 'Content-Type': 'application/json' }
    });
    return res.data.data.Page;
}
