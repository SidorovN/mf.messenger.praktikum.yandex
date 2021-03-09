/* eslint-disable */
const FOREACH_REGEXP = /\{\{\s+?#FOR\s+?([a-z]+)\sin\s([a-z]+)\s+?\}\}([\d\D]+)\{\{\s+?#ENDFOR\s+?\}\}/gim;
const PROPS_REGEXP = /\{\{(.*?)?\}\}/m;
/* eslint-enable */
function compile(str: string, ctx: object = {}) {
    const forElems: string = parseFor(str, ctx);
    return parseStr(forElems, ctx);

    function getStr(obj: object, path: string, defaultValue = '') {
        const keys = path.split('.');
        let result = obj;
        for (const key of keys) {
            result = result[key];

            if (result === undefined) {
                return defaultValue;
            }
        }

        return result ?? defaultValue;
    }

    function getFor(props, value, key, str) {
        const newStr = [...props[value]].map((elem, index) => {
            const elemString = str.replace(
                /* eslint-disable */
                new RegExp(`\\{\\{\\s?${key}\.+?\\}\\}`, 'gi'),
                /* eslint-enable */
                element => element.replace(key, `${value}.${index}`)
            );
            const ctx = {};
            ctx[key] = elem;
            return elemString;
        });

        return newStr.join('');
    }

    function parseFor(str, ctx) {
        let key = null;
        while ((key = FOREACH_REGEXP.exec(str))) {
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
                const tmplValue = key[1].trim();
                const data = getStr(ctx, tmplValue);
                str = str.replace(new RegExp(key[0], 'gi'), data);
            }
        }

        return str;
    }
}

type StringIndexed = Record<string, any>;

const obj: StringIndexed = {
    key: 1,
    key2: 'test',
    key3: false,
    key4: true,
    key5: [1, 2, 3],
    key6: {a: 1},
    key7: {b: {d: 2}}
};

function queryStringify(data: StringIndexed): string | never {
    const answer = [];
    Object.keys(data).forEach(key => {
        answer.push(`${key}=${data[key]}`);
    });
    return answer.join('&');
}

export {compile};
