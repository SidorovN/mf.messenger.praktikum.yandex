export const tmpl = `
{{ #FOR message in messages }}
<li class="message message_{{message.author}}">
  <p class="message__text">{{message.content}}
  </p>
    <time class="message__time">{{message.time}}</time>
</li>
{{ #ENDFOR }}
`;
