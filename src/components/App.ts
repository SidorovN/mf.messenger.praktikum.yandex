import {Router} from './Router';
import {loginPage} from '../pages/login/login';
import {signupPage} from '../pages/signup/signup';
import {errorPage} from '../pages/error/error';
import {profilePage} from '../pages/profile/profile';
import {noChatPage} from '../pages/chat/chat';
import {chatPage} from '../pages/chat/id';

export const init = () => {
    const router = new Router('#page');

    router
        .use('/signup/', signupPage)
        .use('/chat/', noChatPage)
        .use('/chat/:<id>', chatPage)
        .use('/profile', profilePage)
        .use('/', loginPage)
        .use('/404/', errorPage);

    window.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const href = target?.getAttribute('href') || target?.closest('a')?.getAttribute('href');

        if (href && href[0] === '/') {
            e.preventDefault();
            router.go(href);
        }
    });

    window.onload = router.start;
};
