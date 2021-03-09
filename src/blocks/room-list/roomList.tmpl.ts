export const tmpl = `
{{ #FOR room in rooms }}
  <a href="/chat/{{ room.id }}" class="room-item">
  <div class="room-item__avatar" style="{{room.style}}"></div>
    <h3 class="room-item__title">{{room.title}}</h3>
    <time class="room-item__date">{{room.time}}</time>
    <span class="room-item__message">{{room.message}}</span>
<!--    <span class="room-item__notification">{{room.notification}}</span>-->
  </a>
{{ #ENDFOR }}
`;
