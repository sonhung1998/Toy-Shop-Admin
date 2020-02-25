import axios from 'axios'
import Qs from 'qs'
let Axios = (headers = null) => {
    return axios.create({
        paramsSerializer: params => Qs.stringify(params, { arrayFormat: 'repeat' }),
        baseURL: 'http://localhost:8080/api',
        headers
    });
}

export default class APIClient {

    static GET = async (url) => {
        const { data } = await Axios().get(url);
        return data;
    }

    static POST = async (url, values) => {
        const headers = {
            'Content-Type': 'application/json;charset=UTF-8',
        }
        const { data } = await Axios(headers).post(url, values);
        return data
    }
    static DELETE = async (url) => {
        const { data } = await Axios().delete(url);
        return data
    }

}