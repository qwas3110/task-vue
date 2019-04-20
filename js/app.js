;(function () {
    'use strict';

    var Event = new Vue();

    var alert_sound = document.getElementById('alert-sound');

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
            var me = this;
            this.list = ms.get('list') || this.list;


            setInterval(function () {
                me.check_alerts();
            },1000);

            Event.$on('remove', id => {
                if (id) {
                    this.remove(id);
                }
            });
            Event.$on('toggle_complete', id => {
                if (id) {
                    this.toggle_complete(id);
                }
            });

            Event.$on('set_current', todo=> {
                if (todo) {
                    this.set_current(todo);
                }
            });

            Event.$on('toggle_detail', id => {
                if (id) {
                    this.toggle_detail(id);
                }
            })
        },

        methods: {
            // 任务提醒
            check_alerts() {
                var me = this;
                this.list.forEach(function (row,i) {
                    var alert_at = row.alert_at;
                    if (!alert_at || row.alert_confirmed) return;

                    var alert_at = (new Date(alert_at)).getTime();
                    var now = (new Date()).getTime();

                    if (now >= alert_at) {
                        alert_sound.play();
                        var confirmed = confirm(row.title);
                        Vue.set(me.list[i], 'alert_confirmed', confirmed)
                    }
                })
            },

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

            },

            toggle_detail(id) {
                var index = this.find_index(id);

                Vue.set(this.list[index],'show_detail', !this.list[index].show_detail)
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
