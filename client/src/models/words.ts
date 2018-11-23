import * as _ from 'lodash'
import axios from 'axios'
import config from '../config/config.js'

const apiUrl: string = config.backEndUrl + '/words';

// search
export function search (word: string): Promise<any> {
    let url: string = apiUrl + '/search';
    return axios.get(url + '/' + word);
}

// find
interface FindQuery {
    dsl: object,
    mutiple?: boolean
};
export function find (query: FindQuery): Promise<any> {
    let url: string = apiUrl + '/find';
    return axios.get(url, {
        params: {
            query: JSON.stringify(query)
        }
    });
}

// update
export function update (word: string, updateContent: object): Promise<any> {
    let url: string = apiUrl + '/update/' + word;
    return axios.post(url, updateContent, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
}

// delete
export function del (id: string, token: string, word?: string): Promise<any> {
    let url: string = apiUrl + '/delete/' + id;
    return axios.delete(url, {
        params: {
            token,
            word
        }
    });
}

// list
export function list (from: number, size: number, sortBy?: string, order?: string): Promise<any> {
    let url: string = apiUrl + '/list';
    return axios.get(url, {
        params: {
            from,
            size
        }
    });
}