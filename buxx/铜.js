require('./common').then(cga=>{

    var skill = cga.findPlayerSkill('挖掘');
		
	if(!skill){
		console.error('提示：没有挖掘技能！');
		return;
	}
    var prepareOptions = {
        rechargeFlag: 1,
    };
	
	leo.todo()
	.then(()=>{
		return leo.loop(()=>{
            // 先补血魔
            await leo.logBack().then(() => leo.prepare(prepareOptions)
            await cga.travel.falan.toStone('W1', (r)=>{
                cga.walkList([
                    [22, 87, '芙蕾雅'],
                    [351, 145, '国营第24坑道 地下1楼'],
                ]);
            });

			var emptyIndexes = leo.getEmptyBagIndexes();
			if (emptyIndexes.length == 0) {
				return leo.log('已经满包')
				.then(()=>leo.reject());
			}
			cga.StartWork(skill.index, 0);
			return leo.waitWorkResult()
			.then(()=>leo.pile(true))
			.then(()=>leo.delay(500));
		});
	})
	.then(()=>leo.log('脚本结束'));
});
