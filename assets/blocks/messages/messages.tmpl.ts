export const tmpl = `
{{ #FOR message in messages }}
<li class="message message_{{message.author}}">
  <p class="message__text">{{message.text}}<span
        class="message__notification"></span>
    <time class="message__time">{{message.time}}</time>
  </p>
</li>
{{ #ENDFOR }}
`;
