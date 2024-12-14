// GET lms/

export type ApiLmc001RequestParam = {};
export type ApiLmc001RequestQuery = {
  userId: number;
  dormitoryFloorId: number;
};

export type ApiLmc001Response = {
  lms: {
    id: number;
    lmTypeEnum: number;
    lmStatusEnum: number;
    reportStatusEnum: number;
    code: string;
    last: number; // 만약 가동중이면 몇초동안 가동중이었는지 초 단위
    alarmed: boolean;
    isFLM: boolean; // FLM인지 아닌지
  }[];
};
