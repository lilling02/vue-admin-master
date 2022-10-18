import request from "@/utils/loginRequest";

export function login(data) {
  return request({
    url: "/dev-api/admin/acl/index/login",
    // 这是mock数据的链接
    // url: "/vue-admin-template/user/login",
    method: "post",
    data,
  });
}

export function getInfo(token) {
  return request({
    url: "/dev-api/admin/acl/index/info",
    method: "get",
    params: { token },
  });
}

export function logout() {
  return request({
    url: "/dev-api/admin/acl/index/logout",
    method: "post",
  });
}
