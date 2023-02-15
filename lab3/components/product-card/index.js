import {BageSaleComponent} from "../../components/bage-sale/index.js";

export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return (
            `
                <div class="card" style="width: 300px;">
                    <img class="card-img-top" src="${data.src}" alt="картинка">
                    <div class="card-body">
                        <h5 class="card-title">${data.title}</h5>
                        <p class="card-text">${data.text}</p>
                        <button class="btn btn-secondary position-relative" id="click-card-${data.id}" data-id="${data.id}">
                            Подробнее...
                        </button>
                    </div>
                </div>
            `
        )
    }
    
    addListeners(data, listener) {
        document
            .getElementById(`click-card-${data.id}`)
            .addEventListener("click", listener)
    }

    prodCardRoot(data) {
        return document.getElementById(`click-card-${data.id}`)
    }

    render(data, listener) {
        const html = this.getHTML(data)
        this.parent.insertAdjacentHTML('beforeend', html)
        this.addListeners(data, listener)
        const bageSaleComponent = new BageSaleComponent(this.prodCardRoot(data))
        bageSaleComponent.render(data, false)
    }
}
