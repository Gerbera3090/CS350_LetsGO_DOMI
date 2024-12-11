// DELETE /monitor/report-alarm

export type ApiMnt006RequestParam = {};
export type ApiMnt006RequestQuery = {};
export type ApiMnt006RequestBody = {
  lmId: number;
  userId: number;
};

export type ApiMnt006Response = {
  reserveAlarmId: number;
};
