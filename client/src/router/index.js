import Vue from 'vue'
import Router from 'vue-router'
import wordsEditor from '@/views/words-editor/words-editor.vue'
import recitation from '@/views/recitation/recitation.vue'
import list from '@/views/list/list.vue'
import wordsBooks from '@/views/words-books/words-books.vue'

Vue.use(Router)
var router = new Router({
  routes: [
    {
      path: '/',
      components: { 'main': wordsBooks }
    },
    {
      path: '/word-editor',
      components: { 'main': wordsEditor }
    },
    {
      path: '/recitation',
      components: { 'main': recitation }
    },
    {
      path: '/list',
      components: { 'main': list }
    }
  ]

})

export default router
