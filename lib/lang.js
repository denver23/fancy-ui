// for nodejs

const data = {
  addContinue: ['继续添加'],
  alertDelete: ['确定要删除吗？'],
  all: ['全部'],
  back: ['返回'],
  cancel: ['取消'],
  channel: ['频道'],
  columnFilter: ['列筛选'],
  confirm: ['确定'],
  dataEmpty: ['数据为空', 'data is null'],
  edit: ['编辑'],
  errorCode: ['接口错误'],
  errorNet: ['网络错误'],
  list: ['列表'],
  none: ['无'],
  new: ['新建'],
  pleaseChoose: ['请选择'],
  save: ['保存'],
  saved: ['保存成功'],
  title: ['标题'],
  brand: ['品牌'],
  serial: ['车型'],
  role: ['角色', 'role'],
  manager: ['管理员'],
  managerGroup: ['管理组'],
  // 登录注册
  signin: ['登录', 'Sign in'],
  join: ['注册', 'Join'],
  mobile: ['手机号', 'Mobile'],
  email: ['邮箱', 'Email'],
  password: ['密码', 'Password'],
  passwordOld: ['旧密码', 'Old Password'],
  passwordNew: ['新密码', 'New Password'],
  passwordNewRe: ['重复密码', 'Repeat Password'],
  captcha: ['验证码', 'Captcha'],
  idcard: ['身份证', 'ID Card'],

  passwordConfirm: ['确认密码', 'Password Repeat'],
  passwordRe: ['请再次输入密码', 'Password Repeat'],
  send: ['发送', 'Send'],
  getCaptcha: ['获取验证码', 'get message'],
  getRepeat: ['重新获取', 'Get Repeat'],

  requiredMobile: ['请输入手机号', 'Mobile Required'],
  requiredPsw: ['请输入密码', 'Password Required'],
  requiredCaptcha: ['请输入验证码', 'Captcha Required'],
  requiredIDCard: ['请输入身份证号', 'IDCard Required'],

  invalidMobile: ['手机号不正确', 'Invalid Mobile'],
  invalidPsw: ['密码不正确', 'Invalid Password'],
  invalidPswRe: ['两次密码不一致', 'Invalid Password Repeat'],
  invalidMobiPsw: ['手机号或密码不正确', 'Invalid Mobile or Password'],
  invalidCaptcha: ['验证码错误', 'Invalid Captcha'],

  accountExisted: ['账号已存在', 'Account Existed'],
  idCardExisted: ['身份证号已存在', 'Account Existed'],
  joinAfterSignin: ['注册成功，请重新登录', 'Join success and signin again'],
  name: ['姓名', 'name'],
  gender: ['性别', 'gender'],
  status: ['状态', 'status'],
  description: ['描述', 'description'],
}

function getlang(key = 0) {
  let res = {};
  for (var i in data) {
    let item = data[i];
    if (item[key]) res[i] = item[key];
  }
  return res;
}

var cn = getlang(0);
var en = getlang(1);

module.exports = {
  cn,
  en
};
