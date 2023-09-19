
/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
    let response = POST("http://www.zwduxs.com/modules/article/search.php", {
        data: `searchkey=${ENCODE(key,"utf-8")}`
    })
    let $ = HTML.parse(response)
    let array = []
    let str=$(".grid ").toString().replace(/td/g,'a').replace(/tr/g,'div')
    let h = HTML.parse(str)

    h('div').forEach( child => {
        let $ = HTML.parse(child)
        array.push({
            name: $('div:nth-child(1) > a:nth-child(2)').text(),
            author: $(` div:nth-child(1) > a:nth-child(2)`).text(),
            status: $(` div:nth-child(1) > a:nth-child(8)`).text(),
            detail: `${$(` div:nth-child(1) > a:nth-child(2)`).attr("href")}`
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
    let response = GET(url)
    let $ = HTML.parse(response)
    let book = {
        summary: $('#intro > p').text(),
        status: $("head > meta[property='og:novel:status']").attr('content'),
        category: $('head > meta:nth-child(14)').attr('content'),
        update: $('#info > p:nth-child(4)').text().replace('最后更新：',''),
        lastChapter: $('#list > dl > dd:last-child > a').text(),
        catalog: url
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
    let response = GET(url)
    let $ = HTML.parse(response)
    $('#list > dl  dd').forEach(child => {
            let $ = HTML.parse(child)
            array.push({
                name: $("a").text(),
                url: `http://www.zwduxs.com/${$("a").attr("href")}`
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

    return $("#content")
}

var bookSource = JSON.stringify({
    name: "八一中文",
    url: "http://www.zwduxs.com/",
    version: 101,
})

