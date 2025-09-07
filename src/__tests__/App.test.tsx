describe('App', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have proper project structure', () => {
    // Basic project validation
    expect(typeof require('../../package.json').name).toBe('string');
    expect(require('../../package.json').name).toBe('dashly');
  });
});
