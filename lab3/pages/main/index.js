import {HeaderComponent} from "../../components/header/index.js";
import {JumbotronComponent} from "../../components/jumbotron/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    getData() {
        return [
            {
                id: 1,
                src: "img/ROCKS.jpg",
                title: "Камни со вкусом ежа",
                text: "Без ГМО!",
                sales: "2 + 1",
                sale: true
            },
            {
                id: 2,
                src: "img/ROCKS.jpg",
                title: "Жаренные камни",
                text: "Натуральный продукт!",
                sales: "10% скидка",
                sale: true
            },
            {
                id: 3,
                src: "img/ROCKS.jpg",
                title: "Камни аля Париж",
                text: "Таких нет даже во Франции!",
                sales: "даром",
                sale: true
            },
        ]
    }

    getHTML() {
        return (
            `
                <div id="main-page" class="d-flex flex-wrap"><div/>
            `
        )
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const headerComponent = new HeaderComponent(this.parent)
        headerComponent.render()

        const data = this.getData()

        const jumbotronComponent = new JumbotronComponent(this.parent, data)
        jumbotronComponent.render()
    }
}
