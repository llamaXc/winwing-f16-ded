/*
 * @Author: lixingguo 
 * @Date: 2024-01-19 16:49:35 
 * @Last Modified by: lixingguo
 * @Last Modified time: 2024-01-19 16:51:41
 */
const XPLANE = {}

// 提取X-Plane游戏目录下X-Plane Window Positions.prf配置文件信息
XPLANE.extractConfigForXPlane = (deviceInfo, targetpath) => {
    if (targetpath) {
        // 先获取到原有配置文件信息
        const fileContent_targt = fs.readFileSync(targetpath, 'utf-8');
        // 先判断有无设备信息
        const regex = /_joy_unique_id(\d+)/g;
        const match = fileContent_targt.match(regex);
        console.log('match=', match);
        if (match) {
            // 如果有设备信息，再判断有无当前设备信息
            const IDstr = 'VID:' + deviceInfo.vid + 'PID:' + deviceInfo.pid;
            const regex_target = new RegExp(`_joy_unique_id(\\d+) ${IDstr}`, 'g');
            const match_target = fileContent_targt.match(regex_target);
            if (match_target) {
                // 如果有当前设备信息，则取出_joy_AXIS_use和_joy_BUTN_use
                // step1: 取出坐标初始倍数值
                const match_num = match_target.join('\n').match(/_joy_unique_id(\d+)/);
                const locNum = match_num ? match_num[1] : 0
                // step2: 取出fileContent_targt中_joy_AXIS_use对应角标值
                const locNum_axis = locNum * 25
                const target_axis = this.handleAXISDataForXPlane(locNum_axis, fileContent_targt)
                // step6: 取出fileContent_targt中_joy_BUTN_use对应角标值
                const locNum_butn = locNum * 160
                const target_butn = this.handleBUTNDataForXPlane(locNum_butn, fileContent_targt)
                return {
                    code: true,
                    content: target_axis + target_butn
                }
            } else {
                // 如果没有当前设备信息，给出提示哈
                return {
                    code: false,
                    message: 'no device'
                }
            }
        } else {
            // 如果没有设备信息，给出提示
            return {
                code: false,
                message: 'no device'
            }
        }
    }
}
// 激活X-Plane游戏目录下X-Plane Window Positions.prf配置文件信息
XPLANE.activeWindowPositionConfigFilesForXPlane = (deviceInfo, filepath, targetpath) => {
    if (targetpath) {
        // 先获取到原有配置文件信息
        const oldFileContent_targt = fs.readFileSync(targetpath, 'utf-8');
        const newFileContent = fs.readFileSync(filepath, 'utf-8');
        var returnContent;
        // 先判断有无设备信息
        const regex = /_joy_unique_id(\d+)/g;
        const match = oldFileContent_targt.match(regex);
        if (match) {
            // 如果有设备信息，再判断有无当前设备信息
            const IDstr = 'VID:' + deviceInfo.vid + 'PID:' + deviceInfo.pid;
            const regex_target = new RegExp(`_joy_unique_id(\\d+) ${IDstr}`, 'g');
            const match_target = oldFileContent_targt.match(regex_target);
            if (match_target) {
                // 如果有当前设备信息，则替换joy_lru_time和_joy_AXIS_use和_joy_BUTN_use
                // step1: 取出坐标初始倍数值
                const match_num = match_target.join('\n').match(/_joy_unique_id(\d+)/);
                const locNum = match_num ? match_num[1] : 0
                // step2：处理数据
                returnContent = XPLANE.handleConfigDataForXPlane(locNum, oldFileContent_targt, newFileContent)
                // step3: 把新数据写入配置文件X-Plane Window Positions.prf
                fs.writeFileSync(targetpath, returnContent, 'utf-8');
                return {
                    code: true,
                    message: 'success'
                }
            } else {
                // 如果没有当前设备信息，取出设备最大值，追加当前设备信息在其后面
                let locNum = match.length; // 初始值设置为-1，确保能捕获到首个匹配的ID
                if (locNum < 21) {
                    // step1：追加joy_unique_id
                    const uniqueStr_max = new RegExp(`_joy_unique_id${locNum - 1} .+`, 'g');
                    returnContent = oldFileContent_targt.replace(uniqueStr_max, `$&\n_joy_unique_id${locNum} ${IDstr}`);
                    // step2：追加joy_location
                    const location_max = new RegExp(`_joy_location${locNum - 1} .+`, 'g');
                    const location_new = `_joy_location${locNum} ${deviceInfo.path}`
                    returnContent = returnContent.replace(location_max, `$&\n${location_new}`);
                    // step3：处理数据
                    returnContent = XPLANE.handleConfigDataForXPlane(locNum, returnContent, newFileContent)
                    // step4: 把新数据写入配置文件X-Plane Window Positions.prf
                    fs.writeFileSync(targetpath, returnContent, 'utf-8');
                    return {
                        code: true,
                        message: 'success'
                    }
                } else {
                    // 只支持20个设备啊, 给出提示
                    return {
                        code: false,
                        message: 'over max'
                    }
                }
            }
        } else {
            // 如果没有设备信息，给出提示
            return {
                code: false,
                message: 'no device'
            }
        }
    }
}
// 处理XPlane中_joy_lru_time、_joy_AXIS_use、_joy_BUTN_use中的数据
XPLANE.handleConfigDataForXPlane = (locNum, returnContent, newFileContent) => {
    // step1: 替换joy_lru_time对应的数据
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const old_lru = new RegExp(`_joy_lru_time${locNum}\\s(\\d+)`)
    const new_lru = `_joy_lru_time${locNum} ${currentTimestamp}`
    returnContent = returnContent.replace(old_lru, new_lru);
    // step2: 取出returnContent中_joy_AXIS_use对应角标值
    const locNum_axis = locNum * 25
    const target_axis = XPLANE.handleAXISDataForXPlane(locNum_axis, returnContent)
    // step3: 取出newFileContent中_joy_AXIS_use对应角标值
    const new_axis = XPLANE.handleNewContentAXISForXPlane(locNum_axis, newFileContent)
    // step4: 替换target_axis中_joy_AXIS_use后面数据值
    const replace_axis = target_axis.replace(/(_joy_AXIS_use\d+)\s+(\d+)/g, (match, group1) => {
        const correspondingValue = new_axis.match(new RegExp(`${group1}\\s+(\\d+)`));
        return correspondingValue ? `${group1} ${correspondingValue[1]}` : match;
    });
    // step5: 替换_joy_AXIS_use数据
    returnContent = returnContent.replace(target_axis, replace_axis)
    // step6: 取出fileContent_targt中_joy_BUTN_use对应角标值
    const locNum_butn = locNum * 160
    const target_butn = XPLANE.handleBUTNDataForXPlane(locNum_butn, returnContent)
    // step7: 取出newFileContent中_joy_BUTN_use对应角标值
    const new_butn = XPLANE.handleNewContentBUTNForXPlane(locNum_butn, newFileContent)
    // step8: 替换target_axis中_joy_BUTN_use后面字符串
    const replace_butn = target_butn.replace(/(_joy_BUTN_use\d+)\s+(.+)/g, (match, group1) => {
        const correspondingValue = new_butn.match(new RegExp(`${group1}\\s+(.+)`));
        return correspondingValue ? `${group1} ${correspondingValue[1]}` : match;
    });
    // step9: 替换_joy_BUTN_use数据并返回
    return returnContent.replace(target_butn, replace_butn)
}
// 处理_joy_AXIS_use数据
XPLANE.handleAXISDataForXPlane = (locNum_axis, fileContent_targt) => {
    const regex = new RegExp(`_joy_AXIS_use${locNum_axis}\\s*(\\d+)\\s+(.+)[\\s\\S]*?_joy_AXIS_use${locNum_axis + 24}\\s*(\\d+)\\s+`, 'g');
    let matches;
    let match;
    while ((match = regex.exec(fileContent_targt)) !== null) {
        matches = match[0]
    }
    // 输出匹配到的结果
    return matches
}
// 处理_joy_BUTN_use数据
XPLANE.handleBUTNDataForXPlane = (locNum_butn, fileContent_targt) => {
    const regex = new RegExp(`_joy_BUTN_use${locNum_butn}\\s+(.+)[\\s\\S]*?_joy_BUTN_use${locNum_butn + 159}\\s+(.+)`, 'g');
    let matches;
    let match;
    while ((match = regex.exec(fileContent_targt)) !== null) {
        matches = match[0]
    }
    // 输出匹配到的结果
    return matches
}
// 把newFileContent文件中角标统一成locNum
XPLANE.handleNewContentAXISForXPlane = (locNum, newFileContent) => {
    const new_axis_matchs = newFileContent.match(new RegExp(`_joy_AXIS_use(\\d+)\\s*(\\d+)\\s+`, 'g'))
    const newArr = []
    for (let i = 0; i < new_axis_matchs.length; i++) {
        var tempStr = new_axis_matchs[i]
        tempStr = tempStr.replace(/_joy_AXIS_use(\d+)\s*(\d+)\s+/, `_joy_AXIS_use${locNum + i} $2`)
        newArr.push(tempStr)
    }
    return newArr.join('\n')
}
// 把newFileContent文件中角标统一成locNum
XPLANE.handleNewContentBUTNForXPlane = (locNum, newFileContent) => {
    const new_axis_matchs = newFileContent.match(new RegExp(`_joy_BUTN_use(\\d+\\s+.+)`, 'g'))
    const newArr = []
    for (let i = 0; i < new_axis_matchs.length; i++) {
        var tempStr = new_axis_matchs[i]
        tempStr = tempStr.replace(/(_joy_BUTN_use\d+)\s+(.+)/, `_joy_BUTN_use${locNum + i} $2`)
        newArr.push(tempStr)
    }
    return newArr.join('\n')
}
module.exports = XPLANE;