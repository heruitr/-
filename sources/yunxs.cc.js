

const headers = [`User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.81`]

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
    let response = GET(`http://www.yunxs.cc/plus/search.php?kwtype=0&searchtype=&q=${key}`,{
        headers
    })
    let $ = HTML.parse(response)
    let array = []
    $("#main > ul li").forEach(child => {
        let $ = HTML.parse(child)
        array.push({
            name: $(" li:nth-child(1) > h2 > a").text(),
            author: $("li:nth-child(1) > div.words > p.state").text().replace(/^\s*作者.\s*|(?<=^\s*作者：\s*[\u4e00-\u9fa5]*.*?\s)\s*类型.*\s.*$/g,""),
            cover: `http://www.yunxs.cc${$("li:nth-child(1) > div.pic > a:nth-child(1) > img:nth-child(1) ").attr('src')}`,
            detail: `http://www.yunxs.cc${$(" li:nth-child(1) > h2 > a ").attr("href")}`
        })
    })

    return JSON.stringify(array)
}

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
    let response = GET(url,{
        headers})
    let $ = HTML.parse(response)
    let book = {
        cover: $(' head > meta[property="og:image"]').attr('content'),
        summary: $('body > div:nth-child(7) > div > div.Left > div.j_box > div.words > p:nth-child(3)').text().replace('简介：',''),
        status: $(' head > meta[property="og:novel:status"]').attr('content'),
        category: $(' head > meta[property="og:novel:category"]').attr('content'),
        update: $(' head > meta[property="og:novel:update_time"]').attr('content'),
        words: $('#cms_ready_1').text(),
        lastChapter: $(' head > meta[property="og:novel:latest_chapter_name"]').attr('content'),
        catalog: url
    }
    return JSON.stringify(book)
}

/**
 * 目录
 *  > div:first-child > a:last-child
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
    let array = []
    let response = GET(url,{
        headers})
    let $ = HTML.parse(response)
    $('body > div:nth-child(11) > div.Con.jj_pl > div.list_box > ul li').forEach(child => {
            let $ = HTML.parse(child)
            array.push({
                name: $("a").text(),
                url: url+$("a").attr("href")
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
    let response = GET(url,{
        headers
    })
    let $ = HTML.parse(response)
    return $("body > div.Layout.no_bg.no_bor > div > div.box_box").remove('div,script')
}

var bookSource = JSON.stringify({
    name: "云中书库",
    url: "http://www.yunxs.cc/",
    version: 100,
})

