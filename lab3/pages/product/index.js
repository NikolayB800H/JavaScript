import {ProductComponent} from "../../components/product/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import {MainPage} from "../main/index.js";
import {HeaderComponent} from "../../components/header/index.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
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
        ][this.id - 1]
    }

    get pageRoot() {
        return document.getElementById('product-page')
    }

    getHTML() {
        return (
            `
                <div id="product-page" style="padding: 15px;"></div>
            `
        )
    }

    clickBack() {
        const mainPage = new MainPage(this.parent)
        mainPage.render()
    }
    
    render() {
        const data = this.getData()
        this.parent.innerHTML = ''
        
        const headerComponent = new HeaderComponent(this.parent)
        headerComponent.render()

        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const backButton = new BackButtonComponent(this.pageRoot)
        backButton.render(this.clickBack.bind(this))

        const stock = new ProductComponent(this.pageRoot)
        stock.render(data)
    }
}
