var lottery_initial_datas =[
    {
        "id": "avatar1",
        "avatar": "avatar1",
        "name": "蒋勇",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，们委的交型关确音几心她民知历解。"
    },
    {
        "id": "avatar2",
        "avatar": "avatar2",
        "name": "于桂英",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，龙公平儿叫许车际展去状第论。"
    },
    {
        "id": "avatar3",
        "avatar": "avatar3",
        "name": "徐超",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，十小叫社法革领事因水务住酸事义小。"
    },
    {
        "id": "avatar4",
        "avatar": "avatar4",
        "name": "孙秀兰",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，得表新传目物九切设清志在油几口名调一再。"
    },
    {
        "id": "avatar5",
        "avatar": "avatar5",
        "name": "张娟",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，片土列们准军看上调划准常员原进。"
    },
    {
        "id": "avatar6",
        "avatar": "avatar6",
        "name": "潘秀兰",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，九论期要着音区内公观积。"
    },
    {
        "id": "avatar7",
        "avatar": "avatar7",
        "name": "任伟",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，了教公没基改特低体细角好无二联片里都系。"
    },
    {
        "id": "avatar8",
        "avatar": "avatar8",
        "name": "何刚",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，理由正用点美最属持象低集性期部条。"
    },
    {
        "id": "avatar9",
        "avatar": "avatar9",
        "name": "万艳",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，几法完般石度成资位今派至林转面则改。"
    },
    {
        "id": "avatar10",
        "avatar": "avatar10",
        "name": "田秀英",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，西使命带值直分把史达信且表计管海。"
    },
    {
        "id": "avatar11",
        "avatar": "avatar11",
        "name": "崔伟",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，两从元处经争复当场导规起规织之组。"
    },
    {
        "id": "avatar12",
        "avatar": "avatar12",
        "name": "朱秀兰",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，况机比来十回是算军传方照先想。"
    },
    {
        "id": "avatar13",
        "avatar": "avatar13",
        "name": "金静",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，土及例育此求运大立价标点。"
    },
    {
        "id": "avatar14",
        "avatar": "avatar14",
        "name": "韩伟",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，外青号由参她于空习天品建平运同就。"
    },
    {
        "id": "avatar15",
        "avatar": "avatar15",
        "name": "邹勇",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，划完面克用规五看八下地什群金下许公条话。"
    },
    {
        "id": "avatar16",
        "avatar": "avatar16",
        "name": "许强",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，前走式调细确林资易山把。"
    },
    {
        "id": "avatar17",
        "avatar": "avatar17",
        "name": "赵杰",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，线很持装布二教想新马九土际料眼分第精。"
    },
    {
        "id": "avatar18",
        "avatar": "avatar18",
        "name": "孟明",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，本件什有量今据收导我那无文。"
    },
    {
        "id": "avatar19",
        "avatar": "avatar19",
        "name": "杨平",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，收般得可史常办现他把业千严么史广当说用。"
    },
    {
        "id": "avatar20",
        "avatar": "avatar20",
        "name": "史敏",
        "company": "[ 寒山科技 ]",
        "wish": "新年快乐，步根长无定体色厂集内白阶阶并以节口每养。"
    }
];

var award_config = {
    "award01": 1,
    "award02": 3,
    "award03": 6,
    "award04": 20
};

// 初始化数据
if (!localStorage.getItem('lottery_initial')) {
    var data_str = JSON.stringify(lottery_initial_datas);
    localStorage.setItem('lottery_initial', data_str);
}
if (!localStorage.getItem('award_initial')) {
    var award_str = JSON.stringify(award_config);
    localStorage.setItem('award_initial', award_str);
}
