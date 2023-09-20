
require('crypto-js')


const headers = [`User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.81`,
                         'Content-Type:text/html;charset=UTF-8']


//搜索
const search = (key) => {
    let response = GET(`https://souxs.leeyegy.com/search.aspx?key=${key}&page=1&siteid=app2`,{
        headers
    })
    let data = JSON.parse(response).data
    let array = []
    data.forEach((child) => {
        array.push({
            name: child.Name,
            author: child.Author,
            cover: child.Img,
            detail: `https://infosxs.pysmei.com/BookFiles/Html/${parseInt(child.Id/1000)+1}/${child.Id}/info.html`,
        })
    })
    return JSON.stringify(array)
}

//详情
const detail = (url) => {
    let response = GET(url,{
        headers
    })
    let data = JSON.parse(response).data
    let book = {
        cover: `https://imgapixs.pysmei.com/BookFiles/BookImages/${data.Img}`,
        summary: data.Desc,
        status: data.BookStatus,
        category: data.CName,
        update: data.LastTime,
        lastChapter: data.LastChapter,
        catalog: `https://infosxs.pysmei.com/BookFiles/Html/${parseInt(data.Id/1000)+1}/${data.Id}/index.html`
    }
    return JSON.stringify(book)
}

//目录
const catalog = (url) => {
    let response = GET(url).replace(/\s*},\s*.{0,7}\s*]\s*},\s*.{0,7}\s*]\s*}\s*}\s*/img,'    }    ]   }    ]  } }').replace(/},\s*.{0,7}\s* ]\s*},/img,'} ] },')
    let data = JSON.parse(response).data
    let ary = []

    data.list.forEach(child =>{
        let l = child.list
            l.forEach(child =>
                {

                    ary.push({
                        name:  decrypt(child.name.replace(/[^a-zA-z0-9+=/]/g,'').replace(/\s*/g,'')) ,
                        url: url.replace(/index/,`${child.id}`)
                    })

                }

            )

    })

    return JSON.stringify(ary)

}

//章节
const chapter = (url) => {
    let response = GET(url,{
        headers
    })
    let data = JSON.parse(response).data
    let x = data.content.toString().replace(/.*\{\{\{}}}/,'').replace(/[^a-zA-z0-9+=/]/g,'')

    return decrypt(x)

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
    name: "猴子阅读",
    url: "leeyegy.com",
    version: 100
})