import ProductResponseInterface from '../interfaces/productResponse.inteface';

class DataService {
  baseLink: string;
  constructor(baseLink: string) {
    this.baseLink = baseLink;
  }

  async getProducts() {
    return this.load(this.baseLink + '?limit=100')
      .then((data) => data as ProductResponseInterface)
      .then((data) => data.products);
  }

  async getCategoties() {
    return this.load(this.baseLink + '/categories');
  }

  errorHandler(res: {
    ok: boolean;
    status: number;
    statusText: string;
    json: () => Promise<object>;
  }) {
    if (!res.ok) {
      if (res.status === 401 || res.status === 404)
        console.log(
          `Sorry, but there is ${res.status} error: ${res.statusText}`
        );
      throw Error(res.statusText);
    }

    return res;
  }

  async load(link: string) {
    const response = await fetch(link);
    return response.json();
  }
}

export default DataService;
