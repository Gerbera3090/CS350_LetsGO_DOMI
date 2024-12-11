// GET /dormitories/floors

export type ApiDor001RequestParam = {};
export type ApiDor001RequestQuery = {
  dormitoryId: number;
};

export type ApiDor001Response = {
  floors: {
    id: number;
    floor: number;
  }[];
};
