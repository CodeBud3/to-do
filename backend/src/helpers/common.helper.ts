export const dayToMs = (day: number) => day * hourToMs(24);

export const hourToMs = (hour: number) => hour * minToMS(60);

export const minToMS = (minute: number) => minute * secondToMS(60);

export const secondToMS = (second: number) => second * 1000;
