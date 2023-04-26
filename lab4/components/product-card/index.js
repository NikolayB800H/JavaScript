import {BageSaleComponent} from "../../components/bage-sale/index.js";

export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return (
            `
                <div class="card" style="width: 300px;">
                    <div style="width:298px;height:298px;overflow:hidden">
                    <img crossorigin="anonymous" class="card-img-top" src="${data.photo_400_orig} alt="картинка">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${data.first_name} ${data.last_name}</h5>
                        <button class="btn btn-primary" id="click-card-${data.id}" data-id="${data.id}">Нажми на меня</button>
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
