// POST /monitor/usage-alarm

export type ApiMnt003RequestParam = {};
export type ApiMnt003RequestQuery = {};
export type ApiMnt003RequestBody = {
  lmId: number;
  userId: number;
};

export type ApiMnt003Response = {
  usageAlarmId: number;
};
