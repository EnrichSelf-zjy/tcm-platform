/**
 * 中药数据（数据来源：《中华本草》上海科学技术出版社）
 * 每个药材包含：
 * - 名称
 * - 别名
 * - 性味归经（格式：性味；归经）
 * - 功效
 * - 用法用量
 * - 禁忌
 * - 来源（具体页码）
 */
const defaultHerbIcon = 'default-herb.svg';

const herbsData = [
    {
        name: "乌梅",
        alias: ["黑梅", "乌梅肉"],
        nature: "酸",
        taste: "涩",
        meridian: "肝、脾、肺经",
        effect: "敛肺止咳，涩肠止泻，生津止渴，安蛔止痛",
        source: "《神农本草经》",
        usage: "3-10g",
        precautions: "脾胃虚寒者慎用"
    },
    {
        name: "山楂",
        alias: ["山里红", "红果"],
        nature: "温",
        taste: "酸甜",
        meridian: "脾、胃、肝经",
        effect: "消食化滞，行气散瘀",
        source: "《本草纲目》",
        usage: "10-15g",
        precautions: "胃酸过多者慎用"
    },
    {
        name: "甘草",
        alias: ["国老", "蜜甘草"],
        nature: "平",
        taste: "甘",
        meridian: "心、肺、脾、胃经",
        effect: "补脾益气，清热解毒，祛痰止咳，调和诸药",
        source: "《神农本草经》",
        usage: "3-10g",
        precautions: "水肿、高血压者慎用"
    },
    {
        name: "人参",
        alias: ["西洋参", "高丽参"],
        nature: "温",
        taste: "甘、微苦",
        meridian: "心、肺、脾经",
        effect: "大补元气，复脉固脱，补脾益肺，生津养血，安神益智",
        source: "《神农本草经》",
        usage: "3-9g",
        precautions: "阴虚火旺者慎用"
    },
    {
        name: "当归",
        alias: ["当归身", "归身"],
        nature: "温",
        taste: "甘、辛",
        meridian: "心、肝、脾经",
        effect: "补血活血，调经止痛，润肠通便",
        source: "《神农本草经》",
        usage: "6-15g",
        precautions: "胃腸有湿热者慎用"
    },
    {
        name: "茯苓",
        alias: ["茯神", "伏苓"],
        nature: "平",
        taste: "甘、淡",
        meridian: "心、脾、肾经",
        effect: "利水渗湿，健脾宁心",
        source: "《神农本草经》",
        usage: "9-15g",
        precautions: "小便不利者慎用"
    },
    {
        name: "黄芪",
        alias: ["北芪", "生芪"],
        nature: "微温",
        taste: "甘",
        meridian: "脾、肺经",
        effect: "补气升阳，益卫固表，利水消肿",
        source: "《神农本草经》",
        usage: "9-30g",
        precautions: "表实邪盛者忌服"
    },
    {
        name: "陈皮",
        alias: ["橘皮", "果皮"],
        nature: "温",
        taste: "辛、苦",
        meridian: "脾、肺经",
        effect: "理气健脾，燥湿化痰",
        source: "《本草纲目》",
        usage: "3-10g",
        precautions: "阴虚火旺者慎用"
    },
    // 更多药材数据...
];

/**
 * 方剂数据（数据来源：《中医方剂大辞典》人民卫生出版社）
 * 每个方剂包含：
 * - 名称
 * - 组成（药材及用量）
 * - 功效
 * - 适用症状
 * - 来源（文献出处）
 * - 网红标记（是否网红方剂）
 */
const formulasData = [
    {
        id: "formula_001",
        name: "酸梅汤",
        type: "trending",
        effect: "消暑解渴，生津开胃",
        composition: [
            { herb: "乌梅", weight: "30g" },
            { herb: "山楂", weight: "20g" },
            { herb: "甘草", weight: "5g" },
            { herb: "桂花", weight: "3g" },
            { herb: "冰糖", weight: "适量" }
        ],
        source: "《中华本草》食疗方",
        usage: "冷热皆可",
        indications: "夏季烦热，食欲不振，口干舌燥",
        isTrending: true
    },
    {
        name: "四物汤",
        type: "classic",
        effect: "补血调血",
        composition: [
            { herb: "当归", weight: "10g" },
            { herb: "川芎", weight: "8g" },
            { herb: "白芍", weight: "12g" },
            { herb: "熟地黄", weight: "12g" }
        ],
        source: "《太平惠民和剂局方》卷九",
        usage: "水煎服",
        indications: "血虚萎黄，月经不调，头晕目眩",
        isTrending: false
    },
    {
        name: "熬夜水",
        type: "trending",
        effect: "益气养肝，缓解眼疲劳",
        composition: [
            { herb: "人参", weight: "3g" },
            { herb: "菊花", weight: "5g" },
            { herb: "枸杞", weight: "10g" },
            { herb: "红枣", weight: "3枚" }
        ],
        source: "网络改良方",
        usage: "泡茶饮用",
        indications: "熬夜后恢复，眼睛干涩，体力透支",
        isTrending: true
    },
    {
        name: "秋梨膏",
        type: "trending",
        effect: "润肺止咳，生津利咽",
        composition: [
            { herb: "梨", weight: "5kg" },
            { herb: "罗汉果", weight: "2个" },
            { herb: "姜丝", weight: "50g" },
            { herb: "蜂蜜", weight: "适量" }
        ],
        source: "《本草纲目》食疗改良方",
        usage: "温水调服",
        indications: "秋季干燥，咽喉不适，肺热咳嗽",
        isTrending: true
    },
    {
        name: "姜枣茶",
        type: "trending",
        effect: "温中散寒，补血益气",
        composition: [
            { herb: "生姜", weight: "3片" },
            { herb: "红枣", weight: "6枚" },
            { herb: "红糖", weight: "20g" }
        ],
        source: "民间养生方改良",
        usage: "热饮",
        indications: "手脚冰凉，经期不适，脾胃虚寒",
        isTrending: true
    },
    {
        name: "四君子汤",
        type: "classic",
        effect: "补气健脾",
        composition: [
            { herb: "人参", weight: "9g" },
            { herb: "白术", weight: "9g" },
            { herb: "茯苓", weight: "9g" },
            { herb: "甘草", weight: "6g" }
        ],
        source: "《太平惠民和剂局方》",
        usage: "水煎服，每日1剂",
        indications: "脾胃虚弱，气血不足",
        isTrending: false
    },
    {
        name: "六味地黄丸",
        type: "classic",
        effect: "滋阴补肾",
        composition: [
            { herb: "熟地黄", weight: "24g" },
            { herb: "山茱萸", weight: "12g" },
            { herb: "山药", weight: "12g" },
            { herb: "泽泻", weight: "9g" },
            { herb: "牡丹皮", weight: "9g" },
            { herb: "茯苓", weight: "9g" }
        ],
        source: "《小儿药证直诀》",
        usage: "水煎服或蜜丸服用",
        indications: "肾阴亏虚，头晕耳鸣",
        isTrending: false
    },
    {
        name: "补中益气汤",
        type: "classic",
        effect: "补中益气，升阳举陷",
        composition: [
            { herb: "黄芪", weight: "15g" },
            { herb: "人参", weight: "9g" },
            { herb: "白术", weight: "9g" },
            { herb: "甘草", weight: "6g" },
            { herb: "当归", weight: "6g" },
            { herb: "陈皮", weight: "6g" },
            { herb: "升麻", weight: "3g" },
            { herb: "柴胡", weight: "3g" }
        ],
        source: "《内外伤辨惑论》",
        usage: "水煎服，每日1剂",
        indications: "脾胃虚弱，气虚下陷",
        isTrending: false
    },
    {
        name: "当归补血汤",
        type: "classic",
        effect: "补血养血",
        composition: [
            { herb: "当归", weight: "30g" },
            { herb: "黄芪", weight: "30g" }
        ],
        source: "《内外伤辨惑论》",
        usage: "水煎服，每日1剂",
        indications: "气虚血少，面色萎黄",
        isTrending: false
    },
    {
        name: "香砂六君子汤",
        type: "classic",
        effect: "健脾和胃，理气化痰",
        composition: [
            { herb: "人参", weight: "9g" },
            { herb: "白术", weight: "9g" },
            { herb: "茯苓", weight: "9g" },
            { herb: "甘草", weight: "6g" },
            { herb: "陈皮", weight: "6g" },
            { herb: "半夏", weight: "6g" },
            { herb: "木香", weight: "6g" },
            { herb: "砂仁", weight: "6g" }
        ],
        source: "《医方考》",
        usage: "水煎服，每日1剂",
        indications: "脾胃虚弱，痰气交阻",
        isTrending: false
    },
    // 更多方剂数据...
];

/**
 * 经典方剂数据
 */
const classicRecipes = [
    {
        id: 'c1',
        type: 'classic',
        name: '六味地黄丸',
        description: '滋阴补肾的代表方',
        category: 'tonic',
        tags: ['补肾', '滋阴', '经典'],
        effects: '滋阴补肾，用于肾阴亏虚所致的头晕耳鸣、腰膝酸软、骨蒸潮热、盗汗遗精等症',
        ingredients: [
            { name: '熟地黄', amount: '24g' },
            { name: '山茱萸', amount: '12g' },
            { name: '山药', amount: '12g' },
            { name: '泽泻', amount: '9g' },
            { name: '牡丹皮', amount: '9g' },
            { name: '茯苓', amount: '9g' }
        ],
        preparation: [
            '以上药材粉碎成细粉',
            '炼蜜为丸',
            '每丸重9g'
        ],
        usage: '每次9g，每日2次，温开水送服',
        precautions: '脾虚有湿者慎服，大便溏泻者忌服',
        image: '💊',
        views: 25680,
        likes: 8902,
        createTime: '2024-01-10T08:00:00Z'
    },
    {
        id: 'c2',
        type: 'classic',
        name: '四君子汤',
        description: '补气健脾的基础方',
        category: 'tonic',
        tags: ['补气', '健脾', '经典'],
        effects: '补气健脾，用于脾胃虚弱、食欲不振、倦怠乏力、面色萎黄等症',
        ingredients: [
            { name: '人参', amount: '9g' },
            { name: '白术', amount: '9g' },
            { name: '茯苓', amount: '9g' },
            { name: '甘草', amount: '6g' }
        ],
        preparation: [
            '将药材洗净',
            '加水煎煮两次',
            '合并煎液'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '实证及阴虚火旺者忌服',
        image: '🍵',
        views: 18960,
        likes: 6234,
        createTime: '2024-01-12T10:00:00Z'
    },
    {
        id: 'c3',
        type: 'classic',
        name: '当归补血汤',
        description: '补血调经的要方',
        category: 'blood',
        tags: ['补血', '调经', '经典'],
        effects: '补血养血，用于血虚萎黄、眩晕心悸、月经不调、手足麻木等症',
        ingredients: [
            { name: '当归', amount: '15g' },
            { name: '黄芪', amount: '30g' }
        ],
        preparation: [
            '药材洗净',
            '加水煎煮20分钟',
            '取汁再煎煮一次'
        ],
        usage: '每日1剂，分2次温服',
        precautions: '阴虚火旺、胃有实热者慎服',
        image: '🌿',
        views: 15780,
        likes: 5123,
        createTime: '2024-01-14T09:00:00Z'
    },
    {
        id: 'c4',
        type: 'classic',
        name: '补中益气汤',
        description: '补中益气，升阳举陷的代表方',
        category: 'tonic',
        tags: ['补气', '升阳', '经典'],
        effects: '补中益气，升阳举陷，用于脾胃虚弱、气虚下陷、倦怠乏力、食欲不振、大便溏薄等症',
        ingredients: [
            { name: '黄芪', amount: '15g' },
            { name: '人参', amount: '6g' },
            { name: '白术', amount: '9g' },
            { name: '甘草', amount: '6g' },
            { name: '当归', amount: '6g' },
            { name: '陈皮', amount: '6g' },
            { name: '升麻', amount: '3g' },
            { name: '柴胡', amount: '3g' }
        ],
        preparation: [
            '药材洗净',
            '加水浸泡30分钟',
            '大火煮沸后改小火煎煮30分钟',
            '去渣取汁'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '阴虚火旺、表实邪盛者忌服',
        image: '🌱',
        views: 14560,
        likes: 4789,
        createTime: '2024-01-18T08:00:00Z'
    },
    {
        id: 'c5',
        type: 'classic',
        name: '温胆汤',
        description: '和胃化痰，清热安神的名方',
        category: 'calm',
        tags: ['安神', '化痰', '经典'],
        effects: '温胆化痰，清热安神，用于痰热内扰、心烦不眠、胸脘痞闷、呕吐痰涎等症',
        ingredients: [
            { name: '半夏', amount: '12g' },
            { name: '陈皮', amount: '9g' },
            { name: '茯苓', amount: '12g' },
            { name: '竹茹', amount: '9g' },
            { name: '枳实', amount: '9g' },
            { name: '甘草', amount: '6g' }
        ],
        preparation: [
            '半夏制后使用',
            '诸药洗净',
            '加水煎煮两次',
            '合并煎液'
        ],
        usage: '每日1剂，分2次温服',
        precautions: '胃阴不足者慎服',
        image: '🍵',
        views: 12340,
        likes: 3678,
        createTime: '2024-01-19T09:00:00Z'
    },
    {
        id: 'c6',
        type: 'classic',
        name: '二陈汤',
        description: '化痰理气的基础方',
        category: 'phlegm',
        tags: ['化痰', '理气', '经典'],
        effects: '燥湿化痰，理气和胃，用于痰湿内阻、胸脘痞闷、咳嗽痰多、恶心呕吐等症',
        ingredients: [
            { name: '陈皮', amount: '9g' },
            { name: '半夏', amount: '12g' },
            { name: '茯苓', amount: '12g' },
            { name: '甘草', amount: '6g' }
        ],
        preparation: [
            '半夏制后使用',
            '加水煎煮',
            '取汁两次',
            '混合后服用'
        ],
        usage: '每日1剂，分2次温服',
        precautions: '阴虚燥咳者忌服',
        image: '🫖',
        views: 11230,
        likes: 3456,
        createTime: '2024-01-20T10:00:00Z'
    },
    {
        id: 'c7',
        type: 'classic',
        name: '归脾汤',
        description: '补气养血，健脾益心的良方',
        category: 'tonic',
        tags: ['补血', '健脾', '经典'],
        effects: '补气养血，健脾益心，用于心脾两虚、心悸怔忡、失眠健忘、食欲不振等症',
        ingredients: [
            { name: '党参', amount: '15g' },
            { name: '白术', amount: '15g' },
            { name: '当归', amount: '12g' },
            { name: '茯苓', amount: '12g' },
            { name: '龙眼肉', amount: '12g' },
            { name: '远志', amount: '6g' },
            { name: '酸枣仁', amount: '12g' },
            { name: '木香', amount: '6g' },
            { name: '甘草', amount: '6g' }
        ],
        preparation: [
            '远志制后使用',
            '诸药洗净',
            '加水煎煮',
            '取汁两次'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '胃有实热者忌服',
        image: '🌿',
        views: 13450,
        likes: 4123,
        createTime: '2024-01-21T11:00:00Z'
    },
    {
        id: 'c8',
        type: 'classic',
        name: '柴胡疏肝散',
        description: '疏肝解郁的代表方',
        category: 'liver',
        tags: ['疏肝', '解郁', '经典'],
        effects: '疏肝解郁，理气和胃，用于肝郁气滞、胸胁胀痛、脘腹痞闷、食欲不振等症',
        ingredients: [
            { name: '柴胡', amount: '12g' },
            { name: '陈皮', amount: '9g' },
            { name: '枳壳', amount: '9g' },
            { name: '芍药', amount: '12g' },
            { name: '香附', amount: '12g' },
            { name: '甘草', amount: '6g' }
        ],
        preparation: [
            '诸药洗净',
            '加水煎煮',
            '取汁两次',
            '混合后服用'
        ],
        usage: '每日1剂，分2次温服',
        precautions: '阴虚火旺者慎服',
        image: '🌱',
        views: 10890,
        likes: 3234,
        createTime: '2024-01-22T12:00:00Z'
    },
    {
        id: 'c9',
        type: 'classic',
        name: '天王补心丹',
        description: '滋阴养心，安神定志的要方',
        category: 'heart',
        tags: ['养心', '安神', '经典'],
        effects: '滋阴养心，安神定志，用于心神不宁、失眠多梦、心悸怔忡、健忘等症',
        ingredients: [
            { name: '生地黄', amount: '15g' },
            { name: '人参', amount: '6g' },
            { name: '丹参', amount: '12g' },
            { name: '玄参', amount: '12g' },
            { name: '天门冬', amount: '12g' },
            { name: '麦门冬', amount: '12g' },
            { name: '当归', amount: '9g' },
            { name: '五味子', amount: '6g' }
        ],
        preparation: [
            '诸药研细末',
            '炼蜜为丸',
            '每丸重9g'
        ],
        usage: '每次9g，每日2次，温开水送服',
        precautions: '脾胃虚寒者慎服',
        image: '💊',
        views: 12670,
        likes: 3890,
        createTime: '2024-01-23T13:00:00Z'
    },
    {
        id: 'c10',
        type: 'classic',
        name: '逍遥散',
        description: '疏肝健脾的经典方',
        category: 'liver',
        tags: ['疏肝', '健脾', '经典'],
        effects: '疏肝健脾，调经养血，用于肝郁脾虚、月经不调、头痛目眩、胸胁胀痛等症',
        ingredients: [
            { name: '柴胡', amount: '12g' },
            { name: '当归', amount: '12g' },
            { name: '白芍', amount: '12g' },
            { name: '白术', amount: '12g' },
            { name: '茯苓', amount: '12g' },
            { name: '薄荷', amount: '6g' },
            { name: '甘草', amount: '6g' }
        ],
        preparation: [
            '诸药洗净',
            '加水煎煮',
            '取汁两次',
            '混合后服用'
        ],
        usage: '每日1剂，分2次温服',
        precautions: '阴虚火旺者慎服',
        image: '🍵',
        views: 11780,
        likes: 3567,
        createTime: '2024-01-24T14:00:00Z'
    },
    {
        id: 'c11',
        type: 'classic',
        name: '桂枝汤',
        description: '解表散寒的代表方',
        category: 'exterior',
        tags: ['解表', '散寒', '经典'],
        effects: '发汗解表，调和营卫，用于风寒感冒、恶寒发热、头痛、鼻塞、四肢酸痛等症',
        ingredients: [
            { name: '桂枝', amount: '9g' },
            { name: '白芍', amount: '9g' },
            { name: '生姜', amount: '9g' },
            { name: '大枣', amount: '12g' },
            { name: '甘草', amount: '6g' }
        ],
        preparation: [
            '药材洗净',
            '加水煎煮',
            '取汁两次',
            '混合后温服'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '体虚多汗者慎服',
        image: '🌿',
        views: 10560,
        likes: 3123,
        createTime: '2024-01-25T09:00:00Z'
    },
    {
        id: 'c12',
        type: 'classic',
        name: '麻黄汤',
        description: '发汗解表的经典方',
        category: 'exterior',
        tags: ['发汗', '解表', '经典'],
        effects: '发汗解表，宣肺平喘，用于风寒感冒、恶寒重、发热、头痛、全身酸痛、无汗等症',
        ingredients: [
            { name: '麻黄', amount: '9g' },
            { name: '桂枝', amount: '6g' },
            { name: '杏仁', amount: '9g' },
            { name: '甘草', amount: '3g' }
        ],
        preparation: [
            '麻黄去节',
            '诸药洗净',
            '加水煎煮',
            '去渣取汁'
        ],
        usage: '每日1剂，分2次温服',
        precautions: '表虚有汗、阴虚火旺者忌服',
        image: '🍵',
        views: 9870,
        likes: 2987,
        createTime: '2024-01-26T10:00:00Z'
    },
    {
        id: 'c13',
        type: 'classic',
        name: '小柴胡汤',
        description: '和解少阳的代表方',
        category: 'harmony',
        tags: ['和解', '清热', '经典'],
        effects: '和解少阳，疏肝解郁，用于往来寒热、胸胁苦满、口苦咽干、食欲不振等症',
        ingredients: [
            { name: '柴胡', amount: '24g' },
            { name: '黄芩', amount: '9g' },
            { name: '人参', amount: '9g' },
            { name: '半夏', amount: '9g' },
            { name: '生姜', amount: '9g' },
            { name: '大枣', amount: '12g' },
            { name: '甘草', amount: '6g' }
        ],
        preparation: [
            '半夏制后使用',
            '诸药洗净',
            '加水煎煮',
            '取汁两次'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '阴虚内热、胃阴不足者慎服',
        image: '🌱',
        views: 11230,
        likes: 3456,
        createTime: '2024-01-27T11:00:00Z'
    },
    {
        id: 'c14',
        type: 'classic',
        name: '白虎汤',
        description: '清热生津的名方',
        category: 'heat',
        tags: ['清热', '生津', '经典'],
        effects: '清热生津，用于壮热口渴、汗出、脉洪大等症',
        ingredients: [
            { name: '石膏', amount: '30g' },
            { name: '知母', amount: '9g' },
            { name: '粳米', amount: '9g' },
            { name: '甘草', amount: '3g' }
        ],
        preparation: [
            '石膏先煎',
            '诸药后下',
            '加水煎煮',
            '取汁温服'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '表证未解、胃寒者忌服',
        image: '❄️',
        views: 8960,
        likes: 2678,
        createTime: '2024-01-28T12:00:00Z'
    },
    {
        id: 'c15',
        type: 'classic',
        name: '十全大补汤',
        description: '补气养血的全面方',
        category: 'tonic',
        tags: ['补气', '养血', '经典'],
        effects: '补气养血，健脾益肾，用于气血两虚、面色萎黄、四肢倦怠、食欲不振等症',
        ingredients: [
            { name: '人参', amount: '9g' },
            { name: '白术', amount: '9g' },
            { name: '茯苓', amount: '9g' },
            { name: '甘草', amount: '6g' },
            { name: '当归', amount: '9g' },
            { name: '川芎', amount: '6g' },
            { name: '白芍', amount: '9g' },
            { name: '熟地黄', amount: '12g' },
            { name: '黄芪', amount: '15g' },
            { name: '肉桂', amount: '6g' }
        ],
        preparation: [
            '诸药洗净',
            '加水浸泡',
            '武火煮沸',
            '文火煎煮'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '阴虚火旺、有实邪者忌服',
        image: '💊',
        views: 13450,
        likes: 4567,
        createTime: '2024-01-29T13:00:00Z'
    },
    // 补充更多经典方剂数据
    {
        id: 'c17',
        type: 'classic',
        name: '八珍汤',
        description: '补气养血的代表方',
        category: 'tonic',
        tags: ['补气', '养血'],
        effects: '补气养血，健脾和胃，用于气血两虚、面色萎黄、食欲不振、倦怠乏力等症',
        ingredients: [
            { name: '人参', amount: '9g' },
            { name: '白术', amount: '9g' },
            { name: '茯苓', amount: '9g' },
            { name: '甘草', amount: '6g' },
            { name: '当归', amount: '9g' },
            { name: '白芍', amount: '9g' },
            { name: '川芎', amount: '6g' },
            { name: '熟地黄', amount: '12g' }
        ],
        preparation: [
            '诸药洗净',
            '加水煎煮',
            '取汁两次',
            '混合温服'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '脾胃有湿热者慎服',
        image: '🌿',
        views: 9800,
        likes: 3200,
        createTime: '2024-01-31T10:00:00Z'
    },
    {
        id: 'c18',
        type: 'classic',
        name: '六味地黄丸',
        description: '滋阴补肾的经典方',
        category: 'tonic',
        tags: ['补阴', '滋肾'],
        effects: '滋阴补肾，用于肾阴亏虚、腰膝酸软、头晕耳鸣、盗汗遗精等症',
        ingredients: [
            { name: '熟地黄', amount: '24g' },
            { name: '山药', amount: '12g' },
            { name: '山茱萸', amount: '12g' },
            { name: '泽泻', amount: '9g' },
            { name: '牡丹皮', amount: '9g' },
            { name: '茯苓', amount: '9g' }
        ],
        preparation: [
            '研粉成细末',
            '炼蜜为丸',
            '每丸重9g'
        ],
        usage: '每次9g，每日2次，温开水送服',
        precautions: '脾胃虚寒者慎服',
        image: '💊',
        views: 15600,
        likes: 5200,
        createTime: '2024-01-31T11:00:00Z'
    },

    // 清热类方剂
    {
        id: 'c19',
        type: 'classic',
        name: '清瘟败毒饮',
        description: '清热解毒的代表方',
        category: 'heat-clearing',
        tags: ['清热', '解毒'],
        effects: '清热解毒，凉血消斑，用于发热、咽痛、口干、斑疹等症',
        ingredients: [
            { name: '生石膏', amount: '30g' },
            { name: '知母', amount: '12g' },
            { name: '黄芩', amount: '9g' },
            { name: '栀子', amount: '9g' },
            { name: '桔梗', amount: '9g' },
            { name: '甘草', amount: '6g' }
        ],
        preparation: [
            '石膏先煎',
            '诸药后下',
            '水煎服'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '体虚及胃寒者慎服',
        image: '🌺',
        views: 11200,
        likes: 3800,
        createTime: '2024-01-31T12:00:00Z'
    },

    // 活血类方剂
    {
        id: 'c20',
        type: 'classic',
        name: '血府逐瘀汤',
        description: '活血化瘀的经典方',
        category: 'blood-activating',
        tags: ['活血', '化瘀'],
        effects: '活血化瘀，行气止痛，用于胸痹心痛、心烦失眠、头痛眩晕等症',
        ingredients: [
            { name: '当归', amount: '9g' },
            { name: '生地黄', amount: '9g' },
            { name: '桃仁', amount: '9g' },
            { name: '红花', amount: '6g' },
            { name: '枳壳', amount: '6g' },
            { name: '柴胡', amount: '4.5g' },
            { name: '甘草', amount: '3g' }
        ],
        preparation: [
            '诸药洗净',
            '加水煎煮',
            '取汁两次'
        ],
        usage: '每日1剂，分2次温服',
        precautions: '孕妇及月经过多者忌服',
        image: '🌹',
        views: 10500,
        likes: 3600,
        createTime: '2024-01-31T13:00:00Z'
    },

    // 理气类方剂
    {
        id: 'c21',
        type: 'classic',
        name: '柴胡疏肝散',
        description: '疏肝理气的代表方',
        category: 'qi-regulating',
        tags: ['理气', '解郁'],
        effects: '疏肝理气，调和肝脾，用于肝郁气滞、胸胁胀痛、脘腹痞闷等症',
        ingredients: [
            { name: '柴胡', amount: '12g' },
            { name: '陈皮', amount: '9g' },
            { name: '枳壳', amount: '9g' },
            { name: '芍药', amount: '9g' },
            { name: '甘草', amount: '6g' }
        ],
        preparation: [
            '诸药洗净',
            '加水煎煮',
            '取汁温服'
        ],
        usage: '每日1剂，分2次温服',
        precautions: '阴虚火旺者慎服',
        image: '🍃',
        views: 9800,
        likes: 3300,
        createTime: '2024-01-31T14:00:00Z'
    },

    // 祛湿类方剂
    {
        id: 'c22',
        type: 'classic',
        name: '五苓散',
        description: '利水渗湿的经典方',
        category: 'dampness-dispelling',
        tags: ['祛湿', '利水'],
        effects: '利水渗湿，和中祛暑，用于水湿内停、小便不利、头痛发热等症',
        ingredients: [
            { name: '茯苓', amount: '15g' },
            { name: '泽泻', amount: '15g' },
            { name: '白术', amount: '9g' },
            { name: '猪苓', amount: '9g' },
            { name: '桂枝', amount: '6g' }
        ],
        preparation: [
            '研粉成细末',
            '温开水调服'
        ],
        usage: '每次6-9g，每日3次，温开水调服',
        precautions: '阴虚燥渴者慎服',
        image: '💧',
        views: 8900,
        likes: 2900,
        createTime: '2024-01-31T15:00:00Z'
    },
    {
        id: 'c23',
        type: 'classic',
        name: '黄连阿胶汤',
        description: '滋阴清热的代表方',
        category: 'heat-clearing',
        tags: ['清热', '滋阴', '安神'],
        effects: '清热滋阴，养血安神，用于阴虚火旺、心烦不寐、虚烦失眠等症',
        ingredients: [
            { name: '黄连', amount: '9g' },
            { name: '阿胶', amount: '9g' },
            { name: '白芍', amount: '9g' },
            { name: '黄芩', amount: '9g' },
            { name: '鸡子黄', amount: '1个' }
        ],
        preparation: [
            '黄连、黄芩、白芍水煎',
            '阿胶烊化',
            '鸡子黄调服'
        ],
        usage: '每日1剂，分2次温服',
        precautions: '脾胃虚寒者慎服',
        image: '🌿',
        views: 8500,
        likes: 2800,
        createTime: '2024-02-01T10:00:00Z'
    },
    {
        id: 'c24',
        type: 'classic',
        name: '半夏厚朴汤',
        description: '理气化痰的经典方',
        category: 'qi-regulating',
        tags: ['理气', '化痰', '安神'],
        effects: '开郁化痰，理气降逆，用于痰气郁结、胸脘痞闷、咽如梅核等症',
        ingredients: [
            { name: '半夏', amount: '12g' },
            { name: '厚朴', amount: '9g' },
            { name: '茯苓', amount: '12g' },
            { name: '紫苏', amount: '6g' },
            { name: '生姜', amount: '9g' }
        ],
        preparation: [
            '半夏制后使用',
            '诸药洗净',
            '加水煎煮',
            '取汁温服'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '胃阴不足者慎服',
        image: '🍃',
        views: 7900,
        likes: 2600,
        createTime: '2024-02-02T11:00:00Z'
    },
    {
        id: 'c25',
        type: 'classic',
        name: '泽泻汤',
        description: '利水渗湿的代表方',
        category: 'dampness-dispelling',
        tags: ['利水', '祛湿'],
        effects: '利水渗湿，泄热通淋，用于小便不利、水肿胀满、淋证涩痛等症',
        ingredients: [
            { name: '泽泻', amount: '15g' },
            { name: '白术', amount: '12g' },
            { name: '茯苓', amount: '12g' }
        ],
        preparation: [
            '诸药洗净',
            '加水煎煮',
            '取汁温服'
        ],
        usage: '每日1剂，分2次温服',
        precautions: '小便清长者慎服',
        image: '💧',
        views: 7200,
        likes: 2400,
        createTime: '2024-02-03T12:00:00Z'
    },
    {
        id: 'c26',
        type: 'classic',
        name: '补中益气汤',
        description: '补气升阳的代表方',
        category: 'tonic',
        tags: ['补气', '升阳'],
        effects: '补中益气，升阳举陷，用于脾胃虚弱、气虚下陷、倦怠乏力等症',
        ingredients: [
            { name: '黄芪', amount: '15g' },
            { name: '人参', amount: '9g' },
            { name: '白术', amount: '9g' },
            { name: '甘草', amount: '6g' },
            { name: '当归', amount: '6g' },
            { name: '陈皮', amount: '6g' },
            { name: '升麻', amount: '3g' },
            { name: '柴胡', amount: '3g' }
        ],
        preparation: [
            '诸药洗净',
            '加水煎煮',
            '取汁两次'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '阴虚火旺者慎服',
        image: '🌿',
        views: 8100,
        likes: 2700,
        createTime: '2024-02-04T10:00:00Z'
    },
    {
        id: 'c27',
        type: 'classic',
        name: '黄连解毒汤',
        description: '清热解毒的经典方',
        category: 'heat-clearing',
        tags: ['清热', '解毒', '泻火'],
        effects: '清热解毒，泻火除烦，用于三焦火毒、高热烦躁、口干口苦等症',
        ingredients: [
            { name: '黄连', amount: '9g' },
            { name: '黄芩', amount: '9g' },
            { name: '黄柏', amount: '9g' },
            { name: '栀子', amount: '9g' }
        ],
        preparation: [
            '诸药洗净',
            '加水煎煮',
            '取汁温服'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '胃寒及脾虚者慎服',
        image: '🌺',
        views: 7800,
        likes: 2500,
        createTime: '2024-02-05T11:00:00Z'
    },
    {
        id: 'c28',
        type: 'classic',
        name: '桃红四物汤',
        description: '活血调经的良方',
        category: 'blood-activating',
        tags: ['活血', '调经'],
        effects: '活血调经，化瘀止痛，用于月经不调、痛经、产后瘀滞等症',
        ingredients: [
            { name: '当归', amount: '12g' },
            { name: '川芎', amount: '9g' },
            { name: '白芍', amount: '9g' },
            { name: '熟地黄', amount: '12g' },
            { name: '桃仁', amount: '9g' },
            { name: '红花', amount: '6g' }
        ],
        preparation: [
            '诸药洗净',
            '加水煎煮',
            '取汁两次'
        ],
        usage: '每日1剂，分2次温服',
        precautions: '孕妇及月经量多者慎服',
        image: '🌹',
        views: 7500,
        likes: 2400,
        createTime: '2024-02-06T12:00:00Z'
    },
    {
        id: 'c29',
        type: 'classic',
        name: '枳实导滞丸',
        description: '理气消积的代表方',
        category: 'qi-regulating',
        tags: ['理气', '消食'],
        effects: '理气导滞，消食化积，用于食积气滞、胸腹胀满、消化不良等症',
        ingredients: [
            { name: '枳实', amount: '12g' },
            { name: '陈皮', amount: '9g' },
            { name: '神曲', amount: '9g' },
            { name: '麦芽', amount: '9g' },
            { name: '山楂', amount: '9g' }
        ],
        preparation: [
            '诸药研末',
            '水丸',
            '晒干备用'
        ],
        usage: '每次9g，每日3次，温开水送服',
        precautions: '脾胃虚寒者慎服',
        image: '💊',
        views: 7200,
        likes: 2300,
        createTime: '2024-02-07T13:00:00Z'
    },
    {
        id: 'c30',
        type: 'classic',
        name: '苓桂术甘汤',
        description: '祛湿温阳的经典方',
        category: 'dampness-dispelling',
        tags: ['祛湿', '温阳'],
        effects: '温阳化气，利水祛湿，用于小便不利、水肿、脾阳虚等症',
        ingredients: [
            { name: '茯苓', amount: '12g' },
            { name: '桂枝', amount: '9g' },
            { name: '白术', amount: '9g' },
            { name: '甘草', amount: '6g' }
        ],
        preparation: [
            '诸药洗净',
            '加水煎煮',
            '取汁温服'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '阴虚内热者慎服',
        image: '💧',
        views: 6900,
        likes: 2200,
        createTime: '2024-02-08T14:00:00Z'
    },
    {
        id: 'c31',
        type: 'classic',
        name: '生脉散',
        description: '益气养阴的代表方',
        category: 'tonic',
        tags: ['补气', '养阴'],
        effects: '益气养阴，生津止渴，用于气阴两虚、心悸气短、自汗、口渴等症',
        ingredients: [
            { name: '人参', amount: '9g' },
            { name: '麦冬', amount: '12g' },
            { name: '五味子', amount: '6g' }
        ],
        preparation: [
            '诸药洗净',
            '加水煎煮',
            '取汁温服'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '脾胃虚寒者慎服',
        image: '🌿',
        views: 6800,
        likes: 2100,
        createTime: '2024-02-09T10:00:00Z'
    },
    {
        id: 'c32',
        type: 'classic',
        name: '四物汤',
        description: '补血调经的经典方',
        category: 'tonic',
        tags: ['补血', '调经'],
        effects: '补血调经，用于血虚月经不调、面色萎黄、头晕目眩等症',
        ingredients: [
            { name: '当归', amount: '9g' },
            { name: '川芎', amount: '6g' },
            { name: '白芍', amount: '9g' },
            { name: '熟地黄', amount: '12g' }
        ],
        preparation: [
            '诸药洗净',
            '加水煎煮',
            '取汁两次'
        ],
        usage: '每日1剂，分2次温服',
        precautions: '脾胃虚寒者慎服',
        image: '🌺',
        views: 7100,
        likes: 2300,
        createTime: '2024-02-09T11:00:00Z'
    },
    {
        id: 'c33',
        type: 'classic',
        name: '知柏地黄丸',
        description: '滋阴降火的代表方',
        category: 'tonic',
        tags: ['补阴', '清热'],
        effects: '滋阴降火，用于阴虚火旺、骨蒸潮热、头晕耳鸣等症',
        ingredients: [
            { name: '熟地黄', amount: '24g' },
            { name: '山茱萸', amount: '12g' },
            { name: '山药', amount: '12g' },
            { name: '泽泻', amount: '9g' },
            { name: '牡丹皮', amount: '9g' },
            { name: '茯苓', amount: '9g' },
            { name: '知母', amount: '9g' },
            { name: '黄柏', amount: '9g' }
        ],
        preparation: [
            '研粉成细末',
            '炼蜜为丸',
            '每丸重9g'
        ],
        usage: '每次9g，每日2次，温开水送服',
        precautions: '脾胃虚寒者慎服',
        image: '💊',
        views: 6500,
        likes: 2000,
        createTime: '2024-02-09T12:00:00Z'
    },
    {
        id: 'c34',
        type: 'classic',
        name: '右归丸',
        description: '补阳温肾的代表方',
        category: 'tonic',
        tags: ['补阳', '温肾'],
        effects: '补阳温肾，用于肾阳不足、腰膝酸软、畏寒肢冷等症',
        ingredients: [
            { name: '熟地黄', amount: '24g' },
            { name: '山茱萸', amount: '12g' },
            { name: '枸杞子', amount: '12g' },
            { name: '菟丝子', amount: '12g' },
            { name: '鹿角胶', amount: '12g' },
            { name: '肉桂', amount: '6g' },
            { name: '附子', amount: '6g' },
            { name: '当归', amount: '9g' }
        ],
        preparation: [
            '研粉成细末',
            '炼蜜为丸',
            '每丸重9g'
        ],
        usage: '每次9g，每日2次，温开水送服',
        precautions: '阴虚火旺者慎服',
        image: '💊',
        views: 6300,
        likes: 1900,
        createTime: '2024-02-09T13:00:00Z'
    },
    {
        id: 'c35',
        type: 'classic',
        name: '归脾汤',
        description: '补气养心的经典方',
        category: 'tonic',
        tags: ['补气', '养心'],
        effects: '补气养心，健脾益血，用于心脾两虚、心悸怔忡、失眠健忘等症',
        ingredients: [
            { name: '党参', amount: '15g' },
            { name: '白术', amount: '15g' },
            { name: '茯苓', amount: '15g' },
            { name: '当归', amount: '12g' },
            { name: '龙眼肉', amount: '12g' },
            { name: '远志', amount: '6g' },
            { name: '木香', amount: '6g' },
            { name: '酸枣仁', amount: '12g' }
        ],
        preparation: [
            '诸药洗净',
            '加水煎煮',
            '取汁两次'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '胃有实热者慎服',
        image: '🌿',
        views: 6100,
        likes: 1800,
        createTime: '2024-02-09T14:00:00Z'
    },
    {
        id: 'c36',
        type: 'classic',
        name: '清营汤',
        description: '清热养阴的代表方',
        category: 'heat-clearing',
        tags: ['清热', '养阴', '凉血'],
        effects: '清热养阴，凉血消斑，用于热入营分、高热烦躁、口干咽痛等症',
        ingredients: [
            { name: '水牛角', amount: '30g' },
            { name: '生地黄', amount: '30g' },
            { name: '玄参', amount: '15g' },
            { name: '金银花', amount: '15g' },
            { name: '连翘', amount: '9g' },
            { name: '竹叶', amount: '6g' },
            { name: '麦冬', amount: '12g' }
        ],
        preparation: [
            '水牛角先煎',
            '诸药后下',
            '取汁温服'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '脾胃虚寒者慎服',
        image: '🌺',
        views: 5900,
        likes: 1700,
        createTime: '2024-02-09T15:00:00Z'
    },
    {
        id: 'c37',
        type: 'classic',
        name: '槐花散',
        description: '凉血止血的良方',
        category: 'blood-activating',
        tags: ['凉血', '止血'],
        effects: '凉血止血，清热平肝，用于便血、痔血、血热妄行等症',
        ingredients: [
            { name: '槐花', amount: '15g' },
            { name: '地榆', amount: '15g' },
            { name: '侧柏叶', amount: '12g' },
            { name: '荆芥炭', amount: '12g' }
        ],
        preparation: [
            '诸药研末',
            '温开水调服'
        ],
        usage: '每次6g，每日3次，温开水调服',
        precautions: '虚寒便血者慎服',
        image: '🌸',
        views: 5700,
        likes: 1600,
        createTime: '2024-02-09T16:00:00Z'
    },
    {
        id: 'c38',
        type: 'classic',
        name: '香砂养胃汤',
        description: '和胃理气的经典方',
        category: 'qi-regulating',
        tags: ['和胃', '理气'],
        effects: '和胃理气，健脾消食，用于脾胃虚弱、食欲不振、嗳气吞酸等症',
        ingredients: [
            { name: '香砂', amount: '6g' },
            { name: '白术', amount: '9g' },
            { name: '茯苓', amount: '9g' },
            { name: '陈皮', amount: '6g' },
            { name: '甘草', amount: '3g' }
        ],
        preparation: [
            '诸药洗净',
            '加水煎煮',
            '取汁温服'
        ],
        usage: '每日1剂，分2次温服',
        precautions: '胃有实热者慎服',
        image: '🍃',
        views: 5500,
        likes: 1500,
        createTime: '2024-02-09T17:00:00Z'
    },
    {
        id: 'c39',
        type: 'classic',
        name: '藿香正气散',
        description: '祛湿化浊的代表方',
        category: 'dampness-dispelling',
        tags: ['祛湿', '化浊', '理气'],
        effects: '化湿和中，理气解表，用于外感风寒、内伤湿滞、胸闷不舒等症',
        ingredients: [
            { name: '藿香', amount: '6g' },
            { name: '紫苏叶', amount: '6g' },
            { name: '白芷', amount: '6g' },
            { name: '陈皮', amount: '6g' },
            { name: '茯苓', amount: '6g' },
            { name: '甘草', amount: '3g' }
        ],
        preparation: [
            '诸药洗净',
            '加水煎煮',
            '取汁温服'
        ],
        usage: '每日1剂，分2-3次温服',
        precautions: '阴虚内热者慎服',
        image: '🌿',
        views: 5300,
        likes: 1400,
        createTime: '2024-02-09T18:00:00Z'
    }
];

/**
 * 网红方剂数据
 */
const popularRecipes = [
    {
        id: 'p1',
        type: 'popular',
        name: '红糖姜茶',
        description: '暖宫驱寒的经典配方',
        category: 'cold',
        tags: ['祛寒', '暖宫', '调理'],
        effects: '温中散寒，理气止痛，适用于寒性痛经、手脚冰凉等症状',
        ingredients: [
            { name: '生姜', amount: '15g' },
            { name: '红糖', amount: '30g' }
        ],
        preparation: [
            '生姜洗净切片',
            '锅中加水烧开，放入姜片',
            '小火煮10分钟',
            '加入红糖搅拌溶解即可'
        ],
        usage: '每日1-2次，趁热饮用',
        precautions: '胃热人群慎服，孕妇不宜过量',
        image: '🫖',
        views: 12580,
        likes: 3456,
        createTime: '2024-01-15T08:00:00Z'
    },
    {
        id: 'p2',
        type: 'popular',
        name: '桂花雪梨汤',
        description: '清润养颜的时尚饮品',
        category: 'beauty',
        tags: ['润燥', '养颜', '清热'],
        effects: '清热润燥，养阴生津，适用于咽干口燥、皮肤干燥等症状',
        ingredients: [
            { name: '雪梨', amount: '2个' },
            { name: '桂花', amount: '10g' },
            { name: '冰糖', amount: '20g' }
        ],
        preparation: [
            '雪梨去核切块',
            '锅中加水和雪梨块',
            '大火煮沸后转小火煮15分钟',
            '加入桂花和冰糖，继续煮2分钟即可'
        ],
        usage: '每日1-2次，温热饮用',
        precautions: '脾胃虚寒者慎服',
        image: '🍐',
        views: 9876,
        likes: 2345,
        createTime: '2024-01-16T14:00:00Z'
    },
    {
        id: 'p3',
        type: 'popular',
        name: '枸杞菊花茶',
        description: '养生保健的网红茶饮',
        category: 'health',
        tags: ['明目', '清热', '养生'],
        effects: '清热明目，滋阴养肝，适用于眼疲劳、视力模糊、头晕目眩等症状',
        ingredients: [
            { name: '枸杞', amount: '10g' },
            { name: '菊花', amount: '5g' },
            { name: '绿茶', amount: '3g' }
        ],
        preparation: [
            '沸水冲泡菊花',
            '待水温降至80度左右加入枸杞',
            '最后加入绿茶即可'
        ],
        usage: '每日1-2次，代茶饮用',
        precautions: '胃寒及月经期间慎饮',
        image: '🌸',
        views: 8765,
        likes: 1987,
        createTime: '2024-01-17T11:00:00Z'
    },
    {
        id: 'p4',
        type: 'popular',
        name: '玫瑰柠檬茶',
        description: '养颜解郁的网红饮品',
        category: 'beauty',
        tags: ['养颜', '解郁', '养生'],
        effects: '理气解郁，养颜润肤，适用于情志不畅、面色暗沉、皮肤干燥等症状',
        ingredients: [
            { name: '玫瑰花', amount: '6g' },
            { name: '柠檬', amount: '1/2个' },
            { name: '蜂蜜', amount: '15g' }
        ],
        preparation: [
            '玫瑰花洗净',
            '柠檬切片',
            '开水冲泡玫瑰花',
            '加入柠檬片和蜂蜜'
        ],
        usage: '每日1-2次，代茶饮用',
        precautions: '胃酸过多者慎饮',
        image: '🌹',
        views: 8234,
        likes: 2345,
        createTime: '2024-01-30T14:00:00Z'
    },
    {
        id: 'p5',
        type: 'popular',
        name: '银耳雪梨羹',
        description: '滋润养颜的甜品',
        category: 'beauty',
        tags: ['滋阴', '润燥', '养生'],
        effects: '滋阴润燥，养颜美容，适用于咽干口燥、皮肤干燥、便秘等症状',
        ingredients: [
            { name: '银耳', amount: '15g' },
            { name: '雪梨', amount: '1个' },
            { name: '枸杞', amount: '10g' },
            { name: '冰糖', amount: '20g' }
        ],
        preparation: [
            '银耳提前泡发',
            '雪梨去核切块',
            '同煮至银耳软烂',
            '最后加入枸杞和冰糖'
        ],
        usage: '每日1次，早晚皆可食用',
        precautions: '脾胃虚寒者慎食',
        image: '🍐',
        views: 7890,
        likes: 2123,
        createTime: '2024-01-31T15:00:00Z'
    },
    {
        id: 'p6',
        type: 'popular',
        name: '百合莲子粥',
        description: '安神养心的养生粥',
        category: 'health',
        tags: ['安神', '养心', '养生'],
        effects: '养心安神，健脾补肺，适用于心烦失眠、食欲不振、咳嗽等症状',
        ingredients: [
            { name: '百合', amount: '20g' },
            { name: '莲子', amount: '20g' },
            { name: '大米', amount: '50g' },
            { name: '红枣', amount: '3枚' }
        ],
        preparation: [
            '百合莲子提前浸泡',
            '大米淘洗干净',
            '同煮成粥',
            '最后加入红枣'
        ],
        usage: '每日1次，早晚皆可食用',
        precautions: '胃有实热者慎食',
        image: '🥣',
        views: 6789,
        likes: 1890,
        createTime: '2024-02-01T16:00:00Z'
    },
    {
        id: 'p7',
        type: 'popular',
        name: '酸梅汤',
        description: '消暑解渴的养生饮',
        category: 'summer',
        tags: ['消暑', '解渴', '养生'],
        effects: '生津止渴，开胃消暑，适用于夏季烦渴、食欲不振、口干等症状',
        ingredients: [
            { name: '乌梅', amount: '15g' },
            { name: '山楂', amount: '10g' },
            { name: '陈皮', amount: '5g' },
            { name: '甘草', amount: '3g' }
        ],
        preparation: [
            '材料洗净',
            '加水煮沸',
            '小火熬制30分钟',
            '去渣加冰糖调味'
        ],
        usage: '每日饮用，可当茶饮',
        precautions: '胃寒者慎饮',
        image: '🍹',
        views: 7123,
        likes: 1678,
        createTime: '2024-02-02T17:00:00Z'
    },
    {
        id: 'p8',
        type: 'popular',
        name: '南瓜百合粥',
        description: '养胃安神的滋补粥',
        category: 'health',
        tags: ['养胃', '安神', '养生'],
        effects: '健脾养胃，安神助眠，适用于脾胃虚弱、失眠多梦、食欲不振等症状',
        ingredients: [
            { name: '南瓜', amount: '100g' },
            { name: '百合', amount: '15g' },
            { name: '大米', amount: '50g' },
            { name: '枸杞', amount: '10g' }
        ],
        preparation: [
            '南瓜切小块',
            '百合洗净',
            '大米淘洗',
            '同煮成粥，最后加入枸杞'
        ],
        usage: '每日1次，早晚皆可食用',
        precautions: '腹泻者慎食',
        image: '🎃',
        views: 6234,
        likes: 1456,
        createTime: '2024-02-03T18:00:00Z'
    }
];

// 合并所有方剂数据
const trendingRecipes = [...classicRecipes, ...popularRecipes];

/**
 * 获取方剂列表
 * @returns {Promise<Array>} 方剂数据
 */
async function getRecipes() {
    // 模拟API调用
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(trendingRecipes);
        }, 500);
    });
}

/**
 * 获取方剂详情
 * @param {string} id - 方剂ID
 * @returns {Promise<Object>} 方剂详情
 */
async function getRecipeDetail(id) {
    // 模拟API调用
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const recipe = trendingRecipes.find(r => r.id === id);
            if (recipe) {
                resolve(recipe);
            } else {
                reject(new Error('方剂不存在'));
            }
        }, 500);
    });
}

/**
 * 更新方剂浏览量
 * @param {string} id - 方剂ID
 */
function updateRecipeViews(id) {
    const recipe = trendingRecipes.find(r => r.id === id);
    if (recipe) {
        recipe.views = (recipe.views || 0) + 1;
    }
}

/**
 * 智能推荐算法
 * @param {string} userId - 当前用户ID
 * @returns {Array} 推荐内容列表
 */
function getRecommendations(userId) {
    const users = JSON.parse(localStorage.getItem('users'));
    const posts = JSON.parse(localStorage.getItem('forumPosts'));
    const currentUser = users.find(u => u.id === userId);

    // 基于用户收藏的协同过滤
    const similarUsers = users.filter(u =>
        u.favorites.some(fav => currentUser.favorites.includes(fav))
    );

    // 合并推荐来源
    const recommendations = [
        ...getPopularPosts(posts),
        ...getSimilarPosts(similarUsers, posts),
        ...getPersonalizedRecommendations(currentUser, posts)
    ];

    // 去重并排序
    return [...new Set(recommendations)]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // 取前5个推荐
}

// 获取热门帖子（基于浏览量和收藏数）
function getPopularPosts(posts) {
    return posts
        .map(p => ({
            ...p,
            score: p.views * 0.7 + p.comments.length * 0.3
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}

/**
 * 用户数据结构增强
 * 新增字段：
 * - collectedRecipes: 用户收藏的方剂ID数组
 * - viewedRecipes: 用户浏览过的方剂ID数组
 */
let users = JSON.parse(localStorage.getItem('users') || '[]');

/**
 * 用户收藏方剂
 * @param {string} userId - 用户ID
 * @param {string} recipeId - 方剂ID
 */
function addToCollection(userId, recipeId) {
    const user = users.find(u => u.id === userId);
    if (user && !user.collectedRecipes?.includes(recipeId)) {
        user.collectedRecipes = [...(user.collectedRecipes || []), recipeId];
        localStorage.setItem('users', JSON.stringify(users));
    }
}

/**
 * 用户取消收藏
 * @param {string} userId - 用户ID 
 * @param {string} recipeId - 方剂ID
 */
function removeFromCollection(userId, recipeId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.collectedRecipes = (user.collectedRecipes || []).filter(id => id !== recipeId);
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// 修改测试用户数据，完全匹配现有用户格式
const testUsers = [
    {
        id: 'user_test001',
        username: 'test_user',
        passwordHash: 'bcb15f821479b4d5772bd0ca866c00ad5f926e3580720659cc80d39c9d09802a', // 123456
        email: 'test@example.com',
        role: 'user',
        createdAt: '2024-01-15T08:00:00Z',
        profile: {
            nickname: '测试用户',
            bio: '这是一个测试账号'
        },
        following: [],
        followers: []
    }
];

// 修改初始化函数，确保正确更新或添加测试用户
function initTestData() {
    try {
        // 获取现有用户数据
        let users = DataStore.get(DataStore.KEYS.USERS) || [];

        // 查找并更新或添加测试用户
        const testUserIndex = users.findIndex(user => user.username === 'test_user');

        if (testUserIndex !== -1) {
            // 更新现有测试用户
            users[testUserIndex] = {
                ...users[testUserIndex],
                ...testUsers[0]
            };
        } else {
            // 添加新测试用户
            users = [...testUsers, ...users];
        }

        // 保存更新后的用户数据
        DataStore.set(DataStore.KEYS.USERS, users);
        console.log('测试用户数据已初始化/更新');

        // 验证用户数据
        const updatedUsers = DataStore.get(DataStore.KEYS.USERS);
        console.log('当前用户列表:', updatedUsers);
    } catch (error) {
        console.error('初始化测试用户数据失败:', error);
    }
}

/**
 * 中药材数据库
 */
const herbs = [
    {
        id: "herb_001",
        name: "人参",
        pinyin: "renshen",
        category: "补气",
        nature: "微温",
        taste: "甘、微苦",
        meridians: ["脾", "肺", "心"],
        effects: "大补元气，复脉固脱，补脾益肺，生津养血，安神益智",
        usage: "3-9g",
        precautions: "阴虚火旺者慎用",
        commonUses: [
            "气虚体弱",
            "脾胃虚弱",
            "心气不足"
        ],
        image: "🌱"
    },
    {
        id: "herb_002",
        name: "当归",
        pinyin: "danggui",
        category: "补血",
        nature: "温",
        taste: "甘、辛",
        meridians: ["肝", "心", "脾"],
        effects: "补血活血，调经止痛，润肠通便",
        usage: "6-15g",
        precautions: "胃腹有实热者慎用",
        commonUses: [
            "血虚萎黄",
            "月经不调",
            "血虚便秘"
        ],
        image: "🌿"
    },
    // ... 更多药材数据
];

/**
 * 获取药材列表
 * @param {Object} filters - 筛选条件
 * @returns {Promise<Array>} 药材列表
 */
async function getHerbs(filters = {}) {
    return new Promise((resolve) => {
        let result = [...herbs];

        // 应用筛选条件
        if (filters.category) {
            result = result.filter(herb => herb.category === filters.category);
        }
        if (filters.meridians) {
            result = result.filter(herb =>
                herb.meridians.some(m => filters.meridians.includes(m))
            );
        }
        if (filters.search) {
            const keyword = filters.search.toLowerCase();
            result = result.filter(herb =>
                herb.name.toLowerCase().includes(keyword) ||
                herb.pinyin.toLowerCase().includes(keyword) ||
                herb.effects.toLowerCase().includes(keyword)
            );
        }

        setTimeout(() => {
            resolve(result);
        }, 300);
    });
}

/**
 * 获取药材详情
 * @param {string} id - 药材ID
 * @returns {Promise<Object>} 药材详情
 */
async function getHerbDetail(id) {
    return new Promise((resolve, reject) => {
        const herb = herbs.find(h => h.id === id);
        if (herb) {
            resolve(herb);
        } else {
            reject(new Error('药材不存在'));
        }
    });
}

/**
 * 记录药材浏览历史
 * @param {string} userId - 用户ID
 * @param {string} herbId - 药材ID
 */
function recordHerbView(userId, herbId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.herbViews = user.herbViews || [];
        user.herbViews.unshift({
            herbId,
            timestamp: new Date().toISOString()
        });
        // 只保留最近50条记录
        user.herbViews = user.herbViews.slice(0, 50);
        localStorage.setItem('users', JSON.stringify(users));
    }
}

/**
 * 论坛帖子数据结构
 */
const forumPosts = [
    {
        id: "post_001",
        title: "分享：三伏天养生经验",
        content: "夏季养生要注意...",
        authorId: "test001",
        createTime: "2024-01-15T08:00:00Z",
        updateTime: "2024-01-15T08:00:00Z",
        tags: ["养生经验", "夏季养生"],
        views: 128,
        likes: ["user1", "user2"],
        comments: [
            {
                id: "comment_001",
                content: "感谢分享！",
                authorId: "user1",
                createTime: "2024-01-15T09:00:00Z",
                likes: []
            }
        ],
        status: "published" // published, deleted, pending
    }
];

/**
 * 论坛相关功能
 */
const forumSystem = {
    /**
     * 发布帖子
     * @param {Object} postData - 帖子数据
     * @returns {Promise<Object>} 发布结果
     */
    createPost: async (postData) => {
        const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
        const newPost = {
            id: `post_${Date.now()}`,
            ...postData,
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString(),
            views: 0,
            likes: [],
            comments: [],
            status: 'published'
        };
        posts.push(newPost);
        localStorage.setItem('forumPosts', JSON.stringify(posts));
        return newPost;
    },

    /**
     * 获取帖子列表
     * @param {Object} filters - 筛选条件
     * @returns {Promise<Array>} 帖子列表
     */
    getPosts: async (filters = {}) => {
        const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
        let result = posts.filter(p => p.status === 'published');

        if (filters.tag) {
            result = result.filter(p => p.tags.includes(filters.tag));
        }
        if (filters.author) {
            result = result.filter(p => p.authorId === filters.author);
        }
        if (filters.search) {
            const keyword = filters.search.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(keyword) ||
                p.content.toLowerCase().includes(keyword)
            );
        }

        // 排序
        switch (filters.sort) {
            case 'latest':
                result.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
                break;
            case 'popular':
                result.sort((a, b) => (b.views + b.likes.length) - (a.views + a.likes.length));
                break;
            default:
                result.sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime));
        }

        return result;
    },

    /**
     * 更新帖子
     * @param {string} postId - 帖子ID
     * @param {Object} updateData - 更新数据
     */
    updatePost: async (postId, updateData) => {
        const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
        const index = posts.findIndex(p => p.id === postId);
        if (index !== -1) {
            posts[index] = {
                ...posts[index],
                ...updateData,
                updateTime: new Date().toISOString()
            };
            localStorage.setItem('forumPosts', JSON.stringify(posts));
            return posts[index];
        }
        throw new Error('帖子不存在');
    },

    /**
     * 添加评论
     * @param {string} postId - 帖子ID
     * @param {Object} commentData - 评论数据
     */
    addComment: async (postId, commentData) => {
        const posts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
        const post = posts.find(p => p.id === postId);
        if (post) {
            const newComment = {
                id: `comment_${Date.now()}`,
                ...commentData,
                createTime: new Date().toISOString(),
                likes: []
            };
            post.comments.push(newComment);
            localStorage.setItem('forumPosts', JSON.stringify(posts));
            return newComment;
        }
        throw new Error('帖子不存在');
    }
};

// 初始化论坛数据
if (!localStorage.getItem('forumPosts')) {
    localStorage.setItem('forumPosts', JSON.stringify(forumPosts));
}

/**
 * 配方投稿数据结构
 */
const submissions = {
    /**
     * 投稿状态
     */
    STATUS: {
        PENDING: 'pending',    // 待审核
        APPROVED: 'approved',  // 已通过
        REJECTED: 'rejected',  // 已拒绝
        DRAFT: 'draft'        // 草稿
    },

    /**
     * 提交配方
     * @param {Object} data - 配方数据
     * @returns {Promise<Object>} 提交结果
     */
    submit: async (data) => {
        const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        const newSubmission = {
            id: `submission_${Date.now()}`,
            ...data,
            status: submissions.STATUS.PENDING,
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString(),
            reviewTime: null,
            reviewerId: null,
            reviewComment: null,
            version: 1
        };
        submissions.push(newSubmission);
        localStorage.setItem('submissions', JSON.stringify(submissions));
        return newSubmission;
    },

    /**
     * 获取投稿列表
     * @param {Object} filters - 筛选条件
     * @returns {Promise<Array>} 投稿列表
     */
    getSubmissions: async (filters = {}) => {
        const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        let result = [...submissions];

        // 应用筛选
        if (filters.status) {
            result = result.filter(s => s.status === filters.status);
        }
        if (filters.userId) {
            result = result.filter(s => s.authorId === filters.userId);
        }

        // 排序
        result.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

        return result;
    },

    /**
     * 审核投稿
     * @param {string} submissionId - 投稿ID
     * @param {Object} reviewData - 审核数据
     */
    review: async (submissionId, reviewData) => {
        const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        const submission = submissions.find(s => s.id === submissionId);

        if (!submission) {
            throw new Error('投稿不存在');
        }

        // 更新审核信息
        submission.status = reviewData.status;
        submission.reviewTime = new Date().toISOString();
        submission.reviewerId = reviewData.reviewerId;
        submission.reviewComment = reviewData.comment;
        submission.updateTime = new Date().toISOString();

        // 如果通过审核，添加到方剂库
        if (reviewData.status === submissions.STATUS.APPROVED) {
            const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
            recipes.push({
                id: `recipe_${Date.now()}`,
                name: submission.name,
                type: 'user_submitted',
                effect: submission.effect,
                composition: submission.composition,
                source: `用户投稿 - ${submission.authorId}`,
                usage: submission.usage,
                indications: submission.indications,
                createTime: new Date().toISOString(),
                submissionId: submission.id
            });
            localStorage.setItem('recipes', JSON.stringify(recipes));
        }

        localStorage.setItem('submissions', JSON.stringify(submissions));
        return submission;
    },

    /**
     * 批量审核
     * @param {Array} submissionIds - 投稿ID数组
     * @param {Object} reviewData - 审核数据
     */
    batchReview: async (submissionIds, reviewData) => {
        const results = await Promise.all(
            submissionIds.map(id => submissions.review(id, reviewData))
        );
        return results;
    }
};

// 初始化投稿数据
if (!localStorage.getItem('submissions')) {
    localStorage.setItem('submissions', JSON.stringify([]));
}

/**
 * AR识别相关功能
 */
const arSystem = {
    /**
     * 识别历史记录
     */
    HISTORY_LIMIT: 50, // 每个用户保存的历史记录数量

    /**
     * 记录识别结果
     * @param {string} userId - 用户ID
     * @param {Object} recognitionData - 识别数据
     */
    saveRecognition: async (userId, recognitionData) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        // 初始化识别历史
        user.arHistory = user.arHistory || [];

        // 添加新记录
        const record = {
            id: `ar_${Date.now()}`,
            timestamp: new Date().toISOString(),
            imageUrl: recognitionData.imageUrl,
            result: {
                herbId: recognitionData.herbId,
                confidence: recognitionData.confidence,
                matchedFeatures: recognitionData.matchedFeatures
            },
            saved: true
        };

        // 添加到历史记录开头
        user.arHistory.unshift(record);

        // 限制历史记录数量
        if (user.arHistory.length > arSystem.HISTORY_LIMIT) {
            user.arHistory = user.arHistory.slice(0, arSystem.HISTORY_LIMIT);
        }

        // 保存更新
        localStorage.setItem('users', JSON.stringify(users));
        return record;
    },

    /**
     * 获取用户的识别历史
     * @param {string} userId - 用户ID
     * @param {Object} filters - 筛选条件
     */
    getHistory: async (userId, filters = {}) => {
        const user = users.find(u => u.id === userId);
        if (!user || !user.arHistory) return [];

        let result = [...user.arHistory];

        // 应用筛选
        if (filters.saved === true) {
            result = result.filter(r => r.saved);
        }
        if (filters.herbId) {
            result = result.filter(r => r.result.herbId === filters.herbId);
        }
        if (filters.startDate) {
            result = result.filter(r =>
                new Date(r.timestamp) >= new Date(filters.startDate)
            );
        }
        if (filters.endDate) {
            result = result.filter(r =>
                new Date(r.timestamp) <= new Date(filters.endDate)
            );
        }

        return result;
    },

    /**
     * 删除识别记录
     * @param {string} userId - 用户ID
     * @param {string} recordId - 记录ID
     */
    deleteRecord: async (userId, recordId) => {
        const user = users.find(u => u.id === userId);
        if (!user || !user.arHistory) return;

        user.arHistory = user.arHistory.filter(r => r.id !== recordId);
        localStorage.setItem('users', JSON.stringify(users));
    },

    /**
     * 获取识别统计数据
     * @param {string} userId - 用户ID
     */
    getStats: async (userId) => {
        const user = users.find(u => u.id === userId);
        if (!user || !user.arHistory) return null;

        return {
            totalRecognitions: user.arHistory.length,
            savedRecognitions: user.arHistory.filter(r => r.saved).length,
            recognitionsByHerb: user.arHistory.reduce((acc, curr) => {
                const herbId = curr.result.herbId;
                acc[herbId] = (acc[herbId] || 0) + 1;
                return acc;
            }, {}),
            averageConfidence: user.arHistory.reduce((sum, curr) =>
                sum + curr.result.confidence, 0) / user.arHistory.length
        };
    }
};

/**
 * 数据持久化管理系统
 */
const DataStore = {
    VERSION: '1.0',

    KEYS: {
        USERS: 'users',                // 用户数据
        POSTS: 'forum_posts',          // 论坛帖子
        COMMENTS: 'comments',          // 评论数据
        LIKES: 'likes',                // 点赞数据
        VERSION: 'data_version'        // 数据版本
    },

    init() {
        // 检查版本
        const storedVersion = localStorage.getItem(this.KEYS.VERSION);
        if (storedVersion !== this.VERSION) {
            this.initializeData();
        }

        // 确保所有必要的数据结构存在
        this.ensureDataStructures();
    },

    /**
     * 初始化所有数据
     */
    initializeData() {
        // 初始化用户数据
        if (!localStorage.getItem(this.KEYS.USERS)) {
            localStorage.setItem(this.KEYS.USERS, JSON.stringify([]));
        }

        // 初始化论坛数据
        if (!localStorage.getItem(this.KEYS.POSTS)) {
            localStorage.setItem(this.KEYS.POSTS, JSON.stringify([]));
        }

        // 初始化评论数据
        if (!localStorage.getItem(this.KEYS.COMMENTS)) {
            localStorage.setItem(this.KEYS.COMMENTS, JSON.stringify([]));
        }

        // 初始化点赞数据
        if (!localStorage.getItem(this.KEYS.LIKES)) {
            localStorage.setItem(this.KEYS.LIKES, JSON.stringify([]));
        }

        // 保存版本号
        localStorage.setItem(this.KEYS.VERSION, this.VERSION);
    },

    /**
     * 确保数据结构完整
     */
    ensureDataStructures() {
        const users = this.get(this.KEYS.USERS) || [];
        users.forEach(user => {
            // 确保用户数据结构完整
            user.collectedRecipes = user.collectedRecipes || [];
            user.herbViews = user.herbViews || [];
            user.following = user.following || [];
            user.profile = user.profile || {};
            user.posts = user.posts || [];
        });
        this.set(this.KEYS.USERS, users);
    },

    // 数据备份功能
    backup() {
        const data = {};
        Object.values(this.KEYS).forEach(key => {
            data[key] = this.get(key);
        });
        localStorage.setItem('dataBackup', JSON.stringify(data));
    },

    // 数据恢复功能
    restore() {
        const backup = localStorage.getItem('dataBackup');
        if (backup) {
            const data = JSON.parse(backup);
            Object.entries(data).forEach(([key, value]) => {
                this.set(key, value);
            });
        }
    },

    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (error) {
            console.error('获取数据失败:', error);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('保存数据失败:', error);
        }
    }
};

// 初始化数据存储
DataStore.init(); 