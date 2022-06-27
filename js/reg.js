const loginIdValidator = new FormValidator('txtLoginId', async val => {
    if (!val) {
        return '请填写账号'
    }
    const res = await API.exists(val)
    if (res.data) {
        return '该账号已被占用，请重新填写账号'
    }
})
const nicknameValidator = new FormValidator('txtNickname', val => {
    if (!val) {
        return '请填写昵称'
    }
})
const loginPwdValidator = new FormValidator('txtLoginPwd', val => {
    if (!val) {
        return "请填写密码"
    }
})
const loginPwdConfirmValidator = new FormValidator('txtLoginPwdConfirm', val => {
    if (!val) {
        return "请填写确认密码"
    }
    if (val !== loginPwdValidator.input.value) {
        return "两次密码需一致"
    }
})
const form = $('.user-form')
form.onsubmit = async (e) => {
    e.preventDefault() //阻止页面刷新
    const res = await FormValidator.validateAll(loginIdValidator, nicknameValidator, loginPwdValidator, loginPwdConfirmValidator)
    if (!res) {
        return
    }
    const formData = new FormData(form)
    console.log(Object.fromEntries(formData.entries()))
    const loginRes = await API.reg(Object.fromEntries(formData.entries()))
    if (loginRes.code === 0) {
        alert('注册成功')
        location.href = './login.html'
    } else {
        loginIdValidator.p.innerText = '注册失败'
    }
}