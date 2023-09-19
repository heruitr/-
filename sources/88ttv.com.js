

//搜索
const search = (key) => {
    let response = GET(`https://www.88ttv.com/api/search?q=${key}`)
    let data = JSON.parse(response).data.search

    let array = []
    data.forEach((child) => {
        array.push({
            name: child.book_name,
            author: child.author,
            cover: `https://www.88ttv.com/${child.cover}`,
            detail: `https://www.88ttv.com/${child.book_list_url}`,
            status: child.status_str
        })
    })
    return JSON.stringify(array)
}

//详情
const detail = (url) => {
    let response = GET(url)
    let $ = HTML.parse(response)
    let book = {
        cover: $(' head > meta[property="og:image"]').attr('content'),
        summary: $(' head > meta[property="og:description"]').attr('content'),
        status: $(' head > meta[property="og:novel:status"]').attr('content'),
        category: $(' head > meta[property="og:novel:category"]').attr('content'),
        update: $(' head > meta[property="og:novel:update_time"]').attr('content'),
        lastChapter: $(' head > meta[property="og:novel:latest_chapter_name"]').attr('content'),
        catalog: url
    }
    return JSON.stringify(book)
}

//目录
const catalog = (url) => {
    let res = GET(url)
    let $ = HTML.parse(res)
    let array = []

    $('#list > dl dd').forEach((child) => {
        let $ = HTML.parse(child)
        array.push({
            name: $('a:nth-child(1)').text(),
            url: `https://www.88ttv.com/${$('a:nth-child(1)').attr('href')}`
        })
    })

    return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let response = GET(url)
    let $ = HTML.parse(response)
    return $("#htmlContent > p")
}



var bookSource = JSON.stringify({
    name: "番茄小说网",
    url: "https://www.88ttv.com/",
    version: 100
})