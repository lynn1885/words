<template>
  <div id="words-books">
    <!-- 创建单词本 -->
    <el-input
      class="add-new-book"
      placeholder="创建单词本"
      suffix-icon="el-icon-edit"
      v-model="newBookName"
      @keydown.native="addBook($event)"
      clearable
    ></el-input>

    <!-- 单词本 -->
    <div class="books-container">
      <div class="book" v-for="book of allBooks" :key="book._id" @click="openBook(book)">
        <div class="book-name">
          {{ book.name }}
        </div>
        <div class="book-length">单词个数: {{ book.words.length }}</div>
        <div class="book-length">重点个数: {{ book.importantWords.length }}</div>
        <div class="handle-bar">
          <i class="el-icon-delete" title="删除词表" @click.stop="deleteBook(book)"></i>
          <i class="el-icon-edit" title="编辑词表" @click.stop="editBook(book)"></i>
          <i class="el-icon-view" title="复习词表"  @click.stop="reviewBook(book)"></i>
        </div>
      </div>
    </div>

    <!-- 编辑单词本 -->
    <el-dialog
      v-if="isShowWordsInputer"
      :title="'编辑单词本 ' + curSelectBook.name"
      :visible.sync="isShowWordsInputer"
      :close-on-click-modal="false"
      id="word-editor"
    >
      <el-input
        type="textarea"
        :rows="10"
        placeholder="请输入英文单词, 以换行分隔"
        v-model="tempEditWords"
      ></el-input>
      <div class="button">
        <el-button type="primary" @click="confirmEditBook">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 删除单词本 -->
    <el-dialog
      v-if="isShowDeleteWordDialog"
      :title="'删除单词本 ' + curSelectBook.name + ', 其中共包含 ' + curSelectBook.words.length + ' 个单词'"
      :visible.sync="isShowDeleteWordDialog"
      :close-on-click-modal="false"
      id="word-editor"
    >
      <el-input
        placeholder="请输入删除秘钥"
        v-model="tempDeleteKey"
      ></el-input>
      <div class="button">
        <el-button type="danger" @click="confirmDeleteBook">删 除</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as booksModel from '@/models/books.ts'

export default {
  name: 'words-books',
  data () {
    return {
      allBooks: [], // 所有单词本
      curSelectBook: null, // 当前正在操作的单词本的名称
      // 新建
      newBookName: '', // 新建单词本的名称
      // 编辑
      tempEditWords: '', // 当前正在临时编辑的单词
      isShowWordsInputer: false, // 是否显示编辑单词的弹窗
      // 删除
      isShowDeleteWordDialog: false, // 是否显示删除单词的弹窗
      deleteKey: 'year', // 删除秘钥
      tempDeleteKey: ''
    }
  },
  methods: {
    // 添加一个单词本
    async addBook (e) {
      if (e.keyCode === 13 && this.newBookName) {
        try {
          await booksModel.add(this.newBookName, [])
          await this.listAllBooks()
          this.newBookName = ''
        } catch (error) {
          console.log(error.response)
          this.$message({
            message: '创建单词本失败: ' + error.response.data.msg,
            type: 'error'
          })
        }
      }
    },

    // 更新词表
    async updateBook (bookName, words, importantWords) {
      try {
        await booksModel.update(bookName, words, importantWords)
        this.$message({
          message: '更新词表成功',
          type: 'success'
        })
      } catch (error) {
        console.error(error)
        this.$message({
          message: '更新词表失败',
          type: 'error'
        })
      }
    },

    // 获取所有单词本
    async listAllBooks () {
      try {
        const allBooks = await booksModel.listAll()
        if (allBooks.status === 200) {
          this.allBooks = allBooks.data
        }
      } catch (error) {
        this.$messagethis.$message({
          message: '获取词表失败',
          type: 'error'
        })
      }
    },

    // 打开单词本
    openBook (book) {
      this.$router.push('./word-editor?book=' + book.name)
    },

    // 编辑单词本
    editBook (book) {
      this.isShowWordsInputer = true
      this.curSelectBook = book
      this.tempEditWords = book.words.join('\n')
    },

    // 复习单词
    reviewBook (book) {
      this.$router.push('./recitation?book=' + book.name)
    },

    // 确认编辑词表
    async confirmEditBook () {
      await this.updateBook(
        this.curSelectBook.name,
        this.tempEditWords.split('\n').filter(item => item).map(item => item.trim()),
        this.curSelectBook.importantWords
      )
      await this.listAllBooks()
      this.curSelectBook = null
      this.tempEditWords = ''
      this.isShowWordsInputer = false
    },

    // 删除单词本
    deleteBook (book) {
      this.curSelectBook = book
      this.isShowDeleteWordDialog = true
    },

    // 确认删除
    async confirmDeleteBook () {
      if (this.tempDeleteKey === this.deleteKey) {
        try {
          await booksModel.del(this.curSelectBook.name)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          await this.listAllBooks()
        } catch (error) {
          this.$message({
            message: '删除失败',
            type: 'error'
          })
        }
      } else {
        this.$message({
          message: '秘钥错误',
          type: 'error'
        })
      }

      this.isShowDeleteWordDialog = false
      this.curSelectBook = null
      this.tempDeleteKey = ''
    }
  },
  async mounted () {
    this.listAllBooks()
  }
}
</script>
<style lang="scss">
#words-books {
  padding: 10px;
  .books-container {
    display: flex;
    flex-wrap: wrap;
    /* 单词本 */
    .book {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      justify-content: space-between;
      width: 140px;
      height: 200px;
      background: rgb(246, 239, 225);
      border-radius: 4px;
      margin: 10px;
      box-shadow: 0px 0px 10px 0px #ccc;
      cursor: pointer;
      .book-name {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #333;
        font-size: 20px;
        height: 140px;
      }
      .book-length {
        color: #999;
        text-align: center;
        font-size: 12px;
      }
      .handle-bar {
        color: #999;
        display: flex;
        justify-content: flex-end;
        i {
          padding: 4px;
          cursor: pointer;
        }
      }
    }
  }

  /* 编辑单词 */
  #word-editor {
    .button {
      display: flex;
      margin-top: 10px;
      justify-content: right;
    }
  }
}
</style>
