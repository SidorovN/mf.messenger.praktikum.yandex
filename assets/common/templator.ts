const FOREACH_REGEXP = /\{\{\s+?#FOR\s+?([a-z]+)\sin\s([a-z]+)\s+?\}\}([\d\D]+)\{\{\s+?#ENDFOR\s+?\}\}/gim;
const PROPS_REGEXP = /\{\{(.*?)?\}\}/m;

export function compile(str:string, ctx: object={}) {
    const forElems:string = parseFor(str, ctx)
    return parseStr(forElems,ctx)

    function getStr(obj: object={}, path:string, defaultValue='') {
        const keys  = path.split('.');
        let result = obj;
        for (let key of keys) {
            result = result[key];

            if (result === undefined) {
                return defaultValue;
            }
        }

        return result ?? defaultValue;
    }

    function getFor(props, value, key, str) {
        const newStr = [...props[value]].map((elem, index) => {
            const elemString = str.replace(new RegExp(`\\{\\{\\s?${key}\.+?\\}\\}`,'gi'),(element)=> element.replace(key,`${value}.${index}`))
            const ctx = {}
            ctx[key] = elem
            return elemString

        })

        return newStr.join('')
    }


    function parseFor(str,ctx) {
        let key = null;
        while ((key = FOREACH_REGEXP.exec(str))) {
            if (key[1]) {
                const tmplValue = key[key.length - 1].trim();

                const parsedStr = getFor(ctx, key[2], key[1], tmplValue);
                str = str.replace(new RegExp(key[0], "gi"), parsedStr);
            }
        }

        return str
    }

    function parseStr(str, ctx) {
        let key = null;
        while ((key = PROPS_REGEXP.exec(str))) {
            if (key[1]) {
                const tmplValue = key[1].trim();
                const data = getStr(ctx, tmplValue);
                str = str.replace(new RegExp(key[0], "gi"), data);
            }
        }
        return str
    }

}

