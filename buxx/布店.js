require('./common').then(cga => {
    leo.monitor.config.keepAlive = true;   //关闭防掉线
    leo.monitor.config.logStatus = false;

    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true); //开启交易

    // name: 记录材料名称，index: 购买时位置，unit: 单价，x/y: 自己摆摊位置
    const fabrics = [
        { name: "太叔", index: 0, unit: 20, x: 83, y: 17, dir: 6 },
        { name: "木棉布", index: 1, unit: 25, x: 0, y: 0, dir: 6 },
        { name: "毛毡", index: 2, unit: 36, x: 0, y: 0, dir: 6 }
    ]

    const player = cga.GetPlayerInfo();
    let fabric = {
        name: '',
        index: 0,
        unit: 0,
        x: 0,
        y: 0,
    }

    for (const i in fabrics) {
        if (player.name.indexOf(fabrics[i].name) !== -1) {
            fabric = fabrics[i]
        }
    }
    if (fabric.name === '') {
        leo.reject('你不是店员，请不要随意出入仓库')
    }
    var prepareOptions = {
        rechargeFlag: 1,
        repairFlag: -1
    }

    leo.log('我是' + player.name + '，专门卖' + fabric.name + '，请来(' + fabric.x + ', ' + fabric.y + ')找我.')

    leo.todo().then(()=>{
        // 这一步没啥用
        return leo.logBack().then(() => leo.prepare(prepareOptions));
    }).then(() => {
        const emptyCount = cga.getInventoryEmptySlotCount()
        if (emptyCount > 0) {
            const need_money = emptyCount * 20 * fabric.unit
            const spread_money = player.gold - need_money
            if (spread_money < 0) {
                // TODO: 去金币管理员那里取钱
                return leo.reject('身上没有钱，买不起, 需要：' + need_money + '，差：' + spread_money)
            } else {
                return leo.goto(n=>n.falan.fabric).then(() => {
                    return leo.buy(2, [{index: fabric.index, count: emptyCount * 20}])
                })
            }
        } else {
            return leo.next()
        }
    }).then(() => {
        return leo.goto(n=>n.falan.m2).then(() => {
            return leo.autoWalkList([
                [fabric.x, fabric.y]
            ]).then(() => {
                return leo.turnDir(fabric.dir).then(() => {
                    return cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true); //开启交易
                })
            })
        })
    }).then(() = {
        return leo.loop(() => {
            leo.todo().then(() => {
                const emptyCount = cga.getInventoryEmptySlotCount()
                if (emptyCount > 0) {
                    const need_money = emptyCount * 20 * fabric.unit
                    const spread_money = player.gold - need_money
                    if (spread_money < 0) {
                        // TODO: 去金币管理员那里取钱
                        return leo.reject('身上没有钱，买不起, 需要：' + need_money + '，差：' + spread_money)
                    } else {
                        return leo.goto(n=>n.falan.fabric).then(() => {
                            return leo.buy(2, [{index: fabric.index, count: emptyCount * 20}])
                        })
                    }
                }
            }).then(() => {
                // TODO: 增加位置判断，如果在位置上就不动了
                const map = leo.getMapInfo()
                if (map.name === '') {
                } else {
                    return leo.goto(n=>n.falan.m2)
                }
            }).then(() => {
                // 找到自己的工位，并打开交易功能
                return leo.autoWalkList([
                    [fabric.x, fabric.y]
                ]).then(() => {
                    return leo.turnDir(fabric.dir).then(() => {
                        return cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true); //开启交易
                    })
                })
            }).then(() => {
                // 招待顾客
                // 有两种策略
                // 1、增加白名单校验，只有自己的角色才可以交易
                // 2、交易需要给钱，并且比店里贵1金币(这是我的策略)
                const customers = cga.getTeamPlayers()
            }).then(() = {
                return leo.delay(1000);
            })
        }).catch (console.log)
    })
});
