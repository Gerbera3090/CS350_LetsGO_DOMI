export type ApiMnt001RequestParam = {
  lmId: number;
};
export type ApiMnt001RequestBody = {
  trackerId: number;
  trackTime: Date;
  intensity: number;
};
export type ApiMnt001Response = {
  trackId: number;
};
