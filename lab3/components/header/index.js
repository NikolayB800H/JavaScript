export class HeaderComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return (
            `
            <nav class="navbar navbar-default navbar-static-top navbar-expand-md navbar-expand-lg bg-dark navbar-dark">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">Продукты - лучший вариант! *</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a class="nav-link disabled">* - лабораторной №3</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            `
        )
    }
    
    render() {
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)
    }
}