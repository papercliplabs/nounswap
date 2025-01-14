import * as migration_20250116_200630 from './20250116_200630';
import * as migration_20250116_211909 from './20250116_211909';

export const migrations = [
  {
    up: migration_20250116_200630.up,
    down: migration_20250116_200630.down,
    name: '20250116_200630',
  },
  {
    up: migration_20250116_211909.up,
    down: migration_20250116_211909.down,
    name: '20250116_211909'
  },
];
