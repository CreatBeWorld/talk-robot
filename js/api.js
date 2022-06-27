var API = (() => {
    const BASE_URL = 'https://study.duyiedu.com'
    const TOKEN_KEY = 'token'

    function get(path) {
        const headers = {}
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + path, {
            headers
        })
    }

    function post(path, bodyObj) {
        const headers = {
            'Content-Type': 'application/json'
        }
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + path, {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyObj)
        })
    }
    async function reg(userInfo) {
        return await post('/api/user/reg', userInfo).then(resp => resp.json())
    }
    async function login(loginInfo) {
        const resp = await post('/api/user/login', loginInfo)
        const res = await resp.json()
        if (res.code === 0) {
            localStorage.setItem(TOKEN_KEY, resp.headers.get('authorization'))
        }
        return res
    }
    async function exists(loginId) {
        return await get(`/api/user/exists?loginId=${loginId}`).then(resp => resp.json())
    }
    async function profile() {
        return await get('/api/user/profile').then(resp => resp.json())
    }
    async function sendChat(content) {
        return await post('/api/chat', {
            content
        }).then(resp => resp.json())
    }
    async function getHistory() {
        return await get('/api/chat/history').then(resp => resp.json()).then(res => res.data)
    }

    function loginOut() {
        localStorage.removeItem(TOKEN_KEY)
    }
    return {
        reg,
        login,
        exists,
        profile,
        sendChat,
        getHistory,
        loginOut,
        TOKEN_KEY
    }
})()