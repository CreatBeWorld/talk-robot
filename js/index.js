 (async () => {
     //验证是否登录，如果没有登录，跳转到登录页,已登录，则获取用户信息
     const res = await API.profile()
     const user = res.data
     if (!user) {
         alert('未登录或登录已过期，请重新登录')
         location.href = './login.html'
         return
     }
     const doms = {
         aside: {
             nickname: $('#nickname'),
             loginId: $('#loginId'),
             close: $('.close'),
         },
         chatContainer: $('.chat-container'),
         txtMsg: $('#txtMsg'),
         msgContainer: $('.msg-container')
     }
     setUserInfo() //设置用户信息
     //监听退出按钮点击
     doms.aside.close.onclick = () => {
         API.loginOut()
         location.href = './login.html'
     }
     await getChatHistory()
     //监听聊天表单的提交
     doms.msgContainer.onsubmit = async (e) => {
         e.preventDefault()
         sendChat()
     }
     /**
      * 添加一条聊天历史记录
      * @param {Object} chatRecord 一条聊天历史记录
      */
     function addChatRecord(chatRecord) {
         const div = $$$('div')
         div.classList.add('chat-item')
         if (!chatRecord.to) {
             div.classList.add('me')
         }
         const img = $$$('img')
         img.classList.add('chat-avatar')
         img.src = chatRecord.to ? "./asset/avatar.png" : "./asset/robot-avatar.jpg"
         const chatContent = $$$('div')
         chatContent.classList.add('chat-content')
         chatContent.innerText = chatRecord.content
         const chatDate = $$$('div')
         chatDate.classList.add('chat-date')
         chatDate.innerText = formDate(chatRecord.createdAt)
         div.appendChild(img)
         div.appendChild(chatContent)
         div.appendChild(chatDate)
         doms.chatContainer.appendChild(div)
     }
     /**
      * 时间戳格式化:yyyy-MM-dd hh:mm:ss
      * @param {String} timeStamp 时间戳
      * @returns 
      */
     function formDate(timeStamp) {
         const date = new Date(timeStamp)
         const year = date.getFullYear()
         const month = (date.getMonth() + 1).toString().padStart(2, '0')
         const day = date.getDate().toString().padStart(2, '0')
         const hour = date.getHours().toString().padStart(2, '0')
         const minute = date.getMinutes().toString().padStart(2, '0')
         const second = date.getSeconds().toString().padStart(2, '0')
         return `${year}-${month}-${day} ${hour}:${minute}:${second}`
     }
     /**
      * 设置用户信息
      */
     function setUserInfo() {
         doms.aside.nickname.innerText = user.nickname
         doms.aside.loginId.innerText = user.loginId
     }
     /**
      * 获取聊天历史记录
      */
     async function getChatHistory() {
         //获取聊天历史记录
         const chatHistory = await API.getHistory()
         chatHistory.forEach(chatRecord => {
             addChatRecord(chatRecord)
         })
         scrollBottom()
     }
     /**
      * 滚动条滚动到底部
      */
     function scrollBottom() {
         //scrollHeight:元素实际内容的高度，不包含border
         //scrollTop:元素视口可见区域的顶部到元素实际内容的顶部的距离，当该距离超过了该容器可滚动的最大值时，这该值为该容器可滚动的最大值
         doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
     }
     /**
      * 发送聊天记录
      */
     async function sendChat() {
         const content = doms.txtMsg.value.trim()
         if (!content) {
             return
         }
         addChatRecord({
             from: user.loginId,
             to: null,
             createdAt: Date.now(), //当前时间的时间戳,
             content
         })
         doms.txtMsg.value = ''
         scrollBottom()
         const {
             data
         } = await API.sendChat(content)
         addChatRecord({
             from: null,
             to: user.loginId,
             ...data
         })
         scrollBottom()
     }
 })();