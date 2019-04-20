;(function () {
    'use strict';

    var Event = new Vue();

    function copy(obj) {
        return Object.assign({}, obj);
    }

    Vue.component('task', {
        template: '#task-tpl',
        props: ['todo'],
        methods: {
          action(name,params) {
              Event.$emit(name, params);
          }
        }
    });


    new Vue({
        el: '#main',
        data: {
            list: [],
            current: {}
        },

        mounted: function() {
            this.list = ms.get('list') || this.list;
            Event.$on('remove', id => {
                if (id) {
                    this.remove(id);
                }
            })
        },

        methods: {
            // 添加或更新
            merge() {
                var is_update,id;
                is_update = id = this.current.id;
                if (is_update) {
                    var index =  this.find_index(id);

                    Vue.set(this.list, index,  copy(this.current));

                } else {
                    var title = this.current.title;

                    if (!title && title !== 0) return;

                    var todo = copy( this.current);
                    todo.id  = this.next_id();

                    this.list.push(todo);
                }

                this.reset_current();

            },
            remove(id) {
                var index = this.find_index(id);
                this.list.splice(index,1);
            },

            next_id() {
                return this.list.length + 1;
            },
            set_current(todo) {
                this.current = copy(todo);
            },
            reset_current() {
                this.set_current({});
            },

            find_index(id) {
                return this.list.findIndex(function (item) {
                    return item.id == id;
                })
            },

            toggle_complete(id) {
                var i = this.find_index(id);

                Vue.set(this.list[i], 'completed', !this.list[i].completed);

            }
        },

        watch: {
            list: {
                deep: true,
                handler: function (n,o ) {
                    if (n) {
                        ms.set('list', n);
                    } else {
                        ms.set('list', []);
                    }
                }
            }
        }
    })

})();
