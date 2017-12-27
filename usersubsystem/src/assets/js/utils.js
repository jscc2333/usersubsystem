export function checkValue(type, value) {
  switch (type) {
    case 'username':
      {
        return value === '' ? '请输入用户名' : true
      }
    case 'password':
      {
        return value.length < 8 ? '请输入长度大于8的密码' : true
      }
    case 'email':
      {
        const isEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
        if (value.length === 0) {
          return '请输入邮箱'
        } else if (!isEmail.test(value)) {
          return '请输入正确的邮箱格式'
        }
        return true
      }
    case 'phone':
      {
        const isPhone = /^\d{11}$/
        if (value.length === 0) {
          return '请输入手机号码'
        } else if (!isPhone.test(value)) {
          return '请输入正确的手机号码格式'
        }
        return true
      }
    case 'realname':
      {
        return value === '' ? '请输入真实姓名' : true
      }
    case 'idNumber':
      {
        const isIdNumber = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (value.length === 0) {
          return '请输入身份证号码'
        } else if (!isIdNumber.test(value)) {
          return '请输入正确的身份证号码格式'
        }
        return true
      }
    case 'zipCode':
      {
        const isZipCode = /^\d{6}$/
        if (value.length === 0) {
          return '请输入邮政编码'
        } else if (!isZipCode.test(value)) {
          return '请输入正确的邮编格式'
        }
        return true
      }
    case 'consignee':
      {
        return value === '' ? '请输入收货人姓名' : true
      }
    case 'address':
      {
        return value === '' ? '请输入地址' : true
      }
    default:
      return false
  }
}
export function getChangedValue(array1, array2) {
  const array = []
  Array.prototype.forEach.call(array1, (element, index) => {
    if (element !== array2[index]) {
      array.push(index)
    }
  })
  return array
}
export const a = 1
