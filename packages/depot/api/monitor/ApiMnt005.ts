// POST /monitor/report-alarm

export type ApiMnt005RequestParam = {};
export type ApiMnt005RequestQuery = {};
export type ApiMnt005RequestBody = {
  lmId: number;
  userId: number;
};

export type ApiMnt005Response = {
  reserveAlarmId: number;
};
