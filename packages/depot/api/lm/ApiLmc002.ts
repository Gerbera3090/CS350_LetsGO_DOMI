// GET /lms/flms

export type ApiLmc002RequestParam = {};
export type ApiLmc002RequestQuery = {
  userId: number;
};

export type ApiLmc002Response = {
  flms: {
    id: number;
    priority: number;
    floor: number; // floorId가 아니라 몇층인지 다이렉트로
    code: string;
    lmTypeEnum: number;
    reportStatusEnum: number;
    lmStatusEnum: number;
    last: number; // 만약 가동중이면 몇초동안 가동중이었는지 초 단위
    alarmed: boolean;
  }[];
};
