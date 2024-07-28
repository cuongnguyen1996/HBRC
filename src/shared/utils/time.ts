export const sleep = async (milliSecs: number) => {
  return new Promise((res) => setTimeout(res, milliSecs));
};
