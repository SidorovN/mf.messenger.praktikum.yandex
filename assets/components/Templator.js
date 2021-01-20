let testTempl = `
<div>
    {{ field1 }}
    <span>{{field2}}</span>
    <span>{{ field3.info.name }}</span>
</div>
`;

const ctx = {
  field1: 'Text 1',
  field2: 42,
  field3: {
    info: {
      name: 'Simon',
    },
  },
};

const TEMPLATE_REGEXP = /\{\{(.*?)\}\}/gi;

let key = null;
// Важно делать exec именно через константу, иначе уйдёте в бесконечный цикл
while ((key = TEMPLATE_REGEXP.exec(testTempl))) {
  if (key[1]) {
    const tmplValue = key[1].trim();
    // get — функция, написанная  выше
    const data = window.get(ctx, tmplValue);
    testTempl = testTempl.replace(new RegExp(key[0], 'gi'), data);
  }
}

console.log(testTempl);
/*

<div>
    Text 1
    <span>42</span>
    <span>Simon</span>
</div>
*/
