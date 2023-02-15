export class BageSaleComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data, isFullProdPage) {
        let ret = '<span class="position-absolute '
        if (isFullProdPage) {
            ret += `bottom-0 end-0 badge rounded-pill text-bg-warning">
                        Акция: ${data.sales}`
        } else {
            ret += `top-0 start-100 translate-middle badge rounded-pill text-bg-warning">
                        ${data.sales}!`
        }
        return (
            ret + `
                <span class="visually-hidden">значок</span>
            </span>`
        )
    }

    render(data, isFullProdPage) {
        const html = this.getHTML(data, isFullProdPage)
        this.parent.insertAdjacentHTML('beforeend', html)
    }
}
