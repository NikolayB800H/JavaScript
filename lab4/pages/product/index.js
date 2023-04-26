import {ProductComponent} from "../../components/product/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import {MainPage} from "../main/index.js";
import {HeaderComponent} from "../../components/header/index.js";

import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";
import {groupIdInt, client_id, redirect_uri} from "../../modules/consts.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
        this.success = false
    }

    getData() {
        ajax.post(urls.getUserInfo(this.id), (data) => {
            this.renderData(data.response)
        })
    }

    renderData(item) {
        const product = new ProductComponent(this.pageRoot)
        product.render(item[0], this.clickCard.bind(this))
    }

    clickCard(e) {
        //const cardId = e.target.id
        //console.log(`${cardId}---${this.id}`)
        ajax.post(urls.getWall(groupIdInt), (data) => {
            console.log(data)
            data.response.items.every(element => {
                if (element.from_id = this.id) {
                    console.log(element.from_id + " ?= " + this.id)
                    ajax.post(urls.addLike(groupIdInt, element.id), (data) => {
                        console.log(data)
                    })
                    this.success = true
                    return false
                }
                if (this.success === false) {
                    alert("Пользователь не делал записей!")
                }
                this.success = false
                return true
            });
        })
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
        this.parent.innerHTML = ''
        
        const headerComponent = new HeaderComponent(this.parent)
        headerComponent.render()

        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const backButton = new BackButtonComponent(this.pageRoot)
        backButton.render(this.clickBack.bind(this))

        this.getData()
    }
}
