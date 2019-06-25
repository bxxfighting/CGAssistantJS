var cga = require('./cgaapi')(function(){
	console.log('开始执行模块：刷双百-铜，请先修改下面的角色名列表');
	
	var trade_player = '阿良良木月火';//交易的制造号
	var trade_count = 20;//一次交易20个铜条

	//在桥头集合 - 防具和武器师傅都可以用
	/*var trade_movefunc = (cb)=>{
		cga.travel.falan.toStone('C', ()=>{
			cga.walkList([
			[41, 98, '法兰城']
			], cb);
		});
	}
	var trade_movepos = [153, 117];*/
	
	//在布店集合 - 只能给造防具师傅用
	var trade_movefunc = cga.travel.falan.toFabricStore;
	var trade_movepos = [12, 8];
	
	var healme = function(cb){
		
		var skill_heal = cga.findPlayerSkill('治疗');
		if(!skill_heal){
			throw new Error('你没有治疗技能');
			return;
		}
		var requiremp = 25 + skill_heal.lv * 5;
		
		if (cga.GetPlayerInfo().mp < requiremp){
			cb(false);
			return;
		}

		cga.StartWork(skill_heal.index, skill_heal.lv-1);
		cga.AsyncWaitPlayerMenu(function(players){
			cga.PlayerMenuSelect(0);
			cga.AsyncWaitUnitMenu(function(units){
				cga.UnitMenuSelect(0);
				cga.AsyncWaitWorkingResult(function(r){
					if(cga.GetPlayerInfo().health != 0)
						healme(cb);
					else
						cb(true);
				});
			});
		});
	}	
	
	var skill = cga.findPlayerSkill('挖掘');
	var skill2 = cga.findPlayerSkill('挖掘体验');
	if(!skill && !skill2){
		throw new Error('你没有挖掘或挖掘体验技能');
		return;
	}
	var useskill = skill ? skill : skill2;
	var doWork = null;

	var waitEnd = function(cb2){
		cga.AsyncWaitWorkingResult(function(r){
			var playerInfo = cga.GetPlayerInfo();
			if(playerInfo.mp == 0)
			{
				cb2();
				return;
			}
			var items = cga.getInventoryItems();
			var count = cga.getItemCount('铜');
			var count2 = cga.getItemCount('铜条');
			if(items.length >= 20 || (count / 20)+count2 >= trade_count)
			{
				cb2();
				return;
			}
			
			for(var i in items){
				if(items[i].name == '碎石头' && items[i].count == 40)
					cga.DropItem(items[i].pos);
			}

			cga.StartWork(useskill.index, 0);
			waitEnd(cb2);
		}, 10000);
	}
	
	var trade = ()=>{

		var count = cga.getItemCount('铜条');
		if(count < trade_count){
			setTimeout(doWork, 1000);
			return;
		}
		
		trade_movefunc((r)=>{

			var wait_trade_player = ()=>{
				
				var teamplayers = cga.getTeamPlayers();
								
				if(!(teamplayers.length >= 2 && teamplayers[1].is_me)){
					if(!teamplayers.length){
						doWork();
						return;
					}
					setTimeout(wait_trade_player, 1000);
					return;
				}
				
				var count = 0;
				var stuff = 
				{
					itemFilter : (item)=>{
						if(item.name == '铜条' && item.count >= 20 && count < trade_count){
							count += item.count;
							return true;
						}
						return false;
					}
				}

				cga.trade(trade_player, stuff, null, (result)=>{
					console.log(result);
					setTimeout(trade, 1000);
				});
			}
			
			var wait_team_player = ()=>{
				
				cga.SayWords('', 0, 3, 1);
				
				cga.WalkTo(trade_movepos[0], trade_movepos[1]);
				
				cga.addTeammate(trade_player, (r)=>{
					if(r){
						wait_trade_player();						
						return;
					}

					setTimeout(wait_team_player, 1000);
				});
			}
			
			setTimeout(wait_team_player, 1000);
		});
	}
	
	var exchange = (cb)=>{
		cga.travel.falan.toMineStore('铜', ()=>{
			cga.AsyncWaitNPCDialog(function(dlg){
				cga.ClickNPCDialog(0, 0);
				cga.AsyncWaitNPCDialog(function(dlg2){
					var exchangeCount = cga.getItemCount('铜') / 20;
					var r = cga.BuyNPCStore([{index:0, count:exchangeCount}]);
					cga.AsyncWaitNPCDialog(function(dlg3){

						var count = cga.getItemCount('铜条');
						if(count < trade_count){
							doWork();
						} else {
							trade();
						}
						
					});
				});
			});
		});
	}

	doWork = ()=>{
		var playerInfo = cga.GetPlayerInfo();
		if(playerInfo.mp < playerInfo.maxmp)
		{
			cga.travel.falan.toCastleHospital(()=>{
				setTimeout(doWork, 3000);
			});
			return;
		}
		
		if(cga.GetPlayerInfo().health != 0){
			healme(doWork);
			return;
		}
		
		var items = cga.getInventoryItems();
		var count = cga.getItemCount('铜');
		var count2 = cga.getItemCount('铜条');
		if(items.length >= 20 || (count / 20)+count2 >= trade_count)
		{
			exchange();
			return;
		}
		
		cga.travel.falan.toStone('W1', ()=>{
			cga.walkList([
			[22, 87, '芙蕾雅'],
			[351, 145, '国营第24坑道 地下1楼'],
			], ()=>{
				cga.StartWork(useskill.index, 0);
				waitEnd(exchange);
			});
		});
	}
	
	doWork();
});