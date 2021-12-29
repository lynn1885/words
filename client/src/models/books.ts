import axios from 'axios'
import config from '../config/config.js'

const apiUrl: string = config.backEndUrl + '/books';

// 获取所有词表的信息
export function listAll(): Promise<any> {
  return axios.get(apiUrl + '/list')
}

// 获取某个词表的信息
export function listOne(bookName: string): Promise<any> {
  return axios.get(apiUrl + '/list/' + bookName)
}

// 创建新的词表
export function add(name: string, words: [string], importantWords: [string]): Promise<any> {
  return axios.put(apiUrl, {
    name,
    words,
    importantWords
  })
}

// 创建新的词表
export function update(name: string, words: [string], importantWords: [string]): Promise<any> {
  return axios.post(apiUrl, {
    name,
    words,
    importantWords
  })
}


// 删除一个词表
export function del(name: string): Promise<any> {
  return axios.delete(apiUrl + '/' + name)
}
