import groups from './groups'

require('./common').then(cga => {
    leo.monitor.config.keepAlive = false;
    leo.monitor.config.logStatus = false;
    var teamPlayerCount = 5; //队伍人数
    var protect = {
        minHp: 0,
        minMp: 0,
        minPetHp: 0,
        minPetMp: 0,
        minTeamNumber: 5
    };
    var prepareOptions = {
        rechargeFlag: 1
    };
    
    cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
    cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true); //开启交易

    var playerinfo = cga.GetPlayerInfo();
    var playerName = playerinfo.name;
    var isTeamLeader = false;
    var teamLeader = groups.getLeader(playerName)
    if (teamLeader == '') {
        console.log(leo.logTime() + '配置异常：没有队长');
        return
    }
    if (playerName == teamLeader) {
        isTeamLeader = true;
        leo.log('我是队长，预设队伍人数【'+teamPlayerCount+'】');
    }else{
        leo.log('我是队员，队长是【'+teamLeader+'】');
    }

    leo.todo().then(() => {
        return leo.logBack();
    }).then(() => {
        return leo.logBack().then(() => leo.prepare(prepareOptions));
    }).then(() => {
        return leo.loop(
            () => leo.waitAfterBattle()
            .then(() => leo.checkHealth(prepareOptions.doctorName))
            //.then(() => leo.checkCrystal(prepareOptions.crystalName))
            .then(() => {
                //完成组队
                var teamplayers = cga.getTeamPlayers();
                if ((isTeamLeader && teamplayers.length >= protect.minTeamNumber)
                		|| (!isTeamLeader && teamplayers.length > 0)) {
                    //console.log('组队已就绪');
                    return leo.next();
                } else {
                    console.log(leo.logTime() + '寻找队伍');
                    return leo.logBack()
                    .then(() => {
                        if (isTeamLeader) {
                            cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true); //开启组队
                            return leo.autoWalk([155,100])
                            .then(() => leo.buildTeamBlock(teamPlayerCount));
                        } else {
                            return leo.autoWalk([154,100])
                            .then(() => leo.enterTeamBlock(teamLeader));
                        }
                    });
                }
            })
            catch (console.log));
    });
});
