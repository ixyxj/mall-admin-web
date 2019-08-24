import request from '@/utils/request'
import * as qiniu from 'qiniu-js'
import {formatDate} from "@/utils/date";

export function policy() {
  return request({
    url:'/aliyun/oss/policy',
    method:'get',
  })
}

export function getToken() {
  return request({
    url: '/sys/getQiNiuYunToken',
    method: 'get'
  })
}

export function upload(token, request, next, error, completed) {
  const {
    file
  } = request;
  const key = formatDate(new Date(), 'yyyyMMddhhmmssSSS') + parseInt(Math.random() * 1000, 10);
  const putExtra = {
      fileName: '',
      params: {},
      mimeType: [] || null,
    },
    config = {
      useCdnDomain: true,
      region: qiniu.region.z2
    };

  let options = {
    quality: 1,
    noCompressIfLarger: true,
    maxWidth: 2000,
    maxHeight: 2000
  };

  qiniu.compressImage(file, options).then(data => {
    let observable = qiniu.upload(data.dist, key, token, putExtra, config);
    let subscription = observable.subscribe(next, error, completed);
    return subscription
  }).catch(reason => {
    console.log(reason);
    return reason;
  });
}
