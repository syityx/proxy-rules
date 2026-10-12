// FlClash / Mihomo script override. Node credentials remain in the airport subscription.
function main(config) {
  const nodes = (config.proxies || []).filter(x => x && typeof x.name === "string").map(x => x.name);
  const residential = /家宽|家寬/i;
  const premium = /\[(?:2|3|5|10|20)\s*[xX]\]/;
  const hk = /🇭🇰|香港|Hong\s*Kong|HKG|\bHK\b|沪港|深港|京港/i;
  const region = {
    "🇭🇰 香港节点": /🇭🇰|香港|Hong\s*Kong|HKG|\bHK\b|沪港|深港|京港/i,
    "🇹🇼 台湾节点": /🇹🇼|台湾|台灣|Taiwan|Taipei|\bTW\b|台北/i,
    "🇯🇵 日本节点": /🇯🇵|日本|Japan|Tokyo|大阪|东京|\bJP\b/i,
    "🇺🇸 美国节点": /🇺🇸|美国|America|USA|洛杉矶|纽约|西雅图|凤凰城|\bUS\b/i,
    "🇸🇬 新加坡节点": /🇸🇬|新加坡|Singapore|狮城|\bSG\b/i
  };
  const ordinary = nodes.filter(n => !residential.test(n) && !premium.test(n));
  const notHK = ordinary.filter(n => !hk.test(n));
  const homes = nodes.filter(n => residential.test(n));
  const usHomes = homes.filter(n => region["🇺🇸 美国节点"].test(n));
  const test = (name, list) => ({name, type:"url-test", proxies:list, url:"https://www.gstatic.com/generate_204", interval:600, tolerance:50});
  const select = (name, list) => ({name,type:"select",proxies:list});
  const fallback = (name,list) => ({name,type:"fallback",proxies:list,url:"https://www.gstatic.com/generate_204",interval:600});
  const g = [];
  const names = new Set();
  const add = x => {g.push(x); names.add(x.name);};
  const activeRegion = [];
  for (const [name,re] of Object.entries(region)) {
    const list=ordinary.filter(n=>re.test(n));
    if(list.length){add(test(name,list));activeRegion.push(name);}
  }
  if (ordinary.length) {
    add(select("🌐 普通节点",ordinary));
    add(test("⚡ 普通自动",ordinary));
    add(fallback("🛟 普通故障转移",ordinary));
  }
  if(notHK.length) add(test("🌐 非香港自动",notHK));
  if(usHomes.length) add(test("🏠 美国家宽自动",usHomes));
  if(homes.length) add(select("🏠 全部家宽手动",homes));
  const valid=xs=>xs.filter((x,i)=> (x==="DIRECT"||x==="REJECT"||names.has(x)) && xs.indexOf(x)===i);
  const build=(name, options) => {const list=valid(options); if(list.length)add(select(name,list));};
  build("🚀 节点选择",["⚡ 普通自动","🌐 普通节点","🛟 普通故障转移",...activeRegion,"DIRECT"]);
  build("🤖 Claude 专用",["🏠 美国家宽自动","🏠 全部家宽手动","⚡ 普通自动","DIRECT"]);
  build("🤖 AI 服务",["🇺🇸 美国节点","🚀 节点选择","⚡ 普通自动","DIRECT"]);
  build("🔮 Polymarket",["🇺🇸 美国节点","🇯🇵 日本节点","🇹🇼 台湾节点","🇸🇬 新加坡节点","🌐 非香港自动","DIRECT"]);
  build("💱 Bybit",["🇯🇵 日本节点","🇺🇸 美国节点","🇹🇼 台湾节点","🇸🇬 新加坡节点","🌐 非香港自动","DIRECT"]);
  const special={
    "📹 油管视频":["🚀 节点选择","🇯🇵 日本节点","DIRECT"],
    "🔍 谷歌服务":["🇯🇵 日本节点","🚀 节点选择","DIRECT"],
    "Ⓜ️ 微软服务":["DIRECT","🚀 节点选择"],
    "📧 邮件服务":["⚡ 普通自动","DIRECT"],
    "🍏 苹果服务":["DIRECT","🚀 节点选择"],
    "📲 电报消息":["🚀 节点选择","DIRECT"],
    "🐱 代码托管":["🚀 节点选择","DIRECT"],
    "🏦 香港银行":["DIRECT","🇭🇰 香港节点"],
    "📈 券商服务":["🇭🇰 香港节点","DIRECT"],
    "🔒 国内服务":["DIRECT","🚀 节点选择"],
    "🌍 非中国":["⚡ 普通自动","🚀 节点选择","DIRECT"],
    "🐟 漏网之鱼":["⚡ 普通自动","🚀 节点选择","DIRECT"]
  };
  for(const [n,opts] of Object.entries(special))build(n,opts);
  const suffixes={
    "💱 Bybit":["bybit.com","bybitglobal.com","bybit-aws.com"],
    "🔮 Polymarket":["polymarket.com","polymarket.co","polymarket.us"],
    "🤖 Claude 专用":["claude.ai","claude.com","anthropic.com","claudeusercontent.com","claudemcpcontent.com","claude.app"],
    "🤖 AI 服务":["openai.com","chatgpt.com","oaistatic.com","oaiusercontent.com","perplexity.ai","poe.com"],
    "📹 油管视频":["youtube.com","youtu.be","googlevideo.com","ytimg.com"],
    "🔍 谷歌服务":["google.com","googleapis.com","gstatic.com"],
    "🐱 代码托管":["github.com","githubusercontent.com","gitlab.com"],
    "📲 电报消息":["telegram.org","t.me"],
    "Ⓜ️ 微软服务":["microsoft.com","windows.com"],
    "🍏 苹果服务":["apple.com","icloud.com"]
  };
  const rules=[];
  for(const [name,domains] of Object.entries(suffixes)) if(names.has(name)) for(const domain of domains) rules.push("DOMAIN-SUFFIX,"+domain+","+name);
  const oldRules=(config.rules||[]).filter(r=>typeof r==="string"&&!r.startsWith("MATCH,")&&!r.startsWith("FINAL,"));
  const last=names.has("🐟 漏网之鱼")?"🐟 漏网之鱼":"DIRECT";
  config["proxy-groups"]=[...(config["proxy-groups"]||[]).filter(x=>!names.has(x.name)),...g];
  config.rules=[...rules,...oldRules,"GEOIP,CN,DIRECT","MATCH,"+last];
  config.mode="rule";
  return config;
}
