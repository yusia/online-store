class DataService {
  baseLink: string;
  constructor(baseLink: string) {
    this.baseLink = baseLink;
  }

  getResp(
    callback = (data: Response) => {
      console.error('No callback for GET response',data);
    }
  ) {
    this.load(callback);
  }

  errorHandler(res: {
    ok: boolean;
    status: number;
    statusText: string;
    json: () => Promise<object>;
  }) {
    console.log(res);
    if (!res.ok) {
      if (res.status === 401 || res.status === 404)
        console.log(
          `Sorry, but there is ${res.status} error: ${res.statusText}`
        );
      throw Error(res.statusText);
    }

    return res;
  }

  load(callback: (data: Response) => void) {
    fetch(this.baseLink)
      .then(this.errorHandler)
      .then((res) => res.json())
      .then((data) => data as Response)
      .then((data) => callback(data))
      .catch((err) => console.error(err));
  }
  
}

export default DataService;
