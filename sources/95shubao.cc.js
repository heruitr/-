

const headers = [`User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.81`,
                            `Host:www.95shubao.cc`]

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
    let response = GET(`http://www.95shubao.cc/modules/article/search.php?searchkey=${ENCODE(key,"utf-8")}`, {
        headers
    })
    let $ = HTML.parse(response)
    let array = []
    let str=$("body > div.main > table > tbody").toString().replace(/td/g,'a').replace(/tr/g,'div')
    let h = HTML.parse(str)
    h('div').slice(1).forEach( child => {
            let $ = HTML.parse(child)
            array.push({
                name: $('div:nth-child(1) > a:nth-child(2)').text(),
                author: $(`div:nth-child(1) > a:nth-child(5)`).text(),
                detail: $(`div:nth-child(1) > a:nth-child(2)`).attr("href")
            })

        }
    )
    return JSON.stringify(array)
}

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
    let response = GET(url,{
        headers
    })
    let $ = HTML.parse(response)
    let link = $("#diralinks").attr("href")
    let res = GET( link ,{
        headers,
        Referer: "http://www.95shubao.cc/bookbook/11828.html"
    })
    let h = HTML.parse(res)
    let book = {
        cover: h(' head > meta[property="og:image"]').attr('content'),
        summary: h(' #intro').text(),
        status: h(' head > meta[name="og:novel:status"]').attr('content'),
        category: h(' head > meta[name="og:novel:category"]').attr('content'),
        update: h('body > div:nth-child(2) > div.read_page > div.quanwen > div.book_info > div.xiaoshuo > h5').text().replace(/[^\d\d\d\d-\d\d-\d\d]/g,''),
        lastChapter: h('body > div:nth-child(2) > div.read_page > div.quanwen > div.book_info > div.xiaoshuo > h5 > a').text(),
        catalog: link
    }
    return JSON.stringify(book)
}

/**
 * 目录
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
    let array = []
    let response = GET(url,{
        headers
    }).replace(/<dl class="book_article_listtext">|<\/dl>/g,'')
    let $ = HTML.parse(response)
    $('dd').forEach(child => {
            let $ = HTML.parse(child)

            array.push({
                name: $("dd > a").text(),
                url: `http://www.95shubao.cc${$("dd > a").attr("href")}`
            })

        }
    )
    return JSON.stringify(array)
}

/**
 * 章节
 * @params {string} url
 * @returns {string}
 */
const chapter = (url) => {
    let response = GET(url)
    let $ = HTML.parse(response)

    return $("#content").remove("div")
}

var bookSource = JSON.stringify({
    name: "95书包",
    url: "http://www.95shubao.cc/",
    version: 100,
})

