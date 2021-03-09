require('./common').then(cga => {
    leo.monitor.config.keepAlive = true;   //关闭防掉线
    leo.monitor.config.logStatus = false;

    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true); //开启交易

    let fabrics = [
        { name: '麻布', index: 0, unit: 20 x: 0, y: 0 },
        { name: '木棉布', index: 1, unit: 25 x: 0, y: 0 },
        { name: '毛毡', index: 2, unit: 36 x: 0, y: 0 }
    ]

    const player = cga.GetPlayerInfo();
    let fabric = {}

    for (const i in fabrics) {
        if (player.name.indexOf(fabrics[i].name) !== -1) {
            fabric = fabrics[i]
        }
    }

    leo.todo().then(() => {
        // 检查背包是否装满，不满就去买，直到装满
        const emptyCount = cga.getInventoryEmptySlotCount()
        for (const i = 0; i < emptyCount; i ++) {
			await leo.goto(n=>n.falan.fabric)
			await leo.buy(2, [{index: fabric.index, count: 20}])
			awai  leo.delay(2000);
        }
        return leo.next();
    }).then(() => {
        leo.autoWalkList([
            [112,81,'医院'],
            [fabric.x, fabric.y]
        ]
    }).then(() => {
        return leo.loop(() => {
            leo.todo().then(() => {
                // 检查背包是否装满，不满就去买，直到装满
                const emptyCount = cga.getInventoryEmptySlotCount()
                for (const i = 0; i < emptyCount; i ++) {
	        		await leo.goto(n=>n.falan.fabric)
	        		await leo.buy(2, [{index: fabric.index, count: 20}])
	        		awai  leo.delay(2000);
                }
                return leo.next();
            }).then(() => leo.checkHealth(prepareOptions.doctorName))
            .then(() => {
                return leo.delay(3000);
            }).
            catch (console.log));
        }
    });
});
