// DELETE /monitor/usage-alarm

export type ApiMnt004RequestParam = {};
export type ApiMnt004RequestQuery = {};
export type ApiMnt004RequestBody = {
  lmId: number;
  userId: number;
};

export type ApiMnt004Response = {
  usageAlarmId: number;
};
