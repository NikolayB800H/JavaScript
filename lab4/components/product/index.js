import {BageSaleComponent} from "../../components/bage-sale/index.js";

export class ProductComponent {
    constructor(parent) {
        this.parent = parent
    }

    getHTML(data) {
        return (
            `
                <div id="full-prod" class="card mb-3" style="width: 540px;">
                    <div class="row g-0">
                        <div class="col-md-4" style="width:170px;height:170px;overflow:hidden;object-fit:cover;">
                            <img crossorigin="anonymous" src="${data.photo_400_orig}" class="img-fluid" alt="картинка">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${data.first_name} ${data.last_name}</h5>
                                <button class="btn btn-primary" id="test">Лайкнуть последнюю запись на стене сообщества</button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        )
    }

    addListeners(listener) {
        document.getElementById('test').addEventListener("click", listener)
    }

    get prodRoot() {
        return document.getElementById('full-prod')
    }

    render(data, listener) {
        const html = this.getHTML(data)
        this.parent.insertAdjacentHTML('beforeend', html)
        this.addListeners(listener)
        const bageSaleComponent = new BageSaleComponent(this.prodRoot)
        bageSaleComponent.render(data, true)
    }
}
