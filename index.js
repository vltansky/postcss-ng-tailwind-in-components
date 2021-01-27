function pluginFn(fn = () => {}){
  return {
    postcssPlugin: 'postcss-ng-tailwind-dark',
    Rule: fn,
  }
}

module.exports = (parentSelector) => {
  if(!parentSelector){
    console.error(`you have pass parentSelector to postcss-ng-tailwind-in-components. Passed: ${parentSelector}`);
    return pluginFn();
  }
  if(parentSelector[0] !== '.' && parentSelector[0] !== '#'){
    console.error(`${parentSelector[0]} is invalid character. Selector should start with "." or "#"`);
    return pluginFn();
  }

  return pluginFn(rule => {
    if(rule.selector.includes(`${parentSelector} `)){
      let hostContextCSS = []
      const regexStr = `^\\${parentSelector}(\\s+)`;
      for (let selector of rule.selectors) {
        if(selector.includes(`${parentSelector}`)){
          hostContextCSS.push(selector.replace(
            new RegExp(regexStr,'gi'),
            `:host-context(${parentSelector})$1`
          ))
        }
      }
      if(hostContextCSS.length){
        rule.selectors = rule.selectors.concat(hostContextCSS)
      }
    }
  })
}
module.exports.postcss = true
