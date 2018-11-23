// 音
// 两音相加: 如conduct: 做, 其谐音是: 肯大科特做, 做肯大科特
// 音+含义: 如detach, 分离, 分离的太迟了.
// 故事: 可以建立联系. 联系本身也是可以通过故事建立的
// 两步: 转换 + 连接
let words = [
// 分隔
{
    word: 'portray',
    rem: `谐音: 破锤.
    破锤描绘
    我看见了, 雷神再用破锤描绘一些东西, 好像是一个法阵...啊, 我的眼睛`
},
{
    word: 'figure',
    rem: '图, 数, 人, 算...这是在描述一个数学家'
},
{
    word: 'correlate',
    rem: `corre, 核心. late迟. "核心迟关联"技术
    就是在只轻量任务时, 只调用一个核心, 而在复杂任务时, 在延迟关联多个核心`
},
{word: 'underUsed',
rem: '未充分利用的'
},
{
word: 'neck and neck',

},
{
word: 'rebellion',
rem: '又暴力嗯... 反叛'
},
{
word: 'ingredient',
rem: `
我们(和画儿)流落荒岛的日子
英阁雨点头, 点头挖原料
`
},
{
word: 'bluePrint',
rem: '蓝图'
},
{
word: 'tedious',
rem: `谐音: 替弟而死
这时, 黑黢黢的森林中传出来诡异的声音: 替弟挖木无聊, 那替弟而死呢`
},
{
word: 'tedium',
rem: `替弟挖木
你在干啥呢: 我在替弟挖木, 好无聊. 挖...每天都在替弟挖木
`
},
{
word: "cooper",
rem: `谐音: 库珀
看生命大爆炸, 我和同学说: 原来cooper还有铜制的意义, 原来cooper是铜制的...怪不得那么木
同学笑到不能自理: 233 铜制的, 那么木...233
`
},
{
word: 'versatile',
rem: `协议: 我舌头
我的舌头..多才多艺...`
},
{word: 'applicable',
rem: `app里擦玻璃
对于用户的屏幕老是变脏, 这个问题, 我想到的解决方案是... 在app里内置一个小人, 当打开这个app的时候, 这个小人就会在app里擦玻璃...
呃...真的是可用的方案
`},
{word: 'consume', 
rem:`协议: 啃秀木
木秀于林, 人必啃之...
233, 真实浪费, 消耗资源
`},
{word: 'nomenclature',
rem:`无人可乐[气水], 打一术语:
答案是: 自频震动. 因为没有人, 但可乐变成了可乐[气水], 结果只能是可乐自己震动造成的 
`},
{word: 'coherent', 
rem: `come here 牛头, 和大家对齐, 保持一致
--牛魔王痴痴的回忆起了自己的芳华
`},
{word: 'prejudice', meaning: '偏见', 
rem: `judge: 判断. 
judice: 审判, 做出判断, 
pre: 前. 
在做出判断前就形成的, 就是偏见`, img: ''},
{word: 'recitation', meaning: '背诵', rem: 'recite: 背诵, cite: 引用, recite: 再引用', img: ''},
{word: 'rise above', meaning: '超越', rem: '', img: ''},
{word: 'multitude', meaning: '众多', 
rem: `猫蹄T由的
这些倒下的人, 都是被猫蹄T由的`
},
{word: 'gigantic', meaning: '巨大的', rem: 'giant的g...很...巨大...?', img: ''},
{word: 'enlist', meaning: '征召', 
rem: `en: 进入, list: 队
我们这儿叫"应征入伍",
英语中叫"应征入队"
`, img: ''},
{word: 'criminal', meaning: '', rem: '', img: ''},
{word: 'conduct', meaning: '举止', 
rem: `以看做企业环境中的do... 做, conduct product做产品

`, 
img: ''},
{word: 'detach', meaning: '派遣, 拆卸', 
rem: `
谐音: 的太迟
分离的太迟了...就怀孕了...
`, img: ''},
{word: 'chop out', meaning: '展露, 降低', 
rem: `别记别的意思了, 就是砍掉...`, 
img: ''},
{word: 'farfetched', meaning: '牵强的', 
rem: `far 遥远的, fetch: 取到, 获得
所以far fatch就是勉强, 堪堪可以拿到
`, 
img: ''},
{word: 'alternative', meaning: '可选的', rem: '', img: ''},
{word: 'strive', meaning: '努力奋斗', 
rem: `不奋斗: 死废物
奋斗: 死拽物`, img: ''},
{word: 'undue', meaning: '过度的', 
rem: '不做了, 不做了, 做的过度了...', img: ''},
{word: 'rebound', meaning: '反弹', 
rem: 'bound: 边界, 跳跃. rebound: 反弹', img: ''},
{word: 'rigid', meaning: '严格死板的',
rem: `日狗id
华夏学院第一章:
2028年, 每个人都能领到不同的id, 我们这代人的id以"日"字开头 
看着队伍前面的人挺到的都是: 日光id, 日高id, 还听好听的, 我还隐隐有点期待,
拿到自己的一看...日狗id
我整个人都石化了...这...这个名字...我觉得自己的表情都僵硬了
`,

img: ''},
{word: 'worldview', meaning: '世界观', 
rem: '说的直白一些, 世界观', img: ''},
{word: 'preferable', meaning: '更合适的', 
rem: 'prefer: 更喜欢, 这是prefer的形容词形式', img: ''},
{word: 'skepticism', meaning: '怀疑主义', 
rem: `四个菩提猜想:
佛陀做梦, 梦见自己四个菩提, 然后就不知道自己到底四菩提还是佛陀了. 这就是四个菩提猜想
还有, 佛陀s, sh不分
`, img: ''},
{word: 'orientation', meaning: '方向', 
rem: `偶人忒神, 能指示方向
我猜他是说的大概是稻草人`, 
img: ''},
{word: 'think highly of', meaning: '对...评价很高', rem: '', img: ''},
{word: 'incurably', meaning: '无药可救的', rem: '', img: ''},
{word: 'giant', meaning: '巨大的', rem: '', img: ''},
{word: 'fancy', meaning: '想象力', rem: '', img: ''},
{word: 'enlightened', meaning: '开明的', rem: '', img: ''},
{word: 'destiny', meaning: '命运', rem: 'you are my destiny', img: ''},
{word: 'manufacture', meaning: '生产',
rem: '马牛, 变成现实, 这就是制造', img: ''},
{word: 'creationism', meaning: '创造论', rem: '', img: ''},
{word: 'keep abreast of', meaning: '跟得上', rem: 'abreast: 并列的. 想要和别人保持并列, 就不能停下来休息, 哪怕一会儿', img: ''},
{word: 'conditionally', meaning: '有条件的', rem: 'condition: 条件 想啃神, 可是有条件的', img: ''},
{word: 'chip', meaning: '削, 屑片', rem: 'potato chip', img: ''},
{word: 'autonomous', meaning: '自治的', rem: 'auto自 nomous不再死. 自治, 为了no more 死', img: ''},
{word: 'booth', meaning: '临时货摊', rem: '不死小摊', img: ''},
{word: 'work against', meaning: '对...不利', rem: '', img: ''},
{word: 'stripe', meaning: '条纹', rem: '那个水果姐的演唱会, 就带了这样一个条纹带', img: ''},
{word: 'alphabetically', meaning: '按字母顺序的', rem: '还记得谷歌因为业务太多, 所以创建了一家母公司, 叫做alphabet', img: ''},
{word: 'single out', meaning: '选拨', rem: '这个词...好形象', img: ''},
{word: 'undertreatment', meaning: '处理不足, 治疗不过', rem: '就是传说中的...欠治吗', img: ''},
{word: 'rewarding', meaning: '值得的', rem: '', img: ''},
{word: 'rebelling', meaning: '反叛的', rem: '', img: ''},
{word: 'preface', meaning: '序言', rem: '序言--就是书的前脸233', img: ''},
{word: 'manipulate', meaning: '操纵', rem: '人', img: ''},
{word: 'incorportate', meaning: '将...包括在内', rem: '公司合并, 进入某个公司', img: ''},
{word: 'get over', meaning: '克服', rem: '所谓克服, 就是终于超乎其上...over', img: ''},
{word: 'identity with', meaning: '认为...等同于', rem: '', img: ''},
{word: 'fallout', meaning: '', rem: '', img: ''},
{word: 'despite', meaning: '尽管', rem: '尽管他不是spite蜘蛛仁', img: ''},
{word: 'boost', meaning: '提高', rem: '布斯特...鞋, 可以提高', img: ''},
{word: 'dividend', meaning: '红利, 股利', rem: '怪不得老说分红...', img: ''},
{word: 'crash', meaning: '碰撞', rem: '', img: ''},
{word: 'child-bearing', meaning: '生育', rem: '生...生个熊?', img: ''},
{word: 'condense into', meaning: '浓缩成', rem: 'condense: 凝结 can冻死', img: ''},
{word: 'witness', meaning: '证人, 目击者', rem: '有智慧的目击者', img: ''},
{word: 'strikingly', meaning: '引人注目的', rem: 'strike炫迈口香糖, 像闪电一样引人注意', img: ''},
{word: 'theorize', meaning: '创立学说', rem: '', img: ''},
{word: 'resoned', meaning: '合乎逻辑的', rem: '', img: ''},
{word: 'predict', meaning: '预知', rem: '当我预测了未来的时候, 这个水晶球就会噗的一声变成红色', img: ''},
{word: 'organism', meaning: '生物', rem: 'organ, 器官', img: ''},
{word: 'organic being', meaning: '有机生命', rem: 'organ, 器官', img: ''},
{word: 'morally', meaning: '道德上的', rem: '', img: ''},
{word: 'mark up', meaning: '', rem: '', img: ''},
{word: 'fallacy', meaning: '谬误', rem: '发了c. 你以为选c就发了吗? 真实荒谬', img: ''},
{word: 'justify', meaning: '合理的', rem: '', img: ''},
{word: 'engage in', meaning: '从事', rem: 'engage: 从事. yn gay', img: ''},
{word: 'idenfifiable', meaning: '可辨认的', rem: '', img: ''},
{word: 'divided', meaning: '意见分歧的', rem: '', img: ''},
{word: 'desired', meaning: '想要的', rem: '', img: ''},
{word: 'inconstancy', meaning: '反复无常的', rem: 'constant: 恒定不变的', img: ''},
{word: 'concrete', meaning: '混凝土制的', rem: '看, 克里特岛是用混凝土制作的', img: ''},
{word: 'authentic', meaning: '真实的', rem: '', img: ''},
{word: 'chat show', meaning: '谈话节目', rem: '', img: ''},
{word: 'theft', meaning: '偷窃', rem: 'thief 小偷', img: ''},
{word: 'withdrawal', meaning: '撤退, 但也更表示"戒断"', rem: '', img: ''},
{word: 'all that is needed', meaning: '只需', rem: '', img: ''},
{word: 'underprivileged', meaning: '底层的', rem: 'previlege: 特权', img: ''},
{word: 'revolve around', meaning: '围绕...旋转', rem: '', img: 'gif'},
{word: 'reasonable', meaning: '公平的', rem: '', img: ''},
{word: 'morality', meaning: '道德', rem: '猫肉道德', img: ''},
{word: 'jury', meaning: '陪审团', rem: '七月陪审团 july jury', img: ''},
{word: 'hypocritical', meaning: '伪善的', rem: 'hypo: 在...之下, 低于. critical: 批评<br> 不批评, 但伪善', img: 'jpg'},
{word: 'get on', meaning: '上车', rem: '', img: 'jpg'},
{word: 'inconclusive', meaning: '无定论的', rem: '', img: 'jpg'},
{word: 'fall victim to', meaning: '成为...牺牲品', rem: '', img: 'jpg'},
{word: 'preconception', meaning: '预想', rem: '', img: 'jpg'},
{word: 'endure', meaning: '忍受', rem: '', img: 'jpg'},
{word: 'boast about', meaning: '夸口', rem: 'boast: 夸口. 我能bo死特', img: 'jpg'},
{word: 'attribute to', meaning: '归因于', rem: '', img: ''},
{word: 'strategic', meaning: '战略的', rem: 'strategy 策略', img: ''},
{word: 'significant', meaning: '意味深长的', rem: '', img: ''},
{word: 'with regard to', meaning: '关于', rem: '', img: ''},
{word: 'revival', meaning: '复兴', rem: 're-survival', img: ''},
{word: 'the old and infirm', meaning: '年老体弱者', rem: '', img: ''},
{word: 'realization', meaning: '认识', rem: '', img: ''},
{word: 'presious', meaning: '宝贵的', rem: '', img: ''},
{word: 'monetary', meaning: '货币的', rem: '玛尼特瑞, 就是钱特别好', img: ''},
{word: 'humanity', meaning: '除了人类, 还有人性的意思', rem: '', img: ''},
{word: 'joint', meaning: '连接处 关节', rem: '', img: ''},
{word: 'lower half', meaning: '下半部分', rem: '', img: 'jpg'},
{word: 'incompetent', meaning: '无法胜任的', rem: 'competent 有能力的', img: ''},
{word: 'encounter', meaning: '遭遇', rem: '在角落里遭遇, 其实counter是相反...', img: ''},
{word: 'diversion', meaning: '转移(注意力)', rem: '这个滴version...你不要转移注意力, 我问你为什么这么多bug!', img: ''},
{word: 'courteous', meaning: '有礼貌的', rem: '可替儿死...真是太"有礼貌"了', img: ''},
{word: 'aim at', meaning: '瞄准', rem: '', img: ''},
{word: 'characteristic of', meaning: '特有的', rem: '', img: ''},
{word: 'wistful', meaning: '失意的, 惆怅的', rem: 'wis: 智慧 wist 知道 wistful: 知道越多, 越惆怅', img: ''},
{word: 'concerned', meaning: '有关的, 关心的', rem: '', img: ''},
{word: 'underestimate', meaning: '低估', rem: 'under: 低, estimate: 评估, s题mate, s题适配. 评估了他的能力, 给他s题适配 ', img: ''},
{word: 'distrust', meaning: '不信任', rem: '', img: ''},
{word: 'blinding', meaning: '耀眼的', rem: '耀眼到令人致盲', img: ''},
{word: 'attendant', meaning: '服务人员', rem: 'attend 照顾, ant: 人', img: ''},
{word: 'channel', meaning: '频道', rem: '', img: ''},
{word: 'deprive of', meaning: '剥夺', rem: 'deprivation 剥夺', img: ''},
{word: 'aging', meaning: '老化的', rem: '', img: ''},
{word: 'unconcerned with', meaning: '对...不关心', rem: '', img: ''},
{word: 'testify', meaning: '证明', rem: '测验证明', img: ''},
{word: 'retreat', meaning: '撤退', rem: '撤回去治疗', img: ''},
{word: 'preach', meaning: '布道', rem: '布道: 如何日桃子...', img: 'jpg'},
{word: 'living proof', meaning: '活生生的例子', rem: '哈哈, 好形象', img: ''},
{word: 'on the model of', meaning: '以...为模型', rem: '', img: ''},
{word: 'isolated', meaning: '孤立的', rem: '', img: ''},
{word: 'emerging', meaning: '新兴的', rem: '刚才才记过: emerge: 出现', img: ''},
{word: 'distract', meaning: '使分心', rem: 'abstract: 抽象的, 深奥的. distract, 分心了, 就不能研究抽象深奥的东西了', img: ''},
{word: 'inaccuracy', meaning: '不准确的', rem: '', img: ''},
{word: 'deprivation', meaning: '剥夺', rem: '带婆喂神, 然后婆被神剥夺了...', img: ''},
{word: 'courageous', meaning: '勇敢的', rem: '', img: ''},
{word: 'comprehensive', meaning: '全面的', rem: 'Comprehension 理解, 越前面, 越容易理解', img: ''},
{word: 'chamber', meaning: '房间', rem: '纤薄的房间', img: ''},
{word: 'whereby', meaning: '凭什么', rem: '凭哪里, 凭小兔子吗?', img: ''},
{word: 'unaware', meaning: '没意识到的', rem: '', img: ''},
{word: 'territory', meaning: '领土', rem: 'terra土地, 土地的故事', img: ''},
{word: 'stirring', meaning: '激动人心的', rem: '激动的涕泗横流... 泗涕', img: ''},
{word: 'attach to', meaning: '附上', rem: '', img: ''},
{word: 'retire on', meaning: '退休后靠...生活', rem: '', img: ''},
{word: 'sightseer', meaning: '观光者', rem: '', img: ''},
{word: 'aggressive', meaning: '侵略的', rem: '', img: ''},
{word: 'rage', meaning: '狂怒', rem: '狂怒哪还来的睿智...', img: ''},
{word: 'praisable', meaning: '值得表扬的 ', rem: '', img: ''},
{word: 'moderate', meaning: '中等的', rem: '猫的rate是中等的', img: ''},
{word: 'irritating', meaning: '使人不愉快的', rem: '抑郁忒停', img: ''},
{word: 'livelihood', meaning: '生计', rem: '', img: ''},
{word: 'hostility', meaning: '敌意', rem: '人家得了好死, 你还去踢了踢, 看来你是针对对他抱有敌意', img: ''},
{word: 'failure', meaning: '失败', rem: '原来它的读音是: 非礼儿', img: ''},
{word: 'on the horizon', meaning: '即将来临的', rem: '', img: ''},
{word: 'emerge', meaning: '出现', rem: 'merge的时候, 出现了の...', img: ''},
{word: 'coverage', meaning: '覆盖率', rem: '', img: 'jpg'},
{word: 'compliance', meaning: '服从', rem: '', img: 'gif'},
{word: 'tend to do sth', meaning: '倾向于做某事', rem: '', img: ''},
{word: 'distinctly', meaning: '清楚地', rem: 'dis听可特累', img: ''},
{word: 'depletion', meaning: '损耗', rem: 'dep累肾, 是真的累', img: ''},
{word: 'unambiguous', meaning: '清楚的', rem: 'ambiguous: 模糊不清的<br>am 大 uou, 我大模糊', img: 'png'},
{word: 'centralized', meaning: '中央集权的', rem: '', img: ''},
{word: 'count-culture', meaning: '反正通文化', rem: 'counter相反的', img: ''},
{word: 'at the mercy of', meaning: '任...摆布', rem: '这恐怕不能叫mercy了吧, 应该叫做助纣为虐', img: ''},
{word: 'well-informed', meaning: '见多识广的', rem: '', img: ''},
{word: 'affinity', meaning: '吸引力', rem: 'a非你体<br>a: 一个, 一个非你的身体, 会很具有吸引力', img: ''},
{word: 'assimilate', meaning: '同化', rem: '', img: ''},
{word: 'vulgar', meaning: '粗俗的', rem: '粗俗的社会我哥', img: ''},
{word: 'comparison', meaning: '比拟', rem: '', img: ''},
{word: 'turn back', meaning: '折回', rem: '', img: ''},
{word: 'beneficence', meaning: '行善', rem: '', img: ''},
{word: 'take root', meaning: '生根', rem: '', img: ''},
{word: 'correlate with', meaning: '与...相关', rem: '', img: ''},
{word: 'turbulent', meaning: '动荡的', rem: '她表脸的..., 动荡时期, 它表脸的', img: ''},
{word: 'voluntary', meaning: '自愿的', rem: '我len他瑞... 我是自愿的', img: ''},
{word: 'pushing', meaning: '有精力的', rem: '有精力的不行...', img: 'jpg'},
{word: 'sign', meaning: '迹象', rem: 're sign 再见, 辞职', img: ''},
{word: 'resign', meaning: 'v 辞职', rem: '', img: ''},
{word: 'resignation', meaning: '辞职', rem: '', img: ''},
{word: 'offend', meaning: '冒犯', rem: '谐音挺像的', img: ''},
{word: 'minimun', meaning: '最小的', rem: '', img: ''},
{word: 'head rolling', meaning: '指被解雇', rem: '', img: ''},
{word: 'explosion', meaning: '爆炸', rem: '', img: ''},
{word: 'interpretation', meaning: '口译', rem: '', img: ''},
{word: 'elaborate', meaning: '复杂的, 精心制作的', rem: '', img: ''},
{word: 'dismass...as', meaning: '对...不屑一顾', rem: '', img: ''},
{word: 'sympathy', meaning: '赞同, 同情', rem: '', img: ''},
{word: 'delightful', meaning: '讨人喜欢的', rem: '', img: ''},
{word: 'cashless', meaning: '无现金的', rem: '', img: ''},
{word: 'corporate', meaning: '公司的', rem: '', img: ''},
{word: 'behavioral', meaning: '行为的', rem: '', img: ''},
{word: 'assess', meaning: '评定', rem: 'ass, ess, 到底是ass, 还是ess, 来回评估...', img: ''},
{word: 'vocational', meaning: '职业技术', rem: '假期是vacation', img: ''},
{word: 'tunnel', meaning: '隧道', rem: '', img: 'jpg'},
{word: 'take off', meaning: '起飞, 脱下', rem: '', img: ''},
{word: 'administration', meaning: '管理', rem: '', img: ''},
{word: 'standstill', meaning: '中止', rem: '', img: ''},
{word: 'pursuit', meaning: '追求', rem: '追求超级合适', img: ''},
{word: 'pessimism', meaning: '悲观', rem: '', img: 'jpg'},
{word: 'shareholder', meaning: '股东', rem: '', img: ''},
{word: 'interpret', meaning: '口译', rem: '', img: ''},
{word: 'miniaturization', meaning: '小型化', rem: '这个单词的长度可一点也不小型化...', img: ''},
{word: 'off the starting line', meaning: '从一开始', rem: '', img: ''},
{word: 'head count', meaning: '点人头', rem: '', img: ''},
{word: 'explorer', meaning: '探险家', rem: '', img: ''},
{word: 'eightfold', meaning: '八倍的', rem: 'fold 折叠', img: 'jpg'},
{word: 'formation', meaning: '形成', rem: 'for妹神是怎么形容的呢', img: ''},
{word: 'deliciously', meaning: '可口的', rem: '', img: ''},
{word: 'disjunction', meaning: '分离', rem: '小时候, 上玄幻课, 同桌和我说, 第四讲可神了, 我翻开书, 打开第四讲: 灵肉分离', img: 'jpg'},
{word: 'cope width', meaning: '处理', rem: '', img: ''},
{word: 'comparative', meaning: '比较的', rem: '', img: ''},
{word: 'be true of', meaning: '与...情况相同', rem: '', img: ''},
{word: 'cash register', meaning: '', rem: '现金出纳机', img: ''},
{word: 'assert', meaning: '断言', rem: '', img: 'jpg'},
{word: 'vitality', meaning: '活力', rem: '', img: ''},
{word: 'setback', meaning: '挫折', rem: '', img: ''},
{word: 'representative', meaning: '代表', rem: '', img: ''},
{word: 'represent', meaning: '代表', rem: '代表说: 哎呀, 又提礼物...', img: ''},
{word: 'trustworthy', meaning: '值得信任的', rem: '', img: ''},
{word: 'purchase', meaning: '购买', rem: '', img: ''},
{word: 'take advantage of', meaning: '利用', rem: '', img: ''},
{word: 'pervasive', meaning: '弥漫的', rem: '', img: ''},
{word: 'standardize', meaning: '使标准化', rem: '', img: ''},
{word: 'liberal', meaning: '', rem: '自由的, 慷慨的<br>literary: 文学的. <br>力薄弱, 但慷慨大方, 力特弱, 只能潜心于文学了', img: ''},
{word: 'formal', meaning: '', rem: '正式的', img: ''},
{word: 'militantly', meaning: '好斗的', rem: '迷离..因为疼的...因为好斗', img: ''},
{word: 'egalitarian', prop: '', meaning: '平等主义的', rem: '看看一旮旯的提利昂, 还敢说平等主义?', img: 'jpg'},
{word: 'dishonor', prop: '', meaning: '拒付', rem: '华为爵士, 您不付钱, 这可一点都不光荣', img: ''},

{word: 'deliberate', prop: '', meaning: '故意的', rem: 'you are deliberate!', img: 'jpg'},
{word: 'earnest', prop: 'n', meaning: '认真的', rem: 'earn: 获得. 认真的人, 获得的最多'},
{word: 'lest', prop: 'n', meaning: '唯恐', rem: 'lest<br> the last lest what: 最后一个还有什么害怕的呢'},
{word: 'disgrace', prop: 'n', meaning: '使丢脸', rem: 'dis(不), grace(优雅)'},
{word: 'exploitation', prop: 'n', meaning: '开采', rem: 'explore: 探索<br> 探索, 然后开采'},
{word: 'convince', prop: 'v', meaning: '使信服', rem: '肯为死<br>信服了, 就肯为之死'},
{word: 'urge', prop: 'v', meaning: '力劝', rem: '先力劝, 不行就遏制...'},
{word: 'reject', prop: 'n', meaning: '拒绝', rem: '原来是拒绝啊, resolve/reject'},
{word: 'sector', prop: 'n', meaning: '扇区, 部门', rem: '', img: 'jpg'},
{word: 'torture', prop: 'n', meaning: '拷问', rem: '谐音: 拖扯 <br> 拷问的时候, 又拖又扯'},
{word: 'profound', prop: 'a', meaning: '巨大的', rem: '所谓的: "超级大发现" <br> 超级(pro) 大(巨大的), found(发现)'},
{word: 'passionate', prop: 'a', meaning: '充满激情的', rem: '我做这个背单词工具的时候, 心情就是passionate呀~'},
{word: 'surveillance', prop: 'n', meaning: '监视', rem: 'sir, we冷死. <br> 监视中: sir, we冷死了, 能让我们回去了吗'}
];

export default words;