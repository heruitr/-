
/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
    let response = POST("http://m.gashuw.com/s.php", {
        data: `keyword=${ENCODE(key,"utf-8")}&t=1`
    })
    let $ = HTML.parse(response)
    let array = []


    $("body > div > div.hot_sale").forEach(child => {
        let $ = HTML.parse(child)
        array.push({
            name: $("p.title").text(),
            author: $(" div >a > p:nth-child(2)").text(),
            cover: 'https://pic1.zhimg.com/70/v2-ab9549c7127bef7b692021e83d851f07_1440w.image',
            status: $("div > a > p:nth-child(3)").text(),
            detail: `http://m.gashuw.com${$("div > a").attr("href")}`
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
    let response = GET(url)
    let $ = HTML.parse(response)
    let book = {
        summary: $('body > div.synopsisArea > p.review').text(),
        status: $('body > div.synopsisArea > div > p:nth-child(4)').text().replace('状态：',''),
        category: $('body > div.synopsisArea > div > p.sort').text().replace('类别：',''),
        update: $('body > div.synopsisArea > div > p:nth-child(6)').text().replace('更新：',''),
        lastChapter: $('body > div.recommend > div.directoryArea > p:nth-child(1) > a').text(),
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
    for (let i = 1; i < ($('body > div.recommend > div.listpage > span.middle > select > option').length+1); i++) {
        let u = `${url}${i}/#all`
        let res = GET(u)
        $ = HTML.parse(res)
        $('body > div.recommend > div.directoryArea a').slice(6).forEach(child => {
                let $ = HTML.parse(child)
                array.push({
                    name: $("a").text(),
                    url: `http://m.gashuw.com${$("a").attr("href")}`
                })

            }
        )

    }
    return JSON.stringify(array)
}

/**
 * 章节
 * @params {string} url
 * @returns {string}
 */
const chapter = (url) => {
    let con = ''
    do
    {   let response = GET(url)
        let $ = HTML.parse(response)
        con = con + ($('#chaptercontent').remove('div,b').replace('本章未完，点击下一页继续阅读','').replace(/www.*.com/gi,'').replace('歌书网',''))
        if($('#pt_next').text()=='下一页') {
            url=`http://m.gashuw.com${$('#pt_next').attr('href')}`
        }
        else {
            break
        }
    }
    while (1)
    return con
}

var bookSource = JSON.stringify({
    name: "歌书网",
    url: "www.gashuw.com",
    version: 100,
    authorization: "http://www.gashuw.com/login.php",
    cookies: [".gashuw.com"],
})

