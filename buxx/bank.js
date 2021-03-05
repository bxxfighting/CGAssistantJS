require('./common').then(cga => {
	leo.todo()
	.then(()=>leo.goto(n => n.falan.bank))
	.then(()=>leo.turnDir(0))
	.then(()=>{
		cga.EnableFlags(cga.ENABLE_FLAG_JOINTEAM, true);	//开启组队
		cga.EnableFlags(cga.ENABLE_FLAG_TRADE, true);		//开启交易
	})
	.then(()=>leo.done());
});
