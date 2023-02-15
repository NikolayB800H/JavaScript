import {BageSaleComponent} from "../../components/bage-sale/index.js";

export class ProductComponent {
    constructor(parent) {
        this.parent = parent
    }

    getHTML(data) {
        return (
            `
                <div id="full-prod" class="card mb-3" style="width: 900px; border-radius: 10px">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${data.src}" class="img-fluid" alt="картинка" style="border-radius: 10px">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body" id="place-here">
                                <h5 class="card-title">${data.title}</h5>
                                <p class="card-text">${data.text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        )
    }

    get prodRoot() {
        return document.getElementById('full-prod')
    }

    render(data) {
        const html = this.getHTML(data)
        this.parent.insertAdjacentHTML('beforeend', html)
        const bageSaleComponent = new BageSaleComponent(this.prodRoot)
        bageSaleComponent.render(data, true)
    }
}
