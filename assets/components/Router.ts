import {Component} from "./Component.js";
import {render} from "../common/commonFunctions.js";

function isEqual(lhs, rhs) {
    return lhs === rhs;
}

class Route {
    readonly _pathname: string;
    private readonly _blockClass: any;
    private _block: Component | null;
    private _props: any;
    private scriptLoaded: boolean = false;
    pk: boolean;

    constructor(pathname, view, props, pk?: boolean) {
        this._pathname = pathname;
        this._blockClass = view;
        this._block = view;
        this._props = props;
        this.pk = pk
    }

    leave():void {
        this._block?.hide();
    }

    match(pathname:string):boolean {
        return isEqual(pathname, this._pathname) || (pathname.indexOf(this._pathname) === 0 && this.pk);
    }

    render(pk:string):void {

        if (!this._block) {
            this._block = new this._blockClass();
            this._block.init()
            render(this._props.rootQuery, this._block);
            return;
        }
        render(document.querySelector(this._props.rootQuery), this._block.getContent());
        if(pk) this._block.props.pk = pk.replace('/','')
        this._block.show();
    }
}

export class Router {
    private routes: Route[] = [];
    private history: any = window.history;
    private _currentRoute: null | Route;
    private _rootQuery: string;
    private static __instance: any;

    constructor(rootQuery) {
        if (Router.__instance) {
            return Router.__instance;
        }

        this._rootQuery = rootQuery;

        Router.__instance = this;
    }

    private _getPathnameAndPk(url:string) {
        const pk = url.match(/:<(\S+)>/) ? url.match(/:<(\S+)>/)[1] : ''
        const pathname = url.replace(/:<\S+>/,'').replace(/\/$/,'')
        return {pk,pathname}
    }

    // private _getPathnameFromUrl(url:string) {
    //     find()
    //     return {pk,pathname}
    // }

    use(url:string, block:Component):Router {
        const {pk,pathname} = this._getPathnameAndPk(url)
        const route: Route = new Route(pathname, block, {rootQuery: this._rootQuery},!!pk);
        this.routes.push(route);
        return this
    }

    start = (): void => {
        window.onpopstate = (event: PopStateEvent): void => {
            this._onRoute((<Window>event.currentTarget).location.pathname);
        };

        this.history.pushState('', '', window.location.pathname);
        this._onRoute(window.location.pathname);
    }


    _onRoute(url:string):void {
        let pk
        console.log(url)
        const route = this.getRoute(url.replace(/\/$/,''),pk);
        if(route.pk) {
            pk = url.replace(route._pathname,'').replace('/','')
        }

        this._currentRoute?.leave();

        this._currentRoute = route;

        route.render(pk);
    }

    go(pathname:string, title:string = '') {
        this.history.pushState({}, title, pathname)
        this._onRoute(pathname)
    }

    getRoute(pathname:string,pk:string):Route {
        console.log(pathname,this.routes)
        const route = this.routes.find(route => route.match(pathname))

        return route;
    }
}
