export class DropDownComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(chats) {
        let cnt = chats.length
        let ret = `<div id="dropdown" class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                Выбор беседы группы
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            `
        for (let i = 0; i < cnt; ++i) {
            ret += `<button class="dropdown-item" accessKey="${i}" type="button">${chats[i]}</button>
            `
        }
        ret += `</div>
            </div>
        `
        return ret
    }

    get dropDownRoot() {
        return document.getElementById('dropdown')
    }
    
    addListeners(listener) {
        let listen = document.getElementsByClassName("dropdown-item")
        Array.from(listen).forEach(element => {
            element.addEventListener("click", listener)
        });
    }

    render(listener, cnt) {
        const html = this.getHTML(cnt)
        this.parent.insertAdjacentHTML('beforeend', html)
        this.addListeners(listener)
    }
}
