const loginIdValidator = new FormValidator('txtLoginId', async val => {
    if (!val) {
        return '请填写账号'
    }
})

const loginPwdValidator = new FormValidator('txtLoginPwd', val => {
    if (!val) {
        return "请填写密码"
    }
})

const form = $('.user-form')
form.onsubmit = async (e) => {
    e.preventDefault() //阻止页面刷新
    const res = await FormValidator.validateAll(loginIdValidator, loginPwdValidator)
    if (!res) {
        return
    }
    const formData = new FormData(form)
    console.log(Object.fromEntries(formData.entries()))
    const loginRes = await API.login(Object.fromEntries(formData.entries()))
    if (loginRes.code === 0) {
        alert('登录成功')
        location.href = './index.html'
    } else {
        loginIdValidator.p.innerText = loginRes.msg
    }
}