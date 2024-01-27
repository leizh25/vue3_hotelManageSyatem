//登录接口需要携带的参数的TS类型
export interface loginForm {
  empPhone: string
  password: string
}

// //登录接口返回的数据的类型
// interface dataType {
//   msg: string,
//   data: {
//     empId: number,
//     roleId: number,
//     empSex: string,
//     empPhone: string,
//     password: string,
//     positions: string,
//     empAddress: string,
//     empName: string,
//   },
//   map: {
//     JWT: string
//   }
// }
export interface loginResponseData {
  code: number
  msg: string
  data: {
    empId: number
    roleId: number
    empSex: string
    empPhone: string
    password: string
    positions: string
    empAddress: string
    empName: string
  }
  map: {
    JWT: string
  }
}

//定义服务器返回用户信息相关的数据类型
export interface userResponseData {
  code: number
  msg: string
  data: {
    empId: number
    serialVersionUID: number
    password: string
    empSex: string
    empPhone: string
    cnName: string
    roleId: number
    empName: string
    positions: string
    empAddress: string
    empPhoto: string
  }
}

/**
 * 修改密码表单数据类型
 */
export interface UpdatePasswordForm {
  empId: number
  old_password: string
  new_password: string
  confirm_password?: string
}
