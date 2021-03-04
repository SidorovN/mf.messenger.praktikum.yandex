import {Router} from "./Router.js";
import { loginPage } from "../pages/login/login.js";
import { signupPage } from "../pages/signup/signup.js";
import { errorPage } from "../pages/error/error.js";
import { profilePage } from "../pages/profile/profile.js";
import { noChatPage } from "../pages/chat/chat.js";
import {chatPage} from "../pages/chat/id.js";

const router = new Router('#page')

router
    .use('/signup/',signupPage)
    .use('/chat/',noChatPage)
    .use('/chat/:<id>',chatPage)
    .use('/profile',profilePage)
    .use('/',loginPage)
    .use('/404/',errorPage)


window.addEventListener("click",(e:MouseEvent) => {
    const target = e.target as HTMLElement;
    const href = target?.getAttribute('href') || target?.closest('a')?.getAttribute('href');

        if (href && href[0] === '/') {

            e.preventDefault()
            router.go(href)
        } else {
            // const xhr = new HTTPTransport()
            // xhr.post('https://ya-praktikum.tech/api/v2/chats',{
            //     headers: {
            //         'content-type': 'application/json',
            //     },
            //     data: JSON.stringify({
            //         title: 'sidorovn'
            //     })
            // }).then(res=> {
            //     console.warn(res.response)
            // })
        }
})

window.onload = router.start

