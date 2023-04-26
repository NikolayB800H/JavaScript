import {ProductCardComponent} from "../../components/product-card/index.js";
import {ProductPage} from "../../pages/product/index.js";
import {DropDownComponent} from "../../components/dropdown/index.js";

import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";
import {groupIdInt} from "../../modules/consts.js";

export class JumbotronComponent {
    constructor(parent) {
        this.parent = parent;
        this.chats = [];
    }

    getHTML() {
        return (
            `
            <div class="card" id ="durka">
                <div class="card-body" id ="jumbotron" style="display: flex; padding: 15px;justify-content: space-evenly;">
                </div>
            </div>
            `
        )
    }
    
    clickCard(e) {
        const cardId = e.target.dataset.id
        console.log(cardId)
        const productPage = new ProductPage(this.parent, cardId)
        productPage.render()
    }

    clickChoice(event) {
        this.chats = []
        let elem = this.rootDurka
        elem.parentNode.removeChild(elem)
        this.render(Number(event.target.accessKey))
    }

    get jumboRoot() {
        return document.getElementById('jumbotron')
    }

    get rootDurka() {
        return document.getElementById('durka')
    }

    getData(chatId) {
        ajax.post(urls.getConversationMembers(chatId), (data) => {
            this.renderData(data.response.items)
        })
    }

    renderData(items) {
        items.forEach((item) => {
            if (item.member_id > 0) {
                ajax.post(urls.getUserInfo('id'+item.member_id), (data) => {
                    const productCard = new ProductCardComponent(this.jumboRoot)
                    productCard.render(data.response[0], this.clickCard.bind(this))
                })
            }
        })
    }

    render(chatNum) {
        ajax.post(urls.getConversations(groupIdInt), (data) => {
            data.response.items.forEach((item) => {
                this.chats.push(new String(item.conversation.peer.id))
            })
            const html = this.getHTML()
            this.parent.insertAdjacentHTML('beforeend', html)
            this.dropDownComponent = new DropDownComponent(this.rootDurka)
            this.getData(this.chats[chatNum])
            this.dropDownComponent.render(this.clickChoice.bind(this), this.chats)
        })
    }
}
