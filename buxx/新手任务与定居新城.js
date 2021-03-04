require('./common').then(cga => {
    var newer_task = async () => {
        if(cga.GetMapName() == '召唤之间'){
            await leo.autoWalk([18, 6])
            await leo.talkNpc(0, leo.talkNpcSelectorYes)
        }
        if(cga.GetMapName() == '回廊'){
            await leo.autoWalkList([
                [23, 19, '灵堂'],[53,2]
            ])
            await leo.talkNpc(0, leo.talkNpcSelectorYes)
        }
        if(cga.GetMapName() == '灵堂' && cga.getItemCount('死者的戒指')>0){
            await leo.autoWalkList([
                [31, 48, '回廊'],[44, 15, '召唤之间'],[18,6]
            ])
            await leo.talkNpc(0, leo.talkNpcSelectorYes)
        }
        if(cga.GetMapName() == '谒见之间' && cga.getItemCount('死者的戒指')>0){
            await leo.autoWalkList([
                [7,4]
            ])
            await leo.talkNpc(6, leo.talkNpcSelectorYes)
        }
        if(cga.GetMapName() == '谒见之间' && cga.getItemCount('赏赐状')>0){
            await leo.autoWalkList([
                [8,19,'里谢里雅堡 2楼'],[47,78]
            ])
            await leo.talkNpc(2, leo.talkNpcSelectorYes)
            await leo.logBack()
        }

    }
    newer_task().then(()=>leo.log('完成新手任务'))

    var settle_new_town_task = () => {
		cga.walkList([
		[141, 105]
		], ()=>{
			await cga.turnTo(142, 105);
			await cga.AsyncWaitNPCDialog(()=>{
				cga.ClickNPCDialog(4, -1);
			});
		});
    }
	cga.travel.falan.toCity('艾尔莎岛', settle_new_town_task);
});
