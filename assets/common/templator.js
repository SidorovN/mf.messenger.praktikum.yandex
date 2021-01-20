const FOREACH_REGEXP = /\{\{\s+?#FOR\s+?([a-z]+)\sin\s([a-z]+)\s+?\}\}([\d\D]+)\{\{\s+?#ENDFOR\s+?\}\}/gim;
const PROPS_REGEXP = /\{\{(.*?)?\}\}/m;
let testTempl = `{{ #FOR array in elem }}
<li>{{field1}} {{ elem.title }}</li>
{{ #ENDFOR }}`;
const ctx = {
  array: [{ title: 'Привет' }, { title: 'JS' }, { title: 'Пока' }],
  field1: 'Text 1',
};
export function compile(str, ctx = {}) {
  const forElems = parseFor(str, ctx);
  return parseStr(forElems, ctx);
  function getStr(obj = {}, path, defaultValue = '') {
    const keys = path.split('.');
    let result = obj;
    for (let key of keys) {
      result = result[key];
      if (result === undefined) {
        return defaultValue;
      }
    }
    return result !== null && result !== void 0 ? result : defaultValue;
  }
  function getFor(props, value, key, str) {
    const newStr = [...props[value]].map((elem, index) => {
      const elemString = str.replace(
        new RegExp(`\\{\\{\\s?${key}\.+?\\}\\}`, 'gi'),
        element => element.replace(key, `${value}.${index}`)
      );
      // console.log(new RegExp(`\\{\\{\\s?${key}\.+?\\}\\}`,'gi'));
      const ctx = {};
      ctx[key] = elem;
      return elemString;
    });
    return newStr.join('');
  }
  function parseFor(str, ctx) {
    let key = null;
    while ((key = FOREACH_REGEXP.exec(str))) {
      console.log(key);
      if (key[1]) {
        const tmplValue = key[key.length - 1].trim();
        const parsedStr = getFor(ctx, key[2], key[1], tmplValue);
        str = str.replace(new RegExp(key[0], 'gi'), parsedStr);
      }
    }
    return str;
  }
  function parseStr(str, ctx) {
    let key = null;
    while ((key = PROPS_REGEXP.exec(str))) {
      if (key[1]) {
        console.log(key);
        const tmplValue = key[1].trim();
        const data = getStr(ctx, tmplValue);
        str = str.replace(new RegExp(key[0], 'gi'), data);
      }
    }
    return str;
  }
}
