let postcss = require('postcss')

let plugin = require('./')

async function runPlugin(className, input = '.test {}'){
  return postcss([plugin(className)]).process(input, { from: undefined })
}

async function run (input, output, className) {
  let result = await runPlugin(className, input);
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}
describe('Check errors', () => {
  let consoleOutput;
  const mockedError = output => consoleOutput = output;
  beforeEach(() => (console.error = mockedError))

  it('should console error "selectors first character is invalid"', async () => {
    await runPlugin(
      'dark'
    );
    expect(consoleOutput).toContain('Selector should start with')
  })

  it('should console error "you have pass parentSelector to"', async () => {
    await runPlugin();
    expect(consoleOutput).toContain('you have pass parentSelector to')
  })
});

describe('PostCSS', () => {
  it('should add :host-context', async () => {
    await run(
      '.dark .test {}',
      '.dark .test, :host-context(.dark) .test {}',
      '.dark'
    )
  })

  it('should add :host-context to "some-parent-class"', async () => {
    await run(
      '.some-parent-class .test {}',
      '.some-parent-class .test, :host-context(.some-parent-class) .test {}',
      '.some-parent-class'
    )
  })

  it('should work with id "#some-parent-id"', async () => {
    await run(
      '#some-parent-id .test {}',
      '#some-parent-id .test, :host-context(#some-parent-id) .test {}',
      '#some-parent-id'
    )
  })
});
