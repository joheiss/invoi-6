import {RouterEffects} from './router.effects';
import {UiEffects} from './ui.effects';

export const rootEffects: any[] = [
  RouterEffects,
  UiEffects
];

export * from './router.effects';
export * from './ui.effects';
