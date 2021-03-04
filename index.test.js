let postcss = require('postcss')

let plugin = require('./')

async function runPlugin(options, input = '.test {}'){
  return postcss([plugin(options)]).process(input, { from: undefined })
}

async function run (input, output, options) {
  let result = await runPlugin(options, input);
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}
describe('Check errors', () => {
  let consoleOutput;
  const mockedError = output => consoleOutput = output;
  beforeEach(() => (console.error = mockedError))

  it('should console error "selectors first character is invalid"', async () => {
    await runPlugin(
      {parentSelector: 'dark'}
    );
    expect(consoleOutput).toContain('Selector should start with')
  })

  it('should console error "You have pass parentSelector."', async () => {
    await runPlugin();
    expect(consoleOutput).toContain('You have pass parentSelector.')
  })
});

describe('PostCSS', () => {
  it('should add :host-context', async () => {
    await run(
      `
      .test {}
      .any {}
      .dark .test {}
      .string {}`,
      `
      .test {}
      .any {}
      .dark .test {}
      :host-context(.dark) .test {}
      .string {}`,
      {parentSelector: '.dark'}
    )
  })

  it('should add :host-context to "some-parent-class"', async () => {
    await run(
      '.some-parent-class .test {}',
      `.some-parent-class .test {}:host-context(.some-parent-class) .test {}`,
      {parentSelector: '.some-parent-class'}
    )
  })

  it('should work with id "#some-parent-id"', async () => {
    await run(
      '#some-parent-id .test {}',
      `#some-parent-id .test {}:host-context(#some-parent-id) .test {}`,
      {parentSelector: '#some-parent-id'}
    )
  })
});
