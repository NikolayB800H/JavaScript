//import {ButtonComponent} from "../../components/button/index.js";
import {HeaderComponent} from "../../components/header/index.js";
//import {ProductCardComponent} from "../../components/product-card/index.js";
//import {ProductPage} from "../product/index.js";
import {JumbotronComponent} from "../../components/jumbotron/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    getData() {
        return [
            {
                id: 1,
                src: "https://i.pinimg.com/originals/c9/ea/65/c9ea654eb3a7398b1f702c758c1c4206.jpg",
                title: "Камни со вкусом ежа",
                text: "Без ГМО!"
            },
            {
                id: 2,
                src: "https://i.pinimg.com/originals/c9/ea/65/c9ea654eb3a7398b1f702c758c1c4206.jpg",
                title: "Жаренные камни",
                text: "Натуральный продукт!"
            },
            {
                id: 3,
                src: "https://i.pinimg.com/originals/c9/ea/65/c9ea654eb3a7398b1f702c758c1c4206.jpg",
                title: "Камни аля Париж",
                text: "Таких нет даже во Франции!"
            },
        ]
    }

    /*get pageRoot() {
        return document.getElementById('main-page')
    }*/

    getHTML() {
        return (
            `
                <div id="main-page" class="d-flex flex-wrap"><div/>
            `
        )
    }

    /*clickCard(e) {
        const cardId = e.target.dataset.id
    
        const productPage = new ProductPage(this.parent, cardId)
        productPage.render()
    }*/

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const headerComponent = new HeaderComponent(this.parent)
        headerComponent.render()

        const data = this.getData()

        const jumbotronComponent = new JumbotronComponent(this.parent, data)
        jumbotronComponent.render()
        
        /*data.forEach((item) => {
            const productCard = new ProductCardComponent(this.pageRoot)
            productCard.render(item, this.clickCard.bind(this))
        })*/
    }
}
