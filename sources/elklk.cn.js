
require('crypto-js')


const headers = [
    'User-Agent: Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36 Edg/117.0.0.0' ]


//搜索
const search = (key) => {
    let response = GET(`https://novel-api.elklk.cn//api/category-search?name=${key}`,{
        headers
    })
    let data = JSON.parse(response).result.list

    let array = []

    data.forEach((child) => {
        array.push({
            name: child.name,
            author: child.author,
            cover: child.icon,
            detail: `https://novel-api.elklk.cn/api/book-info?id=${child.id}&source_id=1`,
        })
    })
    return JSON.stringify(array)
}

//详情
const detail = (url) => {
    let response = GET(url,{
        headers
    })
    let data = JSON.parse(response).result.book
    let book = {
        cover: data.icon,
        summary: data.description,
        category: data.category,
        update: timestampToTime(data.mtime),
        lastChapter: data.new_title,
        catalog: `https://novel-api.elklk.cn/cdn/book/chapterList/${data.id}.html`
    }
    return JSON.stringify(book)
}

//转换时间戳
function timestampToTime(timestamp) {
    let date
    if (timestamp.length === 13) date = new Date(timestamp);
    else date = new Date(timestamp * 1000);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}

//目录
const catalog = (url) => {
    let response = GET(url)
    let data = JSON.parse(response).result.list
    let ary = []

    data.forEach(child =>{
        let list = child.list
        list.forEach( child =>{
            ary.push({
                name: (function(str) {
                    if(/\{\{}}/g.exec(str)) {
                        return decrypt(str.replace(/\{\{}}/g,''))
                    }else {
                        return str
                    }
                })(child.name)  ,
                url: child.url
            })}
        )

    })

    return JSON.stringify(ary)

}

//章节
const chapter = (url) => {
    let response = GET(url,{
        headers
    })

    return JSON.parse(response).data.content

}


const decrypt = function(str)  {
    var key = CryptoJS.enc.Utf8.parse("OW84U8Eerdb99rtsTXWSILDO");
    var iv = CryptoJS.enc.Utf8.parse("SK8bncVu");
    var encryptedBytes = CryptoJS.enc.Base64.parse(str);

    var decrypted = CryptoJS.TripleDES.decrypt({
        ciphertext: encryptedBytes
    }, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}






var bookSource = JSON.stringify({
    name: "9x阅读器",
    url: "elklk.cn",
    version: 100
})