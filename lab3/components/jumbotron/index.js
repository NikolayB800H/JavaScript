import {ProductCardComponent} from "../../components/product-card/index.js";
import {ProductPage} from "../../pages/product/index.js";

export class JumbotronComponent {
    constructor(parent, data) {
        this.parent = parent;
        this.data = data;
    }

    getHTML() {
        return (
            `
            <div class="card">
                <div class="card-body" id ="jumbotron" style="display: flex; padding: 15px;justify-content: space-evenly;">
                </div>
            </div>
            `
        )
    }
    
    clickCard(e) {
        const cardId = e.target.dataset.id
        const productPage = new ProductPage(this.parent, cardId)
        productPage.render()
    }

    get jumboRoot() {
        return document.getElementById('jumbotron')
    }

    render() {
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        this.data.forEach((item) => {
            const productCard = new ProductCardComponent(this.jumboRoot)
            productCard.render(item, this.clickCard.bind(this))
        })
    }
}