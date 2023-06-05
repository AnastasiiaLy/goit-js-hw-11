const API_KEY = '36895134-9b9dfb2f5d96a62d5aae70f5d';

const BASE_URL = 'https://pixabay.com/api/';

const axios = require('axios').default;

export default class PicturesApiService {
  constructor() {
    this.searchQuery = ''; //8
    this.page = 1;
  }

  async fetchImages() {
    try {
      const response = await axios.get(
        `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=20`
      );
      this.page += 1;
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
