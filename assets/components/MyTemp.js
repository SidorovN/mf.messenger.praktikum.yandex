const FOREACH_REGEXP = /\{\{\s+?#FOR\s+?([a-z]+)\sin\s([a-z]+)\s+?\}\}([\d\D]+)\{\{\s+?#ENDFOR\s+?\}\}/gim;
const PROPS_REGEXP = /\{\{(.*?)\}\}/m;

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

  function getStr(obj, path, defaultValue) {
    const keys = path.split('.');
    let result = obj;
    for (let key of keys) {
      result = result[key];

      if (result === undefined) {
        return defaultValue;
      }
    }

    return result || defaultValue;
  }

  function getFor(props, value, key, str) {
    const newStr = [...props[value]].map((elem, index) => {
      const elemString = str.replace(
        new RegExp(key, 'gi'),
        `${value}.${index}`
      );
      const ctx = {};
      ctx[key] = elem;
      return elemString;
    });

    return newStr.join('');
  }

  function parseFor(str) {
    let key = null;
    while ((key = FOREACH_REGEXP.exec(testTempl))) {
      if (key[1]) {
        const tmplValue = key[key.length - 1].trim();

        const parsedStr = getFor(ctx, key[1], key[2], tmplValue);
        str = str.replace(new RegExp(key[0], 'gi'), parsedStr);
      }
    }

    return str;
  }

  function parseStr(str, ctx) {
    let key = null;

    while ((key = PROPS_REGEXP.exec(str))) {
      if (key[1]) {
        const tmplValue = key[1].trim();
        const data = getStr(ctx, tmplValue);
        str = str.replace(new RegExp(key[0], 'gi'), data);
      }
    }
    return str;
  }
}

console.log(compile(testTempl, ctx));
