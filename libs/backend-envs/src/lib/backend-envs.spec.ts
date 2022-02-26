import { mongoConfig } from './backend-envs';

describe('backendEnvs', () => {
  it('should work', () => {
    expect(mongoConfig()).toBeDefined();
  });
});
