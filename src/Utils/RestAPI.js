// RestAPI 정의부분
const serverURL = 'https://toonlab.me/';
const hostURL = serverURL;

const futch = (url, opts = {}, onProgress) => {
    // console.log(url, opts)
    return new Promise((res, rej) => {
        var xhr = new XMLHttpRequest();
        xhr.open(opts.method || 'get', url);
        for (var k in opts.headers || {})
            xhr.setRequestHeader(k, opts.headers[k]);
        xhr.onload = e => res(e.target);
        xhr.onerror = rej;
        if (xhr.upload && onProgress)
            xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
        xhr.send(opts.body);
    });
}

const formDataCall = (subUrl, method, body, headers, callBack, isFullLink = false) => {
    let link = isFullLink ? subUrl : hostURL + subUrl
    let start = Date.now();

    futch(link, {
        method: method,
        body: body,
        headers: headers
    }, (progressEvent) => {
        const progress = progressEvent.loaded / progressEvent.total;
        // console.log("this is progress : ", progress);

    }).then(function (resJson) {
        // console.log('Here is response from server!>>>>>|||>>|:>');

        try {
            let res = JSON.parse(resJson.response)
            // console.log('after parsing: ', res)
            callBack(res, null);
            
            let end = Date.now()
            // console.log("end date is ", end)
            // console.log(`Execution time: ${end - start} ms`);

        } catch (exception) {
            console.log(exception);
            callBack(null, exception);
        }

    }, (err) => {

        console.log('parsing err ', err)
        callBack(null, err);
    }
    );
}


const RestAPI = {

    register: (name, id, password) => {

        let data = new FormData()
        data.append('mode', 'signup')
        data.append('type', 'email')
        data.append('nickname', name)
        data.append('id', id)
        data.append('pwd', password)
        data.append('deviceName', global.deviceName)
        data.append('ip', global.ipAddress)


        return new Promise((resolve, reject) => {
            formDataCall('api_sign_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },

    googleAppleRegister: (socialType, email, fname, lname) => {
        let data = new FormData()
        data.append('mode', 'signup')
        data.append('type', 'google')
        data.append('socialType', socialType)
        data.append('name', fname+" "+lname)
        data.append('email', email)
        data.append('deviceName', global.deviceName)
        data.append('ip', global.ipAddress)

        return new Promise((resolve, reject) => {
            formDataCall('api_sign_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },

    socialRegister: (type, email, name, gender, age_range, typeId, aToken, rToken) => {
        let data = new FormData()
        data.append('mode', 'signup')
        data.append('type', type)
        data.append('email', email)
        data.append('name', name)
        data.append('gender', gender)
        data.append('age_range', age_range)
        data.append('typeId', typeId)
        data.append('aToken', aToken)
        data.append('rToken', rToken)
        data.append('deviceName', global.deviceName)
        data.append('ip', global.ipAddress)

        console.log("this is kakao signup data : ", data)

        return new Promise((resolve, reject) => {
            formDataCall('api_sign_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },

    socialLogin: (type, email, name, gender, age_range, typeId, aToken, rToken) => {
        let data = new FormData()
        data.append('mode', 'login')
        data.append('type', type)
        data.append('email', email)
        data.append('name', name)
        data.append('gender', gender)
        data.append('age_range', age_range)
        data.append('typeId', typeId)
        data.append('aToken', aToken)
        data.append('rToken', rToken)

        if (global.expoPushToken && global.UUID) {
            data.append('push_token', global.expoPushToken)
            data.append('uuid', global.UUID)
        }

        return new Promise((resolve, reject) => {
            formDataCall('api_sign_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },

    login(id, password) {
        let data = new FormData()
        data.append('mode', 'login')
        data.append('type', 'email')
        data.append('id', id)
        data.append('pwd', password)

        if (global.expoPushToken && global.UUID) {
            // console.log("this is emailLogin api: ", global.expoPushToken + "+" + global.UUID)
            data.append('push_token', global.expoPushToken)
            data.append('uuid', global.UUID)
        }

        return new Promise((resolve, reject) => {
            formDataCall('api_sign_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    logout(curUserIx) {
        let data = new FormData()
        data.append('mode', 'logout')
        data.append('userIx', curUserIx)

        if(global.expoPushToken && global.UUID) {
            data.append('push_token', global.expoPushToken);
            data.append('uuid', global.UUID)
        }
        return new Promise((resolve, reject) => {
            formDataCall('api_sign_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    googleAppleLogin: (socialType, email, fname, lname) => {
        let data = new FormData()
        data.append('mode', 'login')
        data.append('type', 'google')
        data.append('socialType', socialType)
        data.append('email', email)
        data.append('name', fname+" "+lname)

        if (global.expoPushToken && global.UUID) {
            // console.log("this is googleAppleLogin api: ", global.expoPushToken + "+" + global.UUID)
            data.append('push_token', global.expoPushToken)
            data.append('uuid', global.UUID)
        }

        return new Promise((resolve, reject) => {
            formDataCall('api_sign_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },

    getHomeWebtoons: (curUserIx) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)

        return new Promise((resolve, reject) => {
            formDataCall('api_home', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    preProcess: (curUserIx) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('mode', 'pre_process')

        return new Promise((resolve, reject) => {
            formDataCall('api_webtoon_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    getWebtoonDetail: (curUserIx, webtoonIx) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('webix', webtoonIx)

        return new Promise((resolve, reject) => {
            formDataCall('api_profile', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    postReview: (curUserIx, webtoonIx, content) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('webtoon_ix', webtoonIx)
        data.append('mode', 'review')
        data.append('review', content)
        // data.append('rate',rate)

        return new Promise((resolve, reject) => {
            formDataCall('api_webtoon_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    giveStar: (curUserIx, webtoonIx, rate) => {
        let data = new FormData()
        data.append('mode', 'color')
        data.append('user_ix', curUserIx)
        data.append('webtoon_ix', webtoonIx)
        data.append('rate', rate)

        return new Promise((resolve, reject) => {
            formDataCall('api_webtoon_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    ctrlWebtoon: (ctrl, curUserIx, webtoonIx) => {
        let data = new FormData()
        data.append('mode', ctrl)
        data.append('user_ix', curUserIx)
        data.append('webix', webtoonIx)

        return new Promise((resolve, reject) => {
            formDataCall('api_recommend_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    apprWebtoon: (curUserIx, number, mode, type, val) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('mode', mode)
        data.append('type', type)
        data.append('val', val)
        data.append('number', number)

        return new Promise((resolve, reject) => {
            formDataCall('api_webtoon_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    apprSelectWebtoon: (curUserIx, type, val) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('mode', 'change')
        data.append('type', type)
        data.append('val', val)

        return new Promise((resolve, reject) => {
            formDataCall('api_webtoon_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    getPickApprWebtoon: (curUserIx, type) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('type', type)

        return new Promise((resolve, reject) => {
            formDataCall('api_drawer', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    checkPickWebtoon: (curUserIx, webtoonIx) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('webtoon_ix', webtoonIx)

        return new Promise((resolve, reject) => {
            formDataCall('api_checkWebtoon', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    checkRefuseShownWebtoon: (curUserIx, webtoonIx, type) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('webtoon_ix', webtoonIx)
        data.append('type', type)

        return new Promise((resolve, reject) => {
            formDataCall('api_checkWebtoon_ctrl', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    getMyPage: (curUserIx) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)

        return new Promise((resolve, reject) => {
            formDataCall('api_mypage', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    postInquiry: (curUserIx, inquiry_key, inquiry_title, email, main_ok, content) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('mode', 'inquiry')
        data.append('inquiry_key', inquiry_key)
        data.append('inquiry_title', inquiry_title)
        data.append('email', email)
        data.append('main_ok', main_ok)
        data.append('inquiry_txt', content)

        return new Promise((resolve, reject) => {
            formDataCall('api_my_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    getInquiry: (curUserIx) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('mode', 'inquiry_list')

        return new Promise((resolve, reject) => {
            formDataCall('api_my_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    getFaq: () => {
        let data = new FormData()
        data.append('mode', 'faq')

        return new Promise((resolve, reject) => {
            formDataCall('api_my_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    getBoard: () => {
        let data = new FormData()
        data.append('mode', 'real_board')

        return new Promise((resolve, reject) => {
            formDataCall('api_my_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    changeNick: (curUserIx, name) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('mode', 'nick')
        data.append('type', 'modify')
        data.append('nickname', name)

        return new Promise((resolve, reject) => {
            formDataCall('api_my_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    changePassword: (curUserIx, password) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('password', password)
        data.append('mode', 'password')

        return new Promise((resolve, reject) => {
            formDataCall('api_my_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    closeAccount: (curUserIx, reason) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('reason', reason)
        data.append('mode', 'withdraw')

        return new Promise((resolve, reject) => {
            formDataCall('api_my_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    favorGenreSel: (curUserIx, favorGenre) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('mode', 'early_favor')
        data.append('favor_val', favorGenre)

        return new Promise((resolve, reject) => {
            formDataCall('api_my_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    favorDelWebtoon: (curUserIx, webtoonIx) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('webix', webtoonIx)
        data.append('mode', 'favor_del')

        return new Promise((resolve, reject) => {
            formDataCall('api_recommend_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    getDayList: (curUserIx, val, platform) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('mode', 'change')
        data.append('type', 'platform_ing')
        data.append('val', val)
        data.append('platform', platform)

        return new Promise((resolve, reject) => {
            formDataCall('api_webtoon_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    addFavoritesWebtoon: (curUserIx, day, webix) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('mode', 'favorites')
        data.append('webix', webix)
        data.append('day', day)

        return new Promise((resolve, reject) => {
            formDataCall('api_recommend_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    getWebtoonFromDay: (curUserIx, day) => {
        let data = new FormData()
        data.append('mode', 'day')
        data.append('user_ix', curUserIx)
        data.append('day', day)

        return new Promise((resolve, reject) => {
            formDataCall('api_my_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    pickDel: (curUserIx, webix) => {
        let data = new FormData()
        data.append('mode', 'pick_del')
        data.append('webix', webix)
        data.append('user_ix', curUserIx)


        return new Promise((resolve, reject) => {
            formDataCall('api_my_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    refuseDel: (curUserIx, webix) => {
        let data = new FormData()
        data.append('mode', 'refuse_del')
        data.append('webix', webix)
        data.append('user_ix', curUserIx)


        return new Promise((resolve, reject) => {
            formDataCall('api_my_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    shownDel: (curUserIx, webix) => {
        let data = new FormData()
        data.append('mode', 'shown_del')
        data.append('webix', webix)
        data.append('user_ix', curUserIx)


        return new Promise((resolve, reject) => {
            formDataCall('api_my_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    searchWebtoon: (keyWord) => {
        let data = new FormData()
        data.append('keyword', keyWord)

        return new Promise((resolve, reject) => {
            formDataCall('api_search', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    getPush: (curUserIx) => {
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('mode', 'get_push')

        return new Promise((resolve, reject) => {
            formDataCall('api_my_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    setPush: (curUserIx, one, two, three) => {
        one == true ? one = 1 : one = 0
        two == true ? two = 1 : two = 0
        three == true ? three = 1 : three = 0
        let data = new FormData()
        data.append('user_ix', curUserIx)
        data.append('mode', 'set_push')
        data.append('one', one)
        data.append('two', two)
        data.append('three', three)

        return new Promise((resolve, reject) => {
            formDataCall('api_my_ok', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    },
    checkWebtoonAppr: (curUserIx, webtoonIx) => {
        let data = new FormData()
        data.append('webtoon_ix', webtoonIx)
        data.append('user_ix', curUserIx)

        return new Promise((resolve, reject) => {
            formDataCall('api_checkWebtoonAppr', 'post', data, null, (res, err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }
}

export default RestAPI
