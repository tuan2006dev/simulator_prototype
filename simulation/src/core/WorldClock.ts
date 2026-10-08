import {TICKS_PER_DAY} from './utils';
// Keep economic steps and saved work/day counts stable; set their wall duration here.
export const WORLD_DAY_MS=120_000;
export const WORLD_STEP_MS=WORLD_DAY_MS/TICKS_PER_DAY;
export const EFFECT_STEP_MS=600;
export const TIME_SCALE=WORLD_STEP_MS/EFFECT_STEP_MS;
export function effectDuration(ms:number):string{
 const seconds=Math.max(0,Math.ceil(ms*TIME_SCALE/1000));
 return seconds>=60?`${Math.floor(seconds/60)} phút${seconds%60?` ${seconds%60} giây`:''}`:`${seconds} giây`;
}
