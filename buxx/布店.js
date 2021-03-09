require('./common').then(cga => {
    leo.monitor.config.keepAlive = true;   //关闭防掉线
    leo.monitor.config.logStatus = false;

    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true); //开启交易

    // name: 记录材料名称，index: 购买时位置，unit: 单价，x/y: 自己摆摊位置
    const fabrics = [
        { name: '麻布', index: 0, unit: 20 x: 0, y: 0 },
        { name: '木棉布', index: 1, unit: 25 x: 0, y: 0 },
        { name: '毛毡', index: 2, unit: 36 x: 0, y: 0 }
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
        // 去自己的店铺
        leo.autoWalkList([
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
            }).then(() => {
		        var teamplayers = cga.getTeamPlayers();
                if (teamplayers.length < 1) {
                    return leo.next();
                }
		        cga.positiveTrade(teamplayers, {
                    var count = 0
		        	itemFilter : (item)=>{
		        		return item.name == '鹿皮' && item.count == 40;
		        	}
			        itemFilter : (item)=>{
			        	if(item.name == '鹿皮' && item.count == 40 && count < 3){
			        		count ++;
			        		return true;
			        	}
			        	return false;
                    }
		        },
		        (playerName, receivedStuffs)={
		        	if(receivedStuffs.gold != 5 * fabric.unit){
		        		console.log('单价：' + fabric.unit + '，总共：' + 5 * fabric.unit);
		        		return false;
		        	}
		        	return true;
		        },
		        (arg)=>{
		        	if(arg.success){
		        		console.log('交易成功!');
		        	} else {
		        		console.log('交易失败! 原因：'+arg.reason);
		        	}
		        });
                return leo.delay(3000);
            }).
            catch (console.log));
        }
    });
});
