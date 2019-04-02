import Vue from 'vue'
import Router from 'vue-router'
import wordsBook from '@/views/words-book/words-book.vue'
import recitation from '@/views/recitation/recitation.vue'
import list from '@/views/list/list.vue'

Vue.use(Router);
var router = new Router({
  routes: [
    {
      path: '/',
      components: {'main': wordsBook}
    },
    {
      path: '/recitation',
      components: {'main': recitation}
    },
    {
      path: '/list',
      components: {'main': list}
    }
  ]

})

export default router
