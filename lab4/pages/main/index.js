import {HeaderComponent} from "../../components/header/index.js";
import {JumbotronComponent} from "../../components/jumbotron/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return (
            `
                <div id="main-page" class="d-flex flex-wrap"><div/>
            `
        )
    }

    get rootMainPage() {
        return document.getElementById('main-page')
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const headerComponent = new HeaderComponent(this.parent)
        headerComponent.render()

        const jumbotronComponent = new JumbotronComponent(this.parent)
        jumbotronComponent.render(0)
    }
}
