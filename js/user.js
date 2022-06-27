//用户登录和注册的表单项验证代码
class FormValidator {
    /**
     * 构造器
     * @param {String} txtId 表单项id 
     * @param {Function} validatorFunc 表单项验证函数，有错误，则返回错误消息，无错误，则返回空字符串
     */
    constructor(txtId, validatorFunc) {
        this.input = $(`#${txtId}`);
        this.p = this.input.nextElementSibling
        this.validatorFunc = validatorFunc
        this.input.onblur = () => {
            this.validate()
        }
    }
    /**
     * 验证成功返回true，验证失败返回false
     */
    async validate() {
        const errMsg = await this.validatorFunc(this.input.value)
        if (errMsg) {
            this.p.innerText = errMsg
            return false
        } else {
            this.p.innerText = ''
            return true
        }
    }
    /**
     * 对传入的所有的validator进行统一的验证，验证通过返回true，否则返回false
     * @param  {FormValidator[]} validators 
     * @returns 通过-true,不通过-false
     */
    static async validateAll(...validators) {
        const res = await Promise.all(validators.map(v => v.validate()))
        return res.every(r => r)
    }

}