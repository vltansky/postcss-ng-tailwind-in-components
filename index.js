function pluginFn(fn = () => {}){
  return {
    postcssPlugin: 'postcss-ng-tailwind-in-components',
    Rule: fn,
  }
}

module.exports = ({parentSelector} = {}) => {
  if(!parentSelector){
    console.error(`\n[postcss-ng-tailwind-in-components] You have pass parentSelector. Passed: ${parentSelector}`);
    return pluginFn();
  }
  if(parentSelector[0] !== '.' && parentSelector[0] !== '#'){
    console.error(`\n[postcss-ng-tailwind-in-components] "${parentSelector[0]}" is invalid character. Selector should start with "." or "#"`);
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
        const clone = rule.clone({ selectors: hostContextCSS });
        // console.log(clone);
        rule.parent.insertAfter(rule, rule.clone({ selectors: hostContextCSS }))
        // rule.selectors = rule.selectors.concat(hostContextCSS)
      }
    }
  })
}
module.exports.postcss = true
