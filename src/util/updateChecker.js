const {
    dialog,
    shell
} = require('electron');
const axios = require('axios');
const pkg = require('../../package.json');
const version = pkg.version;
const release = 'https://api.github.com/repos/zxyqwe/baby-gallery/releases/latest';
const downloadUrl = 'https://github.com/zxyqwe/baby-gallery/releases/latest';

const checkVersion = async () => {
    const res = await axios.get(release);
    if (res.status === 200) {
        const latest = res.data.name; // 获取版本号
        const result = compareVersion2Update(version, latest); // 比对版本号，如果本地版本低于远端则更新
        if (result) {
            dialog.showMessageBox({
                type: 'info',
                title: '发现新版本',
                buttons: ['Yes', 'No'],
                message: '发现新版本，更新了很多功能，是否去下载最新的版本？'
            }, (res) => {
                if (res === 0) { // if selected yes
                    shell.openExternal(downloadUrl);
                }
            });
        }
    } else {
        return false;
    }
};

// if true -> update else return false
const compareVersion2Update = (current, latest) => {
    const currentVersion = current.split('.').map(item => parseInt(item));
    const latestVersion = latest.split('.').map(item => parseInt(item));
    let flag = false;
    for (let i = 0; i < 3; i++) {
        if (currentVersion[i] < latestVersion[i]) {
            flag = true;
        }
    }
    return flag;
};

module.exports.checkVersion = checkVersion;