
//搜索
const search = (key) => {
    let response = GET(`https://appi.kuwo.cn/novels/api/book/search?keyword=${key}&ps=30`)
    let data = JSON.parse(response).data
    let array = []
    data.forEach((child) => {
        array.push({
            name: child.title,
            author: child.author_name,
            cover: child.cover_url,
            detail: `http://appi.kuwo.cn/novels/api/book/${child.book_id}`,
        })
    })
    return JSON.stringify(array)
}

//详情
const detail = (url) => {
    let response = GET(url)
    let data = JSON.parse(response).data
    let book = {
        cover: data.cover_url,
        summary: data.intro,
        status: (data.status = 50) ? "连载" : "完结",
        category: data.category_name,
        update: data.update_time,
        lastChapter: data.new_chapter_name,
        catalog: url + "/chapters?paging=0",
        words: data.all_words
    }
    return JSON.stringify(book)
}

//目录
const catalog = (url) => {
    let response = GET(url)
    let data = JSON.parse(response).data
    let ary = []

    data.forEach(child =>{
        ary.push({
            name:  child.chapter_title,
            url: url.replace(/\?paging=0/,'') + "/" + child.chapter_id
        })
    })

    return JSON.stringify(ary)

}

//章节
const chapter = (url) => {
    let response = GET(url)

    return JSON.parse(response).data.content

}







var bookSource = JSON.stringify({
    name: "酷我小说",
    url: "https://appi.kuwo.cn/",
    version: 100
})