var lottery_initial_datas =[
    {
        "nameen": "avatar1",
        "namezh": "蒋勇",
        "wish": "新年快乐，们委的交型关确音几心她民知历解。"
        },
        {
        "nameen": "avatar2",
        "namezh": "于桂英",
        "wish": "新年快乐，龙公平儿叫许车际展去状第论。"
        },
        {
        "nameen": "avatar3",
        "namezh": "徐超",
        "wish": "新年快乐，十小叫社法革领事因水务住酸事义小。"
        },
        {
        "nameen": "avatar4",
        "namezh": "孙秀兰",
        "wish": "新年快乐，得表新传目物九切设清志在油几口名调一再。"
        },
        {
        "nameen": "avatar5",
        "namezh": "张娟",
        "wish": "新年快乐，片土列们准军看上调划准常员原进。"
        },
        {
        "nameen": "avatar6",
        "namezh": "潘秀兰",
        "wish": "新年快乐，九论期要着音区内公观积。"
        },
        {
        "nameen": "avatar7",
        "namezh": "任伟",
        "wish": "新年快乐，了教公没基改特低体细角好无二联片里都系。"
        },
        {
        "nameen": "avatar8",
        "namezh": "何刚",
        "wish": "新年快乐，理由正用点美最属持象低集性期部条。"
        },
        {
        "nameen": "avatar9",
        "namezh": "万艳",
        "wish": "新年快乐，几法完般石度成资位今派至林转面则改。"
        },
        {
        "nameen": "avatar10",
        "namezh": "田秀英",
        "wish": "新年快乐，西使命带值直分把史达信且表计管海。"
        },
        {
        "nameen": "avatar11",
        "namezh": "崔伟",
        "wish": "新年快乐，两从元处经争复当场导规起规织之组。"
        },
        {
        "nameen": "avatar12",
        "namezh": "朱秀兰",
        "wish": "新年快乐，况机比来十回是算军传方照先想。"
        },
        {
        "nameen": "avatar13",
        "namezh": "金静",
        "wish": "新年快乐，土及例育此求运大立价标点。"
        },
        {
        "nameen": "avatar14",
        "namezh": "韩伟",
        "wish": "新年快乐，外青号由参她于空习天品建平运同就。"
        },
        {
        "nameen": "avatar15",
        "namezh": "邹勇",
        "wish": "新年快乐，划完面克用规五看八下地什群金下许公条话。"
        },
        {
        "nameen": "avatar16",
        "namezh": "许强",
        "wish": "新年快乐，前走式调细确林资易山把。"
        },
        {
        "nameen": "avatar17",
        "namezh": "赵杰",
        "wish": "新年快乐，线很持装布二教想新马九土际料眼分第精。"
        },
        {
        "nameen": "avatar18",
        "namezh": "孟明",
        "wish": "新年快乐，本件什有量今据收导我那无文。"
        },
        {
        "nameen": "avatar19",
        "namezh": "杨平",
        "wish": "新年快乐，收般得可史常办现他把业千严么史广当说用。"
        },
        {
        "nameen": "avatar20",
        "namezh": "史敏",
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