// 将原生 localStorage 封装下 更好的使用


(function () {
    window.ms = {
        set: set,
        get: get,
    };
    // 存值
    function set(key,val) {
        localStorage.setItem(key, JSON.stringify(val));
    };

    function get(key) {
        var json = localStorage.getItem(key);

        if (json) {
            // 将JSON字符串编译成JS
            return JSON.parse(json);
        }
    };
})();


// 其他场景中应用  比如 var task = ms.get('task')
// 就可以直接使用这个变量
// 数据直接保存在浏览器中，不丢失

// ms.set('name', 'Laso');
//
// var laso = ms.get('name');
//
// console.log('Name:' + laso);
