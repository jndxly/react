function json2Form(json = {}) {
    let str = []
    for (let p in json) {
        if (json.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(json[p]))
        }
    }
    return str.join('&')
}

async function ajax(url = '/', method = 'GET', payload = {}) {

    let init = {}

    if (method === 'GET' || method === 'get') {
        if (json2Form(payload)) {
            url = url + '?' + json2Form(payload)
        }

        init = {
            method: 'GET',
            credentials: 'include',
        }
    } else if (method === 'POST' || method === 'post') {
        init = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: json2Form(payload)
        }
    } else {
        return
    }

    try {
        const response = await fetch(url, init)
        const responseJson = await response.json()

        return responseJson
    } catch (error) {
        return error.statusText
    }
}

export { ajax }
