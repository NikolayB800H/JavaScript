class Ajax {
    post(url, callback) {
        let xhr = new XMLHttpRequest()
        
        xhr.open('POST', url)
        xhr.crossDomain = true
        //xhr.responseType = 'json';
        //xhr.send()

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                //console.log(xhr.response)
                const data = JSON.parse(xhr.response)
                //console.log(data)
                callback(data)
            }
        }

        xhr.send(null)
    }
}

export const ajax = new Ajax();